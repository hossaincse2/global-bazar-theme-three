import ShopContent from '../ShopContent';

export async function generateMetadata({ params }) {
  const category = (await params).category;
  const categoryName = category?.replace(/-/g, ' ')?.toUpperCase() || 'Category';

  return {
    title: `${categoryName} | TechMart Electronics`,
    description: `Shop our collection of ${category?.replace(/-/g, ' ') || 'items'} at TechMart. Find the best deals and latest products.`,
    keywords: `${category?.replace(/-/g, ' ')}, electronics, gadgets, shop online, best deals`,
  };
}

const CategoryPage = async ({ params }) => {
  const category = (await params).category;

  return <ShopContent category={category} />;
};

export default CategoryPage;
