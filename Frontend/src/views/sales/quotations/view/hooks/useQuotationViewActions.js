import { useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { QuotationPDFDocument } from '../../../../admin/quotations/view/components/QuotationPDFDocument';
import { BASE_IMAGE_URL } from '../../../../../config/constants';

const fetchImageAsBase64 = async (url) => {
    try {
        const response = await fetch(url, { mode: 'cors' });
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.warn('Failed to fetch image as base64, using raw URL instead:', error);
        return url;
    }
};

export const useQuotationViewActions = ({ isStaff, id, quotationNumber, printRef, quotation, settings, calc }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(isStaff ? '/staff/quotations' : '/quotations');
    };

    const handleEdit = () => {
        navigate(isStaff ? `/staff/quotations/edit/${id}` : `/quotations/edit/${id}`);
    };

    const handlePrintTrigger = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Quotation_${quotationNumber || id}`,
    });

    const handlePrint = () => {
        handlePrintTrigger();
    };

    const handleDownload = async () => {
        try {
            const companyLogo = settings?.company?.companyLogo;
            const getImageUrl = (path) => {
                if (!path) return '';
                if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
                return `${BASE_IMAGE_URL}${path}`;
            };

            const logoUrl = companyLogo ? getImageUrl(companyLogo) : null;
            let base64Logo = null;
            if (logoUrl) {
                base64Logo = await fetchImageAsBase64(logoUrl);
            }

            // Fetch item images in parallel
            const itemImages = {};
            const itemFetches = (quotation?.items || [])
                .filter(item => item.image)
                .map(async (item) => {
                    const url = getImageUrl(item.image);
                    const base64 = await fetchImageAsBase64(url);
                    if (base64) {
                        itemImages[item.image] = base64;
                    }
                });
            await Promise.all(itemFetches);

            // Generate React-PDF document instance
            const doc = React.createElement(QuotationPDFDocument, {
                quotation: quotation,
                calc: calc,
                settings: settings,
                companyLogoUrl: base64Logo,
                itemImages: itemImages
            });

            // Generate PDF Blob
            const blob = await pdf(doc).toBlob();
            
            // Trigger browser download
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `Quotation_${quotationNumber || id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
        } catch (err) {
            console.error('Error during pdf generation with @react-pdf/renderer', err);
            // Fallback to react-to-print if React-PDF fails
            handlePrintTrigger();
        }
    };

    return {
        handleBack,
        handleEdit,
        handlePrint,
        handleDownload
    };
};
