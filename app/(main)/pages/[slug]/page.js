import { getPageDetails } from '@/_utils/getPageDetails';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
    try {
        const response = await getPageDetails(params.slug);
        const page = response?.data;

        if (!page) {
            return { title: 'Page Not Found' };
        }

        return {
            title: page.meta_title || page.title,
            description: page.meta_description || '',
            keywords: page.meta_keywords ? page.meta_keywords.join(', ') : '',
        };
    } catch (error) {
        return { title: 'Error' };
    }
}

export default async function CMSPage({ params }) {
    let pageData = null;

    try {
        const response = await getPageDetails(params.slug);
        pageData = response?.data;
    } catch (error) {
        console.error('Error fetching page details:', error);
    }

    if (!pageData) {
        notFound();
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-16">
            {/* Breadcrumb Header */}
            <div className="bg-white border-b border-gray-200 py-6 mb-8">
                <div className="container">
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Link href="/" className="hover:text-primary-600 transition flex items-center gap-1">
                            <FiHome /> Home
                        </Link>
                        <FiChevronRight className="text-gray-400" />
                        <span className="text-gray-900 font-medium">{pageData.title}</span>
                    </nav>
                    <h1 className="text-3xl font-bold text-gray-900">{pageData.title}</h1>
                </div>
            </div>

            {/* Page Content */}
            <div className="container">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <div
                        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: pageData.content || 'No content provided.' }}
                    />
                </div>
            </div>
        </div>
    );
}
