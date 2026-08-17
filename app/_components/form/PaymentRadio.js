import Image from 'next/image';

const PaymentRadio = ({ value, name, icon, checked, onChange, imgClass }) => {
  return (
    <>
      <label
        htmlFor={value}
        className="flex items-center gap-[18px] h-[60px] lg:h-[92px] p-4 w-full bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 cursor-pointer overflow-hidden"
      >
        <input
          type="radio"
          id={value}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded-full shrink-0 focus:ring-blue-500"
        />

        <div className="flex items-center justify-start w-full h-full">
          <Image
            src={icon}
            alt="payment icon"
            width={100}
            height={50}
            className={`object-contain max-h-full max-w-[120px] ${
              imgClass || ''
            }`}
          />
        </div>
      </label>
    </>
  );
};

export default PaymentRadio;
