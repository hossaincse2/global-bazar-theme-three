'use client';

import React, { useContext, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiShoppingCart, FiBarChart2 } from 'react-icons/fi';
import { CompareContext } from '@/_context/compareContext';
import { ProductContext } from '@/_context/cartContext';
import { formatPrice } from '@/_utils/formatNumber';
import useSiteSetting from '@/_hooks/useSiteSetting';
import useDictionary from '@/_hooks/useDictionary';
import { toast } from 'react-toastify';

export default function ComparePage() {
    const { compareState, compareDispatch } = useContext(CompareContext);
    const { dispatch } = useContext(ProductContext);
    const { siteSetting } = useSiteSetting();
    const { dictionary } = useDictionary();
    const currency = siteSetting?.currency_icon || siteSetting?.currency || '৳';
    const globalTexts = dictionary?.Global || {};

    const compareItems = compareState?.compareItems || [];

    const handleRemove = (product) => {
        compareDispatch({
            type: 'REMOVE_COMPARE',
            payload: product
        });
    };

    const handleClearAll = () => {
        compareDispatch({
            type: 'CLEAR_COMPARE'
        });
        toast.info('Comparison list cleared');
    };

    const handleAddToCart = (product) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: {
                id: product.id,
                name: product.name,
                slug: product.slug,
                image: product.preview_image,
                unit_price: product.unit_price,
                sale_price: product.sale_price,
                quantity: 1,
            },
        });
        toast.success('Added to cart!');
    };

    // Aggregate all unique specification groups and their attributes across selected products
    const aggregatedSpecs = useMemo(() => {
        const specMap = new Map(); // Map<GroupName, Map<AttrName, true>>

        compareItems.forEach(item => {
            const specData = item.specification || item.specifications;
            let specs = [];
            try {
                specs = Array.isArray(specData) ? specData : JSON.parse(specData || '[]');
            } catch (e) {
                console.error('Error parsing spec for', item.name, e);
            }

            specs.forEach(group => {
                if (!specMap.has(group.name)) specMap.set(group.name, new Map());
                group.attributes?.forEach(attr => {
                    specMap.get(group.name).set(attr.name, true);
                });
            });
        });

        const result = [];
        specMap.forEach((attrsMap, groupName) => {
            result.push({
                groupName,
                attributes: Array.from(attrsMap.keys())
            });
        });
        return result;
    }, [compareItems]);

    // Helper to get specific value from a product
    const getSpecValue = (item, groupName, attrName) => {
        const specData = item.specification || item.specifications;
        let specs = [];
        try {
            specs = Array.isArray(specData) ? specData : JSON.parse(specData || '[]');
        } catch (e) { }

        const group = specs.find(g => g.name === groupName);
        if (!group) return '-';
        const attr = group.attributes?.find(a => a.name === attrName);
        return attr ? attr.value : '-';
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 md:py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FiBarChart2 className="text-blue-500" />
                        {globalTexts.compareProducts || 'Compare Products'}
                    </h1>

                    {compareItems.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 text-sm"
                        >
                            <FiTrash2 /> Clear All
                        </button>
                    )}
                </div>

                {compareItems.length > 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr>
                                    <th className="p-6 border-b border-r border-gray-100 w-1/5 bg-gray-50/50 align-top">
                                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                            Product Details
                                        </div>
                                    </th>
                                    {compareItems.map(product => (
                                        <th key={product.id} className="p-6 border-b border-gray-100 w-1/5 align-top relative group">
                                            <button
                                                onClick={() => handleRemove(product)}
                                                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition z-10"
                                                title="Remove from compare"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>

                                            <Link href={`/products/${product.slug}`} className="block relative w-full aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden border border-gray-100">
                                                <Image
                                                    src={product.preview_image || '/images/no-available.svg'}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain hover:scale-105 transition-transform"
                                                />
                                            </Link>

                                            <Link href={`/products/${product.slug}`} className="block">
                                                <h3 className="font-semibold text-gray-900 text-sm md:text-base line-clamp-2 hover:text-primary-600 mb-2">
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            <div className="flex flex-col mb-4">
                                                {product.sale_price > 0 ? (
                                                    <>
                                                        <span className="font-bold text-primary-600 text-lg">{currency}{formatPrice(product.sale_price)}</span>
                                                        <span className="text-gray-400 line-through text-xs">{currency}{formatPrice(product.unit_price)}</span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-primary-600 text-lg">{currency}{formatPrice(product.unit_price)}</span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="w-full bg-gray-900 hover:bg-primary-600 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm"
                                            >
                                                <FiShoppingCart size={14} /> Add to Cart
                                            </button>
                                        </th>
                                    ))}
                                    {/* Fill empty columns if less than 4 items */}
                                    {Array.from({ length: 4 - compareItems.length }).map((_, idx) => (
                                        <th key={`empty-${idx}`} className="p-6 border-b border-gray-100 w-1/5 bg-gray-50/30">
                                            <Link href="/collections" className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary-500 hover:text-primary-600 transition group cursor-pointer">
                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-primary-50 transition">
                                                    <FiBarChart2 className="text-gray-300 text-xl group-hover:text-primary-500 transition" />
                                                </div>
                                                <p className="text-sm font-medium">Add Product</p>
                                                <span className="text-xs text-gray-400 mt-1 font-normal group-hover:text-primary-400">Browse Shop</span>
                                            </Link>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Brand & Category Basic Info */}
                                <tr>
                                    <td className="p-4 border-b border-r border-gray-100 font-semibold text-gray-900 bg-gray-50/30">Brand</td>
                                    {compareItems.map(product => (
                                        <td key={`brand-${product.id}`} className="p-4 border-b border-gray-100 text-gray-700">
                                            {product.brand?.name || <span className="text-gray-400">-</span>}
                                        </td>
                                    ))}
                                    {Array.from({ length: 4 - compareItems.length }).map((_, idx) => <td key={`eb-${idx}`} className="border-b border-gray-100 bg-gray-50/30"></td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 border-b border-r border-gray-100 font-semibold text-gray-900 bg-gray-50/30">Category</td>
                                    {compareItems.map(product => (
                                        <td key={`cat-${product.id}`} className="p-4 border-b border-gray-100 text-gray-700 capitalize">
                                            {product.category || <span className="text-gray-400">-</span>}
                                        </td>
                                    ))}
                                    {Array.from({ length: 4 - compareItems.length }).map((_, idx) => <td key={`ec-${idx}`} className="border-b border-gray-100 bg-gray-50/30"></td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 border-b border-r border-gray-100 font-semibold text-gray-900 bg-gray-50/30">Summary</td>
                                    {compareItems.map(product => (
                                        <td key={`summ-${product.id}`} className="p-4 border-b border-gray-100 text-gray-700 align-top">
                                            {product.summary ? (
                                                <div className="prose prose-sm max-w-none text-sm text-gray-700 product-summary" dangerouslySetInnerHTML={{ __html: product.summary }} />
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                    ))}
                                    {Array.from({ length: 4 - compareItems.length }).map((_, idx) => <td key={`es-${idx}`} className="border-b border-gray-100 bg-gray-50/30"></td>)}
                                </tr>
                                <tr>
                                    <td className="p-4 border-b border-r border-gray-100 font-semibold text-gray-900 bg-gray-50/30">Specifications</td>
                                    {compareItems.map(product => {
                                        const specs = product.specification || product.specifications;
                                        let parsedSpecs = [];
                                        try {
                                            parsedSpecs = Array.isArray(specs) ? specs : JSON.parse(specs || '[]');
                                        } catch (e) { }

                                        return (
                                            <td key={`spec-label-${product.id}`} className="p-4 border-b border-gray-100 text-gray-700 align-top uppercase text-[10px] font-bold tracking-tight">
                                                {parsedSpecs.length > 0 ? (
                                                    <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                        {parsedSpecs.length} {parsedSpecs.length === 1 ? 'Group' : 'Groups'} Available
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">No Specifications</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    {Array.from({ length: 4 - compareItems.length }).map((_, idx) => <td key={`esp-${idx}`} className="border-b border-gray-100 bg-gray-50/30"></td>)}
                                </tr>

                                {/* Dynamic Specifications */}
                                {aggregatedSpecs.map((group, gIdx) => (
                                    <React.Fragment key={gIdx}>
                                        {/* Group Header */}
                                        <tr>
                                            <td colSpan={5} className="p-3 bg-gray-100 border-y border-gray-200 font-bold text-primary-700 text-sm uppercase tracking-wider">
                                                {group.groupName}
                                            </td>
                                        </tr>
                                        {/* Group Attributes */}
                                        {group.attributes.map((attrName, aIdx) => (
                                            <tr key={`${gIdx}-${aIdx}`} className="hover:bg-gray-50/50 transition">
                                                <td className="p-4 border-b border-r border-gray-100 font-medium text-gray-600 bg-gray-50/10 w-1/5">
                                                    {attrName}
                                                </td>
                                                {compareItems.map(product => (
                                                    <td key={`${product.id}-${attrName}`} className="p-4 border-b border-l border-gray-50 text-gray-800 text-sm">
                                                        {getSpecValue(product, group.groupName, attrName)}
                                                    </td>
                                                ))}
                                                {Array.from({ length: 4 - compareItems.length }).map((_, idx) => <td key={`ed-${idx}`} className="border-b border-gray-50 bg-gray-50/10"></td>)}
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                            <FiBarChart2 size={40} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No products to compare</h2>
                        <p className="text-gray-500 mb-8 max-w-md">You haven't added any products to compare yet. Add products to see them side-by-side!</p>
                        <Link
                            href="/collections"
                            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                        >
                            Browse Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
