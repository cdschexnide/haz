// src/components/preparer/__tests__/AddressFormSection.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddressFormSection } from '../AddressFormSection';

describe('AddressFormSection', () => {
  const defaultProps = {
    type: 'shipper' as const,
    country: '',
    onCountryChange: jest.fn(),
    locationOrDodaac: '',
    onLocationOrDodaacChange: jest.fn(),
    street: '',
    onStreetChange: jest.fn(),
    city: '',
    onCityChange: jest.fn(),
    state: '',
    onStateChange: jest.fn(),
    zipCode: '',
    onZipCodeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders shipper section with Location Name label', () => {
    const { getByText } = render(<AddressFormSection {...defaultProps} type="shipper" />);
    expect(getByText('Location Name')).toBeTruthy();
  });

  it('renders consignee section with DODAAC label', () => {
    const { getByText } = render(<AddressFormSection {...defaultProps} type="consignee" />);
    expect(getByText('DODAAC')).toBeTruthy();
  });

  it('renders Country field', () => {
    const { getByPlaceholderText } = render(<AddressFormSection {...defaultProps} />);
    expect(getByPlaceholderText('Search country...')).toBeTruthy();
  });

  it('renders Street, City, State, Zip Code fields', () => {
    const { getByPlaceholderText } = render(<AddressFormSection {...defaultProps} />);
    expect(getByPlaceholderText('Enter street address')).toBeTruthy();
    expect(getByPlaceholderText('Enter city')).toBeTruthy();
    expect(getByPlaceholderText('Enter state')).toBeTruthy();
    expect(getByPlaceholderText('Enter zip code')).toBeTruthy();
  });

  it('disables state field when country is not United States', () => {
    const { getByPlaceholderText } = render(
      <AddressFormSection {...defaultProps} country="Canada" />
    );
    const stateInput = getByPlaceholderText('Enter state');
    expect(stateInput.props.editable).toBe(false);
  });

  it('enables state field when country is United States', () => {
    const { getByPlaceholderText } = render(
      <AddressFormSection {...defaultProps} country="United States" />
    );
    const stateInput = getByPlaceholderText('Enter state');
    expect(stateInput.props.editable).toBe(true);
  });

  it('calls onStreetChange when street input changes', () => {
    const { getByPlaceholderText } = render(<AddressFormSection {...defaultProps} />);
    fireEvent.changeText(getByPlaceholderText('Enter street address'), '123 Main St');
    expect(defaultProps.onStreetChange).toHaveBeenCalledWith('123 Main St');
  });
});
