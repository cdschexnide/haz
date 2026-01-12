# Performance Benchmark Guide

**Version:** 1.0
**Date:** 2026-01-07
**Purpose:** Capture baseline performance metrics before SQLite optimization

---

## Overview

This guide explains how to run performance benchmarks to capture baseline metrics for the inspector database operations. These metrics will be used to:

1. Establish baseline performance before optimization
2. Validate performance improvements after optimization
3. Identify bottlenecks and hotspots

---

## Quick Start

### From React Component

```tsx
import { useBenchmark } from '@/hooks/useBenchmark';

function BenchmarkScreen() {
  const { runBenchmarks, isRunning, results, error, exportResults } = useBenchmark();

  const handleRun = async () => {
    try {
      const results = await runBenchmarks({ iterations: 5 });
      console.log('Benchmark complete:', results);

      // Export results as JSON
      const json = exportResults();
      console.log(json);
    } catch (e) {
      console.error('Benchmark failed:', e);
    }
  };

  return (
    <View>
      <Button title="Run Benchmarks" onPress={handleRun} disabled={isRunning} />
      {isRunning && <Text>Running benchmarks...</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      {results && (
        <View>
          {results.map(r => (
            <Text key={r.operation}>
              {r.operation}: {r.avgTime.toFixed(2)}ms avg
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
```

### From Console (Dev Only)

```typescript
import { runFullBenchmarkSuite, generateSampleInspection } from '@/utils/benchmarkRunner';
import { perfTracker } from '@/utils/performanceUtils';

// Assuming you have database context
const results = await runFullBenchmarkSuite(database, {
  iterations: 10,
  cleanupAfter: true,
});

// Print detailed performance report
perfTracker.printReport();
```

---

## Benchmark Operations

The full suite tests these operations:

| Operation | Description | Measures |
|-----------|-------------|----------|
| `saveInspection (minimal)` | Save inspection without ML results | Base save cost |
| `saveInspection (with ML)` | Save with full ML analysis | JSON stringify overhead |
| `saveInspection (with frustrations)` | Save with SDDG + package frustrations | Complex nested data |
| `loadInspection` | Load single inspection by ID | SQLite read + JSON parse |
| `updateInspection (status only)` | Update just status field | Current update cost |
| `listInspections (all)` | List all inspections | Query + row mapping |
| `listInspections (filtered)` | List with status filter | Filtered query cost |

---

## Understanding Results

### Console Output

```
========================================
📊 BENCHMARK SUMMARY
========================================

| Operation                           | Avg (ms) | Min (ms) | Max (ms) | Data Size |
|-------------------------------------|----------|----------|----------|-----------|
| saveInspection (minimal)            |    12.5  |    10.2  |    15.8  |    8.5KB  |
| saveInspection (with ML)            |    18.3  |    15.1  |    22.6  |   18.2KB  |
| loadInspection                      |     8.7  |     6.9  |    11.2  |   18.2KB  |
| updateInspection (status only)      |    25.4  |    21.3  |    30.1  |   18.2KB  |
| listInspections (all)               |    45.2  |    38.5  |    52.8  |      N/A  |
```

### Performance Tracker Report

```
========================================
📊 PERFORMANCE REPORT
========================================
Tracking duration: 45.2s
Total operations: 35
Total time: 423.5ms
Total data: 245.8 KB

--- Operation Statistics ---

saveInspection:
  Count: 15
  Avg time: 15.32ms
  Min/Max: 10.2ms / 22.6ms
  Avg data: 14.2 KB

loadInspection:
  Count: 5
  Avg time: 8.7ms
  Min/Max: 6.9ms / 11.2ms
  Avg data: 18.2 KB

⚠️ BOTTLENECKS DETECTED:
  - updateInspection (avg: 25.4ms, 18.2 KB)
```

---

## Sub-Metrics Breakdown

Each operation tracks sub-metrics:

### saveInspection
- `JSON.stringify` - Time to serialize inspection context
- `SQLite.write` - Time to write to database

### loadInspection
- `SQLite.read` - Time to query database
- `JSON.parse+dates` - Time to parse JSON and reconstruct dates

### updateInspection
- `load-existing` - Time to load current inspection
- `merge-updates` - Time to merge update object
- `save-merged` - Time to save merged inspection

### listInspections
- `SQLite.query` - Time to execute query
- `row-mapping` - Time to map rows to objects

---

## Enabling Performance Tracking

Performance tracking is controlled by the `PERFORMANCE_TRACKING_ENABLED` flag in `performanceUtils.ts`:

```typescript
// src/utils/performanceUtils.ts
export const PERFORMANCE_TRACKING_ENABLED = __DEV__ || false;
```

- In development (`__DEV__`): Automatically enabled
- In production: Disabled by default

To enable in production for testing:
```typescript
export const PERFORMANCE_TRACKING_ENABLED = true;
```

**⚠️ Remember to disable before release!**

---

## Capturing Baseline Metrics

### Before Optimization

1. Run the app on a device (not simulator) for accurate measurements
2. Ensure database has representative data (10-50 inspections)
3. Run benchmark suite 3 times
4. Export and save results with timestamp:

```typescript
const json = exportResults();
// Save as: baseline-metrics-2026-01-07.json
```

### After Each Optimization Phase

1. Run same benchmark suite
2. Compare results to baseline
3. Document improvements:

```markdown
## Phase X Results

| Operation | Baseline | After | Improvement |
|-----------|----------|-------|-------------|
| listInspections | 45.2ms | 12.5ms | 72% faster |
```

---

## Sample Data Generator

Generate realistic test data:

```typescript
import { generateSampleInspection } from '@/utils/benchmarkRunner';

// Minimal inspection
const minimal = generateSampleInspection({ includeMLResults: false });

// Full inspection with ML
const full = generateSampleInspection({ includeMLResults: true });

// Inspection with frustrations
const frustrated = generateSampleInspection({
  includeFrustrations: 3,
  includePackageFrustrations: 2,
  includeMLResults: true,
});

// Size estimation
console.log('Size:', JSON.stringify(full).length, 'bytes');
```

---

## Target Metrics (Post-Optimization)

Based on the optimization proposal, expected improvements:

| Operation | Current | Target | Expected Improvement |
|-----------|---------|--------|---------------------|
| listInspections (20) | ~45ms | ~1ms | 45x faster |
| loadInspection | ~8ms | ~5ms | 1.6x faster |
| updateInspection (status) | ~25ms | ~0.1ms | 250x faster |
| saveInspection | ~15ms | ~12ms | Similar (write is minimal) |

---

## Troubleshooting

### "Database not initialized"
Ensure you're running benchmarks after the DataProvider has initialized:
```tsx
const { isInitialized } = useDatabase();
if (!isInitialized) return <Text>Loading...</Text>;
```

### No performance logs appearing
Check that `PERFORMANCE_TRACKING_ENABLED` is `true` in development.

### Results vary wildly
- Run on physical device, not simulator
- Close other apps
- Run multiple iterations (10+)
- Discard first run (warm-up)

---

## File Locations

- **Performance Tracker:** `src/utils/performanceUtils.ts`
- **Benchmark Runner:** `src/utils/benchmarkRunner.ts`
- **useBenchmark Hook:** `src/hooks/useBenchmark.ts`
- **Instrumented Files:**
  - `src/contexts/DataProvider/DataProvider.tsx`
  - `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`

---

*Generated by Claude Code - Performance Optimization Phase 1*
