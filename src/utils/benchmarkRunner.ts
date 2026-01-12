/**
 * Benchmark Runner for Inspector Database Operations
 *
 * Use this to capture baseline performance metrics before optimization.
 * Run via dev menu or test screen.
 *
 * @version 1.0
 * @date 2026-01-07
 */

import { perfTracker, PERFORMANCE_TRACKING_ENABLED } from './performanceUtils';

// Sample data generators
const generateSampleSDDGContent = () => ({
  shipper: 'ACME HAZMAT SUPPLY CO',
  consignee: 'DOD LOGISTICS CENTER',
  airWaybillNumber: '123-45678901',
  pagination: '1/1',
  shippersReferenceNumber: `TCN-${Date.now()}`,
  inspectionActivity: 'UNIT MOVEMENT',
  aircraftType: 'C-17',
  airportOfDeparture: 'KDOV',
  airportOfDestination: 'ETAR',
  shipmentType: 'CAO',
  unIdNo: 'UN1845',
  properShippingName: 'DRY ICE (CARBON DIOXIDE, SOLID)',
  hazardClass: '9',
  subsidiaryRisk: '',
  packingGroup: 'III',
  quantityAndPacking: '50 kg in 1 x fiber drum',
  packingInstruction: '954',
  authorization: 'SPECIAL PROVISION A48',
  additionalHandlingInfo: 'Keep frozen',
  nameOfSignatory: 'John Smith',
  placeAndDate: 'Dover AFB, 07 JAN 2026',
  signature: '[SIGNED]',
});

const generateSampleMLResults = () => ({
  bestPopMarking: {
    fields: {
      B: '4G/X25/S/22',
      C: 'USA',
      D: 'DOT',
      E: '50 kg',
      F: '',
      G: '',
      H: '',
    },
    confidence: 0.89,
    sourceImageIndex: 0,
    detectedType: 'UN_MARKING',
  },
  allDetectedLabels: [
    { label: 'CLASS_9_MISCELLANEOUS', confidence: 0.95, bbox: [10, 20, 100, 100] },
    { label: 'HANDLING_LABEL', confidence: 0.87, bbox: [50, 60, 80, 80] },
  ],
  allUnNumbers: ['UN1845'],
  allWeights: [{ value: 50, unit: 'kg' }],
  allHazardClasses: ['9'],
  countryOfOrigin: 'USA',
  allEXNumbers: [],
  allPSNs: ['DRY ICE'],
  allUnWithPSN: [{ un: 'UN1845', psn: 'DRY ICE' }],
  rawPopMarkingText: '4G/X25/S/22 USA DOT',
  mslDetected: false,
  mslConfidence: null,
  mslMatchedPatterns: [],
  imagesProcessed: 3,
  totalProcessingTime: 2500,
  perImageResults: [
    { imageIndex: 0, processingTime: 800, detections: 5 },
    { imageIndex: 1, processingTime: 900, detections: 3 },
    { imageIndex: 2, processingTime: 800, detections: 2 },
  ],
});

const generateSampleFrustration = (index: number) => ({
  id: `frust-${Date.now()}-${index}`,
  key: `field_${index}`,
  fieldLabel: `Test Field ${index}`,
  fieldValue: 'Incorrect Value',
  correctValue: 'Correct Value',
  frustrationDate: new Date(),
  defaultMessage: `Field ${index} has incorrect value`,
  additionalComments: 'Test frustration for benchmarking',
  inspector: {
    inspectorName: 'Test Inspector',
    inspectorRank: 'TSgt',
    inspectorTitle: 'Hazmat Inspector',
  },
  reinspectionHistory: [],
});

const generateSamplePackageFrustration = (index: number) => ({
  id: `pkg-frust-${Date.now()}-${index}`,
  category: 'marking' as const,
  itemId: `item_${index}`,
  itemLabel: `Package Item ${index}`,
  expectedValues: ['Value A', 'Value B'],
  verificationStatus: 'missing' as const,
  frustrationDate: new Date(),
  defaultMessage: `Package item ${index} is missing`,
  additionalComments: 'Test package frustration',
  afmanReference: 'AFMAN 24-604, 5.2.1',
  inspector: {
    inspectorName: 'Test Inspector',
    inspectorRank: 'TSgt',
    inspectorTitle: 'Hazmat Inspector',
  },
  reinspectionHistory: [],
});

/**
 * Generate a complete sample inspection for benchmarking
 */
export const generateSampleInspection = (options: {
  includeFrustrations?: number;
  includePackageFrustrations?: number;
  includeMLResults?: boolean;
} = {}) => {
  const {
    includeFrustrations = 0,
    includePackageFrustrations = 0,
    includeMLResults = true,
  } = options;

  const sddgContent = generateSampleSDDGContent();
  const frustrations = Array.from({ length: includeFrustrations }, (_, i) =>
    generateSampleFrustration(i)
  );
  const packageFrustrations = Array.from(
    { length: includePackageFrustrations },
    (_, i) => generateSamplePackageFrustration(i)
  );

  return {
    id: `bench-${Date.now()}`,
    status: frustrations.length + packageFrustrations.length > 0 ? 'frustrated' : 'completed',
    inspectedAt: new Date(),
    tcn: sddgContent.shippersReferenceNumber,
    unId: sddgContent.unIdNo,
    properShippingName: sddgContent.properShippingName,
    inspector: {
      inspectorName: 'Benchmark Inspector',
      inspectorRank: 'SSgt',
      inspectorTitle: 'Hazmat Inspector',
    },
    sddgStatus: frustrations.length > 0 ? 'frustrated' : 'verified',
    packageStatus: packageFrustrations.length > 0 ? 'frustrated' : 'verified',
    totalFrustrations: frustrations.length + packageFrustrations.length,
    sddgFrustrations: frustrations.length,
    packageFrustrations: packageFrustrations.length,
    inspectionContext: {
      extractedContent: sddgContent,
      verificationCopy: sddgContent,
      originalImageUri: 'file://test/sddg-image.jpg',
      frustrations,
      packageFrustrations,
      resolvedFrustrations: [],
      resolvedPackageFrustrations: [],
      inspector: {
        inspectorName: 'Benchmark Inspector',
        inspectorRank: 'SSgt',
        inspectorTitle: 'Hazmat Inspector',
      },
      inspectionStartTime: new Date(Date.now() - 600000), // 10 min ago
      inspectionCompleteTime: new Date(),
      mlAnalysisResults: includeMLResults ? generateSampleMLResults() : null,
      packagePopMarking: {
        B: '4G/X25/S/22',
        C: 'USA',
        D: 'DOT',
        E: '50 kg',
        F: '',
        G: '',
        H: '',
      },
      magnetizedMaterialInspection: null,
      innerPackagingInspection: null,
    },
  };
};

/**
 * Estimate the size of an object in bytes (rough approximation)
 */
export const estimateObjectSize = (obj: unknown): number => {
  return JSON.stringify(obj).length;
};

/**
 * Benchmark result interface
 */
export interface BenchmarkResult {
  operation: string;
  iterations: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
  totalTime: number;
  avgDataSize: number;
  timestamp: Date;
}

/**
 * Run a single benchmark operation
 */
export const runBenchmark = async <T>(
  name: string,
  operation: () => Promise<T>,
  iterations: number = 5
): Promise<BenchmarkResult> => {
  const times: number[] = [];
  const sizes: number[] = [];

  console.log(`\n🏃 Running benchmark: ${name} (${iterations} iterations)`);

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const result = await operation();
    const duration = performance.now() - start;
    times.push(duration);

    if (result !== null && result !== undefined) {
      sizes.push(estimateObjectSize(result));
    }

    console.log(`  Iteration ${i + 1}: ${duration.toFixed(2)}ms`);
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const totalTime = times.reduce((a, b) => a + b, 0);
  const avgDataSize = sizes.length > 0
    ? sizes.reduce((a, b) => a + b, 0) / sizes.length
    : 0;

  const result: BenchmarkResult = {
    operation: name,
    iterations,
    avgTime,
    minTime,
    maxTime,
    totalTime,
    avgDataSize,
    timestamp: new Date(),
  };

  console.log(`📊 ${name} Results:`);
  console.log(`   Avg: ${avgTime.toFixed(2)}ms`);
  console.log(`   Min: ${minTime.toFixed(2)}ms`);
  console.log(`   Max: ${maxTime.toFixed(2)}ms`);
  if (avgDataSize > 0) {
    console.log(`   Avg data size: ${(avgDataSize / 1024).toFixed(2)}KB`);
  }

  return result;
};

/**
 * Full benchmark suite runner
 * Requires database context to be available
 */
export interface BenchmarkSuite {
  saveInspection: (inspection: any) => Promise<string>;
  loadInspection: (id: string) => Promise<any>;
  updateInspection: (id: string, updates: any) => Promise<void>;
  listInspections: (filters?: any) => Promise<any[]>;
  deleteInspection: (id: string) => Promise<void>;
}

export const runFullBenchmarkSuite = async (
  database: BenchmarkSuite,
  options: {
    iterations?: number;
    cleanupAfter?: boolean;
  } = {}
): Promise<BenchmarkResult[]> => {
  const { iterations = 5, cleanupAfter = true } = options;
  const results: BenchmarkResult[] = [];
  const createdIds: string[] = [];

  console.log('\n========================================');
  console.log('🚀 STARTING FULL BENCHMARK SUITE');
  console.log('========================================');
  console.log(`Iterations per operation: ${iterations}`);
  console.log(`Performance tracking: ${PERFORMANCE_TRACKING_ENABLED ? 'ENABLED' : 'DISABLED'}`);

  try {
    // 1. Save inspection (minimal)
    results.push(await runBenchmark(
      'saveInspection (minimal)',
      async () => {
        const inspection = generateSampleInspection({
          includeMLResults: false,
        });
        const id = await database.saveInspection(inspection);
        createdIds.push(id);
        return id;
      },
      iterations
    ));

    // 2. Save inspection (with ML results)
    results.push(await runBenchmark(
      'saveInspection (with ML)',
      async () => {
        const inspection = generateSampleInspection({
          includeMLResults: true,
        });
        const id = await database.saveInspection(inspection);
        createdIds.push(id);
        return id;
      },
      iterations
    ));

    // 3. Save inspection (with frustrations)
    results.push(await runBenchmark(
      'saveInspection (with frustrations)',
      async () => {
        const inspection = generateSampleInspection({
          includeFrustrations: 3,
          includePackageFrustrations: 2,
          includeMLResults: true,
        });
        const id = await database.saveInspection(inspection);
        createdIds.push(id);
        return id;
      },
      iterations
    ));

    // 4. Load inspection
    if (createdIds.length > 0) {
      const loadId = createdIds[0];
      results.push(await runBenchmark(
        'loadInspection',
        async () => database.loadInspection(loadId),
        iterations
      ));
    }

    // 5. Update inspection (status only)
    if (createdIds.length > 0) {
      const updateId = createdIds[1] || createdIds[0];
      results.push(await runBenchmark(
        'updateInspection (status only)',
        async () => database.updateInspection(updateId, { status: 'completed' }),
        iterations
      ));
    }

    // 6. List inspections (all)
    results.push(await runBenchmark(
      'listInspections (all)',
      async () => database.listInspections(),
      iterations
    ));

    // 7. List inspections (filtered)
    results.push(await runBenchmark(
      'listInspections (filtered)',
      async () => database.listInspections({ status: 'completed' }),
      iterations
    ));

    // Print summary
    console.log('\n========================================');
    console.log('📊 BENCHMARK SUMMARY');
    console.log('========================================');
    console.log('\n| Operation | Avg (ms) | Min (ms) | Max (ms) | Data Size |');
    console.log('|-----------|----------|----------|----------|-----------|');
    results.forEach(r => {
      const sizeStr = r.avgDataSize > 0 ? `${(r.avgDataSize / 1024).toFixed(1)}KB` : 'N/A';
      console.log(
        `| ${r.operation.padEnd(35)} | ${r.avgTime.toFixed(1).padStart(8)} | ${r.minTime.toFixed(1).padStart(8)} | ${r.maxTime.toFixed(1).padStart(8)} | ${sizeStr.padStart(9)} |`
      );
    });
    console.log('');

    // Print performance tracker report if enabled
    if (PERFORMANCE_TRACKING_ENABLED) {
      perfTracker.printReport();
    }

  } finally {
    // Cleanup created inspections
    if (cleanupAfter && createdIds.length > 0) {
      console.log(`\n🧹 Cleaning up ${createdIds.length} benchmark inspections...`);
      for (const id of createdIds) {
        try {
          await database.deleteInspection(id);
        } catch (e) {
          console.warn(`Failed to delete ${id}:`, e);
        }
      }
      console.log('✅ Cleanup complete');
    }
  }

  return results;
};

/**
 * Export benchmark results as JSON for comparison
 */
export const exportBenchmarkResults = (results: BenchmarkResult[]): string => {
  return JSON.stringify({
    runAt: new Date().toISOString(),
    platform: 'React Native / Expo',
    performanceTrackingEnabled: PERFORMANCE_TRACKING_ENABLED,
    results,
  }, null, 2);
};
