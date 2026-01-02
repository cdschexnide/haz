/**
 * @file AccessorialHazardsScreen.test.tsx
 * @description Snapshot test for the AccessorialHazardsScreen component.
 *
 * This test captures the rendered output of the AccessorialHazardsScreen component
 * to detect unintended visual changes during refactoring.
 *
 * The component has many dependencies that need to be mocked:
 * - useHazProStore hook (state, store, saveCurrentShipment, isLoading, error)
 * - useNavigationRef hook (navigation hook)
 * - hazardousMaterialsList (data import)
 * - @react-native-picker/picker (Picker)
 * - @expo/vector-icons (Ionicons)
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
          unid: 'UN3166',
          properShippingName: 'VEHICLE, FLAMMABLE GAS POWERED',
          hazclassDiv: '9',
          subsidiaryRisk: '',
          packingGroup: '',
          specialProvision: '',
          packagingParagraph: '',
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
        engineOrMachineryPreparationData: {
          accessorialHazards: {
            batteries: null,
            fireExtinguishers: null,
            starterFluid: null,
            other: [],
          },
        },
        un3166Details: null,
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
          unid: 'UN3166',
          properShippingName: 'VEHICLE, FLAMMABLE GAS POWERED',
        },
        engineOrMachineryPreparationData: {
          accessorialHazards: {
            batteries: null,
            fireExtinguishers: null,
            starterFluid: null,
            other: [],
          },
        },
        un3166Details: null,
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
  ],
}));

// Mock unitConversions
jest.mock('@/utils/unitConversions', () => ({
  convertVolume: jest.fn((value, unit) => ({
    liters: unit === 'liters' ? parseFloat(value) || 0 : (parseFloat(value) || 0) * 3.78541,
    gallons: unit === 'gallons' ? parseFloat(value) || 0 : (parseFloat(value) || 0) / 3.78541,
  })),
}));

// Mock theming colors
jest.mock('@/theming/colors', () => ({
  __esModule: true,
  default: {
    blue: '#5386E4',
    red: '#a73b4a',
    green: '#60CA35',
    white: '#ffffff',
    black: '#000000',
    lightGrey: '#f8f8f8',
    mediumGrey: '#f1f1f1',
    darkGrey: '#A9A9A9',
  },
}));

// Mock Picker
jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const Picker = ({ children, selectedValue, onValueChange, style, ...props }: any) => (
    <View testID="mock-Picker" style={style} {...props}>
      <Text>{`Selected: ${selectedValue || 'none'}`}</Text>
      {children}
    </View>
  );

  Picker.Item = ({ label, value }: { label: string; value: string }) => {
    const { Text } = require('react-native');
    return <Text testID={`picker-item-${value}`}>{label}</Text>;
  };

  return { Picker };
});

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color }: { name: string; size: number; color: string }) => {
    const { Text } = require('react-native');
    return <Text testID={`icon-${name}`}>{`[Ionicons:${name}]`}</Text>;
  },
}));

// Import component AFTER mocks
import AccessorialHazardsScreen from '../AccessorialHazardsScreen';

describe('AccessorialHazardsScreen', () => {
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
      <AccessorialHazardsScreen navigation={mockNavigation} />
    );

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the title', () => {
    render(<AccessorialHazardsScreen navigation={mockNavigation} />);

    expect(screen.getByText('Identify the Accessorial Hazards for this Vehicle')).toBeTruthy();
  });

  it('renders the warning banner text', () => {
    render(<AccessorialHazardsScreen navigation={mockNavigation} />);

    expect(screen.getByText(/Accessorial Hazard - a distinct and separate hazardous item/)).toBeTruthy();
  });

  it('renders hazard chips for Batteries, Fire Extinguisher(s), Start Fluid, and Other', () => {
    render(<AccessorialHazardsScreen navigation={mockNavigation} />);

    expect(screen.getByText('Batteries')).toBeTruthy();
    expect(screen.getByText('Fire Extinguisher(s)')).toBeTruthy();
    expect(screen.getByText('Start Fluid')).toBeTruthy();
    expect(screen.getByText('Other')).toBeTruthy();
  });

  it('renders the warning icon', () => {
    render(<AccessorialHazardsScreen navigation={mockNavigation} />);

    expect(screen.getByTestId('icon-warning')).toBeTruthy();
  });

  it('renders Cancel, Save & Exit, and Save & Continue buttons', () => {
    render(<AccessorialHazardsScreen navigation={mockNavigation} />);

    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Save & Exit')).toBeTruthy();
    expect(screen.getByText('Save & Continue')).toBeTruthy();
  });
});
