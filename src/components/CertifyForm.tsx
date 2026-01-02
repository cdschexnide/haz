import DatabaseErrorDisplay from "@/components/DatabaseErrorDisplay";
import SignatureModal from "@/components/SignatureModal";
import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const CertifyForm = ({ navigation }: { navigation: any }) => {
  const { state, store, actions, isLoading, error } = useHazProStore();

  const preparerName = state.hazProPreparerContext.preparer?.preparerName;
  const preparerRank = state.hazProPreparerContext.preparer?.preparerRank;
  const preparerTitle = state.hazProPreparerContext.preparer?.preparerTitle;
  const certificationPlace =
    state.hazProPreparerContext.preparer?.certificationPlace;

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    state.hazProPreparerContext.preparer?.signature || null
  );

  const updateActiveStep = (step: number) => {
    store.hazProPreparerContext.activeStep = step;
  };

  const { navigate } = useNavigationRef();

  useEffect(() => {
    updateActiveStep(5);
  }, []);

  const retryLastSaveOperation = async () => {
    try {
      await actions.saveCurrentShipment("in-progress");
    } catch (error) {
      console.log("Retry failed:", error);
    }
  };

  const retryLastCertifyOperation = async () => {
    try {
      await actions.saveCurrentShipment("completed");
    } catch (error) {
      console.log("Retry failed:", error);
    }
  };

  const handleSignature = (signature: string) => {
    setSignatureDataUrl(signature);
    if (store.hazProPreparerContext.preparer) {
      store.hazProPreparerContext.preparer.signature = signature;
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Certify Shipment</Text>

        {error && (
          <DatabaseErrorDisplay
            error={error}
            service="HazProPreparerProvider"
            operation="saveShipment"
            onRetry={retryLastSaveOperation}
            showTechnicalDetails={false}
          />
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.blue} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signatory Information</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{preparerName || "--"}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.label}>Rank</Text>
              <Text style={styles.value}>{preparerRank || "--"}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.label}>Title</Text>
              <Text style={styles.value}>{preparerTitle || "--"}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{certificationPlace || "--"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Signature</Text>
          {signatureDataUrl ? (
            <View style={styles.signaturePreviewContainer}>
              <View style={styles.signatureBox}>
                <Image
                  source={{ uri: signatureDataUrl }}
                  style={styles.signatureImage}
                  resizeMode="contain"
                />
              </View>
            </View>
          ) : (
            <View style={styles.placeholderBox}>
              <Text style={styles.placeholderText}>No Signature Captured</Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => setShowSignatureModal(true)}
          >
            <Text style={styles.buttonText}>
              {signatureDataUrl ? "Re-sign" : "Sign"}
            </Text>
          </TouchableOpacity>
        </View>

        <SignatureModal
          visible={showSignatureModal}
          onClose={() => setShowSignatureModal(false)}
          onConfirm={signature => {
            handleSignature(signature);
            setShowSignatureModal(false);
          }}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            updateActiveStep(4);
            navigation.goBack();
          }}
          accessibilityLabel="Cancel button"
          accessibilityRole="button"
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveExitButton, isLoading && styles.disabledButton]}
          onPress={async () => {
            try {
              await actions.saveCurrentShipment("in-progress");
              navigate("PreparerHomeStack", { screen: "PreparerHome" });
            } catch (err) {
              console.log("Save failed, but error is handled by store:", err);
            }
          }}
          disabled={isLoading}
          accessibilityLabel="Save and exit button"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Saving..." : "Save & Exit"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.continueButton,
            (!signatureDataUrl || isLoading) && styles.disabledButton,
          ]}
          onPress={async () => {
            try {
              await actions.saveCurrentShipment("completed");
              navigate("PreparerHomeStack", { screen: "PreparerHome" });
            } catch (err) {
              console.log(
                "Certification failed, but error is handled by store:",
                err
              );
            }
          }}
          disabled={!signatureDataUrl || isLoading}
          accessibilityLabel="Certify button"
          accessibilityRole="button"
          accessibilityState={{ disabled: !signatureDataUrl || isLoading }}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "Certifying..." : "Certify"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CertifyForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: 0,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#000",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  singleRow: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#222",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    marginBottom: 8,
  },
  signatureImage: {
    width: "90%",
    height: 130,
    aspectRatio: 100,
  },
  placeholderBox: {
    width: width * 0.9,
    height: 140,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    alignSelf: "center",
    marginVertical: 12,
  },
  placeholderText: {
    color: "#aaa",
    fontSize: 16,
    fontStyle: "italic",
  },
  signButton: {
    backgroundColor: colors.blue,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignSelf: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ffffff",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bee3f8",
  },
  loadingText: {
    marginLeft: 8,
    color: colors.blue,
    fontSize: 14,
    fontWeight: "500",
  },
  signaturePreviewContainer: {
    width: "100%",
    marginTop: 0,
    marginBottom: 10,
  },
  signatureBox: {
    marginTop: 8,
    minHeight: 100,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
  },
});
