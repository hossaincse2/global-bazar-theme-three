'use client';

import { FaRegStar, FaStar } from 'react-icons/fa6';
import Rating from 'react-rating';

const ProductRating = ({ rating, handleRatingChange }) => {
    const starClass = 'text-2xl md:text-4xl text-[#FF9E2C] mx-1 md:mx-3';

    return (
        <div>
            <Rating
                initialRating={rating}
                onChange={handleRatingChange}
                fractions={1}
                emptySymbol={
                    <div className={`${starClass}`}>
                        <FaRegStar />
                    </div>
                }
                fullSymbol={
                    <div className={`${starClass}`}>
                        <FaStar />
                    </div>
                }
            />
            {/* <p>Your rating: {rating} stars</p> */}
        </div>
    );
};

export default ProductRating;
