/**
 * @file AcknowledgementScreen.test.tsx
 * @description Snapshot and unit tests for the AcknowledgementScreen component.
 *
 * This test captures the rendered output of the component to detect
 * unintended visual changes during refactoring.
 */
import React from 'react';
import { render } from '@testing-library/react-native';

// Mock @expo/vector-icons before importing the component
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: ({ name, ...props }: { name: string }) => {
    const { Text } = require('react-native');
    return <Text {...props}>{`MaterialIcon-${name}`}</Text>;
  },
}));

// Mock the acknowledgement constants with test data
jest.mock('@/constants/acknowledgementContent', () => ({
  ACKNOWLEDGEMENT_SECTIONS: [
    {
      id: 'purpose',
      title: 'Purpose',
      icon: 'info',
      content: 'Test content',
      items: ['Item 1'],
    },
  ],
  CURRENT_APP_VERSION: '1.0.0-test',
}));

// Mock the logo image require
jest.mock('../../../assets/hazpro-01.png', () => 'mocked-logo-image');

// Import component after mocks are set up
import AcknowledgementScreen from '../AcknowledgementScreen';

describe('AcknowledgementScreen', () => {
  // Mock props
  const mockOnAcknowledge = jest.fn();
  const defaultProps = {
    userName: 'Test User',
    userRole: 'preparer' as const,
    onAcknowledge: mockOnAcknowledge,
  };

  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it('renders correctly for preparer role', () => {
    const { toJSON } = render(<AcknowledgementScreen {...defaultProps} />);

    // Capture the snapshot
    expect(toJSON()).toMatchSnapshot();
  });

  it('renders "Important Information" header', () => {
    const { getByText } = render(<AcknowledgementScreen {...defaultProps} />);

    expect(getByText('Important Information')).toBeTruthy();
  });

  it('renders "ACCEPT & CONTINUE" button', () => {
    const { getByText } = render(<AcknowledgementScreen {...defaultProps} />);

    expect(getByText('ACCEPT & CONTINUE')).toBeTruthy();
  });

  it('renders correctly for inspector role', () => {
    const inspectorProps = {
      ...defaultProps,
      userRole: 'inspector' as const,
    };

    const { toJSON } = render(<AcknowledgementScreen {...inspectorProps} />);

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders the version number from constants', () => {
    const { getByText } = render(<AcknowledgementScreen {...defaultProps} />);

    expect(getByText('Version 1.0.0-test')).toBeTruthy();
  });

  it('renders the checkbox acknowledgement text', () => {
    const { getByText } = render(<AcknowledgementScreen {...defaultProps} />);

    expect(
      getByText(/I have read and understand the above information/)
    ).toBeTruthy();
  });
});
