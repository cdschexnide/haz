// src/components/ui/__tests__/ConfirmationCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmationCard } from '../ConfirmationCard';

describe('ConfirmationCard', () => {
  const defaultProps = {
    title: 'Test Title',
    content: 'Test content message',
    onAccept: jest.fn(),
    onDecline: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title correctly', () => {
    const { getByText } = render(<ConfirmationCard {...defaultProps} />);
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('renders content correctly', () => {
    const { getByText } = render(<ConfirmationCard {...defaultProps} />);
    expect(getByText('Test content message')).toBeTruthy();
  });

  it('renders default button labels', () => {
    const { getByText } = render(<ConfirmationCard {...defaultProps} />);
    expect(getByText('Accept')).toBeTruthy();
    expect(getByText('Decline')).toBeTruthy();
  });

  it('renders custom button labels', () => {
    const { getByText } = render(
      <ConfirmationCard
        {...defaultProps}
        acceptLabel="Confirm"
        declineLabel="Cancel"
      />
    );
    expect(getByText('Confirm')).toBeTruthy();
    expect(getByText('Cancel')).toBeTruthy();
  });

  it('calls onAccept when accept button pressed', () => {
    const { getByText } = render(<ConfirmationCard {...defaultProps} />);
    fireEvent.press(getByText('Accept'));
    expect(defaultProps.onAccept).toHaveBeenCalledTimes(1);
  });

  it('calls onDecline when decline button pressed', () => {
    const { getByText } = render(<ConfirmationCard {...defaultProps} />);
    fireEvent.press(getByText('Decline'));
    expect(defaultProps.onDecline).toHaveBeenCalledTimes(1);
  });
});
