/**
 * @file CertifyFormScreen.test.tsx
 * @description Tests for the CertifyFormScreen component.
 *
 * This test verifies the refactored screen that uses:
 * - CertificationInfoCard for displaying preparer info
 * - SignatureSection for signature capture
 * - LoadingOverlay for loading state
 * - ActionFooter for buttons
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
        preparer: {
          preparerName: 'John Doe',
          preparerRank: 'SGT',
          preparerTitle: 'Hazmat Specialist',
          certificationPlace: 'Fort Bragg',
          signature: null,
        },
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
        preparer: {
          preparerName: 'John Doe',
          preparerRank: 'SGT',
          preparerTitle: 'Hazmat Specialist',
          certificationPlace: 'Fort Bragg',
          signature: null,
        },
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
import { CertifyFormScreen } from '../CertifyFormScreen';

describe('CertifyFormScreen', () => {
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
    const { toJSON } = render(
      <CertifyFormScreen navigation={mockNavigation} />
    );

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the "Certify Shipment" title', () => {
    const { getByText } = render(
      <CertifyFormScreen navigation={mockNavigation} />
    );

    expect(getByText('Certify Shipment')).toBeTruthy();
  });

  it('renders the "Certification Information" section', () => {
    const { getByText } = render(
      <CertifyFormScreen navigation={mockNavigation} />
    );

    expect(getByText('Certification Information')).toBeTruthy();
  });

  it('renders the Signature section', () => {
    const { getByText } = render(
      <CertifyFormScreen navigation={mockNavigation} />
    );

    expect(getByText('Signature')).toBeTruthy();
  });

  it('renders signature placeholder when no signature is present', () => {
    const { getByText } = render(
      <CertifyFormScreen navigation={mockNavigation} />
    );

    expect(getByText('Tap to sign')).toBeTruthy();
  });

  it('renders Cancel, Save & Exit, and Certify buttons', () => {
    const { getByText } = render(
      <CertifyFormScreen navigation={mockNavigation} />
    );

    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Save & Exit')).toBeTruthy();
    expect(getByText('Certify')).toBeTruthy();
  });

  it('displays preparer information from the store', () => {
    const { getByText } = render(
      <CertifyFormScreen navigation={mockNavigation} />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('SGT')).toBeTruthy();
    expect(getByText('Hazmat Specialist')).toBeTruthy();
    expect(getByText('Fort Bragg')).toBeTruthy();
  });
});
