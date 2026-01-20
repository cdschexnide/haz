import {
  addressValidationSchema,
  shipmentValidationSchema,
  shipmentCreationSchema,
} from '../shipmentSchema';

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

  describe('shipmentCreationSchema', () => {
    const validShipment = {
      tcn: '12345678901234567',
      poeOption: 'Worldwide Mobility',
      podOption: 'Worldwide Mobility',
      isChapter3: 'No',
      preparerName: 'John Doe',
      preparerTitle: 'Shipping Specialist',
      certificationPlace: 'Norfolk, VA',
      certificationDate: '2026-01-20',
    };

    it('validates complete shipment with Worldwide Mobility', async () => {
      await expect(shipmentCreationSchema.validate(validShipment)).resolves.toBeTruthy();
    });

    it('requires TCN to be exactly 17 characters', async () => {
      const shipment = { ...validShipment, tcn: '12345' };
      await expect(shipmentCreationSchema.validate(shipment)).rejects.toThrow('17 characters');
    });

    it('requires shipper fields when poeOption is Channel', async () => {
      const shipment = { ...validShipment, poeOption: 'Channel' };
      await expect(shipmentCreationSchema.validate(shipment)).rejects.toThrow();
    });

    it('validates Channel POE with shipper fields', async () => {
      const shipment = {
        ...validShipment,
        poeOption: 'Channel',
        poe: 'Port ABC',
        shipperLocation: 'Base XYZ',
        shipperStreet: '123 Main St',
        shipperCity: 'Norfolk',
        shipperZipcode: '23510',
        shipperCountry: 'USA',
      };
      await expect(shipmentCreationSchema.validate(shipment)).resolves.toBeTruthy();
    });

    it('requires consignee DODAAC to be 6 digits when podOption is Channel', async () => {
      const shipment = {
        ...validShipment,
        podOption: 'Channel',
        pod: 'Port DEF',
        consigneeDodaac: '123', // Too short
        consigneeCountry: 'USA',
      };
      await expect(shipmentCreationSchema.validate(shipment)).rejects.toThrow('6 digits');
    });

    it('validates Channel POD with consignee fields', async () => {
      const shipment = {
        ...validShipment,
        podOption: 'Channel',
        pod: 'Port DEF',
        consigneeDodaac: '123456',
        consigneeCountry: 'USA',
      };
      await expect(shipmentCreationSchema.validate(shipment)).resolves.toBeTruthy();
    });
  });
});
