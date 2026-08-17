'use client';

import useDictionary from '@/_hooks/useDictionary';
import { FiTool, FiMessageSquare, FiHome, FiSettings } from 'react-icons/fi';

const ServicesSection = () => {
  const { dictionary } = useDictionary();
  const serviceTexts = dictionary?.Services || {};

  const services = [
    {
      id: 1,
      icon: <FiTool className="text-2xl" />,
      title: serviceTexts.laptopFinder || 'Laptop Finder',
      description: serviceTexts.laptopFinderDesc || 'Find Your Laptop Easily',
      bgColor: 'bg-orange-500',
    },
    {
      id: 2,
      icon: <FiMessageSquare className="text-2xl" />,
      title: serviceTexts.raiseComplain || 'Raise a Complain',
      description: serviceTexts.raiseComplainDesc || 'Share your experience',
      bgColor: 'bg-orange-500',
    },
    {
      id: 3,
      icon: <FiHome className="text-2xl" />,
      title: serviceTexts.homeService || 'Home Service',
      description: serviceTexts.homeServiceDesc || 'Get expert help.',
      bgColor: 'bg-orange-500',
    },
    {
      id: 4,
      icon: <FiSettings className="text-2xl" />,
      title: serviceTexts.servicingCenter || 'Servicing Center',
      description: serviceTexts.servicingCenterDesc || 'Repair Your Device',
      bgColor: 'bg-orange-500',
    },
  ];

  return (
    <section className="py-6 bg-gray-50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service) => (
            <a
              key={service.id}
              href="#"
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-4 flex items-center gap-4"
            >
              <div className={`${service.bgColor} text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-dark-900 text-sm md:text-base truncate group-hover:text-primary-600 transition">
                  {service.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 truncate">
                  {service.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
