import { renderGeneralPackagingRequirementsDocumentNodes } from "../../afmanData/generalPackagingRequirements";
import { mockShipments } from "@/mock/data";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { Shipment } from "../../types";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigationState } from "@react-navigation/native";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Tab } from "react-native-elements";
import { WebView } from "react-native-webview";
import { ChevronHeaderCellSuccess } from "./ChevronHeaderCell";
import TopNavBar from "./TopNavBar";

console.warn = () => {};

const MainLayout = ({
  navigation,
  title,
  children,
}: {
  navigation: any;
  title?: string;
  children: any;
}) => {
  const { state } = useHazProStore();
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

  // DEFENSIVE: Create safe accessor to prevent Valtio proxy errors
  const safeGet = (accessor: () => any, defaultValue: any = undefined) => {
    try {
      return accessor();
    } catch (error) {
      console.warn("MainLayout: Valtio proxy error, using default:", error);
      return defaultValue;
    }
  };

  // DEFENSIVE: Wrap all state access in try-catch to prevent Valtio proxy errors
  let activePersona;
  let informativeStatementsAcknowledged,
    workflowModifiersAcknowledged,
    generalPackagingRequirementsAcknowledged;

  try {
    activePersona = safeGet(() => state.hazProPreparerContext?.activePersona);

    informativeStatementsAcknowledged =
      state.hazProPreparerContext?.modifiersAndRequiredAcknowledgements
        ?.informativeStatementsAcknowledged;

    workflowModifiersAcknowledged =
      state.hazProPreparerContext?.modifiersAndRequiredAcknowledgements
        ?.workflowModifiersAcknowledged;

    generalPackagingRequirementsAcknowledged =
      state.hazProPreparerContext?.modifiersAndRequiredAcknowledgements
        ?.generalPackagingRequirementsAcknowledged;
  } catch (error) {
    console.warn(
      "MainLayout: Error accessing Valtio state, using defaults:",
      error
    );
    // Use safe defaults
    activePersona = undefined;
    informativeStatementsAcknowledged = false;
    workflowModifiersAcknowledged = false;
    generalPackagingRequirementsAcknowledged = false;
  }
  return (
    <View style={styles.container}>
      <TopNavBar
        onMenuPress={() => navigation.openDrawer()}
        onSelectRole={() => {}}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{[
          state.hazProPreparerContext.shipment?.tcn,
          state.hazProPreparerContext.hazardousMaterial?.properShippingName,
          state.hazProPreparerContext.hazardousMaterial?.unid,
        ].filter(Boolean).join('\n')}</Text>
        <View style={styles.chevronContainer}>
          <ChevronHeaderCellSuccess
            key={state.hazProPreparerContext.activeStep}
            shipment={shipment}
            activeStep={state.hazProPreparerContext.activeStep}
            navigation={navigation}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.leftPanel}>
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialCommunityIcons
                  name="information"
                  size={34}
                  color="white"
                />
                {/* {generalPackagingRequirementsAcknowledged === true ? (
                  <View style={styles.exponentBadgeAcknowledged}>
                    <Text style={styles.exponentBadgeText}>✓</Text>
                  </View>
                ) : (
                  <View style={styles.exponentBadgeWarning}>
                    <Text style={styles.exponentBadgeText2}>!</Text>
                  </View>
                )} */}
              </TouchableOpacity>
            </View>

            <View style={styles.iconWrapper}>
              <TouchableOpacity
                onPress={() => setInformativeStatementsModalVisible(true)}
              >
                <MaterialCommunityIcons
                  name="clipboard-check"
                  size={34}
                  color="white"
                />
              </TouchableOpacity>
              {/* {Object.keys(
                state.hazProPreparerContext.modifiersAndRequiredAcknowledgements
                  ?.specialProvisionsInformativeStatements ?? {}
              ).length > 0 && (
                <View
                  style={
                    informativeStatementsAcknowledged
                      ? styles.exponentBadgeAcknowledged
                      : styles.exponentBadge
                  }
                >
                  <Text style={styles.exponentBadgeText}>
                    {
                      Object.keys(
                        state.hazProPreparerContext
                          .modifiersAndRequiredAcknowledgements
                          ?.specialProvisionsInformativeStatements ?? {}
                      ).length
                    }
                  </Text>
                </View>
              )} */}
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
              {/* {(() => {
                try {
                  const specialProvisionsCount = state.hazProPreparerContext?.specialProvisionsMap
                    ? Object.keys(state.hazProPreparerContext.specialProvisionsMap).length
                    : 0;

                  if (specialProvisionsCount > 0) {
                    return (
                      <View
                        style={
                          workflowModifiersAcknowledged
                            ? styles.exponentBadgeAcknowledged
                            : styles.exponentBadge
                        }
                      >
                        <Text style={styles.exponentBadgeText}>
                          {specialProvisionsCount}
                        </Text>
                      </View>
                    );
                  }
                } catch (error) {
                  console.warn('MainLayout: Error rendering specialProvisionsMap badge:', error);
                }
                return null;
              })()} */}
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
                  <View style={styles.leftPanelSubsection}>
                    <Text style={styles.panelLabel}>PSN Description:</Text>
                    <Text style={styles.panelValue}>
                      {
                        state.hazProPreparerContext.hazardousMaterial
                          ?.properShippingName
                      }
                    </Text>
                    {state.hazProPreparerContext.hazardousMaterial?.details && (
                      <>
                        <Text style={styles.panelLabel}>
                          Additional Information:
                        </Text>
                        <Text style={styles.panelValue}>
                          {
                            state.hazProPreparerContext.hazardousMaterial
                              ?.details
                          }
                        </Text>
                      </>
                    )}
                    {state.hazProPreparerContext.technicalName !== "" && (
                      <>
                        <Text style={styles.panelLabel}>Technical Name:</Text>
                        <Text style={styles.panelValue}>
                          {state.hazProPreparerContext.technicalName}
                        </Text>
                      </>
                    )}
                    <Text style={styles.panelLabel}>Primary Hazard:</Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.hazardousMaterial
                        ?.hazclassDiv || "N/A"}
                    </Text>
                    <Text style={styles.panelLabel}>Subsidiary Hazard:</Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.hazardousMaterial
                        ?.subsidiaryRisk || "N/A"}
                    </Text>
                    <Text style={styles.panelLabel}>Packing Group:</Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.hazardousMaterial
                        ?.packingGroup || "N/A"}
                    </Text>
                    <Text style={styles.panelLabel}>Special Provisions:</Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.hazardousMaterial
                        ?.specialProvision || "N/A"}
                    </Text>
                    <Text style={styles.panelLabel}>Packaging Paragraph:</Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.hazardousMaterial
                        ?.packagingParagraph || "N/A"}
                    </Text>
                  </View>
                ) : (
                  <View style={styles.leftPanelSubsection}>
                    <Text style={styles.panelTitle}>Shipping Details</Text>
                    <Text style={styles.panelShipperSubtitle}>Shipper</Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.shipper?.address
                        .shipperLocation || "N/A"}
                    </Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.shipper?.address
                        .shipperStreet || "N/A"}
                    </Text>
                    <Text style={styles.panelValue}>
                      {`${state.hazProPreparerContext.shipper?.address.shipperCity}, ${state.hazProPreparerContext.shipper?.address.shipperState} ${state.hazProPreparerContext.shipper?.address.shipperZipcode}` ||
                        "N/A"}
                    </Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.shipper?.address
                        .selectedShipperCountry || "N/A"}
                    </Text>
                    <Text style={styles.panelConsigneeSubtitle}>Consignee</Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.consignee?.address
                        .consigneeDodaac || "N/A"}
                    </Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.consignee?.address
                        .consigneeStreet || "N/A"}
                    </Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.consignee?.address
                        .consigneeCity || "N/A"}
                    </Text>
                    <Text style={styles.panelValue}>
                      {state.hazProPreparerContext.consignee?.address
                        .selectedConsigneeCountry || "N/A"}
                    </Text>
                  </View>
                )}
              </>
            )}
        </View>
        <View style={styles.dynamicContent}>{children}</View>
      </View>
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

      <Modal
        animationType="slide"
        visible={isWorkflowModifiersModalVisible}
        transparent={true}
        onRequestClose={() => setWorkflowModifiersModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Workflow Modifier Special Provisions</Text>
              <TouchableOpacity
                onPress={() => setWorkflowModifiersModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBodyWorkflowModifiers}>
              {Object.entries(
                state.hazProPreparerContext.modifiersAndRequiredAcknowledgements
                  ?.specialProvisionsWorkflowModifiers ?? {}
              ).length > 0 ? (
                Object.entries(
                  state.hazProPreparerContext
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
                  No workflow modifier special provisions found.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

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
                state.hazProPreparerContext.modifiersAndRequiredAcknowledgements
                  ?.specialProvisionsInformativeStatements ?? {}
              ).length > 0 ? (
                Object.entries(
                  state.hazProPreparerContext
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

export default MainLayout;

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
    color: "#000",
  },
  panelLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
    color: "#000",
  },
  panelValue: {
    fontSize: 16,
    color: "#000",
    marginVertical: 2,
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
    backgroundColor: colors.blue,
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
  exponentBadge2: {
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
    alignItems: "center",
    backgroundColor: "#28a745",
    borderRadius: 10,
    height: 20,
    justifyContent: "center",
    minWidth: 20,
    position: "absolute",
    right: -5,
    top: -5,
    paddingHorizontal: 5,
  },
  exponentBadgeExclamation: {
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
  exponentBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  leftPanelSubsection: {
    margin: 5,
  },
  exponentBadgeUnacknowledged: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
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
    textAlign: "center",
    flex: 1,
    paddingBottom: 10,
  },
  modalBodyWorkflowModifiers: {
    fontSize: 16,
    textAlign: "center",
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
  exclamationMark: {
    fontWeight: 800,
  },
  exponentBadgeWarning: {
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
  exponentBadgeText2: {
    color: "white",
    fontWeight: "900",
    fontSize: 12,
    lineHeight: 12,
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
    backgroundColor: colors.blue,
    height: 3,
  },
  chevronContainer: { flex: 1, justifyContent: "center", marginVertical: -8 },
  backButtonWithSubstepRow: {
    paddingTop: 40,
  },
  backButtonWithoutSubstepRow: {
    paddingTop: 20,
  },
});
