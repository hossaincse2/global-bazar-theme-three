'use client';

import { getAdvertisement } from '@/_utils/getAdvertisement';
import { getSiteSettings } from '@/_utils/getSiteSettings';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Default advertisement image
const DEFAULT_AD_IMAGE = '/images/default-advertisement.gif';

const Advertisement = ({ position = 'home_top' }) => {
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDefault, setShowDefault] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adData, settings] = await Promise.all([
          getAdvertisement(position),
          getSiteSettings(),
        ]);
        
        // Check if advertisement module is enabled and has data
        if (settings?.data?.module?.includes('advertisement') && adData?.data?.length > 0) {
          setAdvertisements(adData.data);
        } else {
          setShowDefault(true);
        }
      } catch (error) {
        console.error('Error fetching advertisements:', error);
        setShowDefault(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [position]);

  if (loading) {
    return (
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="animate-pulse">
            <div className="h-[237px] bg-gray-200 rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  // Show default image if no advertisements from API
  if (showDefault || !advertisements.length) {
    return (
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1">
            <div className="relative block overflow-hidden rounded-lg bg-gray-100">
              <div className="relative h-[237px]">
                <Image
                  src={DEFAULT_AD_IMAGE}
                  alt="Advertisement"
                  fill
                  className="object-cover"
                  priority={position === 'home_top'}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-12 bg-gray-50">
      <div className="container">
        {advertisements.map((ad) => {
          // Handle different block styles
          if (ad.block_style === 'block_1' && ad.images?.length > 0) {
            // Single large image
            return (
              <div key={ad.id} className="grid grid-cols-1">
                {ad.images.map((imageData, index) => (
                  <Link
                    key={index}
                    href={imageData.url || '#'}
                    className="relative block overflow-hidden rounded-lg bg-gray-100 hover:opacity-95 transition"
                    target={imageData.url ? '_blank' : '_self'}
                  >
                    <div className="relative h-[237px]">
                      <Image
                        src={imageData.image}
                        alt={imageData.alt || `Advertisement ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={position === 'home_top'}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            );
          }

          if (ad.block_style === 'block_2' && ad.images?.length >= 2) {
            // Two images side by side
            return (
              <div key={ad.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ad.images.slice(0, 2).map((imageData, index) => (
                  <Link
                    key={index}
                    href={imageData.url || '#'}
                    className="relative block overflow-hidden rounded-lg bg-gray-100 hover:opacity-95 transition"
                    target={imageData.url ? '_blank' : '_self'}
                  >
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={imageData.image}
                        alt={imageData.alt || `Advertisement ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={position === 'home_top' && index === 0}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            );
          }

          if (ad.block_style === 'block_3' && ad.images?.length >= 3) {
            // Three images
            return (
              <div key={ad.id} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ad.images.slice(0, 3).map((imageData, index) => (
                  <Link
                    key={index}
                    href={imageData.url || '#'}
                    className="relative block overflow-hidden rounded-lg bg-gray-100 hover:opacity-95 transition"
                    target={imageData.url ? '_blank' : '_self'}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={imageData.image}
                        alt={imageData.alt || `Advertisement ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={position === 'home_top' && index === 0}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            );
          }

          if (ad.block_style === 'block_4' && ad.images?.length >= 4) {
            // Four images grid
            return (
              <div key={ad.id} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ad.images.slice(0, 4).map((imageData, index) => (
                  <Link
                    key={index}
                    href={imageData.url || '#'}
                    className="relative block overflow-hidden rounded-lg bg-gray-100 hover:opacity-95 transition"
                    target={imageData.url ? '_blank' : '_self'}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={imageData.image}
                        alt={imageData.alt || `Advertisement ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={position === 'home_top' && index === 0}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            );
          }

          // Default: display all images in a responsive grid
          return (
            <div key={ad.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ad.images?.map((imageData, index) => (
                <Link
                  key={index}
                  href={imageData.url || '#'}
                  className="relative block overflow-hidden rounded-lg bg-gray-100 hover:opacity-95 transition"
                  target={imageData.url ? '_blank' : '_self'}
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={imageData.image}
                      alt={imageData.alt || `Advertisement ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={position === 'home_top' && index === 0}
                    />
                  </div>
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Advertisement;
