/**
 * ExtractedDataCard - Displays extracted text data from OCR
 *
 * Shows UN numbers, weights, hazard classes, dates, country,
 * and other significant markings found in the image.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import type { ExtractedMarkings } from '../types/ocr';

interface ExtractedDataCardProps {
  /** Extracted markings data */
  markings: ExtractedMarkings;
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
  title = 'Extracted Data',
}) => {
  const {
    unNumbers,
    hazardClasses,
    dates,
    otherMarkings,
    exNumbers = [],
    unWithPSN = [],
    rawPopMarkingText = null,
  } = markings;

  // Check if there's any data to display
  const hasData =
    unNumbers.length > 0 ||
    exNumbers.length > 0 ||
    unWithPSN.length > 0 ||
    rawPopMarkingText ||
    hazardClasses.length > 0 ||
    dates.length > 0 ||
    otherMarkings.length > 0;

  if (!hasData) {
    return null;
  }

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

      {/* UN + PSN Combined Section (prioritized for compliance) */}
      {unWithPSN.length > 0 && (
        <DataSection icon="assignment" iconColor="#E65100" title="UN Number & Proper Shipping Name">
          <View style={styles.unPsnContainer}>
            {unWithPSN.map((item, index) => (
              <View key={index} style={styles.unPsnItem}>
                <DataChip label={item.un} color="#E65100" backgroundColor="#FFF3E0" />
                <Text style={styles.psnText}>{item.psn}</Text>
              </View>
            ))}
          </View>
        </DataSection>
      )}

      {/* EX Classification Numbers */}
      {exNumbers.length > 0 && (
        <DataSection icon="verified" iconColor="#1565C0" title="EX Classification">
          <View style={styles.chipsContainer}>
            {exNumbers.map((ex, index) => (
              <DataChip
                key={index}
                label={ex}
                color="#1565C0"
                backgroundColor="#E3F2FD"
              />
            ))}
          </View>
        </DataSection>
      )}

      {/* UN Specification POP Marking */}
      {rawPopMarkingText && (
        <DataSection icon="inventory-2" iconColor="#5D4037" title="UN Specification POP Marking">
          <Text style={styles.popMarkingText}>{rawPopMarkingText}</Text>
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
  unPsnContainer: {
    gap: 8,
  },
  unPsnItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  psnText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  popMarkingText: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '600',
    fontFamily: 'monospace',
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
});

export default ExtractedDataCard;
