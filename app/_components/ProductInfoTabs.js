'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { formatPrice } from '@/_utils/formatNumber';

const ProductInfoTabs = ({ product, relatedProducts, currency = '৳' }) => {
    const [activeTab, setActiveTab] = useState('specification');

    // Questions state
    const [questions, setQuestions] = useState([]);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionForm, setQuestionForm] = useState({ customer_name: '', customer_email: '', question: '' });
    const [questionSubmitting, setQuestionSubmitting] = useState(false);
    const [questionMsg, setQuestionMsg] = useState(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Fetch questions when component mounts to get the accurate count
    useEffect(() => {
        if (!product?.slug) return;
        setQuestionsLoading(true);
        fetch(`${baseUrl}/en/product/${product.slug}/questions`)
            .then(r => r.json())
            .then(d => setQuestions(d.questions || []))
            .catch(() => setQuestions([]))
            .finally(() => setQuestionsLoading(false));
    }, [product?.slug, baseUrl]);

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        setQuestionSubmitting(true);
        setQuestionMsg(null);
        try {
            const res = await fetch(`${baseUrl}/en/product-questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ product_id: product.id, ...questionForm }),
            });
            const data = await res.json();
            if (data.status) {
                setQuestionMsg({ type: 'success', text: data.message || 'Question submitted! It will appear after admin review.' });
                setQuestionForm({ customer_name: '', customer_email: '', question: '' });
            } else {
                setQuestionMsg({ type: 'error', text: data.message || 'Failed to submit question.' });
            }
        } catch {
            setQuestionMsg({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setQuestionSubmitting(false);
        }
    };

    const tabs = [
        { id: 'specification', label: 'Specification' },
        { id: 'description', label: 'Description' },
        { id: 'reviews', label: `Reviews (${product?.reviews?.length || 0})` },
        { id: 'questions', label: `Questions (${questions.length})` },
    ];

    const specData = product?.specification || product?.specifications;
    const isSpecString = typeof specData === 'string' && specData.trim().length > 0;
    const specifications = Array.isArray(specData) ? specData : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-9">
                {/* Tabs Header */}
                <div className="flex flex-wrap border-b border-gray-200 mb-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-sm font-semibold transition-all relative ${activeTab === tab.id
                                ? 'text-primary-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'specification' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 font-primary">Specification</h3>
                            {isSpecString ? (
                                <div
                                    className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-img:rounded-xl text-gray-700"
                                    dangerouslySetInnerHTML={{ __html: specData }}
                                />
                            ) : specifications.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    {specifications.map((group, idx) => (
                                        <div key={idx} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                            <div className="bg-primary-50 px-4 py-2 border-b border-gray-100">
                                                <h4 className="font-bold text-primary-700">{group.name}</h4>
                                            </div>
                                            <div className="divide-y divide-gray-100 text-sm">
                                                {group.attributes?.map((attr, aIdx) => (
                                                    <div
                                                        key={aIdx}
                                                        className={`grid grid-cols-3 gap-2 px-4 py-3 ${aIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                                            }`}
                                                    >
                                                        <div className="text-gray-500 font-medium">{attr.name}</div>
                                                        <div className="col-span-2 text-gray-800 font-semibold">{attr.value}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="col-span-full bg-gray-50 p-8 rounded-xl text-center">
                                    <p className="text-gray-500 italic">No specifications provided for this product.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'description' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6 font-primary">Description</h3>
                            <div
                                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-primary-600 hover:prose-a:text-primary-700 prose-img:rounded-xl text-gray-700"
                                dangerouslySetInnerHTML={{ __html: product?.description || 'No description available.' }}
                            />
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                            <p className="text-gray-500">Scroll down to view and write reviews.</p>
                            <button
                                onClick={() => document.getElementById('ratings')?.scrollIntoView({ behavior: 'smooth' })}
                                className="mt-4 text-primary-600 font-bold hover:underline"
                            >
                                Go to Ratings section →
                            </button>
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Customer Questions</h3>

                            {/* Questions List */}
                            {questionsLoading ? (
                                <div className="space-y-4 mb-8">
                                    {[1, 2].map(i => (
                                        <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-20" />
                                    ))}
                                </div>
                            ) : questions.length > 0 ? (
                                <div className="space-y-5 mb-8">
                                    {questions.map((q, idx) => (
                                        <div key={idx} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-primary-600 font-bold text-sm">
                                                        {(q.customer_name || 'A')[0].toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {q.customer_name || 'Anonymous'}
                                                        {q.date && <span className="text-xs text-gray-400 font-normal ml-2">{q.date}</span>}
                                                    </p>
                                                    <p className="text-sm text-gray-700 mt-1">❓ {q.question}</p>
                                                </div>
                                            </div>
                                            {q.answer && (
                                                <div className="ml-12 bg-blue-50 border border-blue-100 rounded-lg p-3">
                                                    <p className="text-xs font-bold text-blue-600 mb-1">Admin Answer</p>
                                                    <div
                                                        className="text-sm text-gray-700 whitespace-pre-wrap"
                                                        dangerouslySetInnerHTML={{ __html: q.answer }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 mb-8">
                                    <p className="text-gray-400 text-sm">No questions yet. Be the first to ask!</p>
                                </div>
                            )}

                            {/* Ask a Question Form */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">Ask a Question</h4>
                                {questionMsg && (
                                    <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${questionMsg.type === 'success'
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-700 border border-red-200'
                                        }`}>
                                        {questionMsg.text}
                                    </div>
                                )}
                                <form onSubmit={handleQuestionSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Your Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={questionForm.customer_name}
                                                onChange={e => setQuestionForm(f => ({ ...f, customer_name: e.target.value }))}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                                Email <span className="text-gray-400 font-normal">(optional)</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={questionForm.customer_email}
                                                onChange={e => setQuestionForm(f => ({ ...f, customer_email: e.target.value }))}
                                                placeholder="you@email.com"
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                                            Your Question <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={questionForm.question}
                                            onChange={e => setQuestionForm(f => ({ ...f, question: e.target.value }))}
                                            placeholder="Ask something about this product..."
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={questionSubmitting}
                                        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {questionSubmitting ? 'Submitting...' : 'Submit Question'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar - Similar Products */}
            <div className="lg:col-span-3">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Similar Products</h3>
                <div className="space-y-4">
                    {relatedProducts.length > 0 ? (
                        relatedProducts.map((item) => {
                            const displayPrice = item.sale_price > 0 ? item.sale_price : item.unit_price;
                            const rating = parseFloat(item.average_rating || 0);

                            return (
                                <Link
                                    key={item.id}
                                    href={`/products/${item.slug}`}
                                    className="group block bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex gap-3">
                                        <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.preview_image || item.image || '/images/no-available.svg'}
                                                alt={item.name}
                                                fill
                                                className="object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 py-1">
                                            <h4 className="text-sm font-bold text-gray-800 truncate group-hover:text-primary-600 transition-colors mb-1">
                                                {item.name}
                                            </h4>
                                            <div className="mb-2">
                                                <span className="text-primary-600 font-black text-sm">
                                                    {currency} {formatPrice(displayPrice)}
                                                </span>
                                                {item.sale_price > 0 && (
                                                    <span className="text-gray-400 line-through text-[10px] ml-1">
                                                        {currency} {formatPrice(item.unit_price)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            size={10}
                                                            className={`${i < Math.floor(rating) ? 'fill-current' : ''}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500">
                                                    ({rating > 0 ? rating.toFixed(1) : '5.0'})
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <p className="text-gray-500 italic text-sm">No similar products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductInfoTabs;
