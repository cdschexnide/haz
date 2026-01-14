// src/components/preparer/__tests__/CountryAutocomplete.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CountryAutocomplete } from '../CountryAutocomplete';

describe('CountryAutocomplete', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder', () => {
    const { getByPlaceholderText } = render(
      <CountryAutocomplete {...defaultProps} />
    );
    expect(getByPlaceholderText('Search country...')).toBeTruthy();
  });

  it('displays current value', () => {
    const { getByDisplayValue } = render(
      <CountryAutocomplete {...defaultProps} value="United States" />
    );
    expect(getByDisplayValue('United States')).toBeTruthy();
  });

  it('shows suggestions when typing', () => {
    const { getByPlaceholderText, getByText } = render(
      <CountryAutocomplete {...defaultProps} />
    );
    const input = getByPlaceholderText('Search country...');
    fireEvent.changeText(input, 'United');
    expect(getByText('United States')).toBeTruthy();
  });

  it('calls onChange when suggestion selected', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText, getByText } = render(
      <CountryAutocomplete {...defaultProps} onChange={mockOnChange} />
    );
    const input = getByPlaceholderText('Search country...');
    fireEvent.changeText(input, 'United');
    fireEvent.press(getByText('United States'));
    expect(mockOnChange).toHaveBeenCalledWith('United States');
  });
});
