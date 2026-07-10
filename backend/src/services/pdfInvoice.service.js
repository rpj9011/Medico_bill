'use strict';
/**
 * PDF invoice generation using pdfmake.
 * Generates a proper A4 tax invoice layout.
 */
const PdfPrinter = require('pdfmake');
const path = require('path');
const fs   = require('fs');

// Use built-in Roboto fonts
const fonts = {
  Roboto: {
    normal:      path.join(__dirname, '../../node_modules/pdfmake/build/vfs_fonts.js'),
    bold:        path.join(__dirname, '../../node_modules/pdfmake/build/vfs_fonts.js'),
    italics:     path.join(__dirname, '../../node_modules/pdfmake/build/vfs_fonts.js'),
    bolditalics: path.join(__dirname, '../../node_modules/pdfmake/build/vfs_fonts.js'),
  }
};

function buildInvoiceDefinition(invoice, businessInfo) {
  const { customer, items, voucher_no, invoice_date } = invoice;
  const isIntraState = invoice.sgst_amount > 0;

  const itemRows = items.map((item, idx) => [
    { text: idx + 1, alignment: 'center' },
    item.product_name || '',
    item.hsn_code || '',
    item.batch_no || '',
    item.expiry_date || '',
    { text: Number(item.quantity).toFixed(2), alignment: 'right' },
    { text: Number(item.mrp).toFixed(2), alignment: 'right' },
    { text: Number(item.rate).toFixed(2), alignment: 'right' },
    { text: Number(item.discount_pct).toFixed(2), alignment: 'right' },
    { text: Number(item.taxable_amount).toFixed(2), alignment: 'right' },
    {
      text: isIntraState
        ? `${Number(item.sgst_amount).toFixed(2)} + ${Number(item.cgst_amount).toFixed(2)}`
        : Number(item.igst_amount).toFixed(2),
      alignment: 'right',
    },
    { text: Number(item.line_total).toFixed(2), alignment: 'right' },
  ]);

  return {
    pageSize:        'A4',
    pageOrientation: 'portrait',
    pageMargins:     [30, 30, 30, 40],
    content: [
      {
        columns: [
          { text: businessInfo.name, style: 'header', width: '*' },
          { text: `TAX INVOICE`, style: 'invoiceTitle', width: 'auto' },
        ],
      },
      { text: businessInfo.address, style: 'subHeader' },
      { text: `GSTIN: ${businessInfo.gstin}  |  Ph: ${businessInfo.phone || ''}`, style: 'subHeader' },
      { canvas: [{ type: 'line', x1: 0, y1: 3, x2: 535, y2: 3, lineWidth: 1 }] },
      { text: '', margin: [0, 4] },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Bill To:', style: 'sectionLabel' },
              { text: customer?.name || '', bold: true },
              { text: [customer?.address1, customer?.address2, customer?.city].filter(Boolean).join(', ') },
              { text: `GSTIN: ${customer?.gst_number || 'N/A'}` },
              { text: `DL No: ${customer?.drug_license_no || 'N/A'}` },
            ],
          },
          {
            width: '50%',
            stack: [
              { columns: [{ text: 'Invoice No:', width: 80 }, { text: voucher_no, bold: true }] },
              { columns: [{ text: 'Date:', width: 80 }, { text: invoice_date }] },
              { columns: [{ text: 'Salesman:', width: 80 }, { text: invoice.salesman_name || '' }] },
            ],
          },
        ],
      },
      { text: '', margin: [0, 8] },
      {
        style: 'tableStyle',
        table: {
          headerRows: 1,
          widths: [20, '*', 40, 45, 35, 30, 35, 35, 25, 45, 60, 45],
          body: [
            [
              { text: '#', style: 'tableHeader' },
              { text: 'Product', style: 'tableHeader' },
              { text: 'HSN', style: 'tableHeader' },
              { text: 'Batch', style: 'tableHeader' },
              { text: 'Exp', style: 'tableHeader' },
              { text: 'Qty', style: 'tableHeader' },
              { text: 'MRP', style: 'tableHeader' },
              { text: 'Rate', style: 'tableHeader' },
              { text: 'Disc%', style: 'tableHeader' },
              { text: 'Taxable', style: 'tableHeader' },
              { text: 'GST', style: 'tableHeader' },
              { text: 'Total', style: 'tableHeader' },
            ],
            ...itemRows,
          ],
        },
        layout: 'lightHorizontalLines',
      },
      { text: '', margin: [0, 6] },
      {
        columns: [
          { width: '60%', text: '' },
          {
            width: '40%',
            table: {
              widths: ['*', 80],
              body: [
                ['Gross Amount',   { text: `₹ ${Number(invoice.gross_amount).toFixed(2)}`, alignment: 'right' }],
                ['Discount',       { text: `₹ ${Number(invoice.discount_amount).toFixed(2)}`, alignment: 'right' }],
                isIntraState
                  ? ['SGST + CGST', { text: `₹ ${(Number(invoice.sgst_amount) + Number(invoice.cgst_amount)).toFixed(2)}`, alignment: 'right' }]
                  : ['IGST',       { text: `₹ ${Number(invoice.igst_amount).toFixed(2)}`, alignment: 'right' }],
                ['Round Off',      { text: `₹ ${Number(invoice.round_off || 0).toFixed(2)}`, alignment: 'right' }],
                [{ text: 'NET AMOUNT', bold: true }, { text: `₹ ${Number(invoice.net_amount).toFixed(2)}`, alignment: 'right', bold: true }],
              ],
            },
            layout: 'noBorders',
          },
        ],
      },
      { text: '', margin: [0, 10] },
      { canvas: [{ type: 'line', x1: 0, y1: 2, x2: 535, y2: 2, lineWidth: 0.5 }] },
      {
        columns: [
          { text: 'Receiver Signature: ___________________', width: '50%' },
          { text: `For ${businessInfo.name}\nAuthorized Signatory`, alignment: 'right', width: '50%' },
        ],
        margin: [0, 10],
      },
    ],
    styles: {
      header:       { fontSize: 14, bold: true },
      invoiceTitle: { fontSize: 14, bold: true, color: '#1a5276' },
      subHeader:    { fontSize: 8, color: '#555' },
      sectionLabel: { fontSize: 9, bold: true, color: '#1a5276', margin: [0, 0, 0, 2] },
      tableHeader:  { bold: true, fontSize: 8, fillColor: '#d5e8f7' },
      tableStyle:   { fontSize: 8 },
    },
    defaultStyle: { font: 'Roboto', fontSize: 9 },
  };
}

/**
 * Generate a PDF Buffer for an invoice.
 */
async function generateInvoicePDF(invoice, businessInfo) {
  return new Promise((resolve, reject) => {
    try {
      // Lazy-load vfs fonts
      const vfsFonts = require('pdfmake/build/vfs_fonts');
      const PdfPrinterInstance = require('pdfmake/build/pdfmake');
      PdfPrinterInstance.vfs = vfsFonts.pdfMake.vfs;

      const docDefinition = buildInvoiceDefinition(invoice, businessInfo);
      const pdfDoc = PdfPrinterInstance.createPdf(docDefinition);
      const chunks = [];
      pdfDoc.getBuffer((buffer) => resolve(buffer));
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateInvoicePDF };
