/**
 * @file ShipmentCreationScreen.test.tsx
 * @description Snapshot test for the ShipmentCreationScreen component.
 *
 * This test captures the rendered output of the component to detect
 * unintended visual changes during refactoring. It follows the established
 * pattern for snapshot testing in this codebase.
 *
 * Key Dependencies:
 * - useHazProStore (state, store)
 * - HazProInspectorContext (context)
 * - useNavigationRef (navigation hook)
 * - useInputRefs (form focus management)
 * - PhoneNumberInput (child component)
 * - DateTimePicker (@react-native-community/datetimepicker)
 * - react-hook-form + yup (form management)
 */
import React from 'react';
import { render, screen } from '@testing-library/react-native';

// Stable reference objects for mocks to prevent infinite re-renders
const mockState = {
  hazProPreparerContext: {
    activePersona: 'Preparer',
    activeStep: 0,
    packagingWizardStep: 0,
    completedSubsteps: [],
    hazardousMaterial: null,
    modifiersAndAcknowledgements: null,
    requiredMarkingsArray: [],
    requiredLabelsArray: [],
    shipper: {
      address: {
        shipperLocation: '',
        shipperStreet: '',
        shipperCity: '',
        shipperState: '',
        shipperZipcode: '',
        selectedShipperCountry: '',
      },
      phoneNumber: null,
      worldwideMobility: false,
    },
    consignee: {
      address: {
        consigneeDodaac: '',
        consigneeStreet: '',
        consigneeCity: '',
        consigneeState: '',
        consigneeZipcode: '',
        selectedConsigneeCountry: '',
      },
      phoneNumber: null,
      worldwideMobility: false,
    },
    preparer: {
      preparerName: '',
      preparerRank: '',
      preparerTitle: '',
      certificationPlace: '',
      certificationDate: '',
    },
    shipment: {
      tcn: '',
      poeOption: '',
      podOption: '',
      isChapter3: '',
      poe: '',
      pod: '',
    },
    packaging: null,
    technicalName: null,
    isGrandfatheredExplosive: null,
    lookupFunctionsOutput: null,
    specialProvisionsMap: {},
    allowablePackingGroups: '',
    redirectUnid: null,
  },
  isLoadingShipments: false,
  databaseError: null,
  shipmentsIndex: {},
};

const mockStore = {
  hazProPreparerContext: {
    activeStep: 0,
    preparer: {
      preparerName: '',
      preparerRank: '',
      preparerTitle: '',
      certificationPlace: '',
      certificationDate: '',
    },
    shipment: {
      tcn: '',
      poeOption: '',
      podOption: '',
      isChapter3: '',
      poe: '',
      pod: '',
    },
    shipper: {
      address: {
        shipperLocation: '',
        shipperStreet: '',
        shipperCity: '',
        shipperState: '',
        shipperZipcode: '',
        selectedShipperCountry: '',
      },
      phoneNumber: null,
      worldwideMobility: false,
    },
    consignee: {
      address: {
        consigneeDodaac: '',
        consigneeStreet: '',
        consigneeCity: '',
        consigneeState: '',
        consigneeZipcode: '',
        selectedConsigneeCountry: '',
      },
      phoneNumber: null,
      worldwideMobility: false,
    },
  },
};

const mockActions = {
  saveCurrentShipment: jest.fn().mockResolvedValue(undefined),
  loadShipment: jest.fn().mockResolvedValue(undefined),
  deleteShipment: jest.fn().mockResolvedValue(undefined),
  initializeDatabase: jest.fn().mockResolvedValue(undefined),
  refreshShipmentsIndex: jest.fn().mockResolvedValue(undefined),
  resetContext: jest.fn(),
};

// Mock useHazProStore hook BEFORE importing the component
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: mockState,
    store: mockStore,
    actions: mockActions,
    isLoading: false,
    error: null,
  }),
}));

// Create mock inspector state for HazProInspectorContext
const mockInspectorState = {
  hazProInspectorContext: {
    hazardousMaterial: null,
    isReportableQuantity: false,
    lookupFunctionsOutput: null,
    modifiersAndRequiredAcknowledgements: null,
    inspector: null,
    isLimitedQuantity: false,
    isExceptedQuantity: false,
    shipment: {
      poeOption: 'Channel',
      podOption: 'Channel',
      tcn: '',
      poe: '',
      pod: '',
    },
    activePersona: 'Preparer',
    allowablePackingGroups: '',
    packaging: null,
    shipper: null,
    consignee: null,
    activeStep: null,
    activeSubstep: null,
    completedSubsteps: [],
    preparer: null,
  },
};

const mockInspectorDispatch = jest.fn();

// Mock HazProInspectorContext with createContext
jest.mock('@/contexts/HazProInspectorProvider/HazProInspectorContext', () => {
  const React = require('react');
  const mockContext = React.createContext({
    state: mockInspectorState,
    dispatch: mockInspectorDispatch,
  });
  return {
    HazProInspectorContext: mockContext,
  };
});

// Mock useNavigationRef hook
jest.mock('@/contexts/NavigationRefProvider/useNavigationRef', () => ({
  useNavigationRef: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    setOptions: jest.fn(),
    getCurrentRoute: jest.fn(() => ({ name: 'TestScreen', params: {} })),
  }),
}));

// Mock useInputRefs hook
jest.mock('@/utils/hooks/useInputRefs', () => ({
  useInputRefs: () => ({
    getRef: jest.fn(() => ({ current: null })),
    focusNext: jest.fn(),
  }),
}));

// Mock PhoneNumberInput component
jest.mock('@/components/PhoneNumberInput', () => {
  const { View } = require('react-native');
  return {
    PhoneNumberInput: (props: any) => <View testID="mock-PhoneNumberInput" {...props} />,
  };
});

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View testID="mock-DateTimePicker" {...props} />,
  };
});

// Mock countries data
jest.mock('../../mock/countries', () => ({
  countries: [
    { name: 'United States of America', code: 'USA' },
    { name: 'Canada', code: 'CA' },
  ],
}));

// Mock theming colors
jest.mock('@/theming/colors', () => ({
  __esModule: true,
  default: {
    blue: '#007bff',
    red: '#dc3545',
    green: '#28a745',
    white: '#ffffff',
    black: '#000000',
  },
}));

// Import component AFTER mocks
import ShipmentCreationScreen from '../ShipmentCreationScreen';

describe('ShipmentCreationScreen', () => {
  // Create mock navigation with all required methods
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
    removeListener: jest.fn(),
    dispatch: jest.fn(),
    reset: jest.fn(),
    isFocused: jest.fn(() => true),
    canGoBack: jest.fn(() => true),
    getParent: jest.fn(),
    getState: jest.fn(() => ({ routes: [], index: 0 })),
  };

  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
    // Suppress console output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', () => {
    const { toJSON } = render(
      <ShipmentCreationScreen navigation={mockNavigation} />
    );

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the screen title', () => {
    render(<ShipmentCreationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Create New Shipment')).toBeTruthy();
  });

  it('renders the Shipment Information section', () => {
    render(<ShipmentCreationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Shipment Information')).toBeTruthy();
  });

  it('renders the TCN input field with correct placeholder', () => {
    render(<ShipmentCreationScreen navigation={mockNavigation} />);

    expect(screen.getByPlaceholderText('17 digits')).toBeTruthy();
  });

  it('renders POE and POD radio options', () => {
    render(<ShipmentCreationScreen navigation={mockNavigation} />);

    // Check for POE and POD labels (using regex to match text with nested required asterisks)
    expect(screen.getByText(/Port of Embarkation \(POE\)/)).toBeTruthy();
    expect(screen.getByText(/Port of Debarkation \(POD\)/)).toBeTruthy();

    // Check for radio options (Channel and Worldwide Mobility appear multiple times)
    expect(screen.getAllByText('Channel').length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText('Worldwide Mobility').length).toBeGreaterThanOrEqual(2);
  });

  it('renders Chapter 3 question', () => {
    render(<ShipmentCreationScreen navigation={mockNavigation} />);

    // Use regex to match text with nested required asterisks
    expect(
      screen.getByText(/Is this shipment moving under the authority of Chapter 3\?/)
    ).toBeTruthy();
  });

  it('renders Preparer Information section', () => {
    render(<ShipmentCreationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Preparer Information')).toBeTruthy();
  });

  it('renders preparer form fields', () => {
    render(<ShipmentCreationScreen navigation={mockNavigation} />);

    // Use regex to match text with nested required asterisks
    expect(screen.getByText(/Preparer Name/)).toBeTruthy();
    expect(screen.getByText(/Preparer Rank \(optional\)/)).toBeTruthy();
    expect(screen.getByText(/Preparer Title/)).toBeTruthy();
    expect(screen.getByText(/Certification Place/)).toBeTruthy();
    expect(screen.getByText(/Certification Date/)).toBeTruthy();
  });

  it('renders Cancel and Save & Continue buttons', () => {
    render(<ShipmentCreationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Save & Continue')).toBeTruthy();
  });
});
