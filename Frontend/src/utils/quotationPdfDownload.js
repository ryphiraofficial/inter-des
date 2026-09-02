import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { QuotationPDFDocument } from '../views/admin/quotations/view/components/QuotationPDFDocument';
import { BASE_IMAGE_URL } from '../config/constants';
import axios from 'axios';

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

export const downloadQuotationPDF = async (quotation, settings) => {
    try {
        let fullQuotation = quotation;
        // If items are not loaded or missing, fetch full details
        if (!fullQuotation.items || !fullQuotation.client?.email) {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/quotations/${quotation._id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                if (res.data?.data) {
                    fullQuotation = res.data.data;
                }
            } catch (e) {
                console.warn('Could not fetch full quotation details, using existing quotation item:', e);
            }
        }

        const q = fullQuotation;
        const subtotal = (q.items || []).reduce((sum, item) => sum + (item.amount || 0), 0);
        const discountAmount = (subtotal * (q.discount || 0)) / 100;
        const offerPrice = subtotal - discountAmount;
        const taxAmount = (offerPrice * (q.taxRate || 18)) / 100;
        const grandTotal = offerPrice + taxAmount;
        const calc = { subtotal, discountAmount, offerPrice, taxAmount, grandTotal };

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
        const itemFetches = (q.items || [])
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
            quotation: q,
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
        link.download = `Quotation_${q.quotationNumber || q._id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
    } catch (err) {
        console.error('Error during pdf generation with @react-pdf/renderer:', err);
    }
};
