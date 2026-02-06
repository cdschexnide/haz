import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  HazardousMaterialItem,
  hazardousMaterialsList,
} from "../../hazardousMaterials/hazardousMaterialsList";
import {
  getDeduplicatedUnids,
  filterMaterialsByUnid,
  DeduplicatedUnidEntry,
} from "./materialLookupUtils";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Prefix = "UN" | "NA" | "ID";

interface MaterialLookupModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (material: HazardousMaterialItem) => void;
  onManualEntry: () => void;
}

const MaterialLookupModal: React.FC<MaterialLookupModalProps> = ({
  visible,
  onClose,
  onSelect,
  onManualEntry,
}) => {
  const [prefix, setPrefix] = useState<Prefix>("UN");
  const [digits, setDigits] = useState("");
  const [mode, setMode] = useState<"search" | "detail">("search");
  const [selectedUnid, setSelectedUnid] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setPrefix("UN");
      setDigits("");
      setMode("search");
      setSelectedUnid(null);
      setSubmitError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  // Clear error when user changes input
  useEffect(() => {
    setSubmitError(null);
  }, [prefix, digits]);

  // Typeahead results — deduplicated UNIDs, excluding all-FORBIDDEN
  const typeaheadResults = useMemo(
    () => getDeduplicatedUnids(hazardousMaterialsList, prefix, digits),
    [prefix, digits]
  );

  // Detail view — non-FORBIDDEN materials for the selected UNID
  const detailMaterials = useMemo(() => {
    if (!selectedUnid) return [];
    return filterMaterialsByUnid(hazardousMaterialsList, selectedUnid);
  }, [selectedUnid]);

  // Shared resolution logic — used by both typeahead tap and Submit button
  const resolveUnid = useCallback(
    (unid: string) => {
      const nonForbidden = filterMaterialsByUnid(
        hazardousMaterialsList,
        unid
      );

      if (nonForbidden.length === 1) {
        // Single match — auto-select and close
        onSelect(nonForbidden[0]);
      } else if (nonForbidden.length > 1) {
        // Multiple matches — show detail picker
        setSelectedUnid(unid);
        setMode("detail");
      } else {
        // All FORBIDDEN or no matches
        setSubmitError(
          `All entries for ${unid} are forbidden for air transport. Use "Enter Manually" to type the value directly.`
        );
      }
    },
    [onSelect]
  );

  const handleTypeaheadSelect = useCallback(
    (entry: DeduplicatedUnidEntry) => {
      resolveUnid(entry.unid);
    },
    [resolveUnid]
  );

  const handleSubmit = useCallback(() => {
    if (digits.length === 0) return;

    const fullUnid = prefix + digits;
    resolveUnid(fullUnid);
  }, [prefix, digits, resolveUnid]);

  const handleDigitsChange = useCallback((text: string) => {
    // Only allow digits
    const cleaned = text.replace(/[^0-9]/g, "");
    setDigits(cleaned);
  }, []);

  const handleBackToSearch = useCallback(() => {
    setMode("search");
    setSelectedUnid(null);
  }, []);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleManualEntry = useCallback(() => {
    onManualEntry();
  }, [onManualEntry]);

  const renderPrefixButton = (p: Prefix) => (
    <TouchableOpacity
      key={p}
      style={[
        styles.prefixButton,
        prefix === p && styles.prefixButtonActive,
      ]}
      onPress={() => setPrefix(p)}
    >
      <Text
        style={[
          styles.prefixButtonText,
          prefix === p && styles.prefixButtonTextActive,
        ]}
      >
        {p}
      </Text>
    </TouchableOpacity>
  );

  const renderTypeaheadItem = ({
    item,
  }: {
    item: DeduplicatedUnidEntry;
  }) => (
    <TouchableOpacity
      style={styles.typeaheadItem}
      onPress={() => handleTypeaheadSelect(item)}
    >
      <Text style={styles.typeaheadUnid}>{item.unid}</Text>
      <Text style={styles.typeaheadSubtitle} numberOfLines={1}>
        {item.subtitle}
      </Text>
    </TouchableOpacity>
  );

  const getDetailPSN = (m: HazardousMaterialItem) =>
    m.details ? `${m.properShippingName}, ${m.details}` : m.properShippingName;

  const getDetailKey = (m: HazardousMaterialItem, index: number) =>
    `${m.unid}-${m.properShippingName}-${m.hazclassDiv}-${index}`;

  const renderDetailItem = ({
    item,
    index,
  }: {
    item: HazardousMaterialItem;
    index: number;
  }) => (
    <TouchableOpacity
      style={styles.detailRow}
      onPress={() => onSelect(item)}
    >
      <Text style={[styles.detailCell, styles.detailCellPSN]} numberOfLines={3}>
        {getDetailPSN(item)}
      </Text>
      <Text style={styles.detailCell}>{item.hazclassDiv || "—"}</Text>
      <Text style={styles.detailCell}>{item.subsidiaryRisk || "—"}</Text>
      <Text style={styles.detailCell}>{item.packingGroup || "—"}</Text>
      <Text style={styles.detailCell}>{item.specialProvision || "—"}</Text>
      <Text style={styles.detailCell}>{item.packagingParagraph}</Text>
    </TouchableOpacity>
  );

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
            {mode === "search" ? (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Material Lookup</Text>
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <MaterialIcons name="close" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                {/* Segmented Control */}
                <View style={styles.segmentedControl}>
                  {(["UN", "NA", "ID"] as Prefix[]).map(renderPrefixButton)}
                </View>

                {/* Numeric Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.prefixLabel}>{prefix}</Text>
                  <TextInput
                    ref={inputRef}
                    style={styles.textInput}
                    value={digits}
                    onChangeText={handleDigitsChange}
                    placeholder="Enter 4-digit number..."
                    placeholderTextColor="#C7C7CC"
                    keyboardType="number-pad"
                    maxLength={4}
                    autoCorrect={false}
                  />
                </View>

                {/* Error Message */}
                {submitError && (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="warning" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{submitError}</Text>
                  </View>
                )}

                {/* Typeahead Results */}
                {digits.length > 0 && !submitError && (
                  <View style={styles.typeaheadContainer}>
                    {typeaheadResults.length > 0 ? (
                      <FlatList
                        data={typeaheadResults}
                        keyExtractor={(item) => item.unid}
                        renderItem={renderTypeaheadItem}
                        style={styles.typeaheadList}
                        keyboardShouldPersistTaps="handled"
                      />
                    ) : (
                      <Text style={styles.noResults}>
                        No materials found for {prefix}{digits}
                      </Text>
                    )}
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      digits.length === 0 && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={digits.length === 0}
                  >
                    <MaterialIcons name="search" size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>

                {/* Manual Entry Fallback */}
                <TouchableOpacity
                  style={styles.manualEntryLink}
                  onPress={handleManualEntry}
                >
                  <MaterialIcons name="edit" size={16} color="#007AFF" />
                  <Text style={styles.manualEntryLinkText}>
                    Enter Manually
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Detail View Header */}
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={handleBackToSearch}
                    style={styles.backButton}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <MaterialIcons
                      name="arrow-back"
                      size={24}
                      color="#007AFF"
                    />
                  </TouchableOpacity>
                  <View style={styles.detailHeaderText}>
                    <Text style={styles.headerTitle}>{selectedUnid}</Text>
                    <Text style={styles.detailSubheader}>
                      {detailMaterials.length} material(s) — select one
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <MaterialIcons name="close" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                {/* Detail Table */}
                <ScrollView horizontal showsHorizontalScrollIndicator>
                  <View>
                    {/* Table Header */}
                    <View style={styles.detailTableHeader}>
                      <Text
                        style={[
                          styles.detailHeaderCell,
                          styles.detailCellPSN,
                        ]}
                      >
                        PSN / Description
                      </Text>
                      <Text style={styles.detailHeaderCell}>
                        {"Hazard\nClass/Div"}
                      </Text>
                      <Text style={styles.detailHeaderCell}>
                        {"Subsidiary\nRisk"}
                      </Text>
                      <Text style={styles.detailHeaderCell}>
                        {"Packing\nGroup"}
                      </Text>
                      <Text style={styles.detailHeaderCell}>
                        {"Special\nProvision"}
                      </Text>
                      <Text style={styles.detailHeaderCell}>
                        {"Packaging\nParagraph"}
                      </Text>
                    </View>

                    {/* Table Body */}
                    <FlatList
                      data={detailMaterials}
                      keyExtractor={(item, index) => getDetailKey(item, index)}
                      renderItem={renderDetailItem}
                      style={styles.detailList}
                      keyboardShouldPersistTaps="handled"
                    />
                  </View>
                </ScrollView>

                {/* Cancel Button */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MaterialLookupModal;

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
    width: "95%",
    maxWidth: 700,
    maxHeight: SCREEN_HEIGHT * 0.8,
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
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  detailHeaderText: {
    flex: 1,
  },
  detailSubheader: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  // Segmented Control
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 2,
    marginBottom: 16,
  },
  prefixButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  prefixButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  prefixButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  prefixButtonTextActive: {
    color: "#007AFF",
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    marginBottom: 12,
  },
  prefixLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#D1D1D6",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1D1D1F",
  },

  // Error
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#FF3B30",
    lineHeight: 18,
  },

  // Typeahead
  typeaheadContainer: {
    maxHeight: 200,
    marginBottom: 12,
  },
  typeaheadList: {
    maxHeight: 200,
  },
  typeaheadItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  typeaheadUnid: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  typeaheadSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  noResults: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    paddingVertical: 16,
  },

  // Buttons
  buttonRow: {
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#B0B0B5",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  manualEntryLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  manualEntryLinkText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },

  // Detail Table
  detailTableHeader: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D1D6",
    paddingVertical: 10,
  },
  detailHeaderCell: {
    width: 100,
    fontSize: 12,
    fontWeight: "700",
    color: "#1D1D1F",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  detailList: {
    maxHeight: SCREEN_HEIGHT * 0.45,
  },
  detailRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    paddingVertical: 12,
    alignItems: "center",
  },
  detailCell: {
    width: 100,
    fontSize: 13,
    color: "#1D1D1F",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  detailCellPSN: {
    width: 180,
    textAlign: "left",
  },

  // Cancel Button
  cancelButton: {
    backgroundColor: "#F2F2F7",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
  },
});
