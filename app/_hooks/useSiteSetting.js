'use client';

import { useContext } from 'react';
import { SiteSettingContext } from '../_context/SiteSettingContext';

const useSiteSetting = () => {
  const context = useContext(SiteSettingContext);
  
  if (!context) {
    return { siteSetting: {}, loading: true, error: null };
  }
  
  return context;
};

export default useSiteSetting;
