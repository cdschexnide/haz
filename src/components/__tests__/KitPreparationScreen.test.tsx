/**
 * @file KitPreparationScreen.test.tsx
 * @description Snapshot tests for the KitPreparationScreen component.
 *
 * This test captures the rendered output of the KitPreparationScreen component
 * to detect unintended visual changes during refactoring.
 *
 * The component has many dependencies that need to be mocked:
 * - useHazProStore hook (state, store, saveCurrentShipment)
 * - hazardousMaterialsList (data import)
 * - Picker (@react-native-picker/picker)
 * - MaterialIcons (@expo/vector-icons)
 * - react-hook-form + yup (form management)
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
          unid: 'UN3316',
          properShippingName: 'CHEMICAL KIT',
          hazclassDiv: '9',
          subsidiaryRisk: '',
          packingGroup: '',
          specialProvision: '',
          packagingParagraph: 'A19.2.',
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
        kitPreparationData: null,
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
          unid: 'UN3316',
          properShippingName: 'CHEMICAL KIT',
        },
        kitPreparationData: null,
      },
    },
    saveCurrentShipment: jest.fn().mockResolvedValue(undefined),
    isLoading: false,
    error: null,
  }),
}));

// Mock hazardousMaterialsList
jest.mock('@/hazardousMaterials/hazardousMaterialsList', () => ({
  hazardousMaterialsList: [
    {
      unid: 'UN1090',
      properShippingName: 'ACETONE',
      hazclassDiv: '3',
      subsidiaryRisk: '',
      packingGroup: 'II',
      specialProvision: '',
      packagingParagraph: 'A3.1.',
    },
    {
      unid: 'UN1203',
      properShippingName: 'GASOLINE',
      hazclassDiv: '3',
      subsidiaryRisk: '',
      packingGroup: 'II',
      specialProvision: '',
      packagingParagraph: 'A3.1.',
    },
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

// Mock MaterialIcons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: (props: any) => <View testID={`icon-${props.name}`} {...props} />,
  };
});

// Import component AFTER mocks
import KitPreparationScreen from '../KitPreparationScreen';

describe('KitPreparationScreen', () => {
  // Create mock navigation
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
      <KitPreparationScreen navigation={mockNavigation} />
    );

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the title with kit type', () => {
    render(<KitPreparationScreen navigation={mockNavigation} />);

    expect(screen.getByText('CHEMICAL KIT Preparation')).toBeTruthy();
  });

  it('renders the subtitle with UN number and regulation reference', () => {
    render(<KitPreparationScreen navigation={mockNavigation} />);

    expect(screen.getByText('UN3316 - AFMAN 24-604 §A19.2')).toBeTruthy();
  });

  it('renders the Kit Contents section', () => {
    render(<KitPreparationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Kit Contents')).toBeTruthy();
    expect(screen.getByText('List all hazardous substances contained in this kit.')).toBeTruthy();
  });

  it('renders the Outer Packaging section', () => {
    render(<KitPreparationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Outer Packaging')).toBeTruthy();
    // "Packaging Type" includes a required asterisk as a child Text element
    expect(screen.getByText(/Packaging Type/)).toBeTruthy();
  });

  it('renders the Safety Checklist section', () => {
    render(<KitPreparationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Safety Checklist')).toBeTruthy();
    expect(screen.getByText('All items must be acknowledged before proceeding.')).toBeTruthy();
  });

  it('renders safety checklist items', () => {
    render(<KitPreparationScreen navigation={mockNavigation} />);

    expect(screen.getByText('I confirm the most stringent Packing Group is used across all kit contents.')).toBeTruthy();
    expect(screen.getByText('I confirm contents will not react to generate heat or gas if mixed.')).toBeTruthy();
    expect(screen.getByText('I confirm all substances are authorized as Limited or Excepted Quantities.')).toBeTruthy();
    expect(screen.getByText('I confirm each receptacle complies with maximum volume/mass limits.')).toBeTruthy();
    expect(screen.getByText('I confirm the kit complies with maximum aggregate mass/volume requirements.')).toBeTruthy();
  });

  it('renders Cancel, Save & Exit, and Save & Continue buttons', () => {
    render(<KitPreparationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Save & Exit')).toBeTruthy();
    expect(screen.getByText('Save & Continue')).toBeTruthy();
  });

  it('renders the Add Substance button', () => {
    render(<KitPreparationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Add Substance')).toBeTruthy();
  });

  it('renders the no substances message when contents are empty', () => {
    render(<KitPreparationScreen navigation={mockNavigation} />);

    expect(screen.getByText('No substances added yet. Add at least one substance.')).toBeTruthy();
  });

  it('renders the multiple containers toggle', () => {
    render(<KitPreparationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Kit uses multiple containers')).toBeTruthy();
  });
});
