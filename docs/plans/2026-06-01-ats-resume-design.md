# Diseño: CV ATS-Compatible + Analizador de Keywords

**Fecha**: 2026-06-01
**Enfoque**: A — Doble preview + analizador integrado

## Resumen

Extender la aplicación CV Maker para generar dos modos de salida:
- **Modo Bonito**: diseño actual de 2 columnas con sidebar de color (para humanos/LinkedIn)
- **Modo ATS**: diseño single-column, fuentes estándar, sin colores ni imágenes (para ATS y agentes de IA)

Además, añadir un analizador de keywords que compare el CV contra una descripción de puesto (JD) y sugiera mejoras.

---

## 1. Cambios en el Modelo de Datos

### Campos nuevos en `defaultData`:
- `professionalSummary` (string): Resumen profesional keyword-optimizado. Reemplaza al "Perfil" en modo ATS.
- `jobDescription` (string): JD pegado por el usuario — temporal, no se exporta.
- `missingKeywords` (array): Resultado del análisis `[{word, found}]` — calculado, no persiste.
- `atsMode` (boolean): Toggle de modo en el preview. Default: `false`.

### Campo renombrado:
- `summary` → `personalMotto`: La cita motivacional actual. Solo se muestra en modo Bonito (sidebar).

### Datos por defecto:
- `professionalSummary`: "Desarrollador FullStack con experiencia en NestJS, React, TypeScript y PostgreSQL, especializado en APIs REST, Docker y CI/CD."

---

## 2. Arquitectura de Componentes

```
App (atsMode state, jobDescription state)
 ├─ Editor
 │   ├─ Datos Personales (+ professionalSummary, personalMotto)
 │   ├─ KeywordAnalyzer (jobDescription → análisis)
 │   └─ ... (Idiomas, Experiencia, Educación, Habilidades)
 └─ Preview Panel
     ├─ Toggle: Bonito | ATS
     └─ CVPreview (recibe atsMode)
         ├─ [Bonito] → SidebarLayout + MainLayout (actual)
         └─ [ATS] → ATSLayout (single column, clean)
```

### Archivos a modificar:
| Archivo | Cambio |
|---------|--------|
| `src/App.jsx` | Añade toggle ATS/Bonito, estado `atsMode`, pasa props |
| `src/components/CVPreview.jsx` | Refactor: renderizado condicional Bonito vs ATS |
| `src/components/Editor.jsx` | Añade grupo "Análisis de Puesto" + campo `professionalSummary` |
| `src/data/defaultData.js` | Nuevos campos y valores por defecto |
| `src/App.css` | Estilos layout ATS, toggle, panel keywords |
| `src/utils/exportPdf.js` | Soporte modo ATS |
| `src/utils/exportDocx.js` | Soporte modo ATS con `professionalSummary` |

### Archivos nuevos:
| Archivo | Propósito |
|---------|-----------|
| `src/components/ATSPreview.jsx` | Layout ATS puro (single-column, Arial, sin color) |
| `src/components/KeywordAnalyzer.jsx` | Panel: pega JD, analiza, muestra resultados |
| `src/utils/keywordMatcher.js` | Función pura: extrae keywords, compara, devuelve cobertura |

---

## 3. Layout ATS (Single-Column)

### Especificaciones:
- **Fuente**: Arial (fallback: Calibri) — sin fuentes decorativas
- **Sin columnas**: flujo vertical único
- **Sin colores de fondo**: fondo blanco puro, texto negro/gris oscuro
- **Sin íconos ni avatares**: el círculo con iniciales NO se renderiza
- **Sin barras laterales**: info de contacto migra al header
- **Encabezados estándar**: PERFIL PROFESIONAL, EXPERIENCIA, EDUCACIÓN, HABILIDADES TÉCNICAS, IDIOMAS
- **Skills como texto inline**: separadas por `·` (no pills de color)
- **Ancho**: 794px (A4) para consistencia con exportación

### Estructura visual:
```
┌─────────────────────────────────────┐
│ NOMBRE COMPLETO                     │  Arial 18pt bold
│ Desarrollador FullStack             │  Arial 12pt
│ email | teléfono | ubicación        │  Arial 10pt
│                                     │
│ PERFIL PROFESIONAL                  │  Arial 11pt bold upper, borde inf
│ professionalSummary text...         │  Arial 10pt
│                                     │
│ EXPERIENCIA                         │
│ Cargo — Empresa          Fecha      │
│ • bullet points...                  │
│                                     │
│ EDUCACIÓN                           │
│ Título — Institución     Fecha      │
│                                     │
│ HABILIDADES TÉCNICAS                │
│ Skill1 · Skill2 · Skill3 ...        │
│                                     │
│ IDIOMAS                             │
│ Idioma (Nivel) · ...                │
└─────────────────────────────────────┘
```

---

## 4. Analizador de Keywords

### Algoritmo (`keywordMatcher.js`):
1. **Extracción** del JD:
   - Skills técnicas (diccionario base + detección camelCase/PascalCase)
   - Palabras clave significativas (sustantivos compuestos, acrónimos)
   - Filtra stopwords en español
2. **Comparación** contra el CV completo (name, role, professionalSummary, experiencia.bullets, educación, skills)
3. **Resultado**: `{found[], missing[], coverage%, suggestions[]}`

### UI del analizador:
- Textarea para pegar JD
- Botón "Analizar coincidencia"
- Badge con % de cobertura
- Lista de keywords faltantes (rojo/naranja) con sugerencias de sección
- Keywords encontradas en verde

---

## 5. Edge Cases

| Caso | Manejo |
|------|--------|
| JD vacío al analizar | Mensaje: "Pega una descripción de puesto para analizar" |
| JD solo stopwords | "No se encontraron keywords técnicas en la descripción" |
| CV vacío | Muestra todas las keywords del JD como faltantes |
| Cambio de tema en modo ATS | Se ignora — siempre blanco/negro |
| Caracteres especiales en JD | Se normalizan HTML entities, se colapsan whitespaces |
| Variaciones de skills | Comparación difusa: normaliza guiones, plurales, mayúsculas |
| Fechas inconsistentes | Borde naranja sutil como advertencia visual (no bloqueante) |

---

## 6. Exportación

- **PDF**: `html2pdf` captura `#cv-output` automáticamente en el layout activo
- **DOCX**: Usa `professionalSummary` en modo ATS; fuente Arial/Calibri; sin formatos decorativos
- Ambos formatos disponibles en ambos modos
