import {
  createPOEChangeHandler,
  createPODChangeHandler,
  PORT_OPTIONS,
  YES_NO_OPTIONS,
} from '../portOptionHandlers';

describe('portOptionHandlers', () => {
  describe('createPOEChangeHandler', () => {
    it('sets shipment poeOption and poe for Worldwide Mobility', () => {
      const store = {
        shipment: { poeOption: '', podOption: '', poe: '', pod: '' },
        shipper: {
          worldwideMobility: false,
          address: {
            shipperLocation: 'Test',
            shipperStreet: '123 St',
            shipperCity: 'City',
            shipperState: 'ST',
            shipperZipcode: '12345',
            selectedShipperCountry: 'USA',
          },
          phoneNumber: '555-1234',
        },
      };

      const handler = createPOEChangeHandler(store);
      handler('Worldwide Mobility');

      expect(store.shipment.poeOption).toBe('Worldwide Mobility');
      expect(store.shipment.poe).toBe('WORLDWIDE MOBILITY');
      expect(store.shipper.worldwideMobility).toBe(true);
      expect(store.shipper.address.shipperLocation).toBeNull();
      expect(store.shipper.phoneNumber).toBeNull();
    });

    it('sets shipment poe to empty string for Channel', () => {
      const store = {
        shipment: { poeOption: '', podOption: '', poe: 'WORLDWIDE MOBILITY', pod: '' },
        shipper: {
          worldwideMobility: true,
          address: {
            shipperLocation: null,
            shipperStreet: null,
            shipperCity: null,
            shipperState: null,
            shipperZipcode: null,
            selectedShipperCountry: null,
          },
          phoneNumber: null,
        },
      };

      const handler = createPOEChangeHandler(store);
      handler('Channel');

      expect(store.shipment.poeOption).toBe('Channel');
      expect(store.shipment.poe).toBe('');
      expect(store.shipper.worldwideMobility).toBe(false);
      expect(store.shipper.address.shipperLocation).toBe('');
    });

    it('handles missing shipment gracefully', () => {
      const store = {
        shipper: {
          worldwideMobility: false,
          address: {
            shipperLocation: 'Test',
            shipperStreet: '123 St',
            shipperCity: 'City',
            shipperState: 'ST',
            shipperZipcode: '12345',
            selectedShipperCountry: 'USA',
          },
          phoneNumber: '555-1234',
        },
      };

      const handler = createPOEChangeHandler(store);
      expect(() => handler('Worldwide Mobility')).not.toThrow();
    });
  });

  describe('createPODChangeHandler', () => {
    it('sets shipment podOption and pod for Worldwide Mobility', () => {
      const store = {
        shipment: { poeOption: '', podOption: '', poe: '', pod: '' },
        consignee: {
          worldwideMobility: false,
          address: {
            consigneeDodaac: '123456',
            consigneeStreet: '456 Ave',
            consigneeCity: 'Town',
            consigneeState: 'TX',
            consigneeZipcode: '67890',
            selectedConsigneeCountry: 'USA',
          },
          phoneNumber: '555-5678',
        },
      };

      const handler = createPODChangeHandler(store);
      handler('Worldwide Mobility');

      expect(store.shipment.podOption).toBe('Worldwide Mobility');
      expect(store.shipment.pod).toBe('WORLDWIDE MOBILITY');
      expect(store.consignee.worldwideMobility).toBe(true);
      expect(store.consignee.address.consigneeDodaac).toBeNull();
      expect(store.consignee.phoneNumber).toBeNull();
    });

    it('sets shipment pod to empty string for Channel', () => {
      const store = {
        shipment: { poeOption: '', podOption: '', poe: '', pod: 'WORLDWIDE MOBILITY' },
        consignee: {
          worldwideMobility: true,
          address: {
            consigneeDodaac: null,
            consigneeStreet: null,
            consigneeCity: null,
            consigneeState: null,
            consigneeZipcode: null,
            selectedConsigneeCountry: null,
          },
          phoneNumber: null,
        },
      };

      const handler = createPODChangeHandler(store);
      handler('Channel');

      expect(store.shipment.podOption).toBe('Channel');
      expect(store.shipment.pod).toBe('');
      expect(store.consignee.worldwideMobility).toBe(false);
      expect(store.consignee.address.consigneeDodaac).toBe('');
    });
  });

  describe('PORT_OPTIONS', () => {
    it('contains Channel and Worldwide Mobility options', () => {
      expect(PORT_OPTIONS).toHaveLength(2);
      expect(PORT_OPTIONS[0]).toEqual({ label: 'Channel', value: 'Channel' });
      expect(PORT_OPTIONS[1]).toEqual({ label: 'Worldwide Mobility', value: 'Worldwide Mobility' });
    });
  });

  describe('YES_NO_OPTIONS', () => {
    it('contains Yes and No options', () => {
      expect(YES_NO_OPTIONS).toHaveLength(2);
      expect(YES_NO_OPTIONS[0]).toEqual({ label: 'Yes', value: 'Yes' });
      expect(YES_NO_OPTIONS[1]).toEqual({ label: 'No', value: 'No' });
    });
  });
});
