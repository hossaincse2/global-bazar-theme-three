'use client';

import { useContext } from 'react';
import Image from 'next/image';
import { ThemeOptionsContext } from '../_context/ThemeOptionsContext';

const TrustedSection = () => {
    const { themeOptions, loading } = useContext(ThemeOptionsContext);

    if (loading) {
        return (
            <section className="py-8 bg-white border-y border-gray-100">
                <div className="container">
                    <div className="flex justify-center gap-8 md:gap-16 lg:gap-24 overflow-x-auto opacity-50">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex flex-col items-center gap-2 min-w-[100px] animate-pulse">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                                <div className="h-4 bg-gray-200 w-20 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const trustedItems = themeOptions?.trusted_section || [];

    // Filter out items that have neither logo nor text
    const validItems = trustedItems.filter(item => item.logo || item.text);

    if (validItems.length === 0) {
        return null; // Don't render if no trusted items are configured
    }

    return (
        <section className="py-8 lg:py-12 bg-white border-y border-gray-100">
            <div className="container">
                <div className="flex justify-center flex-wrap gap-8 md:gap-16 lg:gap-24">
                    {validItems.map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-3 min-w-[120px] group">
                            {item.logo && (
                                <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center p-2 rounded-xl transition-transform group-hover:-translate-y-1 group-hover:shadow-md bg-gray-50 border border-gray-100">
                                    <Image
                                        src={item.logo}
                                        alt={item.text || 'Trusted Partner'}
                                        fill
                                        className="object-contain p-3"
                                    />
                                </div>
                            )}
                            {item.text && (
                                <span className="text-sm md:text-base font-semibold text-gray-700 text-center max-w-[150px]">
                                    {item.text}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustedSection;
