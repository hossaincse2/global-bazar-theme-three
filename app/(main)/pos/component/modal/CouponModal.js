import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog';
import { BiSolidEdit } from 'react-icons/bi';

const CouponModal = ({ submitHandler, isOpen, setIsOpen, discountValue }) => {
    return (
        <div className="coupon-edit-btn">
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogTrigger asChild>
                    <button className="flex items-center gap-1 text-xs font-medium text-gray-700 focus-visible:outline-hidden">
                        Coupon{' '}
                        {discountValue > 0 ? `(${discountValue} Tk)` : ''}
                        <span>
                            <BiSolidEdit />
                        </span>
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Coupon</DialogTitle>
                        <DialogDescription>
                            Coupon Description
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <form
                            onSubmit={submitHandler}
                            id="cart-form"
                            className="cart-form"
                        >
                            <div className="grid gap-4">
                                <div className="single-input">
                                    <label className="block text-gray-700 text-sm font-semibold mb-[6px] capitalize">
                                        Coupon
                                    </label>
                                    <input
                                        type="text"
                                        name="coupon"
                                        placeholder="Enter coupon code"
                                        required
                                        className="block w-full px-[14px] py-[16px] lg:px-6 lg:py-4 3xl:px-[18px] 3xl:py-[22px] border border-[#D0D5DD] text-gray-700 ring-1 ring-inset ring-[#D0D5DD] focus:ring-1 focus:ring-blue-900 placeholder:text-gray-400 placeholder:text-base outline-hidden rounded-md input-shadow bg-white"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CouponModal;
