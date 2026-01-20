/**
 * @file LithiumBatteriesPrepScreen.test.tsx
 * @description Snapshot test for the LithiumBatteriesPrepScreen component.
 *
 * This test captures the rendered output of the LithiumBatteriesPrepScreen component
 * to detect unintended visual changes during refactoring.
 *
 * The component has the following dependencies that need to be mocked:
 * - useHazProStore hook (state, store, saveCurrentShipment)
 * - @react-native-picker/picker (Picker)
 * - SpecialtyMaterialScreen wrapper
 * - UI components from @/components/ui
 *
 * The component is a multi-step wizard (4 steps) for lithium battery preparation.
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
          unid: 'UN3480',
          properShippingName: 'LITHIUM ION BATTERIES',
          hazardClass: '9',
          hazclassDiv: '9',
          subsidiaryRisk: '',
          packingGroup: '',
          specialProvision: '',
          packagingParagraph: 'A88.',
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
        lithiumBatteryData: null,
        lithiumBatteryExceptionParameters: null,
        isLithiumBatteryExceptedQuantity: null,
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
          unid: 'UN3480',
          properShippingName: 'LITHIUM ION BATTERIES',
        },
        lithiumBatteryData: null,
        lithiumBatteryExceptionParameters: null,
        isLithiumBatteryExceptedQuantity: null,
      },
    },
    saveCurrentShipment: jest.fn().mockResolvedValue(undefined),
    isLoading: false,
    error: null,
  }),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { View, Text } = require('react-native');
  return {
    MaterialIcons: ({ name, size, color }: any) => (
      <View testID={`icon-${name}`}>
        <Text>{name}</Text>
      </View>
    ),
  };
});

// Mock Picker
jest.mock('@react-native-picker/picker', () => {
  const { View, Text } = require('react-native');
  const Picker = ({ children, selectedValue, onValueChange, style }: any) => (
    <View testID="mock-Picker" style={style}>
      <Text>{selectedValue}</Text>
      {children}
    </View>
  );
  Picker.Item = ({ label, value }: any) => (
    <View testID={`picker-item-${value}`}>
      <Text>{label}</Text>
    </View>
  );
  return { Picker };
});

// Import component AFTER mocks
import LithiumBatteriesPrepScreen from '../LithiumBatteriesPrepScreen';

describe('LithiumBatteriesPrepScreen', () => {
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
      <LithiumBatteriesPrepScreen navigation={mockNavigation} />
    );

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the step indicator', () => {
    render(<LithiumBatteriesPrepScreen navigation={mockNavigation} />);

    // Check for step indicator text (Step 1 of 4 on initial render)
    expect(screen.getByText('Step 1 of 4')).toBeTruthy();
  });

  it('renders the info banner', () => {
    render(<LithiumBatteriesPrepScreen navigation={mockNavigation} />);

    // Check for info banner content (now in SpecialtyMaterialScreen wrapper)
    expect(
      screen.getByText(
        'Lithium cells and batteries must meet UN Manual of Tests and Criteria requirements. Batteries must have protection against short circuits and violent rupture.'
      )
    ).toBeTruthy();
  });

  it('renders the section header for packaging method selection', () => {
    render(<LithiumBatteriesPrepScreen navigation={mockNavigation} />);

    // Check for section header (updated to match new component structure)
    expect(
      screen.getByText('Packaging for Lithium Ion Batteries')
    ).toBeTruthy();
  });

  it('renders packaging method options', () => {
    render(<LithiumBatteriesPrepScreen navigation={mockNavigation} />);

    // Check for packaging options
    expect(screen.getByText('Combination Packaging')).toBeTruthy();
    expect(screen.getByText('Large Packaging (Single Battery)')).toBeTruthy();
    expect(screen.getByText('Batteries Exceeding 12kg')).toBeTruthy();
  });

  it('renders the footer buttons', () => {
    render(<LithiumBatteriesPrepScreen navigation={mockNavigation} />);

    // Check for Cancel, Save & Exit, and Next buttons
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Save & Exit')).toBeTruthy();
    expect(screen.getByText('Next')).toBeTruthy();
  });

  it('renders material information card', () => {
    render(<LithiumBatteriesPrepScreen navigation={mockNavigation} />);

    // Check for material info display (via SpecialtyMaterialScreen wrapper)
    expect(screen.getByText('Material Information')).toBeTruthy();
    expect(screen.getByText('UN3480')).toBeTruthy();
    expect(screen.getByText('LITHIUM ION BATTERIES')).toBeTruthy();
  });
});
