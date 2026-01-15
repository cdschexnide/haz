// src/screens/preparer/__tests__/LabelingAndMarkingScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { LabelingAndMarkingScreen } from '../LabelingAndMarkingScreen';

// Mock native modules
jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
  default: 'WebView',
}));

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

// Mock navigation ref
const mockNavigate = jest.fn();
jest.mock('@/contexts/NavigationRefProvider/useNavigationRef', () => ({
  useNavigationRef: () => ({ navigate: mockNavigate }),
}));

// Mock document nodes and render function
jest.mock('../../../../server/documentNodes', () => ({
  getDocumentNodes: jest.fn().mockReturnValue([]),
}));

jest.mock('../../../../server/renderDocumentNodes/renderDocumentNodes', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue('<p>Packaging content</p>'),
}));

// Store mock values - can be updated in tests
const mockSaveCurrentShipment = jest.fn();
const mockUpdateRequiredMarkingsAndLabels = jest.fn();

const mockRequiredLabels = [
  { id: 'label1', label: 'Hazard Class Label', value: 'Class 3' },
  { id: 'label2', label: 'Subsidiary Risk Label', value: 'Class 8' },
];

const mockRequiredMarkings = [
  { id: 'marking1', label: 'UN Number', value: 'UN1234' },
  { id: 'marking2', label: 'Proper Shipping Name', value: 'Flammable Liquid' },
];

// Mutable mock state that can be changed per test
let mockStateOverrides: any = {};

jest.mock('@/stores/useHazProStore', () => ({
  useHazProStore: () => {
    const baseState = {
      hazProPreparerContext: {
        activeStep: 3,
        completedSubsteps: ['MaterialID', 'Packaging'],
        hazardousMaterial: {
          unid: 'UN1234',
          packagingParagraph: 'A5.3.1',
        },
        packaging: {},
        isExceptedQuantity: false,
        isLimitedQuantity: false,
        lithiumBatteryData: null,
        dryIceData: null,
        technicalName: null,
        isLithiumBatteryExceptedQuantity: false,
        usesCaaCertification: false,
        usesCoeCertification: false,
        lookupFunctionsOutput: null,
        ...mockStateOverrides,
      },
    };
    return {
      state: baseState,
      store: {
        hazProPreparerContext: baseState.hazProPreparerContext,
      },
      actions: {
        updateRequiredMarkingsAndLabels: mockUpdateRequiredMarkingsAndLabels,
      },
      requiredLabels: mockRequiredLabels,
      requiredMarkings: mockRequiredMarkings,
      saveCurrentShipment: mockSaveCurrentShipment,
    };
  },
}));

// Mock VehicleLabelingNotice and StandardLabelingContent
jest.mock('@/components/preparer', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity } = require('react-native');
  return {
    VehicleLabelingNotice: () =>
      React.createElement(View, { testID: 'vehicle-notice' },
        React.createElement(Text, null, 'Vehicle Labeling Notice')
      ),
    StandardLabelingContent: ({ requiredLabels, requiredMarkings, limitedQuantity, onInfoPress }: any) =>
      React.createElement(View, { testID: 'standard-content' },
        React.createElement(Text, null, `Labels: ${requiredLabels.length}`),
        React.createElement(Text, null, `Markings: ${requiredMarkings.length}`),
        limitedQuantity && React.createElement(Text, { testID: 'limited-qty-notice' }, 'Limited Quantity'),
        React.createElement(TouchableOpacity, { testID: 'info-trigger', onPress: () => onInfoPress('test') },
          React.createElement(Text, null, 'Info')
        )
      ),
  };
});

// Mock UI components
jest.mock('@/components/ui', () => {
  const React = require('react');
  const { View, Text, TouchableOpacity, Modal } = require('react-native');
  return {
    ActionFooter: ({ buttons }: { buttons: Array<{ label: string; onPress: () => void }> }) =>
      React.createElement(View, { testID: 'action-footer' },
        buttons.map((btn: any, i: number) =>
          React.createElement(TouchableOpacity, {
            key: i,
            testID: `footer-btn-${btn.label.toLowerCase().replace(/\s/g, '-')}`,
            onPress: btn.onPress,
          }, React.createElement(Text, null, btn.label))
        )
      ),
    DocumentModal: ({ visible, onClose, title }: any) =>
      visible ? React.createElement(Modal, { testID: 'document-modal' },
        React.createElement(View, null,
          React.createElement(Text, null, title),
          React.createElement(TouchableOpacity, { testID: 'close-modal', onPress: onClose },
            React.createElement(Text, null, 'Close')
          )
        )
      ) : null,
    colors: {
      background: '#F8F9FA',
      surface: '#FFFFFF',
      primary: '#007AFF',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
    },
  };
});

describe('LabelingAndMarkingScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStateOverrides = {};
  });

  describe('Standard Shipment', () => {
    it('renders standard labeling content for non-vehicle shipments', async () => {
      const { getByTestId, getByText } = render(
        <LabelingAndMarkingScreen navigation={mockNavigation as any} />
      );

      await waitFor(() => {
        expect(getByTestId('standard-content')).toBeTruthy();
        expect(getByText('Labels: 2')).toBeTruthy();
        expect(getByText('Markings: 2')).toBeTruthy();
      });
    });

    it('renders action footer with all buttons', async () => {
      const { getByTestId } = render(
        <LabelingAndMarkingScreen navigation={mockNavigation as any} />
      );

      await waitFor(() => {
        expect(getByTestId('action-footer')).toBeTruthy();
        expect(getByTestId('footer-btn-cancel')).toBeTruthy();
        expect(getByTestId('footer-btn-save-&-exit')).toBeTruthy();
        expect(getByTestId('footer-btn-save-&-continue')).toBeTruthy();
      });
    });

    it('calls navigation.goBack when Cancel is pressed', async () => {
      const { getByTestId } = render(
        <LabelingAndMarkingScreen navigation={mockNavigation as any} />
      );

      await waitFor(() => {
        fireEvent.press(getByTestId('footer-btn-cancel'));
      });

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('saves shipment and navigates home when Save & Exit is pressed', async () => {
      const { getByTestId } = render(
        <LabelingAndMarkingScreen navigation={mockNavigation as any} />
      );

      await waitFor(() => {
        fireEvent.press(getByTestId('footer-btn-save-&-exit'));
      });

      expect(mockSaveCurrentShipment).toHaveBeenCalledWith('in-progress');
      expect(mockNavigate).toHaveBeenCalledWith('PreparerHomeStack', { screen: 'PreparerHome' });
    });

    it('navigates to ShippersDeclarationScreen when Save & Continue is pressed', async () => {
      const { getByTestId } = render(
        <LabelingAndMarkingScreen navigation={mockNavigation as any} />
      );

      await waitFor(() => {
        fireEvent.press(getByTestId('footer-btn-save-&-continue'));
      });

      expect(mockNavigation.navigate).toHaveBeenCalledWith('ShippersDeclarationScreen');
    });
  });

  describe('Vehicle Shipment (UN3166)', () => {
    beforeEach(() => {
      mockStateOverrides = {
        hazardousMaterial: { unid: 'UN3166' },
      };
    });

    it('renders vehicle labeling notice for UN3166', async () => {
      const { getByTestId, queryByTestId } = render(
        <LabelingAndMarkingScreen navigation={mockNavigation as any} />
      );

      await waitFor(() => {
        expect(getByTestId('vehicle-notice')).toBeTruthy();
        expect(queryByTestId('standard-content')).toBeNull();
      });
    });
  });

  describe('Excepted Quantity', () => {
    beforeEach(() => {
      mockStateOverrides = {
        isExceptedQuantity: true,
      };
    });

    it('navigates to ExceptedQuantityConfirmationScreen for excepted quantities', async () => {
      render(
        <LabelingAndMarkingScreen navigation={mockNavigation as any} />
      );

      await waitFor(() => {
        expect(mockNavigation.navigate).toHaveBeenCalledWith('ExceptedQuantityConfirmationScreen');
      });
    });
  });

  describe('Limited Quantity', () => {
    beforeEach(() => {
      mockStateOverrides = {
        isLimitedQuantity: true,
      };
    });

    it('shows limited quantity notice when applicable', async () => {
      const { getByTestId } = render(
        <LabelingAndMarkingScreen navigation={mockNavigation as any} />
      );

      await waitFor(() => {
        expect(getByTestId('limited-qty-notice')).toBeTruthy();
      });
    });
  });
});
