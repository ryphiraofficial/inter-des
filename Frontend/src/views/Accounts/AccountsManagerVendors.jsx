import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, X, Building2 } from 'lucide-react';
import { vendorAPI } from '../../models/api';

const AccountsManagerVendors = ({ user }) => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editVendor, setEditVendor] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', category: '', gstNumber: '' });

    useEffect(() => {
        fetchVendors();
        const handleOpenModal = () => openCreate();
        window.addEventListener('open-create-vendor-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-vendor-modal', handleOpenModal);
    }, []);

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const res = await vendorAPI.getAll().catch(() => ({ success: false }));
            if (res?.success) setVendors(res.data || []);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditVendor(null);
        setForm({ name: '', email: '', phone: '', address: '', category: '', gstNumber: '' });
        setShowModal(true);
    };

    const openEdit = (v) => {
        setEditVendor(v);
        setForm({ name: v.name || '', email: v.email || '', phone: v.phone || '', address: v.address || '', category: v.category || '', gstNumber: v.gstNumber || '' });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name) return alert('Vendor name is required');
        try {
            setSubmitting(true);
            let res;
            if (editVendor) {
                res = await vendorAPI.update(editVendor._id, form);
            } else {
                res = await vendorAPI.create(form);
            }
            if (res?.success) {
                setShowModal(false);
                fetchVendors();
            }
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vendor?')) return;
        try {
            await vendorAPI.delete(id);
            setVendors(prev => prev.filter(v => v._id !== id));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const filtered = vendors.filter(v =>
        v.name?.toLowerCase().includes(search.toLowerCase()) ||
        v.category?.toLowerCase().includes(search.toLowerCase()) ||
        v.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ padding: '2rem 2.5rem', minHeight: '100vh', margin: '-24px -24px 0 -24px' }}>
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input type="text" placeholder="Search by name, category or email..." value={search} onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', height: '45px', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        <Building2 size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                        <p>No vendors found.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['Vendor', 'Category', 'Email', 'Phone', 'GST', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((v, i) => (
                                <tr key={v._id || i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Building2 size={16} color="#94a3b8" />
                                            </div>
                                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{v.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        {v.category && <span style={{ background: '#e0e7ff', color: '#6366f1', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>{v.category}</span>}
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{v.email || '—'}</td>
                                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{v.phone || '—'}</td>
                                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px' }}>{v.gstNumber || '—'}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openEdit(v)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: '#6366f1' }}><Edit size={14} /></button>
                                            <button onClick={() => handleDelete(v._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '480px', maxWidth: '95vw' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{editVendor ? 'Edit Vendor' : 'Add Vendor'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><X size={20} /></button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { label: 'Vendor Name *', key: 'name', placeholder: 'e.g. Modi Tiles Ltd.' },
                                { label: 'Category', key: 'category', placeholder: 'e.g. Tiles, Plumbing, Electricals' },
                                { label: 'Email', key: 'email', placeholder: 'vendor@example.com' },
                                { label: 'Phone', key: 'phone', placeholder: '+91 XXXXX XXXXX' },
                                { label: 'Address', key: 'address', placeholder: 'Vendor address' },
                                { label: 'GST Number', key: 'gstNumber', placeholder: 'e.g. 29ABCDE1234F1Z5' },
                            ].map(f => (
                                <div key={f.key}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>{f.label}</label>
                                    <input type="text" placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                            <button onClick={handleSubmit} disabled={submitting} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>
                                {submitting ? 'Saving...' : editVendor ? 'Save Changes' : 'Add Vendor'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default AccountsManagerVendors;
