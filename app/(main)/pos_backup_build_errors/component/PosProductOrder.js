'use client';

import { ProductContext } from '@/_context/cartContext';
import { trackEvent } from '@/_utils/facebookPixel';
import { getProductStock } from '@/_utils/getProductStock';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { toast } from 'react-toastify';
import ProductCounter from '@/_components/ProductCounter';
import useAdManager from '@/_hooks/useAdManager';

const PosProductOrder = ({ product, dictionary }) => {
    const [showStockMsg, setShowStockMsg] = useState(false);
    const { id, variants, stock } = product;
    const [productStock, setProductStock] = useState(0);
    const [buttonActive, setButtonActive] = useState(false);
    const [showStock, setShowStock] = useState(false);
    const [requiredMsg, setRequiredMsg] = useState(false);
    const [incrementDisable, setIncrementDisable] = useState(false);
    const [selectedValues, setSelectedValues] = useState({});
    const [availableSizeOptions, setAvailableSizeOptions] = useState(variants);
    const [productCount, setProductCount] = useState(1);
    const [attributes, setAttributes] = useState('');
    const { adManager } = useAdManager();

    const router = useRouter();
    const { state, dispatch } = useContext(ProductContext);
    const isInCart = state.cartItems.some((item) => item.id === product.id);
    const {
        order,
        addToCart,
        limitation,
        max,
        stockOut,
        productVarientSelect,
    } = dictionary;

    useEffect(() => {
        if (variants.length < 1) {
            setProductStock(stock);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productStock]);

    const handleChange = async (key, variantIndex, value) => {
        console.log(key, variantIndex, value); // Debugging info

        // Update selected values
        setSelectedValues((prevSelectedValues) => ({
            ...prevSelectedValues,
            [key]: value,
        }));

        setRequiredMsg(false);
        setIncrementDisable(false);

        let newAttributes = '';

        // URL-encode the value to ensure it's safe for API requests
        const encodedValue = encodeURIComponent(value);

        // Handle attribute_one (usually color if variantIndex is 0)
        if (variantIndex === 0) {
            newAttributes = `attribute_one=${encodedValue}`;
        }

        // Handle attribute_two (for other options if variantIndex is 1)
        if (variantIndex === 1) {
            if (attributes) {
                newAttributes = `${attributes}&attribute_two=${encodedValue}`;
            } else {
                newAttributes = `attribute_two=${encodedValue}`;
            }
        }

        setAttributes(newAttributes);

        // Show stock information after a delay
        setTimeout(() => {
            setShowStock(true);
        }, 2000);

        // Fetch product stock based on new attributes
        let productStock = await getProductStock(id, newAttributes);
        setProductStock(productStock.stock);
    };

    useEffect(() => {
        const requiredFields = variants.map(
            (variant) => Object.keys(variant)[0]
        );
        const allRequiredFieldsSelected = requiredFields.every(
            (field) => selectedValues[field]
        );
        setButtonActive(allRequiredFieldsSelected);
    }, [selectedValues, variants]);

    const handleAddToCart = (event) => {
        if (event.type === 'submit') {
            event.preventDefault();
        }

        if (!buttonActive) {
            setRequiredMsg(true);
            return;
        }

        const selectedProduct = {
            ...product,
            quantity: productCount,
            attributes: selectedValues,
        };

        if (!isInCart) {
            dispatch({
                type: 'ADD_TO_CART',
                payload: selectedProduct,
            });
            toast.success(`Added ${product.name} to Cart!`, {
                position: 'bottom-right',
            });

            // For Google Tag manager
            if (adManager?.tag_manager_id) {
                window.dataLayer.push({
                    event: 'add_to_cart',
                    ecommerce: {
                        items: selectedProduct,
                    },
                });
            }

            // For Facebook Pixels
            trackEvent('Add To Cart', selectedProduct);
        } else {
            toast.error(
                `The product ${product.name} has already been added to the cart`,
                {
                    position: 'bottom-right',
                }
            );
        }
    };

    const isFormValid = true;

    return (
        <form onSubmit={handleAddToCart}>
            <div>
                {variants.map((variant, variantIndex) => {
                    const key = Object.keys(variant)[0];
                    const values = variant[key];

                    return (
                        <div
                            key={variantIndex}
                            className="flex items-center gap-[10px] md:gap-0 mb-8 lg:mb-5"
                        >
                            <div className="md:min-w-[90px]">
                                <p className="text-base font-semibold text-gray-700 capitalize">
                                    {key}:
                                </p>
                            </div>
                            <ul className="flex items-center gap-2 lg:gap-[18px] flex-wrap">
                                {values.map((value, index) => (
                                    <li key={index}>
                                        <input
                                            type="radio"
                                            name={key}
                                            id={`${key}-${value}`}
                                            value={value}
                                            className="hidden"
                                            checked={
                                                selectedValues[key] === value
                                            }
                                            onChange={() =>
                                                handleChange(
                                                    key,
                                                    variantIndex,
                                                    value
                                                )
                                            }
                                        />
                                        {key.toLowerCase() === 'color' ? (
                                            <label
                                                htmlFor={`${key}-${value}`}
                                                className={`cursor-pointer rounded-full p-[2px] flex items-center justify-center shadow-lg border ${selectedValues[key] ===
                                                        value
                                                        ? 'border-red-500'
                                                        : 'border-gray-600'
                                                    }`}
                                            >
                                                <div
                                                    style={{
                                                        backgroundColor: `#${value}`,
                                                    }}
                                                    className={`w-5 h-5 rounded-full`}
                                                ></div>
                                            </label>
                                        ) : (
                                            <label
                                                htmlFor={`${key}-${value}`}
                                                className={`px-2 py-1 text-base font-medium rounded block cursor-pointer border border-gray-600 ${selectedValues[key] ===
                                                        value
                                                        ? 'bg-gray-600 text-white'
                                                        : 'text-gray-600 hover:text-white hover:bg-gray-700'
                                                    }`}
                                            >
                                                {value}
                                            </label>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
            {/* {productStock > 0 ? (
                <p>Stock: {productStock}</p>
            ) : (
                <p>Out of Stock</p>
            )} */}

            {productStock < 1 && showStock && (
                <p className="text-red-500">{stockOut}</p>
            )}

            {requiredMsg && (
                <p className="text-red-500">{productVarientSelect}</p>
            )}

            <hr className="my-6 border-gray-400" />
            <div className="flex items-center gap-[12px] mb-[30px]">
                <ProductCounter
                    id={product.id}
                    productCount={productCount}
                    setProductCount={setProductCount}
                    stock={productStock}
                    setShowStockMsg={setShowStockMsg}
                    buttonActive={buttonActive}
                    showStock={showStock}
                    productStock={productStock}
                    incrementDisable={incrementDisable}
                    setIncrementDisable={setIncrementDisable}
                    variants={variants}
                />
                <button
                    type="submit"
                    className={`flex items-center gap-2 px-[19px] md:px-[30px] py-[19px] md:py-4 text-gray-900 border border-gray-900 hover:text-white hover:bg-gray-900 transition duration-150 rounded-md capitalize ${isFormValid ? '' : 'cursor-not-allowed'
                        }`}
                    disabled={stock < 1 || (productStock < 1 && showStock)}
                >
                    <BsCart3 />
                    <span className="hidden md:inline-block">{addToCart}</span>
                </button>
                <button
                    type="submit"
                    onClick={() => {
                        if (productStock >= 1 && buttonActive) {
                            router.push('/checkout');
                        }
                    }}
                    className={`flex items-center gap-2 px-[30px] py-4 text-white bg-gray-900 border border-gray-900 rounded-md hover:bg-transparent hover:text-gray-900 transition duration-150 capitalize ${stock < 1 ? 'cursor-not-allowed' : ''
                        }`}
                    disabled={stock < 1 || (productStock < 1 && showStock)}
                >
                    {order}
                </button>
            </div>
            {showStockMsg && stock >= 1 && (
                <p className="text-red-500">
                    {' '}
                    {max} {productStock} {limitation}{' '}
                </p>
            )}
        </form>
    );
};

export default PosProductOrder;
