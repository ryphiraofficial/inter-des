import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import CustomSelect from './CustomSelect';
import DatePicker from './DatePicker';

const SiteVisitDetailsForm = ({ visitData, setVisitData, clients, tasks }) => {
    return (
        <div className="form-section card">
            <div className="form-group site-visit-select">
                <CustomSelect
                    label="Select Assigned Client / Project *"
                    options={clients.map(c => ({ value: c._id, label: c.name }))}
                    value={visitData.client}
                    onChange={(e) => setVisitData({ ...visitData, client: e.target.value, task: '' })}
                    placeholder="Search among your assigned clients..."
                    required
                />
            </div>

            <div className="form-group site-visit-select">
                <CustomSelect
                    label="Select Assigned Task (Optional)"
                    options={tasks.map(t => ({ value: t._id, label: t.title }))}
                    value={visitData.task}
                    onChange={(e) => setVisitData({ ...visitData, task: e.target.value })}
                    placeholder={visitData.client ? "Select related task..." : "First select a client..."}
                    disabled={!visitData.client}
                />
            </div>

            <div className="form-grid">
                <div className="form-group">
                    <label>Location / Site Address</label>
                    <div className="input-with-icon">
                        <MapPin size={18} />
                        <input
                            type="text"
                            placeholder="Enter site locality"
                            value={visitData.location}
                            onChange={(e) => setVisitData({ ...visitData, location: e.target.value })}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label><Calendar size={14} style={{ marginRight: '4px' }} /> Visit Date</label>
                    <DatePicker
                        value={visitData.visitDate}
                        onChange={(val) => setVisitData({ ...visitData, visitDate: val })}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Progress Notes / Observation</label>
                <textarea
                    placeholder="Describe work progress, issues found, or material requirements..."
                    rows="4"
                    value={visitData.notes}
                    onChange={(e) => setVisitData({ ...visitData, notes: e.target.value })}
                ></textarea>
            </div>
        </div>
    );
};

export default SiteVisitDetailsForm;
