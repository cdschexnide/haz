import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { attachment10DocumentNodesList } from "../../server/attachment10/documentNodes/A10";
import { attachment11DocumentNodesList } from "../../server/attachment11/documentNodes/A11";
import { attachment12DocumentNodesList } from "../../server/attachment12/documentNodes/A12";
import { attachment13DocumentNodesList } from "../../server/attachment13/documentNodes/A13";
import { attachment5DocumentNodesList } from "../../server/attachment5/documentNodes/A5";
import { attachment6DocumentNodesList } from "../../server/attachment6/documentNodes/A6";
import { attachment7DocumentNodesList } from "../../server/attachment7/documentNodes/A7";
import { attachment8DocumentNodesList } from "../../server/attachment8/documentNodes/A8";
import { attachment9DocumentNodesList } from "../../server/attachment9/documentNodes/A9";
import renderDocumentNodes from "../../server/renderDocumentNodes/renderDocumentNodes";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { RequiredLabel } from "@/utils/labelingRequirements";
import { RequiredMarking } from "@/utils/markingRequirements";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Card } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { packagingCodeMap } from "@/utils/getContainerDescriptionFromPackagingCode";

const { width, height } = Dimensions.get("window");

const LabelRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.labelRow}>
    <Text style={styles.labelKey}>{label}</Text>
    {value !== undefined && value !== "" && (
      <Text style={styles.labelValue}>{value}</Text>
    )}
  </View>
);

const LabelingAndMarking = ({ navigation }: { navigation: any }) => {
  const {
    state,
    store,
    actions,
    requiredMarkings,
    requiredLabels,
    saveCurrentShipment,
  } = useHazProStore();
  const { navigate } = useNavigationRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [activeTab, setActiveTab] = useState<"packaging" | "absorbent">(
    "packaging"
  );
  const [selectedMaterial, setSelectedMaterial] = useState<
    "vermiculite" | "diatomaceousEarth"
  >("vermiculite");
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const hazardousMaterial = state.hazProPreparerContext.hazardousMaterial;
  const packaging = state.hazProPreparerContext.packaging;
  const isVehicle =
    state.hazProPreparerContext.hazardousMaterial?.unid === "UN3166";
  const isExceptedQuantity = state.hazProPreparerContext.isExceptedQuantity;
  const isLimitedQuantity = state.hazProPreparerContext.isLimitedQuantity;

  const markingsForRenderer: Record<string, string[]> = {};
  requiredMarkings.forEach(marking => {
    markingsForRenderer[marking.id] = [marking.label];
  });

  const labelsForRenderer: Record<string, string[]> = {};
  requiredLabels.forEach(label => {
    labelsForRenderer[label.id] = [label.label];
  });

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 3;
    actions.updateRequiredMarkingsAndLabels();
  }, [
    state.hazProPreparerContext.hazardousMaterial,
    state.hazProPreparerContext.packaging,
    state.hazProPreparerContext.lithiumBatteryData,
    state.hazProPreparerContext.dryIceData,
    state.hazProPreparerContext.technicalName,
    state.hazProPreparerContext.isLithiumBatteryExceptedQuantity,
    state.hazProPreparerContext.isLimitedQuantity,
    state.hazProPreparerContext.usesCaaCertification,
    state.hazProPreparerContext.usesCoeCertification,
    state.hazProPreparerContext.lookupFunctionsOutput,
  ]);

  console.log(
    "store.hazProPreparerContext.requiredMarkingsArray ",
    JSON.stringify(store.hazProPreparerContext.requiredMarkingsArray, null, 2)
  );
  console.log(
    "store.hazProPreparerContext.requiredLabelsArray ",
    JSON.stringify(store.hazProPreparerContext.requiredLabelsArray, null, 2)
  );

  const getDocumentNodesList = (paragraph: string) => {
    const attachmentNumber = paragraph.split(".")[0].substring(1);
    switch (attachmentNumber) {
      case "5":
        return attachment5DocumentNodesList;
      case "6":
        return attachment6DocumentNodesList;
      case "7":
        return attachment7DocumentNodesList;
      case "8":
        return attachment8DocumentNodesList;
      case "9":
        return attachment9DocumentNodesList;
      case "10":
        return attachment10DocumentNodesList;
      case "11":
        return attachment11DocumentNodesList;
      case "12":
        return attachment12DocumentNodesList;
      case "13":
        return attachment13DocumentNodesList;
      default:
        return [];
    }
  };

  const handleInfoPress = () => {
    const packagingParagraph =
      state.hazProPreparerContext.hazardousMaterial?.packagingParagraph;
    if (packagingParagraph) {
      const documentNodesList = getDocumentNodesList(packagingParagraph);
      const renderedContent = renderDocumentNodes(
        packagingParagraph,
        documentNodesList
      );
      setModalContent(renderedContent);
      setIsModalVisible(true);
    }
  };

  const renderMarking = (marking: RequiredMarking) => {
    if (marking.renderType === "pop" && marking.metadata) {
      return (
        <View key={marking.id} style={styles.labelRow}>
          <Text style={styles.labelKey}>{marking.label}</Text>
          <View style={styles.popRow}>
            <View style={styles.unCircle}>
              <Text style={styles.unText}>UN</Text>
            </View>
            <Text style={styles.popText}>
              {`${marking.metadata.B}/${marking.metadata.C} ${marking.metadata.D}`}
              {marking.metadata.E && `/${marking.metadata.E}`}
              {marking.metadata.F && `/${marking.metadata.F}`}
              {marking.metadata.G && `/${marking.metadata.G}`}
              {marking.metadata.H && `/${marking.metadata.H}`}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <LabelRow
        key={marking.id}
        label={marking.label}
        value={marking.displayValue || marking.value}
      />
    );
  };

  const renderLabel = (label: RequiredLabel) => {
    return <LabelRow key={label.id} label={label.label} value={label.value} />;
  };

  const renderAbsorbentContent = () => {
    const absorbentMaterial =
      state.hazProPreparerContext.lookupFunctionsOutput
        ?.absorbentCushioningCriteria?.absorbentMaterial;
    if (!absorbentMaterial) return null;

    const material = absorbentMaterial[selectedMaterial];

    return (
      <ScrollView style={styles.modalBody}>
        <Text style={styles.label}>Select material type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMaterial}
            onValueChange={itemValue => setSelectedMaterial(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000"
          >
            <Picker.Item label="Vermiculite" value="vermiculite" />
            <Picker.Item label="Diatomaceous Earth" value="diatomaceousEarth" />
          </Picker>
        </View>

        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>
            {selectedMaterial === "vermiculite"
              ? "Vermiculite"
              : "Diatomaceous Earth"}
          </Card.Title>
          <Card.Divider />

          <View style={styles.rowSection}>
            <View style={styles.column}>
              <Text style={styles.sectionHeader}>Sides</Text>
              <Text style={styles.materialText}>cm: {material.sides.cm}</Text>
              <Text style={styles.materialText}>in: {material.sides.in}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.sectionHeader}>Top/Bottom</Text>
              <Text style={styles.materialText}>
                cm: {material.topBottom.cm}
              </Text>
              <Text style={styles.materialText}>
                in: {material.topBottom.in}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.sectionHeader}>
                Absorbent Sheet Materials
              </Text>
              <Text style={styles.materialText}>
                {absorbentMaterial.absorbentSheetMaterials}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.sectionHeader}>Cellulosic Particulate</Text>
              <Text style={styles.materialText}>
                {absorbentMaterial.cellulosicParticulate}
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    );
  };

  // Excepted Quantities are EXEMPT from labels - should not reach this screen
  // But if they do, auto-navigate to the confirmation screen
  if (isExceptedQuantity) {
    React.useEffect(() => {
      navigation.navigate("ExceptedQuantityConfirmationScreen");
    }, []);
    return null;
  }

  if (isVehicle) {
    return (
      <ScrollView>
        <View style={styles.vehicleContainer}>
          <Text style={styles.header}>Required Labels and Markings</Text>
          <View style={{ marginTop: 24, paddingHorizontal: 12 }}>
            <Text style={styles.vehicleNotice}></Text>
            <View style={styles.warningRow}>
              <Ionicons
                name="warning"
                size={40}
                color="#fdd14f"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.warningText}>
                Vehicles do not require labels or markings, unless crated and/or
                packaged.
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              store.hazProPreparerContext.activeStep = 2;
              store.hazProPreparerContext.completedSubsteps =
                completedSubsteps.slice(0, -1);
              navigation.goBack();
            }}
            accessibilityLabel="Cancel button"
            accessibilityRole="button"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveExitButton}
            onPress={() => {
              saveCurrentShipment("in-progress");
              navigate("PreparerHomeStack", { screen: "PreparerHome" });
            }}
          >
            <Text style={styles.buttonText}>Save & Exit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              store.hazProPreparerContext.completedSubsteps = [
                ...completedSubsteps,
                "LabelingAndMarking",
              ];
              navigation.navigate("ShippersDeclarationScreen");
            }}
          >
            <Text style={styles.buttonText}>Save & Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.container}>
            {/* Limited Quantity informational banner */}
            {isLimitedQuantity && (
              <View style={styles.limitedQuantityBanner}>
                <Ionicons name="information-circle" size={24} color="#f59e0b" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.limitedQuantityTitle}>Limited Quantity Notice</Text>
                  <Text style={styles.limitedQuantityText}>
                    This shipment qualifies as a Limited Quantity. While you DO NOT need UN specification
                    packaging (no POP marking), you still MUST apply the hazard labels shown below.
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.panelContainer}>
              <View style={styles.leftPanel}>
                <View style={styles.sectionBox}>
                  <Text style={styles.header}>Required Markings</Text>
                  <ScrollView style={styles.scrollSection}>
                    {requiredMarkings.map(marking => renderMarking(marking))}
                  </ScrollView>
                </View>

                <View style={[styles.sectionBox, { marginTop: height * 0.03 }]}>
                  <Text style={styles.header}>Required Labels</Text>
                  <ScrollView style={styles.scrollSection}>
                    {requiredLabels.map(label => renderLabel(label))}
                  </ScrollView>
                </View>
              </View>

              {/* PLACEHOLDER BLOCK FOR PACKAGE RENDERING */}
              <View style={styles.rightPanel}>
                {state.hazProPreparerContext.hazardousMaterial
                  ?.packagingParagraph && (
                  <View style={styles.packagingHeader}>
                    <Text style={styles.header}>Packaging Information</Text>
                    <TouchableOpacity
                      onPress={handleInfoPress}
                      style={styles.infoButton}
                    >
                      <Ionicons
                        name="information-circle"
                        size={24}
                        color={colors.blue}
                      />
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.clinPlaceholderBox}>
                  <Text style={styles.clinPlaceholderText}>CLIN 007:</Text>
                  <Text style={styles.clinPlaceholderText}>
                    Suggested label/marking placement rendering
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              store.hazProPreparerContext.activeStep = 2;
              store.hazProPreparerContext.completedSubsteps =
                completedSubsteps.slice(0, -1);
              navigation.goBack();
            }}
            accessibilityLabel="Cancel button"
            accessibilityRole="button"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveExitButton}
            onPress={() => {
              saveCurrentShipment("in-progress");
              navigate("PreparerHomeStack", { screen: "PreparerHome" });
            }}
          >
            <Text style={styles.buttonText}>Save & Exit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              store.hazProPreparerContext.completedSubsteps = [
                ...completedSubsteps,
                "LabelingAndMarking",
              ];
              navigation.navigate("ShippersDeclarationScreen");
            }}
          >
            <Text style={styles.buttonText}>Save & Continue</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Packaging Information</Text>
                <TouchableOpacity
                  onPress={() => setIsModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {state.hazProPreparerContext.lookupFunctionsOutput
                ?.absorbentCushioningCriteria && (
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === "packaging" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("packaging")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "packaging" && styles.activeTabText,
                      ]}
                    >
                      Packaging
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tab,
                      activeTab === "absorbent" && styles.activeTab,
                    ]}
                    onPress={() => setActiveTab("absorbent")}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        activeTab === "absorbent" && styles.activeTabText,
                      ]}
                    >
                      Absorbent
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeTab === "packaging" ? (
                <View style={styles.modalBody}>
                  <WebView
                    source={{
                      html: `
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                        <style>
                          body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                            font-size: 16px;
                            line-height: 1.5;
                            color: #333;
                            padding: 16px;
                          }
                          strong {
                            color: #0b2e59;
                          }
                        </style>
                      </head>
                      <body>
                        ${modalContent}
                      </body>
                    </html>
                  `,
                    }}
                    style={styles.webview}
                    scrollEnabled={true}
                  />
                </View>
              ) : (
                renderAbsorbentContent()
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.02,
    paddingBottom: 0,
    backgroundColor: "white",
  },
  vehicleContainer: {
    flex: 1,
    padding: width * 0.02,
    paddingBottom: 0,
    height: 470,
    backgroundColor: "white",
  },
  limitedQuantityBanner: {
    flexDirection: "row",
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: "flex-start",
  },
  limitedQuantityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 4,
  },
  limitedQuantityText: {
    fontSize: 14,
    color: "#78350f",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
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
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
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
  panelContainer: {
    flexDirection: "row",
  },
  leftPanel: {
    width: "60%",
    paddingRight: width * 0.03,
  },
  rightPanel: {
    width: "40%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  sectionBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: width * 0.01,
    paddingVertical: width * 0.005,
    backgroundColor: "#f9f9f9",
  },
  sectionBox2: {
    padding: width * 0.01,
    paddingVertical: width * 0.005,
    marginBottom: 15,
  },
  scrollSection: {
    maxHeight: height * 0.25,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  itemBox: {
    marginBottom: height * 0.015,
  },
  itemKey: {
    fontWeight: "bold",
    marginBottom: height * 0.005,
  },
  itemText: {
    color: "#333",
    fontSize: 16,
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: height * 0.02,
  },
  imagePlaceholder: {
    width: "85%",
    height: height * 0.5,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  popRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 4,
    marginLeft: 15,
  },
  unCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  unText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  popText: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1,
  },
  labelRow: {
    marginBottom: height * 0.015,
  },
  labelKey: {
    fontWeight: "600",
    fontSize: 15,
    color: "#333",
    marginBottom: 4,
  },
  labelValue: {
    fontSize: 16,
    color: "#555",
    marginLeft: 20,
  },
  vehicleNotice: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    lineHeight: 22,
  },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff8e1",
    padding: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#fdd14f",
    marginBottom: 20,
  },
  warningText: {
    flex: 1,
    fontSize: 20,
    color: "#333",
  },
  clinPlaceholderBox: {
    width: "85%",
    height: height * 0.5,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  clinPlaceholderText: {
    fontSize: 18,
    textAlign: "center",
    color: "#777",
    fontStyle: "italic",
  },
  packagingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  infoButton: {
    marginLeft: 8,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 8,
    width: "90%",
    height: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    minHeight: 300,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.blue,
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: colors.blue,
    fontWeight: "600",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    width: "30%",
    marginLeft: 16,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "black",
  },
  card: {
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderColor: "black",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  materialText: {
    fontSize: 16,
    color: "#000",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#000",
  },
  rowSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 16,
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 16,
    color: "#000",
  },
});

export default LabelingAndMarking;
