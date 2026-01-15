// src/components/preparer/__tests__/ShipmentTable.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ShipmentTable } from '../ShipmentTable';

const mockShipments = [
  {
    id: '1',
    status: 'in-progress' as const,
    savedAt: new Date(),
    hazProPreparerContext: {
      shipment: { tcn: 'TCN123456789012345', poe: 'Test POE', pod: 'Test POD' },
      hazardousMaterial: { unid: 'UN1234', hazclassDiv: '1.1' },
      preparer: { preparerName: 'John Doe' },
    },
  },
  {
    id: '2',
    status: 'completed' as const,
    savedAt: new Date(),
    hazProPreparerContext: {
      shipment: { tcn: 'TCN987654321098765', poe: 'Another POE', pod: 'Another POD' },
      hazardousMaterial: { unid: 'UN5678', hazclassDiv: '2.1' },
      preparer: { preparerName: 'Jane Smith' },
    },
  },
];

describe('ShipmentTable', () => {
  const defaultProps = {
    shipments: mockShipments,
    onShipmentLongPress: jest.fn(),
    onDelete: jest.fn(),
    onCopy: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table headers', () => {
    const { getByText } = render(<ShipmentTable {...defaultProps} />);
    expect(getByText('TCN')).toBeTruthy();
    expect(getByText('UN, NA, ID No.')).toBeTruthy();
    expect(getByText('Status')).toBeTruthy();
  });

  it('renders shipment data', () => {
    const { getByText } = render(<ShipmentTable {...defaultProps} />);
    expect(getByText('TCN123456789012345')).toBeTruthy();
    expect(getByText('UN1234')).toBeTruthy();
  });

  it('shows loading state when isLoading is true', () => {
    const { getByText } = render(
      <ShipmentTable {...defaultProps} shipments={[]} isLoading={true} />
    );
    expect(getByText('Loading shipments...')).toBeTruthy();
  });

  it('shows empty state when no shipments', () => {
    const { getByText } = render(
      <ShipmentTable {...defaultProps} shipments={[]} isLoading={false} />
    );
    expect(getByText('No shipments found')).toBeTruthy();
  });

  it('displays correct status badge for completed shipment', () => {
    const { getByText } = render(<ShipmentTable {...defaultProps} />);
    expect(getByText(/Completed/)).toBeTruthy();
  });

  it('displays correct status badge for in-progress shipment', () => {
    const { getByText } = render(<ShipmentTable {...defaultProps} />);
    expect(getByText(/In Progress/)).toBeTruthy();
  });
});
