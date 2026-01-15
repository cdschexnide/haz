// src/screens/preparer/__tests__/DisclaimerScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DisclaimerScreen } from '../DisclaimerScreen';

describe('DisclaimerScreen', () => {
  const mockNavigation = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders disclaimer title', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation as any} />
    );
    expect(getByText('Important Disclaimer')).toBeTruthy();
  });

  it('renders disclaimer content', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation as any} />
    );
    expect(getByText(/HazPro is a support tool/)).toBeTruthy();
  });

  it('navigates to ShipmentCreation on Accept', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation as any} />
    );
    fireEvent.press(getByText('Accept'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('ShipmentCreation');
  });

  it('navigates to PreparerHome on Decline', () => {
    const { getByText } = render(
      <DisclaimerScreen navigation={mockNavigation as any} />
    );
    fireEvent.press(getByText('Decline'));
    expect(mockNavigation.navigate).toHaveBeenCalledWith('PreparerHome');
  });
});
