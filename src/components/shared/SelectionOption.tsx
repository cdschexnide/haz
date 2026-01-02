import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SelectionOptionProps {
  title: string;
  details?: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const SelectionOption: React.FC<SelectionOptionProps> = ({
  title,
  details,
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
  // Process any children to apply disabled styling
  const processChildrenWithDisabled = (children: React.ReactNode): React.ReactNode => {
    if (!disabled) return children;

    if (React.isValidElement(children)) {
      // Add the isDisabled prop to any component that accepts it
      const childProps = { ...children.props };

      // Handle exception container specially
      if (children.props.style &&
        Array.isArray(children.props.style) &&
        children.props.style.includes(styles.exceptionContainer)) {
        childProps.style = [
          ...(Array.isArray(children.props.style) ? children.props.style : [children.props.style]),
          styles.disabledExceptionContainer
        ];
      }

      // Add isDisabled prop if the component accepts it
      if ('isDisabled' in children.props) {
        childProps.isDisabled = true;
      }

      // Process children recursively
      if (children.props.children) {
        childProps.children = processChildrenWithDisabled(children.props.children);
      }

      return React.cloneElement(children, childProps);
    }

    // Handle arrays of children
    if (Array.isArray(children)) {
      return React.Children.map(children, child => processChildrenWithDisabled(child));
    }

    return children;
  };

  return (
    <TouchableOpacity
      style={[
        styles.selectionCard,
        isSelected && styles.selectedCard,
        disabled && styles.disabledCard
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={styles.selectionItem}>
        <View style={styles.selectionContent}>
          <View style={styles.titleRow}>
            <Text style={[
              styles.selectionTitle,
              disabled && styles.disabledText
            ]}>
              {title}
            </Text>
            {warningMessage && (
              <Text style={styles.warningText}>
                <MaterialIcons name="error-outline" size={16} color="#D32F2F" />
                {" " + warningMessage}
              </Text>
            )}
          </View>

          {/* Process any child components to add disabled styling */}
          {details && processChildrenWithDisabled(details)}
        </View>
        <View style={styles.selectionCheckbox}>
          {isSelected ? (
            <MaterialIcons name="radio-button-checked" size={24} color={disabled ? "#BDBDBD" : "#007AFF"} />
          ) : (
            <MaterialIcons name="radio-button-unchecked" size={24} color={disabled ? "#BDBDBD" : "#8E8E93"} />
          )}
        </View>
      </View>

      {disabled && (
        <View style={styles.disabledOverlay} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  selectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EBEBEB', // Light border for better separation
    position: 'relative', // For the overlay
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  disabledCard: {
    borderColor: '#D8D8D8',
    backgroundColor: '#FFFFFF', // Keep white background
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.08)', // Slightly darker overlay
    borderRadius: 8,
    zIndex: 1,
  },
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  selectionContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  disabledText: {
    color: '#9E9E9E', // Darker gray for better readability
  },
  warningText: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '500',
    flex: 1,
  },
  selectionCheckbox: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },

  // These styles are used for reference in the processChildrenWithDisabled function
  exceptionContainer: {
    marginTop: 8,
    backgroundColor: '#FFF8E1',
    borderRadius: 6,
    padding: 8,
  },
  disabledExceptionContainer: {
    backgroundColor: '#FAFAFA', // Light gray instead of yellow
    borderColor: '#EBEBEB',
    borderWidth: 1,
  },
});