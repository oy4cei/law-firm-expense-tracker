export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0.00';
    return Number(amount).toLocaleString('uk-UA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};
