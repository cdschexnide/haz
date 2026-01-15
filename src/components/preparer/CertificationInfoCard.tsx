// src/components/preparer/CertificationInfoCard.tsx
import React from 'react';
import { DetailCard, DetailField } from '@/components/ui';

export interface CertificationInfoCardProps {
  preparerName: string;
  preparerRank?: string;
  preparerTitle: string;
  certificationPlace: string;
}

export const CertificationInfoCard: React.FC<CertificationInfoCardProps> = ({
  preparerName,
  preparerRank,
  preparerTitle,
  certificationPlace,
}) => {
  const fields: DetailField[] = [
    { label: 'Name', value: preparerName },
  ];

  if (preparerRank) {
    fields.push({ label: 'Rank', value: preparerRank });
  }

  fields.push(
    { label: 'Title', value: preparerTitle },
    { label: 'Place', value: certificationPlace }
  );

  return (
    <DetailCard
      title="Certification Information"
      icon="verified-user"
      fields={fields}
    />
  );
};
