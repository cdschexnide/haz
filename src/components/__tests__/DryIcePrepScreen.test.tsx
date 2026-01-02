/**
 * @file DryIcePrepScreen.test.tsx
 * @description Snapshot tests for the DryIcePrepScreen component.
 *
 * This test captures the rendered output of the DryIcePrepScreen component
 * to detect unintended visual changes during refactoring.
 *
 * The component has the following dependencies that need to be mocked:
 * - useHazProStore hook (state, store, saveCurrentShipment)
 * - useNavigationRef hook (navigation)
 * - @/theming/colors
 */
import React from 'react';
import { render, screen } from '@testing-library/react-native';

// Mock useHazProStore hook BEFORE importing the component
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: {
      hazProPreparerContext: {
        activePersona: 'Preparer',
        activeStep: 2,
        packagingWizardStep: 0,
        completedSubsteps: [],
        hazardousMaterial: {
          unid: 'UN1845',
          properShippingName: 'CARBON DIOXIDE, SOLID',
          hazclassDiv: '9',
          subsidiaryRisk: '',
          packingGroup: '',
          specialProvision: '',
          packagingParagraph: 'A13.10.',
        },
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
        dryIceData: null,
      },
      isLoadingShipments: false,
      databaseError: null,
      shipmentsIndex: {},
    },
    store: {
      hazProPreparerContext: {
        activeStep: 2,
        completedSubsteps: [],
        hazardousMaterial: {
          unid: 'UN1845',
          properShippingName: 'CARBON DIOXIDE, SOLID',
        },
        dryIceData: null,
      },
    },
    saveCurrentShipment: jest.fn().mockResolvedValue(undefined),
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

// Mock colors
jest.mock('@/theming/colors', () => ({
  __esModule: true,
  default: {
    blue: '#0066cc',
    green: '#28a745',
    noRed: '#dc3545',
    lightGray: '#f8f9fa',
    darkGray: '#495057',
  },
}));

// Import component AFTER mocks
import DryIcePrepScreen from '../DryIcePrepScreen';

describe('DryIcePrepScreen', () => {
  // Create mock navigation object
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatch: jest.fn(),
  };

  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { toJSON } = render(
      <DryIcePrepScreen navigation={mockNavigation} />
    );

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the briefing panel title', () => {
    render(<DryIcePrepScreen navigation={mockNavigation} />);

    expect(screen.getByText('A13.10. DRY ICE (CARBON DIOXIDE, SOLID)')).toBeTruthy();
  });

  it('renders the Packaging Information section title', () => {
    render(<DryIcePrepScreen navigation={mockNavigation} />);

    expect(screen.getByText('Packaging Information')).toBeTruthy();
  });

  it('renders the Transport Requirements section title', () => {
    render(<DryIcePrepScreen navigation={mockNavigation} />);

    expect(screen.getByText('Transport Requirements')).toBeTruthy();
  });

  it('renders packaging type options', () => {
    render(<DryIcePrepScreen navigation={mockNavigation} />);

    expect(screen.getByText('Fiberboard Box')).toBeTruthy();
    expect(screen.getByText('Polystyrene Foam Container')).toBeTruthy();
    // 'Other' appears twice (packaging type and aircraft type), so use getAllByText
    expect(screen.getAllByText('Other').length).toBeGreaterThanOrEqual(1);
  });

  it('renders quantity input with label', () => {
    render(<DryIcePrepScreen navigation={mockNavigation} />);

    expect(screen.getByText('Net Quantity of Dry Ice')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter quantity')).toBeTruthy();
  });

  it('renders aircraft pressurized toggle', () => {
    render(<DryIcePrepScreen navigation={mockNavigation} />);

    expect(screen.getByText('Aircraft Pressurized?')).toBeTruthy();
    expect(screen.getByLabelText('Is aircraft pressurized toggle')).toBeTruthy();
  });

  it('renders venting toggle', () => {
    render(<DryIcePrepScreen navigation={mockNavigation} />);

    expect(screen.getByText('Venting Provided to Release CO\u2082 Gas?')).toBeTruthy();
    expect(screen.getByLabelText('Is venting provided toggle')).toBeTruthy();
  });

  it('renders the button container with Cancel, Save & Exit, and Save & Continue buttons', () => {
    render(<DryIcePrepScreen navigation={mockNavigation} />);

    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Save & Exit')).toBeTruthy();
    expect(screen.getByText('Save & Continue')).toBeTruthy();
  });
});
