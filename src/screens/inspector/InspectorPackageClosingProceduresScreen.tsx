import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import type { ContainerType } from "../../types/innerPackaging";
import type { FiberboardClosureMethod } from "../../types/packageOpening";
import {
  CLOSING_PROCEDURES,
  FIBERBOARD_RECLOSURE_METHODS,
  type ProcedureStep,
} from "../../utils/innerPackagingProcedures";

interface Props {
  navigation: any;
  route?: {
    params?: {
      continueRoute?: string;
      continueParams?: any;
    };
  };
}

const deriveNewCertificationRequired = (
  containerType: Exclude<ContainerType, null>,
  fiberboardClosureMethod: FiberboardClosureMethod
) => {
  switch (containerType) {
    case "fiberboard-box":
      return fiberboardClosureMethod === "adhesive-or-stapled";
    case "wood-box":
    case "drum":
      return true;
    case "overpack":
    case "jerrican":
    case "non-specification":
    default:
      return false;
  }
};

export default function InspectorPackageClosingProceduresScreen({
  navigation,
  route,
}: Props) {
  const { inspection, setPackageOpeningInspection } = useInspectionForm();
  const continueRoute =
    route?.params?.continueRoute || "InspectorSpecialProvisionsScreen";
  const continueParams = route?.params?.continueParams;
  const containerType = inspection?.packageOpeningInspection?.containerType;
  const isFiberboard = containerType === "fiberboard-box";
  const [fiberboardMethod, setFiberboardMethod] =
    useState<FiberboardClosureMethod>(
      inspection?.packageOpeningInspection?.fiberboardClosureMethod || null
    );
  const [notes, setNotes] = useState(
    inspection?.packageOpeningInspection?.inspectorNotes || ""
  );

  const procedures: ProcedureStep[] = useMemo(
    () => (containerType ? CLOSING_PROCEDURES[containerType] : []),
    [containerType]
  );

  const newCertificationRequired = useMemo(() => {
    if (!containerType) {
      return false;
    }

    return deriveNewCertificationRequired(containerType, fiberboardMethod);
  }, [containerType, fiberboardMethod]);

  const canContinue = !isFiberboard || fiberboardMethod !== null;

  const handleContinue = useCallback(() => {
    if (!containerType || !inspection?.packageOpeningInspection) {
      return;
    }

    setPackageOpeningInspection({
      ...inspection.packageOpeningInspection,
      fiberboardClosureMethod: isFiberboard ? fiberboardMethod : null,
      newCertificationRequired,
      closedAt: new Date(),
      inspectorNotes: notes.trim(),
    });

    navigation.navigate(continueRoute, continueParams);
  }, [
    containerType,
    continueParams,
    continueRoute,
    fiberboardMethod,
    inspection?.packageOpeningInspection,
    isFiberboard,
    navigation,
    newCertificationRequired,
    notes,
    setPackageOpeningInspection,
  ]);

  if (!containerType) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No container type selected.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Closing Procedures</Text>
          <Text style={styles.stepIndicator}>2/2</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Closing Procedures</Text>
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

          {isFiberboard ? (
            <>
              <Text style={styles.sectionTitle}>How Was the Package Reclosed?</Text>
              <View style={styles.card}>
                {FIBERBOARD_RECLOSURE_METHODS.map(method => {
                  const normalizedMethod: FiberboardClosureMethod =
                    method.value === "tape-only"
                      ? "tape-only"
                      : "adhesive-or-stapled";

                  return (
                    <TouchableOpacity
                      key={method.value}
                      style={[
                        styles.methodOption,
                        fiberboardMethod === normalizedMethod &&
                          styles.methodOptionSelected,
                      ]}
                      onPress={() => setFiberboardMethod(normalizedMethod)}
                    >
                      <MaterialIcons
                        name={
                          fiberboardMethod === normalizedMethod
                            ? "radio-button-checked"
                            : "radio-button-unchecked"
                        }
                        size={24}
                        color={
                          fiberboardMethod === normalizedMethod
                            ? "#007AFF"
                            : "#8E8E93"
                        }
                      />
                      <View style={styles.methodTextWrap}>
                        <Text style={styles.methodLabel}>{method.label}</Text>
                        {method.requiresCertification ? (
                          <Text style={styles.methodWarning}>
                            Requires new shipper certification
                          </Text>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : null}

          <View
            style={[
              styles.certCard,
              newCertificationRequired
                ? styles.certCardWarning
                : styles.certCardGood,
            ]}
          >
            <MaterialIcons
              name={newCertificationRequired ? "warning" : "check-circle"}
              size={24}
              color={newCertificationRequired ? "#FF9500" : "#34C759"}
            />
            <Text style={styles.certText}>
              {newCertificationRequired
                ? "New shipper certification is required."
                : "New shipper certification is not required."}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Inspector Notes</Text>
          <View style={styles.notesBox}>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about the opening or closing..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canContinue && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!canContinue}
          >
            <Text style={styles.continueButtonText}>Complete</Text>
            <MaterialIcons name="check" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  procedureTextWrap: { flex: 1 },
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
  methodOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 8,
  },
  methodOptionSelected: {
    backgroundColor: "#F0F8FF",
  },
  methodTextWrap: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 15,
    color: "#1D1D1F",
  },
  methodWarning: {
    fontSize: 13,
    color: "#FF9500",
    marginTop: 2,
  },
  certCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  certCardGood: {
    backgroundColor: "#F0FFF4",
    borderWidth: 1,
    borderColor: "#34C759",
  },
  certCardWarning: {
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FF9500",
  },
  certText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  notesBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginBottom: 16,
  },
  notesInput: {
    padding: 16,
    minHeight: 90,
    fontSize: 15,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    padding: 16,
  },
  continueButton: {
    backgroundColor: "#34C759",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#1D1D1F",
  },
  backButton: {
    marginTop: 16,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
