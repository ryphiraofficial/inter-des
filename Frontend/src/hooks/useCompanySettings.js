import { useGetSettingsQuery } from '../store/api/adminApi';

export const useCompanySettings = (defaultName = 'Interior Design', defaultSubtitle = '') => {
    const { data: res, isLoading } = useGetSettingsQuery();
    
    let companyName = defaultName;
    let motto = defaultSubtitle;

    if (res?.success && res.data?.company) {
        companyName = res.data.company.companyName || defaultName;
        motto = defaultSubtitle ? defaultSubtitle : (res.data.company.motto || '');
    }

    return { companyName, motto, loading: isLoading };
};
