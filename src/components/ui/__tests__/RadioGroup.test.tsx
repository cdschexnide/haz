// src/components/ui/__tests__/RadioGroup.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RadioGroup } from '../RadioGroup';

const mockOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

describe('RadioGroup', () => {
  it('renders all options', () => {
    const { getByText } = render(
      <RadioGroup
        label="Test Group"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    );
    expect(getByText('Option A')).toBeTruthy();
    expect(getByText('Option B')).toBeTruthy();
    expect(getByText('Option C')).toBeTruthy();
  });

  it('renders the label', () => {
    const { getByText } = render(
      <RadioGroup
        label="Test Group"
        options={mockOptions}
        value=""
        onChange={() => {}}
      />
    );
    expect(getByText('Test Group')).toBeTruthy();
  });

  it('calls onChange when option is pressed', () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <RadioGroup
        label="Test Group"
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    fireEvent.press(getByText('Option B'));
    expect(mockOnChange).toHaveBeenCalledWith('b');
  });

  it('shows required asterisk when required', () => {
    const { getByText } = render(
      <RadioGroup
        label="Test Group"
        options={mockOptions}
        value=""
        onChange={() => {}}
        required
      />
    );
    expect(getByText('*')).toBeTruthy();
  });
});
