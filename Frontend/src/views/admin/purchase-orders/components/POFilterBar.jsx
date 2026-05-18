import React from 'react';
import { Search } from 'lucide-react';
import CustomSelect from '../../components/CustomSelect';

const POFilterBar = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, hideSearch = false }) => {
    return (
        <div className="po-filter-bar">
            {!hideSearch && (
                <div className="search-wrapper">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by PO number or supplier..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            )}
            <CustomSelect
                variant="filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                    { value: 'All Status', label: 'All Status' },
                    { value: 'Pending', label: 'Pending' },
                    { value: 'Ordered', label: 'Ordered' },
                    { value: 'Received', label: 'Received' },
                    { value: 'Approved', label: 'Approved' },
                ]}
            />
        </div>
    );
};

export default POFilterBar;
