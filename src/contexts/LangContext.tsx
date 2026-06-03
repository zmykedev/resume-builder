import { createContext, useContext } from 'react';
import { translations, detectLang } from '../i18n/translations';
import type { Lang, Translations } from '../i18n/translations';

interface LangContextValue {
  lang: Lang;
  t: Translations;
}

const detected = detectLang();

const LangContext = createContext<LangContextValue>({
  lang: detected,
  t: translations[detected],
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const lang = detectLang();
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
