export const useStaffCalculations = () => {
    
    const calcGross = (f) => {
        if (!f) return 0;
        return (Number(f.baseSalary) || 0) + 
               (Number(f.hra) || 0) + 
               (Number(f.travelAllowance) || 0) + 
               (Number(f.otherAllowances) || 0);
    };

    const calcDeductions = (f) => {
        if (!f) return 0;
        return (Number(f.providentFund) || 0) + 
               (Number(f.taxDeduction) || 0) + 
               (Number(f.otherDeductions) || 0);
    };

    const calcNetPay = (f) => {
        return calcGross(f) - calcDeductions(f);
    };

    const fmtINR = (n) => {
        return new Intl.NumberFormat('en-IN', { 
            style: 'currency', 
            currency: 'INR', 
            maximumFractionDigits: 0 
        }).format(n || 0);
    };

    return { calcGross, calcDeductions, calcNetPay, fmtINR };
};
