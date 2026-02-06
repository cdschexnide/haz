import { CheckCompatibleHazmatOutput } from './engineTypes';
import { CheckCompatibleHazmatInput } from './resolvers-types';

export interface CellDetail {
  status: 'X' | '0' | '✓' | '-';
  noteCondition: string | null;
  noteContent?: string;
  message: string;
  material1Unid: string;
  material2Unid: string;
  material1Class: string;
  material2Class: string;
}

type MaterialLike = {
  unid: string;
  properShippingName: string;
  hazardClassDivisionNumber?: string;
  compatibilityGroup?: string;
  packingGroup?: string;
};

const getMaterialSignature = (material: MaterialLike): string =>
  [
    (material.unid || '').trim(),
    (material.properShippingName || '').trim(),
    (material.hazardClassDivisionNumber || '').trim(),
    (material.compatibilityGroup || '').trim(),
    (material.packingGroup || '').trim(),
  ].join('|');

const findIndicesByMatch = (
  inputs: CheckCompatibleHazmatInput[],
  first: MaterialLike,
  second: MaterialLike
): [number, number] | null => {
  const firstSignature = getMaterialSignature(first);
  const secondSignature = getMaterialSignature(second);

  const firstIndex = inputs.findIndex(
    input => getMaterialSignature(input) === firstSignature
  );
  const secondIndex = inputs.findIndex(
    input => getMaterialSignature(input) === secondSignature
  );

  if (firstIndex === -1 || secondIndex === -1 || firstIndex === secondIndex) {
    return null;
  }

  return [firstIndex, secondIndex];
};

export function buildCompatibilityMatrix(
  hazmatInputs: CheckCompatibleHazmatInput[],
  engineResult: CheckCompatibleHazmatOutput
): {
  matrix: string[][];
  headers: string[];
  cellDetails: CellDetail[][];
} {
  const n = hazmatInputs.length;
  const matrix: string[][] = Array(n)
    .fill(null)
    .map(() => Array(n).fill(''));

  const cellDetails: CellDetail[][] = Array(n)
    .fill(null)
    .map(() =>
      Array(n)
        .fill(null)
        .map(() => ({
          status: '✓' as const,
          noteCondition: null,
          message: 'No Restrictions',
          material1Unid: '',
          material2Unid: '',
          material1Class: '',
          material2Class: '',
        }))
    );

  const headers = hazmatInputs.map(h => h.unid.replace('UN', ''));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      cellDetails[i][j].material1Unid = hazmatInputs[i].unid;
      cellDetails[i][j].material2Unid = hazmatInputs[j].unid;
      cellDetails[i][j].material1Class = hazmatInputs[i].hazardClassDivisionNumber;
      cellDetails[i][j].material2Class = hazmatInputs[j].hazardClassDivisionNumber;

      if (i === j) {
        cellDetails[i][j].status = '-';
        cellDetails[i][j].message = 'Same Material';
      }
    }
  }

  if (engineResult.hazmatCompatibilityKeys) {
    engineResult.hazmatCompatibilityKeys.forEach((pair, pairIndex) => {
      if (!pair || pair.length !== 2) {
        return;
      }

      const indexedPair = engineResult.incompatiblePairIndices?.[pairIndex];
      const fallbackPair = findIndicesByMatch(hazmatInputs, pair[0], pair[1]);
      const resolvedPair = indexedPair || fallbackPair;

      if (!resolvedPair) {
        return;
      }

      const [idx1, idx2] = resolvedPair;
      if (idx1 === idx2) {
        return;
      }

      matrix[idx1][idx2] = 'X';
      matrix[idx2][idx1] = 'X';
      cellDetails[idx1][idx2].status = 'X';
      cellDetails[idx2][idx1].status = 'X';
      cellDetails[idx1][idx2].message = 'Cannot Be Loaded';
      cellDetails[idx2][idx1].message = 'Cannot Be Loaded';
    });
  }

  if (engineResult.segregatedHazmatMaterials) {
    engineResult.segregatedHazmatMaterials.forEach((item, pairIndex) => {
      const pair = item.hazmatObjectPair;
      if (!pair || pair.length !== 2) {
        return;
      }

      const indexedPair =
        item.pairIndices ||
        engineResult.segregationPairIndices?.[pairIndex];
      const fallbackPair = findIndicesByMatch(hazmatInputs, pair[0], pair[1]);
      const resolvedPair = indexedPair || fallbackPair;

      if (!resolvedPair) {
        return;
      }

      const [idx1, idx2] = resolvedPair;
      if (idx1 === idx2 || matrix[idx1][idx2] === 'X') {
        return;
      }

      matrix[idx1][idx2] = '0';
      matrix[idx2][idx1] = '0';
      cellDetails[idx1][idx2].status = '0';
      cellDetails[idx2][idx1].status = '0';
      cellDetails[idx1][idx2].message =
        item.segregationDescription || '88 Inches of Separation';
      cellDetails[idx2][idx1].message =
        item.segregationDescription || '88 Inches of Separation';
      cellDetails[idx1][idx2].noteCondition = item.noteCondition || null;
      cellDetails[idx2][idx1].noteCondition = item.noteCondition || null;
    });
  }

  if (engineResult.noteConditionPairs) {
    engineResult.noteConditionPairs.forEach(item => {
      const pair = item.hazmatObjectPair;
      if (!pair || pair.length !== 2) {
        return;
      }

      const indexedPair = item.pairIndices;
      const fallbackPair = findIndicesByMatch(hazmatInputs, pair[0], pair[1]);
      const resolvedPair = indexedPair || fallbackPair;

      if (!resolvedPair) {
        return;
      }

      const [idx1, idx2] = resolvedPair;
      cellDetails[idx1][idx2].noteCondition = item.noteCondition;
      cellDetails[idx2][idx1].noteCondition = item.noteCondition;
      cellDetails[idx1][idx2].noteContent = item.noteContent;
      cellDetails[idx2][idx1].noteContent = item.noteContent;
    });
  }

  return { matrix, headers, cellDetails };
}
