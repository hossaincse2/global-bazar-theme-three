import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PosSkeletonCard = () => {
    return (
        <div className="overflow-hidden rounded-lg product-card">
            <div className="product-content p-[10px] md:p-[18px] bg-white ">
                <div className="block product-image h-[120px] rounded-tl-md rounded-tr-lg overflow-hidden relative mb-[18px]">
                    <Skeleton className="object-cover w-full h-full rounded-tl-lg rounded-tr-lg" />
                </div>
                <div className="mb-1 w-6/8">
                    <Skeleton className="h-[22px] w-full" />
                </div>
                <div className="w-3/4">
                    <Skeleton className="h-[22px] w-full" />
                </div>
            </div>
        </div>
    );
};

export default PosSkeletonCard;
