import Input from '@/_components/form/Input';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { useState } from 'react';

const UserCreateModal = ({ submitHandler, isOpen, setIsOpen }) => {
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const validateForm = (formData) => {
    const newErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.get('name')?.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    const email = formData.get('email')?.trim();
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation
    const phone = formData.get('phone')?.trim();
    if (!phone) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!/^(\+8801|01)[0-9]{9}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    // Address validation
    if (!formData.get('address')?.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (validateForm(formData)) {
      submitHandler(event);
    }
  };

  const handleInputChange = (fieldName) => {
    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-10 h-[36px] border-[#E7E6EC] text-sm font-normal rounded-none rounded-l-md"
          >
            +
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-white border-[rgba(136, 49, 225, 0.20)]">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription className="sr-only">
              Add Customer Description
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <form onSubmit={handleSubmit} id="cart-form" className="cart-form">
              <div className="grid gap-4">
                <div>
                  <Input
                    label={
                      <>
                        Name{' '}
                        <span className="font-light text-gray-500">
                          (required)
                        </span>
                      </>
                    }
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    onChange={() => handleInputChange('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Input
                    label={
                      <>
                        Email{' '}
                        {/* <span className="font-light text-gray-500">
                          (required)
                        </span> */}
                      </>
                    }
                    type="email"
                    name="email"
                    placeholder="example@example.com"
                    onChange={() => handleInputChange('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Input
                    label={
                      <>
                        Phone Number{' '}
                        <span className="font-light text-gray-500">
                          (required)
                        </span>
                      </>
                    }
                    type="text"
                    name="phone"
                    placeholder="+8801xxxxxxxxx"
                    onChange={() => handleInputChange('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <Input
                    label={
                      <>
                        Address{' '}
                        {/* <span className="font-light text-gray-500">
                          (required)
                        </span> */}
                      </>
                    }
                    type="text"
                    name="address"
                    placeholder="House No, Road No, Thana, Zila"
                    onChange={() => handleInputChange('address')}
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-start pt-5">
                <button
                  type="submit"
                  className="text-xs bg-purple-900 text-white hover:bg-transparent hover:text-purple-900 font-medium py-[14px] px-[30px] border border-purple-900 transition-all duration-150 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserCreateModal;
