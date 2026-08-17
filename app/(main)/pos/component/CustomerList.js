'use client';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { LuRefreshCw } from 'react-icons/lu';
import { toast } from 'react-toastify';

import { Button } from '@/_components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/_components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/_components/ui/select';

import useAuth from '@/_hooks/useAuth';
import usePos from '@/_hooks/usePos';
import usePosUser from '@/_hooks/usePosUser';
import useStoreId from '@/_hooks/useStoreId';
import { cn } from '@/lib/utils';
import { getStore } from '@/_utils/pos/getStore';
import { createCustomer, getCustomers } from '@/_utils/pos/posCustomers';
import UserCreateModal from './modal/UserCreateModal';

const CustomerList = ({
  customervalue,
  setCustomerValue,
  warehousevalue,
  setWarehouseValue,
  storeId,
  setStoreId,
  hasInitialStoreId,
  setPage,
}) => {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const { dispatch } = usePos();
  const { authToken } = useAuth();
  const { posUser } = usePosUser();
  const { setUserStoreId } = useStoreId();

  // Set default customer ("Walk in Customer")
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await getCustomers(authToken);
        if (res?.data) {
          setCustomers(res.data);
          const defaultCustomer = res.data.find(
            (c) => c?.name?.trim() === 'Walk in Customer'
          )?.id;
          if (defaultCustomer) {
            setCustomerValue(defaultCustomer);
          }
        }
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        toast.error('Failed to load customers', { position: 'bottom-right' });
      }
    };

    if (authToken) fetchCustomers();
  }, [authToken, setCustomerValue]);

  // Fetch warehouse list
  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const res = await getStore(authToken);
        if (res?.data) {
          setWarehouses(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch warehouse:', error);
        toast.error('Failed to load stores', { position: 'bottom-right' });
      }
    };

    if (authToken && posUser) fetchWarehouse();
  }, [authToken, posUser]);

  // 🌟 Set initial store based on user type
  useEffect(() => {
    if (!posUser) return;

    if (String(posUser.store_id) === 'all') {
      setWarehouseValue('all');
      setStoreId('all');
      setUserStoreId('all');
    } else {
      setWarehouseValue(posUser.store_id);
      setStoreId(posUser.store_id);
      setUserStoreId(posUser.store_id);
    }
  }, [posUser]);

  const handleRefresh = () => {
    dispatch({ type: 'CLEAR_CART' });
    const walkInCustomer = customers.find(
      (c) => c?.name?.trim() === 'Walk in Customer'
    )?.id;
    if (walkInCustomer) {
      setCustomerValue(walkInCustomer);
    }
  };

  const handleValueChange = (value) => {
    setWarehouseValue(value);
    setStoreId(value);
    setUserStoreId(value);
    setPage(1);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await createCustomer(authToken, JSON.stringify(data));
      const responseData = await res.json();

      if (res.ok) {
        // Success
        setCustomers((prev) => [...prev, responseData]);
        setCustomerValue(responseData.id);
        setIsOpen(false);
        toast.success('Customer created successfully', {
          position: 'bottom-right',
        });
        event.target.reset();
      } else {
        // Error
        if (responseData.errors) {
          const firstError = Object.values(responseData.errors)[0][0];
          toast.error(firstError, { position: 'bottom-right' });
        } else if (responseData.message) {
          toast.error(responseData.message, { position: 'bottom-right' });
        } else {
          toast.error('Failed to create customer', {
            position: 'bottom-right',
          });
        }
      }
    } catch (error) {
      console.error('Failed to create customer:', error);
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-5">
      {/* Customer Dropdown */}
      <div dir="ltr">
        <Popover open={open} onOpenChange={setOpen}>
          <div className="flex">
            <UserCreateModal
              submitHandler={submitHandler}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] text-xs font-normal justify-between px-3 py-2 border-[#E7E6EC] rounded-none rounded-r-md"
              >
                {customervalue
                  ? customers.find((c) => c?.id === customervalue)?.name
                  : 'Walk in Customer'}
                <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
              </Button>
            </PopoverTrigger>
          </div>
          <PopoverContent className="w-[300px] p-0">
            <Command
              filter={(value, search) => {
                const customer = customers.find(
                  (c) => c.id.toString() === value
                );
                if (!customer) return 0;

                const searchLower = search.toLowerCase();
                const matchName = customer.name
                  ?.toLowerCase()
                  .includes(searchLower);
                const matchEmail = customer.email
                  ?.toLowerCase()
                  .includes(searchLower);
                const matchPhone = customer.phone
                  ?.toLowerCase()
                  .includes(searchLower);

                return matchName || matchEmail || matchPhone ? 1 : 0;
              }}
            >
              <CommandInput
                placeholder="Search by name, email or phone..."
                className="h-9"
              />
              <CommandList>
                <CommandEmpty>No Customer found.</CommandEmpty>
                <CommandGroup>
                  {customers
                    .filter((customer) => customer?.id && customer?.name) // Filter out invalid data
                    .map((customer) => (
                      <CommandItem
                        key={customer.id}
                        className="text-[12px]"
                        value={customer.id.toString()}
                        onSelect={(currentValue) => {
                          setCustomerValue(
                            Number(currentValue) === customervalue
                              ? ''
                              : Number(currentValue)
                          );
                          setOpen(false);
                        }}
                      >
                        <div className="flex flex-col flex-1">
                          <span className="font-medium">{customer.name}</span>
                          {customer.email && (
                            <span className="text-[10px] text-gray-500">
                              {customer.email}
                            </span>
                          )}
                          {customer.phone && (
                            <span className="text-[10px] text-gray-500">
                              {customer.phone}
                            </span>
                          )}
                        </div>
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4 shrink-0',
                            customervalue === customer.id
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Store Selector */}
      <div>
        <Select onValueChange={handleValueChange} value={warehousevalue}>
          <SelectTrigger className="w-[150px] text-xs font-normal justify-between px-3 py-2 border-[#E7E6EC]">
            <SelectValue placeholder="All Stores">
              {warehouses.find((wh) => wh?.id === warehousevalue)?.name ||
                (warehousevalue === 'all' ? 'All Stores' : 'Select Store')}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {String(posUser?.store_id) === 'all' && (
                <SelectItem value="all">All Stores</SelectItem>
              )}
              {warehouses
                .filter((wh) => wh?.id && wh?.name) // Filter out invalid data
                .map((wh) => (
                  <SelectItem
                    key={wh.id}
                    value={wh.id}
                    disabled={
                      String(posUser?.store_id) !== 'all' &&
                      posUser?.store_id !== wh.id
                    }
                  >
                    {wh.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="w-[34px] h-[34px] flex justify-center items-center bg-gray-200 rounded"
      >
        <LuRefreshCw />
      </button>
    </div>
  );
};

export default CustomerList;
