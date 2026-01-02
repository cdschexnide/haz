/**
 * @file MaterialIDScreen.test.tsx
 * @description Snapshot tests for the MaterialIDScreen component.
 *
 * This test captures the rendered output of the MaterialIDScreen component
 * to detect unintended visual changes during refactoring.
 *
 * The component has many dependencies that need to be mocked:
 * - useHazProStore hook (state, store, actions)
 * - @expo/vector-icons (Ionicons)
 * - @react-native-picker/picker (Picker)
 * - react-native-elements (ListItem)
 * - react-native-vector-icons/MaterialCommunityIcons
 * - Multiple server imports (hazardousMaterialsList, lookup functions, etc.)
 */
import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';

// Mock the useHazProStore hook before importing the component
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: {
      hazProPreparerContext: {
        hazardousMaterial: null,
        isGrandfatheredExplosive: null,
        technicalName: '',
        redirectUnid: null,
      },
    },
    store: {
      hazProPreparerContext: {
        activeStep: 1,
        completedSubsteps: [],
        hazardousMaterial: null,
        packaging: { inputPOPMarking: { type: undefined } },
        modifiersAndRequiredAcknowledgements: {},
      },
    },
    actions: { resetContext: jest.fn() },
  }),
}));

// Mock server imports - paths are relative to the component being tested (../MaterialIDScreen.tsx)
jest.mock('../../../server/data/technicalNames', () => ({
  A6_15TechnicalNames: ['Technical Name 1', 'Technical Name 2'],
}));

jest.mock('../../../server/hazardousWaste/isHazardousWaste', () => ({
  __esModule: true,
  default: () => ({ isHazardousWaste: false }),
}));

jest.mock('../../../server/organicPeroxides/isOrganicPeroxide', () => ({
  __esModule: true,
  default: () => ({ isOrganicPeroxide: false }),
}));

// Mock all lookup function imports
jest.mock('../../../server/lookupFunctions/hazProContextLookup', () => ({
  hazProContextLookup: jest.fn(() => null),
}));

jest.mock('../../../server/lookupFunctions/specialProvisions', () => ({
  specialProvisionsMap: {},
}));

jest.mock('../../../server/informativeStatements/informativeStatements', () => ({
  informativeSpecialProvisionsMap: {},
}));

// Mock workflow modifiers
jest.mock('../../../server/workflowModifiers/labelingModifiers', () => ({
  aCodeLabelingModifiers: {},
  numericSpecialProvisionsLabelingModifiers: {},
}));

jest.mock('../../../server/workflowModifiers/packagingAndSDDGModifiers', () => ({
  numericSpecialProvisionsSDDGAndPackagingModifiers: {},
}));

jest.mock('../../../server/workflowModifiers/packagingModifiers', () => ({
  aCodePackagingModifiers: {},
  nCodePackagingModifiers: {},
}));

jest.mock('../../../server/workflowModifiers/passengerEligibilityModifiers', () => ({
  aCodePassengerEligibilityModifiers: {},
  pCodePassengerEligibilityModifiers: {},
}));

jest.mock('../../../server/workflowModifiers/SDDGModifiers', () => ({
  aCodeSDDGModifiers: {},
  numericSpecialProvisionsSDDGModifiers: {},
}));

// Mock hazardousMaterialsList - path relative to component: ../hazardousMaterials/hazardousMaterialsList
jest.mock('../../hazardousMaterials/hazardousMaterialsList', () => ({
  hazardousMaterialsList: [
    {
      unid: 'UN1090',
      properShippingName: 'ACETONE',
      hazclassDiv: '3',
      packingGroup: 'II',
      subsidiaryRisk: '',
      specialProvision: '',
      packagingParagraph: 'A3.1.',
    },
  ],
}));

// Mock Data.tsx workflow modifiers
jest.mock('../Data', () => ({
  A6_15WorkflowModifiers: {
    informativeStatementsDocumentNodes: [],
    workflowModifiersDocumentNodes: [],
  },
  A6_4WorkflowModifiers: {
    informativeStatementsDocumentNodes: [],
    workflowModifiersDocumentNodes: [],
  },
  A6_5WorkflowModifiers: {
    informativeStatementsDocumentNodes: [],
    workflowModifiersDocumentNodes: [],
  },
  A6_6WorkflowModifiers: {
    informativeStatementsDocumentNodes: [],
    workflowModifiersDocumentNodes: [],
  },
  A6_9WorkflowModifiers: {
    informativeStatementsDocumentNodes: [],
    workflowModifiersDocumentNodes: [],
  },
}));

// Mock utils
jest.mock('@/utils/getHazardousMaterialPhysicalState', () => ({
  getHazardousMaterialPhysicalState: jest.fn(() => 'LIQUID'),
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

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, size, color }: { name: string; size: number; color: string }) => {
    const { Text } = require('react-native');
    return <Text testID={`icon-${name}`}>{`[Ionicons:${name}]`}</Text>;
  },
}));

// Mock @react-native-picker/picker
jest.mock('@react-native-picker/picker', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const Picker = ({ selectedValue, onValueChange, children, style, ...props }: any) => {
    return (
      <View testID="picker" style={style} {...props}>
        <Text>{`Selected: ${selectedValue || 'none'}`}</Text>
        {children}
      </View>
    );
  };

  Picker.Item = ({ label, value }: { label: string; value: string }) => {
    return <Text testID={`picker-item-${value}`}>{label}</Text>;
  };

  return { Picker };
});

// Mock react-native-elements
jest.mock('react-native-elements', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const ListItem = ({ children, containerStyle, ...props }: any) => {
    return (
      <View testID="list-item" style={containerStyle} {...props}>
        {children}
      </View>
    );
  };

  ListItem.Content = ({ children }: any) => {
    return <View testID="list-item-content">{children}</View>;
  };

  return { ListItem };
});

// Mock react-native-vector-icons/MaterialCommunityIcons
jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const { Text } = require('react-native');
  return ({ name, size, color, style }: { name: string; size: number; color: string; style?: any }) => {
    return <Text testID={`material-icon-${name}`} style={style}>{`[MaterialIcon:${name}]`}</Text>;
  };
});

// Import component after mocks are set up
import MaterialIDScreen from '../MaterialIDScreen';

describe('MaterialIDScreen', () => {
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
      <MaterialIDScreen navigation={mockNavigation} />
    );

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the Material ID title', () => {
    render(<MaterialIDScreen navigation={mockNavigation} />);

    expect(screen.getByText('Material ID')).toBeTruthy();
  });

  it('renders the search input placeholder', () => {
    render(<MaterialIDScreen navigation={mockNavigation} />);

    expect(screen.getByPlaceholderText('Search UN, NA, or ID No.')).toBeTruthy();
  });

  it('renders Cancel and Save & Continue buttons', () => {
    render(<MaterialIDScreen navigation={mockNavigation} />);

    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('Save & Continue')).toBeTruthy();
  });

  it('renders the scan icon button', () => {
    render(<MaterialIDScreen navigation={mockNavigation} />);

    expect(screen.getByTestId('icon-scan-outline')).toBeTruthy();
  });
});
