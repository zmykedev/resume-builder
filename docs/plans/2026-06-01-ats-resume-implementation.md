# ATS-Compatible CV + Keyword Analyzer — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add ATS-compatible single-column resume output mode and job description keyword analyzer to the CV Maker React app.

**Architecture:** Approach A — Dual preview with integrated analyzer. CVPreview renders conditionally (Bonito 2-column vs ATS single-column). New KeywordAnalyzer component in the editor panel extracts keywords from a pasted JD and compares against CV content. New ATSPreview component handles the clean ATS layout.

**Tech Stack:** React 18, vanilla CSS, html2pdf.js, docx.js, file-saver

---

### Task 1: Update Data Model (`defaultData.js`)

**Files:**
- Modify: `src/data/defaultData.js`

**Step 1: Add new fields and rename summary → personalMotto**

Replace the `defaultData` export with the updated model:

```js
export const defaultData = {
  name: "Maikol Zapata Iriarte",
  role: "FullStack Developer",
  email: "zmaikol399@gmail.com",
  phone: "+569 81514796",
  location: "Santiago de Chile",
  birth: "24 Jul 1994",
  nationality: "Chilena",
  personalMotto: 'Meta: entregar las mejores soluciones informáticas. "Siempre puedes ser mejor que el día de ayer."',
  professionalSummary: "Desarrollador FullStack con experiencia en NestJS, React, TypeScript y PostgreSQL, especializado en APIs REST, Docker y CI/CD.",
  jobDescription: "",
  atsMode: false,
  languages: [
    { id: 1, name: "Español", level: "Nativo" },
    { id: 2, name: "Inglés", level: "Básico" },
  ],
  experience: [
    { id: 1, title: "FullStack Developer", company: "OTIC · Cámara Chilena de la Construcción", date: "Feb 2023 – Presente", bullets: ["Diseño e implementación de APIs en NestJS aplicando principios DRY y SOLID.", "Gestión de base de datos PostgreSQL con TypeORM; autenticación JWT con Passport y control de roles.", "Testing unitario e integración con Jest + Supertest.", "Automatización de despliegues con Docker y CI/CD (GitHub Actions / Azure Pipelines).", "Desarrollo de microfronts, interfaces responsive; gestión de estado con React Query.", "Trabajo colaborativo en equipos Agile (Scrum/Kanban) junto a QA y UX."] },
    { id: 2, title: "FullStack Developer", company: "Proyecte", date: "Dic 2022 – Dic 2023", bullets: ["Migración de proyecto en Streamlit a Flask con interfaz en React.", "Conexión con modelos de machine learning (YOLO) para procesamiento de datos.", "Diseño, implementación e integración de la interfaz con la lógica del sistema."] },
    { id: 3, title: "FullStack Developer", company: "Xbrein", date: "Dic 2021 – Dic 2022", bullets: ["Diseño y desarrollo de APIs según requerimientos del negocio; optimización de rendimiento y escalabilidad.", "Implementación de seguridad, validación y manejo de errores en las APIs.", "Documentación y mantenimiento de APIs para claridad del equipo."] },
  ],
  education: [
    { id: 1, title: "FullStack Developer", school: "Bootcamp Coding Dojo", date: "Jun 2021 – Oct 2021", bullets: ["Desarrollo de apps web con HTML, CSS, JavaScript y Python; Bootstrap y Git.", "Proyectos prácticos de frontend y backend; metodologías ágiles y trabajo en equipo.", "Web Fundamentals HTML, JS, CSS — Coding Dojo · Oct 2021", "Desarrollador FullStack Python — Coding Dojo · Oct 2021"] },
    { id: 2, title: "Version Control", school: "Meta", date: "Mar 2026", bullets: [] },
    { id: 3, title: "Programming with Javascript", school: "Meta", date: "Mar 2026", bullets: [] },
    { id: 4, title: "Introduction to Front-end Development", school: "Meta", date: "Dic 2025", bullets: [] },
  ],
  theme: "blue",
  skills: ["NestJS","React","TypeScript","PostgreSQL","TypeORM","JWT / Passport","Jest + Supertest","Docker","GitHub Actions","Azure Pipelines","React Query","Flask","Python","YOLO / ML","Scrum / Kanban","Git","Bootstrap","REST APIs"],
};
```

Note: `personalMotto` replaces the old `summary` field. `professionalSummary` is the new keyword-optimized summary. `jobDescription` is for the JD paste area. `atsMode` controls the preview toggle.

**Step 2: Verify the file saves correctly**

Run: verify the app still compiles. The old references to `data.summary` still exist — those get updated in subsequent tasks.

---

### Task 2: Create Keyword Matcher Utility

**Files:**
- Create: `src/utils/keywordMatcher.js`

**Step 1: Write the utility**

```js
// Spanish stopwords for filtering
const STOPWORDS = new Set([
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "en", "al",
  "a", "ante", "bajo", "con", "contra", "desde", "durante", "entre", "hacia",
  "hasta", "mediante", "para", "por", "según", "sin", "sobre", "tras", "que",
  "es", "son", "su", "sus", "o", "y", "e", "ni", "pero", "aunque", "como",
  "más", "muy", "tan", "cada", "todo", "todos", "tiene", "tener", "ser", "the",
  "a", "an", "and", "or", "in", "on", "of", "to", "for", "with", "is", "are",
  "be", "will", "you", "we", "they", "our", "your", "its", "at", "by", "from",
]);

// Tech skill patterns to detect
const TECH_PATTERNS = [
  /\b[A-Z][a-z]+(?:\.?[A-Z][a-z]+)+\b/g,  // PascalCase: ReactQuery, GitHubActions
  /\b[A-Z]{2,}\b/g,                          // Acronyms: API, JWT, CI/CD
  /\b[a-z]+(?:[A-Z][a-z]+)+\b/g,             // camelCase: typeORM (less common in JDs)
  /\b(?:REST(?:ful)?|API|SQL|NoSQL|JSON|XML|HTML|CSS|SaaS)\b/gi,
  /\b(?:AWS|GCP|Azure|Docker|Kubernetes|K8s|CI|CD|TDD|DDD|MVC|MVVM)\b/g,
];

// Known tech terms (lowercase for matching)
const TECH_DICT = new Set([
  "javascript", "typescript", "python", "java", "c#", ".net", "node.js", "node",
  "react", "angular", "vue", "next.js", "nextjs", "nest.js", "nestjs", "express",
  "django", "flask", "fastapi", "spring", "postgresql", "mysql", "mongodb",
  "redis", "graphql", "rest", "restful", "soap", "grpc", "docker", "kubernetes",
  "aws", "azure", "gcp", "terraform", "ansible", "jenkins", "github actions",
  "gitlab", "bitbucket", "git", "ci/cd", "agile", "scrum", "kanban", "jira",
  "confluence", "figma", "sketch", "tailwind", "bootstrap", "sass", "less",
  "webpack", "vite", "esbuild", "babel", "eslint", "prettier", "jest", "mocha",
  "cypress", "selenium", "playwright", "oauth", "jwt", "sso", "saml", "tdd",
  "microservicios", "microservices", "serverless", "lambda", "api gateway",
  "apache", "nginx", "linux", "unix", "bash", "powershell", "prisma", "typeorm",
  "sequelize", "mongoose", "redux", "zustand", "react query", "swr", "axios",
  "fetch", "yolo", "machine learning", "deep learning", "nlp", "ia", "ai",
]);

/**
 * Normalize a word for comparison: lowercase, remove accents, collapse whitespace
 */
function normalize(word) {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9+#./\-\s]/g, "")
    .trim();
}

/**
 * Strip trailing/leading punctuation from a word
 */
function cleanWord(w) {
  return w.replace(/^[.,;:!?()\[\]{}""''«»\s]+/, "")
          .replace(/[.,;:!?()\[\]{}""''«»\s]+$/, "");
}

/**
 * Extract keyword candidates from a job description text.
 * Returns an array of unique normalized keyword strings.
 */
export function extractKeywords(jdText) {
  if (!jdText || !jdText.trim()) return [];

  const normalized = jdText
    .replace(/<[^>]+>/g, " ")       // strip HTML tags
    .replace(/&[a-z]+;/gi, " ")     // strip HTML entities
    .replace(/\s+/g, " ")           // collapse whitespace
    .trim();

  const found = new Set();

  // 1. Extract via tech patterns (PascalCase, acronyms, camelCase)
  for (const pattern of TECH_PATTERNS) {
    pattern.lastIndex = 0;
    const matches = normalized.match(pattern) || [];
    for (const m of matches) {
      const n = normalize(m);
      if (n && n.length > 1 && !STOPWORDS.has(n)) found.add(n);
    }
  }

  // 2. Extract multi-word tech phrases (2-3 words)
  const words = normalized.split(/\s+/);
  for (let len of [3, 2]) {
    for (let i = 0; i <= words.length - len; i++) {
      const phrase = words.slice(i, i + len).join(" ");
      const clean = cleanWord(phrase);
      const n = normalize(clean);
      if (n && n.length > 3 && TECH_DICT.has(n) && !STOPWORDS.has(n)) {
        found.add(n);
      }
    }
  }

  // 3. Extract single words that match tech dictionary
  for (const w of words) {
    const clean = cleanWord(w);
    const n = normalize(clean);
    if (n && n.length > 1 && TECH_DICT.has(n) && !STOPWORDS.has(n)) {
      found.add(n);
    }
  }

  return [...found];
}

/**
 * Collect all text content from the CV data into a single string for matching.
 */
export function collectCVText(data) {
  const parts = [
    data.name || "",
    data.role || "",
    data.professionalSummary || "",
    data.personalMotto || "",
    ...(data.skills || []),
    ...(data.languages || []).map(l => `${l.name} ${l.level}`),
    ...(data.experience || []).flatMap(exp =>
      [exp.title, exp.company, ...(exp.bullets || [])]
    ),
    ...(data.education || []).flatMap(edu =>
      [edu.title, edu.school, ...(edu.bullets || [])]
    ),
  ];
  return parts.filter(Boolean).join(" ");
}

/**
 * Check if a keyword is present in a text corpus using fuzzy matching.
 * Normalizes both sides and handles common variations.
 */
function keywordMatches(keyword, corpus) {
  const k = normalize(keyword);
  const c = normalize(corpus);

  // Exact substring match after normalization
  if (c.includes(k)) return true;

  // Handle common variations
  const variations = [k];

  // Plural/singular (English: add/remove 's')
  if (k.endsWith("s")) variations.push(k.slice(0, -1));
  else variations.push(k + "s");

  // Hyphenated vs spaced (e.g., "ci/cd" vs "ci cd")
  variations.push(k.replace(/[\/\-]/g, " "));
  variations.push(k.replace(/[\/\-\s]+/g, "-"));
  variations.push(k.replace(/[\/\-\s]+/g, ""));

  // REST/RESTful equivalency
  if (k === "rest") variations.push("restful");
  if (k === "restful") variations.push("rest");
  if (k.includes("api")) {
    variations.push(k.replace("api", "apis"));
    variations.push(k.replace("api", "api rest"));
    variations.push(k.replace("api", "api restful"));
  }

  for (const v of variations) {
    if (c.includes(v)) return true;
  }

  return false;
}

/**
 * Suggest which CV section a missing keyword should be added to.
 */
function suggestSection(keyword) {
  const k = normalize(keyword);
  // Skills/tech → Habilidades
  if (TECH_DICT.has(k)) return "Habilidades";
  // Methodologies → Experiencia bullets
  if (["agile", "scrum", "kanban", "tdd", "ci/cd"].some(t => k.includes(t)))
    return "Experiencia (viñetas)";
  // Tools → Habilidades
  if (["docker", "git", "jenkins", "terraform"].some(t => k.includes(t)))
    return "Habilidades";
  // Languages → Habilidades or Perfil
  if (["javascript", "typescript", "python", "java"].some(t => k.includes(t)))
    return "Perfil Profesional o Habilidades";
  // Default
  return "Perfil Profesional";
}

/**
 * Main function: analyze a job description against CV data.
 * Returns { found, missing, coverage, suggestions }
 */
export function analyzeJobDescription(jdText, data) {
  const keywords = extractKeywords(jdText);
  const corpus = collectCVText(data);

  const found = [];
  const missing = [];

  for (const kw of keywords) {
    if (keywordMatches(kw, corpus)) {
      found.push(kw);
    } else {
      missing.push({ keyword: kw, suggest: suggestSection(kw) });
    }
  }

  const coverage = keywords.length > 0
    ? Math.round((found.length / keywords.length) * 100)
    : 0;

  return { found, missing, coverage };
}
```

**Step 2: Verify the module exports correctly**

No test framework configured — manual verification in browser console once integrated.

---

### Task 3: Create ATSPreview Component

**Files:**
- Create: `src/components/ATSPreview.jsx`

**Step 1: Write the ATS layout component**

```jsx
export default function ATSPreview({ data }) {
  const contactLine = [data.email, data.phone, data.location]
    .filter(Boolean).join("  |  ");

  return (
    <div id="cv-output" className="cv-ats">
      {/* Header */}
      <div className="cv-ats-header">
        <div className="cv-ats-name">{data.name}</div>
        <div className="cv-ats-role">{data.role}</div>
        {contactLine && <div className="cv-ats-contact">{contactLine}</div>}
      </div>

      {/* Professional Summary */}
      {data.professionalSummary && (
        <div className="cv-ats-section">
          <div className="cv-ats-heading">PERFIL PROFESIONAL</div>
          <div className="cv-ats-summary">{data.professionalSummary}</div>
        </div>
      )}

      {/* Experience */}
      {data.experience.length > 0 && (
        <div className="cv-ats-section">
          <div className="cv-ats-heading">EXPERIENCIA</div>
          {data.experience.map(job => (
            <div className="cv-ats-item" key={job.id}>
              <div className="cv-ats-item-head">
                <span className="cv-ats-item-title">
                  {job.title}{job.company ? ` — ${job.company}` : ""}
                </span>
                {job.date && <span className="cv-ats-item-date">{job.date}</span>}
              </div>
              {job.bullets.filter(Boolean).length > 0 && (
                <ul className="cv-ats-bullets">
                  {job.bullets.filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education.length > 0 && (
        <div className="cv-ats-section">
          <div className="cv-ats-heading">EDUCACIÓN</div>
          {data.education.map(ed => (
            <div className="cv-ats-item" key={ed.id}>
              <div className="cv-ats-item-head">
                <span className="cv-ats-item-title">
                  {ed.title}{ed.school ? ` — ${ed.school}` : ""}
                </span>
                {ed.date && <span className="cv-ats-item-date">{ed.date}</span>}
              </div>
              {ed.bullets.filter(Boolean).length > 0 && (
                <ul className="cv-ats-bullets">
                  {ed.bullets.filter(Boolean).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills.length > 0 && (
        <div className="cv-ats-section">
          <div className="cv-ats-heading">HABILIDADES TÉCNICAS</div>
          <div className="cv-ats-skills">
            {data.skills.join("  ·  ")}
          </div>
        </div>
      )}

      {/* Languages */}
      {data.languages.length > 0 && (
        <div className="cv-ats-section">
          <div className="cv-ats-heading">IDIOMAS</div>
          <div className="cv-ats-languages">
            {data.languages.map((l, i) => (
              <span key={l.id}>
                {l.name}{l.level ? ` (${l.level})` : ""}
                {i < data.languages.length - 1 ? "  ·  " : ""}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Task 4: Refactor CVPreview for Dual Mode

**Files:**
- Modify: `src/components/CVPreview.jsx`

**Step 1: Update CVPreview to accept atsMode and delegate to ATSPreview**

Replace the current CVPreview with:

```jsx
import ATSPreview from './ATSPreview';

export default function CVPreview({ data, themeColors, previewTheme, atsMode }) {
  // ATS mode: delegate to clean single-column layout
  if (atsMode) {
    return <ATSPreview data={data} />;
  }

  // Bonito mode: existing 2-column layout (unchanged except summary → personalMotto)
  const initials = data.name.trim().split(" ").slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
  const t = themeColors[previewTheme || data.theme] || themeColors.blue;
  const cvStyle = {
    "--blue-dark": t.dark,
    "--blue-mid": t.mid,
    "--blue-acc": t.acc,
    "--blue-light": t.light,
    "--blue-text": t.text,
    "--blue-muted": t.muted,
  };
  return (
    <div id="cv-output" style={cvStyle}>
      <div className="cv-sidebar">
        <div className="cv-avatar">{initials}</div>
        <div className="cv-name">{data.name}</div>
        <div className="cv-role">{data.role}</div>
        <hr className="cv-divider" />
        <div className="cv-s-block">
          <div className="cv-s-label">Contacto</div>
          {data.email && <div className="cv-s-item">{data.email}</div>}
          {data.phone && <div className="cv-s-item">{data.phone}</div>}
          {data.location && <div className="cv-s-item">{data.location}</div>}
        </div>
        {(data.professionalSummary || data.personalMotto) && (
          <div className="cv-s-block">
            <div className="cv-s-label">Perfil</div>
            {data.professionalSummary && <div className="cv-s-summary">{data.professionalSummary}</div>}
            {data.personalMotto && <div className="cv-s-summary" style={{ fontStyle: "italic", marginTop: data.professionalSummary ? 6 : 0 }}>"{data.personalMotto}"</div>}
          </div>
        )}
        {data.languages.length > 0 && (
          <div className="cv-s-block">
            <div className="cv-s-label">Idiomas</div>
            {data.languages.map(l => (
              <div className="cv-lang-row" key={l.id}>
                <span className="cv-lang-name">{l.name}</span>
                <span className="cv-lang-level">{l.level}</span>
              </div>
            ))}
          </div>
        )}
        {(data.birth || data.nationality) && (
          <div className="cv-s-block">
            <div className="cv-s-label">Datos</div>
            {data.birth && <div className="cv-s-item">Nacimiento: {data.birth}</div>}
            {data.nationality && <div className="cv-s-item">Nacionalidad: {data.nationality}</div>}
          </div>
        )}
      </div>

      <div className="cv-main">
        {data.experience.length > 0 && (
          <div className="cv-section">
            <div className="cv-m-label">Experiencia</div>
            {data.experience.map(job => (
              <div className="cv-job" key={job.id}>
                <div className="cv-job-head">
                  <div className="cv-job-title">{job.title}{job.company ? ` — ${job.company}` : ""}</div>
                  {job.date && <span className="cv-job-date">{job.date}</span>}
                </div>
                {job.bullets.filter(Boolean).length > 0 && (
                  <ul className="cv-bullets">
                    {job.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="cv-section">
            <div className="cv-m-label">Educación</div>
            {data.education.map(ed => (
              <div className="cv-job" key={ed.id}>
                <div className="cv-job-head">
                  <div className="cv-job-title">{ed.title}</div>
                  {ed.date && <span className="cv-job-date">{ed.date}</span>}
                </div>
                {ed.school && <div className="cv-job-co">{ed.school}</div>}
                {ed.bullets.filter(Boolean).length > 0 && (
                  <ul className="cv-bullets">
                    {ed.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div className="cv-section">
            <div className="cv-m-label">Habilidades Técnicas</div>
            <div className="cv-skills">
              {data.skills.map((sk, i) => <span className="cv-skill" key={i}>{sk}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

Key changes from original:
- Added `atsMode` prop destructuring
- Early return to `ATSPreview` when `atsMode` is true
- `data.summary` → `data.personalMotto` + `data.professionalSummary` in the sidebar Perfil section
- Rest of Bonito layout unchanged

---

### Task 5: Create KeywordAnalyzer Component

**Files:**
- Create: `src/components/KeywordAnalyzer.jsx`

**Step 1: Write the analyzer component**

```jsx
import { useState } from 'react';
import { analyzeJobDescription } from '../utils/keywordMatcher';

export default function KeywordAnalyzer({ data }) {
  const [jdText, setJdText] = useState(data.jobDescription || "");
  const [result, setResult] = useState(null);

  const handleAnalyze = () => {
    if (!jdText.trim()) {
      setResult({ error: "Pega una descripción de puesto para analizar." });
      return;
    }
    const analysis = analyzeJobDescription(jdText, data);
    if (analysis.found.length === 0 && analysis.missing.length === 0) {
      setResult({ error: "No se encontraron keywords técnicas en la descripción. Intenta con un texto más detallado." });
      return;
    }
    setResult(analysis);
  };

  return (
    <div className="field-group">
      <div className="group-title">Análisis de Puesto</div>

      <label>Descripción del puesto (JD)</label>
      <textarea
        className="jd-textarea"
        value={jdText}
        onChange={e => setJdText(e.target.value)}
        placeholder="Pega aquí la descripción del puesto para analizar la coincidencia con tu CV..."
        rows={6}
      />

      <button className="analyze-btn" onClick={handleAnalyze}>
        Analizar coincidencia
      </button>

      {result && !result.error && (
        <div className="kw-results">
          <div className="kw-coverage">
            <div className="kw-coverage-badge" style={{
              background: result.coverage >= 70 ? "#e8f5e9" : result.coverage >= 40 ? "#fff3e0" : "#fce4ec",
              color: result.coverage >= 70 ? "#2e7d32" : result.coverage >= 40 ? "#e65100" : "#c62828",
            }}>
              {result.coverage}% coincidencia
            </div>
            <span className="kw-coverage-text">
              {result.found.length} encontradas · {result.missing.length} faltantes
            </span>
          </div>

          {result.missing.length > 0 && (
            <div className="kw-section">
              <div className="kw-section-title missing">
                Faltantes ({result.missing.length})
              </div>
              <div className="kw-tags">
                {result.missing.map(m => (
                  <span key={m.keyword} className="kw-tag kw-tag--missing" title={`Sugerencia: añadir a "${m.suggest}"`}>
                    {m.keyword}
                    <span className="kw-tag-hint">→ {m.suggest}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.found.length > 0 && (
            <div className="kw-section">
              <div className="kw-section-title found">
                Encontradas ({result.found.length})
              </div>
              <div className="kw-tags">
                {result.found.map(kw => (
                  <span key={kw} className="kw-tag kw-tag--found">{kw}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {result && result.error && (
        <div className="kw-error">{result.error}</div>
      )}
    </div>
  );
}
```

---

### Task 6: Update Editor with New Fields + Analyzer

**Files:**
- Modify: `src/components/Editor.jsx`

**Step 1: Add professionalSummary field and KeywordAnalyzer to Editor**

The Editor needs:
- New `professionalSummary` field in "Datos Personales" (replacing the old summary label)
- Rename summary → personalMotto
- Add KeywordAnalyzer at the bottom

```jsx
import { useState } from 'react';
import TextField from './TextField';
import BulletList from './BulletList';
import RepeatingSection from './RepeatingSection';
import KeywordAnalyzer from './KeywordAnalyzer';

let nextId = 200;
const uid = () => ++nextId;

export default function Editor({ data, setData }) {
  const upd = (k, v) => setData(d => ({ ...d, [k]: v }));
  const updItem = (key, id, field, val) =>
    setData(d => ({ ...d, [key]: d[key].map(it => it.id === id ? { ...it, [field]: val } : it) }));
  const addItem = (key, item) => setData(d => ({ ...d, [key]: [...d[key], item] }));
  const removeItem = (key, id) => setData(d => ({ ...d, [key]: d[key].filter(it => it.id !== id) }));
  const updBullets = (key, id, bullets) =>
    setData(d => ({ ...d, [key]: d[key].map(it => it.id === id ? { ...it, bullets } : it) }));

  const [skillInput, setSkillInput] = useState("");

  return (
    <div className="editor-body">
      <div className="field-group">
        <div className="group-title">Datos Personales</div>
        <TextField label="Nombre completo" value={data.name} onChange={v => upd("name", v)} />
        <TextField label="Rol / Título profesional" value={data.role} onChange={v => upd("role", v)} />
        <div className="two-col">
          <TextField label="Email" value={data.email} onChange={v => upd("email", v)} />
          <TextField label="Teléfono" value={data.phone} onChange={v => upd("phone", v)} />
        </div>
        <div className="two-col">
          <TextField label="Ubicación" value={data.location} onChange={v => upd("location", v)} />
          <TextField label="Nacionalidad" value={data.nationality} onChange={v => upd("nationality", v)} />
        </div>
        <TextField label="Fecha de nacimiento" value={data.birth} onChange={v => upd("birth", v)} />
        <TextField
          label="Resumen Profesional (keywords)"
          value={data.professionalSummary}
          onChange={v => upd("professionalSummary", v)}
          multiline
          placeholder="Resumen profesional optimizado para ATS y búsquedas. Ej: Desarrollador FullStack con experiencia en..."
        />
        <TextField
          label="Lema personal (solo modo Bonito)"
          value={data.personalMotto}
          onChange={v => upd("personalMotto", v)}
          multiline
          placeholder="Cita o lema personal que aparece en la barra lateral del diseño bonito"
        />
      </div>

      {/* ... rest of Idiomas, Experiencia, Educación, Habilidades unchanged ... */}
      <div className="field-group">
        <div className="group-title">Idiomas</div>
        {data.languages.map(l => (
          <div className="repeating-item" key={l.id}>
            <div className="item-header">
              <span className="item-label">{l.name || "Idioma"}</span>
              <button className="remove-btn" onClick={() => removeItem("languages", l.id)}>×</button>
            </div>
            <div className="two-col">
              <input type="text" placeholder="Idioma" value={l.name} onChange={e => updItem("languages", l.id, "name", e.target.value)} />
              <input type="text" placeholder="Nivel" value={l.level} onChange={e => updItem("languages", l.id, "level", e.target.value)} />
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem("languages", { id: uid(), name: "", level: "" })}>+ Agregar idioma</button>
      </div>

      <RepeatingSection
        title="Experiencia"
        items={data.experience}
        emptyItem={{ title: "", company: "", date: "", bullets: [""] }}
        onAdd={item => addItem("experience", item)}
        onRemove={id => removeItem("experience", id)}
        renderItem={(item) => (
          <>
            <TextField label="Cargo" value={item.title} onChange={v => updItem("experience", item.id, "title", v)} />
            <div className="two-col">
              <TextField label="Empresa" value={item.company} onChange={v => updItem("experience", item.id, "company", v)} />
              <TextField label="Período" value={item.date} onChange={v => updItem("experience", item.id, "date", v)} />
            </div>
            <BulletList bullets={item.bullets} onChange={b => updBullets("experience", item.id, b)} />
          </>
        )}
      />

      <RepeatingSection
        title="Educación"
        items={data.education}
        emptyItem={{ title: "", school: "", date: "", bullets: [] }}
        onAdd={item => addItem("education", item)}
        onRemove={id => removeItem("education", id)}
        renderItem={(item) => (
          <>
            <TextField label="Título / Curso" value={item.title} onChange={v => updItem("education", item.id, "title", v)} />
            <div className="two-col">
              <TextField label="Institución" value={item.school} onChange={v => updItem("education", item.id, "school", v)} />
              <TextField label="Fecha" value={item.date} onChange={v => updItem("education", item.id, "date", v)} />
            </div>
            <BulletList bullets={item.bullets} onChange={b => updBullets("education", item.id, b)} />
          </>
        )}
      />

      <div className="field-group">
        <div className="group-title">Habilidades</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
          {data.skills.map((sk, i) => (
            <span key={i} style={{ background: "#E6F1FB", color: "#0C447C", borderRadius: 100, padding: "3px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 5, border: "0.5px solid #B5D4F4" }}>
              {sk}
              <span onClick={() => upd("skills", data.skills.filter((_, j) => j !== i))} style={{ cursor: "pointer", color: "#888", fontSize: 13 }}>✕</span>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
            placeholder="Agregar habilidad y presionar Enter..."
            style={{ marginBottom: 0 }}
            onKeyDown={e => {
              if (e.key === "Enter" && skillInput.trim()) {
                upd("skills", [...data.skills, skillInput.trim()]);
                setSkillInput("");
              }
            }} />
        </div>
      </div>

      {/* NEW: Keyword Analyzer */}
      <KeywordAnalyzer data={data} />
    </div>
  );
}
```

Note: The `KeywordAnalyzer` is placed at the bottom of the editor body since it's a supplementary tool. It receives the full `data` object so it can access all CV fields for analysis.

---

### Task 7: Update App.jsx with ATS Toggle

**Files:**
- Modify: `src/App.jsx`

**Step 1: Add atsMode state and toggle in the preview panel header**

Add the toggle to `App.jsx`. The changes are:
- Remove `loadingPdf`/`loadingDocx` state (keep as-is)
- Add `atsMode` state (default false)
- Pass `atsMode` to `CVPreview`
- Add toggle button in the preview panel header

```jsx
import { useState } from 'react';
import Editor from './components/Editor';
import CVPreview from './components/CVPreview';
import { defaultData, themeColors } from './data/defaultData';
import { exportPdf } from './utils/exportPdf';
import { exportDocx } from './utils/exportDocx';

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export default function App() {
  const [data, setData] = useState(defaultData);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [hoverTheme, setHoverTheme] = useState(null);
  const [atsMode, setAtsMode] = useState(false);
  const activeTheme = hoverTheme || data.theme;

  const handlePdf = async () => {
    setLoadingPdf(true);
    try { await exportPdf(data.name); }
    finally { setLoadingPdf(false); }
  };

  const handleDocx = async () => {
    setLoadingDocx(true);
    try { await exportDocx(data); }
    finally { setLoadingDocx(false); }
  };

  return (
    <div className="app">
      <div className="editor-panel">
        <div className="editor-header">
          <h1>CV Maker</h1>
          <div className="header-right">
            <div className="color-picker">
              <button className="color-btn" onClick={() => setShowColors(o => !o)} title="Color del tema">
                <svg className="color-btn-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0112 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 00-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 012.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"/>
                  <circle cx="6.5" cy="11.5" r="1.5" fill="white"/>
                  <circle cx="9.5" cy="7.5" r="1.5" fill="white"/>
                  <circle cx="14.5" cy="7.5" r="1.5" fill="white"/>
                </svg>
                <span className="color-dot" style={{ background: themeColors[activeTheme].acc, boxShadow: `0 0 6px ${themeColors[activeTheme].acc}80` }} />
                <span className="color-arrow">▾</span>
              </button>
              {showColors && (
                <>
                  <div className="color-backdrop" onClick={() => setShowColors(false)} />
                  <div className="color-dropdown">
                    {Object.entries(themeColors).map(([name, colors]) => (
                      <button
                        key={name}
                        className={`color-opt${data.theme === name ? " active" : ""}`}
                        style={{ background: colors.dark }}
                        title={name}
                        onMouseEnter={() => setHoverTheme(name)}
                        onMouseLeave={() => setHoverTheme(null)}
                        onClick={() => { setData(d => ({ ...d, theme: name })); setHoverTheme(null); setShowColors(false); }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <span className="header-badge">Editor</span>
          </div>
        </div>
        <Editor data={data} setData={setData} />
        <div className="editor-footer">
          <div className="download-row">
            <button className="download-btn" onClick={handlePdf} disabled={loadingPdf}>
              <DownloadIcon />
              {loadingPdf ? "Generando..." : "PDF"}
            </button>
            <button className="download-btn download-btn--docx" onClick={handleDocx} disabled={loadingDocx}>
              <DownloadIcon />
              {loadingDocx ? "Generando..." : "DOCX"}
            </button>
          </div>
        </div>
      </div>

      <div className="preview-panel">
        <div className="preview-header">
          <span className="preview-label">Vista previa · A4</span>
          <div className="ats-toggle">
            <button
              className={`ats-toggle-btn${!atsMode ? " active" : ""}`}
              onClick={() => setAtsMode(false)}
            >
              Bonito
            </button>
            <button
              className={`ats-toggle-btn${atsMode ? " active" : ""}`}
              onClick={() => setAtsMode(true)}
            >
              ATS
            </button>
          </div>
        </div>
        <CVPreview
          data={data}
          themeColors={themeColors}
          previewTheme={hoverTheme}
          atsMode={atsMode}
        />
      </div>
    </div>
  );
}
```

---

### Task 8: Add CSS for ATS Layout, Toggle, and Keyword Analyzer

**Files:**
- Modify: `src/App.css`

**Step 1: Append new styles**

Add these CSS blocks at the end of `App.css`:

```css
/* ===== PREVIEW HEADER WITH TOGGLE ===== */
.preview-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}
.preview-header .preview-label {
  margin-bottom: 0;
}

/* ===== ATS TOGGLE ===== */
.ats-toggle {
  display: flex;
  background: #e8edf3;
  border-radius: 6px;
  padding: 2px;
  gap: 2px;
}
.ats-toggle-btn {
  padding: 4px 14px;
  border: none;
  border-radius: 4px;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  color: #666;
  background: transparent;
  transition: all 0.15s;
}
.ats-toggle-btn.active {
  background: white;
  color: var(--blue-dark);
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.ats-toggle-btn:hover:not(.active) {
  color: var(--blue-mid);
}

/* ===== ATS LAYOUT STYLES ===== */
.cv-ats {
  width: 794px;
  min-height: 1123px;
  background: white;
  box-shadow: 0 4px 40px rgba(0,0,0,0.12);
  border-radius: 4px;
  padding: 2.5rem 2.8rem;
  font-family: Arial, Calibri, sans-serif;
  color: #1a1a1a;
  line-height: 1.5;
}

.cv-ats-header {
  text-align: center;
  margin-bottom: 1.4rem;
}
.cv-ats-name {
  font-family: Arial, Calibri, sans-serif;
  font-size: 18pt;
  font-weight: 700;
  color: #111;
  margin-bottom: 4px;
}
.cv-ats-role {
  font-family: Arial, Calibri, sans-serif;
  font-size: 12pt;
  color: #444;
  margin-bottom: 6px;
}
.cv-ats-contact {
  font-family: Arial, Calibri, sans-serif;
  font-size: 10pt;
  color: #555;
}

/* ATS Section headings */
.cv-ats-section {
  margin-bottom: 1.2rem;
}
.cv-ats-heading {
  font-family: Arial, Calibri, sans-serif;
  font-size: 11pt;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #333;
  border-bottom: 1px solid #ccc;
  padding-bottom: 3px;
  margin-bottom: 8px;
}
.cv-ats-summary {
  font-family: Arial, Calibri, sans-serif;
  font-size: 10pt;
  color: #333;
  line-height: 1.6;
}

/* ATS Items (experience, education entries) */
.cv-ats-item {
  margin-bottom: 10px;
}
.cv-ats-item-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 3px;
}
.cv-ats-item-title {
  font-family: Arial, Calibri, sans-serif;
  font-size: 11pt;
  font-weight: 700;
  color: #222;
}
.cv-ats-item-date {
  font-family: Arial, Calibri, sans-serif;
  font-size: 9.5pt;
  color: #555;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ATS Bullets */
.cv-ats-bullets {
  list-style: none;
  padding: 0 0 0 12px;
  margin-top: 4px;
}
.cv-ats-bullets li {
  font-family: Arial, Calibri, sans-serif;
  font-size: 10pt;
  line-height: 1.5;
  color: #444;
  position: relative;
  padding-left: 10px;
  margin-bottom: 2px;
}
.cv-ats-bullets li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #666;
}

/* ATS Skills */
.cv-ats-skills {
  font-family: Arial, Calibri, sans-serif;
  font-size: 10pt;
  color: #333;
  line-height: 1.6;
}

/* ATS Languages */
.cv-ats-languages {
  font-family: Arial, Calibri, sans-serif;
  font-size: 10pt;
  color: #333;
  line-height: 1.6;
}

/* ===== KEYWORD ANALYZER STYLES ===== */
.jd-textarea {
  width: 100%;
  min-height: 100px;
  resize: vertical;
  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  line-height: 1.5;
  padding: 8px 10px;
  border: 1px solid #dde1e7;
  border-radius: 6px;
  background: #fafbfc;
  color: #333;
  outline: none;
  transition: border 0.15s;
}
.jd-textarea:focus {
  border-color: var(--blue-acc);
  background: #fff;
}

.analyze-btn {
  width: 100%;
  padding: 9px;
  background: var(--blue-dark);
  color: white;
  border: none;
  border-radius: 6px;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.15s;
}
.analyze-btn:hover {
  background: var(--blue-mid);
}

/* Keyword Results */
.kw-results {
  margin-top: 12px;
}

.kw-coverage {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.kw-coverage-badge {
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}
.kw-coverage-text {
  font-size: 11px;
  color: #666;
}

.kw-section {
  margin-bottom: 10px;
}
.kw-section-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
}
.kw-section-title.missing {
  color: #c62828;
}
.kw-section-title.found {
  color: #2e7d32;
}

.kw-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.kw-tag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.kw-tag--missing {
  background: #fce4ec;
  color: #c62828;
  border: 0.5px solid #ef9a9a;
}
.kw-tag--found {
  background: #e8f5e9;
  color: #2e7d32;
  border: 0.5px solid #a5d6a7;
}
.kw-tag-hint {
  font-size: 9px;
  opacity: 0.7;
  font-style: italic;
}

.kw-error {
  margin-top: 10px;
  padding: 8px 12px;
  background: #fff3e0;
  border: 1px solid #ffe0b2;
  border-radius: 6px;
  font-size: 11px;
  color: #e65100;
}
```

---

### Task 9: Update Exports for ATS Mode

**Files:**
- Modify: `src/utils/exportDocx.js`
- Verify: `src/utils/exportPdf.js` (should work as-is)

**Step 1: Update DOCX export to handle ATS-style output**

Update `exportDocx.js` to use `professionalSummary` and produce a cleaner layout:

Key changes needed in `exportDocx.js`:
1. Replace `data.summary` references with `data.professionalSummary` (no quote marks, no italics)
2. The DOCX export already mostly produces a clean single-column format — minor adjustments

```js
import {
  Document, Packer, Paragraph, TextRun,
  AlignmentType, BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';

const DARK = "0C447C";
const MID = "185FA5";
const GRAY_MID = "555555";
const BLACK = "1a1a1a";

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 280, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "999999" },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: "Arial",
        size: 22,
        color: "333333",
        bold: true,
      }),
    ],
  });
}

function bulletItem(text) {
  return new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: "• ", color: "666666", font: "Arial", size: 20 }),
      new TextRun({ text, font: "Arial", size: 20, color: "444444" }),
    ],
  });
}

export async function exportDocx(data) {
  const children = [];

  // Name
  children.push(new Paragraph({
    spacing: { after: 40 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: data.name,
        font: "Arial",
        size: 36,
        bold: true,
        color: DARK,
      }),
    ],
  }));

  // Role
  children.push(new Paragraph({
    spacing: { after: 80 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: data.role.toUpperCase(),
        font: "Arial",
        size: 20,
        color: "555555",
        characterSpacing: 40,
      }),
    ],
  }));

  // Contact line
  const contactParts = [data.email, data.phone, data.location].filter(Boolean);
  if (contactParts.length) {
    children.push(new Paragraph({
      spacing: { after: 60 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: contactParts.join("  |  "),
          font: "Arial",
          size: 18,
          color: GRAY_MID,
        }),
      ],
    }));
  }

  // Birth / nationality
  const dataParts = [];
  if (data.birth) dataParts.push(`Nacimiento: ${data.birth}`);
  if (data.nationality) dataParts.push(`Nacionalidad: ${data.nationality}`);
  if (dataParts.length) {
    children.push(new Paragraph({
      spacing: { after: 80 },
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: dataParts.join("  |  "),
          font: "Arial",
          size: 18,
          color: GRAY_MID,
        }),
      ],
    }));
  }

  // Professional Summary (uses professionalSummary, no quote marks)
  if (data.professionalSummary) {
    children.push(sectionHeading("Perfil Profesional"));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: data.professionalSummary,
          font: "Arial",
          size: 20,
          color: BLACK,
        }),
      ],
    }));
  }

  // Languages
  if (data.languages.length > 0) {
    children.push(sectionHeading("Idiomas"));
    children.push(new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: data.languages.map(l => `${l.name}${l.level ? ` (${l.level})` : ""}`).join("  ·  "),
          font: "Arial",
          size: 20,
          color: BLACK,
        }),
      ],
    }));
  }

  // Experience
  if (data.experience.length > 0) {
    children.push(sectionHeading("Experiencia"));
    data.experience.forEach(job => {
      children.push(new Paragraph({
        spacing: { before: 160, after: 20 },
        children: [
          new TextRun({
            text: job.title + (job.company ? ` — ${job.company}` : ""),
            font: "Arial",
            size: 22,
            bold: true,
            color: DARK,
          }),
        ],
      }));
      if (job.date) {
        children.push(new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: job.date, font: "Arial", size: 18, color: GRAY_MID }),
          ],
        }));
      }
      job.bullets.filter(Boolean).forEach(b => children.push(bulletItem(b)));
    });
  }

  // Education
  if (data.education.length > 0) {
    children.push(sectionHeading("Educación"));
    data.education.forEach(ed => {
      children.push(new Paragraph({
        spacing: { before: 160, after: 20 },
        children: [
          new TextRun({
            text: ed.title + (ed.school ? ` — ${ed.school}` : ""),
            font: "Arial",
            size: 22,
            bold: true,
            color: DARK,
          }),
        ],
      }));
      if (ed.date) {
        children.push(new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: ed.date, font: "Arial", size: 18, color: GRAY_MID }),
          ],
        }));
      }
      ed.bullets.filter(Boolean).forEach(b => children.push(bulletItem(b)));
    });
  }

  // Skills
  if (data.skills.length > 0) {
    children.push(sectionHeading("Habilidades Técnicas"));
    children.push(new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: data.skills.join("  ·  "),
          font: "Arial",
          size: 20,
          color: DARK,
        }),
      ],
    }));
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const filename = (data.name || "cv").toLowerCase().replace(/\s+/g, "_") + "_cv.docx";
  saveAs(blob, filename);
}
```

**Step 2: PDF export verification**

`exportPdf.js` uses `html2pdf` on `#cv-output` — both `CVPreview` (Bonito) and `ATSPreview` render into `#cv-output`, so it captures whichever layout is active. No code changes needed.

---

### Task 10: Build Verification

**Step 1: Install dependencies and build**

```bash
npm install
npm run build
```

Expected: Build succeeds with no errors.

**Step 2: Start dev server for manual testing**

```bash
npm run dev
```

Manual checks:
- Toggle between Bonito and ATS modes
- Verify all fields render in both modes
- Paste a JD into the analyzer and click "Analizar coincidencia"
- Export PDF in both modes
- Export DOCX in both modes
- Verify professionalSummary renders correctly

---

### Summary of Files

| Action | File |
|--------|------|
| Modify | `src/data/defaultData.js` |
| Create | `src/utils/keywordMatcher.js` |
| Create | `src/components/ATSPreview.jsx` |
| Create | `src/components/KeywordAnalyzer.jsx` |
| Modify | `src/components/CVPreview.jsx` |
| Modify | `src/components/Editor.jsx` |
| Modify | `src/App.jsx` |
| Modify | `src/App.css` |
| Modify | `src/utils/exportDocx.js` |
| Verify | `src/utils/exportPdf.js` |
