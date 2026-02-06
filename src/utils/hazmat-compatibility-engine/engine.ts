import { Rule } from 'json-rules-engine';
import { CheckCompatibleHazmatInput } from './resolvers-types';
import {
  CheckCompatibleHazmatOutput,
} from './engineTypes';
import { CompatibilityEngineOptions, runGraphEngineOptimized } from './optimizedEngine';

// Import the optimized version
export { runGraphEngineOptimized, clearCache, getCacheStats } from './optimizedEngine';

export const runGraphEngine = async (
  hazmatObjects: CheckCompatibleHazmatInput[],
  rules: Rule[],
  debug?: boolean,
  options?: CompatibilityEngineOptions,
): Promise<CheckCompatibleHazmatOutput> => {
  return runGraphEngineOptimized(hazmatObjects, rules, debug, options);
};
