import { renderGeneralPackagingRequirementsDocumentNodes } from "../../../afmanData/generalPackagingRequirements";
import { mockShipments } from "../../../src/mock/data";
import { Shipment } from "../../../types";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";
import { Tab } from "react-native-elements";
import React, { useContext, useEffect, useMemo, useState } from "react";
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
import TopNavBar from "../TopNavBar";
import { InspectorChevronHeaderCellSuccess } from "./InspectorChevronHeaderCell";
import { HazProInspectorContext } from "../../../src/contexts/HazProInspectorProvider/HazProInspectorContext";
import { useInspectionForm } from "../../../src/contexts/InspectionFormProvider";
import { hazardousMaterialsList } from "../../../src/hazardousMaterials/hazardousMaterialsList";

const { width, height } = Dimensions.get("window");
const screenWidth = width;
const screenHeight = height;

const InspectorMainLayout = ({
  navigation,
  title,
  children,
}: {
  navigation: any;
  title?: string;
  children: any;
}) => {
  const { state } = useContext(HazProInspectorContext);
  const { inspection } = useInspectionForm();
  const [shipment, setShipment] = useState<Shipment>(mockShipments[0]);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [
    isInformativeStatementsModalVisible,
    setInformativeStatementsModalVisible,
  ] = useState<boolean>(false);
  const [isWorkflowModifiersModalVisible, setWorkflowModifiersModalVisible] =
    useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "MaterialDetails" | "ShipmentDetails"
  >("MaterialDetails");
  const generalPackagingContent =
    renderGeneralPackagingRequirementsDocumentNodes();

  const navigationState = useNavigationState(state => state);

  const currentScreenName = (() => {
    if (!navigationState || !navigationState.routes) return "Unknown";

    const drawerRoute = navigationState.routes[navigationState.index];
    if (drawerRoute.state && drawerRoute.state.routes) {
      const stackRoute =
        drawerRoute.state?.routes?.[drawerRoute.state.index ?? 0];
      return stackRoute?.name || "Unknown";
    }

    return drawerRoute.name;
  })();

  const activePersona = state.hazProInspectorContext.activePersona;

  const tcn = state.hazProInspectorContext.shipment?.tcn || "";

  // Get SDDG content for left panel - prefer verificationCopy over extractedContent
  // verificationCopy contains user corrections from the verification step
  const extractedContent =
    inspection?.verificationCopy || inspection?.extractedContent;

  // Track frustrations count to force re-renders
  const frustrationsCount = inspection?.frustrations?.length || 0;

  // Debug: Log when frustrations change
  useEffect(() => {
    console.log(
      "📋 [InspectorMainLayout] Frustrations updated:",
      frustrationsCount
    );
    console.log(
      "📋 [InspectorMainLayout] Frustration keys:",
      (inspection?.frustrations || [])
        .map(f => `${f.key}=${f.correctValue}`)
        .join(", ")
    );
  }, [frustrationsCount, inspection?.frustrations]);

  // Create frustration lookup Map for O(1) access
  const frustrationMap = useMemo(() => {
    const map = new Map();
    (inspection?.frustrations || []).forEach(frustration => {
      map.set(frustration.key, frustration);
    });
    return map;
  }, [inspection?.frustrations]);

  // Find hazmat material by UN number to get special provisions
  const hazmatMaterial = useMemo(() => {
    if (!extractedContent?.unIdNo) return null;
    return hazardousMaterialsList.find(
      item => item.unid === extractedContent.unIdNo
    );
  }, [extractedContent?.unIdNo]);

  // Extract primary hazard (first character of hazard class)
  // However, if hazardClass has been corrected via frustration, use the full corrected value
  const primaryHazard = extractedContent?.hazardClass || "N/A";

  // Helper function to render field value with correction display
  const renderFieldValue = (
    label: string,
    fieldKey: string,
    extractedValue: string
  ) => {
    const frustration = frustrationMap.get(fieldKey);

    if (frustration && frustration.correctValue) {
      // Field has been corrected - show horizontal layout with strikethrough
      return (
        <>
          <Text style={styles.panelLabel}>{label}</Text>
          <View style={styles.frustratedValueRow}>
            <Text style={styles.frustratedValue}>
              {frustration.fieldValue || "N/A"}
            </Text>
            <Text style={styles.arrowSeparator}> → </Text>
            <Text style={styles.correctedValueInline}>
              {frustration.correctValue}
            </Text>
          </View>
        </>
      );
    } else {
      // Normal field (no correction)
      return (
        <>
          <Text style={styles.panelLabel}>{label}</Text>
          <Text style={styles.panelValue}>{extractedValue || "N/A"}</Text>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* === TOP NAVIGATION BAR === */}
      <TopNavBar
        onMenuPress={() => navigation.openDrawer()}
        onSelectRole={() => {}}
        // onAccountPress={() => console.log('Account pressed')}
      />

      {/* === HEADER ROW === */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{tcn}</Text>
        <View style={styles.chevronContainer}>
          <InspectorChevronHeaderCellSuccess
            key={state.hazProInspectorContext.activeStep}
            shipment={shipment}
            activeStep={state.hazProInspectorContext.activeStep}
            navigation={navigation}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* === LEFT PANEL === */}
        <View style={styles.leftPanel}>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialCommunityIcons
                  name="file-document-multiple"
                  size={34}
                  color="white"
                />
              </TouchableOpacity>
              {/* <View style={styles.exponentBadge}>
                <Text style={styles.exponentBadgeText}>{14}</Text>
              </View> */}
            </View>

            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => setInformativeStatementsModalVisible(true)}
              >
                <MaterialCommunityIcons
                  name="alert-circle-check"
                  size={34}
                  color="white"
                />
              </TouchableOpacity>
              {Object.keys(
                state.hazProInspectorContext
                  .modifiersAndRequiredAcknowledgements
                  ?.specialProvisionsInformativeStatements ?? {}
              ).length > 0 && (
                <View style={styles.exponentBadge}>
                  <Text style={styles.exponentBadgeText}>
                    {
                      Object.keys(
                        state.hazProInspectorContext
                          .modifiersAndRequiredAcknowledgements
                          ?.specialProvisionsInformativeStatements ?? {}
                      ).length
                    }
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => setWorkflowModifiersModalVisible(true)}
              >
                <MaterialCommunityIcons
                  name="hammer-wrench"
                  size={34}
                  color="white"
                />
              </TouchableOpacity>
              {Object.keys(
                state.hazProInspectorContext
                  .modifiersAndRequiredAcknowledgements
                  ?.specialProvisionsWorkflowModifiers ?? {}
              ).length > 0 && (
                <View style={styles.exponentBadge}>
                  <Text style={styles.exponentBadgeText}>
                    {
                      Object.keys(
                        state.hazProInspectorContext
                          .modifiersAndRequiredAcknowledgements
                          ?.specialProvisionsWorkflowModifiers ?? {}
                      ).length
                    }
                  </Text>
                </View>
              )}
            </View>
          </View>

          {currentScreenName !== "PreparerHome" &&
            currentScreenName !== "Hazardous Material Inspector" &&
            currentScreenName !== "Hazardous Material Preparer" &&
            currentScreenName !== "Disclaimer" && (
              <>
                <Tab
                  value={activeTab === "MaterialDetails" ? 0 : 1}
                  onChange={index =>
                    setActiveTab(
                      index === 0 ? "MaterialDetails" : "ShipmentDetails"
                    )
                  }
                  indicatorStyle={styles.tabIndicator}
                >
                  <Tab.Item
                    title="Material Details"
                    titleStyle={styles.tabText}
                    buttonStyle={{ backgroundColor: "#fff" }}
                  />
                  <Tab.Item
                    title="Shipment Details"
                    titleStyle={styles.tabText}
                    buttonStyle={{ backgroundColor: "#fff" }}
                  />
                </Tab>

                {activeTab === "MaterialDetails" ? (
                  <View
                    key={`material-${frustrationsCount}`}
                    style={styles.leftPanelSubsection}
                  >
                    <Text style={styles.panelTitle}>Material Details</Text>

                    {renderFieldValue(
                      "Proper Shipping Name:",
                      "properShippingName",
                      extractedContent?.properShippingName || ""
                    )}

                    {renderFieldValue(
                      "UN Number:",
                      "unIdNo",
                      extractedContent?.unIdNo || ""
                    )}

                    {renderFieldValue(
                      "Primary Hazard:",
                      "hazardClass",
                      primaryHazard
                    )}

                    {renderFieldValue(
                      "Subsidiary Hazard:",
                      "subsidiaryRisk",
                      extractedContent?.subsidiaryRisk || ""
                    )}

                    {renderFieldValue(
                      "Packing Group:",
                      "packingGroup",
                      extractedContent?.packingGroup || ""
                    )}

                    <Text style={styles.panelLabel}>Special Provisions:</Text>
                    <Text style={styles.panelValue}>
                      {hazmatMaterial?.specialProvision || "N/A"}
                    </Text>

                    {renderFieldValue(
                      "Packaging Paragraph:",
                      "packingInstruction",
                      extractedContent?.packingInstruction || ""
                    )}
                  </View>
                ) : (
                  <View
                    key={`shipping-${frustrationsCount}`}
                    style={styles.leftPanelSubsection}
                  >
                    <Text style={styles.panelTitle}>Shipping Details</Text>

                    <Text style={styles.panelShipperSubtitle}>Shipper</Text>
                    {renderFieldValue(
                      "",
                      "shipper",
                      extractedContent?.shipper || ""
                    )}

                    <Text style={styles.panelConsigneeSubtitle}>Consignee</Text>
                    {renderFieldValue(
                      "",
                      "consignee",
                      extractedContent?.consignee || ""
                    )}
                  </View>
                )}
              </>
            )}
        </View>

        {/* === DYNAMIC CONTENT === */}
        <View style={styles.dynamicContent}>{children}</View>
      </View>
      {/* === MODAL FOR GENERAL PACKAGING REQUIREMENTS === */}
      <Modal
        animationType="slide"
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                General Packaging Requirements
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <WebView
                originWhitelist={["*"]}
                source={{
                  html: `<div style="padding: 15px;">${generalPackagingContent}</div>`,
                }}
                style={{ flex: 1, height: 400 }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* === MODAL FOR WORKFLOW MODIFIERS === */}
      <Modal
        animationType="slide"
        visible={isWorkflowModifiersModalVisible}
        transparent={true}
        onRequestClose={() => setWorkflowModifiersModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Workflow Modifiers</Text>
              <TouchableOpacity
                onPress={() => setWorkflowModifiersModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBodyWorkflowModifiers}>
              {Object.entries(
                state.hazProInspectorContext
                  .modifiersAndRequiredAcknowledgements
                  ?.specialProvisionsWorkflowModifiers ?? {}
              ).length > 0 ? (
                Object.entries(
                  state.hazProInspectorContext
                    .modifiersAndRequiredAcknowledgements
                    ?.specialProvisionsWorkflowModifiers ?? {}
                ).map(([key, value]) => (
                  <View key={key} style={styles.workflowModifierItem}>
                    <Text style={styles.panelLabel}>{key}</Text>
                    <Text style={styles.panelValue}>{value}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.panelValue}>
                  No workflow modifiers found.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* === MODAL FOR INFORMATIVE SPECIAL PROVISIONS === */}
      <Modal
        animationType="slide"
        visible={isInformativeStatementsModalVisible}
        transparent={true}
        onRequestClose={() => setInformativeStatementsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Informative Special Provisions
              </Text>
              <TouchableOpacity
                onPress={() => setInformativeStatementsModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBodyWorkflowModifiers}>
              {Object.entries(
                state.hazProInspectorContext
                  .modifiersAndRequiredAcknowledgements
                  ?.specialProvisionsInformativeStatements ?? {}
              ).length > 0 ? (
                Object.entries(
                  state.hazProInspectorContext
                    .modifiersAndRequiredAcknowledgements
                    ?.specialProvisionsInformativeStatements ?? {}
                ).map(([key, value]) => (
                  <View key={key} style={styles.workflowModifierItem}>
                    <Text style={styles.panelLabel}>{key}</Text>
                    <Text style={styles.panelValue}>{value}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.panelValue}>
                  No informative special provisions found.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InspectorMainLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 8,
    minHeight: 100,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    width: "32%",
    fontSize: 20.5,
    marginRight: 10,
    marginLeft: 20,
    fontWeight: "bold",
    textAlign: "left",
    color: "#000",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
  },
  leftPanel: {
    width: "24%",
    backgroundColor: "#fff",
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
    color: "#000",
  },
  panelShipperSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#000",
  },
  panelConsigneeSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
  panelLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
    color: "#000",
  },
  labelWithWarning: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  warningIcon: {
    marginLeft: 6,
  },
  panelValue: {
    fontSize: 16,
    color: "#000",
    marginVertical: 2,
  },
  frustratedValueRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
  },
  frustratedValue: {
    fontSize: 16,
    color: "#FF3B30",
    textDecorationLine: "line-through",
    fontWeight: "600",
  },
  arrowSeparator: {
    fontSize: 15,
    color: "#666",
    marginHorizontal: 4,
  },
  correctedValueInline: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  panelValue2: {
    fontSize: 14,
    color: "#000",
    marginLeft: 10,
  },
  dynamicContent: {
    flex: 1,
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#007bff",
    paddingVertical: 10,
    borderRadius: 8,
  },
  exponentBadge: {
    alignItems: "center",
    backgroundColor: "red",
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    minWidth: 20,
    position: "absolute",
    right: -5,
    top: -5,
    paddingHorizontal: 5,
  },
  exponentBadgeAcknowledged: {
    backgroundColor: "grey",
  },
  exponentBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  leftPanelSubsection: {
    margin: 5,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  modalBody: {
    fontSize: 16,
    textAlign: "left",
    flex: 1,
    paddingBottom: 10,
  },
  modalBodyWorkflowModifiers: {
    fontSize: 16,
    textAlign: "left",
    flex: 1,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: "95%",
    height: "70%",
    maxHeight: 500,
    backgroundColor: "white",
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  workflowModifierItem: { marginBottom: 10 },
  leftPanelSection: {
    marginBottom: 15,
  },
  leftPanelRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  leftPanelSection2: {
    flex: 1,
    paddingHorizontal: 0,
  },
  acknowledgeButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 15,
    alignSelf: "center",
    width: "90%",
  },
  acknowledgeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  tabIndicator: {
    backgroundColor: "#007bff",
    height: 3,
  },
  chevronContainer: { flex: 1, justifyContent: "center", marginVertical: -8 },
});
