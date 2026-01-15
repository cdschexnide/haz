// src/screens/preparer/__tests__/ShipmentCreationScreen.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { ShipmentCreationScreen } from '../ShipmentCreationScreen';

// Mock the store
jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => ({
    state: {
      hazProPreparerContext: {
        shipment: { tcn: '', poeOption: '', podOption: '', isChapter3: '' },
        shipper: { address: {}, worldwideMobility: false },
        consignee: { address: {}, worldwideMobility: false },
        preparer: { preparerName: '', preparerTitle: '', certificationPlace: '' },
      },
    },
    store: {
      hazProPreparerContext: {
        shipment: {},
        shipper: { address: {} },
        consignee: { address: {} },
        preparer: {},
      },
    },
  }),
}));

// Mock navigation
jest.mock('@/contexts/NavigationRefProvider/useNavigationRef', () => ({
  useNavigationRef: () => ({ navigate: jest.fn() }),
}));

// Mock PreparerFormProvider
jest.mock('@/contexts/PreparerFormProvider', () => ({
  usePreparerForm: () => ({
    preparerContext: {
      shipper: { phoneNumber: {}, address: {} },
      consignee: { phoneNumber: {}, address: {} },
    },
    updateShipper: jest.fn(),
    updateConsignee: jest.fn(),
  }),
}));

// Mock DateTimePicker
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => null,
  };
});

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('ShipmentCreationScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    addListener: jest.fn(() => jest.fn()),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders screen title', () => {
    const { getByText } = render(
      <ShipmentCreationScreen navigation={mockNavigation as any} />
    );
    expect(getByText('Create New Shipment')).toBeTruthy();
  });

  it('renders TCN field', () => {
    const { getByText } = render(
      <ShipmentCreationScreen navigation={mockNavigation as any} />
    );
    expect(getByText('TCN')).toBeTruthy();
  });

  it('renders POE and POD options', () => {
    const { getByText } = render(
      <ShipmentCreationScreen navigation={mockNavigation as any} />
    );
    expect(getByText(/Port of Embarkation/)).toBeTruthy();
    expect(getByText(/Port of Debarkation/)).toBeTruthy();
  });

  it('renders Chapter 3 option', () => {
    const { getByText } = render(
      <ShipmentCreationScreen navigation={mockNavigation as any} />
    );
    expect(getByText(/Chapter 3/)).toBeTruthy();
  });

  it('renders Preparer Information section', () => {
    const { getByText } = render(
      <ShipmentCreationScreen navigation={mockNavigation as any} />
    );
    expect(getByText('Preparer Information')).toBeTruthy();
  });

  it('renders Cancel and Save buttons', () => {
    const { getByText } = render(
      <ShipmentCreationScreen navigation={mockNavigation as any} />
    );
    expect(getByText('Cancel')).toBeTruthy();
    expect(getByText('Save & Continue')).toBeTruthy();
  });
});
