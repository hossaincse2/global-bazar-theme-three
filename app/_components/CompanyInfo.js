'use client';

import useSiteSetting from '@/_hooks/useSiteSetting';

const CompanyInfo = () => {
  const { siteSetting, loading } = useSiteSetting();

  const defaultContent = 'Leading Electronics & Gadgets Retail & Online Shop';

  if (loading) {
    return (
      <section className="py-12 bg-gray-100">
        <div className="container">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-300 rounded w-3/4" />
              <div className="h-4 bg-gray-300 rounded w-full" />
              <div className="h-4 bg-gray-300 rounded w-5/6" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const content = siteSetting?.meta_description || defaultContent;

  return (
    <section className="py-12 bg-gray-100">
      <div className="container">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-10">
          <div
            className="company-info-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </section>
  );
};

export default CompanyInfo;
