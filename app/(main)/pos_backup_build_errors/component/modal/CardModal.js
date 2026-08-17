import Input from '@/_components/form/Input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog';

const CardModal = ({ submitHandler, isOpen, setIsOpen }) => {
    return (
        <div className="Card-edit-btn">
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogTrigger asChild>
                    <button className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-purple-900 transition-all duration-150 border border-purple-900 rounded hover:bg-purple-900 hover:text-white">
                        Card
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Card</DialogTitle>
                        <DialogDescription>Card Description</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <form
                            onSubmit={submitHandler}
                            id="cart-form"
                            className="cart-form"
                        >
                            <div className="grid gap-4">
                                <Input
                                    label="Card"
                                    type="text"
                                    name="cardNumber"
                                    placeholder="Card Number"
                                    required
                                />
                                <Input
                                    // label="Card"
                                    type="text"
                                    name="cardTransaction"
                                    placeholder="Transaction Id"
                                    required
                                />
                            </div>
                            <div className="flex justify-start pt-5">
                                <button
                                    type="submit"
                                    className="text-xs bg-purple-900 text-white hover:bg-transparent hover:text-purple-900 font-medium py-[14px] px-[30px] border border-purple-900 transition-all duration-150 rounded"
                                >
                                    OK
                                </button>
                            </div>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CardModal;
