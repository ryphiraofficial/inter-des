import React, { createContext, useContext, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const DateFilterContext = createContext(null);

/**
 * Calculates start and end Date objects for preset filter keys
 */
export const computeDateRange = (preset, customRange) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    switch (preset) {
        case 'today': {
            const from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
            const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            return { from, to };
        }
        case 'this_week': {
            const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon
            const diffToMonday = (dayOfWeek + 6) % 7;
            const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diffToMonday, 0, 0, 0, 0);
            const to = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            return { from, to };
        }
        case 'this_month': {
            const from = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
            const to = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
            return { from, to };
        }
        case 'prev_month': {
            const from = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
            const to = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
            return { from, to };
        }
        case 'this_quarter': {
            const quarterIndex = Math.floor(currentMonth / 3);
            const from = new Date(currentYear, quarterIndex * 3, 1, 0, 0, 0, 0);
            const to = new Date(currentYear, (quarterIndex + 1) * 3, 0, 23, 59, 59, 999);
            return { from, to };
        }
        case 'this_fy': {
            // Indian Financial Year: April 1 to March 31
            const startYear = currentMonth >= 3 ? currentYear : currentYear - 1;
            const from = new Date(startYear, 3, 1, 0, 0, 0, 0);
            const to = new Date(startYear + 1, 3, 0, 23, 59, 59, 999);
            return { from, to };
        }
        case 'custom': {
            if (customRange?.from) {
                const from = new Date(customRange.from);
                from.setHours(0, 0, 0, 0);
                const to = customRange.to ? new Date(customRange.to) : new Date(customRange.from);
                to.setHours(23, 59, 59, 999);
                return { from, to };
            }
            return null;
        }
        case 'all_time':
        default:
            return null; // No filtering
    }
};

export const DateFilterProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlPreset = searchParams.get('period') || 'this_month';

    const [preset, setPreset] = useState(urlPreset);
    const [customRange, setCustomRange] = useState({ from: undefined, to: undefined });

    const dateRange = useMemo(() => {
        return computeDateRange(preset, customRange);
    }, [preset, customRange]);

    const handleSetDateFilter = ({ preset: newPreset, range }) => {
        setPreset(newPreset);
        if (range) {
            setCustomRange(range);
        }
        setSearchParams(prev => {
            const next = new URLSearchParams(prev);
            if (newPreset && newPreset !== 'this_month') {
                next.set('period', newPreset);
            } else {
                next.delete('period');
            }
            return next;
        }, { replace: true });
    };

    /**
     * Checks if a given date string, Date object, or timestamp is within the active date range
     */
    const isDateInRange = (dateInput) => {
        if (!dateRange || !dateRange.from) return true; // All time or no bounds
        if (!dateInput) return false;

        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return false;

        const time = date.getTime();
        const fromTime = dateRange.from.getTime();
        const toTime = dateRange.to ? dateRange.to.getTime() : fromTime;

        return time >= fromTime && time <= toTime;
    };

    /**
     * Helper to filter an array of objects by any date field (e.g. createdAt, date, dateRequested)
     */
    const filterRecordsByDate = (items = [], dateField = 'createdAt') => {
        if (!Array.isArray(items)) return [];
        if (!dateRange || !dateRange.from) return items;

        return items.filter(item => {
            const val = item?.[dateField] || item?.date || item?.createdAt || item?.updatedAt;
            return isDateInRange(val);
        });
    };

    return (
        <DateFilterContext.Provider value={{
            preset,
            customRange,
            dateRange,
            setDateFilter: handleSetDateFilter,
            isDateInRange,
            filterRecordsByDate
        }}>
            {children}
        </DateFilterContext.Provider>
    );
};

export const useDateFilter = () => {
    const context = useContext(DateFilterContext);
    if (!context) {
        // Fallback default state if used outside provider
        return {
            preset: 'this_month',
            customRange: { from: undefined, to: undefined },
            dateRange: computeDateRange('this_month'),
            setDateFilter: () => {},
            isDateInRange: () => true,
            filterRecordsByDate: (items) => items || []
        };
    }
    return context;
};

export default DateFilterContext;
