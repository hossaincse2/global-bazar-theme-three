export const formatPrice = (number) => {
    if (number === undefined || number === null) return '0';
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 0,
    }).format(number);
};

export const formatBanglaNumber = (number) => {
    if (number === null || number === undefined) return '0';
    return new Intl.NumberFormat('en-IN').format(number);
};
