import PDFDocument from 'pdfkit';
import { Business } from 'src/business/entities/business.entity';
import { Licence } from 'src/licence/entities/licence.entity';

const paperSizeHeight = 841.89;
const paperSizeWidth = 595.28;
const paperMargin = 30;

export async function createpdf(apiResponse: Business[]) {
  let doc = new PDFDocument({
    size: [paperSizeWidth, paperSizeHeight],
    margin: paperMargin,
  });

  generateHeader(doc, apiResponse);
  generateFooter(doc);
  return doc;
}

function generateHeader(doc, apiResponse: Business[]) {
  doc.fontSize(25).text('Business List', {
    align: 'center',
  });

  const tableColumns = [
    // 'Name',
    // 'Gender',
    'Email',
    'Phone',
    'B. Key',
    'Type',
    'B. Name',
    'GST No',
    'City',
    'State',
    // 'Country',
    // 'Status',
    // 'Licence Key',
    // 'Activation Key',
    // 'Renewal Date',
  ];

  // const columnWidths = [
  //   60, 60, 90, 80, 90, 80, 100, 80, 70, 70, 70, 60, 100, 100, 80,
  // ];
  const columnWidths = [
    60, 80, 80, 80, 90, 80, 60, 55,
  ];

  const tableRows = apiResponse.map((item) => {
    // const licenceInfo = item.licence[0] || {};
    // console.log(licenceInfo);
    return [
      // item.personName,
      // item.gender,
      item.personEmail,
      item.personPhone,
      item.businessKey,
      item.businessType,
      item.businessName,
      item.gstNo,
      item.city,
      item.state,
      // item.country,
      // item.status,
      // licenceInfo.licenceKey || 'N/A',
      // licenceInfo.activationKey || 'N/A',
      // licenceInfo.renewalDate || 'N/A',
    ];
  });

  const startX = 5;
  let startY = 70;
  const padding = 5;

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
      doc.fillColor('black');
    });
    startY += 25;
  };

  drawTableHeader();

  tableRows.forEach((row, rowIndex) => {
    if (rowIndex > 0 && rowIndex % 15 === 0) {
      doc.addPage();
      startY = 90;
      drawTableHeader();
    }

    let maxHeight = 0;
    row.forEach((cell, i) => {
      const colWidth = columnWidths[i];
      const cellHeight = doc.heightOfString(cell, {
        width: colWidth - 2 * padding,
        align: 'left',
      });
      maxHeight = Math.max(maxHeight, cellHeight);
    });

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

    startY += maxHeight + 2 * padding;
  });
}

function generateFooter(doc) {
  const footerText =
    'This is a system-generated document. All rights reserved.';
  const footerHeight = 20;
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

  return year + '-' + month + '-' + day;
}



export async function createLicencepdf(apiResponse: Licence[]) {
  let doc = new PDFDocument({
    size: [paperSizeWidth, paperSizeHeight],
    margin: paperMargin,
  });

  generateLicenceHeader(doc, apiResponse);
  generateLicenceFooter(doc);
  return doc;
}

function generateLicenceHeader(doc, apiResponse: Licence[]) {
  doc.fontSize(25).text('Licence List', {
    align: 'center',
  });

  const tableColumns = [
    // 'Name',
    'User Limit',
    'L. Key',
    'A. Key',
    'Start Date',
    'Renewal Date',
    'Creation Date',
    'Status',
  ];
  const columnWidths = [
    // 60,
     70, 110, 90, 80, 90, 90, 55,
  ];

  const tableRows = apiResponse.map((item) => {
    return [
      // item.business,
      item.userLimit,
      item.licenceKey,
      item.activationKey,
      item.startDate,
      item.renewalDate,
      formatDate(item.createdAt),
      item.status,
    ];
  });

  const startX = 5;
  let startY = 70;
  const padding = 5;

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
      doc.fillColor('black');
    });
    startY += 25;
  };

  drawTableHeader();

  tableRows.forEach((row, rowIndex) => {
    if (rowIndex > 0 && rowIndex % 15 === 0) {
      doc.addPage();
      startY = 90;
      drawTableHeader();
    }

    let maxHeight = 0;
    row.forEach((cell, i) => {
      const colWidth = columnWidths[i];
      const cellHeight = doc.heightOfString(cell, {
        width: colWidth - 2 * padding,
        align: 'left',
      });
      maxHeight = Math.max(maxHeight, cellHeight);
    });

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

    startY += maxHeight + 2 * padding;
  });
}

function generateLicenceFooter(doc) {
  const footerText =
    'This is a system-generated document. All rights reserved.';
  const footerHeight = 20;
  const footerY = doc.page.height - doc.page.margins.bottom - footerHeight;

  doc.fontSize(10).text(footerText, doc.page.margins.left, footerY, {
    width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
    align: 'center',
  });
}
