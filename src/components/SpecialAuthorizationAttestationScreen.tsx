import { useHazProStore } from "@/stores/useHazProStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "react-native-elements";

type SpecialAuthorizationType = "COE" | "CAA" | "DOT-SP";

const SpecialAuthorizationAttestationScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { state, store } = useHazProStore();
  const [isAttested, setIsAttested] = useState(false);

  const authorizationType = useMemo<SpecialAuthorizationType | null>(() => {
    const value = route?.params?.authorizationType;
    if (value === "COE" || value === "CAA" || value === "DOT-SP") {
      return value;
    }
    return null;
  }, [route?.params?.authorizationType]);

  const referenceNumber = useMemo(() => {
    const value = route?.params?.referenceNumber;
    return typeof value === "string" ? value.trim() : "";
  }, [route?.params?.referenceNumber]);

  const handleContinue = () => {
    if (!authorizationType) {
      Alert.alert(
        "Missing Authorization Type",
        "Unable to determine the authorization type. Please return and try again."
      );
      return;
    }

    if (!referenceNumber) {
      Alert.alert(
        "Missing Reference",
        `No ${authorizationType} reference number was provided. Please return and upload a valid document.`
      );
      return;
    }

    if (!isAttested) {
      Alert.alert(
        "Attestation Required",
        "You must attest before continuing to the shipper's declaration."
      );
      return;
    }

    if (
      !store.hazProPreparerContext.specialAuthorizationQuantityAndTypeOfPacking
    ) {
      Alert.alert(
        "Packing Data Required",
        "Enter Key 16 packing data before attesting and continuing."
      );
      return;
    }

    store.hazProPreparerContext.usesCoeCertification =
      authorizationType === "COE";
    store.hazProPreparerContext.usesCaaCertification =
      authorizationType === "CAA";
    store.hazProPreparerContext.usesDotSpPermit =
      authorizationType === "DOT-SP";
    store.hazProPreparerContext.specialAuthorizationType = authorizationType;
    store.hazProPreparerContext.specialAuthorizationReference = referenceNumber;
    store.hazProPreparerContext.specialAuthorizationAttested = true;
    store.hazProPreparerContext.packingInstruction = referenceNumber;

    if (
      !state.hazProPreparerContext.completedSubsteps.includes(
        "SpecialAuthorizationAttestationScreen"
      )
    ) {
      store.hazProPreparerContext.completedSubsteps = [
        ...state.hazProPreparerContext.completedSubsteps,
        "SpecialAuthorizationAttestationScreen",
      ];
    }

    navigation.navigate("ShippersDeclarationScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <MaterialIcons name="verified-user" size={28} color="#1a73e8" />
          <Text style={styles.title}>
            {authorizationType ? `${authorizationType} Attestation` : "Attestation"}
          </Text>
        </View>

        <Text style={styles.subtitle}>
          Confirm the package fully adheres to the criteria and description
          defined in the uploaded authorization document.
        </Text>

        <View style={styles.referenceCard}>
          <Text style={styles.referenceLabel}>Reference Number</Text>
          <Text style={styles.referenceValue}>{referenceNumber || "Not provided"}</Text>
        </View>

        <TouchableOpacity
          style={styles.attestationRow}
          onPress={() => setIsAttested(prev => !prev)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isAttested ? "checkmark-circle" : "ellipse-outline"}
            size={26}
            color={isAttested ? "#1a73e8" : "#8a8a8a"}
          />
          <Text style={styles.attestationText}>
            I attest that this package adheres to the criteria/description in the uploaded {authorizationType || "authorization"} document.
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomButtonsContainer}>
        <Button
          title="Back"
          type="outline"
          buttonStyle={styles.cancelButton}
          titleStyle={styles.cancelButtonText}
          onPress={() => navigation.goBack()}
          containerStyle={styles.bottomButtonContainer}
        />

        <Button
          title="Continue to SDDG"
          buttonStyle={styles.continueButton}
          titleStyle={styles.continueButtonText}
          onPress={handleContinue}
          containerStyle={styles.bottomButtonContainer}
          icon={
            <MaterialIcons
              name="arrow-forward"
              size={20}
              color="white"
              style={{ marginLeft: 8 }}
            />
          }
          iconRight
        />
      </View>
    </SafeAreaView>
  );
};

export default SpecialAuthorizationAttestationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: "700",
    color: "#1a73e8",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#3d3d3d",
    marginBottom: 20,
  },
  referenceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dfe4eb",
    padding: 16,
    marginBottom: 20,
  },
  referenceLabel: {
    fontSize: 13,
    color: "#6f7783",
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2a37",
  },
  attestationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dfe4eb",
    padding: 14,
  },
  attestationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#2f3a47",
  },
  bottomButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "white",
  },
  bottomButtonContainer: {
    flex: 1,
    marginHorizontal: 6,
  },
  cancelButton: {
    borderColor: "#1a73e8",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#1a73e8",
    fontWeight: "600",
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: "#1a73e8",
    borderRadius: 10,
    paddingVertical: 12,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
