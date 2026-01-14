// src/components/ui/__tests__/FormInput.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { FormInput } from '../FormInput';

describe('FormInput', () => {
  it('renders placeholder text', () => {
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('displays value correctly', () => {
    const { getByDisplayValue } = render(
      <FormInput value="Test value" onChangeText={() => {}} />
    );
    expect(getByDisplayValue('Test value')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const mockOnChange = jest.fn();
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Enter text" onChangeText={mockOnChange} />
    );
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'New text');
    expect(mockOnChange).toHaveBeenCalledWith('New text');
  });

  it('applies error styling when error prop is provided', () => {
    const { toJSON } = render(
      <FormInput placeholder="Enter text" error={{ message: 'Error' }} />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('is not editable when disabled', () => {
    const { getByPlaceholderText } = render(
      <FormInput placeholder="Enter text" disabled />
    );
    const input = getByPlaceholderText('Enter text');
    expect(input.props.editable).toBe(false);
  });
});
