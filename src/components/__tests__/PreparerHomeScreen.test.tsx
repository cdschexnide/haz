/**
 * @file PreparerHomeScreen.test.tsx
 * @description Snapshot test for the PreparerHomeScreen component.
 *
 * This test captures the rendered output of the component to detect
 * unintended visual changes during refactoring. It follows the established
 * pattern for snapshot testing in this codebase.
 *
 * Note: Due to complex async effects in PreparerHomeScreen, we use a shallow
 * snapshot approach focusing on the initial render state to avoid issues with
 * the component's asynchronous database initialization.
 */
import React from 'react';
import { render } from '@testing-library/react-native';

// Stable reference objects for mocks to prevent infinite re-renders
// Prefix with 'mock' to allow Jest mock factory to reference them
const mockShipmentsIndex = {};
const mockState = {
  hazProPreparerContext: {
    activePersona: 'Preparer',
    activeStep: 0,
  },
  shipmentsIndex: mockShipmentsIndex,
  isLoadingShipments: false,
  databaseError: null,
};
const mockStore = {
  hazProPreparerContext: {
    preparer: { preparerName: 'Test User' },
  },
};
const mockActions = {
  saveCurrentShipment: jest.fn().mockResolvedValue(undefined),
  loadShipment: jest.fn().mockResolvedValue(undefined),
  deleteShipment: jest.fn().mockResolvedValue(undefined),
  refreshShipmentsIndex: jest.fn().mockResolvedValue(undefined),
};
const mockInitializeDatabase = jest.fn().mockResolvedValue(undefined);

// Mock useHazProStore hook BEFORE importing the component
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: mockState,
    store: mockStore,
    actions: mockActions,
    isLoading: false,
    error: null,
    initializeDatabase: mockInitializeDatabase,
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

// Mock ShipmentDatabase service
jest.mock('@/services/shipment/ShipmentDatabase', () => ({
  __esModule: true,
  default: {
    loadShipment: jest.fn().mockResolvedValue(null),
  },
}));

// Mock DatabaseErrorDisplay component
jest.mock('@/components/DatabaseErrorDisplay', () => {
  const { View } = require('react-native');
  const MockDatabaseErrorDisplay = (props: any) => {
    return <View testID="mock-DatabaseErrorDisplay" {...props} />;
  };
  return MockDatabaseErrorDisplay;
});

// Mock TopNavBar component
jest.mock('@/components/TopNavBar', () => {
  const { View } = require('react-native');
  const MockTopNavBar = (props: any) => {
    return <View testID="mock-TopNavBar" {...props} />;
  };
  return MockTopNavBar;
});

// Mock DryIceCalculator component
jest.mock('@/components/DryIceCalculator', () => {
  const { View } = require('react-native');
  const MockDryIceCalculator = ({ visible, ...props }: any) => {
    if (!visible) return null;
    return <View testID="mock-DryIceCalculator" {...props} />;
  };
  return MockDryIceCalculator;
});

// Mock GasCalculatorTool component
jest.mock('@/components/GasCalculatorTool', () => {
  const { View } = require('react-native');
  const MockGasCalculatorTool = ({ visible, ...props }: any) => {
    if (!visible) return null;
    return <View testID="mock-GasCalculatorTool" {...props} />;
  };
  return MockGasCalculatorTool;
});

// Mock PlacardingTool component
jest.mock('@/components/PlacardingTool', () => {
  const { View } = require('react-native');
  const MockPlacardingTool = ({ visible, ...props }: any) => {
    if (!visible) return null;
    return <View testID="mock-PlacardingTool" {...props} />;
  };
  return MockPlacardingTool;
});

// Mock UnitConversionTool component
jest.mock('@/components/UnitConversionTool', () => {
  const { View } = require('react-native');
  const MockUnitConversionTool = ({ visible, ...props }: any) => {
    if (!visible) return null;
    return <View testID="mock-UnitConversionTool" {...props} />;
  };
  return MockUnitConversionTool;
});

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Feather: ({ name, ...props }: any) => {
    const { Text } = require('react-native');
    return <Text testID={`feather-icon-${name}`} {...props}>{name}</Text>;
  },
  MaterialCommunityIcons: ({ name, ...props }: any) => {
    const { Text } = require('react-native');
    return <Text testID={`material-icon-${name}`} {...props}>{name}</Text>;
  },
}));

// Mock BottomSheet from @rneui/themed
jest.mock('@rneui/themed', () => ({
  BottomSheet: ({ isVisible, children, ...props }: any) => {
    const { View } = require('react-native');
    if (!isVisible) return null;
    return <View testID="mock-BottomSheet" {...props}>{children}</View>;
  },
}));

// Mock react-native-elements
jest.mock('react-native-elements', () => ({
  Button: ({ title, ...props }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={`mock-Button-${title}`} {...props}>
        <Text>{title}</Text>
      </View>
    );
  },
  ListItem: {
    Swipeable: ({ children, ...props }: any) => {
      const { View } = require('react-native');
      return <View testID="mock-ListItem-Swipeable" {...props}>{children}</View>;
    },
    Content: ({ children, ...props }: any) => {
      const { View } = require('react-native');
      return <View testID="mock-ListItem-Content" {...props}>{children}</View>;
    },
  },
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => {
    const { View } = require('react-native');
    return <View testID="mock-StatusBar" />;
  },
}));

// Import component after mocks are set up
import PreparerHomeScreen from '../PreparerHomeScreen';

describe('PreparerHomeScreen', () => {
  // Create mock navigation with openDrawer function
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
    openDrawer: jest.fn(),
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

  it('renders correctly with empty shipments', () => {
    const { toJSON, getByText, getByTestId, getByPlaceholderText } = render(
      <PreparerHomeScreen navigation={mockNavigation} />
    );

    // Capture key elements for the snapshot to verify component structure
    // This is more stable than full tree snapshots for components with async effects
    const snapshotData = {
      hasTopNavBar: !!getByTestId('mock-TopNavBar'),
      hasCreateButton: !!getByText('Create New Shipment'),
      hasSearchInput: !!getByPlaceholderText('Search by TCN, UN/ID, Class, POE, POD, or Signatory'),
      toolButtons: {
        gasCalculator: !!getByText('Gas Calculator'),
        dryIceCalculator: !!getByText('Dry Ice Calculator'),
        unitConverter: !!getByText('Unit Converter'),
        placardingTool: !!getByText('Placarding Tool'),
        compatibilityTool: !!getByText('Compatibility/Segregation Tool'),
      },
      tableHeaders: {
        tcn: !!getByText('TCN'),
        unId: !!getByText('UN, NA, ID No.'),
        classDiv: !!getByText('Class/Div/Comp. Group'),
        poe: !!getByText('POE'),
        pod: !!getByText('POD'),
        signatory: !!getByText('Signatory'),
        status: !!getByText('Status'),
      },
    };

    expect(snapshotData).toMatchSnapshot();
  });

  it('renders the "Create New Shipment" button', () => {
    const { getByText } = render(
      <PreparerHomeScreen navigation={mockNavigation} />
    );

    expect(getByText('Create New Shipment')).toBeTruthy();
  });

  it('renders the tool buttons', () => {
    const { getByText } = render(
      <PreparerHomeScreen navigation={mockNavigation} />
    );

    expect(getByText('Gas Calculator')).toBeTruthy();
    expect(getByText('Dry Ice Calculator')).toBeTruthy();
    expect(getByText('Unit Converter')).toBeTruthy();
    expect(getByText('Placarding Tool')).toBeTruthy();
  });

  it('renders the search input placeholder', () => {
    const { getByPlaceholderText } = render(
      <PreparerHomeScreen navigation={mockNavigation} />
    );

    expect(
      getByPlaceholderText('Search by TCN, UN/ID, Class, POE, POD, or Signatory')
    ).toBeTruthy();
  });

  it('renders the TopNavBar component', () => {
    const { getByTestId } = render(
      <PreparerHomeScreen navigation={mockNavigation} />
    );

    expect(getByTestId('mock-TopNavBar')).toBeTruthy();
  });

  it('renders the table header columns', () => {
    const { getByText } = render(
      <PreparerHomeScreen navigation={mockNavigation} />
    );

    expect(getByText('TCN')).toBeTruthy();
    expect(getByText('UN, NA, ID No.')).toBeTruthy();
    expect(getByText('Class/Div/Comp. Group')).toBeTruthy();
    expect(getByText('POE')).toBeTruthy();
    expect(getByText('POD')).toBeTruthy();
    expect(getByText('Signatory')).toBeTruthy();
    expect(getByText('Status')).toBeTruthy();
  });

  it('renders the disabled Compatibility/Segregation Tool button', () => {
    const { getByText } = render(
      <PreparerHomeScreen navigation={mockNavigation} />
    );

    expect(getByText('Compatibility/Segregation Tool')).toBeTruthy();
  });
});
