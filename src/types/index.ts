export interface LanguageItem {
  id: number;
  name: string;
  level: string;
}

export interface ExperienceItem {
  id: number;
  title: string;
  company: string;
  date: string;
  bullets: string[];
}

export interface EducationItem {
  id: number;
  title: string;
  school: string;
  date: string;
  bullets: string[];
}

export type ThemeName = 'blue' | 'green' | 'red' | 'purple' | 'teal' | 'gray';

export interface CVData {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  birth: string;
  nationality: string;
  professionalSummary: string;
  jobDescription: string;
  atsMode: boolean;
  languages: LanguageItem[];
  experience: ExperienceItem[];
  education: EducationItem[];
  theme: ThemeName;
  skills: string[];
}

export interface ThemeColor {
  dark: string;
  mid: string;
  acc: string;
  light: string;
  text: string;
  muted: string;
}

export type ThemeColorsMap = Record<ThemeName, ThemeColor>;

export interface AnalysisMissingItem {
  keyword: string;
  suggest: string;
}

export interface AnalysisResult {
  found: string[];
  missing: AnalysisMissingItem[];
  coverage: number;
}

export interface AnalysisError {
  error: string;
}
