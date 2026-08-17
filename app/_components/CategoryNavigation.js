'use client';

import { getAllCategories } from '@/_utils/getAllCategories';
import useDictionary from '@/_hooks/useDictionary';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiChevronRight, FiPlus } from 'react-icons/fi';

const CategoryNavigation = () => {
    const { language } = useDictionary();
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [activeSubCategory, setActiveSubCategory] = useState(null);

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

    return (
        <nav className="bg-black text-white relative">
            <div className="container">
                <ul className="flex flex-wrap items-center gap-2 md:gap-8 overflow-x-auto no-scrollbar py-2">
                    {categories.map((category) => (
                        <li
                            key={category.id}
                            className="group py-2"
                            onMouseEnter={() => {
                                setActiveCategory(category.id);
                                // Set first subcategory as active by default if available
                                if (category.sub_category?.length > 0) {
                                    setActiveSubCategory(category.sub_category[0].id);
                                } else {
                                    setActiveSubCategory(null);
                                }
                            }}
                            onMouseLeave={() => {
                                setActiveCategory(null);
                                setActiveSubCategory(null);
                            }}
                        >
                            <Link
                                href={`/collections/${category.slug}`}
                                className="text-sm md:text-base font-semibold hover:text-primary-400 transition-colors uppercase tracking-wide whitespace-nowrap"
                            >
                                {category.name}
                            </Link>

                            {/* Mega Menu Dropdown */}
                            {category.sub_category && category.sub_category.length > 0 && activeCategory === category.id && (
                                <div className="absolute left-0 right-0 top-full bg-white shadow-2xl border-t border-gray-100 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="container p-0">
                                        <div className="flex bg-white min-h-[300px] max-h-[500px]">
                                            {/* Left Column: Subcategories */}
                                            <div className="w-1/3 border-r border-gray-100 py-4 overflow-y-auto bg-gray-50/50">
                                                {category.sub_category.map((sub) => (
                                                    <div
                                                        key={sub.id}
                                                        className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-all ${activeSubCategory === sub.id
                                                            ? 'bg-white text-orange-500 font-bold'
                                                            : 'text-gray-700 hover:bg-white hover:text-orange-500'
                                                            }`}
                                                        onMouseEnter={() => setActiveSubCategory(sub.id)}
                                                    >
                                                        <Link href={`/collections/${sub.slug}`} className="flex-1 flex items-center gap-3 text-sm uppercase">
                                                            {sub.category_image && (
                                                                <div className="w-6 h-6 relative flex-shrink-0">
                                                                    <img
                                                                        src={sub.category_image}
                                                                        alt={sub.name}
                                                                        className={`w-full h-full object-contain ${activeSubCategory === sub.id ? '' : 'opacity-70 group-hover:opacity-100'}`}
                                                                    />
                                                                </div>
                                                            )}
                                                            <span>{sub.name}</span>
                                                        </Link>
                                                        {sub.sub_category && sub.sub_category.length > 0 && (
                                                            <FiPlus className={`text-xs ${activeSubCategory === sub.id ? 'text-orange-500' : 'text-gray-400'}`} />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Right Column: Child Categories (Grand-subcategories) */}
                                            <div className="w-2/3 py-6 px-8 overflow-y-auto bg-white border-l border-gray-50">
                                                {category.sub_category.find(s => s.id === activeSubCategory)?.sub_category?.length > 0 ? (
                                                    <div className="flex flex-col gap-6">
                                                        {category.sub_category
                                                            .find(s => s.id === activeSubCategory)
                                                            .sub_category.map((child) => (
                                                                <Link
                                                                    key={child.id}
                                                                    href={`/collections/${child.slug}`}
                                                                    className="flex items-center gap-2 text-gray-600 hover:text-orange-500 text-sm font-medium transition-colors uppercase tracking-tight group/child"
                                                                >
                                                                    <div className="w-1 h-1 bg-gray-300 rounded-full group-hover/child:bg-orange-500 transition-all" />
                                                                    <span>{child.name}</span>
                                                                </Link>
                                                            ))}
                                                    </div>
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-4">
                                                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center">
                                                            <FiChevronRight className="text-2xl" />
                                                        </div>
                                                        <p className="text-xs font-semibold uppercase tracking-widest">No detailed categories</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default CategoryNavigation;
