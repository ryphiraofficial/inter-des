import React, { useState } from 'react';
import { Eye, Check, X, Save } from 'lucide-react';
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';
import Template4 from './templates/Template4';

// Sample data for rendering inside the template preview modal
const sampleQuotation = {
    quotationNumber: "QT-2026-001",
    documentType: "Quotation",
    createdAt: new Date().toISOString(),
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    client: {
        name: "Acme Corporation Ltd.",
        phone: "+91 98765 43210",
        email: "contact@acme.com",
        address: "456 Industrial Area, Sector 7, New Delhi, 110001",
        website: "www.acme.com"
    },
    items: [
        {
            itemName: "Modular Kitchen Design & Planning",
            description: "Custom layout, 3D visualization, material selection, and electrical/plumbing planning layouts.",
            quantity: 1,
            rate: 45000,
            amount: 45000
        },
        {
            itemName: "Premium Oak Wood Cabinets",
            description: "Soft-close hydraulic hinges, water-resistant plywood carcass, laminate finish.",
            quantity: 12,
            rate: 8500,
            amount: 102000
        },
        {
            itemName: "Granite Countertop (Black Pearl)",
            description: "20mm thick polished granite slab with edge molding and sink cutout installation.",
            quantity: 1,
            rate: 32000,
            amount: 32000
        },
        {
            itemName: "Under-cabinet LED Lighting System",
            description: "Warm white linear profile lights with driver, wiring, and touch sensors.",
            quantity: 4,
            rate: 2500,
            amount: 10000
        }
    ],
    notes: "Thank you for considering our company for your interior project. We look forward to working with you.",
    termsAndConditions: "1. 50% advance payment required to initiate design/procurement work.\n2. Balance 50% payable upon delivery of materials at site.\n3. Taxes and logistics charges are additional as applicable.\n4. Design modifications post-approval will incur extra charges.",
    discount: 5,
    taxRate: 18
};

const sampleCalc = {
    subtotal: 189000,
    discountAmount: 9450,
    taxAmount: 32319,
    grandTotal: 211869
};

const TEMPLATE_LIST = [
    {
        id: 'Template1',
        name: 'Interactive Premium',
        desc: 'Clean layouts with bold typography, side-by-side structures, and purple visual accents.',
        class: 'mockup-1'
    },
    {
        id: 'Template2',
        name: 'Elegant Minimalist',
        desc: 'Executive style utilizing dark horizontal header bars and a sleek minimalist table design.',
        class: 'mockup-2'
    },
    {
        id: 'Template3',
        name: 'Crimson Editorial',
        desc: 'Modern editorial style featuring crimson highlights and centered corporate identity.',
        class: 'mockup-3'
    },
    {
        id: 'Template4',
        name: 'Modern Corporate',
        desc: 'Splented corporate identity design featuring a dynamic green and navy geometric header strip.',
        class: 'mockup-4'
    }
];

const QuotationTemplates = ({ settings, updateSettingsField, saveSettings, saving, showToast }) => {
    const activeTemplate = settings?.application?.quotationTemplate || 'Template1';
    const [selectedTemplate, setSelectedTemplate] = useState(activeTemplate);
    const [previewingTemplate, setPreviewingTemplate] = useState(null);

    const selectTemplate = (templateId) => {
        setSelectedTemplate(templateId);
        updateSettingsField('application', 'quotationTemplate', templateId);
    };

    const handleSave = () => {
        saveSettings('application');
    };

    const closePreview = () => {
        setPreviewingTemplate(null);
    };

    const handleSelectFromModal = (templateId) => {
        selectTemplate(templateId);
        closePreview();
        showToast('success', `${TEMPLATE_LIST.find(t => t.id === templateId)?.name} selected as active template.`);
    };

    const renderPreviewComponent = (templateId) => {
        const props = {
            quotation: sampleQuotation,
            calc: sampleCalc,
            settings: settings
        };

        switch (templateId) {
            case 'Template1':
                return <Template1 {...props} />;
            case 'Template2':
                return <Template2 {...props} />;
            case 'Template3':
                return <Template3 {...props} />;
            case 'Template4':
                return <Template4 {...props} />;
            default:
                return null;
        }
    };

    return (
        <>
            <h3 className="settings-section-title">Quotation Templates</h3>
            <p className="settings-section-desc">Select and preview custom layouts for your quotations and invoices.</p>
            <hr className="settings-divider" />

            <div className="templates-grid">
                {TEMPLATE_LIST.map((template) => {
                    const isActive = selectedTemplate === template.id;

                    return (
                        <div
                            key={template.id}
                            className={`template-card ${isActive ? 'active' : ''}`}
                            onClick={() => selectTemplate(template.id)}
                        >
                            <div className="template-thumbnail-wrapper">
                                <div className={`template-mockup ${template.class}`}>
                                    {template.id === 'Template1' && (
                                        <>
                                            <div className="mockup-header">
                                                <div className="mockup-logo"></div>
                                                <div className="mockup-title"></div>
                                            </div>
                                            <div className="mockup-body">
                                                <div className="mockup-meta">
                                                    <div className="mockup-meta-left"></div>
                                                    <div className="mockup-meta-right"></div>
                                                </div>
                                                <div className="mockup-table">
                                                    <div className="mockup-table-header"></div>
                                                    <div className="mockup-table-row"></div>
                                                    <div className="mockup-table-row"></div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {template.id === 'Template2' && (
                                        <>
                                            <div className="mockup-header-block">
                                                <div className="mockup-logo"></div>
                                                <div className="mockup-title"></div>
                                            </div>
                                            <div className="mockup-body">
                                                <div className="mockup-addresses">
                                                    <div className="mockup-addr-card"></div>
                                                    <div className="mockup-addr-card"></div>
                                                </div>
                                                <div className="mockup-table" style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                                                    <div className="mockup-table-header"></div>
                                                    <div className="mockup-table-row"></div>
                                                    <div className="mockup-table-row"></div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {template.id === 'Template3' && (
                                        <>
                                            <div className="mockup-top-strip"></div>
                                            <div className="mockup-body">
                                                <div className="mockup-logo-center"></div>
                                                <div className="mockup-grid">
                                                    <div className="mockup-client"></div>
                                                    <div className="mockup-meta"></div>
                                                </div>
                                                <div className="mockup-table" style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                                                    <div className="mockup-table-header"></div>
                                                    <div className="mockup-table-row"></div>
                                                    <div className="mockup-table-row"></div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {template.id === 'Template4' && (
                                        <>
                                            <div className="mockup-slant-header">
                                                <div className="mockup-slant-green"></div>
                                                <div className="mockup-logo-side"></div>
                                            </div>
                                            <div className="mockup-body">
                                                <div className="mockup-addresses">
                                                    <div className="mockup-addr"></div>
                                                    <div className="mockup-addr"></div>
                                                </div>
                                                <div className="mockup-table" style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '6px' }}>
                                                    <div className="mockup-table-header">
                                                        <div className="mockup-th-green"></div>
                                                        <div className="mockup-th-navy"></div>
                                                    </div>
                                                    <div className="mockup-table-row"></div>
                                                    <div className="mockup-table-row"></div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="template-hover-overlay">
                                    <button
                                        className="btn-preview-template"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setPreviewingTemplate(template.id);
                                        }}
                                    >
                                        <Eye size={14} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
                                        Preview Layout
                                    </button>
                                </div>
                            </div>

                            <div className="template-details-section">
                                <div className="template-title-row">
                                    <h4 className="template-name">{template.name}</h4>
                                    {isActive && <span className="template-active-badge">Active</span>}
                                </div>
                                <p className="template-desc">{template.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="settings-save-row">
                <button className="btn-settings-save" onClick={handleSave} disabled={saving}>
                    <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Premium Preview Modal */}
            {previewingTemplate && (
                <div className="template-modal-backdrop" onClick={closePreview}>
                    <div className="template-modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="template-modal-header">
                            <div className="template-modal-info">
                                <h3>Preview - {TEMPLATE_LIST.find(t => t.id === previewingTemplate)?.name}</h3>
                                <p>Rendered with live company profile settings and sample quotation content.</p>
                            </div>
                            <div className="template-modal-actions">
                                <button
                                    className="btn-modal-select"
                                    onClick={() => handleSelectFromModal(previewingTemplate)}
                                >
                                    <Check size={16} /> Use This Template
                                </button>
                                <button className="btn-modal-close" onClick={closePreview}>
                                    <X size={16} /> Close
                                </button>
                            </div>
                        </div>
                        <div className="template-modal-body">
                            <div className="template-modal-scale-wrapper">
                                {renderPreviewComponent(previewingTemplate)}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuotationTemplates;
