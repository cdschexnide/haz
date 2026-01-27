import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { FrustrationRecord } from "../../../src/types/sddg";

// Import view components
import DecisionView from "./ModalViews/DecisionView";
import EditValueView from "./ModalViews/EditValueView";
import ReportIssueView from "./ModalViews/ReportIssueView";
import FrustrationDetailsView from "./ModalViews/FrustrationDetailsView";
import RecommendedIssueView from "./ModalViews/RecommendedIssueView";

/**
 * Modal state machine
 */
type ModalState =
  | "decision" // Initial: choose edit or report
  | "editing" // Edit mode active
  | "reporting" // Report issue mode
  | "viewing-frustration" // Existing frustration view
  | "recommended-issue"; // Automated detection

interface SDDGFieldModalProps {
  visible: boolean;
  onClose: () => void;
  fieldKey: string;
  fieldLabel: string;
  fieldValue: string;
  existingFrustration?: FrustrationRecord | null;
  recommendedMessage?: string;
  recommendedExpectedValue?: string;
  onSave: (
    fieldKey: string,
    correctValue: string,
    additionalComments?: string
  ) => void;
  onRemove?: (fieldKey: string) => void;
  onValueUpdate?: (fieldKey: string, newValue: string) => void;
  allowValueEdit?: boolean;
  isReinspectionMode?: boolean;
}

/**
 * SDDGFieldModal - Progressive disclosure modal for field editing and compliance reporting
 *
 * Replaces the confusing dual-purpose modal with a clear, guided experience:
 * - Initial state: Choose between edit or report
 * - Edit flow: Clean, auto-saving text editor
 * - Report flow: Deliberate warning + compliance form
 * - Existing frustration: Unified view with action options
 * - Recommended: Automated detection with three paths
 *
 * Business logic unchanged - same callbacks as previous modal
 */
const SDDGFieldModal: React.FC<SDDGFieldModalProps> = ({
  visible,
  onClose,
  fieldKey,
  fieldLabel,
  fieldValue,
  existingFrustration,
  recommendedMessage,
  recommendedExpectedValue,
  onSave,
  onRemove,
  onValueUpdate,
  allowValueEdit = true,
  isReinspectionMode = false,
}) => {
  const [modalState, setModalState] = useState<ModalState>("decision");
  const [additionalComments, setAdditionalComments] = useState("");

  // Auto-determine initial state when modal opens
  useEffect(() => {
    if (visible) {
      if (existingFrustration) {
        setModalState("viewing-frustration");
        setAdditionalComments(existingFrustration.additionalComments || "");
      } else if (recommendedMessage) {
        setModalState("recommended-issue");
        setAdditionalComments(recommendedMessage);
      } else {
        setModalState("decision");
        setAdditionalComments("");
      }
    }
  }, [visible, existingFrustration, recommendedMessage]);

  // Navigation handlers
  const handleChooseEdit = () => setModalState("editing");
  const handleChooseReport = () => setModalState("reporting");
  const handleBackToDecision = () => setModalState("decision");
  const handleBackToFrustrationView = () =>
    setModalState("viewing-frustration");

  // Edit value handler
  const handleSaveEdit = (newValue: string) => {
    if (onValueUpdate) {
      onValueUpdate(fieldKey, newValue);
    }
    // Return to appropriate view
    if (existingFrustration) {
      setModalState("viewing-frustration");
    } else {
      handleClose();
    }
  };

  // Report issue handler
  const handleSubmitReport = (correctValue: string, comments?: string) => {
    onSave(fieldKey, correctValue, comments);
    handleClose();
  };

  const handleKeepFrustrated = () => {
    if (!existingFrustration) return;
    onSave(
      fieldKey,
      existingFrustration.correctValue || "",
      existingFrustration.additionalComments
    );
    handleClose();
  };

  // Resolve frustration handler
  const handleResolve = () => {
    if (onRemove) {
      onRemove(fieldKey);
      handleClose();
    }
  };

  // Dismiss recommended issue
  const handleDismiss = () => {
    handleClose();
  };

  // One-click apply recommended frustration with expected value
  const handleApplyRecommendedFrustration = () => {
    if (recommendedExpectedValue) {
      onSave(fieldKey, recommendedExpectedValue, recommendedMessage);
      handleClose();
    }
  };

  // Close modal and reset state
  const handleClose = () => {
    setAdditionalComments("");
    onClose();
  };

  // Get modal title based on state
  const getModalTitle = (): string => {
    switch (modalState) {
      case "decision":
        return "Review Field";
      case "editing":
        return "Edit Field Value";
      case "reporting":
        return "Report Compliance Issue";
      case "viewing-frustration":
        return "Compliance Issue";
      case "recommended-issue":
        return "Potential Compliance Issue";
      default:
        return "Field Options";
    }
  };

  // Render current view based on state
  const renderView = () => {
    switch (modalState) {
      case "decision":
        return (
          <DecisionView
            fieldLabel={fieldLabel}
            fieldValue={fieldValue}
            onChooseEdit={handleChooseEdit}
            onChooseReport={handleChooseReport}
          />
        );

      case "editing":
        return (
          <EditValueView
            fieldKey={fieldKey}
            fieldLabel={fieldLabel}
            initialValue={fieldValue}
            onSave={handleSaveEdit}
            onBack={
              existingFrustration
                ? handleBackToFrustrationView
                : handleBackToDecision
            }
          />
        );

      case "reporting":
        return (
          <ReportIssueView
            fieldKey={fieldKey}
            fieldLabel={fieldLabel}
            fieldValue={fieldValue}
            recommendedMessage={recommendedMessage}
            initialCorrectValue={undefined}
            onSubmit={handleSubmitReport}
            onBack={handleBackToDecision}
          />
        );

      case "viewing-frustration":
        if (!existingFrustration) {
          // Shouldn't happen, but fallback to decision
          return (
            <DecisionView
              fieldLabel={fieldLabel}
              fieldValue={fieldValue}
              onChooseEdit={handleChooseEdit}
              onChooseReport={handleChooseReport}
            />
          );
        }
        return (
          <FrustrationDetailsView
            fieldLabel={fieldLabel}
            frustration={existingFrustration}
            onEditValue={handleChooseEdit}
            onResolve={handleResolve}
            onKeepFrustrated={handleKeepFrustrated}
            isReinspectionMode={isReinspectionMode}
          />
        );

      case "recommended-issue":
        return (
          <RecommendedIssueView
            fieldLabel={fieldLabel}
            fieldValue={fieldValue}
            recommendedMessage={recommendedMessage || ""}
            expectedValue={recommendedExpectedValue}
            onEdit={handleChooseEdit}
            onReport={handleChooseReport}
            onApplyRecommended={handleApplyRecommendedFrustration}
            onDismiss={handleDismiss}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {getModalTitle()}
              </Text>
              <TouchableOpacity
                onPress={handleClose}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <MaterialIcons name="close" size={24} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {/* Content Area - Renders current view */}
            <View style={styles.content}>{renderView()}</View>

            {/* Footer - Only show close button for certain states */}
            {(modalState === "decision" ||
              modalState === "viewing-frustration") && (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleClose}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default SDDGFieldModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdropTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardView: {
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "98%",
    height: "98%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1D1D1F",
    flex: 1,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    backgroundColor: "#FFFFFF",
  },
  closeButton: {
    backgroundColor: "#F2F2F7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  closeButtonText: {
    color: "#1D1D1F",
    fontSize: 16,
    fontWeight: "600",
  },
});
