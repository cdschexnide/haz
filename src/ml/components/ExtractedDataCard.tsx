/**
 * ExtractedDataCard - Displays extracted text data from OCR
 *
 * Shows UN numbers, weights, hazard classes, dates, country,
 * and other significant markings found in the image.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ExtractedMarkings, ExtractedWeight } from '../types/ocr';

interface ExtractedDataCardProps {
  /** Extracted markings data */
  markings: ExtractedMarkings;
  /** Raw OCR text (for expandable view) */
  rawText?: string;
  /** Whether to show raw OCR text by default */
  showRawText?: boolean;
  /** Title override */
  title?: string;
}

/**
 * DataSection - Renders a section of extracted data
 */
interface DataSectionProps {
  icon: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
}

const DataSection: React.FC<DataSectionProps> = ({
  icon,
  iconColor,
  title,
  children,
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <MaterialIcons name={icon as any} size={18} color={iconColor} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

/**
 * DataChip - Displays a single data item as a chip
 */
interface DataChipProps {
  label: string;
  color?: string;
  backgroundColor?: string;
}

const DataChip: React.FC<DataChipProps> = ({
  label,
  color = '#1D1D1F',
  backgroundColor = '#F0F0F0',
}) => (
  <View style={[styles.chip, { backgroundColor }]}>
    <Text style={[styles.chipText, { color }]}>{label}</Text>
  </View>
);

const ExtractedDataCard: React.FC<ExtractedDataCardProps> = ({
  markings,
  rawText,
  showRawText: initialShowRawText = false,
  title = 'Extracted Data',
}) => {
  const [showRawText, setShowRawText] = useState(initialShowRawText);

  const {
    unNumbers,
    weights,
    hazardClasses,
    dates,
    countryOfOrigin,
    otherMarkings,
  } = markings;

  // Check if there's any data to display
  const hasData =
    unNumbers.length > 0 ||
    weights.length > 0 ||
    hazardClasses.length > 0 ||
    dates.length > 0 ||
    countryOfOrigin ||
    otherMarkings.length > 0;

  if (!hasData && !rawText) {
    return null;
  }

  /**
   * Format weight for display
   */
  const formatWeight = (weight: ExtractedWeight): string => {
    return `${weight.value} ${weight.unit}`;
  };

  /**
   * Get hazard class display info
   */
  const getHazardClassInfo = (
    hazClass: string
  ): { label: string; color: string; bg: string } => {
    const classNum = parseFloat(hazClass);
    if (classNum >= 1 && classNum < 2)
      return { label: `Class ${hazClass} - Explosives`, color: '#C62828', bg: '#FFEBEE' };
    if (classNum >= 2 && classNum < 3)
      return { label: `Class ${hazClass} - Gases`, color: '#2E7D32', bg: '#E8F5E9' };
    if (classNum >= 3 && classNum < 4)
      return {
        label: `Class ${hazClass} - Flammable Liquids`,
        color: '#E65100',
        bg: '#FFF3E0',
      };
    if (classNum >= 4 && classNum < 5)
      return {
        label: `Class ${hazClass} - Flammable Solids`,
        color: '#C62828',
        bg: '#FFEBEE',
      };
    if (classNum >= 5 && classNum < 6)
      return { label: `Class ${hazClass} - Oxidizers`, color: '#F57C00', bg: '#FFF3E0' };
    if (classNum >= 6 && classNum < 7)
      return { label: `Class ${hazClass} - Toxic/Infectious`, color: '#6A1B9A', bg: '#F3E5F5' };
    if (classNum >= 7 && classNum < 8)
      return { label: `Class ${hazClass} - Radioactive`, color: '#FFEB3B', bg: '#FFFDE7' };
    if (classNum >= 8 && classNum < 9)
      return { label: `Class ${hazClass} - Corrosive`, color: '#4A148C', bg: '#EDE7F6' };
    if (classNum >= 9)
      return { label: `Class ${hazClass} - Misc.`, color: '#37474F', bg: '#ECEFF1' };
    return { label: `Class ${hazClass}`, color: '#666', bg: '#F5F5F5' };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="text-snippet" size={24} color="#007AFF" />
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      {/* UN Numbers */}
      {unNumbers.length > 0 && (
        <DataSection icon="warning" iconColor="#E65100" title="UN Numbers">
          <View style={styles.chipsContainer}>
            {unNumbers.map((un, index) => (
              <DataChip
                key={index}
                label={un}
                color="#E65100"
                backgroundColor="#FFF3E0"
              />
            ))}
          </View>
        </DataSection>
      )}

      {/* Hazard Classes */}
      {hazardClasses.length > 0 && (
        <DataSection icon="local-fire-department" iconColor="#C62828" title="Hazard Classes">
          <View style={styles.chipsContainer}>
            {hazardClasses.map((hc, index) => {
              const info = getHazardClassInfo(hc);
              return (
                <DataChip
                  key={index}
                  label={info.label}
                  color={info.color}
                  backgroundColor={info.bg}
                />
              );
            })}
          </View>
        </DataSection>
      )}

      {/* Weights */}
      {weights.length > 0 && (
        <DataSection icon="scale" iconColor="#1976D2" title="Weights">
          <View style={styles.chipsContainer}>
            {weights.map((weight, index) => (
              <DataChip
                key={index}
                label={formatWeight(weight)}
                color="#1976D2"
                backgroundColor="#E3F2FD"
              />
            ))}
          </View>
        </DataSection>
      )}

      {/* Country of Origin */}
      {countryOfOrigin && (
        <DataSection icon="public" iconColor="#388E3C" title="Country">
          <DataChip
            label={countryOfOrigin}
            color="#388E3C"
            backgroundColor="#E8F5E9"
          />
        </DataSection>
      )}

      {/* Dates */}
      {dates.length > 0 && (
        <DataSection icon="event" iconColor="#7B1FA2" title="Dates">
          <View style={styles.chipsContainer}>
            {dates.map((date, index) => (
              <DataChip
                key={index}
                label={date}
                color="#7B1FA2"
                backgroundColor="#F3E5F5"
              />
            ))}
          </View>
        </DataSection>
      )}

      {/* Other Markings */}
      {otherMarkings.length > 0 && (
        <DataSection icon="label" iconColor="#455A64" title="Other Markings">
          <View style={styles.chipsContainer}>
            {otherMarkings.map((marking, index) => (
              <DataChip
                key={index}
                label={marking}
                color="#455A64"
                backgroundColor="#ECEFF1"
              />
            ))}
          </View>
        </DataSection>
      )}

      {/* Raw OCR Text Toggle */}
      {rawText && (
        <View style={styles.rawTextSection}>
          <TouchableOpacity
            style={styles.rawTextToggle}
            onPress={() => setShowRawText(!showRawText)}
            activeOpacity={0.7}
          >
            <MaterialIcons
              name={showRawText ? 'visibility-off' : 'visibility'}
              size={16}
              color="#666"
            />
            <Text style={styles.rawTextToggleText}>
              {showRawText ? 'Hide' : 'Show'} Raw OCR Text
            </Text>
            <MaterialIcons
              name={showRawText ? 'expand-less' : 'expand-more'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>

          {showRawText && (
            <View style={styles.rawTextContainer}>
              <Text style={styles.rawText}>{rawText || '(No text detected)'}</Text>
            </View>
          )}
        </View>
      )}

      {/* No Data Message */}
      {!hasData && rawText && (
        <View style={styles.noDataContainer}>
          <MaterialIcons name="info-outline" size={20} color="#666" />
          <Text style={styles.noDataText}>
            No structured data could be extracted from the image text.
          </Text>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  sectionContent: {
    paddingLeft: 24,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  rawTextSection: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  rawTextToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  rawTextToggleText: {
    fontSize: 13,
    color: '#666',
    marginHorizontal: 8,
  },
  rawTextContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  rawText: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#333',
    lineHeight: 16,
  },
  noDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  noDataText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    textAlign: 'center',
  },
});

export default ExtractedDataCard;
