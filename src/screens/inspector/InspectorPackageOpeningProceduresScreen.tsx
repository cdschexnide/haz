import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import type { ContainerType } from "../../types/innerPackaging";
import { OPENING_PROCEDURES, type ProcedureStep } from "../../utils/innerPackagingProcedures";
import { parseContainerTypeFromQuantityPacking } from "../../utils/innerPackagingParser";

interface Props {
  navigation: any;
  route?: {
    params?: {
      continueRoute?: string;
      continueParams?: any;
    };
  };
}

const CONTAINER_TYPE_OPTIONS: Array<{
  value: Exclude<ContainerType, null>;
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}> = [
  { value: "fiberboard-box", label: "Fiberboard Box", icon: "inventory-2" },
  { value: "wood-box", label: "Wood Box", icon: "construction" },
  { value: "drum", label: "Drum", icon: "local-shipping" },
  { value: "overpack", label: "Overpack", icon: "layers" },
  { value: "jerrican", label: "Jerrican", icon: "local-gas-station" },
  { value: "non-specification", label: "Non-Specification", icon: "all-inbox" },
];

export default function InspectorPackageOpeningProceduresScreen({
  navigation,
  route,
}: Props) {
  const { inspection, setPackageOpeningInspection } = useInspectionForm();
  const continueRoute =
    route?.params?.continueRoute || "InspectorSpecialProvisionsScreen";
  const continueParams = route?.params?.continueParams;
  const detectedType = parseContainerTypeFromQuantityPacking(
    inspection?.verificationCopy?.quantityAndPacking ||
      inspection?.extractedContent?.quantityAndPacking ||
      ""
  );
  const [selectedType, setSelectedType] = useState<Exclude<ContainerType, null> | null>(
    (inspection?.packageOpeningInspection?.containerType ||
      detectedType ||
      null) as Exclude<ContainerType, null> | null
  );

  const procedures: ProcedureStep[] = useMemo(
    () => (selectedType ? OPENING_PROCEDURES[selectedType] : []),
    [selectedType]
  );

  const handleContinue = useCallback(() => {
    if (!selectedType || !inspection?.packageOpeningInspection) {
      return;
    }

    setPackageOpeningInspection({
      ...inspection.packageOpeningInspection,
      containerType: selectedType,
      openedAt: inspection.packageOpeningInspection.openedAt || new Date(),
    });
    navigation.navigate("InspectorPackageClosingProceduresScreen", {
      continueRoute,
      continueParams,
    });
  }, [
    continueParams,
    continueRoute,
    inspection?.packageOpeningInspection,
    navigation,
    selectedType,
    setPackageOpeningInspection,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Opening Procedures</Text>
        <Text style={styles.stepIndicator}>1/2</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Select Container Type</Text>
        <View style={styles.typeGrid}>
          {CONTAINER_TYPE_OPTIONS.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.typeCard,
                selectedType === option.value && styles.typeCardSelected,
              ]}
              onPress={() => setSelectedType(option.value)}
            >
              <MaterialIcons
                name={option.icon}
                size={28}
                color={selectedType === option.value ? "#007AFF" : "#8E8E93"}
              />
              <Text
                style={[
                  styles.typeLabel,
                  selectedType === option.value && styles.typeLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedType ? (
          <>
            <Text style={styles.sectionTitle}>Opening Procedures</Text>
            <View style={styles.card}>
              {procedures.map(step => (
                <View
                  key={step.id}
                  style={[
                    styles.procedureRow,
                    step.isWarning && styles.warningRow,
                  ]}
                >
                  <MaterialIcons
                    name={step.isWarning ? "warning" : "check-circle-outline"}
                    size={20}
                    color={step.isWarning ? "#FF9500" : "#34C759"}
                  />
                  <View style={styles.procedureTextWrap}>
                    <Text style={styles.procedureText}>{step.instruction}</Text>
                    <Text style={styles.procedureRef}>{step.afmanRef}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Inner Package Inspection</Text>
            <View style={styles.card}>
              <View style={styles.procedureRow}>
                <MaterialIcons name="visibility" size={20} color="#007AFF" />
                <View style={styles.procedureTextWrap}>
                  <Text style={styles.procedureText}>
                    Perform a visual inspection only. Do not rearrange contents.
                  </Text>
                  <Text style={styles.procedureRef}>A28.2.3.1</Text>
                </View>
              </View>
              <View style={[styles.procedureRow, styles.warningRow]}>
                <MaterialIcons name="warning" size={20} color="#FF9500" />
                <View style={styles.procedureTextWrap}>
                  <Text style={styles.procedureText}>
                    Do not cut wraps or barrier material.
                  </Text>
                  <Text style={styles.procedureRef}>A28.2.3.2</Text>
                </View>
              </View>
              <View style={[styles.procedureRow, styles.warningRow]}>
                <MaterialIcons name="warning" size={20} color="#FF9500" />
                <View style={styles.procedureTextWrap}>
                  <Text style={styles.procedureText}>
                    Changes to the inner configuration are treated as repacking and may require a new shipper certification.
                  </Text>
                  <Text style={styles.procedureRef}>A28.2.3.3</Text>
                </View>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>

      {selectedType ? (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>
              Continue to Closing Procedures
            </Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  content: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 12,
    marginTop: 8,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  typeCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E5EA",
    gap: 8,
  },
  typeCardSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    textAlign: "center",
  },
  typeLabelSelected: {
    color: "#007AFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  procedureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  warningRow: {
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: -4,
  },
  procedureTextWrap: {
    flex: 1,
  },
  procedureText: {
    fontSize: 15,
    color: "#1D1D1F",
    lineHeight: 22,
  },
  procedureRef: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    padding: 16,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
