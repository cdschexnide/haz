/**
 * SDDG PDF Generator Utility
 *
 * Extracts PDF generation logic from ShippersDeclarationScreen.tsx for better
 * testability and reuse. Generates Shipper's Declaration for Dangerous Goods
 * (SDDG) forms as HTML and PDF.
 */

import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { PDFDocument } from 'pdf-lib';

/**
 * Data structure containing all fields needed for SDDG generation.
 * Extracted from the ShippersDeclarationScreen component state.
 */
export interface SDDGFormData {
  // Shipper information
  shipperName: string;
  shipperStreet: string;
  shipperCity: string;
  shipperState: string;
  shipperZipcode: string;
  shipperPhoneNumber: string;

  // Consignee information
  consigneeDodaac: string;
  consigneeStreet: string;
  consigneeCity: string;
  consigneeCountry: string;

  // Shipment information
  referenceNumber: string;
  airportOfDeparture: string;
  airportOfDestination: string;
  shipmentType: 'RADIOACTIVE' | 'NON-RADIOACTIVE';

  // Hazardous material information
  unid: string;
  shippingName: string;
  classDiv: string;
  packingGroup: string;
  quantityAndTypeOfPacking: string;
  packingInstruction: string;
  authorization: string;

  // Signatory information
  signatoryName: string;
  signatoryTitle: string;
  location: string;
  date: string;

  // Transport and additional info
  isCargoAircraftOnly: boolean;
  emergencyPhoneNumber1: string;
  emergencyPhoneNumber2: string;
  additionalInfoHtml: string;
}

/**
 * Helper function to create conditional X overlay HTML.
 * When condition is true, no overlay is shown (option is selected).
 * When condition is false, X overlay is shown (option is crossed out).
 */
const getXOverlayHTML = (condition: boolean): string => {
  return condition ? '' : '<div class="x-overlay">XXXXXXXX</div>';
};

/**
 * Generates the CSS styles for the SDDG form.
 */
const getSDDGStyles = (): string => {
  return `
    @page {
      size: letter portrait;
    }
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: white;
      color: black;
    }
    .container {
      position: relative;
      border: 1px solid black;
      padding: 5px;
      margin: 10px;
      background: white;
    }
    .red-stripe-left,
    .red-stripe-right {
      position: fixed;
      top: 0;
      bottom: 0;
      width: 5px;
      border-left: 5px dashed red;
      z-index: 1000;
    }
    .red-stripe-left {
      left: 0;
    }
    .red-stripe-right {
      right: 0;
    }
    .title {
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 16px;
    }
    .row {
      display: flex;
      margin-bottom: 12px;
    }
    .box {
      border: 1px solid black;
      padding: 8px;
    }
    .box-left {
      flex: 1;
      margin-right: 8px;
    }
    .box-right {
      flex: 1;
    }
    .label {
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 4px;
      padding: 4px 0;
    }
    .text {
      font-size: 13px;
      margin: 4px 0;
    }
    .warning-text {
      font-size: 12px;
      line-height: 16px;
    }
    .transport-box {
      border: 1px solid black;
      padding: 8px;
      flex: 1;
    }
    .transport-options {
      display: flex;
      border: 1px solid black;
      margin-top: 4px;
    }
    .aircraft-box {
      flex: 1;
      text-align: center;
      padding: 10px 0;
      position: relative;
      border-right: 1px solid black;
    }
    .aircraft-box:last-child {
      border-right: none;
    }
    .x-overlay {
      position: absolute;
      font-weight: bold;
      font-size: 24px;
      text-align: center;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .shipment-type-row {
      margin-top: 12px;
    }
    .shipment-type-box {
      display: flex;
      border: 1px solid black;
      margin-top: 4px;
    }
    .shipment-option {
      flex: 1;
      text-align: center;
      padding: 10px 0;
      position: relative;
      border-right: 1px solid black;
    }
    .shipment-option:last-child {
      border-right: none;
    }
    .table-wrapper {
      margin-top: 16px;
      border: 1px solid black;
    }
    .table-header {
      display: flex;
      background-color: #e9ecef;
      border-bottom: 1px solid black;
    }
    .table-row {
      display: flex;
      min-height: 200px;
    }
    .table-cell {
      flex: 1;
      padding: 6px;
      border-right: 1px solid black;
      font-size: 13px;
    }
    .table-cell:last-child {
      border-right: none;
    }
    .cell-label {
      font-weight: bold;
      font-size: 12px;
    }
    .info-box {
      border-top: 1px solid black;
      padding-top: 10px;
      margin-top: 16px;
      margin-bottom: 16px;
    }
    .info-line {
      font-size: 14px;
      margin: 4px 0;
    }
    .emergency-line {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .emergency-label {
      font-size: 13px;
      font-weight: bold;
      margin-right: 4px;
    }
    .emergency-number {
      font-size: 13px;
    }
    .declaration-row {
      display: flex;
      border-top: 1px solid black;
      padding-top: 12px;
    }
    .declaration-box {
      flex: 2;
      padding-right: 10px;
    }
    .signatory-box {
      flex: 1;
      border-left: 1px solid black;
      padding-left: 10px;
    }
    .declaration-text {
      font-size: 14px;
      line-height: 18px;
    }
    .label-upper {
      font-size: 13px;
      font-weight: bold;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .place-date-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .signature-note {
      font-size: 10px;
      font-style: italic;
      margin-top: 12px;
    }
    .italic {
      font-style: italic;
    }
  `;
};

/**
 * Generates HTML for the SDDG form without QR code.
 * Use this when you don't need a QR code or will add it separately.
 *
 * @param data - The form data to populate the HTML
 * @returns HTML string for the SDDG form
 */
export const generateSDDGFormHtml = (data: SDDGFormData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shipper's Declaration for Dangerous Goods</title>
      <style>
        ${getSDDGStyles()}
      </style>
    </head>
    <body>
      <div class="red-stripe-left"></div>
      <div class="red-stripe-right"></div>
      <div class="container">
        <div class="title">SHIPPER'S DECLARATION FOR DANGEROUS GOODS</div>

        <!-- Shipper and Air Waybill Info -->
        <div class="row">
          <div class="box box-left">
            <div class="label">Shipper</div>
            <div class="text">${data.shipperName || ''}</div>
            <div class="text">${data.shipperStreet || ''}</div>
            <div class="text">${data.shipperCity || ''}, ${data.shipperState || ''} ${data.shipperZipcode || ''}</div>
            <div class="text">Phone: ${data.shipperPhoneNumber || ''}</div>
          </div>
          <div class="box box-right">
            <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start;">
              <div style="flex: 1;">
                <div class="label">Air Waybill No.</div>
                <div class="text">Page 1 of 1</div>
                <div class="text">SHIPPER'S REFERENCE NUMBER</div>
                <div class="text" style="font-size: 16px;">TCN: ${data.referenceNumber || ''}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Consignee and Warning -->
        <div class="row">
          <div class="box box-left">
            <div class="label">Consignee</div>
            <div class="text">${data.consigneeDodaac || ''}</div>
            <div class="text">${data.consigneeStreet || ''}</div>
            <div class="text">${[data.consigneeCity, data.consigneeCountry].filter(Boolean).join(', ')}</div>
          </div>
          <div class="box box-right">
            <div class="label">Warning</div>
            <div class="warning-text">Failure to comply in all respects with the applicable Dangerous Goods Regulations may be in breach of the applicable law, subject to legal penalties.</div>
          </div>
        </div>

        <!-- Transport Details -->
        <div class="row">
          <div class="transport-box" style="flex: 2;">
            <div class="label">TRANSPORT DETAILS</div>
            <div>This shipment is within the limitations prescribed for:</div>
            <div class="transport-options">
              <div class="aircraft-box">
                PASSENGER AND<br>CARGO AIRCRAFT
                ${getXOverlayHTML(data.isCargoAircraftOnly === false)}
              </div>
              <div class="aircraft-box">
                CARGO AIRCRAFT<br>ONLY
                ${getXOverlayHTML(data.isCargoAircraftOnly === true)}
              </div>
            </div>
          </div>
          <div class="transport-box" style="flex: 1;">
            <div class="label">Airport of Departure:</div>
            <div class="text">${data.airportOfDeparture || ''}</div>
          </div>
          <div class="transport-box" style="flex: 1;">
            <div class="label">Airport of Destination:</div>
            <div class="text">${data.airportOfDestination || ''}</div>
          </div>
        </div>

        <!-- Shipment Type -->
        <div class="row">
          <div class="transport-box">
            <div class="shipment-type-row">
              <div class="label">Shipment type: <span class="italic">(delete non-applicable)</span></div>
              <div class="shipment-type-box">
                <div class="shipment-option">
                  NON-RADIOACTIVE
                  ${getXOverlayHTML(data.shipmentType === 'NON-RADIOACTIVE')}
                </div>
                <div class="shipment-option">
                  RADIOACTIVE
                  ${getXOverlayHTML(data.shipmentType === 'RADIOACTIVE')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dangerous Goods Table -->
        <div class="table-wrapper">
          <div class="label">NATURE AND QUANTITY OF DANGEROUS GOODS</div>
          <div class="table-header">
            <div class="table-cell"><div class="cell-label">UN or ID No.</div></div>
            <div class="table-cell"><div class="cell-label">Proper Shipping Name</div></div>
            <div class="table-cell"><div class="cell-label">Class or Division<br>(subsidiary hazard)</div></div>
            <div class="table-cell"><div class="cell-label">Packing Group</div></div>
            <div class="table-cell"><div class="cell-label">Quantity and Type of Packing</div></div>
            <div class="table-cell"><div class="cell-label">Packing Inst.</div></div>
            <div class="table-cell"><div class="cell-label">Authorization</div></div>
          </div>
          <div class="table-row">
            <div class="table-cell">${data.unid || ''}</div>
            <div class="table-cell">${data.shippingName || ''}</div>
            <div class="table-cell">${data.classDiv || ''}</div>
            <div class="table-cell">${data.packingGroup || '—'}</div>
            <div class="table-cell">${data.quantityAndTypeOfPacking || ''}</div>
            <div class="table-cell">${data.packingInstruction || ''}</div>
            <div class="table-cell">${data.authorization || ''}</div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="info-box">
          <div class="label">Additional Handling Information</div>
          ${data.additionalInfoHtml || ''}
          <div class="emergency-line">
            <span class="emergency-label">EMERGENCY TELEPHONE NUMBER:</span>
            <span class="emergency-number">${data.emergencyPhoneNumber1 || ''} ${data.emergencyPhoneNumber2 || ''}</span>
          </div>
        </div>

        <!-- Declaration and Signature -->
        <div class="declaration-row">
          <div class="declaration-box">
            <div class="declaration-text">
              I hereby declare that the contents of this consignment are fully and accurately described above by the proper shipping name, and are classified,
              packaged, marked and labelled/placarded, and are in all respects in proper condition for transport according to applicable international and national governmental regulations. I declare that all of the applicable air transport requirements have been met.
            </div>
          </div>
          <div class="signatory-box">
            <div class="label-upper">NAME/TITLE OF SIGNATORY</div>
            <div>${data.signatoryName || ''}</div>
            <div>${data.signatoryTitle || ''}</div>

            <div class="label-upper" style="margin-top: 12px;">PLACE AND DATE</div>
            <div class="place-date-row">
              <span>${data.location || ''}</span>
              <span>${data.date || ''}</span>
            </div>

            <div class="signature-note">SIGNATURE (see warning above)</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generates HTML for the SDDG document with QR code.
 * This is the full document version that includes a QR code for the reference number.
 *
 * @param data - The form data to populate the HTML
 * @param qrCodeDataUrl - Base64 data URL for the QR code image
 * @returns HTML string for the complete SDDG document
 */
export const generateSDDGDocumentHtml = (
  data: SDDGFormData,
  qrCodeDataUrl: string
): string => {
  const qrCodeHtml = qrCodeDataUrl
    ? `<div style="margin-left: 8px; display: flex; align-items: center; justify-content: center;">
        <img src="${qrCodeDataUrl}" style="width: 85px; height: 85px;" alt="QR Code"/>
      </div>`
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Shipper's Declaration for Dangerous Goods</title>
      <style>
        ${getSDDGStyles()}
      </style>
    </head>
    <body>
      <div class="red-stripe-left"></div>
      <div class="red-stripe-right"></div>
      <div class="container">
        <div class="title">SHIPPER'S DECLARATION FOR DANGEROUS GOODS</div>

        <!-- Shipper and Air Waybill Info -->
        <div class="row">
          <div class="box box-left">
            <div class="label">Shipper</div>
            <div class="text">${data.shipperName || ''}</div>
            <div class="text">${data.shipperStreet || ''}</div>
            <div class="text">${data.shipperCity || ''}, ${data.shipperState || ''} ${data.shipperZipcode || ''}</div>
            <div class="text">Phone: ${data.shipperPhoneNumber || ''}</div>
          </div>
          <div class="box box-right">
            <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start;">
              <div style="flex: 1;">
                <div class="label">Air Waybill No.</div>
                <div class="text">Page 1 of 1</div>
                <div class="text">SHIPPER'S REFERENCE NUMBER</div>
                <div class="text" style="font-size: 16px;">TCN: ${data.referenceNumber || ''}</div>
              </div>
              ${qrCodeHtml}
            </div>
          </div>
        </div>

        <!-- Consignee and Warning -->
        <div class="row">
          <div class="box box-left">
            <div class="label">Consignee</div>
            <div class="text">${data.consigneeDodaac || ''}</div>
            <div class="text">${data.consigneeStreet || ''}</div>
            <div class="text">${[data.consigneeCity, data.consigneeCountry].filter(Boolean).join(', ')}</div>
          </div>
          <div class="box box-right">
            <div class="label">Warning</div>
            <div class="warning-text">Failure to comply in all respects with the applicable Dangerous Goods Regulations may be in breach of the applicable law, subject to legal penalties.</div>
          </div>
        </div>

        <!-- Transport Details -->
        <div class="row">
          <div class="transport-box" style="flex: 2;">
            <div class="label">TRANSPORT DETAILS</div>
            <div>This shipment is within the limitations prescribed for:</div>
            <div class="transport-options">
              <div class="aircraft-box">
                PASSENGER AND<br>CARGO AIRCRAFT
                ${getXOverlayHTML(data.isCargoAircraftOnly === false)}
              </div>
              <div class="aircraft-box">
                CARGO AIRCRAFT<br>ONLY
                ${getXOverlayHTML(data.isCargoAircraftOnly === true)}
              </div>
            </div>
          </div>
          <div class="transport-box" style="flex: 1;">
            <div class="label">Airport of Departure:</div>
            <div class="text">${data.airportOfDeparture || ''}</div>
          </div>
          <div class="transport-box" style="flex: 1;">
            <div class="label">Airport of Destination:</div>
            <div class="text">${data.airportOfDestination || ''}</div>
          </div>
        </div>

        <!-- Shipment Type -->
        <div class="row">
          <div class="transport-box">
            <div class="shipment-type-row">
              <div class="label">Shipment type: <span class="italic">(delete non-applicable)</span></div>
              <div class="shipment-type-box">
                <div class="shipment-option">
                  NON-RADIOACTIVE
                  ${getXOverlayHTML(data.shipmentType === 'NON-RADIOACTIVE')}
                </div>
                <div class="shipment-option">
                  RADIOACTIVE
                  ${getXOverlayHTML(data.shipmentType === 'RADIOACTIVE')}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dangerous Goods Table -->
        <div class="table-wrapper">
          <div class="label">NATURE AND QUANTITY OF DANGEROUS GOODS</div>
          <div class="table-header">
            <div class="table-cell"><div class="cell-label">UN or ID No.</div></div>
            <div class="table-cell"><div class="cell-label">Proper Shipping Name</div></div>
            <div class="table-cell"><div class="cell-label">Class or Division<br>(subsidiary hazard)</div></div>
            <div class="table-cell"><div class="cell-label">Packing Group</div></div>
            <div class="table-cell"><div class="cell-label">Quantity and Type of Packing</div></div>
            <div class="table-cell"><div class="cell-label">Packing Inst.</div></div>
            <div class="table-cell"><div class="cell-label">Authorization</div></div>
          </div>
          <div class="table-row">
            <div class="table-cell">${data.unid || ''}</div>
            <div class="table-cell">${data.shippingName || ''}</div>
            <div class="table-cell">${data.classDiv || ''}</div>
            <div class="table-cell">${data.packingGroup || '—'}</div>
            <div class="table-cell">${data.quantityAndTypeOfPacking || ''}</div>
            <div class="table-cell">${data.packingInstruction || ''}</div>
            <div class="table-cell">${data.authorization || ''}</div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="info-box">
          <div class="label">Additional Handling Information</div>
          ${data.additionalInfoHtml || ''}
          <div class="emergency-line">
            <span class="emergency-label">EMERGENCY TELEPHONE NUMBER:</span>
            <span class="emergency-number">${data.emergencyPhoneNumber1 || ''} ${data.emergencyPhoneNumber2 || ''}</span>
          </div>
        </div>

        <!-- Declaration and Signature -->
        <div class="declaration-row">
          <div class="declaration-box">
            <div class="declaration-text">
              I hereby declare that the contents of this consignment are fully and accurately described above by the proper shipping name, and are classified,
              packaged, marked and labelled/placarded, and are in all respects in proper condition for transport according to applicable international and national governmental regulations. I declare that all of the applicable air transport requirements have been met.
            </div>
          </div>
          <div class="signatory-box">
            <div class="label-upper">NAME/TITLE OF SIGNATORY</div>
            <div>${data.signatoryName || ''}</div>
            <div>${data.signatoryTitle || ''}</div>

            <div class="label-upper" style="margin-top: 12px;">PLACE AND DATE</div>
            <div class="place-date-row">
              <span>${data.location || ''}</span>
              <span>${data.date || ''}</span>
            </div>

            <div class="signature-note">SIGNATURE (see warning above)</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Converts an HTML string to a PDF file using expo-print.
 *
 * @param html - The HTML content to convert to PDF
 * @returns Promise resolving to the file URI of the generated PDF
 */
export const convertHtmlToPdf = async (html: string): Promise<string> => {
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });
  return uri;
};

/**
 * Converts a base64 string to Uint8Array.
 * Used for PDF processing without relying on Node.js Buffer.
 */
const base64ToUint8Array = (base64: string): Uint8Array => {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

/**
 * Converts a Uint8Array to base64 string.
 * Used for PDF processing without relying on Node.js Buffer.
 */
const uint8ToBase64 = (u8Arr: Uint8Array): string => {
  const binary = Array.from(u8Arr)
    .map((b) => String.fromCharCode(b))
    .join('');
  return btoa(binary);
};

/**
 * Merges the SDDG PDF with attachment PDFs (COE/CAA documents).
 * Uses pdf-lib to combine multiple PDF documents into one.
 *
 * @param sddgUri - File URI of the SDDG PDF
 * @param attachmentUris - Array of file URIs for attachment PDFs
 * @returns Promise resolving to the file URI of the merged PDF
 */
export const mergeSDDGWithAttachments = async (
  sddgUri: string,
  attachmentUris: string[]
): Promise<string> => {
  // Create the merged PDF document
  const mergedPdf = await PDFDocument.create();

  // Read the SDDG PDF as base64
  const sddgBytes = await FileSystem.readAsStringAsync(sddgUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Convert base64 to Uint8Array and load the SDDG document
  const sddgUint8 = base64ToUint8Array(sddgBytes);
  const sddgDoc = await PDFDocument.load(sddgUint8);

  // Add all pages from SDDG
  const sddgPages = await mergedPdf.copyPages(sddgDoc, sddgDoc.getPageIndices());
  for (const page of sddgPages) {
    mergedPdf.addPage(page);
  }

  // Process each attachment
  for (const attachmentUri of attachmentUris) {
    const attachmentBytes = await FileSystem.readAsStringAsync(attachmentUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const attachmentUint8 = base64ToUint8Array(attachmentBytes);
    const attachmentDoc = await PDFDocument.load(attachmentUint8);

    const attachmentPages = await mergedPdf.copyPages(
      attachmentDoc,
      attachmentDoc.getPageIndices()
    );
    for (const page of attachmentPages) {
      mergedPdf.addPage(page);
    }
  }

  // Set PDF metadata
  mergedPdf.setTitle('SDDG with Attachments');
  mergedPdf.setAuthor('HazPro Mobile App');
  mergedPdf.setSubject("Shipper's Declaration for Dangerous Goods");
  mergedPdf.setKeywords(['SDDG', 'COE', 'CAA', 'hazardous materials']);
  mergedPdf.setProducer('HazPro Mobile');
  mergedPdf.setCreator('HazPro Mobile App');

  // Save the merged PDF
  const mergedPdfBytes = await mergedPdf.save();

  // Convert to base64 and write to file
  const mergedBase64 = uint8ToBase64(new Uint8Array(mergedPdfBytes));
  const outputPath = `${FileSystem.cacheDirectory}SDDG_merged_${Date.now()}.pdf`;

  await FileSystem.writeAsStringAsync(outputPath, mergedBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return outputPath;
};
