import { renderGeneralPackagingRequirementsDocumentNodes } from "../../afmanData/generalPackagingRequirements";
import { useNavigationRef } from "../contexts/NavigationRefProvider/useNavigationRef";
import { cylinderRequirementsForCompressGases } from "../../server/attachment6/tables/tableA6.1";
import { informativeSpecialProvisionsMap } from "../../server/informativeStatements/informativeStatements";
import {
  hazProContextLookup,
  HazProContextLookupInput,
} from "../../server/lookupFunctions/hazProContextLookup";
import { useHazProStore } from "@/stores/useHazProStore";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

const GeneralPackagingAcknowledgementScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const { state, store } = useHazProStore();
  const { navigate } = useNavigationRef();

  console.log(
    "store.hazProPreparerContext.hazardousMaterial: ",
    JSON.stringify(store.hazProPreparerContext.hazardousMaterial)
  );
  useEffect(() => {
    const material = state.hazProPreparerContext.hazardousMaterial;

    if (!material?.properShippingName) return;

    const match = cylinderRequirementsForCompressGases.find(
      entry =>
        entry.name.toUpperCase() ===
          material.properShippingName.toUpperCase() ||
        entry.alternativeName?.toUpperCase() ===
          material.properShippingName.toUpperCase()
    );

    if (match) {
      const cylinderRestriction = {
        ...(match.maxFillingDensityPercent !== undefined && {
          maxFillingDensityLimit: {
            percentage: match.maxFillingDensityPercent,
          },
        }),
        cylinderTypes: match.cylinderTypes,
        massCapacityLimit: {
          kg: 0,
          lbs: 0,
        },
      };

      store.hazProPreparerContext.cylinderRestrictions = cylinderRestriction;
    }
  }, [state.hazProPreparerContext.hazardousMaterial]);

  const handleAcknowledge = () => {
    // Mark general packaging requirements as acknowledged
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
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.generalPackagingRequirementsAcknowledged =
        true;
    }

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
    navigation.navigate("SpecialProvisionsAcknowledgement");
    return;
  };

  const handleReject = () => {
    navigate("PreparerHomeStack", { screen: "PreparerHome" });
  };

  const generalPackagingContent =
    renderGeneralPackagingRequirementsDocumentNodes();

  useEffect(() => {
    const lookupInput: HazProContextLookupInput = {
      context: {
        hazardousMaterial: state.hazProPreparerContext.hazardousMaterial,
        physicalState:
          state.hazProPreparerContext.hazardousMaterial?.physicalState,
      },
      specialProvisionsMap: informativeSpecialProvisionsMap,
      dotCylinderSpecifications: [],
    };

    const lookupOutput = hazProContextLookup(lookupInput);
    if (typeof lookupOutput === "string") {
      return;
    }
    store.hazProPreparerContext.lookupFunctionsOutput = lookupOutput;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>General Packaging Requirements</Text>
      <WebView
        originWhitelist={["*"]}
        source={{ html: generalPackagingContent }}
        style={styles.webView}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleAcknowledge}
        >
          <Text style={styles.buttonText}>Acknowledge Requirements</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleReject}>
          <Text style={styles.cancelButtonText}>Reject Requirements</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GeneralPackagingAcknowledgementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#000",
  },
  webView: {
    flex: 1,
    height: "75%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  cancelButton: {
    flex: 1,
    height: 55,
    borderRadius: 4,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  continueButton: {
    flex: 1,
    height: 55,
    backgroundColor: "#28a745",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
