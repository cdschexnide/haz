// src/screens/preparer/__tests__/PreparerHomeScreen.test.tsx
import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { PreparerHomeScreen } from '../PreparerHomeScreen';

// Mock native modules that cause issues in test environment
jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
  default: 'WebView',
}));

jest.mock('react-native-signature-canvas', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock ShipmentDatabase
jest.mock('@/services/shipment/ShipmentDatabase', () => ({
  __esModule: true,
  default: {
    loadShipment: jest.fn().mockResolvedValue(null),
  },
}));

// Mock the store with stable state reference
const mockState = {
  hazProPreparerContext: { preparer: { preparerName: 'Test User' } },
  shipmentsIndex: {},
};

jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: mockState,
    store: { hazProPreparerContext: {} },
    actions: {
      refreshShipmentsIndex: jest.fn().mockResolvedValue(undefined),
      deleteShipment: jest.fn().mockResolvedValue(undefined),
      loadShipment: jest.fn().mockResolvedValue(undefined),
    },
    isLoading: false,
    error: null,
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('@/contexts/NavigationRefProvider/useNavigationRef', () => ({
  useNavigationRef: () => ({ navigate: jest.fn() }),
}));

// Mock TopNavBar (has deep dependency chain with native modules)
jest.mock('@/components/TopNavBar', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: () => React.createElement(View, null, React.createElement(Text, null, 'TopNavBar')),
  };
});

// Mock DatabaseErrorDisplay
jest.mock('@/components/DatabaseErrorDisplay', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => null,
  };
});

// Mock the modal components
jest.mock('@/components/GasCalculatorTool', () => () => null);
jest.mock('@/components/DryIceCalculator', () => () => null);
jest.mock('@/components/UnitConversionTool', () => () => null);
jest.mock('@/components/PlacardingTool', () => () => null);

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  Feather: 'Feather',
}));

// Mock preparer components
jest.mock('@/components/preparer', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    ToolButtonsBar: ({ tools }: { tools: Array<{ label: string }> }) =>
      React.createElement(
        View,
        null,
        tools.map((tool: { label: string }, i: number) =>
          React.createElement(Text, { key: i }, tool.label)
        )
      ),
    ShipmentTable: () => React.createElement(View, null),
    ShipmentContextMenu: () => null,
  };
});

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

describe('PreparerHomeScreen', () => {
  const mockNavigation = { navigate: jest.fn(), openDrawer: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Shipments title', async () => {
    const { getByText } = render(
      <PreparerHomeScreen navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByText(/Shipments/)).toBeTruthy();
    });
  });

  it('renders Create New Shipment button', async () => {
    const { getByText } = render(
      <PreparerHomeScreen navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByText('Create New Shipment')).toBeTruthy();
    });
  });

  it('renders search input', async () => {
    const { getByPlaceholderText } = render(
      <PreparerHomeScreen navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByPlaceholderText(/Search by TCN/)).toBeTruthy();
    });
  });

  it('renders tool buttons', async () => {
    const { getByText } = render(
      <PreparerHomeScreen navigation={mockNavigation as any} />
    );
    await waitFor(() => {
      expect(getByText('Gas Calculator')).toBeTruthy();
      expect(getByText('Dry Ice Calculator')).toBeTruthy();
      expect(getByText('Unit Converter')).toBeTruthy();
      expect(getByText('Placarding Tool')).toBeTruthy();
    });
  });
});
