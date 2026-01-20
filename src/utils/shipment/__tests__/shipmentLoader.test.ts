import { convertShipmentFile, SavedShipment } from '../shipmentLoader';

describe('shipmentLoader', () => {
  describe('convertShipmentFile', () => {
    it('converts file metadata to SavedShipment structure', () => {
      const metadata = {
        filename: 'TCN123456.json',
        name: 'TCN123456',
        lastModified: '2026-01-20T10:00:00Z',
        size: 1024,
      };

      const result = convertShipmentFile(metadata);

      expect(result.tcn).toBe('TCN123456');
      expect(result.filename).toBe('TCN123456.json');
      expect(result.lastModified).toBe('2026-01-20T10:00:00Z');
    });

    it('extracts TCN from filename without extension', () => {
      const metadata = {
        filename: 'SHIP-2026-001.json',
        name: 'SHIP-2026-001',
        lastModified: '2026-01-20T10:00:00Z',
        size: 512,
      };

      const result = convertShipmentFile(metadata);
      expect(result.tcn).toBe('SHIP-2026-001');
    });
  });
});
