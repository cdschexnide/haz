// src/components/ui/__tests__/ChecklistItem.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ChecklistItem } from '../ChecklistItem';

describe('ChecklistItem', () => {
  it('renders label and unchecked checkbox', () => {
    const { getByText, getByTestId } = render(
      <ChecklistItem
        label="Test Item"
        checked={false}
        onChange={() => {}}
      />
    );
    expect(getByText('Test Item')).toBeTruthy();
    // Verify unchecked state via accessibilityState
    const checkbox = getByTestId('checklist-item');
    expect(checkbox.props.accessibilityState.checked).toBe(false);
  });

  it('renders checked checkbox when checked=true', () => {
    const { getByTestId } = render(
      <ChecklistItem
        label="Test Item"
        checked={true}
        onChange={() => {}}
      />
    );
    // Verify checked state via accessibilityState
    const checkbox = getByTestId('checklist-item');
    expect(checkbox.props.accessibilityState.checked).toBe(true);
  });

  it('calls onChange with true when unchecked item pressed', () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <ChecklistItem
        label="Test Item"
        checked={false}
        onChange={mockOnChange}
      />
    );
    fireEvent.press(getByText('Test Item'));
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when checked item pressed', () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <ChecklistItem
        label="Test Item"
        checked={true}
        onChange={mockOnChange}
      />
    );
    fireEvent.press(getByText('Test Item'));
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('does not call onChange when disabled', () => {
    const mockOnChange = jest.fn();
    const { getByText } = render(
      <ChecklistItem
        label="Test Item"
        checked={false}
        onChange={mockOnChange}
        disabled
      />
    );
    fireEvent.press(getByText('Test Item'));
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('renders description when provided', () => {
    const { getByText } = render(
      <ChecklistItem
        label="Test Item"
        checked={false}
        onChange={() => {}}
        description="This is a description"
      />
    );
    expect(getByText('This is a description')).toBeTruthy();
  });
});
