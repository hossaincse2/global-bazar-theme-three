import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/_components/ui/table';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/_components/ui/dialog';

import useAuth from '@/_hooks/useAuth';
import usePosUser from '@/_hooks/usePosUser';
import useStoreId from '@/_hooks/useStoreId';
import { useEffect, useState } from 'react';
import { FaRegEye } from 'react-icons/fa';
import { getPrintInvoice } from '@/_utils/pos/getPrintInvoice';
import { getRecentSales } from '@/_utils/pos/getRecentSales';

const SaleContent = () => {
  const [recentSales, setRecentSales] = useState([]);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const { authToken } = useAuth();
  const { posUser } = usePosUser();
  const { userStoreId, setUserStoreId } = useStoreId();

  useEffect(() => {
    const fetchData = async () => {
      const salesData = await getRecentSales(authToken, userStoreId);
      console.log(authToken);
      setRecentSales(salesData.data);
    };

    if (userStoreId) {
      fetchData();
    }
  }, [authToken]);

  const printHandler = async (id) => {
    const invoiceData = await getPrintInvoice(authToken, JSON.stringify(id));

    setInvoice(invoiceData.invoice);
    setInvoiceModalOpen(true);
  };

  if (!userStoreId) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <h3 className="text-2xl text-gray-700">
          Please select a store first from store list.
        </h3>
      </div>
    );
  }

  if (!recentSales || recentSales.length === 0) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <h3 className="text-2xl text-gray-700">No recent sales found.</h3>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-gray-900">Date</TableHead>
            <TableHead className="font-semibold text-gray-900">
              Order Number
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Customer
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Grand Total
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentSales.map((recentSale) => (
            <TableRow key={recentSale.id}>
              <TableCell className="py-3 font-normal text-gray-700">
                {recentSale.date}
              </TableCell>
              <TableCell className="py-3 font-normal text-gray-700">
                {recentSale.order_number}
              </TableCell>
              <TableCell className="py-3 font-normal text-gray-700">
                {recentSale.customer_name}
              </TableCell>
              <TableCell className="py-3 font-normal text-gray-700">
                {recentSale.grand_total}
              </TableCell>
              <TableCell className="py-3 font-normal text-gray-700">
                <div>
                  <button onClick={() => printHandler(recentSale.id)}>
                    <FaRegEye size={18} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="">
        <Dialog open={invoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-[#F6F4FD] border-[rgba(136, 49, 225, 0.20)]">
            <DialogHeader className="sr-only">
              <DialogTitle>Coupon</DialogTitle>
              <DialogDescription>Coupon Description</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div
                className=""
                dangerouslySetInnerHTML={{
                  __html: invoice,
                }}
              ></div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default SaleContent;
