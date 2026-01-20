// src/components/preparer/__tests__/PackagingCodeCard.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PackagingCodeCard } from '../PackagingCodeCard';

describe('PackagingCodeCard', () => {
  const defaultProps = {
    code: '4G',
    description: 'Fiberboard box',
  };

  it('renders code and description', () => {
    const { getByText } = render(<PackagingCodeCard {...defaultProps} />);
    expect(getByText('4G')).toBeTruthy();
    expect(getByText('Fiberboard box')).toBeTruthy();
  });

  it('renders restrictions when provided', () => {
    const { getByText } = render(
      <PackagingCodeCard
        {...defaultProps}
        restrictions={['Max 25kg', 'Not for liquids']}
      />
    );
    expect(getByText('Max 25kg')).toBeTruthy();
    expect(getByText('Not for liquids')).toBeTruthy();
  });

  it('applies selected styling when selected', () => {
    const { getByTestId } = render(
      <PackagingCodeCard {...defaultProps} selected />
    );
    const card = getByTestId('packaging-code-card');
    expect(card.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ borderColor: expect.any(String) })])
    );
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <PackagingCodeCard {...defaultProps} onPress={onPress} />
    );
    fireEvent.press(getByTestId('packaging-code-card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when not provided', () => {
    const { getByTestId } = render(<PackagingCodeCard {...defaultProps} />);
    // Should not throw when pressed without onPress
    fireEvent.press(getByTestId('packaging-code-card'));
  });
});
