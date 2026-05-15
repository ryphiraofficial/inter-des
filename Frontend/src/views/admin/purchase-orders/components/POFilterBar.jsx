import React from 'react';
import { Search } from 'lucide-react';

const POFilterBar = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => {
    return (
        <div className="po-filter-bar">
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
            <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
            >
                <option>All Status</option>
                <option>Pending</option>
                <option>Ordered</option>
                <option>Received</option>
                <option>Approved</option>
            </select>
        </div>
    );
};

export default POFilterBar;
