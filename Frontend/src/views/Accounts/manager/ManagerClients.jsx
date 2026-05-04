import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Edit, X, Users, Phone, Mail, MapPin, FileText, User } from 'lucide-react';
import { clientAPI } from '../../../models/api';

const inputBase = {
    width: '100%', padding: '10px 12px 10px 38px',
    border: '1.5px solid #e2e8f0', borderRadius: '9px',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    color: '#0f172a', background: '#fafafa', transition: 'border-color 0.15s, box-shadow 0.15s'
};
const iconStyle = { position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', pointerEvents: 'none' };

const ManagerClients = ({ user }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editClient, setEditClient] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', gstNumber: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchClients();
        const handleOpenModal = () => openCreate();
        window.addEventListener('open-create-client-modal', handleOpenModal);
        return () => window.removeEventListener('open-create-client-modal', handleOpenModal);
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const res = await clientAPI.getAll();
            if (res?.success) setClients(res.data || []);
        } catch (err) {
            console.error('Error fetching clients:', err);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditClient(null);
        setForm({ name: '', email: '', phone: '', address: '', gstNumber: '' });
        setShowModal(true);
    };

    const openEdit = (client) => {
        setEditClient(client);
        setForm({ name: client.name || '', email: client.email || '', phone: client.phone || '', address: client.address || '', gstNumber: client.gstNumber || '' });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!form.name) return alert('Client name is required');
        try {
            setSubmitting(true);
            let res;
            if (editClient) {
                res = await clientAPI.update(editClient._id, form);
            } else {
                res = await clientAPI.create(form);
            }
            if (res?.success) {
                setShowModal(false);
                fetchClients();
            }
        } catch (err) {
            alert('Error saving client: ' + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this client?')) return;
        try {
            await clientAPI.delete(id);
            setClients(prev => prev.filter(c => c._id !== id));
        } catch (err) {
            alert('Error deleting: ' + err.message);
        }
    };

    const filtered = clients.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.phone?.includes(search)
    );

    return (
        <div style={{ padding: '2rem 2.5rem', minHeight: '100vh', margin: '-24px -24px 0 -24px' }}>
            <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Search */}
            <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                    type="text"
                    placeholder="Search by name, email or phone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ width: '100%', height: '45px', padding: '0.6rem 1rem 0.6rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* Table */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading clients...</div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        <Users size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                        <p>No clients found.</p>
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#f8fafc' }}>
                                {['Client', 'Email', 'Phone', 'GST Number', 'Actions'].map(h => (
                                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((c, i) => (
                                <tr key={c._id || i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0e7ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                                                {c.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{c.name}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>{c.email || '—'}</td>
                                    <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>{c.phone || '—'}</td>
                                    <td style={{ padding: '14px 16px', color: '#475569', fontSize: '13px' }}>{c.gstNumber || '—'}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => openEdit(c)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: '#6366f1' }}><Edit size={14} /></button>
                                            <button onClick={() => handleDelete(c._id)} style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', width: '480px', maxWidth: '95vw', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>

                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{editClient ? 'Edit Client' : 'Add New Client'}</h3>
                                <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#94a3b8' }}>{editClient ? 'Update client details' : 'Fill in the details to create a new client'}</p>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: '#64748b', display: 'flex' }}><X size={18} /></button>
                        </div>

                        {/* Fields */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                            {/* Client Name */}
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Client Name *</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={15} style={iconStyle} />
                                    <input type="text" placeholder="e.g. Sharma Residences" value={form.name}
                                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                        style={inputBase}
                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; e.target.style.background = '#fff'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa'; }}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={15} style={iconStyle} />
                                    <input type="email" placeholder="email@example.com" value={form.email}
                                        onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                        style={inputBase}
                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; e.target.style.background = '#fff'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa'; }}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Phone</label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={15} style={iconStyle} />
                                    <input type="text" placeholder="+91 XXXXX XXXXX" value={form.phone}
                                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                                        style={inputBase}
                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; e.target.style.background = '#fff'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa'; }}
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Address</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={15} style={iconStyle} />
                                    <input type="text" placeholder="Full address" value={form.address}
                                        onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                                        style={inputBase}
                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; e.target.style.background = '#fff'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa'; }}
                                    />
                                </div>
                            </div>

                            {/* GST Number */}
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>GST Number</label>
                                <div style={{ position: 'relative' }}>
                                    <FileText size={15} style={iconStyle} />
                                    <input type="text" placeholder="e.g. 29ABCDE1234F1Z5" value={form.gstNumber}
                                        onChange={e => setForm(p => ({ ...p, gstNumber: e.target.value }))}
                                        style={inputBase}
                                        onFocus={e => { e.target.style.borderColor = '#6366f1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; e.target.style.background = '#fff'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#fafafa'; }}
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '22px', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowModal(false)}
                                style={{ padding: '10px 20px', borderRadius: '9px', border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px', color: '#475569' }}>
                                Cancel
                            </button>
                            <button onClick={handleSubmit} disabled={submitting}
                                style={{ padding: '10px 24px', borderRadius: '9px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '14px', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                                {submitting ? 'Saving...' : editClient ? 'Save Changes' : 'Add Client'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default ManagerClients;
