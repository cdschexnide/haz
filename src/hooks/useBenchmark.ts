/**
 * useBenchmark Hook
 *
 * Provides easy access to run performance benchmarks from any component.
 * Use this during development to capture baseline metrics.
 *
 * @version 1.0
 * @date 2026-01-07
 *
 * Usage:
 * ```tsx
 * const { runBenchmarks, isRunning, results, error } = useBenchmark();
 *
 * // Run full benchmark suite
 * await runBenchmarks();
 *
 * // Or run specific benchmark
 * await runBenchmarks({ operations: ['save', 'load'] });
 * ```
 */

import { useState, useCallback } from 'react';
import { useDatabase } from '@/contexts/DataProvider';
import {
  runFullBenchmarkSuite,
  BenchmarkResult,
  exportBenchmarkResults,
} from '@/utils/benchmarkRunner';
import { perfTracker } from '@/utils/performanceUtils';

export interface UseBenchmarkOptions {
  iterations?: number;
  cleanupAfter?: boolean;
}

export interface UseBenchmarkReturn {
  runBenchmarks: (options?: UseBenchmarkOptions) => Promise<BenchmarkResult[]>;
  isRunning: boolean;
  results: BenchmarkResult[] | null;
  error: string | null;
  exportResults: () => string | null;
  clearResults: () => void;
  printReport: () => void;
}

export const useBenchmark = (): UseBenchmarkReturn => {
  const database = useDatabase();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BenchmarkResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runBenchmarks = useCallback(async (options?: UseBenchmarkOptions): Promise<BenchmarkResult[]> => {
    if (!database.isInitialized) {
      const err = 'Database not initialized';
      setError(err);
      throw new Error(err);
    }

    setIsRunning(true);
    setError(null);
    setResults(null);

    // Clear previous metrics
    perfTracker.clear();

    try {
      console.log('🚀 Starting benchmark suite...');

      const benchmarkResults = await runFullBenchmarkSuite(
        {
          saveInspection: database.saveInspection,
          loadInspection: database.loadInspection,
          updateInspection: database.updateInspection,
          listInspections: database.listInspections,
          deleteInspection: database.deleteInspection,
        },
        {
          iterations: options?.iterations ?? 5,
          cleanupAfter: options?.cleanupAfter ?? true,
        }
      );

      setResults(benchmarkResults);
      console.log('✅ Benchmark suite complete');

      return benchmarkResults;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error during benchmark';
      console.error('❌ Benchmark failed:', errorMessage);
      setError(errorMessage);
      throw e;
    } finally {
      setIsRunning(false);
    }
  }, [database]);

  const exportResults = useCallback((): string | null => {
    if (!results) return null;
    return exportBenchmarkResults(results);
  }, [results]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    perfTracker.clear();
  }, []);

  const printReport = useCallback(() => {
    perfTracker.printReport();
  }, []);

  return {
    runBenchmarks,
    isRunning,
    results,
    error,
    exportResults,
    clearResults,
    printReport,
  };
};

export default useBenchmark;
