/**
 * DevBenchmarkButton
 *
 * A floating button for running performance benchmarks during development.
 * Only visible in __DEV__ mode.
 *
 * @version 1.1
 * @date 2026-01-07
 */

import React, { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  perfTracker,
  renderTracker,
  storeUpdateTracker,
  PERFORMANCE_TRACKING_ENABLED,
  printFullPerformanceReport,
  clearAllPerformanceData,
} from '@/utils/performanceUtils';
import { useDatabase } from '@/contexts/DataProvider';
import ShipmentDatabase from '@/services/shipment/ShipmentDatabase';

interface DevBenchmarkButtonProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const DevBenchmarkButton: React.FC<DevBenchmarkButtonProps> = ({
  position = 'bottom-right',
}) => {
  // // TEMPORARILY DISABLED FOR DEMO - uncomment below to re-enable
  return null;

  const [modalVisible, setModalVisible] = useState(false);
  const [report, setReport] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const database = useDatabase();

  // Only show in development
  if (!__DEV__) return null;

  // Debug log
  useEffect(() => {
    console.log('[DevBenchmarkButton] Component mounted, position:', position);
  }, []);

  const positionStyles = {
    'top-left': { top: 100, left: 10 },
    'top-right': { top: 100, right: 10 },
    'bottom-left': { bottom: 120, left: 10 },
    'bottom-right': { bottom: 120, right: 10 },
  };

  const handlePress = () => {
    console.log('[DevBenchmarkButton] Button pressed');
    setModalVisible(true);
  };

  const handlePrintCurrentMetrics = () => {
    const reportData = perfTracker.generateReport();
    const renderCounts = renderTracker.getRenderCounts();
    const storeCounts = storeUpdateTracker.getUpdateCounts();
    setReport(formatReport(reportData, renderCounts, storeCounts));
    printFullPerformanceReport();
  };

  const handleClearMetrics = () => {
    clearAllPerformanceData();
    setReport('All metrics cleared.');
  };

  const formatReport = (
    reportData: any,
    renderCounts?: Record<string, number>,
    storeCounts?: Record<string, number>
  ): string => {
    let output = `Performance Report\n`;
    output += `${'='.repeat(40)}\n`;
    output += `Tracking: ${PERFORMANCE_TRACKING_ENABLED ? 'ENABLED' : 'DISABLED'}\n`;
    output += `Duration: ${(reportData.trackingDuration / 1000).toFixed(1)}s\n`;
    output += `Operations: ${reportData.summary.totalOperations}\n`;
    output += `Total Time: ${reportData.summary.totalTime.toFixed(1)}ms\n\n`;

    if (reportData.operationStats.length > 0) {
      output += `Operation Stats:\n`;
      output += `${'-'.repeat(40)}\n`;
      reportData.operationStats.forEach((stat: any) => {
        output += `\n${stat.operation}:\n`;
        output += `  Count: ${stat.count}\n`;
        output += `  Avg: ${stat.avgTime.toFixed(2)}ms\n`;
        output += `  Min/Max: ${stat.minTime.toFixed(1)}/${stat.maxTime.toFixed(1)}ms\n`;

        // Show sub-metrics for this operation (from raw metrics)
        const metricsWithSubs = reportData.rawMetrics.filter(
          (m: any) => m.operation === stat.operation && m.subMetrics?.length > 0
        );
        if (metricsWithSubs.length > 0) {
          // Get sub-metrics from most recent call
          const lastMetric = metricsWithSubs[metricsWithSubs.length - 1];
          if (lastMetric.subMetrics && lastMetric.subMetrics.length > 0) {
            output += `  Sub-metrics (last call):\n`;
            lastMetric.subMetrics.forEach((sub: any) => {
              const sizeStr = sub.dataSize ? ` [${(sub.dataSize / 1024).toFixed(1)}KB]` : '';
              output += `    ${sub.operation}: ${sub.duration?.toFixed(1)}ms${sizeStr}\n`;
            });
          }
        }
      });
    }

    if (reportData.summary.bottlenecks.length > 0) {
      output += `\n⚠️ Bottlenecks:\n`;
      reportData.summary.bottlenecks.forEach((b: string) => {
        output += `  - ${b}\n`;
      });
    }

    // Render tracking
    if (renderCounts && Object.keys(renderCounts).length > 0) {
      output += `\n${'='.repeat(40)}\n`;
      output += `Render Tracking\n`;
      output += `${'-'.repeat(40)}\n`;
      const sorted = Object.entries(renderCounts).sort((a, b) => b[1] - a[1]);
      sorted.slice(0, 10).forEach(([component, count]) => {
        const warning = count > 10 ? ' ⚠️' : '';
        output += `${component}: ${count}${warning}\n`;
      });
      if (sorted.length > 10) {
        output += `... and ${sorted.length - 10} more\n`;
      }
    }

    // Store update tracking
    if (storeCounts && Object.keys(storeCounts).length > 0) {
      output += `\n${'='.repeat(40)}\n`;
      output += `Store Updates\n`;
      output += `${'-'.repeat(40)}\n`;
      const sorted = Object.entries(storeCounts).sort((a, b) => b[1] - a[1]);
      sorted.slice(0, 10).forEach(([path, count]) => {
        const warning = count > 20 ? ' ⚠️' : '';
        output += `${path}: ${count}${warning}\n`;
      });
      if (sorted.length > 10) {
        output += `... and ${sorted.length - 10} more\n`;
      }
    }

    return output;
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.floatingButton, positionStyles[position]]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>⏱️</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Performance Benchmarks</Text>
            <Text style={styles.dbStatus}>
              DB: {database.isInitialized ? '✅ Ready' : '⏳ Loading...'}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handlePrintCurrentMetrics}
              >
                <Text style={styles.actionButtonText}>Show Metrics</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.clearButton]}
                onPress={handleClearMetrics}
              >
                <Text style={styles.actionButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={async () => {
                try {
                  setReport('Resetting database...');
                  await database.resetDatabaseAndMigrate();
                  setReport('Database reset complete! Restart the app for a fresh start.');
                } catch (err) {
                  setReport(`Reset failed: ${err}`);
                }
              }}
            >
              <Text style={styles.actionButtonText}>Reset Inspector DB</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={async () => {
                try {
                  setReport('Clearing preparer shipments...');
                  await ShipmentDatabase.initialize();
                  await ShipmentDatabase.clearDatabase();
                  setReport('Preparer ShipmentDatabase cleared!');
                } catch (err) {
                  setReport(`Clear failed: ${err}`);
                }
              }}
            >
              <Text style={styles.actionButtonText}>Clear Preparer Shipments</Text>
            </TouchableOpacity>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <ScrollView style={styles.reportContainer}>
              <Text style={styles.reportText}>
                {report || 'No data yet. Use the app to collect metrics, then tap "Show Metrics".'}
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6200ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 9999,
  },
  buttonText: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  dbStatus: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#6200ee',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#dc3545',
  },
  dangerButton: {
    backgroundColor: '#ff6b00',
    marginTop: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    color: '#dc3545',
    marginBottom: 8,
    textAlign: 'center',
  },
  reportContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
  },
  reportText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#333',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default DevBenchmarkButton;
