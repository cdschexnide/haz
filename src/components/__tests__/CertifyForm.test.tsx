/**
 * @file CertifyForm.test.tsx
 * @description Snapshot test for the CertifyForm component.
 *
 * This test captures the rendered output of the component to detect
 * unintended visual changes during refactoring. It follows the established
 * pattern for snapshot testing in this codebase.
 */
import React from 'react';
import { render } from '@testing-library/react-native';

// Mock useHazProStore hook BEFORE importing the component
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: {
      hazProPreparerContext: {
        activePersona: 'Preparer',
        activeStep: 0,
        packagingWizardStep: 0,
        completedSubsteps: [],
        hazardousMaterial: null,
        modifiersAndAcknowledgements: null,
        requiredMarkingsArray: [],
        requiredLabelsArray: [],
        shipper: null,
        consignee: null,
        preparer: null,
        shipment: null,
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
    },
    store: {
      hazProPreparerContext: {
        activeStep: 0,
        preparer: null,
      },
    },
    actions: {
      saveCurrentShipment: jest.fn().mockResolvedValue(undefined),
      loadShipment: jest.fn().mockResolvedValue(undefined),
      deleteShipment: jest.fn().mockResolvedValue(undefined),
      initializeDatabase: jest.fn().mockResolvedValue(undefined),
      refreshShipmentsIndex: jest.fn().mockResolvedValue(undefined),
      resetContext: jest.fn(),
    },
    isLoading: false,
    error: null,
  }),
}));

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

// Mock SignatureModal component
jest.mock('@/components/SignatureModal', () => {
  const { View } = require('react-native');
  const MockSignatureModal = ({ visible, ...props }: any) => {
    if (!visible) return null;
    return <View testID="mock-SignatureModal" {...props} />;
  };
  return MockSignatureModal;
});

// Mock DatabaseErrorDisplay component
jest.mock('@/components/DatabaseErrorDisplay', () => {
  const { View } = require('react-native');
  const MockDatabaseErrorDisplay = (props: any) => {
    return <View testID="mock-DatabaseErrorDisplay" {...props} />;
  };
  return MockDatabaseErrorDisplay;
});

// Import component after mocks are set up
import CertifyForm from '../CertifyForm';

describe('CertifyForm', () => {
  // Create mock navigation
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
  });

  it('renders correctly', () => {
    const { toJSON } = render(<CertifyForm navigation={mockNavigation} />);

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the "Certify Shipment" title', () => {
    const { getByText } = render(<CertifyForm navigation={mockNavigation} />);

    expect(getByText('Certify Shipment')).toBeTruthy();
  });

  it('renders the "Signatory Information" section', () => {
    const { getByText } = render(<CertifyForm navigation={mockNavigation} />);

    expect(getByText('Signatory Information')).toBeTruthy();
  });

  it('renders the Signature section', () => {
    const { getByText } = render(<CertifyForm navigation={mockNavigation} />);

    expect(getByText('Signature')).toBeTruthy();
  });

  it('renders the Sign button when no signature is present', () => {
    const { getByText } = render(<CertifyForm navigation={mockNavigation} />);

    expect(getByText('Sign')).toBeTruthy();
  });

  it('renders Cancel, Save & Exit, and Certify buttons', () => {
    const { getByText } = render(<CertifyForm navigation={mockNavigation} />);

    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Save & Exit')).toBeTruthy();
    expect(getByText('Certify')).toBeTruthy();
  });

  it('renders "No Signature Captured" placeholder when signature is not present', () => {
    const { getByText } = render(<CertifyForm navigation={mockNavigation} />);

    expect(getByText('No Signature Captured')).toBeTruthy();
  });
});
