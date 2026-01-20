// src/components/preparer/__tests__/SpecialtyMaterialScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SpecialtyMaterialScreen } from '../SpecialtyMaterialScreen';

const mockMaterial = {
  unid: 'UN3166',
  properShippingName: 'Engines, internal combustion',
  hazardClass: '9',
  packingGroup: undefined,
};

describe('SpecialtyMaterialScreen', () => {
  const defaultProps = {
    title: 'Fuel Entry',
    material: mockMaterial,
    onBack: jest.fn(),
    onCancel: jest.fn(),
    onSaveExit: jest.fn(),
    onContinue: jest.fn(),
    children: <></>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title in header', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    expect(getByText('Fuel Entry')).toBeTruthy();
  });

  it('renders material info card with UNID', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    expect(getByText('UN3166')).toBeTruthy();
  });

  it('renders material proper shipping name', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    expect(getByText('Engines, internal combustion')).toBeTruthy();
  });

  it('calls onCancel when Cancel pressed', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    fireEvent.press(getByText('Cancel'));
    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  it('calls onSaveExit when Save & Exit pressed', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    fireEvent.press(getByText('Save & Exit'));
    expect(defaultProps.onSaveExit).toHaveBeenCalled();
  });

  it('calls onContinue when Continue pressed', () => {
    const { getByText } = render(<SpecialtyMaterialScreen {...defaultProps} />);
    fireEvent.press(getByText('Save & Continue'));
    expect(defaultProps.onContinue).toHaveBeenCalled();
  });

  it('disables continue button when continueDisabled is true', () => {
    const onContinue = jest.fn();
    const { getByText } = render(
      <SpecialtyMaterialScreen {...defaultProps} onContinue={onContinue} continueDisabled={true} />
    );
    fireEvent.press(getByText('Save & Continue'));
    expect(onContinue).not.toHaveBeenCalled();
  });

  it('renders info banner when provided', () => {
    const { getByText } = render(
      <SpecialtyMaterialScreen {...defaultProps} infoBanner="Important info" />
    );
    expect(getByText('Important info')).toBeTruthy();
  });

  it('renders warning banner when provided', () => {
    const { getByText } = render(
      <SpecialtyMaterialScreen {...defaultProps} warningBanner="Warning message" />
    );
    expect(getByText('Warning message')).toBeTruthy();
  });

  it('renders children content', () => {
    const { getByTestId } = render(
      <SpecialtyMaterialScreen {...defaultProps}>
        <></>
      </SpecialtyMaterialScreen>
    );
    // Children should be rendered inside scroll view
    expect(getByTestId('specialty-content')).toBeTruthy();
  });
});
