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
              
              <div className="flex items-center gap-2 text-gray-400">
                <span>Powered by</span>
                <span className="flex items-center gap-1.5 font-medium text-white">
                  <Image
                    src="/images/logo.jpeg"
                    alt="Global Experts"
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-full object-contain bg-white"
                  />
                  <span>Global Experts</span>
                </span>
              </div>

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
