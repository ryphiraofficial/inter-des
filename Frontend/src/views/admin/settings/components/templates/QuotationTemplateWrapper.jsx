import React from 'react';
import Template1 from './Template1';
import Template2 from './Template2';
import Template3 from './Template3';
import Template4 from './Template4';

const QuotationTemplateWrapper = ({ quotation, calc, settings, children }) => {
    const templateName = settings?.application?.quotationTemplate || 'Template1';

    switch (templateName) {
        case 'Template1':
            return <Template1 quotation={quotation} calc={calc} settings={settings} />;
        case 'Template2':
            return <Template2 quotation={quotation} calc={calc} settings={settings} />;
        case 'Template3':
            return <Template3 quotation={quotation} calc={calc} settings={settings} />;
        case 'Template4':
            return <Template4 quotation={quotation} calc={calc} settings={settings} />;
        case 'Original':
            return <>{children}</>;
        default:
            return <Template1 quotation={quotation} calc={calc} settings={settings} />;
    }
};

export default QuotationTemplateWrapper;
