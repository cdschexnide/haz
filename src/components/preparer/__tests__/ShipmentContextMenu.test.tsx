// src/components/preparer/__tests__/ShipmentContextMenu.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ShipmentContextMenu } from '../ShipmentContextMenu';

// Mock BottomSheet from @rneui/themed
jest.mock('@rneui/themed', () => ({
  BottomSheet: ({ isVisible, children }: { isVisible: boolean; children: React.ReactNode }) =>
    isVisible ? children : null,
}));

describe('ShipmentContextMenu', () => {
  const mockShipment = {
    id: '123',
    status: 'in-progress' as const,
    savedAt: new Date(),
    hazProPreparerContext: {} as any,
  };

  const defaultProps = {
    visible: true,
    shipment: mockShipment,
    onClose: jest.fn(),
    onResume: jest.fn(),
    onViewSDDG: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible', () => {
    const { getByText } = render(<ShipmentContextMenu {...defaultProps} />);
    expect(getByText('Resume Preparation')).toBeTruthy();
  });

  it('shows Resume option for in-progress shipment', () => {
    const { getByText } = render(<ShipmentContextMenu {...defaultProps} />);
    expect(getByText('Resume Preparation')).toBeTruthy();
  });

  it('shows View SDDG option for completed shipment', () => {
    const completedShipment = { ...mockShipment, status: 'completed' as const };
    const { getByText } = render(
      <ShipmentContextMenu {...defaultProps} shipment={completedShipment} />
    );
    expect(getByText('View SDDG')).toBeTruthy();
  });

  it('calls onResume when Resume pressed', () => {
    const { getByText } = render(<ShipmentContextMenu {...defaultProps} />);
    fireEvent.press(getByText('Resume Preparation'));
    expect(defaultProps.onResume).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel pressed', () => {
    const { getByText } = render(<ShipmentContextMenu {...defaultProps} />);
    fireEvent.press(getByText('Cancel'));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
