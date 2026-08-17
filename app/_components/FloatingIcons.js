'use client';

import useSiteSetting from '@/_hooks/useSiteSetting';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowUp, FiCopy, FiCheck, FiX } from 'react-icons/fi';

const FloatingIcons = () => {
  const { siteSetting, loading } = useSiteSetting();
  const [showScroll, setShowScroll] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.pageYOffset > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Check for whatsapp - try multiple possible field names
  const whatsappNumber = siteSetting?.whatsapp_id || siteSetting?.whatsapp || siteSetting?.whatsapp_number;
  const messengerPage = siteSetting?.fb_page_id || siteSetting?.messenger || siteSetting?.facebook_page_id;
  const phoneNumber = siteSetting?.phone_number || siteSetting?.phone || siteSetting?.contact_number;

  // Don't render anything while loading
  if (loading) return null;

  const hasAnyIcon = whatsappNumber || messengerPage || phoneNumber || showScroll;

  if (!hasAnyIcon) return null;

  return (
    <>
      <div className="fixed z-[99999] grid gap-3 bottom-20 md:bottom-6 right-4">
        {/* WhatsApp */}
        {whatsappNumber && (
          <Link
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Image
              src="/images/whatsapp.svg"
              alt="WhatsApp"
              width={48}
              height={48}
              className="w-full h-full"
            />
          </Link>
        )}

        {/* Messenger */}
        {messengerPage && (
          <Link
            href={`https://m.me/${messengerPage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Image
              src="/images/messenger.svg"
              alt="Messenger"
              width={48}
              height={48}
              className="w-full h-full"
            />
          </Link>
        )}

        {/* Phone Call */}
        {phoneNumber && (
          <button
            onClick={() => setShowPhone(true)}
            className="w-12 h-12 rounded-full shadow-lg hover:scale-110 transition-transform"
          >
            <Image
              src="/images/call.svg"
              alt="Call"
              width={48}
              height={48}
              className="w-full h-full"
            />
          </button>
        )}

        {/* Scroll to Top */}
        {showScroll && (
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all"
            aria-label="Scroll to top"
          >
            <FiArrowUp size={24} />
          </button>
        )}
      </div>

      {/* Phone Number Modal */}
      {showPhone && phoneNumber && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50" onClick={() => setShowPhone(false)}>
          <div className="bg-white rounded-xl p-6 mx-4 shadow-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Contact Number</h3>
              <button onClick={() => setShowPhone(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-4">
              <span className="text-xl font-bold text-gray-900">{phoneNumber}</span>
              <button
                onClick={handleCopyPhone}
                className="ml-3 p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                {copied ? <FiCheck size={20} /> : <FiCopy size={20} />}
              </button>
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                href={`tel:${phoneNumber}`}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-medium transition-colors"
              >
                Call Now
              </Link>
              <button
                onClick={() => setShowPhone(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingIcons;
