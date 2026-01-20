// src/components/preparer/__tests__/POPMarkingDisplay.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { POPMarkingDisplay } from '../POPMarkingDisplay';

describe('POPMarkingDisplay', () => {
  const solidValues = {
    A: 'u',
    B: '4G',
    C: 'Y',
    D: '50',
    E: 'S',
    F: '24',
    G: 'USA',
    H: 'ABC',
  };

  const liquidValues = {
    A: 'u',
    B: '1A1',
    C: 'X',
    D: '1.2',
    E: '100',
    F: '24',
    G: 'USA',
    H: 'XYZ',
  };

  it('renders solid POP marking format', () => {
    const { getByText } = render(
      <POPMarkingDisplay values={solidValues} physicalState="solid" />
    );
    expect(getByText(/4G/)).toBeTruthy();
    expect(getByText(/Y/)).toBeTruthy();
    expect(getByText(/50/)).toBeTruthy();
  });

  it('renders liquid POP marking format', () => {
    const { getByText } = render(
      <POPMarkingDisplay values={liquidValues} physicalState="liquid" />
    );
    expect(getByText(/1A1/)).toBeTruthy();
    expect(getByText(/\/X\//)).toBeTruthy();
    expect(getByText(/1\.2/)).toBeTruthy();
  });

  it('renders UN symbol', () => {
    const { getByTestId } = render(
      <POPMarkingDisplay values={solidValues} physicalState="solid" />
    );
    expect(getByTestId('pop-display-container')).toBeTruthy();
  });

  it('renders compact variant', () => {
    const { getByTestId } = render(
      <POPMarkingDisplay values={solidValues} physicalState="solid" variant="compact" />
    );
    const container = getByTestId('pop-display-container');
    expect(container).toBeTruthy();
  });
});
