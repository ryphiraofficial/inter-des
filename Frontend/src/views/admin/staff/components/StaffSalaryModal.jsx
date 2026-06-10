import React from 'react';
import { X, IndianRupee, Edit, Calendar, Loader } from 'lucide-react';
import DatePicker from '../../components/DatePicker';

const StaffSalaryModal = ({ 
    show, setShow, salaryLoading, salaryStaff, salaryEditMode, setSalaryEditMode,
    salaryForm, setSalaryForm, handleSalarySubmit, salarySubmitting, fmtINR, calcGross, calcDeductions 
}) => {
    if (!show) return null;
    return (
        <div className="staff-drawer-overlay" onClick={() => { setShow(false); setSalaryEditMode(false); }}>
            <div className="staff-drawer-content salary salary-modal" onClick={e => e.stopPropagation()}>
                <div className="staff-drawer-header">
                    <div className="header-title"><IndianRupee size={22} color="#10b981" /><h3>Salary Management</h3></div>
                    <button className="modal-close" onClick={() => { setShow(false); setSalaryEditMode(false); }}><X size={20} /></button>
                </div>
                <div className="staff-drawer-body" data-lenis-prevent>
                    {salaryLoading ? (
                        <div className="salary-skeleton">Loading...</div>
                    ) : salaryStaff ? (
                        <>
                            <div className="salary-staff-banner">
                                <div className="staff-avatar" style={{ width: 48, height: 48, fontSize: '1.2rem', flexShrink: 0 }}>{salaryStaff.name?.charAt(0).toUpperCase()}</div>
                                <div><div className="salary-staff-name">{salaryStaff.name}</div><div className="salary-staff-meta">{salaryStaff.staffId} · {salaryStaff.role}</div></div>
                                {!salaryEditMode && <button className="salary-edit-trigger" onClick={() => setSalaryEditMode(true)}><Edit size={15} /> Edit Salary</button>}
                            </div>
                            {salaryEditMode ? (
                                <form onSubmit={(e) => handleSalarySubmit(e, salaryStaff, salaryForm)}>
                                    <div className="salary-section-title">Earnings</div>
                                    <div className="salary-form-grid">
                                        {['baseSalary', 'hra', 'travelAllowance', 'otherAllowances'].map(key => (
                                            <div className="salary-form-group" key={key}>
                                                <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                                                <div className="salary-input-wrap"><span className="salary-prefix">₹</span><input type="number" min="0" value={salaryForm[key]} onChange={e => setSalaryForm(p => ({ ...p, [key]: e.target.value }))} placeholder="0" /></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="salary-section-title" style={{ marginTop: '1.25rem' }}>Deductions</div>
                                    <div className="salary-form-grid">
                                        {['providentFund', 'taxDeduction', 'otherDeductions'].map(key => (
                                            <div className="salary-form-group" key={key}>
                                                <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                                                <div className="salary-input-wrap"><span className="salary-prefix">₹</span><input type="number" min="0" value={salaryForm[key]} onChange={e => setSalaryForm(p => ({ ...p, [key]: e.target.value }))} placeholder="0" /></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="salary-summary-bar">
                                        <div className="salary-summary-item green"><span>Gross Pay</span><strong>{fmtINR(calcGross(salaryForm))}</strong></div>
                                        <div className="salary-summary-item red"><span>Deductions</span><strong>- {fmtINR(calcDeductions(salaryForm))}</strong></div>
                                        <div className="salary-summary-item blue"><span>Net Pay</span><strong>{fmtINR(calcGross(salaryForm) - calcDeductions(salaryForm))}</strong></div>
                                    </div>
                                    <div className="salary-section-title" style={{ marginTop: '0.5rem' }}>Details</div>
                                    <div className="salary-form-grid" style={{ marginBottom: '1.5rem' }}>
                                        <div className="salary-form-group">
                                            <label>Effective From</label>
                                            <div className="salary-input-wrap">
                                                <input type="date" value={salaryForm.effectiveFrom} onChange={e => setSalaryForm(p => ({ ...p, effectiveFrom: e.target.value }))} className="salary-date-input" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '0.6rem 0.75rem' }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="staff-drawer-footer" style={{ paddingTop: 0 }}>
                                        <button type="button" className="btn-cancel" onClick={() => setSalaryEditMode(false)} disabled={salarySubmitting}>Cancel</button>
                                        <button type="submit" className="btn-submit" disabled={salarySubmitting}>{salarySubmitting ? <Loader size={16} className="spinner" /> : 'Save Salary'}</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <div className="salary-view-container">
                                        <div className="salary-view-section earnings-card">
                                            <div className="salary-view-title earnings">Earnings</div>
                                            <div className="salary-view-grid">
                                                {[{ l: 'Basic Salary', v: salaryStaff.salary?.baseSalary }, { l: 'HRA', v: salaryStaff.salary?.hra }, { l: 'Travel Allowance', v: salaryStaff.salary?.travelAllowance }, { l: 'Other Allowances', v: salaryStaff.salary?.otherAllowances }].map(x => (
                                                    <div className="salary-view-row" key={x.l}><span>{x.l}</span><span className="salary-view-val green">{fmtINR(x.v)}</span></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="salary-view-section deductions-card">
                                            <div className="salary-view-title deductions">Deductions</div>
                                            <div className="salary-view-grid">
                                                {[{ l: 'Provident Fund (PF)', v: salaryStaff.salary?.providentFund }, { l: 'TDS / Income Tax', v: salaryStaff.salary?.taxDeduction }, { l: 'Other Deductions', v: salaryStaff.salary?.otherDeductions }].map(x => (
                                                    <div className="salary-view-row" key={x.l}><span>{x.l}</span><span className="salary-view-val red">{fmtINR(x.v)}</span></div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="salary-summary-bar">
                                            <div className="salary-summary-item green"><span>Gross Pay</span><strong>{fmtINR(calcGross(salaryStaff.salary || {}))}</strong></div>
                                            <div className="salary-summary-item red"><span>Deductions</span><strong>- {fmtINR(calcDeductions(salaryStaff.salary || {}))}</strong></div>
                                            <div className="salary-summary-item blue"><span>Net Pay</span><strong>{fmtINR(calcGross(salaryStaff.salary || {}) - calcDeductions(salaryStaff.salary || {}))}</strong></div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default StaffSalaryModal;
