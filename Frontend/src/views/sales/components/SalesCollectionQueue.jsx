import React, { useState, useEffect } from 'react';
import { FileText, Send, CheckCircle, Clock } from 'lucide-react';
import { useGetPendingCollectionsQuery, useGenerateAdvanceInvoiceMutation } from '../../../store/api/accountsApi';
import Skeleton from './Skeleton';
import { useAppSelector } from '../../../store/hooks';
import { selectUser } from '../../../store/slices/authSlice';

const StaffCollectionQueue = ({}) => {
    const user = useAppSelector(selectUser);
    const [projects, setProjects] = useState([]);
    const { data: res, isLoading: loading, refetch: fetchData } = useGetPendingCollectionsQuery();
    const [generateAdvanceInvoice] = useGenerateAdvanceInvoiceMutation();

    useEffect(() => {
        if (res?.success) {
            // Filter to only show projects assigned to this specific staff member
            const myProjects = (res.data || []).filter(p => {
                const assignedStaff = p.assignedAccountsStaff;
                if (!assignedStaff) return false;
                
                const assignedStaffId = assignedStaff._id || assignedStaff;
                const loggedInUserId = user?._id || user?.id;
                
                // 1. Match by user ID
                if (loggedInUserId && assignedStaffId === loggedInUserId) return true;
                
                // 2. Fallback to match by email
                const assignedEmail = assignedStaff.email;
                const loggedInEmail = user?.email;
                if (assignedEmail && loggedInEmail && assignedEmail.toLowerCase() === loggedInEmail.toLowerCase()) return true;
                
                // 3. Fallback to match by staffId
                const assignedStaffIdVal = assignedStaff.staffId;
                const loggedInStaffIdVal = user?.staffId;
                if (assignedStaffIdVal && loggedInStaffIdVal && assignedStaffIdVal === loggedInStaffIdVal) return true;

                return false;
            });
            setProjects(myProjects);
        }
    }, [res, user]);

    const handleGenerateInvoice = async (projectId) => {
        try {
            await generateAdvanceInvoice({ projectId }).unwrap();
            alert('Invoice Generated & Sent!');
            fetchData();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    };

    const handleRecordPayment = async (projectId) => {
        // A placeholder for recording a payment
        alert('Payment recording modal would open here.');
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Advance Payment Collection</h2>
                <p style={{ color: '#64748b', margin: '4px 0 0' }}>Projects assigned to you for advance payment collection.</p>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <Skeleton width="75%" height="22px" />
                                    <div style={{ height: '10px' }} />
                                    <Skeleton width="50%" height="15px" />
                                </div>
                                <Skeleton width="90px" height="26px" borderRadius="20px" />
                            </div>
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Skeleton width="50px" height="12px" style={{ marginBottom: '6px' }} />
                                    <Skeleton width="90px" height="18px" />
                                </div>
                                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Skeleton width="100px" height="12px" style={{ marginBottom: '6px' }} />
                                    <Skeleton width="80px" height="18px" />
                                </div>
                            </div>
                            <Skeleton width="100%" height="44px" borderRadius="8px" />
                        </div>
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', color: '#64748b' }}>
                    <CheckCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <p>No pending collections assigned to you.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                    {projects.map(p => (
                        <div key={p._id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>{p.name}</h3>
                                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>Client: {p.client?.name || '—'}</p>
                                </div>
                                <span style={{ background: p.paymentStatus === 'Invoice Sent' ? '#e0e7ff' : '#fef3c7', color: p.paymentStatus === 'Invoice Sent' ? '#4f46e5' : '#d97706', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                                    {p.paymentStatus}
                                </span>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Budget</p>
                                    <p style={{ margin: 0, fontWeight: 600, color: '#334155' }}>₹{(p.budget || 0).toLocaleString('en-IN')}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Advance Due (50%)</p>
                                    <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>₹{(p.advanceAmount || 0).toLocaleString('en-IN')}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
                                {p.paymentStatus === 'Pending Advance' ? (
                                    <button 
                                        onClick={() => handleGenerateInvoice(p._id)}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#4f46e5', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        <FileText size={16} /> Generate Invoice
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleRecordPayment(p._id)}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#10b981', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        <CheckCircle size={16} /> Record Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StaffCollectionQueue;
