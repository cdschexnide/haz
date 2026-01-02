/**
 * ResultsList component - displays detection results in an organized list
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Detection, ImageDetectionResult } from '../types';
import { LinearGradient } from './GradientFallback';
import { getCategoryColor, formatClassName } from '../services/postprocess';
import { colors, spacing, radius, shadows } from '../theme/mlTheme';

interface ResultsListProps {
  results: ImageDetectionResult[];
  onDetectionPress?: (detection: Detection, imageIndex: number) => void;
}

export function ResultsList({ results, onDetectionPress }: ResultsListProps) {
  // Aggregate all detections with image reference
  const allDetections: Array<{ detection: Detection; imageIndex: number }> = [];

  results.forEach((result, imageIndex) => {
    result.detections.forEach((detection) => {
      allDetections.push({ detection, imageIndex });
    });
  });

  // Group by class name for summary
  const groupedByClass = new Map<string, Detection[]>();
  allDetections.forEach(({ detection }) => {
    const existing = groupedByClass.get(detection.className) || [];
    existing.push(detection);
    groupedByClass.set(detection.className, existing);
  });

  // Sort classes by total confidence
  const sortedClasses = Array.from(groupedByClass.entries()).sort((a, b) => {
    const avgA = a[1].reduce((sum, d) => sum + d.confidence, 0) / a[1].length;
    const avgB = b[1].reduce((sum, d) => sum + d.confidence, 0) / b[1].length;
    return avgB - avgA;
  });

  if (allDetections.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <LinearGradient
            colors={[colors.neutral[200], colors.neutral[300]]}
            style={styles.emptyIconGradient}
          >
            <Text style={styles.emptyIcon}>🔍</Text>
          </LinearGradient>
        </View>
        <Text style={styles.emptyTitle}>No Labels Detected</Text>
        <Text style={styles.emptyDescription}>
          Try capturing images from different angles or with better lighting for optimal detection.
        </Text>
        <View style={styles.emptyTips}>
          <View style={styles.emptyTip}>
            <Text style={styles.emptyTipIcon}>💡</Text>
            <Text style={styles.emptyTipText}>Ensure good lighting</Text>
          </View>
          <View style={styles.emptyTip}>
            <Text style={styles.emptyTipIcon}>📐</Text>
            <Text style={styles.emptyTipText}>Center the label in frame</Text>
          </View>
          <View style={styles.emptyTip}>
            <Text style={styles.emptyTipIcon}>📏</Text>
            <Text style={styles.emptyTipText}>Get closer for small labels</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Summary header */}
      <View style={styles.summaryHeader}>
        <LinearGradient
          colors={[colors.neutral[900], colors.neutral[800]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryGradient}
        >
          <View style={styles.summaryTitleRow}>
            <Text style={styles.summaryIcon}>📊</Text>
            <Text style={styles.summaryTitle}>Detection Summary</Text>
          </View>

          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <View style={styles.statValueContainer}>
                <Text style={styles.statValue}>{allDetections.length}</Text>
              </View>
              <Text style={styles.statLabel}>Total Found</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statValueContainer}>
                <Text style={styles.statValue}>{sortedClasses.length}</Text>
              </View>
              <Text style={styles.statLabel}>Unique Types</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <View style={styles.statValueContainer}>
                <Text style={styles.statValue}>{results.length}</Text>
              </View>
              <Text style={styles.statLabel}>Images</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Section Title */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionIcon}>
            <Text style={styles.sectionIconText}>🏷</Text>
          </View>
          <Text style={styles.sectionTitle}>Detected Labels</Text>
        </View>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>{sortedClasses.length}</Text>
        </View>
      </View>

      {/* Grouped results */}
      <View style={styles.groupedResults}>
        {sortedClasses.map(([className, detections], index) => (
          <DetectionGroupCard
            key={className}
            className={className}
            detections={detections}
            onPress={onDetectionPress}
            index={index}
          />
        ))}
      </View>

      {/* Per-image breakdown */}
      <View style={styles.breakdownSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <View style={styles.sectionIcon}>
              <Text style={styles.sectionIconText}>📸</Text>
            </View>
            <Text style={styles.sectionTitle}>Per-Image Details</Text>
          </View>
        </View>

        {results.map((result, index) => (
          <ImageResultCard key={index} result={result} imageIndex={index + 1} />
        ))}
      </View>

      {/* Bottom padding */}
      <View style={{ height: spacing[6] }} />
    </ScrollView>
  );
}

interface DetectionGroupCardProps {
  className: string;
  detections: Detection[];
  onPress?: (detection: Detection, imageIndex: number) => void;
  index: number;
}

function DetectionGroupCard({ className, detections, onPress, index }: DetectionGroupCardProps) {
  const category = detections[0]?.category || 'unknown';
  const color = getCategoryColor(category);
  const avgConfidence =
    detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length;

  const confidenceLevel =
    avgConfidence >= 0.9 ? 'High' : avgConfidence >= 0.7 ? 'Good' : 'Low';
  const confidenceColor =
    avgConfidence >= 0.9
      ? colors.success[500]
      : avgConfidence >= 0.7
      ? colors.warning[500]
      : colors.error[500];

  return (
    <View style={styles.groupCard}>
      <View style={[styles.groupAccent, { backgroundColor: color }]} />

      <View style={styles.groupContent}>
        <View style={styles.groupHeader}>
          <View style={styles.groupTitleRow}>
            <View style={[styles.categoryDot, { backgroundColor: color }]}>
              <View style={[styles.categoryDotInner, { backgroundColor: color }]} />
            </View>
            <View style={styles.groupTitleContainer}>
              <Text style={styles.groupClassName} numberOfLines={2}>
                {formatClassName(className)}
              </Text>
              <Text style={[styles.categoryText, { color }]}>
                {formatCategory(category)}
              </Text>
            </View>
          </View>

          <View style={[styles.countBadge, { backgroundColor: `${color}15` }]}>
            <Text style={[styles.countBadgeText, { color }]}>×{detections.length}</Text>
          </View>
        </View>

        <View style={styles.confidenceRow}>
          <View style={styles.confidenceBar}>
            <View
              style={[
                styles.confidenceBarFill,
                {
                  width: `${avgConfidence * 100}%`,
                  backgroundColor: color,
                },
              ]}
            />
          </View>
          <View style={styles.confidenceInfo}>
            <Text style={styles.confidenceValue}>
              {Math.round(avgConfidence * 100)}%
            </Text>
            <Text style={[styles.confidenceLevel, { color: confidenceColor }]}>
              {confidenceLevel}
            </Text>
          </View>
        </View>

        <View style={styles.detectionChips}>
          {detections.slice(0, 5).map((detection, idx) => (
            <TouchableOpacity
              key={detection.id}
              style={[styles.confidenceChip, { backgroundColor: `${color}12` }]}
              onPress={() => onPress?.(detection, idx)}
              activeOpacity={0.7}
            >
              <View style={[styles.chipDot, { backgroundColor: color }]} />
              <Text style={[styles.confidenceChipText, { color }]}>
                {Math.round(detection.confidence * 100)}%
              </Text>
            </TouchableOpacity>
          ))}
          {detections.length > 5 && (
            <View style={styles.moreChip}>
              <Text style={styles.moreChipText}>+{detections.length - 5} more</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

interface ImageResultCardProps {
  result: ImageDetectionResult;
  imageIndex: number;
}

function ImageResultCard({ result, imageIndex }: ImageResultCardProps) {
  const { detections, inferenceTime } = result;

  return (
    <View style={styles.imageCard}>
      <View style={styles.imageCardHeader}>
        <View style={styles.imageCardTitleRow}>
          <View style={styles.imageCardIcon}>
            <Text style={styles.imageCardIconText}>{imageIndex}</Text>
          </View>
          <View>
            <Text style={styles.imageCardTitle}>Image {imageIndex}</Text>
            <Text style={styles.imageCardSubtitle}>
              {detections.length} detection{detections.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.inferenceTimeBadge}>
          <Text style={styles.inferenceTimeIcon}>⚡</Text>
          <Text style={styles.inferenceTime}>{inferenceTime}ms</Text>
        </View>
      </View>

      {detections.length === 0 ? (
        <View style={styles.noDetectionsContainer}>
          <Text style={styles.noDetectionsIcon}>○</Text>
          <Text style={styles.noDetections}>No labels detected in this image</Text>
        </View>
      ) : (
        <View style={styles.imageDetections}>
          {detections.map((detection, idx) => {
            const detColor = getCategoryColor(detection.category);
            const isLast = idx === detections.length - 1;
            return (
              <View
                key={detection.id}
                style={[styles.detectionItem, !isLast && styles.detectionItemBorder]}
              >
                <View style={[styles.detectionIndicator, { backgroundColor: detColor }]} />
                <View style={styles.detectionInfo}>
                  <Text style={styles.detectionName} numberOfLines={1}>
                    {formatClassName(detection.className)}
                  </Text>
                  <Text style={[styles.detectionCategory, { color: detColor }]}>
                    {formatCategory(detection.category)}
                  </Text>
                </View>
                <View style={styles.detectionConfidenceContainer}>
                  <Text style={styles.detectionConfidence}>
                    {Math.round(detection.confidence * 100)}%
                  </Text>
                  <View
                    style={[
                      styles.detectionConfidenceBar,
                      { backgroundColor: `${detColor}20` },
                    ]}
                  >
                    <View
                      style={[
                        styles.detectionConfidenceBarFill,
                        {
                          width: `${detection.confidence * 100}%`,
                          backgroundColor: detColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

function formatCategory(category: string): string {
  const categoryNames: Record<string, string> = {
    general_marking: 'General Marking',
    hazardClass1: 'Class 1: Explosives',
    hazardClass2: 'Class 2: Gases',
    hazardClass3: 'Class 3: Flammable Liquids',
    hazardClass4: 'Class 4: Flammable Solids',
    hazardClass5: 'Class 5: Oxidizers',
    hazardClass6: 'Class 6: Toxic/Infectious',
    hazardClass8: 'Class 8: Corrosives',
    hazardClass9: 'Class 9: Miscellaneous',
    unknown: 'Unknown Category',
  };

  return categoryNames[category] || category;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[8],
    backgroundColor: colors.neutral[0],
    borderRadius: radius.xl,
    ...shadows.sm,
  },
  emptyIconContainer: {
    marginBottom: spacing[6],
  },
  emptyIconGradient: {
    width: 80,
    height: 80,
    borderRadius: radius['2xl'],
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 36,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral[800],
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  emptyDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.neutral[500],
    textAlign: 'center',
    marginBottom: spacing[6],
    paddingHorizontal: spacing[4],
  },
  emptyTips: {
    width: '100%',
    gap: spacing[3],
  },
  emptyTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderRadius: radius.lg,
  },
  emptyTipIcon: {
    fontSize: 18,
    marginRight: spacing[3],
  },
  emptyTipText: {
    fontSize: 14,
    color: colors.neutral[600],
    fontWeight: '500',
  },

  // Summary Header
  summaryHeader: {
    marginBottom: spacing[5],
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  summaryGradient: {
    padding: spacing[5],
  },
  summaryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[5],
  },
  summaryIcon: {
    fontSize: 20,
    marginRight: spacing[2],
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.neutral[0],
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValueContainer: {
    marginBottom: spacing[1],
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.secondary[400],
  },
  statLabel: {
    fontSize: 12,
    color: colors.neutral[400],
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.neutral[700],
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  sectionIconText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.neutral[800],
  },
  sectionBadge: {
    backgroundColor: colors.primary[100],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
  },
  sectionBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary[700],
  },

  // Grouped Results
  groupedResults: {
    marginBottom: spacing[6],
    gap: spacing[3],
  },
  groupCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadows.md,
  },
  groupAccent: {
    height: 4,
  },
  groupContent: {
    padding: spacing[4],
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing[4],
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: spacing[3],
  },
  categoryDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
    marginTop: 3,
    opacity: 0.2,
  },
  categoryDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 1,
  },
  groupTitleContainer: {
    flex: 1,
  },
  groupClassName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral[900],
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  countBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radius.full,
  },
  countBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  confidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  confidenceBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.neutral[100],
    borderRadius: radius.full,
    marginRight: spacing[3],
    overflow: 'hidden',
  },
  confidenceBarFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  confidenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral[700],
    marginRight: spacing[2],
  },
  confidenceLevel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detectionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  confidenceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: spacing[1.5],
  },
  confidenceChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  moreChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
    backgroundColor: colors.neutral[100],
  },
  moreChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.neutral[500],
  },

  // Breakdown Section
  breakdownSection: {
    marginTop: spacing[2],
  },

  // Image Card
  imageCard: {
    backgroundColor: colors.neutral[0],
    borderRadius: radius.xl,
    marginBottom: spacing[3],
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  imageCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageCardIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  imageCardIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neutral[0],
  },
  imageCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral[900],
  },
  imageCardSubtitle: {
    fontSize: 12,
    color: colors.neutral[500],
    marginTop: 1,
  },
  inferenceTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary[50],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
    borderRadius: radius.full,
  },
  inferenceTimeIcon: {
    fontSize: 12,
    marginRight: spacing[1],
  },
  inferenceTime: {
    fontSize: 12,
    color: colors.secondary[700],
    fontWeight: '600',
  },
  noDetectionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
  },
  noDetectionsIcon: {
    fontSize: 16,
    color: colors.neutral[400],
    marginRight: spacing[2],
  },
  noDetections: {
    fontSize: 14,
    color: colors.neutral[400],
    fontStyle: 'italic',
  },
  imageDetections: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  detectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  detectionItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[100],
  },
  detectionIndicator: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: spacing[3],
  },
  detectionInfo: {
    flex: 1,
    marginRight: spacing[3],
  },
  detectionName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[800],
    marginBottom: 2,
  },
  detectionCategory: {
    fontSize: 11,
    fontWeight: '500',
  },
  detectionConfidenceContainer: {
    alignItems: 'flex-end',
    width: 70,
  },
  detectionConfidence: {
    fontSize: 15,
    color: colors.neutral[700],
    fontWeight: '600',
    marginBottom: 4,
  },
  detectionConfidenceBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  detectionConfidenceBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default ResultsList;
