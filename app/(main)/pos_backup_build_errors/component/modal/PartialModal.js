import Input from '@/_components/form/Input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/_components/ui/dialog';

const PartialModal = ({ submitHandler, isOpen, setIsOpen }) => {

    return (
        <div className="Partial-edit-btn">
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogTrigger asChild>
                    <button className="flex items-center gap-1 px-4 py-2 text-xs font-medium text-purple-900 transition-all duration-150 border border-purple-900 rounded hover:bg-purple-900 hover:text-white">
                        Partial
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
                    <DialogHeader className="sr-only">
                        <DialogTitle>Partial</DialogTitle>
                        <DialogDescription>
                            Partial Description
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
                                    label="Partial"
                                    type="text"
                                    name="partialCash"
                                    placeholder="Cash Amount"
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

export default PartialModal;
