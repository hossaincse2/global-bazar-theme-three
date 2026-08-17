'use client';

import { LanguageContext } from '@/_context/LanguageContext';
import { useContext } from 'react';

const useDictionary = () => {
  const context = useContext(LanguageContext);
  
  // Return defaults if context is not available yet
  if (!context) {
    return { 
      language: 'en', 
      dictionary: {}, 
      changeLanguage: () => {}, 
      languages: [] 
    };
  }
  
  const { language, dictionary, changeLanguage, languages } = context;
  return { language, dictionary, changeLanguage, languages };
};

export default useDictionary;
