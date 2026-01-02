/**
 * AnalysisSummaryCard - Displays aggregated analysis summary
 *
 * Shows a high-level summary of all detected labels, OCR findings,
 * and key extracted data across all analyzed images.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { AggregatedAnalysis } from '../types/ocr';

interface AnalysisSummaryCardProps {
  /** Aggregated analysis results */
  results: AggregatedAnalysis;
}

/**
 * SummaryItem - A single summary item row
 */
interface SummaryItemProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string | number;
  status: 'success' | 'warning' | 'info' | 'neutral';
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  icon,
  iconColor,
  label,
  value,
  status,
}) => {
  const statusColors = {
    success: '#4CAF50',
    warning: '#FF9800',
    info: '#2196F3',
    neutral: '#666',
  };

  return (
    <View style={styles.summaryItem}>
      <View style={styles.summaryItemLeft}>
        <MaterialIcons name={icon as any} size={20} color={iconColor} />
        <Text style={styles.summaryItemLabel}>{label}</Text>
      </View>
      <View
        style={[
          styles.summaryItemBadge,
          { backgroundColor: statusColors[status] + '20' },
        ]}
      >
        <Text style={[styles.summaryItemValue, { color: statusColors[status] }]}>
          {value}
        </Text>
      </View>
    </View>
  );
};

const AnalysisSummaryCard: React.FC<AnalysisSummaryCardProps> = ({ results }) => {
  const {
    allDetectedLabels,
    bestPopMarking,
    allUnNumbers,
    allHazardClasses,
    imagesProcessed,
    totalProcessingTime,
  } = results;

  // Calculate stats
  const totalLabels = allDetectedLabels.length;
  const highConfidenceLabels = allDetectedLabels.filter(
    (l) => l.maxConfidence >= 0.8
  ).length;
  const hasPopMarking = !!bestPopMarking;
  const popConfidence = bestPopMarking
    ? Math.round(bestPopMarking.confidence * 100)
    : 0;

  // Format processing time
  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="analytics" size={24} color="#007AFF" />
        <Text style={styles.title}>Analysis Summary</Text>
      </View>

      {/* Quick Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{imagesProcessed}</Text>
          <Text style={styles.statLabel}>Images</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalLabels}</Text>
          <Text style={styles.statLabel}>Labels</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatTime(totalProcessingTime)}</Text>
          <Text style={styles.statLabel}>Time</Text>
        </View>
      </View>

      {/* Summary Items */}
      <View style={styles.summaryList}>
        {/* Hazmat Labels */}
        <SummaryItem
          icon="warning"
          iconColor="#E65100"
          label="Hazmat Labels Detected"
          value={
            totalLabels > 0
              ? `${totalLabels} (${highConfidenceLabels} high confidence)`
              : 'None found'
          }
          status={totalLabels > 0 ? 'success' : 'neutral'}
        />

        {/* POP Marking */}
        <SummaryItem
          icon="inventory-2"
          iconColor="#2196F3"
          label="POP Marking"
          value={
            hasPopMarking
              ? `Found (${popConfidence}% confidence)`
              : 'Not detected'
          }
          status={
            hasPopMarking
              ? popConfidence >= 80
                ? 'success'
                : 'warning'
              : 'neutral'
          }
        />

        {/* UN Numbers */}
        <SummaryItem
          icon="label"
          iconColor="#9C27B0"
          label="UN Numbers"
          value={
            allUnNumbers.length > 0
              ? allUnNumbers.join(', ')
              : 'None found'
          }
          status={allUnNumbers.length > 0 ? 'info' : 'neutral'}
        />

        {/* Hazard Classes */}
        <SummaryItem
          icon="local-fire-department"
          iconColor="#C62828"
          label="Hazard Classes (OCR)"
          value={
            allHazardClasses.length > 0
              ? allHazardClasses.map((c) => `Class ${c}`).join(', ')
              : 'None found'
          }
          status={allHazardClasses.length > 0 ? 'warning' : 'neutral'}
        />
      </View>

      {/* Top Detected Labels */}
      {allDetectedLabels.length > 0 && (
        <View style={styles.topLabelsSection}>
          <Text style={styles.topLabelsTitle}>Top Detected Labels</Text>
          <View style={styles.topLabelsList}>
            {allDetectedLabels.slice(0, 5).map((label, index) => (
              <View key={index} style={styles.topLabelItem}>
                <View style={styles.topLabelRank}>
                  <Text style={styles.topLabelRankText}>{index + 1}</Text>
                </View>
                <Text style={styles.topLabelName} numberOfLines={1}>
                  {label.className}
                </Text>
                <Text style={styles.topLabelConfidence}>
                  {Math.round(label.maxConfidence * 100)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Success Indicators */}
      <View style={styles.indicatorsRow}>
        <View
          style={[
            styles.indicator,
            totalLabels > 0 ? styles.indicatorSuccess : styles.indicatorNeutral,
          ]}
        >
          <MaterialIcons
            name={totalLabels > 0 ? 'check-circle' : 'radio-button-unchecked'}
            size={16}
            color={totalLabels > 0 ? '#4CAF50' : '#BDBDBD'}
          />
          <Text
            style={[
              styles.indicatorText,
              { color: totalLabels > 0 ? '#4CAF50' : '#BDBDBD' },
            ]}
          >
            Labels
          </Text>
        </View>

        <View
          style={[
            styles.indicator,
            hasPopMarking ? styles.indicatorSuccess : styles.indicatorNeutral,
          ]}
        >
          <MaterialIcons
            name={hasPopMarking ? 'check-circle' : 'radio-button-unchecked'}
            size={16}
            color={hasPopMarking ? '#4CAF50' : '#BDBDBD'}
          />
          <Text
            style={[
              styles.indicatorText,
              { color: hasPopMarking ? '#4CAF50' : '#BDBDBD' },
            ]}
          >
            POP
          </Text>
        </View>

        <View
          style={[
            styles.indicator,
            allUnNumbers.length > 0
              ? styles.indicatorSuccess
              : styles.indicatorNeutral,
          ]}
        >
          <MaterialIcons
            name={
              allUnNumbers.length > 0 ? 'check-circle' : 'radio-button-unchecked'
            }
            size={16}
            color={allUnNumbers.length > 0 ? '#4CAF50' : '#BDBDBD'}
          />
          <Text
            style={[
              styles.indicatorText,
              { color: allUnNumbers.length > 0 ? '#4CAF50' : '#BDBDBD' },
            ]}
          >
            UN#
          </Text>
        </View>

        <View
          style={[
            styles.indicator,
            results.countryOfOrigin
              ? styles.indicatorSuccess
              : styles.indicatorNeutral,
          ]}
        >
          <MaterialIcons
            name={
              results.countryOfOrigin
                ? 'check-circle'
                : 'radio-button-unchecked'
            }
            size={16}
            color={results.countryOfOrigin ? '#4CAF50' : '#BDBDBD'}
          />
          <Text
            style={[
              styles.indicatorText,
              { color: results.countryOfOrigin ? '#4CAF50' : '#BDBDBD' },
            ]}
          >
            Country
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginLeft: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  summaryList: {
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  summaryItemLabel: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  summaryItemBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: '50%',
  },
  summaryItemValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  topLabelsSection: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  topLabelsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 10,
  },
  topLabelsList: {},
  topLabelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topLabelRank: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  topLabelRankText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  topLabelName: {
    flex: 1,
    fontSize: 13,
    color: '#333',
  },
  topLabelConfidence: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4CAF50',
  },
  indicatorsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorSuccess: {},
  indicatorNeutral: {},
  indicatorText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default AnalysisSummaryCard;
