const { runGraphEngine } = require('./engine');
const { runGraphEngineOptimized, clearCache, getCacheStats } = require('./optimizedEngine');
const { rules } = require('./rules');
// Type imports for TypeScript
import type { CheckCompatibleHazmatInput } from './resolvers-types';

// Test data sets
const testHazmatObjects: CheckCompatibleHazmatInput[] = [
  {
    compatibilityGroup: 'A',
    hazardClassDivisionNumber: '1.1',
    properShippingName: 'AMMUNITION, SMOKE',
    unid: 'UN0015',
  },
  {
    compatibilityGroup: 'B',
    hazardClassDivisionNumber: '1.2',
    properShippingName: 'AMMUNITION, ILLUMINATING',
    unid: 'UN0171',
  },
  {
    compatibilityGroup: 'C',
    hazardClassDivisionNumber: '1.3',
    properShippingName: 'AMMUNITION, INCENDIARY',
    unid: 'UN0009',
  },
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '3',
    properShippingName: 'ACETAL',
    unid: 'UN1088',
  },
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '8',
    properShippingName: 'ACETIC ACID, GLACIAL',
    unid: 'UN2789',
  },
];

const class1TestObjects: CheckCompatibleHazmatInput[] = [
  {
    compatibilityGroup: 'A',
    hazardClassDivisionNumber: '1.1',
    properShippingName: 'AMMUNITION, SMOKE',
    unid: 'UN0015',
  },
  {
    compatibilityGroup: 'B',
    hazardClassDivisionNumber: '1.4',
    properShippingName: 'AMMUNITION, ILLUMINATING',
    unid: 'UN0171',
  },
  {
    compatibilityGroup: 'L',
    hazardClassDivisionNumber: '1.4',
    properShippingName: 'CHARGES, EXPLOSIVE, COMMERCIAL',
    unid: 'UN0442',
  },
];

const mixedHazmatObjects: CheckCompatibleHazmatInput[] = [
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '2.1',
    properShippingName: 'COMPRESSED GAS, FLAMMABLE',
    unid: 'UN1954',
  },
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '4.2',
    properShippingName: 'SELF-HEATING SOLID',
    unid: 'UN3088',
  },
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '5.1',
    properShippingName: 'OXIDIZING SOLID',
    unid: 'UN1479',
  },
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '9',
    properShippingName: 'ENVIRONMENTALLY HAZARDOUS SUBSTANCE',
    unid: 'UN3077',
  },
];

// Test Note 1 condition: UN2067 (Ammonium nitrate fertilizer) can be loaded with Class 1.1 or 1.5
const note1TestObjects: CheckCompatibleHazmatInput[] = [
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '5.1',
    properShippingName: 'AMMONIUM NITRATE FERTILIZER',
    unid: 'UN2067',
  },
  {
    compatibilityGroup: 'D',
    hazardClassDivisionNumber: '1.1',
    properShippingName: 'AMMUNITION, SMOKE',
    unid: 'UN0015',
  },
  {
    compatibilityGroup: 'D',
    hazardClassDivisionNumber: '1.5',
    properShippingName: 'SUBSTANCES, EXPLOSIVE, VERY INSENSITIVE',
    unid: 'UN0482',
  },
];

// Test Note 4 condition: Cyanides (Class 6.1) cannot be loaded with Class 8
const note4TestObjects: CheckCompatibleHazmatInput[] = [
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '6.1',
    properShippingName: 'HYDROGEN CYANIDE, STABILIZED',
    unid: 'UN1051', // Cyanide
  },
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '8',
    properShippingName: 'CORROSIVE LIQUID',
    unid: 'UN1760', // Class 8 corrosive
  },
];

// Test Note 5 condition: Nitric acid in carboys requires 88" segregation from other Class 8
const note5TestObjects: CheckCompatibleHazmatInput[] = [
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '8',
    properShippingName: 'NITRIC ACID',
    unid: 'UN1796', // Nitric acid in carboys
  },
  {
    compatibilityGroup: '',
    hazardClassDivisionNumber: '8',
    properShippingName: 'CORROSIVE LIQUID',
    unid: 'UN1760', // Another Class 8 corrosive
  },
];

/**
 * Deep comparison of two arrays, order-independent
 */
function deepCompareArrays(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Convert to JSON strings for comparison, sort to handle order differences
  const sorted1 = arr1.map(item => JSON.stringify(item)).sort();
  const sorted2 = arr2.map(item => JSON.stringify(item)).sort();

  return JSON.stringify(sorted1) === JSON.stringify(sorted2);
}

/**
 * Compare results from original and optimized engines
 */
function compareResults(original: any, optimized: any, testName: string): boolean {
  console.log(`\n=== Testing: ${testName} ===`);

  // Compare incompatible pairs
  const incompatibleMatch = deepCompareArrays(
    original.hazmatCompatibilityKeys,
    optimized.hazmatCompatibilityKeys
  );

  // Compare segregation pairs
  const segregationMatch = deepCompareArrays(
    original.segregatedHazmatMaterials,
    optimized.segregatedHazmatMaterials
  );

  console.log(`Incompatible pairs match: ${incompatibleMatch}`);
  console.log(`Segregation pairs match: ${segregationMatch}`);

  if (!incompatibleMatch) {
    console.log('Original incompatible pairs:', original.hazmatCompatibilityKeys.length);
    console.log('Optimized incompatible pairs:', optimized.hazmatCompatibilityKeys.length);
  }

  if (!segregationMatch) {
    console.log('Original segregation pairs:', original.segregatedHazmatMaterials.length);
    console.log('Optimized segregation pairs:', optimized.segregatedHazmatMaterials.length);
  }

  const success = incompatibleMatch && segregationMatch;
  console.log(`Overall result: ${success ? 'PASS' : 'FAIL'}`);

  return success;
}

/**
 * Performance comparison between engines
 */
async function performanceTest(
  testData: CheckCompatibleHazmatInput[],
  testName: string,
  iterations: number = 10
): Promise<void> {
  console.log(`\n=== Performance Test: ${testName} ===`);

  // Warm up
  await runGraphEngine(testData, rules, false);
  await runGraphEngineOptimized(testData, rules, false);

  // Test original engine
  const originalTimes: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await runGraphEngine(testData, rules, false);
    const end = performance.now();
    originalTimes.push(end - start);
  }

  // Clear cache and test optimized engine
  clearCache();
  const optimizedTimes: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await runGraphEngineOptimized(testData, rules, false);
    const end = performance.now();
    optimizedTimes.push(end - start);
  }

  const originalAvg = originalTimes.reduce((a, b) => a + b, 0) / originalTimes.length;
  const optimizedAvg = optimizedTimes.reduce((a, b) => a + b, 0) / optimizedTimes.length;
  const speedup = originalAvg / optimizedAvg;

  console.log(`Original average time: ${originalAvg.toFixed(2)}ms`);
  console.log(`Optimized average time: ${optimizedAvg.toFixed(2)}ms`);
  console.log(`Speedup: ${speedup.toFixed(2)}x`);

  const cacheStats = getCacheStats();
  console.log(`Cache entries: ${cacheStats.size}`);
}

/**
 * Run all tests
 */
async function runAllTests(): Promise<void> {
  console.log('Starting Engine Comparison Tests\n');

  let allTestsPassed = true;

  // Accuracy tests
  try {
    // Test 1: Basic mixed hazmat objects
    clearCache();
    const original1 = await runGraphEngine(testHazmatObjects, rules, false);
    const optimized1 = await runGraphEngineOptimized(testHazmatObjects, rules, false);
    const test1Pass = compareResults(original1, optimized1, 'Mixed Hazmat Objects');
    allTestsPassed = allTestsPassed && test1Pass;

    // Test 2: Class 1 explosives
    clearCache();
    const original2 = await runGraphEngine(class1TestObjects, rules, false);
    const optimized2 = await runGraphEngineOptimized(class1TestObjects, rules, false);
    const test2Pass = compareResults(original2, optimized2, 'Class 1 Explosives');
    allTestsPassed = allTestsPassed && test2Pass;

    // Test 3: Non-explosive hazmat
    clearCache();
    const original3 = await runGraphEngine(mixedHazmatObjects, rules, false);
    const optimized3 = await runGraphEngineOptimized(mixedHazmatObjects, rules, false);
    const test3Pass = compareResults(original3, optimized3, 'Non-Explosive Hazmat');
    allTestsPassed = allTestsPassed && test3Pass;

    // Test 4: Empty array
    clearCache();
    const original4 = await runGraphEngine([], rules, false);
    const optimized4 = await runGraphEngineOptimized([], rules, false);
    const test4Pass = compareResults(original4, optimized4, 'Empty Input');
    allTestsPassed = allTestsPassed && test4Pass;

    // Test 5: Single item
    clearCache();
    const original5 = await runGraphEngine([testHazmatObjects[0]], rules, false);
    const optimized5 = await runGraphEngineOptimized([testHazmatObjects[0]], rules, false);
    const test5Pass = compareResults(original5, optimized5, 'Single Item');
    allTestsPassed = allTestsPassed && test5Pass;

    // Test 6: Note 1 condition (UN2067 exception)
    clearCache();
    const original6 = await runGraphEngine(note1TestObjects, rules, false);
    const optimized6 = await runGraphEngineOptimized(note1TestObjects, rules, false);
    const test6Pass = compareResults(original6, optimized6, 'Note 1 Exception (UN2067)');
    allTestsPassed = allTestsPassed && test6Pass;

    // Additional verification for Note 1: ensure UN2067 + 1.1 and UN2067 + 1.5 are compatible
    console.log('\n=== Note 1 Verification ===');
    console.log(`Total incompatible pairs: ${optimized6.hazmatCompatibilityKeys.length}`);

    // Check that UN2067 pairs are NOT in the incompatible list
    const un2067Incompatible = optimized6.hazmatCompatibilityKeys.filter(pair =>
      pair[0].unid === 'UN2067' || pair[1].unid === 'UN2067'
    );

    console.log(`UN2067 incompatible pairs (should be 0): ${un2067Incompatible.length}`);
    console.log(`Expected: 1.1D + 1.5D incompatible pair only`);

    if (un2067Incompatible.length === 0 && optimized6.hazmatCompatibilityKeys.length === 1) {
      console.log('✅ Note 1 exception working correctly: UN2067 is compatible with Class 1.1 and 1.5');
    } else {
      console.log('❌ Note 1 exception NOT working correctly');
      allTestsPassed = false;
    }

    // Test 7: Note 4 condition (Cyanides incompatible with Class 8)
    clearCache();
    const original7 = await runGraphEngine(note4TestObjects, rules, false);
    const optimized7 = await runGraphEngineOptimized(note4TestObjects, rules, false);
    const test7Pass = compareResults(original7, optimized7, 'Note 4 Incompatibility (Cyanides)');
    allTestsPassed = allTestsPassed && test7Pass;

    // Additional verification for Note 4: ensure cyanide + Class 8 are incompatible
    console.log('\n=== Note 4 Verification ===');
    console.log(`Cyanide + Class 8 incompatible pairs (should be 1): ${optimized7.hazmatCompatibilityKeys.length}`);
    if (optimized7.hazmatCompatibilityKeys.length === 1) {
      console.log('✅ Note 4 condition working correctly: Cyanides are incompatible with Class 8');
    } else {
      console.log('❌ Note 4 condition NOT working: Cyanides should be incompatible with Class 8');
      allTestsPassed = false;
    }

    // Test 8: Note 5 condition (Nitric acid segregation from Class 8)
    clearCache();
    const original8 = await runGraphEngine(note5TestObjects, rules, false);
    const optimized8 = await runGraphEngineOptimized(note5TestObjects, rules, false);
    const test8Pass = compareResults(original8, optimized8, 'Note 5 Segregation (Nitric Acid)');
    allTestsPassed = allTestsPassed && test8Pass;

    // Additional verification for Note 5: ensure nitric acid + Class 8 requires segregation
    console.log('\n=== Note 5 Verification ===');
    console.log(`Nitric acid segregation pairs (should be 1): ${optimized8.segregatedHazmatMaterials.length}`);
    console.log(`Incompatible pairs (should be 0): ${optimized8.hazmatCompatibilityKeys.length}`);
    if (optimized8.segregatedHazmatMaterials.length === 1 && optimized8.hazmatCompatibilityKeys.length === 0) {
      console.log('✅ Note 5 condition working correctly: Nitric acid + Class 8 requires segregation');
    } else {
      console.log('❌ Note 5 condition NOT working: Nitric acid + Class 8 should require segregation only');
      allTestsPassed = false;
    }

  } catch (error) {
    console.error('Error during accuracy tests:', error);
    allTestsPassed = false;
  }

  // Performance tests
  try {
    await performanceTest(testHazmatObjects, 'Mixed Hazmat (5 items)', 10);
    await performanceTest(class1TestObjects, 'Class 1 Explosives (3 items)', 10);

    // Create larger test set for performance
    const largeTestSet = [...testHazmatObjects, ...class1TestObjects, ...mixedHazmatObjects];
    await performanceTest(largeTestSet, 'Large Set (13 items)', 5);

  } catch (error) {
    console.error('Error during performance tests:', error);
  }

  // Summary
  console.log('\n=== TEST SUMMARY ===');
  console.log(`All accuracy tests passed: ${allTestsPassed}`);

  if (allTestsPassed) {
    console.log('✅ The optimized engine produces identical results to the original.');
    console.log('✅ It is safe to use the optimized version.');
  } else {
    console.log('❌ Some tests failed. Review the differences before using the optimized version.');
  }
}

// Export for use in other test files
export {
  runAllTests,
  compareResults,
  performanceTest,
  testHazmatObjects,
  class1TestObjects,
  mixedHazmatObjects,
  note1TestObjects,
  note4TestObjects,
  note5TestObjects,
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}