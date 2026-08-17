const RadioButton = ({
    label,
    value,
    name,
    checked,
    onChange,
    deliveryCharge,
}) => {
    return (
        <label
            htmlFor={value}
            className="inline-flex items-center mt-3 border border-gray-400 lg:border-0 px-3 py-[14px] lg:p-0 w-full lg:w-auto rounded-md bg-white lg:bg-transparent"
        >
            <input
                type="radio"
                id={value}
                className="w-5 h-5 text-blue-600 form-radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <span
                className={`ml-2 text-base font-semibold cursor-pointer ${
                    checked ? 'text-gray-800' : 'text-gray-600'
                }`}
            >
                {label} <span className="inline-block lg:hidden">:</span>
                <span className="inline-block ml-2 lg:hidden">
                    {deliveryCharge}৳
                </span>
            </span>
        </label>
    );
};

export default RadioButton;
