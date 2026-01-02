/**
 * @file ShippersDeclarationForm.test.tsx
 * @description Snapshot test for the ShippersDeclarationForm component.
 *
 * This test captures the rendered output of the Shippers Declaration Form
 * to detect unintended visual changes during refactoring.
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { View } from 'react-native';
import { createMockHazProStore } from '@/__mocks__/testUtils';

// Mock react-native-qrcode-svg before importing the component
jest.mock('react-native-qrcode-svg', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View testID="mock-qrcode" {...props} />,
  };
});

// Mock the getHazardousMaterialPhysicalState utility
jest.mock('@/utils/getHazardousMaterialPhysicalState', () => ({
  getHazardousMaterialPhysicalStateByHazardClass: jest.fn(() => 'SOLID'),
}));

// Create mock store with comprehensive test data
const mockStore = createMockHazProStore({
  shipper: {
    name: 'Test Shipper Inc.',
    address: {
      shipperStreet: '123 Test Street',
      shipperCity: 'Test City',
      shipperState: 'TS',
      shipperZipcode: '12345',
    },
    phoneNumber: {
      type: 'Commercial',
      format: 'Domestic',
      number: '555-123-4567',
      dsnNumber: '312-555-1234',
    },
  },
  consignee: {
    name: 'Test Consignee LLC',
    address: {
      consigneeDodaac: 'ABC123',
      consigneeStreet: '456 Destination Ave',
      consigneeCity: 'Dest City',
      selectedConsigneeCountry: 'United States',
    },
    phoneNumber: {
      type: 'Commercial',
      format: 'Domestic',
      number: '555-987-6543',
    },
  },
  preparer: {
    preparerName: 'John Doe',
    preparerRank: 'SGT',
    preparerTitle: 'Hazmat Specialist',
    certificationPlace: 'Fort Test',
    signature: null,
  },
  hazardousMaterial: {
    unid: 'UN1090',
    properShippingName: 'ACETONE',
    hazclassDiv: '3',
    packingGroup: 'II',
    subsidiaryRisk: '',
    specialProvision: '',
    packagingParagraph: 'A3.1.',
    isFixed: false,
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    details: '',
    physicalState: 'LIQUID',
  },
  isGrandfatheredExplosive: false,
});

// Mock the useHazProStore hook
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => mockStore,
}));

// Import component after mocks are set up
import ShippersDeclarationForm, { ShippersDeclarationProps } from '../ShippersDeclarationForm';

describe('ShippersDeclarationForm', () => {
  // Sample props with complete test data
  const sampleProps: ShippersDeclarationProps = {
    shipperName: 'Test Shipper Inc.',
    shipperAddress: '123 Test Street, Test City, TS 12345',
    phoneNumber: {
      type: 'Commercial',
      format: 'Domestic',
      number: '555-123-4567',
      dsnNumber: '312-555-1234',
    },
    dsNumber: '312-555-1234',
    airWaybillNo: 'AWB123456',
    referenceNumber: 'TCN123456789',
    airportOfDeparture: 'KDOV',
    airportOfDestination: 'ETAR',
    shipmentType: 'NON-RADIOACTIVE',
    unid: 'UN1090',
    shippingName: 'ACETONE',
    classDiv: '3',
    packingGroup: 'II',
    quantityAndPacking: '10 x 1L Steel Drums',
    packingInstruction: 'Y344',
    authorization: 'N/A',
    additionalInfo: [],
    signatoryName: 'John Doe',
    signatoryTitle: 'Hazmat Specialist',
    location: 'Fort Test',
    date: '2024-01-15',
    cargoOnly: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with complete props', () => {
    const { toJSON } = render(
      <ShippersDeclarationForm {...sampleProps} />
    );

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the SHIPPER\'S DECLARATION FOR DANGEROUS GOODS title', () => {
    const { getByText } = render(
      <ShippersDeclarationForm {...sampleProps} />
    );

    expect(getByText("SHIPPER'S DECLARATION FOR DANGEROUS GOODS")).toBeTruthy();
  });

  it('renders correctly with cargo only aircraft', () => {
    const cargoOnlyProps = {
      ...sampleProps,
      cargoOnly: true,
    };

    const { toJSON } = render(
      <ShippersDeclarationForm {...cargoOnlyProps} />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders correctly with radioactive shipment type', () => {
    const radioactiveProps: ShippersDeclarationProps = {
      ...sampleProps,
      shipmentType: 'RADIOACTIVE',
    };

    const { toJSON } = render(
      <ShippersDeclarationForm {...radioactiveProps} />
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the warning text', () => {
    const { getByText } = render(
      <ShippersDeclarationForm {...sampleProps} />
    );

    expect(getByText(/Failure to comply in all respects/)).toBeTruthy();
  });

  it('renders shipper information section', () => {
    const { getByText } = render(
      <ShippersDeclarationForm {...sampleProps} />
    );

    expect(getByText('Shipper')).toBeTruthy();
  });

  it('renders consignee information section', () => {
    const { getByText } = render(
      <ShippersDeclarationForm {...sampleProps} />
    );

    expect(getByText('Consignee')).toBeTruthy();
  });

  it('renders transport details section', () => {
    const { getByText } = render(
      <ShippersDeclarationForm {...sampleProps} />
    );

    expect(getByText('TRANSPORT DETAILS')).toBeTruthy();
  });

  it('renders nature and quantity of dangerous goods section', () => {
    const { getByText } = render(
      <ShippersDeclarationForm {...sampleProps} />
    );

    expect(getByText('NATURE AND QUANTITY OF DANGEROUS GOODS')).toBeTruthy();
  });

  it('renders declaration text', () => {
    const { getByText } = render(
      <ShippersDeclarationForm {...sampleProps} />
    );

    expect(getByText(/I hereby declare that the contents of this consignment/)).toBeTruthy();
  });
});
