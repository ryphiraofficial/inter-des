import React from 'react';
import { Search } from 'lucide-react';

const HeaderSearch = ({ isSearchable, searchOpen, searchValue, handleSearchToggle, handleSearchChange, searchInputRef }) => {
    if (!isSearchable) return null;

    return (
        <div className={`header-search-bar ${searchOpen ? 'expanded' : 'collapsed'}`}>
            <button
                className="search-toggle-btn"
                onClick={handleSearchToggle}
                title={searchOpen ? 'Close search' : 'Search'}
            >
                <Search size={18} />
            </button>
            {searchOpen && (
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={handleSearchChange}
                />
            )}
        </div>
    );
};

export default HeaderSearch;
