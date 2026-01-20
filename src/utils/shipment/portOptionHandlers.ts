/**
 * Factory functions for handling POE/POD option changes in ShipmentCreationScreen.
 * Consolidates duplicate logic for resetting shipper/consignee addresses.
 */

type PortType = 'POE' | 'POD';

interface ShipperAddress {
  shipperLocation: string | null;
  shipperStreet: string | null;
  shipperCity: string | null;
  shipperState: string | null;
  shipperZipcode: string | null;
  selectedShipperCountry: string | null;
}

interface ConsigneeAddress {
  consigneeDodaac: string | null;
  consigneeStreet: string | null;
  consigneeCity: string | null;
  consigneeState: string | null;
  consigneeZipcode: string | null;
  selectedConsigneeCountry: string | null;
}

interface ShipperContext {
  worldwideMobility: boolean;
  address: ShipperAddress;
  phoneNumber: string | null;
}

interface ConsigneeContext {
  worldwideMobility: boolean;
  address: ConsigneeAddress;
  phoneNumber: string | null;
}

interface ShipmentContext {
  poeOption: string;
  podOption: string;
  poe: string;
  pod: string;
}

interface PreparerStore {
  shipment?: ShipmentContext;
  shipper?: ShipperContext;
  consignee?: ConsigneeContext;
}

/**
 * Creates a handler for POE option changes.
 * Resets shipper address fields when switching between Channel and Worldwide Mobility.
 */
export const createPOEChangeHandler = (store: PreparerStore) => {
  return (value: string) => {
    if (store.shipment) {
      store.shipment.poeOption = value;
      store.shipment.poe = value === 'Worldwide Mobility' ? 'WORLDWIDE MOBILITY' : '';
    }
    if (store.shipper) {
      store.shipper.worldwideMobility = value === 'Worldwide Mobility';
      if (store.shipper.address) {
        const resetValue = value === 'Worldwide Mobility' ? null : '';
        store.shipper.address.shipperLocation = resetValue;
        store.shipper.address.shipperStreet = resetValue;
        store.shipper.address.shipperCity = resetValue;
        store.shipper.address.shipperState = resetValue;
        store.shipper.address.shipperZipcode = resetValue;
        store.shipper.address.selectedShipperCountry = resetValue;
      }
      store.shipper.phoneNumber = null;
    }
  };
};

/**
 * Creates a handler for POD option changes.
 * Resets consignee address fields when switching between Channel and Worldwide Mobility.
 */
export const createPODChangeHandler = (store: PreparerStore) => {
  return (value: string) => {
    if (store.shipment) {
      store.shipment.podOption = value;
      store.shipment.pod = value === 'Worldwide Mobility' ? 'WORLDWIDE MOBILITY' : '';
    }
    if (store.consignee) {
      store.consignee.worldwideMobility = value === 'Worldwide Mobility';
      if (store.consignee.address) {
        const resetValue = value === 'Worldwide Mobility' ? null : '';
        store.consignee.address.consigneeDodaac = resetValue;
        store.consignee.address.consigneeStreet = resetValue;
        store.consignee.address.consigneeCity = resetValue;
        store.consignee.address.consigneeState = resetValue;
        store.consignee.address.consigneeZipcode = resetValue;
        store.consignee.address.selectedConsigneeCountry = resetValue;
      }
      store.consignee.phoneNumber = null;
    }
  };
};

/**
 * Radio options for POE/POD selection.
 */
export const PORT_OPTIONS = [
  { label: 'Channel', value: 'Channel' },
  { label: 'Worldwide Mobility', value: 'Worldwide Mobility' },
] as const;

/**
 * Yes/No options for Chapter 3 selection.
 */
export const YES_NO_OPTIONS = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
] as const;
