import Input from '@/_components/form/Input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog';
import { BiSolidEdit } from 'react-icons/bi';

const ShippingModal = ({ submitHandler, isOpen, setIsOpen }) => {
    return (
        <div className="Shipping-edit-btn">
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogTrigger asChild>
                    <button className="flex items-center gap-1 text-xs font-medium text-gray-700">
                        Shipping{' '}
                        <span>
                            <BiSolidEdit />
                        </span>
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Shipping</DialogTitle>
                        <DialogDescription>
                            Shipping Description
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <form
                            onSubmit={submitHandler}
                            id="cart-form"
                            className="cart-form"
                        >
                            <div className="grid gap-4">
                                <Input
                                    label="Shipping"
                                    type="text"
                                    name="shipping"
                                    placeholder="Enter Shipping Address"
                                    required
                                />
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ShippingModal;
