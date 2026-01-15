// src/components/preparer/__tests__/VehicleLabelingNotice.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { VehicleLabelingNotice } from '../VehicleLabelingNotice';

describe('VehicleLabelingNotice', () => {
  it('renders info box with vehicle notice text', () => {
    const { getByText } = render(<VehicleLabelingNotice />);

    expect(
      getByText(
        'Vehicles do not require labels or markings, unless crated and/or packaged.'
      )
    ).toBeTruthy();
  });

  it('renders section header with Vehicle Shipment title', () => {
    const { getByText } = render(<VehicleLabelingNotice />);

    expect(getByText('Vehicle Shipment')).toBeTruthy();
  });
});
