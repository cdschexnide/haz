/**
 * POPMarkingCard - Displays parsed POP marking data from OCR
 *
 * Shows the detected POP marking type, parsed fields (A-H),
 * confidence score, and any validation issues.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { POPMarkingType, POPMarkingFields } from '@/utils/popMarkingParser';
import type { ParsedPOPMarking } from '../types/ocr';

interface POPMarkingCardProps {
  /** Parsed POP marking data */
  popMarking: ParsedPOPMarking;
  /** Index of source image (for multi-image display) */
  sourceImageIndex?: number;
  /** Whether to show expanded details */
  expanded?: boolean;
  /** Callback when card is pressed */
  onPress?: () => void;
  /** Whether this is the "best" POP marking across all images */
  isBest?: boolean;
}

/**
 * Get display name for POP marking type
 */
function getTypeDisplayName(type: POPMarkingType): string {
  switch (type) {
    case POPMarkingType.NON_BULK_SOLID:
      return 'Non-Bulk Solid';
    case POPMarkingType.NON_BULK_LIQUID:
      return 'Non-Bulk Liquid';
    case POPMarkingType.LARGE_PACKAGING:
      return 'Large Packaging';
    case POPMarkingType.UNKNOWN:
    default:
      return 'Unknown Type';
  }
}

/**
 * Get color for POP marking type badge
 */
function getTypeColor(type: POPMarkingType): string {
  switch (type) {
    case POPMarkingType.NON_BULK_SOLID:
      return '#2196F3'; // Blue
    case POPMarkingType.NON_BULK_LIQUID:
      return '#4CAF50'; // Green
    case POPMarkingType.LARGE_PACKAGING:
      return '#9C27B0'; // Purple
    case POPMarkingType.UNKNOWN:
    default:
      return '#757575'; // Gray
  }
}

/**
 * Get confidence badge color
 */
function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return '#4CAF50'; // Green - High
  if (confidence >= 0.5) return '#FF9800'; // Orange - Medium
  return '#F44336'; // Red - Low
}

/**
 * Get confidence label
 */
function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'High';
  if (confidence >= 0.5) return 'Medium';
  return 'Low';
}

/**
 * Get field label based on type and field key
 */
function getFieldLabel(type: POPMarkingType, fieldKey: string): string {
  switch (type) {
    case POPMarkingType.NON_BULK_SOLID:
      switch (fieldKey) {
        case 'A':
          return 'UN Symbol';
        case 'B':
          return 'Packaging Code';
        case 'C':
          return 'Packing Group';
        case 'D':
          return 'Max Gross Mass (kg)';
        case 'E':
          return 'Solid Indicator';
        case 'F':
          return 'Year';
        case 'G':
          return 'Country';
        case 'H':
          return 'Manufacturer';
        default:
          return fieldKey;
      }

    case POPMarkingType.NON_BULK_LIQUID:
      switch (fieldKey) {
        case 'A':
          return 'UN Symbol';
        case 'B':
          return 'Packaging Code';
        case 'C':
          return 'Packing Group';
        case 'D':
          return 'Relative Density';
        case 'E':
          return 'Test Pressure (kPa)';
        case 'F':
          return 'Year';
        case 'G':
          return 'Country';
        case 'H':
          return 'Manufacturer';
        default:
          return fieldKey;
      }

    case POPMarkingType.LARGE_PACKAGING:
      switch (fieldKey) {
        case 'A':
          return 'UN Symbol';
        case 'B':
          return 'Packaging Code';
        case 'C':
          return 'Packing Group';
        case 'D':
          return 'Manufacture Date';
        case 'E':
          return 'Country';
        case 'F':
          return 'Manufacturer';
        case 'G':
          return 'Stack Load (kg)';
        case 'H':
          return 'Max Mass (kg)';
        default:
          return fieldKey;
      }

    default:
      return fieldKey;
  }
}

const POPMarkingCard: React.FC<POPMarkingCardProps> = ({
  popMarking,
  sourceImageIndex,
  expanded = true,
  onPress,
  isBest = false,
}) => {
  const { fields, confidence, issues, detectedType } = popMarking;

  if (!fields) {
    return null;
  }

  const typeColor = getTypeColor(detectedType);
  const confidenceColor = getConfidenceColor(confidence);
  const confidenceLabel = getConfidenceLabel(confidence);
  const confidencePercent = Math.round(confidence * 100);

  // Field keys to display (excluding 'type' and 'A' which is always UN)
  const fieldKeys = ['B', 'C', 'D', 'E', 'F', 'G', 'H'] as const;

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="inventory-2" size={24} color={typeColor} />
          <Text style={styles.title}>POP Marking</Text>
          {isBest && (
            <View style={styles.bestBadge}>
              <MaterialIcons name="star" size={14} color="#FFD700" />
              <Text style={styles.bestText}>Best</Text>
            </View>
          )}
        </View>
        <View style={[styles.confidenceBadge, { backgroundColor: confidenceColor }]}>
          <Text style={styles.confidenceText}>
            {confidenceLabel} ({confidencePercent}%)
          </Text>
        </View>
      </View>

      {/* Type Badge */}
      <View style={styles.typeRow}>
        <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
          <Text style={styles.typeText}>{getTypeDisplayName(detectedType)}</Text>
        </View>
        {sourceImageIndex !== undefined && (
          <Text style={styles.sourceText}>Image {sourceImageIndex + 1}</Text>
        )}
      </View>

      {expanded && (
        <>
          {/* Fields Table */}
          <View style={styles.fieldsContainer}>
            {/* Header Row */}
            <View style={styles.fieldsHeaderRow}>
              {fieldKeys.map((key) => (
                <View key={key} style={styles.fieldHeaderCell}>
                  <Text style={styles.fieldHeaderText}>{key}</Text>
                </View>
              ))}
            </View>
            {/* Values Row */}
            <View style={styles.fieldsValueRow}>
              {fieldKeys.map((key) => {
                const value = (fields as any)[key] || '-';
                const isEmpty = !value || value === '-';
                return (
                  <View key={key} style={styles.fieldValueCell}>
                    <Text
                      style={[styles.fieldValueText, isEmpty && styles.fieldValueEmpty]}
                      numberOfLines={1}
                    >
                      {value}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Field Labels (collapsible detail) */}
          <View style={styles.fieldLabelsContainer}>
            {fieldKeys.map((key) => {
              const value = (fields as any)[key];
              if (!value) return null;
              return (
                <View key={key} style={styles.fieldLabelRow}>
                  <Text style={styles.fieldLabelKey}>{key}:</Text>
                  <Text style={styles.fieldLabelName}>
                    {getFieldLabel(detectedType, key)}
                  </Text>
                  <Text style={styles.fieldLabelValue}>{value}</Text>
                </View>
              );
            })}
          </View>

          {/* Issues */}
          {issues && issues.length > 0 && (
            <View style={styles.issuesContainer}>
              <View style={styles.issuesHeader}>
                <MaterialIcons name="warning" size={16} color="#FF9800" />
                <Text style={styles.issuesTitle}>Issues ({issues.length})</Text>
              </View>
              {issues.map((issue, index) => (
                <Text key={index} style={styles.issueText}>
                  {issue}
                </Text>
              ))}
            </View>
          )}
        </>
      )}

      {/* Expand indicator if not expanded */}
      {!expanded && onPress && (
        <View style={styles.expandHint}>
          <Text style={styles.expandHintText}>Tap to view details</Text>
          <MaterialIcons name="expand-more" size={16} color="#666" />
        </View>
      )}
    </CardWrapper>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginLeft: 8,
  },
  bestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  bestText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F57C00',
    marginLeft: 2,
  },
  confidenceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sourceText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  fieldsContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  fieldsHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  fieldHeaderCell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  fieldHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
  },
  fieldsValueRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  fieldValueCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  fieldValueText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'monospace',
  },
  fieldValueEmpty: {
    color: '#BDBDBD',
  },
  fieldLabelsContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fieldLabelKey: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    width: 20,
  },
  fieldLabelName: {
    fontSize: 12,
    color: '#888',
    flex: 1,
    marginLeft: 4,
  },
  fieldLabelValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'monospace',
  },
  issuesContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  issuesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  issuesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E65100',
    marginLeft: 6,
  },
  issueText: {
    fontSize: 12,
    color: '#5D4037',
    marginLeft: 22,
    marginBottom: 4,
  },
  expandHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  expandHintText: {
    fontSize: 12,
    color: '#666',
  },
});

export default POPMarkingCard;
