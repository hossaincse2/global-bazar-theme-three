'use client';

import { ProductContext } from '@/_context/cartContext';
import { WishlistContext } from '@/_context/wishlistContext';
import { CompareContext } from '@/_context/compareContext';
import useDictionary from '@/_hooks/useDictionary';
import useSiteSetting from '@/_hooks/useSiteSetting';
import { ThemeOptionsContext } from '../_context/ThemeOptionsContext';
import useUser from '@/_hooks/useUser';
import { getAllProduct } from '@/_utils/getAllProduct';
import { getAllCategories } from '@/_utils/getAllCategories';
import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '@/_utils/formatNumber';
import { useContext, useRef, useState, useEffect } from 'react';
import { FiCheck, FiChevronDown, FiGlobe, FiLogOut, FiMenu, FiSearch, FiShoppingBag, FiShoppingCart, FiUser, FiX, FiHeart, FiBarChart2, FiChevronRight, FiGrid } from 'react-icons/fi';
import AuthModal from './AuthModal';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { state } = useContext(ProductContext);
  const { wishlistState } = useContext(WishlistContext);
  const { compareState } = useContext(CompareContext);
  const { themeOptions } = useContext(ThemeOptionsContext);
  const { language, changeLanguage, languages, dictionary } = useDictionary();
  const { siteSetting } = useSiteSetting();
  const { user, handleLogout } = useUser();
  const langRef = useRef(null);
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearch.trim()) {
        setIsSearching(true);
        try {
          const response = await getAllProduct(language, 'all', '', null, debouncedSearch, 1, 10, 'all', null, false);
          setSearchResults(response.data || []);
          setShowSearchResults(true);
        } catch (error) {
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };
    fetchSearchResults();
  }, [debouncedSearch, language]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories(language, true, false, true);
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [language]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) setIsLangOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setIsUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target) && mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) setShowSearchResults(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeSearchResults = () => { setShowSearchResults(false); setSearchQuery(''); };
  const handleSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) window.location.href = `/collections?search=${encodeURIComponent(searchQuery)}`; };
  const handleLanguageChange = (langCode) => { changeLanguage(langCode); setIsLangOpen(false); };

  const headerTexts = dictionary?.Header || {};
  const authTexts = dictionary?.Auth || {};
  const globalTexts = dictionary?.Global || {};
  const currency = siteSetting?.currency_icon || siteSetting?.currency || '৳';

  const SearchResultsDropdown = () => {
    if (!showSearchResults || !searchQuery.trim()) return null;
    return (
      <div className="absolute left-0 right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 max-w-2xl mx-auto">
        <p className="mb-3 text-sm text-gray-600">{globalTexts.searchResultsFor || 'Search results for'} <span className="font-semibold text-gray-900">"{searchQuery}"</span></p>
        {isSearching ? (
          <div className="py-4 text-center text-gray-500">{globalTexts.searching || 'Searching...'}</div>
        ) : searchResults.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[250px] overflow-y-auto">
            {searchResults.map((product) => (
              <li key={product.id}>
                <Link href={`/products/${product.slug}`} onClick={closeSearchResults} className="flex gap-3 p-2 rounded-lg hover:bg-gray-100 transition">
                  <div className="w-14 h-14 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                    <Image src={product.preview_image || '/images/no-available.svg'} alt={product.name} width={56} height={56} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.sale_price > 0 && <span className="font-semibold text-primary-600">{currency}{formatPrice(product.sale_price)}</span>}
                      {' '}<span className={product.sale_price > 0 ? 'line-through text-gray-400 text-xs' : 'font-semibold text-primary-600'}>{currency}{formatPrice(product.unit_price)}</span>
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-4 text-center text-gray-500">{globalTexts.noProductsFound || 'No products found'}</div>
        )}
      </div>
    );
  };

  const headerStyles = themeOptions?.header || {};
  const headerBg = headerStyles.bg_color || '#0ea5e9'; // fallback to primary 500 equivalent if needed
  const headerText = headerStyles.text_color || '#ffffff';

  return (
    <>
      <header className="shadow-md sticky top-0 z-50" style={{ backgroundColor: headerBg, color: headerText }}>
        <div className="container">
          <div className="flex items-center justify-between py-3 md:py-4 gap-4">
            <Link href="/" className="flex items-center flex-shrink-0">
              {siteSetting?.header_logo ? (
                <Image src={siteSetting.header_logo} alt={siteSetting?.title || 'Store'} width={140} height={40} className="h-8 min-[400px]:h-10 md:h-12 w-auto object-contain brightness-0 invert" />
              ) : (
                <span className="text-lg min-[400px]:text-xl md:text-2xl font-bold text-white truncate max-w-[120px] min-[400px]:max-w-none">{siteSetting?.title || 'Store'}</span>
              )}
            </Link>

            <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full" ref={searchRef}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => searchQuery.trim() && setShowSearchResults(true)} placeholder={headerTexts.searchPlaceholder || "Search for products..."} className="w-full px-4 py-2.5 md:py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm md:text-base" />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-600 hover:text-primary-700"><FiSearch className="text-xl" /></button>
                <SearchResultsDropdown />
              </div>
            </form>

            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="sm:hidden p-2 text-white hover:bg-primary-700 rounded-lg transition"><FiMenu className="text-2xl" /></button>

              {languages.length > 1 && (
                <div className="relative" ref={langRef}>
                  <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-1 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition text-sm font-medium">
                    <span className="uppercase">{language}</span>
                    <FiChevronDown className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isLangOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[150px] z-50">
                      {languages.map((lang) => (
                        <button key={lang.id} onClick={() => handleLanguageChange(lang.code)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-left">
                          <FiGlobe className="text-gray-400" />
                          <span className={`flex-1 ${language === lang.code ? 'font-semibold text-primary-600' : 'text-gray-700'}`}>{lang.name}</span>
                          {language === lang.code && <FiCheck className="text-primary-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* User Menu / Login Button - Desktop only */}
              {user ? (
                <div className="relative hidden md:block" ref={userMenuRef}>
                  <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-medium">
                    {user.avatar ? (
                      <Image src={user.avatar} alt={user.name} width={24} height={24} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <FiUser className="text-lg" />
                    )}
                    <span className="hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                    <FiChevronDown className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[200px] z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email || user.phone}</p>
                      </div>
                      <Link href={`/dashboard/user/${user.username}`} onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700">
                        <FiUser className="text-gray-400" />
                        {authTexts.profile || 'Profile'}
                      </Link>
                      <Link href="/dashboard/my-orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-gray-700">
                        <FiShoppingBag className="text-gray-400" />
                        {authTexts.myOrders || 'My Orders'}
                      </Link>
                      <button onClick={() => { handleLogout(); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition text-red-600">
                        <FiLogOut className="text-red-400" />
                        {authTexts.logout || 'Logout'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="hidden md:flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition font-medium">
                  <FiUser className="text-lg" /><span className="hidden lg:inline">{headerTexts.login || 'Login'}</span>
                </button>
              )}

              <Link href="/compare" className="relative p-2 text-white hover:bg-primary-700 rounded-lg transition hidden md:block" title={headerTexts.compare || 'Compare'}>
                <FiBarChart2 className="text-xl md:text-2xl" />
                {compareState?.compareItems?.length > 0 && <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">{compareState.compareItems.length}</span>}
              </Link>

              <Link href="/wishlist" className="relative p-2 text-white hover:bg-primary-700 rounded-lg transition hidden md:block" title={headerTexts.wishlist || 'Wishlist'}>
                <FiHeart className="text-xl md:text-2xl" />
                {wishlistState?.wishlistItems?.length > 0 && <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">{wishlistState.wishlistItems.length}</span>}
              </Link>

              <Link href="/cart" className="relative p-1.5 md:p-2 text-white hover:bg-primary-700 rounded-lg transition">
                <FiShoppingCart className="text-xl md:text-2xl" />
                {state.cartItems.length > 0 && <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center font-semibold">{state.cartItems.length}</span>}
              </Link>
            </div>
          </div>

          <form onSubmit={handleSearch} className="sm:hidden pb-3">
            <div className="relative" ref={mobileSearchRef}>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => searchQuery.trim() && setShowSearchResults(true)} placeholder={headerTexts.searchPlaceholder || "Search..."} className="w-full px-4 py-2.5 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm" />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary-600"><FiSearch className="text-xl" /></button>
              <SearchResultsDropdown />
            </div>
          </form>
        </div>
      </header>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-dark-900">{headerTexts.menu || 'Menu'}</h2>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><FiX className="text-2xl" /></button>
              </div>
              <nav className="space-y-1">
                {/* Categories List - Shown directly */}
                <div className="space-y-1">
                  {categories.map((category) => (
                    <div key={category.id} className="space-y-1">
                      <Link
                        href={`/collections/${category.slug}`}
                        className="block px-4 py-2 text-base text-gray-900 hover:bg-primary-50 hover:text-primary-600 font-bold transition-colors uppercase tracking-tight"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {category.name}
                      </Link>
                      {category.sub_category && category.sub_category.length > 0 && (
                        <div className="ml-4 border-l border-gray-100 pl-4 space-y-1">
                          {category.sub_category.map((sub) => (
                            <div key={sub.id} className="space-y-1">
                              <Link
                                key={sub.id}
                                href={`/collections/${sub.slug}`}
                                className="block px-4 py-1.5 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors"
                                onClick={() => setIsSidebarOpen(false)}
                              >
                                {sub.name}
                              </Link>
                              {sub.sub_category && sub.sub_category.length > 0 && (
                                <div className="ml-4 border-l border-gray-50 pl-4 space-y-1">
                                  {sub.sub_category.map((child) => (
                                    <Link
                                      key={child.id}
                                      href={`/collections/${child.slug}`}
                                      className="block px-4 py-1.5 text-xs text-gray-400 hover:text-primary-600 transition-colors"
                                      onClick={() => setIsSidebarOpen(false)}
                                    >
                                      {child.name}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {user && (
                  <div className="pt-4 border-t border-gray-50 mt-4 space-y-1">
                    <Link href={`/dashboard/user/${user.username}`} className="block px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors" onClick={() => setIsSidebarOpen(false)}>{authTexts.profile || 'Profile'}</Link>
                    <Link href="/dashboard/my-orders" className="block px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 font-medium transition-colors" onClick={() => setIsSidebarOpen(false)}>{authTexts.myOrders || 'My Orders'}</Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
