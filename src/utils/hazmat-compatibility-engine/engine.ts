import { Rule } from 'json-rules-engine';
import { CheckCompatibleHazmatInput } from './resolvers-types';
import {
  CheckCompatibleHazmatOutput,
  COMPATIBILITY_GROUPS,
  HazmatCompatibilityKey,
} from './engineTypes';
import { allHazmatCompatibilityKeys } from './allHazmatCompatibilityKeys';
import {
  calculateIncompatiblePairs,
  findSegregationHazmatPairs,
  parseNumericSpecialProvisionCode,
  splitHazmatCompatibilityKeysIntoPairs,
} from './engineHelperFunctions';

// Import the optimized version
export { runGraphEngineOptimized, clearCache, getCacheStats } from './optimizedEngine';

export const runGraphEngine = async (
  hazmatObjects: CheckCompatibleHazmatInput[],
  rules: Rule[],
  debug?: boolean,
): Promise<CheckCompatibleHazmatOutput> => {
  const startTime = performance.now();
  const hazmatCompatibilityKeys: HazmatCompatibilityKey[] = hazmatObjects.map(
    (obj) => ({
      compatibilityGroup:
        obj.compatibilityGroup as typeof COMPATIBILITY_GROUPS[number],
      hazardClassDivisionNumber: obj.hazardClassDivisionNumber,
      properShippingName: obj.properShippingName,
      unid: obj.unid,
      numericSpecialProvision: parseNumericSpecialProvisionCode(
        String(
          allHazmatCompatibilityKeys.find((key) => {
            if (
              key.compatibilityGroup === obj.compatibilityGroup &&
              key.hazardClassDivisionNumber === obj.hazardClassDivisionNumber &&
              key.properShippingName === obj.properShippingName &&
              key.unid === obj.unid
            ) {
              return key;
            }
            return null;
          })?.numericSpecialProvision,
        ),
      ),
    }),
  );
  const hazmatPairs = splitHazmatCompatibilityKeysIntoPairs(
    hazmatCompatibilityKeys,
    debug,
  );
  const incompatiblePairs = await calculateIncompatiblePairs(
    hazmatCompatibilityKeys,
    rules,
    debug,
  );
  const segregationHazmatPairs = await findSegregationHazmatPairs({
    hazmatPairs,
    rules,
    debug,
  });
  const endTime = performance.now();
  const executionTime = endTime - startTime;

  // Always log execution time for comparison with optimized version
  console.log(`⏳ runGraphEngine (original) completed in ${executionTime.toFixed(2)}ms (${hazmatObjects?.length || 0} materials, ${Math.floor(((hazmatObjects?.length || 0) * ((hazmatObjects?.length || 0) - 1)) / 2)} pairs)`);

  return {
    hazmatCompatibilityKeys: incompatiblePairs,
    segregatedHazmatMaterials: segregationHazmatPairs,
  };
};
