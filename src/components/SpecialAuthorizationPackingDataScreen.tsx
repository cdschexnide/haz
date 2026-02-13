import { useHazProStore } from "@/stores/useHazProStore";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button } from "react-native-elements";

type SpecialAuthorizationType = "COE" | "CAA" | "DOT-SP";

const formatQuantity = (value: number): string => {
  if (!Number.isFinite(value)) return "";
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(3).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
};

const normalizeInput = (value: string) => value.trim().replace(/\s+/g, " ");

const SpecialAuthorizationPackingDataScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const { state, store } = useHazProStore();
  const ctx = state.hazProPreparerContext;

  const [packingDescription, setPackingDescription] = useState(
    ctx.specialAuthorizationPackingDescription || ""
  );

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

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, [store.hazProPreparerContext]);

  const packagingType = ctx.packaging?.packagingType || "";
  const isCombinationPackaging =
    packagingType === "Combination" || packagingType === "Composite";

  const quantityData = useMemo(() => {
    const totalLiters = ctx.packaging?.totalNetVolume?.liters ?? 0;
    const totalKg = ctx.packaging?.totalNetMass?.kg ?? 0;
    const isLiquidLike = totalLiters > 0 && totalKg <= 0;

    const totalValue = isLiquidLike ? totalLiters : totalKg;
    const unit = isLiquidLike ? "L" : "KG";

    const innerCount =
      ctx.packaging?.combinationPackaging?.numberOfInnerContainers ?? null;
    const perInnerValue = isLiquidLike
      ? ctx.packaging?.combinationPackaging?.volumePerInnerContainer?.liters ?? null
      : ctx.packaging?.combinationPackaging?.massPerInnerContainer?.kg ?? null;

    return {
      isLiquidLike,
      totalValue,
      unit,
      innerCount,
      perInnerValue,
    };
  }, [ctx.packaging]);

  const quantitySuffix = useMemo(() => {
    if (!quantityData.totalValue || quantityData.totalValue <= 0) {
      return "";
    }

    const base = `${formatQuantity(quantityData.totalValue)} ${quantityData.unit}`;

    if (
      isCombinationPackaging &&
      quantityData.innerCount &&
      quantityData.innerCount > 0 &&
      quantityData.perInnerValue &&
      quantityData.perInnerValue > 0
    ) {
      return `${base} (${quantityData.innerCount} x ${formatQuantity(
        quantityData.perInnerValue
      )} ${quantityData.unit} each)`;
    }

    return base;
  }, [isCombinationPackaging, quantityData]);

  const key16Preview = useMemo(() => {
    const normalizedDescription = normalizeInput(packingDescription);
    if (!normalizedDescription) return "";
    if (!quantitySuffix) return normalizedDescription;
    return `${normalizedDescription} x ${quantitySuffix}`;
  }, [packingDescription, quantitySuffix]);

  const handleContinue = () => {
    if (!authorizationType) {
      Alert.alert(
        "Missing Authorization Type",
        "Unable to determine authorization type. Please return and try again."
      );
      return;
    }

    if (!referenceNumber) {
      Alert.alert(
        "Missing Reference",
        "Authorization reference number is missing. Please return and upload again."
      );
      return;
    }

    const normalizedDescription = normalizeInput(packingDescription);
    if (!normalizedDescription) {
      Alert.alert(
        "Packing Description Required",
        "Enter type of packing text for SDDG Key 16 (e.g., '1 Wooden Box')."
      );
      return;
    }

    if (!quantitySuffix) {
      Alert.alert(
        "Quantity Required",
        "Quantity data is missing. Enter quantity in Quantity Entry before continuing."
      );
      return;
    }

    const finalKey16 = `${normalizedDescription} x ${quantitySuffix}`;
    store.hazProPreparerContext.specialAuthorizationPackingDescription =
      normalizedDescription;
    store.hazProPreparerContext.specialAuthorizationQuantityAndTypeOfPacking =
      finalKey16;

    if (
      !ctx.completedSubsteps.includes("SpecialAuthorizationPackingDataScreen")
    ) {
      store.hazProPreparerContext.completedSubsteps = [
        ...ctx.completedSubsteps,
        "SpecialAuthorizationPackingDataScreen",
      ];
    }

    navigation.navigate("SpecialAuthorizationAttestationScreen", {
      authorizationType,
      referenceNumber,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <MaterialIcons name="inventory-2" size={28} color="#1a73e8" />
          <Text style={styles.title}>
            {authorizationType ? `${authorizationType} Packing Data` : "Packing Data"}
          </Text>
        </View>

        <Text style={styles.subtitle}>
          Enter the packing description for Key 16. Quantity values are pulled
          from Quantity Entry and combined automatically.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Reference Number</Text>
          <Text style={styles.cardValue}>{referenceNumber || "Not provided"}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Detected Quantity Summary</Text>
          <Text style={styles.cardValue}>{quantitySuffix || "No quantity data found"}</Text>
          {isCombinationPackaging && (
            <Text style={styles.helperText}>
              Combination packaging detected. Inner-package details are included
              when available.
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Type of Packing</Text>
          <TextInput
            style={styles.input}
            value={packingDescription}
            onChangeText={setPackingDescription}
            placeholder="e.g., 1 Wooden Box"
            placeholderTextColor="#8a8a8a"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Key 16 Preview</Text>
          <Text style={styles.previewText}>{key16Preview || "Preview will appear here"}</Text>
        </View>
      </ScrollView>

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
          title="Continue"
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

export default SpecialAuthorizationPackingDataScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dfe4eb",
    padding: 14,
  },
  cardLabel: {
    fontSize: 13,
    color: "#6f7783",
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2a37",
  },
  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: "#5e6774",
    lineHeight: 18,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2f3a47",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d8e0",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1f2a37",
  },
  previewText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#1f2a37",
    fontWeight: "500",
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
