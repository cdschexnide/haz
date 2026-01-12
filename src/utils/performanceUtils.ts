/**
 * Performance Tracking Utilities
 *
 * Used to measure database operation performance for optimization analysis.
 * Enable via PERFORMANCE_TRACKING_ENABLED flag.
 *
 * @version 1.0
 * @date 2026-01-07
 */

// Feature flag - enable during performance analysis
export const PERFORMANCE_TRACKING_ENABLED = __DEV__ || false;

/**
 * Individual performance metric
 */
export interface PerformanceMetric {
  id: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  dataSize?: number;
  metadata?: Record<string, unknown>;
  subMetrics?: PerformanceMetric[];
}

/**
 * Summary statistics for an operation type
 */
export interface OperationStats {
  operation: string;
  count: number;
  totalTime: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
  totalDataSize: number;
  avgDataSize: number;
}

/**
 * Performance report
 */
export interface PerformanceReport {
  generatedAt: Date;
  trackingDuration: number;
  operationStats: OperationStats[];
  rawMetrics: PerformanceMetric[];
  summary: {
    totalOperations: number;
    totalTime: number;
    totalDataSize: number;
    bottlenecks: string[];
  };
}

/**
 * Performance Tracker Singleton
 * Tracks timing and data size for database operations
 */
class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: PerformanceMetric[] = [];
  private activeMetrics: Map<string, PerformanceMetric> = new Map();
  private trackingStartTime: number = Date.now();
  private maxMetrics: number = 1000; // Prevent memory bloat

  private constructor() {}

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  /**
   * Start timing an operation
   * @param operation - Name of the operation (e.g., 'loadInspection', 'saveInspection')
   * @param metadata - Optional metadata about the operation
   * @returns Unique ID for this timing session
   */
  start(operation: string, metadata?: Record<string, unknown>): string {
    if (!PERFORMANCE_TRACKING_ENABLED) return '';

    const id = `${operation}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetric = {
      id,
      operation,
      startTime: performance.now(),
      metadata,
      subMetrics: [],
    };

    this.activeMetrics.set(id, metric);
    return id;
  }

  /**
   * Record a sub-metric within an active operation
   * @param parentId - ID of the parent operation
   * @param subOperation - Name of the sub-operation
   * @param duration - Duration in milliseconds
   * @param dataSize - Optional data size in bytes
   */
  recordSubMetric(
    parentId: string,
    subOperation: string,
    duration: number,
    dataSize?: number
  ): void {
    if (!PERFORMANCE_TRACKING_ENABLED) return;

    const parent = this.activeMetrics.get(parentId);
    if (parent) {
      parent.subMetrics?.push({
        id: `${parentId}-${subOperation}`,
        operation: subOperation,
        startTime: 0,
        duration,
        dataSize,
      });
    }
  }

  /**
   * End timing an operation
   * @param id - ID returned from start()
   * @param dataSize - Optional size of data processed in bytes
   * @returns Duration in milliseconds
   */
  end(id: string, dataSize?: number): number {
    if (!PERFORMANCE_TRACKING_ENABLED || !id) return 0;

    const metric = this.activeMetrics.get(id);
    if (!metric) {
      console.warn(`[PerfTracker] No active metric found for id: ${id}`);
      return 0;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    metric.dataSize = dataSize;

    this.activeMetrics.delete(id);

    // Add to completed metrics
    if (this.metrics.length >= this.maxMetrics) {
      this.metrics.shift(); // Remove oldest
    }
    this.metrics.push(metric);

    // Log to console in development
    this.logMetric(metric);

    return metric.duration;
  }

  /**
   * Log a metric to the console
   */
  private logMetric(metric: PerformanceMetric): void {
    const dataSizeStr = metric.dataSize
      ? ` | ${this.formatBytes(metric.dataSize)}`
      : '';
    const subMetricsStr = metric.subMetrics?.length
      ? ` | Sub: ${metric.subMetrics.map(s => `${s.operation}=${s.duration?.toFixed(1)}ms`).join(', ')}`
      : '';

    console.log(
      `⏱️ [PERF] ${metric.operation}: ${metric.duration?.toFixed(2)}ms${dataSizeStr}${subMetricsStr}`
    );
  }

  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get metrics for a specific operation
   */
  getMetricsForOperation(operation: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.operation === operation);
  }

  /**
   * Calculate statistics for an operation type
   */
  getStatsForOperation(operation: string): OperationStats | null {
    const opMetrics = this.getMetricsForOperation(operation);
    if (opMetrics.length === 0) return null;

    const durations = opMetrics.map(m => m.duration || 0);
    const dataSizes = opMetrics.map(m => m.dataSize || 0);

    return {
      operation,
      count: opMetrics.length,
      totalTime: durations.reduce((a, b) => a + b, 0),
      avgTime: durations.reduce((a, b) => a + b, 0) / durations.length,
      minTime: Math.min(...durations),
      maxTime: Math.max(...durations),
      totalDataSize: dataSizes.reduce((a, b) => a + b, 0),
      avgDataSize: dataSizes.reduce((a, b) => a + b, 0) / dataSizes.length,
    };
  }

  /**
   * Generate a complete performance report
   */
  generateReport(): PerformanceReport {
    const operations = Array.from(new Set(this.metrics.map(m => m.operation)));
    const operationStats = operations
      .map(op => this.getStatsForOperation(op))
      .filter((s): s is OperationStats => s !== null);

    // Identify bottlenecks (operations with avg time > 100ms or >10KB avg data)
    const bottlenecks = operationStats
      .filter(s => s.avgTime > 100 || s.avgDataSize > 10 * 1024)
      .map(s => `${s.operation} (avg: ${s.avgTime.toFixed(1)}ms, ${this.formatBytes(s.avgDataSize)})`);

    return {
      generatedAt: new Date(),
      trackingDuration: Date.now() - this.trackingStartTime,
      operationStats,
      rawMetrics: this.metrics,
      summary: {
        totalOperations: this.metrics.length,
        totalTime: this.metrics.reduce((sum, m) => sum + (m.duration || 0), 0),
        totalDataSize: this.metrics.reduce((sum, m) => sum + (m.dataSize || 0), 0),
        bottlenecks,
      },
    };
  }

  /**
   * Print a summary report to console
   */
  printReport(): void {
    const report = this.generateReport();

    console.log('\n========================================');
    console.log('📊 PERFORMANCE REPORT');
    console.log('========================================');
    console.log(`Tracking duration: ${(report.trackingDuration / 1000).toFixed(1)}s`);
    console.log(`Total operations: ${report.summary.totalOperations}`);
    console.log(`Total time: ${report.summary.totalTime.toFixed(1)}ms`);
    console.log(`Total data: ${this.formatBytes(report.summary.totalDataSize)}`);
    console.log('\n--- Operation Statistics ---');

    report.operationStats.forEach(stat => {
      console.log(`\n${stat.operation}:`);
      console.log(`  Count: ${stat.count}`);
      console.log(`  Avg time: ${stat.avgTime.toFixed(2)}ms`);
      console.log(`  Min/Max: ${stat.minTime.toFixed(1)}ms / ${stat.maxTime.toFixed(1)}ms`);
      console.log(`  Avg data: ${this.formatBytes(stat.avgDataSize)}`);
    });

    if (report.summary.bottlenecks.length > 0) {
      console.log('\n⚠️ BOTTLENECKS DETECTED:');
      report.summary.bottlenecks.forEach(b => console.log(`  - ${b}`));
    }

    console.log('\n========================================\n');
  }

  /**
   * Export report as JSON
   */
  exportReportJSON(): string {
    return JSON.stringify(this.generateReport(), null, 2);
  }

  /**
   * Clear all recorded metrics
   */
  clear(): void {
    this.metrics = [];
    this.activeMetrics.clear();
    this.trackingStartTime = Date.now();
    console.log('⏱️ [PerfTracker] Metrics cleared');
  }

  /**
   * Reset tracking start time (for fresh benchmarks)
   */
  resetTimer(): void {
    this.trackingStartTime = Date.now();
  }
}

// Export singleton instance
export const perfTracker = PerformanceTracker.getInstance();

/**
 * Decorator/wrapper for async functions with performance tracking
 */
export function withPerformanceTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  operation: string,
  fn: T,
  getDataSize?: (result: Awaited<ReturnType<T>>) => number
): T {
  return (async (...args: Parameters<T>) => {
    const perfId = perfTracker.start(operation, { args: args.length });
    try {
      const result = await fn(...args);
      const dataSize = getDataSize ? getDataSize(result as Awaited<ReturnType<T>>) : undefined;
      perfTracker.end(perfId, dataSize);
      return result;
    } catch (error) {
      perfTracker.end(perfId, 0);
      throw error;
    }
  }) as T;
}

/**
 * Measure JSON serialization time
 */
export function measureJSONStringify(data: unknown, label?: string): { json: string; time: number; size: number } {
  const start = performance.now();
  const json = JSON.stringify(data);
  const time = performance.now() - start;
  const size = json.length;

  if (PERFORMANCE_TRACKING_ENABLED) {
    console.log(`⏱️ [JSON.stringify] ${label || 'data'}: ${time.toFixed(2)}ms | ${perfTracker['formatBytes'](size)}`);
  }

  return { json, time, size };
}

/**
 * Measure JSON parsing time
 */
export function measureJSONParse<T>(json: string, label?: string): { data: T; time: number; size: number } {
  const start = performance.now();
  const data = JSON.parse(json) as T;
  const time = performance.now() - start;
  const size = json.length;

  if (PERFORMANCE_TRACKING_ENABLED) {
    console.log(`⏱️ [JSON.parse] ${label || 'data'}: ${time.toFixed(2)}ms | ${perfTracker['formatBytes'](size)}`);
  }

  return { data, time, size };
}

/**
 * Benchmark utilities for manual testing
 */
export const benchmark = {
  /**
   * Run a function multiple times and report stats
   */
  async run<T>(
    name: string,
    fn: () => Promise<T>,
    iterations: number = 10
  ): Promise<{ avg: number; min: number; max: number; results: T[] }> {
    const times: number[] = [];
    const results: T[] = [];

    console.log(`\n🏃 Running benchmark: ${name} (${iterations} iterations)`);

    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      const result = await fn();
      const duration = performance.now() - start;
      times.push(duration);
      results.push(result);
      console.log(`  Iteration ${i + 1}: ${duration.toFixed(2)}ms`);
    }

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    console.log(`📊 ${name} Results:`);
    console.log(`   Avg: ${avg.toFixed(2)}ms`);
    console.log(`   Min: ${min.toFixed(2)}ms`);
    console.log(`   Max: ${max.toFixed(2)}ms`);

    return { avg, min, max, results };
  },

  /**
   * Compare two implementations
   */
  async compare<T>(
    name: string,
    fnA: () => Promise<T>,
    fnB: () => Promise<T>,
    iterations: number = 10
  ): Promise<void> {
    console.log(`\n⚖️ Comparing: ${name}`);

    const resultA = await this.run(`${name} - A`, fnA, iterations);
    const resultB = await this.run(`${name} - B`, fnB, iterations);

    const improvement = ((resultA.avg - resultB.avg) / resultA.avg) * 100;

    console.log(`\n📈 Comparison Result:`);
    if (improvement > 0) {
      console.log(`   B is ${improvement.toFixed(1)}% faster than A`);
    } else {
      console.log(`   A is ${(-improvement).toFixed(1)}% faster than B`);
    }
  },
};

/**
 * Render tracking for React components
 */
interface RenderRecord {
  component: string;
  timestamp: number;
  reason?: string;
  renderTime?: number;
}

class RenderTracker {
  private static instance: RenderTracker;
  private renders: RenderRecord[] = [];
  private maxRecords: number = 500;
  private componentCounts: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): RenderTracker {
    if (!RenderTracker.instance) {
      RenderTracker.instance = new RenderTracker();
    }
    return RenderTracker.instance;
  }

  /**
   * Record a component render
   */
  recordRender(component: string, reason?: string, renderTime?: number): void {
    if (!PERFORMANCE_TRACKING_ENABLED) return;

    const record: RenderRecord = {
      component,
      timestamp: Date.now(),
      reason,
      renderTime,
    };

    if (this.renders.length >= this.maxRecords) {
      this.renders.shift();
    }
    this.renders.push(record);

    // Update count
    const count = (this.componentCounts.get(component) || 0) + 1;
    this.componentCounts.set(component, count);

    // Log excessive renders (>10 in tracking session)
    if (count > 10 && count % 5 === 0) {
      console.warn(`🔄 [RenderTracker] ${component} has rendered ${count} times!`);
    }
  }

  /**
   * Get render counts per component
   */
  getRenderCounts(): Record<string, number> {
    return Object.fromEntries(this.componentCounts);
  }

  /**
   * Get components with excessive renders (>10)
   */
  getExcessiveRenders(): { component: string; count: number }[] {
    return Array.from(this.componentCounts.entries())
      .filter(([_, count]) => count > 10)
      .map(([component, count]) => ({ component, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Print render report
   */
  printReport(): void {
    console.log('\n========================================');
    console.log('🔄 RENDER TRACKING REPORT');
    console.log('========================================');

    const sorted = Array.from(this.componentCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      console.log('No renders tracked yet.');
      return;
    }

    console.log('\nRenders by component:');
    sorted.forEach(([component, count]) => {
      const warning = count > 10 ? ' ⚠️' : '';
      console.log(`  ${component}: ${count}${warning}`);
    });

    const excessive = this.getExcessiveRenders();
    if (excessive.length > 0) {
      console.log('\n⚠️ EXCESSIVE RENDERS (>10):');
      excessive.forEach(({ component, count }) => {
        console.log(`  - ${component}: ${count} renders`);
      });
    }

    console.log('\n========================================\n');
  }

  /**
   * Clear all records
   */
  clear(): void {
    this.renders = [];
    this.componentCounts.clear();
    console.log('🔄 [RenderTracker] Records cleared');
  }
}

export const renderTracker = RenderTracker.getInstance();

/**
 * Store update tracking for Valtio
 */
interface StoreUpdateRecord {
  store: string;
  path: string;
  timestamp: number;
  valueSize?: number;
}

class StoreUpdateTracker {
  private static instance: StoreUpdateTracker;
  private updates: StoreUpdateRecord[] = [];
  private maxRecords: number = 500;
  private pathCounts: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): StoreUpdateTracker {
    if (!StoreUpdateTracker.instance) {
      StoreUpdateTracker.instance = new StoreUpdateTracker();
    }
    return StoreUpdateTracker.instance;
  }

  /**
   * Record a store update
   */
  recordUpdate(store: string, path: string, valueSize?: number): void {
    if (!PERFORMANCE_TRACKING_ENABLED) return;

    const record: StoreUpdateRecord = {
      store,
      path,
      timestamp: Date.now(),
      valueSize,
    };

    if (this.updates.length >= this.maxRecords) {
      this.updates.shift();
    }
    this.updates.push(record);

    // Update count
    const key = `${store}.${path}`;
    const count = (this.pathCounts.get(key) || 0) + 1;
    this.pathCounts.set(key, count);

    // Log frequent updates
    if (count > 20 && count % 10 === 0) {
      console.warn(`📝 [StoreTracker] ${key} has been updated ${count} times!`);
    }
  }

  /**
   * Get update counts per path
   */
  getUpdateCounts(): Record<string, number> {
    return Object.fromEntries(this.pathCounts);
  }

  /**
   * Get paths with frequent updates (>20)
   */
  getFrequentUpdates(): { path: string; count: number }[] {
    return Array.from(this.pathCounts.entries())
      .filter(([_, count]) => count > 20)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Print store update report
   */
  printReport(): void {
    console.log('\n========================================');
    console.log('📝 STORE UPDATE REPORT');
    console.log('========================================');

    const sorted = Array.from(this.pathCounts.entries())
      .sort((a, b) => b[1] - a[1]);

    if (sorted.length === 0) {
      console.log('No store updates tracked yet.');
      return;
    }

    console.log('\nUpdates by path:');
    sorted.slice(0, 20).forEach(([path, count]) => {
      const warning = count > 20 ? ' ⚠️' : '';
      console.log(`  ${path}: ${count}${warning}`);
    });

    if (sorted.length > 20) {
      console.log(`  ... and ${sorted.length - 20} more paths`);
    }

    const frequent = this.getFrequentUpdates();
    if (frequent.length > 0) {
      console.log('\n⚠️ FREQUENT UPDATES (>20):');
      frequent.forEach(({ path, count }) => {
        console.log(`  - ${path}: ${count} updates`);
      });
    }

    console.log('\n========================================\n');
  }

  /**
   * Clear all records
   */
  clear(): void {
    this.updates = [];
    this.pathCounts.clear();
    console.log('📝 [StoreTracker] Records cleared');
  }
}

export const storeUpdateTracker = StoreUpdateTracker.getInstance();

/**
 * Print combined performance report
 */
export function printFullPerformanceReport(): void {
  perfTracker.printReport();
  renderTracker.printReport();
  storeUpdateTracker.printReport();
}

/**
 * Clear all performance tracking data
 */
export function clearAllPerformanceData(): void {
  perfTracker.clear();
  renderTracker.clear();
  storeUpdateTracker.clear();
}
