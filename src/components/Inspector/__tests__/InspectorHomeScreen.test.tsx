/**
 * @file InspectorHomeScreen.test.tsx
 * @description Snapshot test for the InspectorHomeScreen component.
 *
 * This test captures the rendered output of the InspectorHomeScreen component
 * to detect unintended visual changes during refactoring.
 *
 * The component uses Context API for state management and has many dependencies
 * including navigation, database hooks, and child components.
 */

// Mock contexts BEFORE importing the component
jest.mock('../../../contexts/HazProPreparerProvider/HazProPreparerContext', () => {
  const React = require('react');
  return {
    HazProPreparerContext: React.createContext({
      state: { hazProPreparerContext: {} },
      dispatch: jest.fn(),
    }),
  };
});

jest.mock('../../../contexts/HazProInspectorProvider/HazProInspectorContext', () => {
  const React = require('react');
  return {
    HazProInspectorContext: React.createContext({
      state: {},
      dispatch: jest.fn(),
    }),
  };
});

const mockNavigate = jest.fn();
const mockReset = jest.fn();

jest.mock('../../../contexts/NavigationRefProvider/useNavigationRef', () => ({
  useNavigationRef: () => ({ navigate: mockNavigate, reset: mockReset }),
}));

jest.mock('../../../contexts/DataProvider', () => ({
  useDatabase: () => ({
    isInitialized: true,
    listInspections: jest.fn().mockResolvedValue([]),
    loadInspection: jest.fn().mockResolvedValue(null),
    deleteInspection: jest.fn().mockResolvedValue(undefined),
    getInspectionStats: jest.fn().mockResolvedValue({ total: 0 }),
  }),
}));

jest.mock('../../../contexts/InspectionFormProvider', () => ({
  useInspectionForm: () => ({
    loadInspectionForEdit: jest.fn().mockResolvedValue(undefined),
    startNewInspection: jest.fn(),
  }),
  useInspectionFormActions: () => ({
    loadInspectionForEdit: jest.fn().mockResolvedValue(undefined),
    startNewInspection: jest.fn(),
  }),
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock @rneui/themed
jest.mock('@rneui/themed', () => {
  const React = require('react');
  return {
    BottomSheet: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock react-native-elements
jest.mock('react-native-elements', () => ({
  Button: 'Button',
  ListItem: 'ListItem',
}));

// Mock react-native-gesture-handler with proper GestureHandlerRootView
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    GestureHandlerRootView: ({ children, style }: { children: React.ReactNode; style?: any }) =>
      React.createElement(View, { style, testID: 'gesture-handler-root' }, children),
    Swipeable: 'Swipeable',
    TapGestureHandler: ({ children }: { children: React.ReactNode }) => children,
    State: {
      UNDETERMINED: 0,
      FAILED: 1,
      BEGAN: 2,
      CANCELLED: 3,
      ACTIVE: 4,
      END: 5,
    },
  };
});

// Mock child components as simple View elements
jest.mock('../../TopNavBar', () => 'TopNavBar');
jest.mock('../../GasCalculatorTool', () => 'GasCalculatorTool');
jest.mock('../../DryIceCalculator', () => 'DryIceCalculator');
jest.mock('../../UnitConversionTool', () => 'UnitConversionTool');
jest.mock('../../PlacardingTool', () => 'PlacardingTool');
jest.mock('../../CompatibilitySegregationModal', () => 'CompatibilitySegregationModal');
jest.mock('../../../screens/inspector/InspectorAMC1015Form', () => ({
  InspectorAMC1015Form: 'InspectorAMC1015Form',
}));
jest.mock('../../../screens/inspector/MLDetectionScreen', () => ({
  MLDetectionScreen: 'MLDetectionScreen',
}));

// Mock theming
jest.mock('../../../theming/colors', () => ({
  default: {
    blue: '#007AFF',
    black: '#000000',
    white: '#FFFFFF',
  },
}));

// Import React and testing utilities after all mocks are set up
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import InspectorHomeScreen from '../../../screens/inspector/InspectorHomeScreen';

// Helper function to safely serialize JSON while handling circular references
function safeStringify(obj: any, space?: number): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    // Skip internal React/RN properties that might have circular refs
    if (key.startsWith('_') || key === 'stateNode' || key === 'return' || key === 'child' || key === 'sibling') {
      return undefined;
    }
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  }, space);
}

describe('InspectorHomeScreen', () => {
  // Create mock navigation
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatch: jest.fn(),
    openDrawer: jest.fn(),
  };

  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('renders correctly with empty inspections', async () => {
    const { toJSON } = render(
      <InspectorHomeScreen navigation={mockNavigation} />
    );

    // Wait for async effects to complete
    await waitFor(() => {
      expect(screen.getByText('Inspections')).toBeTruthy();
    });

    // Get the rendered tree and serialize it safely
    const tree = toJSON();
    const safeTree = JSON.parse(safeStringify(tree));

    // Capture the snapshot with the safe version
    expect(safeTree).toMatchSnapshot();
  });

  it('renders the Start New Inspection button', async () => {
    render(<InspectorHomeScreen navigation={mockNavigation} />);

    // Wait for async effects to complete and verify the button exists
    await waitFor(() => {
      expect(screen.getByText('Start New Inspection')).toBeTruthy();
    });
  });

  it('renders the Inspections section title', async () => {
    render(<InspectorHomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText('Inspections')).toBeTruthy();
    });
  });

  it('renders tool buttons', async () => {
    render(<InspectorHomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText('Gas Calculator')).toBeTruthy();
      expect(screen.getByText('Dry Ice Calculator')).toBeTruthy();
      expect(screen.getByText('Unit Converter')).toBeTruthy();
      expect(screen.getByText('Placarding Tool')).toBeTruthy();
      expect(screen.getByText('Compatibility/Segregation Tool')).toBeTruthy();
      // Note: ML Label Test button is currently commented out in the component
    });
  });

  it('renders table headers', async () => {
    render(<InspectorHomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByText('TCN')).toBeTruthy();
      expect(screen.getByText('UN, NA, ID No.')).toBeTruthy();
      expect(screen.getByText('Proper Shipping Name')).toBeTruthy();
      expect(screen.getByText('SDDG')).toBeTruthy();
      // Use getAllByText for 'Package' since it may appear multiple times (header + bottom sheet option)
      expect(screen.getAllByText('Package').length).toBeGreaterThan(0);
      expect(screen.getByText('Inspector')).toBeTruthy();
      expect(screen.getByText('View')).toBeTruthy();
    });
  });

  it('renders search input', async () => {
    render(<InspectorHomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search')).toBeTruthy();
    });
  });

  it('resets navigation when starting a new inspection', async () => {
    render(<InspectorHomeScreen navigation={mockNavigation} />);

    const startButton = await screen.findByText('Start New Inspection');
    fireEvent.press(startButton);

    expect(mockReset).toHaveBeenCalled();
  });
});
