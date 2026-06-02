export const themeColors = {
  blue:   { dark: "#0C447C", mid: "#185FA5", acc: "#378ADD", light: "#E6F1FB", text: "#B5D4F4", muted: "#85B7EB" },
  green:  { dark: "#1B5E20", mid: "#2E7D32", acc: "#43A047", light: "#E8F5E9", text: "#C8E6C9", muted: "#A5D6A7" },
  red:    { dark: "#7F1D1D", mid: "#991B1B", acc: "#DC2626", light: "#FEE2E2", text: "#FECACA", muted: "#FCA5A5" },
  purple: { dark: "#4A148C", mid: "#6A1B9A", acc: "#7C3AED", light: "#F3E8FF", text: "#E9D5FF", muted: "#C4B5FD" },
  teal:   { dark: "#004D40", mid: "#00695C", acc: "#009688", light: "#E0F2F1", text: "#B2DFDB", muted: "#80CBC4" },
  gray:   { dark: "#374151", mid: "#4B5563", acc: "#6B7280", light: "#F3F4F6", text: "#E5E7EB", muted: "#D1D5DB" },
};

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
    { id: 2, title: "Version Control", school: "Meta", date: "Marzo 2026", bullets: [] },
    { id: 3, title: "Programming with Javascript", school: "Meta", date: "Marzo 2026", bullets: [] },
    { id: 4, title: "Introduction to Front-end Development", school: "Meta", date: "Dic 2025", bullets: [] },
  ],
  theme: "blue",
  skills: ["NestJS","React","TypeScript","PostgreSQL","TypeORM","JWT / Passport","Jest + Supertest","Docker","GitHub Actions","Azure Pipelines","React Query","Flask","Python","YOLO / ML","Scrum / Kanban","Git","Bootstrap","REST APIs"],
};
