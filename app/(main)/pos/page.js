import { getSiteSettings } from '@/_utils/getSiteSettings';
import { Suspense } from 'react';
import PosHeader from './component/PosHeader';
import PosProductsList from './component/PosProductsList';

export async function generateMetadata() {
    // Fetch site settings with fallback
    const siteSetting = (await getSiteSettings('en')) || {};

    return {
        title: `${
            siteSetting?.data?.title || 'Default Site Title'
        } | Point of Sale`,
        description: `Manage sales, track transactions, and generate invoices with ${
            siteSetting?.data?.title || 'Default Site Title'
        }.`,
        keywords: `${
            siteSetting?.data?.keywords ||
            'point of sale, sales tracking, transaction management'
        }`,
        icons: {
            icon: siteSetting?.data?.fev_icon || '/default-icon.png',
            apple: siteSetting?.data?.fev_icon || '/default-icon.png',
        },
        openGraph: {
            title: siteSetting?.data?.title || 'Default Site Title',
            description:
                siteSetting?.data?.footer_description ||
                'Default description for point of sale page.',
            url: siteSetting?.data?.website || 'https://example.com/pos',
            type: 'website',
            images: [
                {
                    url: siteSetting?.data?.header_logo || '/default-logo.png',
                    width: 1200,
                    height: 630,
                    alt: 'Point of Sale Logo',
                },
            ],
        },
        twitter: {
            card: 'summary',
            title: siteSetting?.data?.title || 'Default Site Title',
            description:
                siteSetting?.data?.footer_description ||
                'Default description for point of sale page.',
            images: siteSetting?.data?.header_logo || '/default-logo.png',
        },
        alternates: {
            canonical: `${
                siteSetting?.data?.website || 'https://example.com'
            }/point-of-sale`,
        },
        robots: {
            index: true, // Allow indexing of the page
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            noarchive: false,
        },
        other: {
            'X-Robots-Tag': 'noindex, nofollow, noarchive', // If applicable
        },
    };
}


const POS = async () => {
    const siteSetting = await getSiteSettings('en');
    return (
        <div>
            <PosHeader logo={siteSetting.data.logo} />
            <Suspense fallback={<div></div>}>
                <PosProductsList />
            </Suspense>
        </div>
    );
};

export default POS;
