# vectortotal — Blog tecnico de ciberseguridad y redes

## Que es

Blog personal de estudio y referencia sobre ciberseguridad, redes y sistemas. Cada post cubre un tema especifico con profundidad tecnica, capturas reales de trafico, comandos practicos y contexto de pentesting. El contenido viene principalmente de cursos en TryHackMe y estudio autodidacta.

## Que tipo de contenido se publica

Posts tecnicos que buscan ser **narrativos y comprensibles**. No es documentacion seca — cada tema se explica con metaforas, analogias y conexiones con otros temas ya cubiertos. Se prioriza que el lector entienda el "por que" y construya un modelo mental solido, no que memorice datos.

La estructura de cada post puede variar segun el tema. Algunos siguen un flujo de teoria → practica → pentesting, otros son mas libres. Se permite y se fomenta la creatividad en como se presenta el contenido.

## Tono y estilo

- Espanol rioplatense (vos/haces/tenes)
- Tecnico y directo, sin relleno ni formalismo academico
- Buenas narrativas: metaforas, conexiones entre temas, construir sobre lo que el lector ya sabe
- Ejemplos con IPs reales de laboratorio, capturas reales
- Contextualizar siempre hacia pentesting/CTFs cuando aplica

## Flujo de generacion de contenido

```
TryHackMe / material de estudio
        |
        v
  Notas crudas / resumen
        |
        v
  [Este proyecto Claude.ai]  -->  Estudio, comprension, evaluacion
        |
        v (cuando hay material listo)
  Prompt con contenido procesado
        |
        v
  [Claude Code CLI]  -->  Genera el post MDX, maneja estructura,
                          componentes, frontmatter, build
```

**Este proyecto** es el espacio de estudio e indagacion. **Claude Code CLI** es quien escribe en el blog. La separacion es intencional: aca se estudia y comprende, alla se publica.

## Stack tecnico (solo para contexto — no para uso directo)

El blog usa Astro (SSG) con MDX, componentes custom (diagramas, quizzes, fichas, tabs, etc.), code blocks con expressive-code y math con KaTeX. Esta info es solo para que tengas una idea del formato final — la implementacion la maneja exclusivamente el CLI.

## Que NO hace este proyecto

- No escribe archivos MDX directamente
- No decide frontmatter, tags, series, slugs ni estructura del blog (eso lo maneja el CLI)
- No necesita saber los nombres exactos de los posts publicados
