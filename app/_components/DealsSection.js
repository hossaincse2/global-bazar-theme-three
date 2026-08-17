'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

const DealsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Hot Deals This Week
            </h2>
            <p className="text-lg mb-6 text-primary-100">
              Save up to 50% on selected electronics and gadgets. Limited time offer!
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Shop Deals
              <FiArrowRight />
            </a>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">50%</div>
              <div className="text-sm">OFF</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="text-4xl font-bold mb-2">24h</div>
              <div className="text-sm">LEFT</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DealsSection;
