import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import SalesTab from '../SalesTab';

const RecentSaleModal = ({ submitHandler, isOpen, setIsOpen }) => {
  return (
    <div className="note-edit-btn">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="w-full text-sm h-12 md:h-[56px] bg-purple-900 text-white flex justify-center items-center gap-1 rounded-md">
            {/* <PiPrinterDuotone /> */}
            Recent Sale
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
          <DialogHeader className="sr-only">
            <DialogTitle>Note</DialogTitle>
            <DialogDescription>Note Description</DialogDescription>
          </DialogHeader>
          <div className="">
            <SalesTab />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecentSaleModal;
