# Pipeline automático de posts — vectortotal

## Cómo funciona

```
Carpeta con screenshots
        ↓
   n8n detecta carpeta nueva
        ↓
   generate-post.mjs
   ├── Claude API (Vision) → genera MDX completo
   ├── Gemini Imagen → genera diagramas
   ├── Escribe archivos al blog
   └── git push → Vercel auto-deploya
```

## Setup inicial (una sola vez)

### 1. API keys

Copiá `.env.example` a `.env` y completá:

```bash
cp .env.example .env
```

```
ANTHROPIC_API_KEY=sk-ant-...   # console.anthropic.com
GEMINI_API_KEY=AIza...         # aistudio.google.com
```

### 2. Instalar dependencia del script

```bash
npm install @anthropic-ai/sdk
```

### 3. Levantar n8n con Docker

```bash
docker compose up -d
```

Abrí http://localhost:5678 — usuario: `admin`, contraseña: `vectortotal`

### 4. Importar el workflow

En n8n: **Workflows → Import from file** → seleccioná `scripts/n8n-workflow.json`

Activá el workflow con el toggle.

---

## Uso diario

1. Tomá screenshots de lo que querés documentar
2. Crealás una carpeta en `C:\Users\leanf\Downloads\VectorTotal\pendiente\` con el nombre del tema:
   ```
   pendiente/
   └── dns/
       ├── captura1.png
       ├── captura2.png
       └── wireshark.png
   ```
3. n8n detecta la carpeta nueva y arranca el pipeline automáticamente
4. En ~2 minutos el post está publicado en Vercel

---

## Uso manual (sin n8n)

También podés correr el script directamente:

```bash
node scripts/generate-post.mjs "C:/Users/leanf/Downloads/VectorTotal/pendiente/dns"
```

---

## Estructura de carpeta `pendiente`

```
pendiente/
├── dns/          ← tema del post = slug base
│   ├── *.png     ← todas las imágenes que querés que Claude analice
│   └── ...
├── tcp/
└── ssh/
```

El nombre de la carpeta se usa como topic para las rutas de imágenes (`/images/dns/`).
