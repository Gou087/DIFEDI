# Setup JARVIS — guía paso a paso (sin experiencia en terminal)

Esta guía asume que nunca has abierto una terminal. Sigue cada paso en orden.
Son unos 20–30 minutos la primera vez. Después solo abres la terminal y escribes `claude`.

---

## Paso 1 · Instala Obsidian

1. Ve a **obsidian.md** en tu navegador
2. Descarga la versión para tu sistema (Windows o Mac)
3. Instala normalmente (siguiente → siguiente)
4. Abre Obsidian → clic en **"Create new vault"**
5. Nómbralo **JARVIS**
6. Elige una carpeta donde vivirá (ej. `Documentos/JARVIS`)
7. Listo — ya tienes la base del sistema

---

## Paso 2 · Crea la estructura de carpetas en Obsidian

Dentro de Obsidian, en el panel izquierdo:
- Clic derecho sobre el nombre del vault → **"New folder"**
- Crea estas carpetas una por una:

```
00-INBOX
01-CAPTURES
02-CONNECTIONS
03-BRIEFS
04-PUBLISHED
05-CLAUDE
```

Después crea las **subcarpetas** de `01-CAPTURES`:
- Clic derecho sobre `01-CAPTURES` → **"New folder"**
- Crea: `observations` / `reactions` / `patterns` / `questions` / `numbers`

Luego crea la subcarpeta `skills` dentro de `05-CLAUDE`:
- Clic derecho sobre `05-CLAUDE` → **"New folder"** → escribe `skills`

---

## Paso 3 · Copia los archivos de este paquete a tu vault

Tienes 6 archivos en esta carpeta:
- `CLAUDE.md` → va en `05-CLAUDE/`
- `process-inbox.md` → va en `05-CLAUDE/skills/`
- `weekly-connections.md` → va en `05-CLAUDE/skills/`
- `generate-brief.md` → va en `05-CLAUDE/skills/`
- `write-content.md` → va en `05-CLAUDE/skills/`

Copia y pega cada archivo en la carpeta correspondiente de tu vault.

**Importante:** Después de copiar `CLAUDE.md`, ábrelo en Obsidian y llena las partes entre corchetes:
- `## Muestras de mi voz` — pega fragmentos de tus apuntes o materiales de clase

---

## Paso 4 · Instala Node.js

Node.js es el motor que necesita Claude Code para instalarse. Solo lo tocas una vez.

1. Ve a **nodejs.org**
2. Descarga la versión **LTS** (el botón verde, "Recommended for most users")
3. Doble clic al instalador → siguiente → siguiente → instalar
4. Cuando termine, continúa al paso 5

---

## Paso 5 · Abre la terminal

**En Mac:**
- Presiona `Cmd + Espacio`
- Escribe `Terminal`
- Presiona Enter
- Se abre una ventana de texto negro/blanco — eso es la terminal

**En Windows:**
- Presiona la tecla Windows
- Escribe `PowerShell`
- Clic en "Windows PowerShell"

No te asustes. Solo es una ventana donde escribes comandos. Los pasos siguientes son copiar y pegar.

---

## Paso 6 · Verifica que Node.js quedó bien

En la terminal, escribe este comando y presiona Enter:

```
node --version
```

Debe responder algo como `v22.11.0`. Si ves un número, quedó bien.
Si ves un error, repite el Paso 4.

---

## Paso 7 · Instala Claude Code

En la terminal, copia y pega este comando y presiona Enter:

```
npm install -g @anthropic-ai/claude-code
```

Espera a que termine (puede tardar 1–2 minutos, verás texto pasando).
Cuando vuelva el prompt (`$` o `>`), verifica:

```
claude --version
```

Debe responder con un número de versión.

---

## Paso 8 · Entra a tu vault desde la terminal

Necesitas decirle a la terminal en qué carpeta estás.
Escribe este comando (ajusta el path al de tu vault real):

**Mac:**
```
cd ~/Documents/JARVIS
```

**Windows:**
```
cd C:\Users\TuNombre\Documents\JARVIS
```

> Si no sabes el path exacto: en Obsidian → clic derecho sobre el nombre del vault → "Reveal in Finder" (Mac) o "Show in Explorer" (Windows). La barra de dirección te muestra el path.

---

## Paso 9 · Login con tu suscripción de Claude (sin API key)

Escribe en la terminal:

```
claude
```

La primera vez te preguntará cómo autenticarte.
Elige la opción **"Log in with Claude"** (o "Sign in with Claude.ai").
Se abre el navegador — loguéate con tu cuenta normal de claude.ai.
Vuelve a la terminal y ya estarás conectado.

**Esto solo lo haces una vez.** La próxima vez solo escribes `claude` y entras directo.

---

## Paso 10 · Prueba que todo funciona

Con Claude Code abierto (después del paso 9), pega este prompt:

```
Lee mi CLAUDE.md completo y dime en un párrafo:
1. Qué entiendes de este vault y de mí (cursos, pilares, voz).
2. Cuál es tu rol exacto adentro del vault.
3. Qué estructura de carpetas vas a respetar y cuál es la regla más importante.

Sé específico. Si algo no quedó claro en el archivo, márcalo aparte.
```

Si la respuesta menciona el Politécnico, Teoría Contable y Metodología de Investigación — el sistema quedó. Si suena genérico, revisa que el CLAUDE.md esté en la carpeta correcta y que hayas llenado las secciones entre corchetes.

---

## Uso diario (después del setup)

Cada vez que quieras usar JARVIS:

```
cd ~/Documents/JARVIS    ← entra a tu vault
claude                   ← abre Claude Code
```

Desde ahí escribes en lenguaje natural lo que necesitas:
- `"procesa mi inbox"` — afila las capturas del día
- `"sesión de conexiones semanal"` — encuentra relaciones entre notas
- `"genera un brief para [tema] de clase"` — estructura una idea para enseñar
- `"escribe el brief de [tema]"` — produce el draft completo

---

## Si algo sale mal

| Problema | Solución |
|----------|----------|
| `node` no se reconoce | Reinstala Node.js del paso 4 y reinicia la terminal |
| `claude` no se reconoce | Cierra y vuelve a abrir la terminal, repite el paso 7 |
| Claude Code no encuentra las notas | Verifica que hiciste `cd` al path correcto de tu vault |
| El output suena genérico | Abre CLAUDE.md y agrega más detalles en "Mi voz" y "Muestras de mi voz" |
