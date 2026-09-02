import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333333',
    backgroundColor: '#ffffff',
  },
  // Cover Page Styles
  coverPage: {
    backgroundColor: '#111625',
    color: '#ffffff',
    height: '100%',
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  coverHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 20,
  },
  coverLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C5A880',
    letterSpacing: 1.5,
  },
  coverLogoImage: {
    maxHeight: 50,
    maxWidth: 150,
    objectFit: 'contain',
  },
  coverCompanyName: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  coverCompanyTagline: {
    fontSize: 9,
    color: '#C5A880',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  coverBody: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  coverSubtitle: {
    fontSize: 11,
    color: '#C5A880',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  coverTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 1.25,
    marginBottom: 20,
  },
  coverDivider: {
    width: 100,
    height: 3,
    backgroundColor: '#C5A880',
    marginBottom: 40,
  },
  coverDetailsGrid: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 24,
  },
  coverDetailsColLeft: {
    width: '55%',
  },
  coverDetailsColRight: {
    width: '45%',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
    paddingLeft: 24,
  },
  coverSectionLabel: {
    fontSize: 8,
    color: '#C5A880',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  coverClientName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  coverDetailsText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 4,
  },
  coverDetailsBold: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  coverFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.4)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 20,
  },

  // Main Template Styles
  contentPage: {
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
  },
  invoiceHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTextContainer: {
    marginLeft: 10,
  },
  brandName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111625',
  },
  brandMotto: {
    fontSize: 8,
    color: '#777777',
    marginTop: 2,
  },
  brandLogo: {
    maxHeight: 35,
    maxWidth: 100,
    objectFit: 'contain',
  },
  titleBlock: {
    alignItems: 'flex-end',
  },
  documentType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111625',
  },
  documentDate: {
    fontSize: 8,
    color: '#777777',
    marginTop: 4,
  },
  addressCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
  },
  addressCol: {
    width: '48%',
  },
  addressBlockTitle: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#C5A880',
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  addressClientName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111625',
    marginBottom: 4,
  },
  addressDetails: {
    fontSize: 9,
    color: '#555555',
    lineHeight: 1.4,
  },
  metaStrip: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 8,
    marginBottom: 20,
  },
  metaItem: {
    marginRight: 20,
    fontSize: 9,
    color: '#555555',
  },
  metaValue: {
    fontWeight: 'bold',
    color: '#111625',
  },

  // Table Styles
  table: {
    display: 'table',
    width: 'auto',
    marginBottom: 20,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#111625',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 32,
    alignItems: 'center',
  },
  tableRowSection: {
    flexDirection: 'row',
    backgroundColor: '#1a233a',
    color: '#ffffff',
    fontWeight: 'bold',
    minHeight: 24,
    alignItems: 'center',
  },
  tableColIdxHeader: { width: '6%', padding: 6, fontSize: 9, color: '#ffffff', fontWeight: 'bold' },
  tableColDescHeader: { width: '36%', padding: 6, fontSize: 9, color: '#ffffff', fontWeight: 'bold' },
  tableColDimHeader: { width: '18%', padding: 6, fontSize: 9, color: '#ffffff', fontWeight: 'bold', textAlign: 'center' },
  tableColRateHeader: { width: '14%', padding: 6, fontSize: 9, color: '#ffffff', fontWeight: 'bold', textAlign: 'right' },
  tableColQtyHeader: { width: '10%', padding: 6, fontSize: 9, color: '#ffffff', fontWeight: 'bold', textAlign: 'center' },
  tableColTotalHeader: { width: '16%', padding: 6, fontSize: 9, color: '#ffffff', fontWeight: 'bold', textAlign: 'right' },

  tableColIdx: { width: '6%', padding: 6, fontSize: 8.5, textAlign: 'left' },
  tableColDesc: { width: '36%', padding: 6 },
  tableColDim: { width: '18%', padding: 6, fontSize: 8, textAlign: 'center', color: '#4f46e5' },
  tableColRate: { width: '14%', padding: 6, fontSize: 8.5, textAlign: 'right' },
  tableColQty: { width: '10%', padding: 6, fontSize: 8.5, textAlign: 'center' },
  tableColTotal: { width: '16%', padding: 6, fontSize: 8.5, textAlign: 'right' },

  tableSectionText: {
    paddingLeft: 12,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#ffffff',
    letterSpacing: 1,
  },
  itemName: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#111625',
  },
  itemDesc: {
    fontSize: 8,
    color: '#777777',
    marginTop: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginTop: 6,
    borderRadius: 4,
    objectFit: 'cover',
  },

  // Summary section
  summaryContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    pageBreakInside: 'avoid',
  },
  summaryLeft: {
    width: '50%',
  },
  summaryRight: {
    width: '45%',
  },
  summaryRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  summaryGrandRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    paddingHorizontal: 10,
    marginTop: 6,
  },
  summaryLabel: {
    fontSize: 9.5,
    color: '#555555',
  },
  summaryValue: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#111625',
  },
  summaryGrandLabel: {
    fontSize: 10.5,
    fontWeight: 'bold',
    color: '#111625',
  },
  summaryGrandValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#C5A880',
  },
  termsBox: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 12,
    marginTop: 10,
  },
  termsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111625',
    marginBottom: 6,
  },
  termsText: {
    fontSize: 7.5,
    color: '#777777',
    lineHeight: 1.4,
  },

  // Closing (Thank You) Page Styles
  closingPage: {
    backgroundColor: '#111625',
    color: '#ffffff',
    height: '100%',
    padding: 60,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  closingBody: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  closingTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  closingDesc: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    maxWidth: 420,
    lineHeight: 1.5,
    marginBottom: 30,
  },
  closingDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#C5A880',
  },
  closingContactBlock: {
    display: 'flex',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 30,
  },
  closingContactLeft: {
    width: '55%',
  },
  closingContactRight: {
    width: '45%',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.08)',
    paddingLeft: 24,
  },
  closingContactTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#C5A880',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  closingContactText: {
    fontSize: 9.5,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
    lineHeight: 1.4,
  },
  closingContactBold: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export const QuotationPDFDocument = ({ quotation, calc, settings, companyLogoUrl, itemImages }) => {
  const q = quotation || {};
  const c = calc || { subtotal: 0, taxAmount: 0, discountAmount: 0, grandTotal: 0 };
  const s = settings || {};

  const company = s.company || {};
  const docs = s.documents || {};

  const companyName = company.companyName || 'Ryphira';
  const companyTagline = company.motto && company.motto.toLowerCase() !== 'admin dashboard' ? company.motto : '';
  const email = company.email || '';
  const phone = company.phone || '';
  const website = company.website || '';
  const address = company.address || '';

  const clientName = q.client?.name || 'N/A';
  const clientPhone = q.client?.phone || '';
  const clientEmail = q.client?.email || '';
  const clientAddress = q.client?.address || q.client?.siteAddress || q.client?.billingAddress || '';
  const qNum = q.quotationNumber || 'N/A';
  const projectName = q.projectName || 'Interior Design Project';

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  const dateStr = formatDate(q.createdAt);
  const validUntilStr = q.validUntil ? formatDate(q.validUntil) : '';
  const currencySymbol = (!docs.currencySymbol || docs.currencySymbol === '₹') ? 'Rs.' : docs.currencySymbol;

  const items = q.items || [];
  const groupedItems = items.reduce((acc, item) => {
    const key = item.section || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  let globalIdx = 0;

  return (
    <Document>
      {/* 1. Cover Page */}
      <Page size="A4" style={[styles.page, { backgroundColor: '#111625' }]}>
        <View style={styles.coverPage}>
          <View style={styles.coverHeader}>
            <View style={styles.coverCompanyInfo}>
              <Text style={styles.coverCompanyName}>{companyName}</Text>
              {companyTagline ? <Text style={styles.coverCompanyTagline}>{companyTagline}</Text> : null}
            </View>
            {companyLogoUrl ? (
              <Image src={companyLogoUrl} style={styles.coverLogoImage} />
            ) : (
              <Text style={styles.coverLogoText}>DESIGN</Text>
            )}
          </View>

          <View style={styles.coverBody}>
            <Text style={styles.coverSubtitle}>Interior Design Proposal</Text>
            <Text style={styles.coverTitle}>{projectName}</Text>
            <View style={styles.coverDivider} />

            <View style={styles.coverDetailsGrid}>
              <View style={styles.coverDetailsColLeft}>
                <Text style={styles.coverSectionLabel}>Client Details</Text>
                <Text style={styles.coverClientName}>{clientName}</Text>
                {clientPhone ? <Text style={styles.coverDetailsText}>P: {clientPhone}</Text> : null}
                {clientEmail ? <Text style={styles.coverDetailsText}>E: {clientEmail}</Text> : null}
              </View>
              <View style={styles.coverDetailsColRight}>
                <Text style={styles.coverSectionLabel}>Proposal Info</Text>
                <Text style={styles.coverDetailsText}>
                  <Text style={styles.coverDetailsBold}>Quotation: </Text>
                  {qNum}
                </Text>
                <Text style={styles.coverDetailsText}>
                  <Text style={styles.coverDetailsBold}>Date: </Text>
                  {dateStr}
                </Text>
                {validUntilStr ? (
                  <Text style={styles.coverDetailsText}>
                    <Text style={styles.coverDetailsBold}>Valid Until: </Text>
                    {validUntilStr}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.coverFooter}>
            <Text>© {new Date().getFullYear()} {companyName}. Confidential Document.</Text>
            <Text>{website || 'www.woodaura.com'}</Text>
          </View>
        </View>
      </Page>

      {/* 2. Main content Pages */}
      <Page size="A4" style={styles.page}>
        <View style={styles.contentPage}>
          {/* Header */}
          <View style={styles.invoiceHeader}>
            <View style={styles.brandSection}>
              {companyLogoUrl ? (
                <Image src={companyLogoUrl} style={styles.brandLogo} />
              ) : (
                <Text style={styles.coverLogoText}>DESIGN</Text>
              )}
              <View style={styles.brandTextContainer}>
                <Text style={styles.brandName}>{companyName}</Text>
                {companyTagline ? <Text style={styles.brandMotto}>{companyTagline}</Text> : null}
              </View>
            </View>
            <View style={styles.titleBlock}>
              <Text style={styles.documentType}>{q.documentType || 'Invoice'}</Text>
              <Text style={styles.documentDate}>DATE: {dateStr}</Text>
            </View>
          </View>

          {/* Address Cards */}
          <View style={styles.addressCard}>
            <View style={styles.addressCol}>
              <Text style={styles.addressBlockTitle}>Invoice To</Text>
              <Text style={styles.addressClientName}>{clientName}</Text>
              <Text style={styles.addressDetails}>{clientAddress}</Text>
              {clientPhone ? <Text style={[styles.addressDetails, { marginTop: 4 }]}>{clientPhone}</Text> : null}
            </View>
            <View style={styles.addressCol}>
              <Text style={styles.addressBlockTitle}>From Office</Text>
              <Text style={styles.addressClientName}>{companyName}</Text>
              <Text style={styles.addressDetails}>{address}</Text>
              {phone ? <Text style={[styles.addressDetails, { marginTop: 4 }]}>{phone}</Text> : null}
            </View>
          </View>

          {/* Meta strip */}
          <View style={styles.metaStrip}>
            <Text style={styles.metaItem}>Date: <Text style={styles.metaValue}>{dateStr}</Text></Text>
            <Text style={styles.metaItem}>No: <Text style={styles.metaValue}>{qNum}</Text></Text>
          </View>

          {/* Table */}
          <View style={styles.table}>
            <View style={styles.tableRowHeader}>
              <Text style={styles.tableColIdxHeader}>No</Text>
              <Text style={styles.tableColDescHeader}>Item Description</Text>
              <Text style={styles.tableColDimHeader}>Dimensions</Text>
              <Text style={styles.tableColRateHeader}>Price</Text>
              <Text style={styles.tableColQtyHeader}>Qty</Text>
              <Text style={styles.tableColTotalHeader}>Total</Text>
            </View>

            {Object.entries(groupedItems).map(([sectionName, sectionItems]) => {
              const rows = [];
              // Add Section Header Row
              rows.push(
                <View key={`sec-${sectionName}`} style={styles.tableRowSection}>
                  <Text style={styles.tableSectionText}>{sectionName}</Text>
                </View>
              );

              // Add Item Rows
              sectionItems.forEach((item, itemIdx) => {
                const idx = itemIdx + 1;
                const itemImgUrl = item.image ? itemImages[item.image] || null : null;
                const dimStr = item.measurements || ((item.cmL || item.cmH) ? `${item.cmL || 0}×${item.cmD || 0}×${item.cmH || 0} cm` : (item.size || '-'));
                rows.push(
                  <View key={`item-${item._id || idx}`} style={styles.tableRow} wrap={false}>
                    <Text style={styles.tableColIdx}>{String(idx).padStart(2, '0')}.</Text>
                    <View style={styles.tableColDesc}>
                      <Text style={styles.itemName}>{item.itemName || 'N/A'}</Text>
                      {item.description ? <Text style={styles.itemDesc}>{item.description}</Text> : null}
                      {itemImgUrl ? <Image src={itemImgUrl} style={styles.itemImage} /> : null}
                    </View>
                    <Text style={styles.tableColDim}>{dimStr}</Text>
                    <Text style={styles.tableColRate}>{currencySymbol} {item.rate?.toLocaleString() || 0}</Text>
                    <Text style={styles.tableColQty}>{item.quantity || 0}</Text>
                    <Text style={styles.tableColTotal}>{currencySymbol} {item.amount?.toLocaleString() || 0}</Text>
                  </View>
                );
              });

              return rows;
            })}
          </View>

          {/* Summary */}
          <View style={styles.summaryContainer} wrap={false}>
            <View style={styles.summaryLeft}>
              {docs.terms ? (
                <View style={styles.termsBox}>
                  <Text style={styles.termsTitle}>Terms & Conditions</Text>
                  <Text style={styles.termsText}>{docs.terms}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.summaryRight}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{currencySymbol} {c.subtotal?.toLocaleString() || 0}</Text>
              </View>
              {c.discountAmount > 0 ? (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Discount</Text>
                  <Text style={styles.summaryValue}>-{currencySymbol} {c.discountAmount?.toLocaleString() || 0}</Text>
                </View>
              ) : null}
              {c.taxAmount > 0 ? (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax</Text>
                  <Text style={styles.summaryValue}>+{currencySymbol} {c.taxAmount?.toLocaleString() || 0}</Text>
                </View>
              ) : null}
              <View style={styles.summaryGrandRow}>
                <Text style={styles.summaryGrandLabel}>Grand Total</Text>
                <Text style={styles.summaryGrandValue}>{currencySymbol} {c.grandTotal?.toLocaleString() || 0}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* 3. Closing Page */}
      <Page size="A4" style={[styles.page, { backgroundColor: '#111625' }]}>
        <View style={styles.closingPage}>
          <View style={styles.coverHeader}>
            <View style={styles.coverCompanyInfo}>
              <Text style={styles.coverCompanyName}>{companyName}</Text>
              {companyTagline ? <Text style={styles.coverCompanyTagline}>{companyTagline}</Text> : null}
            </View>
            {companyLogoUrl ? (
              <Image src={companyLogoUrl} style={styles.coverLogoImage} />
            ) : (
              <Text style={styles.coverLogoText}>DESIGN</Text>
            )}
          </View>

          <View style={styles.closingBody}>
            <Text style={styles.closingTitle}>Thank You!</Text>
            <Text style={styles.closingDesc}>
              We look forward to collaborating with you to transform your spaces into beautiful, functional works of art.
            </Text>
            <View style={styles.closingDivider} />
          </View>

          <View style={styles.closingContactBlock}>
            <View style={styles.closingContactLeft}>
              <Text style={styles.closingContactTitle}>Contact Details</Text>
              {phone ? (
                <Text style={styles.closingContactText}>
                  <Text style={styles.closingContactBold}>Phone: </Text>
                  {phone}
                </Text>
              ) : null}
              {email ? (
                <Text style={styles.closingContactText}>
                  <Text style={styles.closingContactBold}>Email: </Text>
                  {email}
                </Text>
              ) : null}
              {website ? (
                <Text style={styles.closingContactText}>
                  <Text style={styles.closingContactBold}>Website: </Text>
                  {website}
                </Text>
              ) : null}
            </View>
            <View style={styles.closingContactRight}>
              <Text style={styles.closingContactTitle}>Office Address</Text>
              <Text style={styles.closingContactText}>{address || 'N/A'}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
