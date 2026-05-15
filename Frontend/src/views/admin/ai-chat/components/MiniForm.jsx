import React, { useState } from 'react';
import { Zap } from 'lucide-react';

const MiniForm = ({ type, initialData, onConfirm }) => {
    const [formData, setFormData] = useState(initialData || {});

    const fields = {
        QUOTATION: [
            { name: 'projectName', label: 'Project Name', type: 'text' },
            { name: 'clientName', label: 'Client Name', type: 'text' },
            { name: 'itemsCount', label: 'Number of Items', type: 'number' }
        ],
        CLIENT: [
            { name: 'name', label: 'Client Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'address', label: 'Site Address', type: 'text' }
        ],
        INVENTORY: [
            { name: 'itemName', label: 'Item Name', type: 'text' },
            { name: 'section', label: 'Section', type: 'select', options: ['Plywood', 'Hardware', 'Laminate', 'Veneer'] },
            { name: 'price', label: 'Price', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text', placeholder: 'e.g. sheets, pcs' }
        ],
        TASK: [
            { name: 'title', label: 'Task Title', type: 'text' },
            { name: 'priority', label: 'Priority', type: 'select', options: ['High', 'Medium', 'Low'] },
            { name: 'dueDate', label: 'Due Date', type: 'date' }
        ]
    };

    const currentFields = fields[type] || [];

    return (
        <div className="ai-mini-form">
            <div className="form-header">
                <h4>GENERATE {type}</h4>
            </div>
            <div className="form-fields">
                {currentFields.map(f => (
                    <div key={f.name} className="mini-field-group">
                        <label>{f.label}</label>
                        {f.type === 'select' ? (
                            <select
                                className="mini-input"
                                value={formData[f.name] || ''}
                                onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                            >
                                {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        ) : (
                            <input
                                className="mini-input"
                                type={f.type}
                                placeholder={f.placeholder || ''}
                                value={formData[f.name] || ''}
                                onChange={(e) => setFormData({ ...formData, [f.name]: e.target.value })}
                            />
                        )}
                    </div>
                ))}

                {type === 'QUOTATION' && formData.items && (
                    <div className="mini-items-preview">
                        <label>Draft Items List:</label>
                        <div className="mini-items-scroll">
                            {formData.items.map((item, idx) => (
                                <div key={idx} className="mini-item-row">
                                    <span className="item-dot">•</span>
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-qty">{item.qty} {item.unit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <button className="btn-confirm-form" onClick={() => onConfirm(formData)}>
                Confirm & Complete <Zap size={14} />
            </button>
        </div>
    );
};

export default MiniForm;
