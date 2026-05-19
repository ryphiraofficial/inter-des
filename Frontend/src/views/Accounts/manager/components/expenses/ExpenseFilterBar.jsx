import { SlidersHorizontal, ChevronDown, CheckCircle } from 'lucide-react';

const ExpenseFilterBar = ({ filterCategory, setFilterCategory, showCategoryDropdown, setShowCategoryDropdown }) => {
    const categories = [
        { value: 'All', dot: '#94a3b8' },
        { value: 'Materials', dot: '#3b82f6' },
        { value: 'Labour', dot: '#10b981' },
        { value: 'Transport', dot: '#f59e0b' },
        { value: 'Tools & Equipment', dot: '#8b5cf6' },
        { value: 'Office', dot: '#06b6d4' },
        { value: 'Utilities', dot: '#f97316' },
        { value: 'Miscellaneous', dot: '#64748b' },
    ];

    return (
        <div className="table-controls" style={{ justifyContent: 'flex-end' }}>
            <div className="filter-group">
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowCategoryDropdown(p => !p)}
                        className="filter-dropdown-btn"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '9px 14px', borderRadius: '8px', height: '45px',
                            border: '1px solid #e2e8f0',
                            background: filterCategory === 'All' ? '#fff' : '#eef2ff',
                            color: filterCategory === 'All' ? '#64748b' : '#4f46e5',
                            fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer'
                        }}
                    >
                        <SlidersHorizontal size={15} />
                        {filterCategory === 'All' ? 'All Categories' : filterCategory}
                        <ChevronDown size={14} style={{ opacity: 0.6, transform: showCategoryDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {showCategoryDropdown && (
                        <>
                            <div className="dropdown-overlay" onClick={() => setShowCategoryDropdown(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
                            <div className="dropdown-menu" style={{
                                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                                background: '#fff', borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                zIndex: 50, minWidth: '180px', padding: '4px'
                            }}>
                                <p style={{ padding: '6px 10px 4px', fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', margin: 0 }}>Category</p>
                                {categories.map(opt => (
                                    <button
                                        key={opt.value}
                                        onClick={() => { setFilterCategory(opt.value); setShowCategoryDropdown(false); }}
                                        className={`dropdown-item ${filterCategory === opt.value ? 'active' : ''}`}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            width: '100%', padding: '8px 10px', borderRadius: '7px',
                                            border: 'none', background: filterCategory === opt.value ? '#f1f5f9' : 'transparent',
                                            color: filterCategory === opt.value ? '#0f172a' : '#475569',
                                            fontWeight: filterCategory === opt.value ? 700 : 500,
                                            fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left'
                                        }}
                                    >
                                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.dot, flexShrink: 0, display: 'inline-block' }} />
                                        {opt.value === 'All' ? 'All Categories' : opt.value}
                                        {filterCategory === opt.value && <CheckCircle size={14} style={{ marginLeft: 'auto', color: '#4f46e5' }} />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpenseFilterBar;
