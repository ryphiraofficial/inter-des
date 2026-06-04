import React from 'react';
import { Link2, Calendar } from 'lucide-react';
import { Calendar as CalendarUI } from '../../../../../components/ui/calendar.jsx';
import { TimePicker } from '../../../../../components/ui/time-picker.jsx';

const MeetingDetailsForm = ({ 
    form, 
    setForm, 
    showCalendar, 
    setShowCalendar, 
    displayDate, 
    selectedDate, 
    handleDaySelect, 
    timeValue, 
    isValidDT 
}) => {
    return (
        <div className="meeting-modal-section">
            <h3>Meeting Details</h3>

            <div className="meeting-field">
                <label>Title *</label>
                <input
                    className="sdcn-input"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Weekly Sync"
                    required
                />
            </div>

            <div className="meeting-field">
                <label>Description</label>
                <textarea
                    className="sdcn-input"
                    value={form.description}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Agenda or notes..."
                    rows={2}
                />
            </div>

            <div className="meeting-field">
                <label>Google Meet Link *</label>
                <div className="sdcn-input-icon">
                    <Link2 size={15} />
                    <input
                        className="sdcn-input"
                        value={form.meetLink}
                        onChange={e => setForm(p => ({ ...p, meetLink: e.target.value }))}
                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                        required
                    />
                </div>
            </div>

            <div className="meeting-field">
                <label>Date *</label>
                <div className="sdcn-popover-wrapper">
                    <button
                        type="button"
                        className={`sdcn-date-trigger ${!selectedDate ? 'placeholder' : ''}`}
                        onClick={() => setShowCalendar(v => !v)}
                    >
                        <Calendar size={15} />
                        {displayDate}
                    </button>
                    {showCalendar && (
                        <div className="sdcn-calendar-popover">
                            <CalendarUI
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDaySelect}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="meeting-field-row">
                <div className="meeting-field">
                    <label>Time *</label>
                    <TimePicker
                        value={timeValue}
                        onChange={(t) => {
                            const today = new Date();
                            const pad   = n => String(n).padStart(2, '0');
                            const base  = isValidDT
                                ? form.scheduledAt.split('T')[0]
                                : `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
                            setForm(p => ({ ...p, scheduledAt: `${base}T${t}` }));
                        }}
                        required
                    />
                </div>
                <div className="meeting-field">
                    <label>Duration (mins)</label>
                    <input
                        type="number"
                        className="sdcn-input"
                        min={5}
                        value={form.duration}
                        onChange={e => setForm(p => ({ ...p, duration: Number(e.target.value) }))}
                    />
                </div>
            </div>
        </div>
    );
};

export default MeetingDetailsForm;
