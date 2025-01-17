import PDFDocument from 'pdfkit';

// const titleFontSize = 25;
// const subTitleFontSize = 14;
// const leadingFontSize = 12;
// const contentFontSize = 10;
const paperSizeHeight = 841.89;
const paperSizeWidth = 595.28;
const paperMargin = 30;
// const lineSpacing = 15;
// const bottomGap = 10; // Adjust as needed for spacing between sections

export async function createpdf(invoice) {
  let doc = new PDFDocument({
    size: [paperSizeWidth, paperSizeHeight],
    margin: paperMargin,
  });

  generateHeader(doc, invoice);
  generateFooter(doc);
  return doc;
}

function generateHeader(doc, invoice) {
  doc.fontSize(25).text('Business List', {
    align: 'center',
  });

  // Define the table columns and their widths
  const tableColumns = [
    'personName',
    'gender',
    'personEmail',
    'personPhone',
    'businessKey',
    'businessType',
    'businessName',
    'gstNo',
    'address1',
    'address2',
    'zipCode',
    'city',
    'state',
    'country',
    'signatory',
    'logo',
    'brandLogo',
    'doc1',
    'doc2',
    'gstCertificate',
    'workOrder',
    'status',
    'createdAt',
  ];
  const columnWidths = [80, 80, 80, 80, 100, 50, 70];

  // Map invoice data to table rows
  const tableRows = invoice.result.map((item) => [
    item.personName,
    item.gender,
    item.personEmail,
    item.personPhone,
    item.businessKey,
    item.businessType,
    item.businessName,
    item.gstNo,
    item.address1,
    item.address2,
    item.zipCode,
    item.city,
    item.state,
    item.country,
    item.signatory,
    item.logo,
    item.brandLogo,
    item.doc1,
    item.doc2,
    item.gstCertificate,
    item.workOrder,
    item.status,
    formatDate(item.createdAt),
  ]);

  // Define the starting point of the table
  const startX = 27; // Reduced left margin
  let startY = 90;
  const padding = 5;
  let rowIndex = 0;

  const drawTableHeader = () => {
    doc.fontSize(12).fillColor('white');
    tableColumns.forEach((header, i) => {
      const colWidth = columnWidths[i];
      doc
        .rect(
          startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0),
          startY,
          colWidth,
          25,
        )
        .fill('#333333');
      doc
        .fillColor('white')
        .text(
          header,
          startX +
            columnWidths.slice(0, i).reduce((a, b) => a + b, 0) +
            padding,
          startY + 7,
          { width: colWidth - 2 * padding, align: 'left' },
        );
      doc.fillColor('black'); // Reset color for text
    });
    startY += 25; // Move startY down after the headers
  };

  // Draw the initial table header
  drawTableHeader();

  // Draw the table rows with dynamic height and borders
  tableRows.forEach((row, rowIndex) => {
    if (rowIndex > 0 && rowIndex % 15 === 0) {
      doc.addPage();
      startY = 90;
      drawTableHeader();
    }

    // Calculate the maximum height needed for the current row
    let maxHeight = 0;
    row.forEach((cell, i) => {
      const colWidth = columnWidths[i];
      const cellHeight = doc.heightOfString(cell, {
        width: colWidth - 2 * padding,
        align: 'left',
      });
      maxHeight = Math.max(maxHeight, cellHeight);
    });

    // Draw the cells
    row.forEach((cell, i) => {
      const colWidth = columnWidths[i];
      const cellX =
        startX + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.rect(cellX, startY, colWidth, maxHeight + 2 * padding).stroke();
      doc.text(cell, cellX + padding, startY + padding, {
        width: colWidth - 2 * padding,
        align: 'left',
      });
    });

    startY += maxHeight + 2 * padding; // Move startY down for the next row
  });
}

function generateFooter(doc) {
  const footerText =
    'This is system generated Lead. All rights reserved to Privilage';
  const footerHeight = 20; // Adjust as needed for footer height
  const footerY = doc.page.height - doc.page.margins.bottom - footerHeight;

  doc.fontSize(10).text(footerText, doc.page.margins.left, footerY, {
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    align: 'center',
  });
}

function generateHr(doc, y) {
  doc
    .strokeColor('#aaaaaa')
    .lineWidth(1)
    .moveTo(paperMargin, y)
    .lineTo(paperSizeWidth - paperMargin, y)
    .stroke();
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + '/' + month + '/' + day;
}
