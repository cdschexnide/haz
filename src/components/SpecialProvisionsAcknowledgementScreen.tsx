import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import React, { useEffect, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProvisionCard = ({
  code,
  description,
}: {
  code: string;
  description: string;
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.codeContainer}>
          <Text style={styles.provisionCode}>{code}</Text>
        </View>
        <View style={styles.dividerVertical} />
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      </View>
    </View>
  );
};

const ActionButtons = ({
  onAcknowledge,
  onReject,
}: {
  onAcknowledge: () => void;
  onReject: () => void;
}) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={onAcknowledge}
        accessibilityLabel="Acknowledge all special provision requirements"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Acknowledge Requirements</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onReject}
        accessibilityLabel="Reject special provision requirements"
        accessibilityRole="button"
      >
        <Text style={styles.cancelButtonText}>Reject Requirements</Text>
      </TouchableOpacity>
    </View>
  );
};

const SpecialProvisionsAcknowledgementScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const { state, store } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const { navigate } = useNavigationRef();

  const specialProvisionsMap =
    state.hazProPreparerContext.specialProvisionsMap || {};

  // Convert map to array for rendering
  const provisionsList = useMemo(() => {
    return Object.entries(specialProvisionsMap).map(([code, description]) => ({
      code,
      description,
    }));
  }, [specialProvisionsMap]);

  const navigateToNextScreen = () => {
    // Mark special provisions as acknowledged
    if (store.hazProPreparerContext) {
      if (!store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
        store.hazProPreparerContext.modifiersAndRequiredAcknowledgements = {
          generalPackagingRequirementsAcknowledged: false,
          informativeStatementsAcknowledged: false,
          workflowModifiersAcknowledged: false,
          specialProvisionsAcknowledged: false,
          documentNodeInformativeStatements: [],
          documentNodeWorkflowModifiers: [],
          specialProvisionsInformativeStatements: {},
          specialProvisionsWorkflowModifiers: {},
        };
      }
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.specialProvisionsAcknowledged =
        true;
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.workflowModifiersAcknowledged =
        true;
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        "SpecialProvisionsAcknowledgement",
      ];
    }

    // UNID-based routing logic (same as other acknowledgement screens)
    if (state.hazProPreparerContext.isGrandfatheredExplosive === true) {
      navigation.navigate("LabelingAndMarking");
      return;
    }
    const unid = state.hazProPreparerContext.hazardousMaterial?.unid;
    if (unid === "UN3166") {
      navigation.navigate("UN3166FuelEntryScreen");
      return;
    }
    if (unid === "UN2807") {
      navigation.navigate("MagnetizedMaterialPrepScreen");
      return;
    }
    if (unid === "UN3268") {
      navigation.navigate("SafetyDevicesPreparationScreen");
      return;
    }
    if (unid === "UN1845") {
      navigation.navigate("DryIcePrepScreen");
      return;
    }
    if (unid === "UN3090" || unid === "UN3480") {
      navigation.navigate("LithiumBatteriesPrepScreen");
      return;
    }
    if (unid === "UN3529" || unid === "UN3528" || unid === "UN3530") {
      navigation.navigate("EnginesInternalCombustion");
      return;
    }
    if (unid === "UN3171") {
      navigation.navigate("BatteryPoweredVehicle");
      return;
    }
    if (unid === "UN3072" || unid === "UN2990") {
      navigation.navigate("LifeSavingAppliances");
      return;
    }
    if (unid === "UN3316") {
      navigation.navigate("KitPreparationScreen");
      return;
    }
    if (unid === "UN3245" || unid === "UN2900" || unid === "UN2814") {
      navigation.navigate("GeneticallyModifiedOrganisms");
      return;
    }
    if (unid === "UN3363") {
      navigation.navigate("DangerousGoods");
      return;
    }
    if (unid === "UN3508" || unid === "UN3499") {
      navigation.navigate("Capacitors");
      return;
    }
    navigation.navigate("PackagingScreen");
  };

  // Auto-navigate if no special provisions exist
  useEffect(() => {
    if (provisionsList.length === 0) {
      navigateToNextScreen();
    }
  }, []);

  const handleAcknowledge = () => {
    navigateToNextScreen();
  };

  const handleReject = () => {
    if (store.hazProPreparerContext) {
      Object.keys(store.hazProPreparerContext).forEach(key => {
        delete store.hazProPreparerContext[key];
      });
    }
    navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  // Don't render if no provisions (will auto-navigate)
  if (provisionsList.length === 0) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Special Provisions Requirements</Text>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          {provisionsList.map(({ code, description }) => (
            <ProvisionCard key={code} code={code} description={description} />
          ))}
        </ScrollView>

        <ActionButtons
          onAcknowledge={handleAcknowledge}
          onReject={handleReject}
        />
      </View>
    </SafeAreaView>
  );
};

export default SpecialProvisionsAcknowledgementScreen;

const colors = {
  background: "#f0f0f0",
  cardBackground: "#ffffff",
  text: {
    primary: "#212121",
    secondary: "#444444",
    light: "#666666",
  },
  specialProvisions: {
    main: "#d97706",
    light: "#fef3c7",
    border: "#d97706",
  },
  actions: {
    acknowledge: "#28a745",
    reject: "#dc3545",
    border: "#d0d0d0",
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  subheader: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 12,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  scrollView: {
    flex: 1,
    marginBottom: 12,
  },
  scrollViewContent: {
    paddingBottom: 8,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.actions.border,
    borderRadius: 6,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: 60,
  },
  codeContainer: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 70,
  },
  provisionCode: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 0.5,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: "#e0e0e0",
  },
  descriptionContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
  },
  descriptionText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  continueButton: {
    flex: 1,
    height: 55,
    backgroundColor: colors.actions.acknowledge,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cancelButton: {
    flex: 1,
    height: 55,
    borderRadius: 4,
    backgroundColor: colors.actions.reject,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
