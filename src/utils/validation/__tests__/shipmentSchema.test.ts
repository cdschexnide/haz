import { addressValidationSchema, shipmentValidationSchema } from '../shipmentSchema';

describe('shipmentSchema', () => {
  describe('addressValidationSchema', () => {
    it('validates complete USA address', async () => {
      const address = {
        country: 'USA',
        location: 'Base XYZ',
        streetAddress: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zipCode: '62701',
      };
      await expect(addressValidationSchema.validate(address)).resolves.toBeTruthy();
    });

    it('requires state for USA addresses', async () => {
      const address = {
        country: 'USA',
        location: 'Base XYZ',
        streetAddress: '123 Main St',
        city: 'Springfield',
        zipCode: '62701',
      };
      await expect(addressValidationSchema.validate(address)).rejects.toThrow();
    });

    it('does not require state for non-USA addresses', async () => {
      const address = {
        country: 'Germany',
        location: 'Base ABC',
        streetAddress: '456 Other St',
        city: 'Berlin',
        zipCode: '10115',
      };
      await expect(addressValidationSchema.validate(address)).resolves.toBeTruthy();
    });
  });

  describe('shipmentValidationSchema', () => {
    it('validates complete shipment', async () => {
      const shipment = {
        tcn: 'TCN123456',
        poeOption: 'aerial',
        podOption: 'surface',
      };
      await expect(shipmentValidationSchema.validate(shipment)).resolves.toBeTruthy();
    });

    it('requires tcn', async () => {
      const shipment = {
        poeOption: 'aerial',
        podOption: 'surface',
      };
      await expect(shipmentValidationSchema.validate(shipment)).rejects.toThrow('TCN');
    });
  });
});
