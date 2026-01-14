// src/components/ui/__tests__/DatePickerField.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DatePickerField } from '../DatePickerField';

// Mock DateTimePicker since it's a native component
jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('DateTimePicker'),
  };
});

describe('DatePickerField', () => {
  it('renders the label', () => {
    const { getByText } = render(
      <DatePickerField
        label="Select Date"
        value={null}
        onChange={() => {}}
      />
    );
    expect(getByText('Select Date')).toBeTruthy();
  });

  it('displays placeholder when no date selected', () => {
    const { getByText } = render(
      <DatePickerField
        label="Select Date"
        value={null}
        onChange={() => {}}
      />
    );
    expect(getByText('Select a date')).toBeTruthy();
  });

  it('displays formatted date when value provided', () => {
    const testDate = new Date('2026-01-14');
    const { getByText } = render(
      <DatePickerField
        label="Select Date"
        value={testDate}
        onChange={() => {}}
      />
    );
    // Date format: YYYY-MM-DD
    expect(getByText('2026-01-14')).toBeTruthy();
  });

  it('shows required asterisk when required', () => {
    const { getByText } = render(
      <DatePickerField
        label="Select Date"
        value={null}
        onChange={() => {}}
        required
      />
    );
    expect(getByText('*')).toBeTruthy();
  });
});
