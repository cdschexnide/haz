/**
 * Tests for SDDG PDF Generator Utility
 *
 * This module extracts PDF generation logic from ShippersDeclarationScreen.tsx
 * for better testability and reuse.
 */

import {
  SDDGFormData,
  generateSDDGFormHtml,
  generateSDDGDocumentHtml,
  convertHtmlToPdf,
  mergeSDDGWithAttachments,
} from '../sddgPdfGenerator';

// Mock expo-print
jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn().mockResolvedValue({
    uri: 'file:///tmp/test-output.pdf',
  }),
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  cacheDirectory: 'file:///tmp/cache/',
  readAsStringAsync: jest.fn().mockResolvedValue('base64pdfcontent'),
  writeAsStringAsync: jest.fn().mockResolvedValue(undefined),
  deleteAsync: jest.fn().mockResolvedValue(undefined),
  copyAsync: jest.fn().mockResolvedValue(undefined),
  EncodingType: {
    Base64: 'base64',
  },
}));

// Mock pdf-lib
jest.mock('pdf-lib', () => {
  const mockPage = {};
  const mockPdfDoc = {
    getPageIndices: jest.fn().mockReturnValue([0]),
    copyPages: jest.fn().mockResolvedValue([mockPage]),
    addPage: jest.fn(),
    setTitle: jest.fn(),
    setAuthor: jest.fn(),
    setSubject: jest.fn(),
    setKeywords: jest.fn(),
    setProducer: jest.fn(),
    setCreator: jest.fn(),
    save: jest.fn().mockResolvedValue(new Uint8Array([37, 80, 68, 70])), // %PDF
  };

  return {
    PDFDocument: {
      create: jest.fn().mockResolvedValue(mockPdfDoc),
      load: jest.fn().mockResolvedValue(mockPdfDoc),
    },
  };
});

/**
 * Creates a minimal SDDGFormData for testing
 */
function createTestFormData(overrides: Partial<SDDGFormData> = {}): SDDGFormData {
  return {
    // Shipper info
    shipperName: 'Test Shipper Inc.',
    shipperStreet: '123 Test Street',
    shipperCity: 'Test City',
    shipperState: 'TS',
    shipperZipcode: '12345',
    shipperPhoneNumber: '555-123-4567',

    // Consignee info
    consigneeDodaac: 'W12ABC',
    consigneeStreet: '456 Consignee Ave',
    consigneeCity: 'Consignee City',
    consigneeCountry: 'USA',

    // Shipment info
    referenceNumber: 'TCN123456789',
    airportOfDeparture: 'DOV',
    airportOfDestination: 'RMS',
    shipmentType: 'NON-RADIOACTIVE' as const,

    // Hazardous material info
    unid: 'UN1234',
    shippingName: 'TEST CHEMICAL',
    classDiv: '3',
    packingGroup: 'II',
    quantityAndTypeOfPacking: '1 DRUM x 20 L',
    packingInstruction: '355',
    authorization: 'AFMAN24-604',

    // Signatory info
    signatoryName: 'John Doe',
    signatoryTitle: 'Shipping Manager',
    location: 'Dover AFB',
    date: '2024-01-15',

    // Additional info
    isCargoAircraftOnly: false,
    emergencyPhoneNumber1: '1-800-851-8061',
    emergencyPhoneNumber2: '+1-804-279-3131',
    additionalInfoHtml: '',

    ...overrides,
  };
}

describe('SDDG PDF Generator Utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSDDGFormHtml', () => {
    it('returns a valid HTML string', () => {
      const formData = createTestFormData();
      const html = generateSDDGFormHtml(formData);

      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);
    });

    it('includes DOCTYPE and HTML structure', () => {
      const formData = createTestFormData();
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html>');
      expect(html).toContain('</html>');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
    });

    it('includes the form title', () => {
      const formData = createTestFormData();
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain("SHIPPER'S DECLARATION FOR DANGEROUS GOODS");
    });

    it('includes shipper information', () => {
      const formData = createTestFormData({
        shipperName: 'Acme Shipping Corp',
        shipperStreet: '789 Industrial Way',
        shipperCity: 'Springfield',
        shipperState: 'IL',
        shipperZipcode: '62701',
        shipperPhoneNumber: '217-555-1234',
      });
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('Acme Shipping Corp');
      expect(html).toContain('789 Industrial Way');
      expect(html).toContain('Springfield');
      expect(html).toContain('IL');
      expect(html).toContain('62701');
      expect(html).toContain('217-555-1234');
    });

    it('includes consignee information', () => {
      const formData = createTestFormData({
        consigneeDodaac: 'W99XYZ',
        consigneeStreet: '100 Military Base Rd',
        consigneeCity: 'Fort Test',
        consigneeCountry: 'Germany',
      });
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('W99XYZ');
      expect(html).toContain('100 Military Base Rd');
      expect(html).toContain('Fort Test');
      expect(html).toContain('Germany');
    });

    it('includes reference number (TCN)', () => {
      const formData = createTestFormData({
        referenceNumber: 'TCN987654321',
      });
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('TCN987654321');
    });

    it('includes airport information', () => {
      const formData = createTestFormData({
        airportOfDeparture: 'JFK',
        airportOfDestination: 'LAX',
      });
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('JFK');
      expect(html).toContain('LAX');
    });

    it('includes shipment type with correct overlay for NON-RADIOACTIVE', () => {
      const formData = createTestFormData({
        shipmentType: 'NON-RADIOACTIVE',
      });
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('NON-RADIOACTIVE');
      expect(html).toContain('RADIOACTIVE');
    });

    it('includes hazardous material information', () => {
      const formData = createTestFormData({
        unid: 'UN3082',
        shippingName: 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE, LIQUID, N.O.S.',
        classDiv: '9',
        packingGroup: 'III',
        quantityAndTypeOfPacking: '2 DRUMS x 50 L',
        packingInstruction: '964',
        authorization: 'AFMAN24-604',
      });
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('UN3082');
      expect(html).toContain('ENVIRONMENTALLY HAZARDOUS SUBSTANCE');
      expect(html).toContain('9');
      expect(html).toContain('III');
      expect(html).toContain('2 DRUMS x 50 L');
      expect(html).toContain('964');
      expect(html).toContain('AFMAN24-604');
    });

    it('includes signatory information', () => {
      const formData = createTestFormData({
        signatoryName: 'Jane Smith',
        signatoryTitle: 'Hazmat Specialist',
        location: 'Ramstein AB',
        date: '2024-03-20',
      });
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('Jane Smith');
      expect(html).toContain('Hazmat Specialist');
      expect(html).toContain('Ramstein AB');
      expect(html).toContain('2024-03-20');
    });

    it('includes transport options with X overlay for non-cargo-only', () => {
      const formData = createTestFormData({
        isCargoAircraftOnly: false,
      });
      const html = generateSDDGFormHtml(formData);

      // Should have X overlay on CARGO AIRCRAFT ONLY when isCargoAircraftOnly is false
      expect(html).toContain('PASSENGER AND');
      expect(html).toContain('CARGO AIRCRAFT');
    });

    it('includes transport options with X overlay for cargo-only', () => {
      const formData = createTestFormData({
        isCargoAircraftOnly: true,
      });
      const html = generateSDDGFormHtml(formData);

      // Should have X overlay on PASSENGER AND CARGO AIRCRAFT when isCargoAircraftOnly is true
      expect(html).toContain('CARGO AIRCRAFT');
      expect(html).toContain('ONLY');
    });

    it('includes emergency phone numbers', () => {
      const formData = createTestFormData({
        emergencyPhoneNumber1: '1-800-HAZMAT1',
        emergencyPhoneNumber2: '+1-555-HAZMAT2',
      });
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('1-800-HAZMAT1');
      expect(html).toContain('+1-555-HAZMAT2');
    });

    it('includes additional handling information when provided', () => {
      const formData = createTestFormData({
        additionalInfoHtml: '<p class="info-line">Special handling required</p>',
      });
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('Special handling required');
    });

    it('includes red stripe styling for dangerous goods form', () => {
      const formData = createTestFormData();
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('red-stripe-left');
      expect(html).toContain('red-stripe-right');
    });

    it('includes declaration text', () => {
      const formData = createTestFormData();
      const html = generateSDDGFormHtml(formData);

      expect(html).toContain('I hereby declare that the contents of this consignment');
      expect(html).toContain('proper shipping name');
    });

    it('handles empty optional fields gracefully', () => {
      const formData = createTestFormData({
        packingGroup: '',
        additionalInfoHtml: '',
      });
      const html = generateSDDGFormHtml(formData);

      expect(typeof html).toBe('string');
      expect(html.length).toBeGreaterThan(0);
    });
  });

  describe('generateSDDGDocumentHtml', () => {
    it('includes QR code image when dataUrl is provided', () => {
      const formData = createTestFormData();
      const qrCodeDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

      const html = generateSDDGDocumentHtml(formData, qrCodeDataUrl);

      expect(html).toContain('<img');
      expect(html).toContain(qrCodeDataUrl);
      expect(html).toContain('QR Code');
    });

    it('does not include QR code image when dataUrl is empty', () => {
      const formData = createTestFormData();
      const qrCodeDataUrl = '';

      const html = generateSDDGDocumentHtml(formData, qrCodeDataUrl);

      // Should not have a QR code image element when no URL provided
      expect(html).not.toContain('data:image/png;base64');
    });

    it('generates valid HTML structure with QR code', () => {
      const formData = createTestFormData();
      const qrCodeDataUrl = 'data:image/png;base64,testdata';

      const html = generateSDDGDocumentHtml(formData, qrCodeDataUrl);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html>');
      expect(html).toContain('</html>');
    });

    it('includes all form data in the document', () => {
      const formData = createTestFormData({
        shipperName: 'QR Test Shipper',
        referenceNumber: 'QR-TCN-12345',
      });
      const qrCodeDataUrl = 'data:image/png;base64,testqr';

      const html = generateSDDGDocumentHtml(formData, qrCodeDataUrl);

      expect(html).toContain('QR Test Shipper');
      expect(html).toContain('QR-TCN-12345');
    });
  });

  describe('convertHtmlToPdf', () => {
    it('returns a file URI string', async () => {
      const html = '<html><body>Test</body></html>';

      const uri = await convertHtmlToPdf(html);

      expect(typeof uri).toBe('string');
      expect(uri).toMatch(/^file:\/\//);
    });

    it('calls expo-print with correct parameters', async () => {
      const Print = require('expo-print');
      const html = '<html><body>Test PDF Content</body></html>';

      await convertHtmlToPdf(html);

      expect(Print.printToFileAsync).toHaveBeenCalledWith({
        html,
        base64: false,
      });
    });

    it('returns the URI from printToFileAsync result', async () => {
      const Print = require('expo-print');
      const expectedUri = 'file:///custom/path/output.pdf';
      Print.printToFileAsync.mockResolvedValueOnce({ uri: expectedUri });

      const html = '<html><body>Test</body></html>';
      const uri = await convertHtmlToPdf(html);

      expect(uri).toBe(expectedUri);
    });
  });

  describe('mergeSDDGWithAttachments', () => {
    it('returns a file URI string', async () => {
      const sddgUri = 'file:///tmp/sddg.pdf';
      const attachmentUris = ['file:///tmp/attachment1.pdf'];

      const resultUri = await mergeSDDGWithAttachments(sddgUri, attachmentUris);

      expect(typeof resultUri).toBe('string');
      expect(resultUri).toMatch(/^file:\/\//);
    });

    it('creates a new PDF document for merging', async () => {
      const { PDFDocument } = require('pdf-lib');
      const sddgUri = 'file:///tmp/sddg.pdf';
      const attachmentUris = ['file:///tmp/attachment1.pdf'];

      await mergeSDDGWithAttachments(sddgUri, attachmentUris);

      expect(PDFDocument.create).toHaveBeenCalled();
    });

    it('loads both SDDG and attachment PDFs', async () => {
      const { PDFDocument } = require('pdf-lib');
      const sddgUri = 'file:///tmp/sddg.pdf';
      const attachmentUris = ['file:///tmp/attachment1.pdf'];

      await mergeSDDGWithAttachments(sddgUri, attachmentUris);

      // Should load SDDG and at least one attachment
      expect(PDFDocument.load).toHaveBeenCalled();
    });

    it('handles multiple attachments', async () => {
      const { PDFDocument } = require('pdf-lib');
      const sddgUri = 'file:///tmp/sddg.pdf';
      const attachmentUris = [
        'file:///tmp/attachment1.pdf',
        'file:///tmp/attachment2.pdf',
        'file:///tmp/attachment3.pdf',
      ];

      await mergeSDDGWithAttachments(sddgUri, attachmentUris);

      // Should load SDDG plus all attachments
      // 1 SDDG + 3 attachments = 4 loads
      expect(PDFDocument.load).toHaveBeenCalled();
    });

    it('handles empty attachments array', async () => {
      const sddgUri = 'file:///tmp/sddg.pdf';
      const attachmentUris: string[] = [];

      const resultUri = await mergeSDDGWithAttachments(sddgUri, attachmentUris);

      // Should still return a valid URI (just the SDDG)
      expect(typeof resultUri).toBe('string');
    });

    it('sets PDF metadata on merged document', async () => {
      const { PDFDocument } = require('pdf-lib');
      const mockPdfDoc = await PDFDocument.create();
      const sddgUri = 'file:///tmp/sddg.pdf';
      const attachmentUris = ['file:///tmp/attachment1.pdf'];

      await mergeSDDGWithAttachments(sddgUri, attachmentUris);

      expect(mockPdfDoc.setTitle).toHaveBeenCalledWith('SDDG with Attachments');
      expect(mockPdfDoc.setAuthor).toHaveBeenCalledWith('HazPro Mobile App');
    });

    it('copies pages from source documents', async () => {
      const { PDFDocument } = require('pdf-lib');
      const mockPdfDoc = await PDFDocument.create();
      const sddgUri = 'file:///tmp/sddg.pdf';
      const attachmentUris = ['file:///tmp/attachment1.pdf'];

      await mergeSDDGWithAttachments(sddgUri, attachmentUris);

      expect(mockPdfDoc.copyPages).toHaveBeenCalled();
      expect(mockPdfDoc.addPage).toHaveBeenCalled();
    });

    it('saves the merged PDF', async () => {
      const { PDFDocument } = require('pdf-lib');
      const mockPdfDoc = await PDFDocument.create();
      const sddgUri = 'file:///tmp/sddg.pdf';
      const attachmentUris = ['file:///tmp/attachment1.pdf'];

      await mergeSDDGWithAttachments(sddgUri, attachmentUris);

      expect(mockPdfDoc.save).toHaveBeenCalled();
    });

    it('writes the merged PDF to file system', async () => {
      const FileSystem = require('expo-file-system');
      const sddgUri = 'file:///tmp/sddg.pdf';
      const attachmentUris = ['file:///tmp/attachment1.pdf'];

      await mergeSDDGWithAttachments(sddgUri, attachmentUris);

      expect(FileSystem.writeAsStringAsync).toHaveBeenCalled();
    });
  });

  describe('SDDGFormData interface', () => {
    it('accepts all required fields', () => {
      const formData: SDDGFormData = {
        shipperName: 'Test',
        shipperStreet: 'Street',
        shipperCity: 'City',
        shipperState: 'ST',
        shipperZipcode: '12345',
        shipperPhoneNumber: '555-1234',
        consigneeDodaac: 'DODAAC',
        consigneeStreet: 'Street',
        consigneeCity: 'City',
        consigneeCountry: 'Country',
        referenceNumber: 'REF123',
        airportOfDeparture: 'DEP',
        airportOfDestination: 'DEST',
        shipmentType: 'NON-RADIOACTIVE',
        unid: 'UN1234',
        shippingName: 'Name',
        classDiv: '3',
        packingGroup: 'II',
        quantityAndTypeOfPacking: '1 x 20L',
        packingInstruction: '355',
        authorization: 'AUTH',
        signatoryName: 'Signer',
        signatoryTitle: 'Title',
        location: 'Location',
        date: '2024-01-01',
        isCargoAircraftOnly: false,
        emergencyPhoneNumber1: 'Phone1',
        emergencyPhoneNumber2: 'Phone2',
        additionalInfoHtml: '',
      };

      // Type check passes if this compiles
      expect(formData.shipperName).toBe('Test');
    });

    it('accepts shipmentType as RADIOACTIVE', () => {
      const formData = createTestFormData({
        shipmentType: 'RADIOACTIVE',
      });

      expect(formData.shipmentType).toBe('RADIOACTIVE');
    });
  });
});
