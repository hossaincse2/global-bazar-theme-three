import { getSiteSettings } from '@/_utils/getSiteSettings';
import HeroSlider from '../_components/HeroSlider';
import AnnouncementBar from '../_components/AnnouncementBar';
import Advertisement from '../_components/Advertisement';
import LatestProducts from '../_components/LatestProducts';
import BrandProductsSection from '../_components/BrandProductsSection';
import ProductSliderSection from '../_components/ProductSliderSection';
import CompanyInfo from '../_components/CompanyInfo';

export async function generateMetadata() {
  const siteSetting = await getSiteSettings();
  const data = siteSetting?.data || {};

  return {
    title: data.title || 'TechMart - Electronics & Gadgets Store',
    description: data.footer_description || 'Shop the latest electronics and gadgets',
    keywords: 'electronics, gadgets, smartphones, laptops, accessories',
  };
}

const HomePage = async () => {
  return (
    <div>
      <HeroSlider />
      <AnnouncementBar />
      <LatestProducts />
      <Advertisement position="home_middle" />
      <BrandProductsSection />
      <ProductSliderSection title="Top Selling" sortBy="top_selling" />
      <ProductSliderSection title="Special Offers" sortBy="discount" bgColor="bg-gray-100/50" />
      <CompanyInfo />
    </div>
  );
};

export default HomePage;
