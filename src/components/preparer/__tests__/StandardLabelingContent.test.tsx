import React from 'react';
import { render } from '@testing-library/react-native';
import { StandardLabelingContent } from '../StandardLabelingContent';
import { RequiredLabel } from '@/utils/labelingRequirements';
import { RequiredMarking } from '@/utils/markingRequirements';

jest.mock('@/utils/hazardDiamondImages', () => ({
  getHazardDiamondImage: (hazardClass: string) => {
    const map: Record<string, number> = { '5.1': 1, '6.1': 2, '2.1': 3, '8': 4 };
    return map[hazardClass] ?? null;
  },
  getHazardClassName: (hazardClass: string) => {
    const names: Record<string, string> = {
      '5.1': 'Oxidizer',
      '6.1': 'Toxic',
      '2.1': 'Flammable Gas',
      '8': 'Corrosive',
    };
    return names[hazardClass] ?? null;
  },
  parseSubsidiaryRisks: (val: string | undefined | null) =>
    val ? val.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('StandardLabelingContent', () => {
  const mockLabels: RequiredLabel[] = [
    { id: 'military-shipping-label', label: 'Military Shipping Label (MSL) or DD Form 1387' },
    { id: 'primary-hazard', label: 'Primary Hazard', value: '5.1' },
    { id: 'subsidiary-risk', label: 'Subsidiary Risk', value: '6.1' },
    { id: 'cargo-aircraft-only', label: 'Cargo Aircraft Only', value: 'Cargo Aircraft Only' },
  ];

  const mockMarkings: RequiredMarking[] = [
    {
      id: 'proper-shipping-name-unid',
      label: 'Proper Shipping Name and UN Number',
      value: 'BARIUM BROMATE UN2719',
    },
    {
      id: 'pop-marking',
      label: 'POP Marking, stenciled and/or printed',
      renderType: 'pop',
      metadata: { B: '4G', C: 'Y', D: '75', E: 'S', F: '24', G: 'USA', H: 'AB' },
    },
  ];

  it('renders labels section with count', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );

    expect(getByText('Required Labels')).toBeTruthy();
  });

  it('renders markings section with count', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );

    expect(getByText('Required Markings')).toBeTruthy();
  });

  it('renders primary hazard label with class name', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );

    expect(getByText('Primary Hazard')).toBeTruthy();
    expect(getByText('Oxidizer')).toBeTruthy();
  });

  it('renders subsidiary risk label with class name', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );

    expect(getByText('Subsidiary Risk')).toBeTruthy();
    expect(getByText('Toxic')).toBeTruthy();
  });

  it('renders cargo aircraft only card', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );

    expect(getByText('Cargo Aircraft Only')).toBeTruthy();
  });

  it('renders proper shipping name marking prominently', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );

    expect(getByText('BARIUM BROMATE UN2719')).toBeTruthy();
  });

  it('renders assembled POP marking string from metadata', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );

    expect(getByText('UN / 4G / Y / 75 / S / 24 / USA / AB')).toBeTruthy();
  });

  it('shows limited quantity banner when limitedQuantity is true', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={true}
      />
    );

    expect(getByText('Limited Quantity Notice')).toBeTruthy();
  });

  it('does not render info buttons on individual rows', () => {
    const { queryAllByTestId } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );

    expect(queryAllByTestId('info-button')).toHaveLength(0);
  });

  it('renders multi-value subsidiary risk as separate cards', () => {
    const multiSubLabels: RequiredLabel[] = [
      { id: 'subsidiary-risk', label: 'Subsidiary Risk', value: '2.1, 8' },
    ];
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={multiSubLabels}
        requiredMarkings={[]}
        limitedQuantity={false}
      />
    );
    expect(getByText('Flammable Gas')).toBeTruthy();
    expect(getByText('Corrosive')).toBeTruthy();
  });

  it('renders label-only markings without fallback text', () => {
    const labelOnlyMarkings: RequiredMarking[] = [
      { id: 'overpack', label: 'OVERPACK' },
      { id: 'limited-quantity', label: 'Limited Quantity' },
    ];
    const { getByText, queryByText } = render(
      <StandardLabelingContent
        requiredLabels={[]}
        requiredMarkings={labelOnlyMarkings}
        limitedQuantity={false}
      />
    );
    expect(getByText('OVERPACK')).toBeTruthy();
    expect(getByText('Limited Quantity')).toBeTruthy();
    expect(queryByText('Stenciled and/or printed')).toBeNull();
  });

  it('renders orientation arrows marking image when required', () => {
    const orientationMarking: RequiredMarking[] = [
      {
        id: 'orientation-arrows',
        label: 'Orientation Arrows',
        value: 'Apply on two opposite vertical sides',
      },
    ];

    const { getByText, getByTestId } = render(
      <StandardLabelingContent
        requiredLabels={[]}
        requiredMarkings={orientationMarking}
        limitedQuantity={false}
      />
    );

    expect(getByText('Orientation Arrows')).toBeTruthy();
    expect(getByTestId('marking-image-orientation-arrows')).toBeTruthy();
  });
});
