import React from 'react';
import { InfoCardItem } from './InfoCardItem';

interface WeightDisplayProps {
  weight: {
    lbs: number;
    kg: number;
  };
  label?: string;
  isDisabled?: boolean;
}

export const WeightDisplay: React.FC<WeightDisplayProps> = ({
  weight,
  label = "Max Gross Weight",
  isDisabled = false
}) => {
  return (
    <InfoCardItem
      label={label}
      value={`${weight.lbs} lbs / ${weight.kg} kg`}
      isDisabled={isDisabled}
    />
  );
};