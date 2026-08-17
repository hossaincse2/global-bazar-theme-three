'use client';

import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { useContext } from 'react';
import { ThemeOptionsContext } from '../_context/ThemeOptionsContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone, FiTwitter, FiYoutube } from 'react-icons/fi';
import { getPages } from '@/_utils/getPages';

const Footer = () => {
  const { siteSetting } = useSiteSetting();
  const { themeOptions } = useContext(ThemeOptionsContext);
  const { dictionary } = useDictionary();
  const footerTexts = dictionary?.Footer || {};
  const headerTexts = dictionary?.Header || {};

  const [pages, setPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await getPages();
        setPages(response?.data || []);
      } catch (error) {
        console.error('Error fetching pages:', error);
      }
    };
    fetchPages();
  }, []);

  const currentYear = new Date().getFullYear();

  const footerStyles = themeOptions?.footer || {};
  const footerBg = footerStyles.bg_color || '#1a1a1a';
  const footerText = footerStyles.text_color || '#gray-300'; // Or just let classes handle fallback

  return (
    <>
      <footer style={{ backgroundColor: footerBg, color: footerText }}>
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
            {/* About / Logo */}
            <div>
              {siteSetting?.footer_logo ? (
                <Image src={siteSetting.footer_logo} alt={siteSetting?.title || 'Store'} width={160} height={50} className="h-12 w-auto object-contain mb-4 brightness-0 invert" />
              ) : (
                <h3 className="text-white text-xl font-bold mb-4">{siteSetting?.title || 'Store'}</h3>
              )}
              <p className="text-sm leading-relaxed mb-4">
                {siteSetting?.footer_description || 'Your trusted destination for quality products. Great prices and excellent service.'}
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                {siteSetting?.facebook_url && (
                  <a href={siteSetting.facebook_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition">
                    <FiFacebook />
                  </a>
                )}
                {siteSetting?.instagram_url && (
                  <a href={siteSetting.instagram_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition">
                    <FiInstagram />
                  </a>
                )}
                {siteSetting?.twitter_url && (
                  <a href={siteSetting.twitter_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition">
                    <FiTwitter />
                  </a>
                )}
                {siteSetting?.youtube_url && (
                  <a href={siteSetting.youtube_url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition">
                    <FiYoutube />
                  </a>
                )}
                {!siteSetting?.facebook_url && !siteSetting?.instagram_url && !siteSetting?.twitter_url && !siteSetting?.youtube_url && (
                  <>
                    <a href="#" className="w-10 h-10 bg-dark-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition"><FiFacebook /></a>
                    <a href="#" className="w-10 h-10 bg-dark-800 hover:bg-primary-600 rounded-full flex items-center justify-center transition"><FiInstagram /></a>
                  </>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">{footerTexts.quickLinks || 'Quick Links'}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/collections" className="hover:text-primary-400">{headerTexts.shop || 'Shop'}</Link></li>
                <li><a href="#" className="hover:text-primary-400">{footerTexts.aboutUs || 'About Us'}</a></li>
                <li><a href="#" className="hover:text-primary-400">{footerTexts.contactUs || 'Contact Us'}</a></li>
                <li><a href="#" className="hover:text-primary-400">{footerTexts.shippingInfo || 'Shipping Info'}</a></li>
                <li><a href="#" className="hover:text-primary-400">{footerTexts.returns || 'Returns'}</a></li>
              </ul>
            </div>

            {/* Customer Service / Pages */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">{footerTexts.customerService || 'Information'}</h3>
              <ul className="space-y-2 text-sm">
                {pages.length > 0 ? (
                  pages.map((page) => (
                    <li key={page.id}>
                      <Link href={`/pages/${page.slug}`} className="hover:text-primary-400 capitalize">
                        {page.title.toLowerCase()}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><Link href="/pages/privacy-policy" className="hover:text-primary-400">{footerTexts.privacyPolicy || 'Privacy Policy'}</Link></li>
                    <li><Link href="/pages/terms-and-conditions" className="hover:text-primary-400">{footerTexts.termsAndConditions || 'Terms & Conditions'}</Link></li>
                  </>
                )}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4">{footerTexts.contact || 'Contact Us'}</h3>
              <ul className="space-y-3 text-sm">
                {(siteSetting?.phone || siteSetting?.phone_number) && (
                  <li className="flex items-start justify-center md:justify-start gap-2">
                    <FiPhone className="mt-1 flex-shrink-0" />
                    <a href={`tel:${siteSetting.phone || siteSetting.phone_number}`} className="hover:text-primary-400">{siteSetting.phone || siteSetting.phone_number}</a>
                  </li>
                )}
                {siteSetting?.email && (
                  <li className="flex items-start justify-center md:justify-start gap-2">
                    <FiMail className="mt-1 flex-shrink-0" />
                    <a href={`mailto:${siteSetting.email}`} className="hover:text-primary-400">{siteSetting.email}</a>
                  </li>
                )}
                {siteSetting?.address && (
                  <li className="flex items-start justify-center md:justify-start gap-2 text-left">
                    <FiMapPin className="mt-1 flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: siteSetting.address.replace(/<\/?p>/g, '') }} />
                  </li>
                )}
                {!siteSetting?.phone_number && !siteSetting?.email && (
                  <>
                    <li className="flex items-start justify-center md:justify-start gap-2"><FiPhone className="mt-1 flex-shrink-0" /><span>+880 1234 567890</span></li>
                    <li className="flex items-start justify-center md:justify-start gap-2"><FiMail className="mt-1 flex-shrink-0" /><span>support@store.com</span></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-800">
          <div className="container py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p>&copy; {currentYear} {siteSetting?.title || 'Store'}. {footerTexts.copyRight || 'All rights reserved.'}</p>
              
              <a href="https://karbar.shop" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                <span>Powered by</span>
                <svg width="55" height="14" viewBox="0 0 55 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.6669 0C14.4224 0 14.2595 0.0812214 14.0965 0.203054C13.9336 0.324886 13.8928 0.52794 13.8928 0.771604V9.66535C13.8928 9.90901 13.9743 10.0715 14.0965 10.2339C14.2187 10.3963 14.4224 10.437 14.6669 10.437C14.9113 10.437 15.0743 10.3557 15.2372 10.2339C15.4002 10.1121 15.4409 9.90901 15.4409 9.66535V0.812214C15.4409 0.56855 15.3595 0.406107 15.2372 0.243664C15.115 0.0812208 14.8706 0 14.6669 0Z" fill="url(#paint0_linear_4907_1895)"/>
                  <path d="M42.33 0C42.0855 0 41.9226 0.0812214 41.7596 0.203054C41.5966 0.324886 41.5559 0.52794 41.5559 0.771604V9.66535C41.5559 9.90901 41.6374 10.0715 41.7596 10.2339C41.8818 10.3963 42.0855 10.437 42.33 10.437C42.5744 10.437 42.7374 10.3557 42.9003 10.2339C43.0633 10.1121 43.104 9.90901 43.104 9.66535V0.812214C43.104 0.56855 43.0225 0.406107 42.9003 0.243664C42.7781 0.0812208 42.5744 0 42.33 0Z" fill="url(#paint1_linear_4907_1895)"/>
                  <path d="M34.4265 0.486938C31.8192 0.486938 29.7415 2.55808 29.7415 5.15717C29.7415 7.75625 31.8192 9.8274 34.4265 9.8274C37.0339 9.8274 39.1116 7.75625 39.1116 5.15717C39.1116 2.55808 37.0339 0.486938 34.4265 0.486938ZM34.4265 8.20297C32.7562 8.20297 31.371 6.82221 31.371 5.15717C31.371 3.49213 32.7562 2.11137 34.4265 2.11137C36.0969 2.11137 37.482 3.49213 37.482 5.15717C37.482 6.82221 36.1376 8.20297 34.4265 8.20297Z" fill="url(#paint2_linear_4907_1895)"/>
                  <path d="M50.3147 0.486938C47.7074 0.486938 45.6296 2.55808 45.6296 5.15717C45.6296 7.75625 47.7074 9.8274 50.3147 9.8274C52.9221 9.8274 54.9998 7.75625 54.9998 5.15717C54.9998 2.55808 52.8813 0.486938 50.3147 0.486938ZM50.3147 8.20297C48.6444 8.20297 47.2592 6.82221 47.2592 5.15717C47.2592 3.49213 48.6444 2.11137 50.3147 2.11137C51.985 2.11137 53.3702 3.49213 53.3702 5.15717C53.3702 6.82221 51.985 8.20297 50.3147 8.20297Z" fill="url(#paint3_linear_4907_1895)"/>
                  <path d="M22.6113 0.486938C20.004 0.486938 17.9263 2.55808 17.9263 5.15717C17.9263 7.75625 20.004 9.8274 22.6113 9.8274C25.2187 9.8274 27.2964 7.75625 27.2964 5.15717C27.2964 2.55808 25.2187 0.486938 22.6113 0.486938ZM22.6113 8.20297C20.941 8.20297 19.5559 6.82221 19.5559 5.15717C19.5559 3.49213 20.941 2.11137 22.6113 2.11137C24.2817 2.11137 25.6668 3.49213 25.6668 5.15717C25.6668 6.82221 24.3224 8.20297 22.6113 8.20297Z" fill="url(#paint4_linear_4907_1895)"/>
                  <path d="M10.1849 3.93885C9.81828 3.93885 9.5331 4.10129 9.28866 4.34495C8.88127 2.15198 6.9665 0.486938 4.68507 0.486938C2.07773 0.486938 0 2.55808 0 5.15717C0 7.75625 2.07773 9.8274 4.68507 9.8274C7.00724 9.8274 8.88127 8.16236 9.28866 5.96938C9.49236 6.21305 9.81828 6.37549 10.1849 6.37549C10.8775 6.37549 11.4071 5.84755 11.4071 5.15717C11.4071 4.46679 10.8775 3.93885 10.1849 3.93885ZM4.68507 8.20297C3.01474 8.20297 1.62959 6.82221 1.62959 5.15717C1.62959 3.49213 3.01474 2.11137 4.68507 2.11137C6.3554 2.11137 7.74055 3.49213 7.74055 5.15717C7.74055 6.82221 6.39614 8.20297 4.68507 8.20297Z" fill="url(#paint5_linear_4907_1895)"/>
                  <path d="M50.3135 13.0768C50.9885 13.0768 51.5357 12.5313 51.5357 11.8585C51.5357 11.1856 50.9885 10.6401 50.3135 10.6401C49.6385 10.6401 49.0913 11.1856 49.0913 11.8585C49.0913 12.5313 49.6385 13.0768 50.3135 13.0768Z" fill="url(#paint6_linear_4907_1895)"/>
                  <path d="M22.6101 13.0768C23.2851 13.0768 23.8323 12.5313 23.8323 11.8585C23.8323 11.1856 23.2851 10.6401 22.6101 10.6401C21.9351 10.6401 21.3879 11.1856 21.3879 11.8585C21.3879 12.5313 21.9351 13.0768 22.6101 13.0768Z" fill="url(#paint7_linear_4907_1895)"/>
                  <defs>
                  <linearGradient id="paint0_linear_4907_1895" x1="0.127626" y1="5.24248" x2="55.6172" y2="5.24248" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E417FF"/>
                  <stop offset="1" stop-color="#13C9FF"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_4907_1895" x1="0.128404" y1="5.24248" x2="55.618" y2="5.24248" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E417FF"/>
                  <stop offset="1" stop-color="#13C9FF"/>
                  </linearGradient>
                  <linearGradient id="paint2_linear_4907_1895" x1="0.128519" y1="5.14572" x2="55.6181" y2="5.14572" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E417FF"/>
                  <stop offset="1" stop-color="#13C9FF"/>
                  </linearGradient>
                  <linearGradient id="paint3_linear_4907_1895" x1="0.128209" y1="5.14572" x2="55.6178" y2="5.14572" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E417FF"/>
                  <stop offset="1" stop-color="#13C9FF"/>
                  </linearGradient>
                  <linearGradient id="paint4_linear_4907_1895" x1="0.127856" y1="5.14572" x2="55.6174" y2="5.14572" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E417FF"/>
                  <stop offset="1" stop-color="#13C9FF"/>
                  </linearGradient>
                  <linearGradient id="paint5_linear_4907_1895" x1="0.127067" y1="5.14572" x2="55.6166" y2="5.14572" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E417FF"/>
                  <stop offset="1" stop-color="#13C9FF"/>
                  </linearGradient>
                  <linearGradient id="paint6_linear_4907_1895" x1="0.126984" y1="11.847" x2="55.6166" y2="11.847" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E417FF"/>
                  <stop offset="1" stop-color="#13C9FF"/>
                  </linearGradient>
                  <linearGradient id="paint7_linear_4907_1895" x1="0.126641" y1="11.847" x2="55.6162" y2="11.847" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#E417FF"/>
                  <stop offset="1" stop-color="#13C9FF"/>
                  </linearGradient>
                  </defs>
                </svg>
              </a>

              <div className="flex gap-6">
                <a href="#" className="hover:text-primary-400">{footerTexts.privacyPolicy || 'Privacy'}</a>
                <a href="#" className="hover:text-primary-400">{footerTexts.termsAndConditions || 'Terms'}</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
