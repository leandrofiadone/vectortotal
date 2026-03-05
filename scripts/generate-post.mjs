#!/usr/bin/env node
/**
 * vectortotal — generador automático de posts
 *
 * Uso:
 *   node scripts/generate-post.mjs <carpeta-con-screenshots>
 *
 * El usuario tira imágenes en una carpeta, el script detecta el tema solo.
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// ─── Config ───────────────────────────────────────────────────────────────────

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const BLOG_ROOT  = process.env.BLOG_ROOT  || path.resolve(__dirname, '..');
const POSTS_DIR  = path.join(BLOG_ROOT, 'src/content/posts');
const IMAGES_DIR = path.join(BLOG_ROOT, 'public/images');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GEMINI_API_KEY    = process.env.GEMINI_API_KEY;

if (!ANTHROPIC_API_KEY) throw new Error('Falta ANTHROPIC_API_KEY');
if (!GEMINI_API_KEY)    throw new Error('Falta GEMINI_API_KEY');

// ─── Prompt ───────────────────────────────────────────────────────────────────

const CLAUDE_PROMPT = `Sos un escritor técnico de seguridad informática. Analizá las screenshots y generá un post completo para el blog vectortotal.

FORMATO DE SALIDA: devolvé SOLO el MDX, sin texto extra antes ni después.

REGLAS:
- Idioma: español argentino, directo, sin vueltas
- Series disponibles: network-essentials | linux-fundamentals
- Tags disponibles: net, linux, fundamentos, web, crypto, osint
- Fecha de hoy: ${new Date().toISOString().split('T')[0]}

FRONTMATTER (exactamente este formato):
---
title: "Título descriptivo"
date: ${new Date().toISOString().split('T')[0]}
excerpt: "Una o dos oraciones que explican qué aprende el lector."
tags: ["tag1", "tag2"]
series: network-essentials
usefulFor:
  - { area: "fundamentos de red", pct: 90 }
  - { area: "análisis de tráfico", pct: 65 }
  - { area: "pentesting", pct: 55 }
draft: false
---

IMPORTS (solo los que uses):
import Callout from '../../components/Callout.astro';
import ProtoCard from '../../components/ProtoCard.astro';
import Step from '../../components/Step.astro';

COMPONENTES DISPONIBLES:
- <Callout type="tip|warning|danger|info">texto</Callout>
- <ProtoCard name="PROTO" description="..." layer="Red (L3)" facts={[{label:"RFC",value:"1234",highlight:true}]} />
- <Step n={1} title="Paso" label="badge">contenido</Step>  (último lleva last={true})

IMÁGENES: donde un diagrama ayude al lector, insertá:
<img src="/images/TOPIC/nombre.png" alt="descripción" style="border-radius: 4px; margin: 1.5rem 0;" />

Determiná vos el TOPIC: un slug corto en inglés del tema principal (ej: dns, tcp, tls, ssh).

Al final del MDX agregá este bloque con los diagramas que necesitás generar:
<!-- IMAGES_NEEDED
[
  {
    "filename": "nombre.png",
    "prompt": "Dark cyberpunk tech diagram, dark blue/black background, glowing cyan/teal accents, no text overlays. Visually explain: [descripción detallada del concepto en inglés]"
  }
]
-->

También al final, agregá el topic elegido:
<!-- TOPIC: dns -->`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function readImages(folderPath) {
  const exts = ['.png', '.jpg', '.jpeg', '.webp'];
  const files = fs.readdirSync(folderPath)
    .filter(f => exts.includes(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) throw new Error(`No hay imágenes en ${folderPath}`);

  console.log(`  📷 ${files.length} imagen(es) encontrada(s)`);
  return files.map(file => {
    const data = fs.readFileSync(path.join(folderPath, file));
    const ext  = path.extname(file).toLowerCase();
    return {
      filename:  file,
      base64:    data.toString('base64'),
      mediaType: (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'image/png',
    };
  });
}

function extractFrontmatterValue(mdx, key) {
  const match = mdx.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
  return match ? match[1].trim() : null;
}

function extractSlug(mdx) {
  const title = extractFrontmatterValue(mdx, 'title');
  if (!title) throw new Error('No se encontró title en el frontmatter');
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60);
}

function extractTopic(mdx) {
  const match = mdx.match(/<!-- TOPIC:\s*(\S+)\s*-->/);
  if (match) return match[1].toLowerCase();
  // Fallback: sacar topic del primer img src
  const imgMatch = mdx.match(/src="\/images\/([^/]+)\//);
  return imgMatch ? imgMatch[1] : 'general';
}

function extractImagePrompts(mdx) {
  const match = mdx.match(/<!-- IMAGES_NEEDED\s*([\s\S]*?)-->/);
  if (!match) return [];
  try { return JSON.parse(match[1].trim()); }
  catch { return []; }
}

function cleanMDX(mdx) {
  return mdx
    .replace(/<!-- IMAGES_NEEDED[\s\S]*?-->/g, '')
    .replace(/<!-- TOPIC:.*?-->/g, '')
    .trimEnd() + '\n';
}

// ─── APIs ─────────────────────────────────────────────────────────────────────

async function callClaude(images) {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  console.log('\n🤖 Claude analizando imágenes y generando post...');

  const response = await client.messages.create({
    model:      'claude-sonnet-4-5',
    max_tokens: 8192,
    messages: [{
      role: 'user',
      content: [
        ...images.map(img => ({
          type:   'image',
          source: { type: 'base64', media_type: img.mediaType, data: img.base64 },
        })),
        { type: 'text', text: CLAUDE_PROMPT },
      ],
    }],
  });

  return response.content[0].text;
}

async function callGeminiImagen(prompt, filename) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances:  [{ prompt }],
      parameters: { sampleCount: 1, aspectRatio: '16:9' },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini falló (${res.status}): ${err}`);
  }

  const data = await res.json();
  return Buffer.from(data.predictions[0].bytesBase64Encoded, 'base64');
}

// ─── File I/O ─────────────────────────────────────────────────────────────────

function writePost(slug, mdx) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  fs.writeFileSync(filePath, mdx, 'utf-8');
  return filePath;
}

function writeImage(topic, filename, buffer) {
  const dir = path.join(IMAGES_DIR, topic);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), buffer);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const folderPath = process.argv[2];
  if (!folderPath) {
    console.error('Uso: node scripts/generate-post.mjs <carpeta-con-screenshots>');
    process.exit(1);
  }

  const absoluteFolder = path.resolve(folderPath);
  if (!fs.existsSync(absoluteFolder)) {
    throw new Error(`La carpeta no existe: ${absoluteFolder}`);
  }

  console.log(`\n📁 Procesando: ${absoluteFolder}`);

  // 1. Leer imágenes
  const images = readImages(absoluteFolder);

  // 2. Claude genera el MDX
  const rawMDX = await callClaude(images);

  // 3. Extraer metadatos
  const topic        = extractTopic(rawMDX);
  const slug         = extractSlug(rawMDX);
  const imagePrompts = extractImagePrompts(rawMDX);
  const finalMDX     = cleanMDX(rawMDX);

  console.log(`\n📝 Slug:  ${slug}`);
  console.log(`🏷️  Topic: ${topic}`);
  console.log(`🖼️  Imágenes a generar: ${imagePrompts.length}`);

  // 4. Generar imágenes con Gemini
  if (imagePrompts.length > 0) {
    console.log('\n🎨 Generando imágenes...');
    for (const { filename, prompt } of imagePrompts) {
      try {
        console.log(`  → ${filename}`);
        const buffer = await callGeminiImagen(prompt, filename);
        writeImage(topic, filename, buffer);
        console.log(`  ✅ public/images/${topic}/${filename}`);
      } catch (e) {
        console.warn(`  ⚠️  ${e.message}`);
      }
    }
  }

  // 5. Escribir post
  writePost(slug, finalMDX);
  console.log(`\n✅ Post: src/content/posts/${slug}.mdx`);

  // 6. Git push
  console.log('\n🚀 Publicando...');
  execSync(`git -C "${BLOG_ROOT}" add -A`, { stdio: 'inherit' });
  execSync(`git -C "${BLOG_ROOT}" commit -m "feat: add post — ${slug}"`, { stdio: 'inherit' });
  execSync(`git -C "${BLOG_ROOT}" push`, { stdio: 'inherit' });

  console.log('\n🎉 Publicado! Vercel va a deployar en ~1 minuto.');
}

main().catch(err => {
  console.error('\n❌', err.message);
  process.exit(1);
});
