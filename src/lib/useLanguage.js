import { useState, useEffect, useCallback } from 'react';
import { getTranslation, getLocalizedField, supportedLanguages } from './i18n';

export default function useLanguage() {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('netc-lang') || 'en';
  });

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    localStorage.setItem('netc-lang', newLang);
  }, []);

  useEffect(() => {
    const langInfo = supportedLanguages.find(l => l.code === lang);
    document.documentElement.setAttribute('dir', langInfo?.dir || 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const t = useCallback((key) => getTranslation(lang, key), [lang]);
  const tField = useCallback((item, field) => getLocalizedField(item, field, lang), [lang]);
  const isRTL = lang === 'ar';

  return { lang, setLang, t, tField, isRTL, supportedLanguages };
}