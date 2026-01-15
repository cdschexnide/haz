// src/components/preparer/__tests__/CertificationInfoCard.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { CertificationInfoCard } from '../CertificationInfoCard';

describe('CertificationInfoCard', () => {
  const defaultProps = {
    preparerName: 'John Doe',
    preparerTitle: 'Hazardous Materials Certifier',
    certificationPlace: 'Fort Liberty, NC',
  };

  it('renders all fields when provided', () => {
    const { getByText } = render(
      <CertificationInfoCard
        {...defaultProps}
        preparerRank="SGT"
      />
    );

    expect(getByText('Name')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Rank')).toBeTruthy();
    expect(getByText('SGT')).toBeTruthy();
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Hazardous Materials Certifier')).toBeTruthy();
    expect(getByText('Place')).toBeTruthy();
    expect(getByText('Fort Liberty, NC')).toBeTruthy();
  });

  it('omits rank field when not provided', () => {
    const { getByText, queryByText } = render(
      <CertificationInfoCard {...defaultProps} />
    );

    expect(getByText('Name')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(queryByText('Rank')).toBeNull();
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Hazardous Materials Certifier')).toBeTruthy();
    expect(getByText('Place')).toBeTruthy();
    expect(getByText('Fort Liberty, NC')).toBeTruthy();
  });

  it('displays correct title', () => {
    const { getByText } = render(
      <CertificationInfoCard {...defaultProps} />
    );

    expect(getByText('Certification Information')).toBeTruthy();
  });
});
