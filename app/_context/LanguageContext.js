'use client';

import { getLanguage } from '@/_utils/getLanguage';
import { createContext, useEffect, useState } from 'react';

export const LanguageContext = createContext({
  language: 'en',
  dictionary: {},
  changeLanguage: () => {},
  languages: [],
  isHydrated: false
});

export const LanguageProvider = ({ children }) => {
  const [languages, setLanguages] = useState([]);
  const [language, setLanguage] = useState('en');
  const [dictionary, setDictionary] = useState({});
  const [translations, setTranslations] = useState({});
  const [isHydrated, setIsHydrated] = useState(false);

  const importTranslations = async (availableLanguages) => {
    const importedTranslations = {};

    for (const lang of availableLanguages) {
      try {
        let translation;
        try {
          translation = await import(`../dictionaries/${lang.code}.json`);
        } catch {
          translation = await import('../dictionaries/en.json');
        }
        importedTranslations[lang.code] = translation.default;
      } catch {
        importedTranslations[lang.code] = {};
      }
    }

    return importedTranslations;
  };


  useEffect(() => {
    const fetchLanguagesAndSetup = async () => {
      try {
        const languageData = await getLanguage();
        let fetchedLanguages = [];

        if (languageData.data && languageData.data.length > 0) {
          fetchedLanguages = languageData.data;
        } else {
          fetchedLanguages = [{ id: 1, name: 'English', code: 'en', is_default: true }];
        }

        setLanguages(fetchedLanguages);

        const defaultLanguage = fetchedLanguages.find((lang) => lang.is_default)?.code || 'en';
        const importedTranslations = await importTranslations(fetchedLanguages);
        setTranslations(importedTranslations);

        const storedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
        const validLanguage = fetchedLanguages.some((lang) => lang.code === storedLanguage)
          ? storedLanguage
          : defaultLanguage;

        setLanguage(validLanguage);
        setDictionary(importedTranslations[validLanguage] || {});
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        setLanguage('en');
        setDictionary({});
        setLanguages([{ id: 1, name: 'English', code: 'en', is_default: true }]);
      } finally {
        setIsHydrated(true);
      }
    };

    fetchLanguagesAndSetup();
  }, []);

  useEffect(() => {
    if (isHydrated && translations[language]) {
      setDictionary(translations[language]);
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', language);
      }
    }
  }, [language, isHydrated, translations]);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, dictionary, changeLanguage, languages, isHydrated }}>
      {children}
    </LanguageContext.Provider>
  );
};
