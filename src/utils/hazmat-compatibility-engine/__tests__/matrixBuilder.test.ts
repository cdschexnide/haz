import { buildCompatibilityMatrix } from '../matrixBuilder';
import { CheckCompatibleHazmatOutput } from '../engineTypes';
import { CheckCompatibleHazmatInput } from '../resolvers-types';

describe('matrixBuilder', () => {
  test('uses engine-provided pair indices to map duplicate materials to correct matrix cells', () => {
    const inputs: CheckCompatibleHazmatInput[] = [
      {
        unid: 'UN1000',
        properShippingName: 'DUPLICATE MATERIAL',
        hazardClassDivisionNumber: '3',
        compatibilityGroup: '',
        packingGroup: '',
      },
      {
        unid: 'UN1000',
        properShippingName: 'DUPLICATE MATERIAL',
        hazardClassDivisionNumber: '3',
        compatibilityGroup: '',
        packingGroup: '',
      },
      {
        unid: 'UN2000',
        properShippingName: 'TARGET MATERIAL',
        hazardClassDivisionNumber: '2.1',
        compatibilityGroup: '',
        packingGroup: '',
      },
    ];

    const engineResult: CheckCompatibleHazmatOutput = {
      hazmatCompatibilityKeys: [
        [inputs[1] as any, inputs[2] as any],
      ],
      incompatiblePairIndices: [[1, 2]],
      segregatedHazmatMaterials: [],
      segregationPairIndices: [],
      noteConditionPairs: [],
    };

    const { matrix, cellDetails } = buildCompatibilityMatrix(inputs, engineResult);

    expect(matrix[1][2]).toBe('X');
    expect(matrix[2][1]).toBe('X');
    expect(matrix[0][2]).not.toBe('X');
    expect(cellDetails[1][2].status).toBe('X');
    expect(cellDetails[0][2].status).not.toBe('X');
  });
});
