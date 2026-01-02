import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface SimpleFieldEditModalProps {
  visible: boolean;
  onClose: () => void;
  fieldLabel: string;
  fieldValue: string;
  onSave: (newValue: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

/**
 * SimpleFieldEditModal
 *
 * A simplified modal for text input without frustration reporting.
 * Used specifically for manual SDDG data entry.
 */
const SimpleFieldEditModal: React.FC<SimpleFieldEditModalProps> = ({
  visible,
  onClose,
  fieldLabel,
  fieldValue,
  onSave,
  multiline = false,
  placeholder = "Enter value...",
}) => {
  const [inputValue, setInputValue] = useState(fieldValue);
  const inputRef = useRef<TextInput>(null);

  // Sync input value with prop when modal becomes visible
  useEffect(() => {
    if (visible) {
      setInputValue(fieldValue);
      // Auto-focus the input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [visible, fieldValue]);

  const handleSave = () => {
    onSave(inputValue);
    onClose();
  };

  const handleCancel = () => {
    setInputValue(fieldValue); // Reset to original value
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCancel}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Edit Field</Text>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={styles.closeButton}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <MaterialIcons name="close" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* Field Label */}
              <View style={styles.labelContainer}>
                <Text style={styles.fieldLabel}>{fieldLabel}</Text>
              </View>

              {/* Text Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  style={[
                    styles.textInput,
                    multiline && styles.multilineInput,
                  ]}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder={placeholder}
                  placeholderTextColor="#C7C7CC"
                  multiline={multiline}
                  numberOfLines={multiline ? 4 : 1}
                  textAlignVertical={multiline ? "top" : "center"}
                  autoCapitalize="sentences"
                  autoCorrect={false}
                />
              </View>

              {/* Character Count (for multiline) */}
              {multiline && (
                <Text style={styles.characterCount}>
                  {inputValue.length} characters
                </Text>
              )}

              {/* Action Buttons */}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <MaterialIcons
                    name="check"
                    size={20}
                    color="#FFFFFF"
                    style={styles.saveIcon}
                  />
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SimpleFieldEditModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxWidth: 500,
    maxHeight: SCREEN_HEIGHT * 0.7,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D1D1F",
  },
  closeButton: {
    padding: 4,
  },
  labelContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 4,
  },
  inputContainer: {
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1D1D1F",
    backgroundColor: "#F9F9F9",
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "right",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#8E8E93",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  saveIcon: {
    marginRight: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
