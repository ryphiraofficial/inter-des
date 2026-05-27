import { useState, useEffect } from 'react';
import { settingsAPI } from '../models/api';

export const useCompanySettings = (defaultName = 'Interior Design', defaultSubtitle = '') => {
    const [companyName, setCompanyName] = useState(defaultName);
    const [motto, setMotto] = useState(defaultSubtitle);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchSettings = async () => {
            try {
                const res = await settingsAPI.get();
                if (mounted && res.success && res.data?.company) {
                    setCompanyName(res.data.company.companyName || defaultName);
                    setMotto(defaultSubtitle ? defaultSubtitle : (res.data.company.motto || ''));
                }
            } catch (err) {
                console.error('Failed to load company settings:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        fetchSettings();
        
        return () => {
            mounted = false;
        };
    }, [defaultName, defaultSubtitle]);

    return { companyName, motto, loading };
};
