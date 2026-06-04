import React from 'react';
import DatePicker from '../../../../common/DatePicker';
import CustomSelect from '../../../../common/CustomSelect';
import StaffChecklist from './StaffChecklist';

const inputStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0',
    fontSize: '13px', color: '#0f172a', outline: 'none', boxSizing: 'border-box',
    transition: 'all 0.15s', backgroundColor: '#ffffff'
};

const handleFocus = (e) => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(148, 163, 184, 0.15)'; };
const handleBlur  = (e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; };

const TaskFormFields = ({ taskFormData, setTaskFormData, staffList, quotations }) => (
    <>
        {/* Task Title */}
        <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>Task Title</label>
            <input type="text" placeholder="e.g., Living Room 3D Render" value={taskFormData.title}
                onChange={e => setTaskFormData({ ...taskFormData, title: e.target.value })}
                required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
        </div>

        {/* Description */}
        <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>Description</label>
            <textarea placeholder="Provide details..." value={taskFormData.description}
                onChange={e => setTaskFormData({ ...taskFormData, description: e.target.value })}
                rows="2" style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                onFocus={handleFocus} onBlur={handleBlur} />
        </div>

        {/* Staff Checklist */}
        <StaffChecklist
            staffList={staffList}
            assignedTo={taskFormData.assignedTo}
            taskFormData={taskFormData}
            setTaskFormData={setTaskFormData}
        />

        {/* Creative Requirements */}
        <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>Creative Requirements / Client Specifications</label>
            <textarea value={taskFormData.creativeRequirements}
                onChange={e => setTaskFormData({ ...taskFormData, creativeRequirements: e.target.value })}
                placeholder="Enter specific creative requirements for the designer..."
                rows="2" required style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                onFocus={handleFocus} onBlur={handleBlur} />
        </div>

        {/* Priority + Due Date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
                <CustomSelect label="Priority"
                    options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }, { value: 'Critical', label: 'Critical' }]}
                    value={taskFormData.priority}
                    onChange={e => setTaskFormData({ ...taskFormData, priority: e.target.value })} />
            </div>
            <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#0f172a', marginBottom: '6px' }}>Due Date <span style={{ color: '#ef4444' }}>*</span></label>
                <DatePicker value={taskFormData.dueDate} onChange={(dateStr) => setTaskFormData({ ...taskFormData, dueDate: dateStr })}
                    placeholder="Pick a date" minDate={new Date()} align="right" />
            </div>
        </div>

        {/* Project */}
        <div>
            <CustomSelect label="Assign to Project" required
                options={quotations.map(q => ({ value: q._id, label: q.projectName }))}
                value={taskFormData.project}
                onChange={e => setTaskFormData({ ...taskFormData, project: e.target.value })}
                placeholder="Select Project" />
        </div>
    </>
);

export default TaskFormFields;
