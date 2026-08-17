# TechMart - Electronics & Gadgets E-commerce Theme

A modern, professional Next.js e-commerce theme designed specifically for electronics and gadgets stores. Built with the latest web technologies and following the same API structure as template-two.

## 🎨 Design Features

- **Modern & Professional**: Clean, contemporary design optimized for electronics products
- **Responsive**: Fully responsive across all devices (mobile, tablet, desktop)
- **Sidebar Navigation**: Mobile-friendly sidebar menu with category navigation
- **Hero Slider**: Eye-catching hero section with image slideshow
- **Advanced Filters**: Comprehensive product filtering with sidebar on shop page
- **Product Cards**: Beautiful product cards with hover effects and quick actions
- **Smooth Animations**: Subtle transitions and animations for better UX

## 🚀 Key Features

### Home Page
- Hero slider with auto-play and navigation
- Featured categories grid
- Latest products showcase
- Hot deals section
- Brand showcase
- Fully responsive layout

### Shop/Collections Page
- Sidebar with advanced filters:
  - Categories
  - Price range slider
  - Brand selection
  - Rating filter
- Grid/List view toggle
- Sort options (Latest, Price, Popular, Rating)
- Pagination
- Mobile-friendly filter sidebar

### Product Details Page
- Large product images with gallery
- Product information and pricing
- Quantity selector
- Add to cart functionality
- Related products section
- Delivery information
- Wishlist option

### Shopping Cart
- Cart items management
- Quantity controls
- Remove items
- Order summary
- Proceed to checkout

### Checkout Page
- Contact information form
- Shipping address
- Payment method selection
- Order summary sidebar
- Secure checkout process

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.9
- **React**: 19
- **Styling**: Tailwind CSS 4.0
- **Icons**: React Icons (Feather Icons)
- **Notifications**: React Toastify
- **State Management**: React Context API + useReducer
- **Image Optimization**: Next.js Image component

## 📁 Project Structure

```
template-three/
├── app/
│   ├── (main)/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── collections/
│   │   ├── products/[slug]/
│   │   ├── layout.js
│   │   └── page.js
│   ├── _components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── HeroSlider.js
│   │   ├── ProductCard.js
│   │   ├── FeaturedCategories.js
│   │   ├── LatestProducts.js
│   │   ├── DealsSection.js
│   │   └── BrandsSection.js
│   ├── _context/
│   │   └── cartContext.js
│   ├── _reducer/
│   │   └── CartReducer.js
│   ├── _services/
│   │   └── encryption.js
│   ├── _utils/
│   │   ├── getSiteSettings.js
│   │   ├── getProduct.js
│   │   ├── getBanner.js
│   │   ├── categories.js
│   │   └── getAddManager.js
│   ├── layout.js
│   └── globals.css
├── .env
├── middleware.js
├── next.config.mjs
├── tailwind.config.js
├── package.json
└── README.md
```

## 🎯 API Integration

This theme uses the same API structure as template-two:

- `GET /api/{lang}/site-settings` - Site configuration
- `GET /api/{lang}/banners` - Hero banners
- `GET /api/{lang}/categories` - Product categories
- `GET /api/{lang}/products` - Product listing
- `GET /api/{lang}/products/{slug}` - Product details
- `GET /api/ads-manager-credentials` - Analytics & tracking

## 🎨 Color Scheme

- **Primary**: Blue tones (#0ea5e9) - Trust and technology
- **Accent**: Red tones (#ef4444) - Deals and highlights
- **Dark**: Slate tones (#0f172a) - Professional look
- **Background**: White and light grays

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com/api
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: { ... },
  accent: { ... },
  dark: { ... }
}
```

### Layout
- Header: `app/_components/Header.js`
- Footer: `app/_components/Footer.js`
- Main Layout: `app/(main)/layout.js`

### Components
All reusable components are in `app/_components/`

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## ✨ Unique Features

1. **Sidebar Menu**: Modern slide-in sidebar with categories
2. **Advanced Filters**: Comprehensive filtering system on shop page
3. **Hero Slider**: Auto-playing banner carousel
4. **Product Gallery**: Multi-image product viewer
5. **Sticky Cart Summary**: Fixed order summary on checkout
6. **Toast Notifications**: User-friendly feedback system
7. **Smooth Animations**: Professional transitions throughout

## 🔒 Security

- Middleware protection for dashboard routes
- Encrypted data handling
- Secure checkout process
- Input validation

## 📄 License

This theme follows the same structure and APIs as template-two for seamless integration.

## 🤝 Support

For issues or questions, please refer to the main project documentation.
