import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Vibration,
  View,
  Modal,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export interface SubFieldDefinition {
  key: string;
  label: string;
  description: string;
}

export interface TappableTableCellProps {
  fieldKey: string;
  fieldLabel: string;
  fieldValue: string;
  isFrustrated: boolean;
  isRecommended?: boolean;
  onPress: (fieldKey: string, fieldLabel: string, fieldValue: string) => void;
  children: React.ReactNode;
  subFields?: SubFieldDefinition[];
  frustratedSubFields?: Set<string>;
}

/**
 * Specialized tappable wrapper for table cells in the hazmat table.
 * Uses fixed height (300px) to match tableRow instead of flex layouts.
 *
 * Supports subFields for fields that map to multiple Form 1015 entries
 * (e.g., quantityAndPacking → Fields 18 and 19).
 */
const TappableTableCell: React.FC<TappableTableCellProps> = ({
  fieldKey,
  fieldLabel,
  fieldValue,
  isFrustrated,
  isRecommended = false,
  onPress,
  children,
  subFields,
  frustratedSubFields,
}) => {
  const [showSubFieldPicker, setShowSubFieldPicker] = useState(false);

  // Check if any sub-field is frustrated (for visual state)
  const hasSubFieldFrustration =
    frustratedSubFields &&
    subFields &&
    subFields.some(sf => frustratedSubFields.has(sf.key));

  const effectivelyFrustrated = isFrustrated || hasSubFieldFrustration;

  const handlePress = () => {
    Vibration.vibrate(50);

    // If this field has subFields, show the picker instead of direct onPress
    if (subFields && subFields.length > 0) {
      setShowSubFieldPicker(true);
    } else {
      onPress(fieldKey, fieldLabel, fieldValue);
    }
  };

  const handleSubFieldSelect = (subField: SubFieldDefinition) => {
    setShowSubFieldPicker(false);
    // Call onPress with the sub-field's key and label
    onPress(subField.key, subField.label, fieldValue);
  };

  const handleCloseSubFieldPicker = () => {
    setShowSubFieldPicker(false);
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handlePress}
        style={[
          styles.container,
          !effectivelyFrustrated && styles.defaultBorder,
          effectivelyFrustrated && styles.frustratedBorder,
          isRecommended && !effectivelyFrustrated && styles.recommendedBorder,
        ]}
      >
        {/* Tap indicator for default state */}
        {!effectivelyFrustrated && !isRecommended && (
          <View style={styles.tapIndicator}>
            <View style={styles.tapIconBackground}>
              <MaterialIcons name="touch-app" size={16} color="#007AFF" />
            </View>
          </View>
        )}

        {/* Frustrated overlay indicator */}
        {effectivelyFrustrated && (
          <View style={styles.frustratedOverlay}>
            <View style={styles.frustratedBadge}>
              <MaterialIcons name="warning" size={16} color="#FFFFFF" />
            </View>
          </View>
        )}

        {/* Recommended frustration indicator */}
        {isRecommended && !effectivelyFrustrated && (
          <View style={styles.recommendedIndicator}>
            <MaterialIcons name="error-outline" size={18} color="#F57C00" />
          </View>
        )}

        {/* Render the table cell content */}
        <View
          style={
            effectivelyFrustrated ? styles.frustratedContent : styles.content
          }
        >
          {children}
        </View>
      </TouchableOpacity>

      {/* Sub-field picker modal */}
      {subFields && subFields.length > 0 && (
        <Modal
          visible={showSubFieldPicker}
          transparent
          animationType="fade"
          onRequestClose={handleCloseSubFieldPicker}
        >
          <View style={styles.modalBackdrop}>
            <TouchableOpacity
              style={styles.modalBackdropTouchable}
              activeOpacity={1}
              onPress={handleCloseSubFieldPicker}
            />
            <View style={styles.subFieldPickerContainer}>
              <View style={styles.subFieldPickerHeader}>
                <Text style={styles.subFieldPickerTitle}>
                  Select Field to Review
                </Text>
                <TouchableOpacity
                  onPress={handleCloseSubFieldPicker}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <MaterialIcons name="close" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              <Text style={styles.subFieldPickerSubtitle}>
                This field contains multiple data elements. Select which one you
                want to review:
              </Text>

              <View style={styles.subFieldOptions}>
                {subFields.map(subField => {
                  const isSubFieldFrustrated =
                    frustratedSubFields?.has(subField.key) ?? false;

                  return (
                    <TouchableOpacity
                      key={subField.key}
                      style={[
                        styles.subFieldOption,
                        isSubFieldFrustrated && styles.subFieldOptionFrustrated,
                      ]}
                      onPress={() => handleSubFieldSelect(subField)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.subFieldOptionContent}>
                        <Text
                          style={[
                            styles.subFieldOptionLabel,
                            isSubFieldFrustrated &&
                              styles.subFieldOptionLabelFrustrated,
                          ]}
                        >
                          {subField.label}
                        </Text>
                        <Text style={styles.subFieldOptionDescription}>
                          {subField.description}
                        </Text>
                      </View>
                      <View style={styles.subFieldOptionIcon}>
                        {isSubFieldFrustrated ? (
                          <MaterialIcons
                            name="warning"
                            size={20}
                            color="#FF3B30"
                          />
                        ) : (
                          <MaterialIcons
                            name="chevron-right"
                            size={24}
                            color="#8E8E93"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.subFieldCancelButton}
                onPress={handleCloseSubFieldPicker}
              >
                <Text style={styles.subFieldCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default React.memo(TappableTableCell);

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: "100%",
  },
  defaultBorder: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#94A3B8",
    backgroundColor: "rgba(0, 122, 255, 0.02)",
    borderRadius: 6,
  },
  tapIndicator: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 5,
    opacity: 0.7,
  },
  tapIconBackground: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  frustratedBorder: {
    borderLeftWidth: 3,
    borderLeftColor: "#FF3B30",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#FF3B30",
    borderRightColor: "#FF3B30",
    borderBottomColor: "#FF3B30",
    borderRadius: 4,
    backgroundColor: "rgba(255, 59, 48, 0.05)",
  },
  recommendedBorder: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#F57C00",
    borderRadius: 4,
    backgroundColor: "rgba(255, 140, 0, 0.15)",
  },
  frustratedOverlay: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 10,
  },
  frustratedBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  recommendedIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 2,
  },
  content: {
    height: "100%",
    width: "100%",
  },
  frustratedContent: {
    height: "100%",
    width: "100%",
    opacity: 0.95,
  },
  // Sub-field picker modal styles
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdropTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  subFieldPickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "85%",
    maxWidth: 400,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  subFieldPickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  subFieldPickerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  subFieldPickerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 20,
  },
  subFieldOptions: {
    gap: 12,
  },
  subFieldOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  subFieldOptionFrustrated: {
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    borderColor: "#FF3B30",
  },
  subFieldOptionContent: {
    flex: 1,
  },
  subFieldOptionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  subFieldOptionLabelFrustrated: {
    color: "#FF3B30",
  },
  subFieldOptionDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  subFieldOptionIcon: {
    marginLeft: 12,
  },
  subFieldCancelButton: {
    marginTop: 16,
    backgroundColor: "#F2F2F7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  subFieldCancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
  },
});
