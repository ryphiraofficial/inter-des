import { useEffect } from 'react';

export const useSearchLogic = ({ 
    setSearchValue, setSearchOpen, pathname, searchInputRef 
}) => {
    
    useEffect(() => {
        setSearchValue('');
        setSearchOpen(false);
        window.dispatchEvent(new CustomEvent('header-search', { detail: '' }));
    }, [pathname, setSearchValue, setSearchOpen]);

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchValue(val);
        window.dispatchEvent(new CustomEvent('header-search', { detail: val }));
    };

    const handleSearchToggle = () => {
        setSearchOpen(prev => {
            if (!prev) {
                setTimeout(() => searchInputRef.current?.focus(), 50);
            } else {
                setSearchValue('');
                window.dispatchEvent(new CustomEvent('header-search', { detail: '' }));
            }
            return !prev;
        });
    };

    return { handleSearchChange, handleSearchToggle };
};
