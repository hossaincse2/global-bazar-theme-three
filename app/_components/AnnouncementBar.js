'use client';

import { useEffect, useState, useContext } from 'react';
import { ThemeOptionsContext } from '../_context/ThemeOptionsContext';
import { FaApple } from 'react-icons/fa';
import { FiPackage, FiPercent, FiRepeat, FiTruck, FiShield } from 'react-icons/fi';

const DEFAULT_ICONS = [
  <FaApple key="apple" className="text-2xl text-black" />,
  <FiPackage key="package" className="text-2xl text-purple-600" />,
  <FiPercent key="percent" className="text-2xl text-yellow-500" />,
  <FiRepeat key="repeat" className="text-2xl text-gray-900" />,
  <FiTruck key="truck" className="text-2xl text-red-500" />,
  <FiShield key="shield" className="text-2xl text-green-500" />,
];

const AnnouncementBar = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const { themeOptions } = useContext(ThemeOptionsContext);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const { getAnnouncement } = await import('@/_utils/getAnnouncement');
        const announcementData = await getAnnouncement();
        setAnnouncement(announcementData?.data);
      } catch (error) {
        console.error('Error fetching announcement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  const themeAnnouncementText = themeOptions?.announcement_bar?.text;

  if (loading) return null;

  // Extract trusted items that actually have content
  const apiTrustedItems = (themeOptions?.trusted_section || []).filter(
    (item) => item.logo || item.text
  );

  return (
    <section className="bg-gray-50 py-4">
      <div className="container">
        {/* Marquee Bar (Only show if text exists) */}
        {themeAnnouncementText && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-4">
            <div className="py-2">
              <marquee className="text-sm text-gray-800 font-medium">
                <div dangerouslySetInnerHTML={{ __html: themeAnnouncementText }} />
              </marquee>
            </div>
          </div>
        )}

        {/* Trusted Section: only show when there is data */}
        {apiTrustedItems.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm px-4 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4 md:gap-2">
            {apiTrustedItems.map((item, index) => {
              const fallbackIcon = DEFAULT_ICONS[index] || <FiShield className="text-2xl text-gray-400" />;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-2xl flex-shrink-0">
                    {item.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.logo}
                        alt={item.text || 'Trusted'}
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          // On image error, swap to the fallback icon approach via hiding
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      fallbackIcon
                    )}
                  </div>
                  {item.text && (
                    <span className="text-[11px] lg:text-sm font-black text-gray-800 whitespace-nowrap uppercase tracking-tight">
                      {item.text}
                    </span>
                  )}
                  {index !== apiTrustedItems.length - 1 && (
                    <div className="hidden xl:block h-6 w-px bg-gray-100 ml-4 lg:ml-8" />
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default AnnouncementBar;
