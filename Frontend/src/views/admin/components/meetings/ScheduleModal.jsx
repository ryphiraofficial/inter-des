import React, { useState } from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';
import { toInputDateTime, DEPARTMENTS } from '../../utils/meetingUtils';
import MeetingDetailsForm from './components/MeetingDetailsForm';
import MeetingInviteesForm from './components/MeetingInviteesForm';

const ScheduleModal = ({ onClose, onSaved, editMeeting, allUsers, createMeeting, updateMeeting }) => {
    const isEdit = !!editMeeting;
    const [form, setForm] = useState({
        title:       editMeeting?.title       || '',
        description: editMeeting?.description || '',
        meetLink:    editMeeting?.meetLink     || '',
        scheduledAt: toInputDateTime(editMeeting?.scheduledAt) || '',
        duration:    editMeeting?.duration    || 60,
        inviteeIds:  editMeeting?.invitees?.map(i => i.user._id || i.user) || []
    });
    const [search, setSearch]             = useState('');
    const [deptFilter, setDeptFilter]     = useState('all');
    const [saving, setSaving]             = useState(false);
    const [error, setError]               = useState('');
    const [showCalendar, setShowCalendar] = useState(false);

    // Guard: only parse if it looks like a valid ISO datetime string
    const isValidDT = form.scheduledAt && form.scheduledAt.includes('T') && !isNaN(new Date(form.scheduledAt).getTime());
    const selectedDate = isValidDT ? new Date(form.scheduledAt) : undefined;
    const timeValue    = isValidDT ? (form.scheduledAt.split('T')[1]?.slice(0, 5) || '') : '';

    const handleDaySelect = (day) => {
        if (!day) { setForm(p => ({ ...p, scheduledAt: '' })); return; }
        const pad = n => String(n).padStart(2, '0');
        // Use existing time or default to 09:00
        const parts = timeValue && timeValue.includes(':') ? timeValue.split(':') : ['09', '00'];
        const h = parts[0] || '09';
        const m = parts[1] || '00';
        setForm(p => ({
            ...p,
            scheduledAt: `${day.getFullYear()}-${pad(day.getMonth()+1)}-${pad(day.getDate())}T${h}:${m}`
        }));
        setShowCalendar(false);
    };

    const displayDate = selectedDate
        ? selectedDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Pick a date';

    const filteredUsers = allUsers.filter(u => {
        const matchesSearch = u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                              u.role?.toLowerCase().includes(search.toLowerCase());
        
        if (!matchesSearch) return false;
        if (deptFilter === 'all') return true;

        const role = u.role?.toLowerCase() || '';
        const keywords = deptFilter.split('|');
        return keywords.some(kw => role.includes(kw));
    });

    const toggleInvitee = (id) => {
        setForm(prev => ({
            ...prev,
            inviteeIds: prev.inviteeIds.includes(id)
                ? prev.inviteeIds.filter(i => i !== id)
                : [...prev.inviteeIds, id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.meetLink || !form.scheduledAt) {
            setError('Title, Meet Link, and Date/Time are required.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const payload = { ...form, scheduledAt: new Date(form.scheduledAt).toISOString() };
            if (isEdit) {
                await updateMeeting({ id: editMeeting._id, ...payload }).unwrap();
            } else {
                await createMeeting(payload).unwrap();
            }
            onSaved();
        } catch (err) {
            setError(err.message || 'Failed to save meeting.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="meeting-modal-overlay" onClick={onClose}>
            <div className="meeting-modal" onClick={e => e.stopPropagation()}>
                <div className="meeting-modal-header">
                    <h2>{isEdit ? 'Edit Meeting' : 'Schedule a Meeting'}</h2>
                    <button type="button" className="meeting-modal-close" onClick={onClose}><X size={20} /></button>
                </div>

                {error && <div className="meeting-modal-error"><AlertCircle size={16} />{error}</div>}

                <form onSubmit={handleSubmit} className="meeting-modal-body">
                    <div className="meeting-modal-grid">

                        <MeetingDetailsForm 
                            form={form} 
                            setForm={setForm} 
                            showCalendar={showCalendar} 
                            setShowCalendar={setShowCalendar} 
                            displayDate={displayDate} 
                            selectedDate={selectedDate} 
                            handleDaySelect={handleDaySelect} 
                            timeValue={timeValue} 
                            isValidDT={isValidDT} 
                        />

                        <MeetingInviteesForm 
                            form={form} 
                            deptFilter={deptFilter} 
                            setDeptFilter={setDeptFilter} 
                            search={search} 
                            setSearch={setSearch} 
                            filteredUsers={filteredUsers} 
                            toggleInvitee={toggleInvitee} 
                        />
                    </div>

                    <div className="meeting-modal-footer">
                        <button type="button" className="meeting-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="meeting-btn-primary" disabled={saving}>
                            {saving ? <><Loader size={16} className="spin" /> Saving...</> : isEdit ? 'Save Changes' : 'Schedule Meeting'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
