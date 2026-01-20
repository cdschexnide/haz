// src/components/preparer/__tests__/POPMarkingForm.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { POPMarkingForm } from '../POPMarkingForm';

describe('POPMarkingForm', () => {
  const defaultValues = {
    A: 'u',
    B: '',
    C: '',
    D: '',
    E: '',
    F: '',
    G: '',
    H: '',
  };

  const defaultProps = {
    values: defaultValues,
    onChange: jest.fn(),
    physicalState: 'solid' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all POP marking fields', () => {
    const { getByText } = render(<POPMarkingForm {...defaultProps} />);
    expect(getByText('Packaging Code (B)')).toBeTruthy();
    expect(getByText('Packing Group (C)')).toBeTruthy();
    expect(getByText('Maximum Gross Mass (D)')).toBeTruthy();
    expect(getByText('Year of Manufacture (F)')).toBeTruthy();
    expect(getByText('Country Code (G)')).toBeTruthy();
    expect(getByText('Manufacturer Code (H)')).toBeTruthy();
  });

  it('calls onChange when field B is updated', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <POPMarkingForm {...defaultProps} onChange={onChange} />
    );
    const input = getByTestId('pop-field-B');
    fireEvent.changeText(input, '4G');
    expect(onChange).toHaveBeenCalledWith('B', '4G');
  });

  it('shows Specific Gravity label for liquids', () => {
    const { getByText } = render(
      <POPMarkingForm {...defaultProps} physicalState="liquid" />
    );
    expect(getByText('Specific Gravity (D)')).toBeTruthy();
  });

  it('shows Maximum Gross Mass label for solids', () => {
    const { getByText } = render(
      <POPMarkingForm {...defaultProps} physicalState="solid" />
    );
    expect(getByText('Maximum Gross Mass (D)')).toBeTruthy();
  });

  it('renders packing group options', () => {
    const { getByText } = render(
      <POPMarkingForm {...defaultProps} allowablePackingGroups={['X', 'Y', 'Z']} />
    );
    expect(getByText('X')).toBeTruthy();
    expect(getByText('Y')).toBeTruthy();
    expect(getByText('Z')).toBeTruthy();
  });

  it('filters packing group options when specified', () => {
    const { getByText, queryByText } = render(
      <POPMarkingForm {...defaultProps} allowablePackingGroups={['X', 'Y']} />
    );
    expect(getByText('X')).toBeTruthy();
    expect(getByText('Y')).toBeTruthy();
    expect(queryByText('Z')).toBeNull();
  });

  it('displays error for field B when provided', () => {
    const { getByText } = render(
      <POPMarkingForm
        {...defaultProps}
        errors={{ B: 'Invalid packaging code' }}
      />
    );
    expect(getByText('Invalid packaging code')).toBeTruthy();
  });

  it('renders field as read-only when in readOnlyFields', () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <POPMarkingForm
        {...defaultProps}
        onChange={onChange}
        readOnlyFields={['B']}
        values={{ ...defaultValues, B: '4G' }}
      />
    );
    const input = getByTestId('pop-field-B');
    expect(input.props.editable).toBe(false);
  });
});
