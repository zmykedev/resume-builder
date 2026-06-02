/**
 * Keyword Matcher Utility
 *
 * Extracts tech keywords from job descriptions, collects CV text,
 * and analyzes keyword coverage between JD and CV.
 *
 * Pure utility — no React dependencies.
 */

// ---------------------------------------------------------------------------
// Tech Dictionary
// ---------------------------------------------------------------------------
const TECH_DICTIONARY = [
  // Programming Languages
  "javascript", "typescript", "python", "java", "c#", "c++", "c", "ruby", "php",
  "go", "golang", "rust", "swift", "kotlin", "scala", "perl", "lua", "dart",
  "elixir", "clojure", "haskell", "r", "matlab", "solidity",
  "shell", "bash", "powershell", "zsh", "sql", "pl/sql", "t-sql",
  "html", "css", "sass", "scss", "less", "stylus", "xml", "json", "yaml",
  "markdown", "latex",

  // Frontend Frameworks & Libraries
  "react", "angular", "vue", "vue.js", "nextjs", "next.js", "nuxt", "svelte",
  "solid", "qwik", "remix", "gatsby", "jekyll", "hugo",
  "jquery", "redux", "react query", "axios", "swr", "zustand", "mobx",
  "tailwind", "bootstrap", "bulma", "foundation", "materialize",
  "webpack", "vite", "esbuild", "rollup", "parcel", "gulp", "grunt",
  "babel", "eslint", "prettier", "stylelint",
  "storybook", "material ui", "chakra ui", "shadcn", "ant design",
  "semantic ui", "react bootstrap", "nextui",
  "vanilla js", "vanilla javascript",

  // Backend Frameworks & Libraries
  "nestjs", "nest.js", "express", "express.js", "fastify", "koa", "hapi",
  "django", "flask", "fastapi", "spring", "spring boot", "laravel", "symfony",
  "rails", "ruby on rails", "asp.net", ".net", "dotnet", "blazor",
  "typeorm", "sequelize", "mongoose", "knex", "drizzle",
  "graphql", "apollo", "relay", "rest", "restful", "grpc", "soap",
  "swagger", "openapi", "postman", "insomnia",

  // ORMs / ODMs
  "prisma", "typeorm", "drizzle", "kysely", "sequelize", "mongoose",
  "entity framework", "hibernate", "doctrine",

  // Databases
  "postgresql", "postgres", "mysql", "mariadb", "mongodb", "redis",
  "sqlite", "oracle", "sql server", "cassandra", "dynamodb",
  "firebase", "supabase", "couchdb", "pouchdb", "neo4j",
  "elasticsearch", "influxdb", "timescaledb", "cockroachdb",
  "s3", "rds", "aurora", "redshift", "bigquery", "snowflake",

  // Cloud & DevOps
  "docker", "kubernetes", "k8s", "openshift", "nomad",
  "aws", "azure", "gcp", "google cloud", "oracle cloud", "digitalocean",
  "terraform", "ansible", "pulumi", "cloudformation", "helm",
  "jenkins", "github actions", "gitlab ci", "circleci", "travis ci",
  "git", "github", "gitlab", "bitbucket",
  "ci/cd", "ci cd", "devops", "devsecops", "serverless", "lambda",
  "cloudfront", "cloudflare", "fastly", "nginx", "apache", "caddy",
  "prometheus", "grafana", "datadog", "new relic", "splunk", "elk stack",
  "kibana", "logstash", "filebeat", "metricbeat",
  "vagrant", "packer", "consul", "vault",

  // Testing
  "jest", "cypress", "selenium", "playwright", "puppeteer",
  "mocha", "chai", "jasmine", "karma", "protractor",
  "supertest", "testing library", "vitest", "pytest", "unittest",
  "junit", "mockito", "sinon", "nock", "msw",
  "tdd", "bdd", "e2e", "integration test", "unit test",

  // Auth & Security
  "oauth", "oauth2", "jwt", "passport", "auth0", "keycloak",
  "openid", "saml", "sso", "ldap", "ssl", "tls",
  "cors", "csrf", "xss", "sqli", "owasp", "hsts", "csp",
  "bcrypt", "argon2", "helmet",

  // Architecture & Patterns
  "microservicios", "microservices", "microfrontends",
  "monolith", "monolithic", "soa", "event driven", "event sourcing",
  "cqrs", "clean architecture", "hexagonal architecture", "onion architecture",
  "solid", "dry", "yagni", "kiss", "domain driven design", "ddd",
  "mvc", "mvvm", "observer", "singleton", "factory", "dependency injection",

  // Methodologies & Project Management
  "agile", "scrum", "kanban", "sprint", "jira", "confluence",
  "trello", "notion", "asana", "linear", "clickup", "basecamp",
  "slack", "teams", "discord",

  // AI & Machine Learning
  "machine learning", "deep learning", "ia", "ai", "artificial intelligence",
  "neural network", "neural networks", "tensorflow", "pytorch",
  "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn",
  "yolo", "opencv", "llm", "gpt", "bert", "transformers",
  "nlp", "computer vision", "data science", "data engineering",
  "mlops", "langchain", "llamaindex", "vector database", "embeddings",
  "rag", "fine tuning", "prompt engineering",

  // Platforms & Tools
  "vscode", "visual studio", "intellij", "webstorm", "eclipse",
  "sonarqube", "sonarcloud", "sentry", "datadog", "logrocket",
  "kafka", "rabbitmq", "sqs", "sns", "pub/sub", "nats", "mqtt",
  "memcached", "celery", "sidekiq",
  "git flow", "trunk based", "monorepo", "nx", "turborepo",
  "lerna", "yarn", "npm", "pnpm",

  // Concepts & Abbreviations
  "api", "apis", "rest api", "rest apis", "sdk", "cli",
  "ui", "ux", "seo", "crm", "erp", "saas", "paas", "iaas",
  "spa", "pwa", "ssr", "ssg", "isr", "cms", "lms",
  "crud", "realtime", "websocket", "webhook", "web sockets",
  "responsive", "responsive design", "mobile first",
  "accesibilidad", "accessibility", "a11y",

  // Spanish tech terms
  "base de datos", "despliegue", "despliegues", "automatizacion",
  "seguridad", "rendimiento", "escalabilidad", "documentacion",
  "mantenimiento", "integracion", "implementacion", "desarrollo",
  "aplicacion", "aplicaciones", "interfaz", "usuario", "usuarios",
  "backend", "frontend", "fullstack", "full stack",
  "api rest", "api restful", "pruebas", "prueba",

  // Additional
  "optimizacion", "optimizar", "colaborativo", "colaboracion",
  "comunicacion", "liderazgo", "gestion", "planificacion",
  "analisis", "diseno", "desarrollador", "desarrolladora", "ingeniero",
  "version control", "control de versiones",
];

// Normalized dictionary lookup (lazy built on first use)
let _dictLookup = null;
function isKnownTech(term) {
  if (!_dictLookup) {
    _dictLookup = new Set(TECH_DICTIONARY);
  }
  return _dictLookup.has(term);
}

// ---------------------------------------------------------------------------
// Stopwords — Spanish + English
// ---------------------------------------------------------------------------
const STOPWORDS = new Set([
  // Spanish
  "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "en", "al",
  "con", "para", "por", "que", "es", "son", "su", "sus", "lo", "le", "les",
  "se", "no", "si", "ya", "como", "mas", "pero", "todo", "toda", "todos", "todas",
  "esta", "este", "estos", "estas", "entre", "era", "fue", "han", "has",
  "haber", "muy", "sin", "sobre", "tambien", "tras", "tu", "te", "me", "mi",
  "a", "e", "i", "o", "u", "y", "ni", "he", "ha", "has", "han", "hemos",
  "sea", "sean", "ser", "sido", "siendo", "estoy", "estas", "esta", "estamos",
  "estan", "este", "estes", "estemos", "esten", "tengo", "tienes", "tiene",
  "tenemos", "tienen", "tenga", "tengas", "tengamos", "tengan",
  "hago", "haces", "hace", "hacemos", "hacen", "haga", "hagas", "hagamos", "hagan",
  "puedo", "puedes", "puede", "podemos", "pueden", "pueda", "puedas", "podamos", "puedan",
  "voy", "vas", "va", "vamos", "van", "vaya", "vayas", "vayamos", "vayan",
  "soy", "eres", "somos",

  // English
  "the", "a", "an", "and", "or", "in", "on", "of", "to", "for", "with",
  "is", "are", "be", "will", "you", "we", "they", "our", "your", "its",
  "it", "at", "by", "as", "but", "from", "not", "so", "if", "all",
  "can", "has", "had", "have", "do", "does", "did", "may", "might",
  "shall", "should", "would", "could", "about", "into", "than", "then",
  "also", "just", "only", "each", "some", "any", "both", "other",
  "such", "very", "too", "up", "out", "off", "down", "here", "there",
  "when", "where", "who", "whom", "which", "what", "why", "how",
  "this", "that", "these", "those", "am", "been", "being",
  "during", "before", "after", "above", "below", "between", "through",
  "because", "since", "until", "while", "within", "without",

  // Common filler / meta words
  "experience", "experiencia", "trabajo", "trabajar", "anos", "ano",
  "habilidades", "skills", "educacion", "education", "formacion",
  "proyectos", "projects", "aplicando", "manejo", "uso",
  "nuevas", "nuevos", "nuevo", "nueva", "diferentes", "diferente",
  "incluyendo", "incluye", "incluyen", "ademas", "durante", "mediante",
  "parte", "equipo", "tiempo", "forma", "cada", "asi", "bien",
]);

// ---------------------------------------------------------------------------
// Helper: clean leading/trailing punctuation from a word token
// ---------------------------------------------------------------------------
function cleanWord(w) {
  return w.replace(
    /^[^a-zA-Z0-9\+#\.\-\/]+|[^a-zA-Z0-9\+#\.\-\/]+$/g,
    ""
  );
}

// ---------------------------------------------------------------------------
// Helper: normalize a word
//   - lowercase
//   - NFD decomposition + strip combining accent marks
//   - strip special chars except + # / . -
// ---------------------------------------------------------------------------
function normalize(word) {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s\+#\/\.\-]/g, "")
    .trim();
}

// ---------------------------------------------------------------------------
// Helper: generate fuzzy-match variations of a keyword
// ---------------------------------------------------------------------------
function generateVariations(keyword) {
  const normalized = normalize(keyword);
  if (!normalized) return [];

  const vars = new Set([normalized]);

  // --- separator variations ---
  // slash → space, hyphen
  if (normalized.includes("/")) {
    vars.add(normalized.replace(/\//g, " "));
    vars.add(normalized.replace(/\//g, "-"));
  }
  // hyphen → space, slash
  if (normalized.includes("-")) {
    vars.add(normalized.replace(/-/g, " "));
    vars.add(normalized.replace(/-/g, "/"));
  }
  // space → hyphen, slash
  if (normalized.includes(" ")) {
    vars.add(normalized.replace(/ /g, "-"));
    vars.add(normalized.replace(/ /g, "/"));
  }

  // --- plural / singular ---
  if (normalized.endsWith("s") && !normalized.endsWith("ss") && normalized.length > 2) {
    vars.add(normalized.slice(0, -1));
  } else if (normalized.length > 2 && !normalized.endsWith("s")) {
    vars.add(normalized + "s");
  }

  // --- REST / RESTful equivalency ---
  if (normalized === "rest") {
    vars.add("restful");
  } else if (normalized === "restful" || normalized.includes("restful")) {
    vars.add(normalized.replace("restful", "rest"));
  }

  // --- next.js / nextjs ---
  if (normalized.endsWith(".js") || normalized.endsWith(".ts")) {
    const withoutDot = normalized.replace(/\.(js|ts)$/, "");
    vars.add(withoutDot);
  }
  if (normalized.endsWith("js") || normalized.endsWith("ts")) {
    const withDot = normalized.replace(/(js|ts)$/, ".$1");
    vars.add(withDot);
  }

  return [...vars];
}

// ---------------------------------------------------------------------------
// Helper: check if a keyword matches somewhere in the corpus (fuzzy)
// ---------------------------------------------------------------------------
function keywordMatches(keyword, corpus) {
  const variations = generateVariations(keyword);
  const normalizedCorpus = normalize(corpus);

  return variations.some((variant) => normalizedCorpus.includes(variant));
}

// ---------------------------------------------------------------------------
// Helper: suggest which CV section a missing keyword belongs in
// ---------------------------------------------------------------------------
function suggestSection(keyword) {
  const kw = normalize(keyword);

  // Profile-level keywords
  const profileIndicators = [
    "experiencia", "experience", "especializado", "specialized",
    "apasionado", "passionate", "trayectoria", "profesional",
    "professional", "enfoque", "focus", "meta", "objetivo", "goal",
  ];
  if (profileIndicators.some((i) => kw.includes(i))) {
    return "Perfil Profesional";
  }

  // Experience-level keywords
  const expIndicators = [
    "microservicios", "microservices", "arquitectura", "architecture",
    "despliegue", "deployment", "migracion", "migration", "optimizacion",
    "optimization", "escalabilidad", "scalability", "rendimiento",
    "performance", "implementacion", "implementation", "integracion",
    "integration", "automatizacion", "automation", "liderazgo",
    "leadership", "coordinacion", "coordination", "gestion", "management",
    "colaborativo", "colaboracion", "trabajo en equipo", "teamwork",
    "lider", "leader", "supervision", "supervision",
  ];
  if (expIndicators.some((i) => kw.includes(i))) {
    return "Experiencia (viñetas)";
  }

  // Default: technical skills
  return "Habilidades";
}

// ===========================================================================
// Public API
// ===========================================================================

/**
 * Extract tech keywords from a job description text.
 *
 * @param   {string} jdText — Raw job description (may contain HTML)
 * @returns {string[]}      — Unique, normalized keyword list
 */
export function extractKeywords(jdText) {
  if (!jdText || typeof jdText !== "string") return [];

  // 1. Strip HTML tags and entities
  let text = jdText
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return [];

  const result = new Set();

  // ----------- Strategy 1: PascalCase patterns (e.g. ReactQuery, GitHubActions) -----------
  const pascalRe = /[A-Z][a-z]+[A-Z][a-zA-Z]*/g;
  let match;
  while ((match = pascalRe.exec(text)) !== null) {
    const parts = match[0].split(
      /(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/
    );
    const joined = parts.map((p) => normalize(p)).filter(Boolean).join(" ");
    if (isKnownTech(joined)) result.add(joined);
    parts.forEach((p) => {
      const n = normalize(p);
      if (n && isKnownTech(n) && !STOPWORDS.has(n)) result.add(n);
    });
  }

  // ----------- Strategy 2: Acronyms (API, JWT, CI/CD) -----------
  // Matches both simple (API) and compound (CI/CD) acronyms
  const acronymRe = /\b[A-Z]{2,}\b(?:\/\b[A-Z]{2,}\b)*/g;
  while ((match = acronymRe.exec(text)) !== null) {
    const n = normalize(match[0]);
    if (n && n.length >= 2 && !STOPWORDS.has(n)) {
      result.add(n);
    }
  }

  // ----------- Strategy 3: camelCase patterns (e.g. reactQuery, gitHubActions) -----------
  const camelRe = /[a-z]+[A-Z][a-zA-Z]*/g;
  while ((match = camelRe.exec(text)) !== null) {
    const parts = match[0].split(
      /(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/
    );
    const joined = parts.map((p) => normalize(p)).filter(Boolean).join(" ");
    if (isKnownTech(joined)) result.add(joined);
    parts.forEach((p) => {
      const n = normalize(p);
      if (n && isKnownTech(n) && !STOPWORDS.has(n)) result.add(n);
    });
  }

  // ----------- Strategy 4: Single-word dictionary matches -----------
  const tokens = text.split(/\s+/).map(cleanWord).filter(Boolean);
  tokens.forEach((w) => {
    const n = normalize(w);
    if (n && isKnownTech(n) && !STOPWORDS.has(n)) {
      result.add(n);
    }
  });

  // ----------- Strategy 5: Multi-word phrases (2-3 words) -----------
  for (let i = 0; i < tokens.length; i++) {
    for (let len = 2; len <= 3; len++) {
      if (i + len <= tokens.length) {
        const phrase = tokens
          .slice(i, i + len)
          .map((w) => normalize(w))
          .filter(Boolean)
          .join(" ");
        if (phrase && isKnownTech(phrase)) {
          result.add(phrase);
        }
      }
    }
  }

  return [...result].sort();
}

/**
 * Collect all relevant text from a CV data object into a single string.
 *
 * @param   {object} data — CV data (shape matching defaultData.js)
 * @returns {string}      — All text joined with spaces
 */
export function collectCVText(data) {
  if (!data || typeof data !== "object") return "";

  const parts = [];

  // Basic fields
  if (data.name) parts.push(data.name);
  if (data.role) parts.push(data.role);
  if (data.professionalSummary) parts.push(data.professionalSummary);
  if (data.personalMotto) parts.push(data.personalMotto);

  // Skills
  if (Array.isArray(data.skills)) {
    parts.push(data.skills.join(" "));
  }

  // Languages
  if (Array.isArray(data.languages)) {
    data.languages.forEach((lang) => {
      if (lang.name) parts.push(lang.name);
      if (lang.level) parts.push(lang.level);
    });
  }

  // Experience
  if (Array.isArray(data.experience)) {
    data.experience.forEach((exp) => {
      if (exp.title) parts.push(exp.title);
      if (exp.company) parts.push(exp.company);
      if (Array.isArray(exp.bullets)) {
        parts.push(exp.bullets.join(" "));
      }
    });
  }

  // Education
  if (Array.isArray(data.education)) {
    data.education.forEach((edu) => {
      if (edu.title) parts.push(edu.title);
      if (edu.school) parts.push(edu.school);
      if (Array.isArray(edu.bullets)) {
        parts.push(edu.bullets.join(" "));
      }
    });
  }

  return parts.filter(Boolean).join(" ");
}

/**
 * Analyze keyword coverage between a job description and a CV.
 *
 * @param   {string} jdText — Job description text
 * @param   {object} data   — CV data object
 * @returns {{ found: string[], missing: Array<{keyword: string, suggest: string}>, coverage: number }}
 */
export function analyzeJobDescription(jdText, data) {
  const keywords = extractKeywords(jdText);
  const cvText = collectCVText(data);

  const found = [];
  const missing = [];

  for (const keyword of keywords) {
    if (keywordMatches(keyword, cvText)) {
      found.push(keyword);
    } else {
      missing.push({
        keyword,
        suggest: suggestSection(keyword),
      });
    }
  }

  const coverage =
    keywords.length > 0
      ? Math.round((found.length / keywords.length) * 100)
      : 0;

  return { found, missing, coverage };
}
