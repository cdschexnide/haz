import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PackagingScreen = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const isClass2 =
    state.hazProPreparerContext.hazardousMaterial?.hazclassDiv?.startsWith("2");

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  const clearSpecialAuthorizationState = () => {
    store.hazProPreparerContext.usesCoeCertification = false;
    store.hazProPreparerContext.usesCaaCertification = false;
    store.hazProPreparerContext.usesDotSpPermit = false;
    store.hazProPreparerContext.specialAuthorizationType = null;
    store.hazProPreparerContext.specialAuthorizationReference = null;
    store.hazProPreparerContext.specialAuthorizationAttested = false;
    store.hazProPreparerContext.specialAuthorizationPackingDescription = null;
    store.hazProPreparerContext.specialAuthorizationQuantityAndTypeOfPacking =
      null;
    store.hazProPreparerContext.packingInstruction =
      store.hazProPreparerContext.hazardousMaterial?.packagingParagraph || null;
  };

  const handleScanPOP = () => {
    if (isClass2) return;

    clearSpecialAuthorizationState();

    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      "PackagingScreen",
    ];

    if (store.hazProPreparerContext.packaging) {
      store.hazProPreparerContext.packaging.usesDotCylinderMarking = false;
      store.hazProPreparerContext.packaging.usesPopMarking = true;
    }

    // Set entry method to scan
    store.hazProPreparerContext.packagingEntryMethod = 'scan';

    // Initialize inputPOPMarking if needed
    if (store.hazProPreparerContext.packaging && !store.hazProPreparerContext.packaging.inputPOPMarking) {
      store.hazProPreparerContext.packaging.inputPOPMarking = {
        A: null,
        B: null,
        C: null,
        D: null,
        E: null,
        F: null,
        G: null,
        H: null,
      };
    }

    navigation.navigate("POPScannerScreen");
  };

  const handleEnterPOP = () => {
    clearSpecialAuthorizationState();

    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      "PackagingScreen",
    ];

    if (
      state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith("2")
    ) {
      if (store.hazProPreparerContext.packaging) {
        store.hazProPreparerContext.packaging.usesDotCylinderMarking = true;
        store.hazProPreparerContext.packaging.usesPopMarking = false;
      }
      navigation.navigate("CylinderEntryScreen");
    } else {
      if (store.hazProPreparerContext.packaging) {
        store.hazProPreparerContext.packaging.usesDotCylinderMarking = false;
        store.hazProPreparerContext.packaging.usesPopMarking = true;
      }
      // Set entry method to manual
      store.hazProPreparerContext.packagingEntryMethod = 'manual';
      navigation.navigate("ManualEntryPackagingTypeSelectionScreen");
    }
  };

  const handleWalkthrough = () => {
    if (isClass2) return;

    clearSpecialAuthorizationState();

    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      "PackagingScreen",
    ];

    if (store.hazProPreparerContext.packaging) {
      store.hazProPreparerContext.packaging.usesDotCylinderMarking = false;
      store.hazProPreparerContext.packaging.usesPopMarking = true;
    }

    // Set entry method to walkthrough
    store.hazProPreparerContext.packagingEntryMethod = 'walkthrough';

    // Reset PackagingWizardV2 step for fresh start (step 1 is now the first screen)
    store.hazProPreparerContext.packagingWizardStep = 1;
    if (store.hazProPreparerContext.packaging) {
      if (store.hazProPreparerContext.packaging.inputPOPMarking) {
        store.hazProPreparerContext.packaging.inputPOPMarking.B = null;
      }
    }
    if (store.hazProPreparerContext.shipment) {
      store.hazProPreparerContext.shipment.selectedOuterPackaging = null;
    }

    navigation.navigate("PackagingWizardV2");
  };

  const handleUploadCOE = () => {
    clearSpecialAuthorizationState();

    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      "PackagingScreen",
    ];
    navigation.navigate("CoeAndCaaScreen");
  };

  const handleUploadDOTSP = () => {
    clearSpecialAuthorizationState();

    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      "PackagingScreen",
    ];
    navigation.navigate("DotSpScreen");
  };

  return (
    <View style={styles.container}>
      {/* Scan POP Marking Card */}
      <TouchableOpacity
        style={[styles.scanCard, isClass2 && styles.disabledQuadrant]}
        activeOpacity={isClass2 ? 1 : 0.7}
        disabled={isClass2}
        onPress={handleScanPOP}
      >
        <Ionicons name="scan-outline" size={72} color={isClass2 ? colors.darkGrey : colors.white} />
        <Text style={[styles.scanCardText, isClass2 && styles.disabledText]}>
          Scan POP Marking
        </Text>
      </TouchableOpacity>

      {/* Quadrant Grid */}
      <View style={styles.quadrantGrid}>
        {/* Top Left: Enter POP */}
        <TouchableOpacity
          style={styles.quadrant}
          activeOpacity={0.7}
          onPress={handleEnterPOP}
        >
          <MaterialIcons name="edit" size={72} color={colors.white} />
          <Text style={styles.quadrantText}>Enter POP</Text>
        </TouchableOpacity>

        {/* Top Right: Upload COE/CAA */}
        <TouchableOpacity
          style={styles.quadrant}
          activeOpacity={0.7}
          onPress={handleUploadCOE}
        >
          <MaterialCommunityIcons
            name="certificate-outline"
            size={72}
            color={colors.white}
          />
          <Text style={styles.quadrantText}>Upload COE/CAA</Text>
        </TouchableOpacity>

        {/* Bottom Left: Walkthrough */}
        <TouchableOpacity
          style={[styles.quadrant, isClass2 && styles.disabledQuadrant]}
          activeOpacity={isClass2 ? 1 : 0.7}
          onPress={handleWalkthrough}
          disabled={isClass2}
        >
          <MaterialCommunityIcons
            name="compass-outline"
            size={72}
            color={isClass2 ? colors.darkGrey : colors.white}
          />
          <Text style={[styles.quadrantText, isClass2 && styles.disabledText]}>
            Walkthrough
          </Text>
        </TouchableOpacity>

        {/* Bottom Right: Upload DOT-SP */}
        <TouchableOpacity
          style={styles.quadrant}
          activeOpacity={0.7}
          onPress={handleUploadDOTSP}
        >
          <MaterialCommunityIcons
            name="file-document-outline"
            size={72}
            color={colors.white}
          />
          <Text style={styles.quadrantText}>Upload DOT-SP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PackagingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 6,
  },
  quadrantGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
  quadrant: {
    width: "49.5%",
    height: "49.5%",
    backgroundColor: colors.blue,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  disabledQuadrant: {
    backgroundColor: colors.lightGrey,
    borderColor: colors.darkGrey,
  },
  quadrantText: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  disabledText: {
    color: colors.darkGrey,
  },
  scanCard: {
    width: "100%",
    height: 100,
    backgroundColor: colors.blue,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.blue,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  scanCardText: {
    marginLeft: 16,
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
    textAlign: "center",
    letterSpacing: 0.3,
  },
});
