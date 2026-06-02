import type { CVData } from '../types';

export const defaultData: CVData = {
  name: "Maikol Zapata Iriarte",
  role: "FullStack Developer",
  email: "zmaikol399@gmail.com",
  phone: "+569 81514796",
  location: "Santiago de Chile",
  birth: "24 Jul 1994",
  nationality: "Chilena",
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
