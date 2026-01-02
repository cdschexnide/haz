import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, Text } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export type ChevronType = 'sddg' | 'package' | 'complete';

interface SDDGWorkflowHeaderProps {
  currentChevron: ChevronType;
  sddgComplete: boolean;
  packageComplete: boolean;
  onChevronPress?: (chevron: ChevronType) => void;
}

interface ChevronProps {
  title: string;
  icon: React.ReactNode;
  position: 'first' | 'middle' | 'last';
  isActive: boolean;
  isComplete: boolean;
  onPress?: () => void;
  width: number;
  height: number;
}

function WorkflowChevron({
  title,
  icon,
  position,
  isActive,
  isComplete,
  onPress,
  width,
  height,
}: ChevronProps) {
  // Determine colors and styles based on state
  let containerStyle;
  let textColor = '#1D1D1F';
  let iconColor = '#1D1D1F';
  
  if (isActive) {
    containerStyle = [styles.chevronContainer, styles.activeChevron];
    textColor = '#FFFFFF';
    iconColor = '#FFFFFF';
  } else if (isComplete) {
    containerStyle = [styles.chevronContainer, styles.completeChevron];
    textColor = '#FFFFFF';
    iconColor = '#FFFFFF';
  } else {
    containerStyle = [styles.chevronContainer, styles.defaultChevron];
  }

  // Add position-specific styles
  if (position === 'first') {
    containerStyle.push(styles.firstChevron);
  } else if (position === 'last') {
    containerStyle.push(styles.lastChevron);
  } else {
    containerStyle.push(styles.middleChevron);
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={!onPress}
      style={[containerStyle, { width, height }]}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>
        {React.cloneElement(icon as React.ReactElement, { 
          color: iconColor, 
          size: 24 
        })}
      </View>
      
      {/* Title */}
      <Text style={[styles.titleText, { color: textColor }]}>
        {title}
      </Text>
      
      {/* Progress bar for completed chevrons */}
      {isComplete && (
        <View style={styles.progressBar} />
      )}
    </TouchableOpacity>
  );
}

export default function SDDGWorkflowHeader({
  currentChevron,
  sddgComplete,
  packageComplete,
  onChevronPress,
}: SDDGWorkflowHeaderProps) {
  const chevronWidth = Math.floor((screenWidth - 20) / 3); // Account for padding
  const chevronHeight = 80;

  const chevrons = [
    {
      key: 'sddg' as ChevronType,
      title: 'SDDG',
      icon: <MaterialIcons name="description" size={24} />,
      position: 'first' as const,
      isActive: currentChevron === 'sddg',
      isComplete: sddgComplete,
    },
    {
      key: 'package' as ChevronType,
      title: 'Package',
      icon: <MaterialCommunityIcons name="package-variant" size={24} />,
      position: 'middle' as const,
      isActive: currentChevron === 'package',
      isComplete: packageComplete,
    },
    {
      key: 'complete' as ChevronType,
      title: 'Complete',
      icon: <MaterialIcons name="check-circle" size={24} />,
      position: 'last' as const,
      isActive: currentChevron === 'complete',
      isComplete: false, // Complete chevron is never "complete"
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.chevronRow}>
        {chevrons.map((chevron) => (
          <WorkflowChevron
            key={chevron.key}
            title={chevron.title}
            icon={chevron.icon}
            position={chevron.position}
            isActive={chevron.isActive}
            isComplete={chevron.isComplete}
            onPress={() => onChevronPress?.(chevron.key)}
            width={chevronWidth}
            height={chevronHeight}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  chevronContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    position: 'relative',
  },
  firstChevron: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 0,
  },
  middleChevron: {
    borderRightWidth: 0,
  },
  lastChevron: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  activeChevron: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  completeChevron: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  defaultChevron: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E5E5EA',
  },
  iconContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  titleText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  progressBar: {
    position: 'absolute',
    bottom: 4,
    left: 8,
    right: 8,
    height: 4,
    backgroundColor: '#34C759',
    borderRadius: 2,
  },
  chevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});