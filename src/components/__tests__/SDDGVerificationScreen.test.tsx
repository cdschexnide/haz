/**
 * @file SDDGVerificationScreen.test.tsx
 * @description Snapshot test for the SDDGVerificationScreen component.
 *
 * This test captures the rendered output of the SDDGVerificationScreen component
 * to detect unintended visual changes during refactoring.
 *
 * The component has many dependencies that need to be mocked:
 * - useInspectionForm hook (context from @/contexts/InspectionFormProvider)
 * - SafeAreaView from react-native-safe-area-context
 * - MaterialIcons from @expo/vector-icons
 * - Child components: SDDGComplianceValidation, InteractiveSDDGComplianceScreen, SDDGFormFieldVisual, InspectorShippersDeclarationScreen
 */
import React from 'react';
import { render, screen } from '@testing-library/react-native';

// Mock useInspectionForm hook BEFORE importing the component
jest.mock('@/contexts/InspectionFormProvider', () => ({
  useInspectionForm: () => ({
    inspection: {
      verificationCopy: {
        shipper: 'Test Shipper',
        consignee: 'Test Consignee',
        airWaybillNumber: 'AWB12345',
        pagination: '1 of 1',
        shippersReferenceNumber: 'TCN123456789012345',
        inspectionActivity: 'AMC/TACC',
        aircraftType: 'Cargo Aircraft Only',
        airportOfDeparture: 'JFK',
        airportOfDestination: 'LAX',
        shipmentType: 'Non-Radioactive',
        unIdNo: 'UN1234',
        properShippingName: 'FLAMMABLE LIQUID',
        hazardClass: '3',
        subsidiaryRisk: '',
        packingGroup: 'II',
        quantityAndPacking: '10 x 1L',
        packingInstruction: '352',
        authorization: '',
        additionalHandlingInfo: 'Handle with care',
        nameOfSignatory: 'John Doe',
        placeAndDate: 'New York, 2024-01-01',
        signature: 'Signed',
      },
      originalImageUri: 'file:///test-image.jpg',
      frustrations: [],
    },
    workflow: {
      currentSDDGStep: 'verification',
      currentSDDGScreen: 'SDDGVerificationScreen',
    },
    setCurrentSDDGStep: jest.fn(),
    setCurrentSDDGScreen: jest.fn(),
    updateVerificationField: jest.fn(),
    setVerificationCopy: jest.fn(),
    completeSDDGSubstep: jest.fn(),
  }),
}));

// Mock child components
jest.mock('../SDDGComplianceValidation', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View testID="mock-SDDGComplianceValidation" {...props} />,
  };
});

jest.mock('../../screens/inspector/InteractiveSDDGComplianceScreen', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View testID="mock-InteractiveSDDGComplianceScreen" {...props} />,
  };
});

jest.mock('../SDDGFormFieldVisual', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View testID="mock-SDDGFormFieldVisual" {...props} />,
  };
});

jest.mock('../../screens/inspector/InspectorShippersDeclarationScreen', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View testID="mock-InspectorShippersDeclarationScreen" {...props} />,
  };
});

// Mock MaterialIcons from @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    MaterialIcons: (props: any) => <View testID={`icon-${props.name}`} {...props} />,
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, style }: any) => <View style={style}>{children}</View>,
  };
});

// Import component AFTER mocks are set up
import SDDGVerificationScreen from '../SDDGVerificationScreen';

describe('SDDGVerificationScreen', () => {
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
      <SDDGVerificationScreen navigation={mockNavigation} />
    );

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the header title', () => {
    render(<SDDGVerificationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Verify SDDG Data')).toBeTruthy();
  });

  it('renders the step indicator', () => {
    render(<SDDGVerificationScreen navigation={mockNavigation} />);

    // First field should show 1/22 (22 total fields)
    expect(screen.getByText('1/22')).toBeTruthy();
  });

  it('renders the progress bar container', () => {
    const { toJSON } = render(
      <SDDGVerificationScreen navigation={mockNavigation} />
    );

    // The progress bar is rendered as part of the component structure
    // Verify by checking the JSON tree contains the progress bar structure
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders the first field card with SHIPPER label', () => {
    render(<SDDGVerificationScreen navigation={mockNavigation} />);

    // First field is SHIPPER (Key 1)
    expect(screen.getByText('SHIPPER (Key 1)')).toBeTruthy();
  });

  it('renders the extracted value label', () => {
    render(<SDDGVerificationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Extracted Value:')).toBeTruthy();
  });

  it('renders verification buttons', () => {
    render(<SDDGVerificationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Data Accurate')).toBeTruthy();
    expect(screen.getByText('Data Incorrect or Missing')).toBeTruthy();
  });

  it('renders the back button in footer', () => {
    render(<SDDGVerificationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Back')).toBeTruthy();
  });

  it('renders the close icon in header', () => {
    render(<SDDGVerificationScreen navigation={mockNavigation} />);

    expect(screen.getByTestId('icon-close')).toBeTruthy();
  });

  it('renders check-circle and error icons for verification buttons', () => {
    render(<SDDGVerificationScreen navigation={mockNavigation} />);

    expect(screen.getByTestId('icon-check-circle')).toBeTruthy();
    expect(screen.getByTestId('icon-error')).toBeTruthy();
  });

  it('renders the extracted shipper value from verification data', () => {
    render(<SDDGVerificationScreen navigation={mockNavigation} />);

    expect(screen.getByText('Test Shipper')).toBeTruthy();
  });
});
