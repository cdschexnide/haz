import React, { useCallback, useMemo } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { createInitialPackageOpeningData } from "../../types/packageOpening";

interface Props {
  navigation: any;
  route?: {
    params?: {
      continueRoute?: string;
      continueParams?: any;
    };
  };
}

const RESTRICTED_UN_NUMBERS = ["UN2814", "UN2900", "UN3245"];

/**
 * Checks A28.2.4 exceptions to inspection.
 * Uses hazard class, UN number, Key 19 additional handling info, and Key 17 packing instruction
 * to determine if specialized training is required.
 */
const isRestrictedMaterial = ({
  hazardClass,
  unIdNo,
  additionalHandlingInfo,
  packingInstruction,
}: {
  hazardClass?: string;
  unIdNo?: string;
  additionalHandlingInfo?: string;
  packingInstruction?: string;
}) => {
  const hc = (hazardClass || "").trim().toUpperCase();
  const un = (unIdNo || "").trim().toUpperCase();
  const handling = (additionalHandlingInfo || "").trim().toUpperCase();
  const pi = (packingInstruction || "").trim().toUpperCase();

  // A28.2.4.1 — Radioactive material (Class 7)
  if (hc.startsWith("7")) {
    return { restricted: true, reason: "Radioactive material (A28.2.4.1)" };
  }

  // A28.2.4.2 — Class 1 ammunition and explosives
  if (hc.startsWith("1")) {
    return {
      restricted: true,
      reason: "Class 1 ammunition or explosives (A28.2.4.2)",
    };
  }

  // A28.2.4.3 — Etiological agents or infectious substances
  if (RESTRICTED_UN_NUMBERS.includes(un)) {
    return {
      restricted: true,
      reason: "Infectious substance or etiologic agent (A28.2.4.3)",
    };
  }

  // A28.2.4.4 — Pressurized metal shipping containers or drums
  if (pi.startsWith("A6")) {
    return {
      restricted: true,
      reason: "Pressurized metal container or drum (A28.2.4.4)",
    };
  }

  // A28.2.4.5 — Material identified as "inhalation hazard" (check Key 19)
  if (
    handling.includes("INHALATION HAZARD") ||
    handling.includes("POISON INHALATION HAZARD")
  ) {
    return {
      restricted: true,
      reason: "Inhalation hazard material (A28.2.4.5)",
    };
  }

  return { restricted: false, reason: "" };
};

export default function InspectorPackageOpeningScreen({
  navigation,
  route,
}: Props) {
  const { inspection, setPackageOpeningInspection } = useInspectionForm();

  const continueRoute =
    route?.params?.continueRoute || "InspectorSpecialProvisionsScreen";
  const continueParams = route?.params?.continueParams;

  const verificationCopy =
    inspection?.verificationCopy || inspection?.extractedContent || null;

  const restriction = useMemo(
    () =>
      isRestrictedMaterial({
        hazardClass: verificationCopy?.hazardClass,
        unIdNo: verificationCopy?.unIdNo,
        additionalHandlingInfo: verificationCopy?.additionalHandlingInfo,
        packingInstruction: verificationCopy?.packingInstruction,
      }),
    [
      verificationCopy?.additionalHandlingInfo,
      verificationCopy?.hazardClass,
      verificationCopy?.packingInstruction,
      verificationCopy?.unIdNo,
    ]
  );

  const handleNo = useCallback(() => {
    setPackageOpeningInspection({
      ...createInitialPackageOpeningData(),
      wasOpened: false,
    });
    navigation.navigate(continueRoute, continueParams);
  }, [
    continueParams,
    continueRoute,
    navigation,
    setPackageOpeningInspection,
  ]);

  const proceedToOpeningProcedures = useCallback(() => {
    setPackageOpeningInspection({
      ...createInitialPackageOpeningData(),
      wasOpened: true,
    });
    navigation.navigate("InspectorPackageOpeningProceduresScreen", {
      continueRoute,
      continueParams,
    });
  }, [
    continueParams,
    continueRoute,
    navigation,
    setPackageOpeningInspection,
  ]);

  const handleYes = useCallback(() => {
    if (!restriction.restricted) {
      proceedToOpeningProcedures();
      return;
    }

    Alert.alert(
      "Specialized Training Required",
      `AFMAN 24-604 A28.2.4 limits package opening for this material.\n\n${restriction.reason}\n\nContinue only if you are trained and qualified to open this package.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "I Am Qualified",
          onPress: proceedToOpeningProcedures,
        },
      ]
    );
  }, [proceedToOpeningProcedures, restriction.reason, restriction.restricted]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Package Opening</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <MaterialIcons name="inventory-2" size={48} color="#007AFF" />
          <Text style={styles.questionText}>
            Was the package opened for inspection?
          </Text>
          <Text style={styles.referenceText}>AFMAN 24-604 A28.2.2</Text>

          {restriction.restricted ? (
            <View style={styles.warningBanner}>
              <MaterialIcons name="warning" size={20} color="#FF9500" />
              <Text style={styles.warningText}>
                Restricted material: {restriction.reason}
              </Text>
            </View>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.yesButton} onPress={handleYes}>
              <MaterialIcons name="check-circle" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>YES</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noButton} onPress={handleNo}>
              <MaterialIcons name="cancel" size={22} color="#FFFFFF" />
              <Text style={styles.buttonText}>NO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
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
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    color: "#1D1D1F",
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1D1D1F",
    textAlign: "center",
    marginTop: 16,
  },
  referenceText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
    marginBottom: 24,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FF9500",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#1D1D1F",
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  yesButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  noButton: {
    flex: 1,
    backgroundColor: "#8E8E93",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
