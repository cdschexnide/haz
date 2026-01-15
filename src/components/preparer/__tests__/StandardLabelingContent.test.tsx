// src/components/preparer/__tests__/StandardLabelingContent.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StandardLabelingContent } from '../StandardLabelingContent';
import { RequiredLabel } from '@/utils/labelingRequirements';
import { RequiredMarking } from '@/utils/markingRequirements';

describe('StandardLabelingContent', () => {
  const mockLabels: RequiredLabel[] = [
    { id: 'primary-hazard', label: 'Primary Hazard', value: '4.1' },
    { id: 'military-shipping-label', label: 'Military Shipping Label (MSL) or DD Form 1387' },
  ];

  const mockMarkings: RequiredMarking[] = [
    { id: 'proper-shipping-name-unid', label: 'Proper Shipping Name and UN Number', value: 'FLAMMABLE SOLID UN1325' },
    { id: 'limited-quantity', label: 'Limited Quantity' },
  ];

  const mockOnInfoPress = jest.fn();

  const defaultProps = {
    requiredLabels: mockLabels,
    requiredMarkings: mockMarkings,
    limitedQuantity: false,
    onInfoPress: mockOnInfoPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Labels Section', () => {
    it('renders labels section with items', () => {
      const { getByText } = render(
        <StandardLabelingContent {...defaultProps} />
      );

      expect(getByText('Required Labels')).toBeTruthy();
      expect(getByText('Primary Hazard')).toBeTruthy();
      expect(getByText('4.1')).toBeTruthy();
      expect(getByText('Military Shipping Label (MSL) or DD Form 1387')).toBeTruthy();
    });

    it('renders empty labels section when no labels provided', () => {
      const { getByText, queryByText } = render(
        <StandardLabelingContent
          {...defaultProps}
          requiredLabels={[]}
        />
      );

      expect(getByText('Required Labels')).toBeTruthy();
      expect(queryByText('Primary Hazard')).toBeNull();
    });
  });

  describe('Markings Section', () => {
    it('renders markings section with items', () => {
      const { getByText } = render(
        <StandardLabelingContent {...defaultProps} />
      );

      expect(getByText('Required Markings')).toBeTruthy();
      expect(getByText('Proper Shipping Name and UN Number')).toBeTruthy();
      expect(getByText('FLAMMABLE SOLID UN1325')).toBeTruthy();
      expect(getByText('Limited Quantity')).toBeTruthy();
    });

    it('renders empty markings section when no markings provided', () => {
      const { getByText, queryByText } = render(
        <StandardLabelingContent
          {...defaultProps}
          requiredMarkings={[]}
        />
      );

      expect(getByText('Required Markings')).toBeTruthy();
      expect(queryByText('Proper Shipping Name and UN Number')).toBeNull();
    });
  });

  describe('Info Button', () => {
    it('calls onInfoPress when info button pressed', () => {
      const { getAllByTestId } = render(
        <StandardLabelingContent {...defaultProps} />
      );

      const infoButtons = getAllByTestId('info-button');
      expect(infoButtons.length).toBeGreaterThan(0);

      fireEvent.press(infoButtons[0]);
      expect(mockOnInfoPress).toHaveBeenCalled();
    });

    it('passes correct attachment number to onInfoPress for labels', () => {
      const labelsWithAttachment: RequiredLabel[] = [
        { id: 'test-label', label: 'Test Label', value: 'A5.1.2' },
      ];

      const { getAllByTestId } = render(
        <StandardLabelingContent
          {...defaultProps}
          requiredLabels={labelsWithAttachment}
        />
      );

      const infoButtons = getAllByTestId('info-button');
      fireEvent.press(infoButtons[0]);

      expect(mockOnInfoPress).toHaveBeenCalledWith('test-label');
    });
  });

  describe('Limited Quantity Banner', () => {
    it('shows limited quantity banner when limitedQuantity=true', () => {
      const { getByText } = render(
        <StandardLabelingContent
          {...defaultProps}
          limitedQuantity={true}
        />
      );

      expect(getByText('Limited Quantity Notice')).toBeTruthy();
      expect(
        getByText(/This shipment qualifies as a Limited Quantity/)
      ).toBeTruthy();
    });

    it('hides limited quantity banner when limitedQuantity=false', () => {
      const { queryByText } = render(
        <StandardLabelingContent
          {...defaultProps}
          limitedQuantity={false}
        />
      );

      expect(queryByText('Limited Quantity Notice')).toBeNull();
    });
  });
});
