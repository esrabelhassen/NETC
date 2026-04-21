import { createContext, useContext } from 'react';
import useLanguage from './useLanguage';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const lang = useLanguage();
  return <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}