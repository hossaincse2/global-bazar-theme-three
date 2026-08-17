'use client';

import useDictionary from '@/_hooks/useDictionary';
import { createContext, useEffect, useState } from 'react';
import { getThemeOptions } from '../_utils/getThemeOptions';

export const ThemeOptionsContext = createContext({
  themeOptions: null,
  loading: true,
  error: null,
});

export const ThemeOptionsProvider = ({ children }) => {
  const [themeOptions, setThemeOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useDictionary();

  useEffect(() => {
    const fetchThemeOptions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getThemeOptions(language);
        setThemeOptions(response.data || null);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching theme options');
        setThemeOptions(null);
      } finally {
        setLoading(false);
      }
    };

    fetchThemeOptions();
  }, [language]);

  return (
    <ThemeOptionsContext.Provider value={{ themeOptions, loading, error }}>
      {children}
      {themeOptions && <ThemeStyles themeOptions={themeOptions} />}
    </ThemeOptionsContext.Provider>
  );
};

const ThemeStyles = ({ themeOptions }) => {
  const { base_colors, button_settings } = themeOptions || {};

  const primaryColor = base_colors?.primary_color || '#0ea5e9'; // fallback to default primary
  const secondaryColor = base_colors?.secondary_color || '#ff6b6b';
  const fontFamily = base_colors?.font_family || 'Inter, sans-serif';

  const btnBg = button_settings?.bg_color || primaryColor;
  const btnText = button_settings?.text_color || '#ffffff';
  const btnHoverBg = button_settings?.hover_bg_color || primaryColor;
  const btnHoverText = button_settings?.hover_text_color || '#ffffff';

  const cardBtnBg = button_settings?.card_bg_color || '#f8f9fa';
  const cardBtnText = button_settings?.card_text_color || primaryColor;
  const cardBtnHoverBg = button_settings?.card_hover_bg_color || primaryColor;
  const cardBtnHoverText = button_settings?.card_hover_text_color || '#ffffff';

  return (
    <style dangerouslySetInnerHTML={{
      __html: `
      :root {
        --primary-color: ${primaryColor};
        --color-primary-600: ${primaryColor};
        --color-secondary: ${secondaryColor};
        --font-sans: ${fontFamily};
        --btn-bg: ${btnBg};
        --btn-text: ${btnText};
        --btn-hover-bg: ${btnHoverBg};
        --btn-hover-text: ${btnHoverText};
        --card-btn-bg: ${cardBtnBg};
        --card-btn-text: ${cardBtnText};
        --card-btn-hover-bg: ${cardBtnHoverBg};
        --card-btn-hover-text: ${cardBtnHoverText};
      }
      
      body {
        font-family: var(--font-sans), sans-serif !important;
      }

      /* Dynamically overridden utility classes */
      .bg-primary-600 { background-color: var(--color-primary-600) !important; }
      .bg-primary-50 { background-color: var(--card-btn-bg) !important; }
      .text-primary-600 { color: var(--color-primary-600) !important; }
      .border-primary-600 { border-color: var(--color-primary-600) !important; }
      .hover\\:bg-primary-700:hover { filter: brightness(0.9); background-color: var(--color-primary-600) !important; }
      .hover\\:text-primary-700:hover { filter: brightness(0.9); color: var(--color-primary-600) !important; }
      
      /* Global Theme Button Styles */
      .theme-btn {
        background-color: var(--btn-bg) !important;
        color: var(--btn-text) !important;
        border-color: var(--btn-bg) !important;
      }
      .theme-btn:hover {
        background-color: var(--btn-hover-bg) !important;
        color: var(--btn-hover-text) !important;
        border-color: var(--btn-hover-bg) !important;
      }

      /* Product Card Button Styles */
      .theme-card-btn {
        background-color: var(--card-btn-bg) !important;
        color: var(--card-btn-text) !important;
        border-color: var(--card-btn-bg) !important;
      }
      .theme-card-btn:hover {
        background-color: var(--card-btn-hover-bg) !important;
        color: var(--card-btn-hover-text) !important;
        border-color: var(--card-btn-hover-bg) !important;
      }
    `}} />
  );
};
