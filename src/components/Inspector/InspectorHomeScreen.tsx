import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, ListItem } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Modal,
  SafeAreaView,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
  TapGestureHandler,
  State,
} from "react-native-gesture-handler";
import { HazProPreparerContext } from "../../../src/contexts/HazProPreparerProvider/HazProPreparerContext";
import TopNavBar from "../TopNavBar";
import { useNavigationRef } from "../../../src/contexts/NavigationRefProvider/useNavigationRef";
import { HazProInspectorContext } from "../../../src/contexts/HazProInspectorProvider/HazProInspectorContext";
import { BottomSheet } from "@rneui/themed";
import colors from "../../../src/theming/colors";
import GasCalculatorTool from "../GasCalculatorTool";
import DryIceCalculator from "../DryIceCalculator";
import UnitConversionTool from "../UnitConversionTool";
import PlacardingTool from "../PlacardingTool";
import CompatibilitySegregationModal from "../CompatibilitySegregationModal";
import { InspectorShipment } from "../../../src/types/sddg";
import { useDatabase } from "../../../src/contexts/DataProvider";
import { useInspectionForm } from "../../../src/contexts/InspectionFormProvider";
import { InspectorAMC1015Form } from "./InspectorAMC1015Form";
import { MLDetectionScreen } from "./MLDetectionScreen";

console.warn = () => {};

export default function InspectorHomeScreen({
  navigation,
}: {
  navigation: any;
}) {
  const { dispatch } = useContext(HazProPreparerContext);
  const { dispatch: inspectorDispatch } = useContext(HazProInspectorContext);
  const { navigate } = useNavigationRef();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [gasModalVisible, setGasModalVisible] = useState<boolean>(false);
  const [dryIceModalVisible, setDryIceModalVisible] = useState<boolean>(false);
  const [unitConversionModalVisible, setUnitConversionModalVisible] =
    useState<boolean>(false);
  const [placardingModalVisible, setPlacardingModalVisible] =
    useState<boolean>(false);
  const [placardingModalExpanded, setPlacardingModalExpanded] =
    useState<boolean>(false);
  const [compatibilityModalVisible, setCompatibilityModalVisible] =
    useState<boolean>(false);
  const [form1015ModalVisible, setForm1015ModalVisible] =
    useState<boolean>(false);
  const [mlModalVisible, setMlModalVisible] = useState<boolean>(false);

  const [bottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false);
  const [selectedInspection, setSelectedInspection] =
    useState<InspectorShipment>();
  const [inspections, setInspections] = useState<InspectorShipment[]>([]);
  const database = useDatabase();
  const { loadInspectionForEdit } = useInspectionForm();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await database.listInspections();
      console.log("1!!!!!: ", JSON.stringify(data));
      setInspections(data);
    } catch (error) {
      console.error("Failed to refresh inspector shipments:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLongPress = (inspection: InspectorShipment) => {
    setSelectedInspection(inspection);
    setBottomSheetVisible(true);
  };

  const handleOptionSelect = async (option: string) => {
    setBottomSheetVisible(false);

    if (!selectedInspection) return;

    switch (option) {
      case "Load Inspection":
        await loadInspectionForEdit(selectedInspection.id);
        navigate("InspectorWrappedStack", {
          screen: "SDDGFrustrationSummary",
        });
        break;
      case "Delete Inspection":
        Alert.alert(
          "Delete Inspection",
          `Are you sure you want to delete inspection ${selectedInspection.tcn}?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                await database.deleteInspection(selectedInspection.id);
                await onRefresh();
              },
            },
          ]
        );
        break;
    }
  };

  // Get inspector shipments from local state
  const inspectorShipments = inspections;

  const filteredInspections = inspectorShipments.filter(inspection => {
    // Filter out specific shipping names
    if (
      // inspection.properShippingName === 'LITHIUM NITRIDE' ||
      inspection.properShippingName === "DANGEROUS GOODS IN APPARATUS" ||
      inspection.properShippingName ===
        "ARTICLES, PYROTECHNIC for technical purposes" ||
      inspection.properShippingName ===
        "SULPHURIC ACID with not more than 51% acid"
    ) {
      return false;
    }

    const searchLower = searchQuery.toLowerCase();
    return (
      inspection.tcn.toLowerCase().includes(searchLower) ||
      inspection.unId.toLowerCase().includes(searchLower) ||
      inspection.properShippingName.toLowerCase().includes(searchLower) ||
      inspection.inspector.toLowerCase().includes(searchLower) ||
      inspection.status.toLowerCase().includes(searchLower)
    );
  });

  // Reset contexts on mount
  useEffect(() => {
    dispatch({ type: "RESET_CONTEXT" });
    inspectorDispatch({ type: "RESET_CONTEXT" });
  }, []);

  // Load inspections when database is initialized
  useEffect(() => {
    if (!database.isInitialized) {
      console.log("🗄️ [InspectorHome] Waiting for database initialization...");
      return;
    }

    // Load inspections from SQLite database
    const loadInspections = async () => {
      try {
        console.log(
          "🗄️ [InspectorHome] Database initialized, loading inspections..."
        );

        // Load inspections from SQLite
        const data = await database.listInspections();
        setInspections(data);

        // DEBUG: Query SQLite database directly
        console.log("🗄️ [DEBUG] Querying SQLite database...");
        console.log("🗄️ [DEBUG] Total inspections in SQLite:", data.length);

        if (data.length > 0) {
          console.log(
            "🗄️ [DEBUG] Most recent inspection:",
            JSON.stringify(data[0], null, 2)
          );

          // Load full details of the most recent inspection
          const fullInspection = await database.loadInspection(data[0].id);
          console.log(
            "🗄️ [DEBUG] Full inspection data:",
            JSON.stringify(fullInspection, null, 2)
          );
        }

        // Get database stats
        const stats = await database.getInspectionStats();
        console.log(
          "🗄️ [DEBUG] Database stats:",
          JSON.stringify(stats, null, 2)
        );
      } catch (error) {
        console.error("Failed to load inspections from database:", error);
      }
    };

    loadInspections();
  }, [database.isInitialized]);

  // Function to handle SDDG status click - load real inspection data
  const handleSDDGStatusClick = async (inspection: InspectorShipment) => {
    console.log("🔍🔍🔍 [InspectorHome] SDDG STATUS CLICK HANDLER CALLED");
    console.log("🔍 [InspectorHome] Inspection TCN:", inspection.tcn);
    console.log("🔍 [InspectorHome] Inspection ID:", inspection.id);
    console.log("🔍 [InspectorHome] SDDG Status:", inspection.sddgStatus);
    console.log(
      "🔍 [InspectorHome] Full inspection object:",
      JSON.stringify(inspection, null, 2)
    );

    if (inspection.sddgStatus === "verified") {
      console.log("🔍 [InspectorHome] Status is verified, navigating to SDDGInspectionCompleteScreen");

      try {
        await loadInspectionForEdit(inspection.id);
        navigate("InspectorWrappedStack", {
          screen: "SDDGInspectionCompleteScreen",
        });
      } catch (error) {
        console.error("🔍 [InspectorHome] Failed to load inspection:", error);
        Alert.alert(
          "Error",
          "Failed to load inspection data. Please try again.",
          [{ text: "OK" }]
        );
      }
      return;
    }

    console.log(
      "🔍 [InspectorHome] Status is frustrated, proceeding to load inspection"
    );

    // Load the full inspection data
    try {
      console.log(
        "🔍 [InspectorHome] Calling loadInspectionForEdit with ID:",
        inspection.id
      );
      await loadInspectionForEdit(inspection.id);
      console.log(
        "🔍 [InspectorHome] loadInspectionForEdit completed successfully"
      );

      // Navigate to SDDGFrustrationSummary
      console.log(
        "🔍 [InspectorHome] About to navigate to SDDGFrustrationSummary..."
      );
      navigate("InspectorWrappedStack", {
        screen: "SDDGFrustrationSummary",
      });
      console.log("🔍 [InspectorHome] Navigation call completed");
    } catch (error) {
      console.error(
        "🔍 [InspectorHome] ERROR - Failed to load inspection:",
        error
      );
      console.error(
        "🔍 [InspectorHome] ERROR - Error details:",
        JSON.stringify(error, null, 2)
      );
      Alert.alert(
        "Error",
        "Failed to load inspection data. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  // Function to handle Package status click - load real inspection data
  const handlePackageStatusClick = async (inspection: InspectorShipment) => {
    console.log(
      "📦 Package status clicked for inspection:",
      inspection.tcn,
      "Status:",
      inspection.packageStatus
    );

    if (inspection.packageStatus === "verified") {
      Alert.alert(
        "Package Verified",
        "All package markings and labels have been verified for this inspection.",
        [{ text: "OK" }]
      );
      return;
    }

    if (inspection.packageStatus === null) {
      Alert.alert(
        "Package Not Started",
        "The package inspection has not been started yet. Would you like to continue with the package inspection now?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: async () => {
              try {
                await loadInspectionForEdit(inspection.id);
                // Navigate to package verification screen
                console.log("📦 Navigating to package inspection...");
                navigate("InspectorWrappedStack", {
                  screen: "InspectorPackageVerification",
                });
              } catch (error) {
                console.error("Failed to load inspection:", error);
                Alert.alert(
                  "Error",
                  "Failed to load inspection data. Please try again.",
                  [{ text: "OK" }]
                );
              }
            },
          },
        ]
      );
      return;
    }

    // Load the full inspection data for frustrated packages
    try {
      await loadInspectionForEdit(inspection.id);

      // Navigate to PackageFrustrationSummary
      console.log("📦 Navigating to PackageFrustrationSummary...");
      navigate("InspectorWrappedStack", {
        screen: "PackageFrustrationSummary",
      });
    } catch (error) {
      console.error("Failed to load inspection:", error);
      Alert.alert(
        "Error",
        "Failed to load inspection data. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  // Function to handle View Form 1015 click - load inspection and open modal
  const handleViewForm1015 = async (inspection: InspectorShipment) => {
    console.log(
      "📋 [InspectorHome] View Form 1015 clicked for inspection:",
      inspection.tcn
    );

    try {
      console.log("📋 [InspectorHome] Loading inspection for form view...");
      await loadInspectionForEdit(inspection.id);
      console.log(
        "📋 [InspectorHome] Inspection loaded successfully, opening modal..."
      );
      setForm1015ModalVisible(true);
    } catch (error) {
      console.error(
        "📋 [InspectorHome] Failed to load inspection for form view:",
        error
      );
      Alert.alert(
        "Error",
        "Failed to load inspection data. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  // Mock navigation object for modal context - closes modal instead of navigating
  const mockNavigationForModal = {
    navigate: (stack: string, params: any) => {
      console.log(
        "📋 [InspectorHome] Modal navigation called, closing modal and refreshing..."
      );
      setForm1015ModalVisible(false);
      onRefresh(); // Refresh the inspections list
    },
  };

  // Render functions for Swipeable actions
  const renderLeftActions =
    (item: InspectorShipment) =>
    (
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>
    ) => {
      const trans = dragX.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 0],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={[
            styles.swipeAction,
            styles.swipeActionLeft,
            { transform: [{ translateX: trans }] },
          ]}
        >
          <TouchableOpacity
            style={styles.swipeButton}
            onPress={async () => {
              await loadInspectionForEdit(item.id);
              navigate("InspectorWrappedStack", {
                screen: "SDDGFrustrationSummary",
              });
            }}
          >
            <Feather
              name="folder-plus"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.swipeButtonText}>Load</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    };

  const renderRightActions =
    (item: InspectorShipment) =>
    (
      progress: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>
    ) => {
      const trans = dragX.interpolate({
        inputRange: [-120, 0],
        outputRange: [0, 0],
        extrapolate: "clamp",
      });

      return (
        <Animated.View
          style={[
            styles.swipeAction,
            styles.swipeActionRight,
            { transform: [{ translateX: trans }] },
          ]}
        >
          <TouchableOpacity
            style={[styles.swipeButton, { backgroundColor: "red" }]}
            onPress={() => {
              Alert.alert(
                "Delete Inspection",
                `Are you sure you want to delete inspection ${item.tcn}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      await database.deleteInspection(item.id);
                      await onRefresh();
                    },
                  },
                ]
              );
            }}
          >
            <MaterialCommunityIcons
              name="delete"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
            <Text style={styles.swipeButtonText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      );
    };

  const ListHeaderContent = () => (
    <>
      <View>
        {/* === TOP NAVIGATION BAR === */}
        <TopNavBar
          onMenuPress={() => navigation.openDrawer()}
          onSelectRole={() => {}}
          // onAccountPress={() => console.log('Account pressed')}
        />
      </View>
      <View style={styles.grayBackground}>
        <View style={styles.whiteContainer}>
          {/* Tool Button Row */}
          <View style={styles.toolButtonRow}>
            <TouchableOpacity
              style={styles.calcSoft}
              onPress={() => setGasModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="calculator"
                size={20}
                color={colors.blue}
              />
              <Text style={styles.calcTextSoft}>Gas Calculator</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.calcSoft}
              onPress={() => setDryIceModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="calculator"
                size={20}
                color={colors.blue}
              />
              <Text style={styles.calcTextSoft}>Dry Ice Calculator</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.calcSoft}
              onPress={() => setUnitConversionModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="swap-horizontal"
                size={20}
                color={colors.blue}
              />
              <Text style={styles.calcTextSoft}>Unit Converter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.calcSoft}
              onPress={() => setPlacardingModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="sign-direction"
                size={20}
                color={colors.blue}
              />
              <Text style={styles.calcTextSoft}>Placarding Tool</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.calcSoft}
              onPress={() => setCompatibilityModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="shield-check"
                size={20}
                color={colors.blue}
              />
              <Text style={styles.calcTextSoft}>
                Compatibility/Segregation Tool
              </Text>
            </TouchableOpacity>
            {/* ML Label Detection Test Button */}
            <TouchableOpacity
              style={[styles.calcSoft, { backgroundColor: '#FFF3E0' }]}
              onPress={() => setMlModalVisible(true)}
            >
              <MaterialCommunityIcons
                name="robot"
                size={20}
                color="#E65100"
              />
              <Text style={[styles.calcTextSoft, { color: '#E65100' }]}>
                ML Label Test
              </Text>
            </TouchableOpacity>
          </View>

          {/* === SHIPMENTS HEADER ROW === */}
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Inspections</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              style={styles.createButton}
              onPress={() =>
                navigate("InspectorWrappedStack", {
                  screen: "SDDGUploadAndParse",
                })
              }
            >
              <Text style={styles.createButtonText}>Start New Inspection</Text>
            </TouchableOpacity>
          </View>

          {/* === TABLE HEADER === */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerText, styles.flex1]}>TCN</Text>
            <Text style={[styles.headerText, styles.flex1]}>
              UN, NA, ID No.
            </Text>
            <Text style={[styles.headerText, styles.flex1]}>
              Proper Shipping Name
            </Text>
            {/* <Text style={[styles.headerText, styles.flex1]}>Date</Text> */}
            <Text style={[styles.headerText, styles.flex1]}>SDDG</Text>
            <Text style={[styles.headerText, styles.flex1]}>Package</Text>
            <Text style={[styles.headerText, styles.flex1]}>Inspector</Text>
            <Text style={[styles.headerText, styles.flex1]}>View</Text>
          </View>
        </View>
      </View>
    </>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <FlatList
          data={filteredInspections}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          getItemLayout={(data, index) => ({
            length: 60,
            offset: 60 * index,
            index,
          })}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={ListHeaderContent}
          renderItem={({ item }) => {
            const inspectionDate = new Date(
              item.inspectedAt
            ).toLocaleDateString();
            const statusColor =
              item.status === "completed"
                ? "#2D7D32"
                : item.status === "frustrated"
                ? "#D32F2F"
                : "#FF8F00";

            return (
              <Swipeable
                renderLeftActions={renderLeftActions(item)}
                renderRightActions={renderRightActions(item)}
                overshootLeft={false}
                overshootRight={false}
                friction={2}
                leftThreshold={40}
                rightThreshold={40}
                onSwipeableOpen={direction => {
                  console.log(`Swiped ${direction}`);
                }}
              >
                <TouchableOpacity
                  onLongPress={() => handleLongPress(item)}
                  style={styles.listItemContainer}
                  activeOpacity={1}
                >
                  <View style={styles.listItemRow}>
                    <Text style={styles.columnText}>{item.tcn}</Text>
                    <Text style={styles.columnText}>{item.unId}</Text>
                    <Text style={styles.columnText}>
                      {item.properShippingName}
                    </Text>
                    {/* <Text style={styles.columnText}>{inspectionDate}</Text> */}

                    {/* SDDG Status Cell with TapGestureHandler for priority */}
                    <View style={styles.sddgStatusTouchable}>
                      <TapGestureHandler
                        onHandlerStateChange={({ nativeEvent }) => {
                          if (nativeEvent.state === State.ACTIVE) {
                            console.log(
                              "🔍 [InspectorHome] TapGestureHandler activated for SDDG status"
                            );
                            console.log(
                              "🔍 [InspectorHome] Item:",
                              item.tcn,
                              "Status:",
                              item.sddgStatus
                            );
                            handleSDDGStatusClick(item);
                          }
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={[
                              styles.columnText,
                              styles.statusText,
                              item.sddgStatus === "verified"
                                ? styles.verifiedStatus
                                : styles.frustratedStatus,
                            ]}
                          >
                            {item.sddgStatus === "verified"
                              ? "Verified"
                              : "Frustrated"}
                          </Text>
                        </View>
                      </TapGestureHandler>
                    </View>

                    {/* Package Status Cell with TapGestureHandler for priority */}
                    <View style={styles.sddgStatusTouchable}>
                      <TapGestureHandler
                        onHandlerStateChange={({ nativeEvent }) => {
                          if (nativeEvent.state === State.ACTIVE) {
                            console.log(
                              "📦 [InspectorHome] TapGestureHandler activated for Package status"
                            );
                            handlePackageStatusClick(item);
                          }
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text
                            style={[
                              styles.columnText,
                              styles.statusText,
                              item.packageStatus === null
                                ? styles.naStatus
                                : item.packageStatus === "verified"
                                ? styles.verifiedStatus
                                : styles.frustratedStatus,
                            ]}
                          >
                            {item.packageStatus === null
                              ? "N/A"
                              : item.packageStatus === "verified"
                              ? "Verified"
                              : "Frustrated"}
                          </Text>
                        </View>
                      </TapGestureHandler>
                    </View>

                    <Text style={styles.columnText}>
                      {/* {item.inspector} */}
                      Cody Schexnider
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleViewForm1015(item)}
                      style={[styles.columnText, styles.iconColumn]}
                    >
                      <MaterialCommunityIcons
                        name="file-document"
                        size={20}
                        color="#007AFF"
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Swipeable>
            );
          }}
        />
        <StatusBar style="auto" />

        {/* === BOTTOM SHEET MENU === */}
        <BottomSheet
          modalProps={{ animationType: "slide", transparent: true }}
          isVisible={bottomSheetVisible}
          containerStyle={styles.bottomSheetContainer}
          backdropStyle={styles.backdropStyle}
        >
          <View style={styles.bottomSheetContent}>
            <Text style={styles.bottomSheetTitle}>Select an Option</Text>

            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={() => handleOptionSelect("Load Inspection")}
            >
              <Text style={styles.bottomSheetOptionText}>📂 SDDG</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={() => handleOptionSelect("Delete Inspection")}
            >
              <Text style={styles.bottomSheetOptionText}>Package</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomSheetCancel}
              onPress={() => setBottomSheetVisible(false)}
            >
              <Text style={styles.bottomSheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>

        {/* === GAS CALCULATOR MODAL === */}
        <GasCalculatorTool
          visible={gasModalVisible}
          onClose={() => setGasModalVisible(false)}
        />

        {/* === DRY ICE CALCULATOR MODAL === */}
        <DryIceCalculator
          visible={dryIceModalVisible}
          onClose={() => setDryIceModalVisible(false)}
        />

        {/* === UNIT CONVERSION TOOL MODAL === */}
        <UnitConversionTool
          visible={unitConversionModalVisible}
          onClose={() => setUnitConversionModalVisible(false)}
        />

        {/* === PLACARDING TOOL MODAL === */}
        <PlacardingTool
          visible={placardingModalVisible}
          onClose={() => {
            setPlacardingModalVisible(false);
            setPlacardingModalExpanded(false);
          }}
          onExpandChange={setPlacardingModalExpanded}
        />

        {/* === COMPATIBILITY/SEGREGATION MODAL === */}
        <CompatibilitySegregationModal
          visible={compatibilityModalVisible}
          onClose={() => setCompatibilityModalVisible(false)}
        />

        {/* === AMC FORM 1015 MODAL === */}
        <Modal
          visible={form1015ModalVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setForm1015ModalVisible(false)}
        >
          <SafeAreaView style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                AMC Form 1015 - Inspection Report
              </Text>
              <TouchableOpacity
                onPress={() => setForm1015ModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={28}
                  color={colors.black}
                />
              </TouchableOpacity>
            </View>

            {/* Form Content - Wrapper provides bounded height for ScrollView */}
            <View style={styles.modalFormContainer}>
              <InspectorAMC1015Form navigation={mockNavigationForModal} />
            </View>
          </SafeAreaView>
        </Modal>

        {/* === ML DETECTION MODAL === */}
        <Modal
          visible={mlModalVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setMlModalVisible(false)}
        >
          <MLDetectionScreen onClose={() => setMlModalVisible(false)} />
        </Modal>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  grayBackground: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  whiteContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 10,
    color: "black",
  },
  searchInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 10,
    height: 50,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    zIndex: 2,
    color: "black",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    color: "black",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
    color: "black",
  },
  rowText: {
    fontSize: 15,
    textAlign: "center",
    color: "black",
  },
  checkboxContainer: {
    width: 40,
    alignItems: "center",
  },
  flex1: { flex: 1 },
  iconColumn: {
    width: 40,
    alignItems: "center",
  },
  columnIcon: {
    marginRight: 5,
    marginLeft: 5,
  },
  rowIcon: {
    marginRight: 5,
    marginLeft: 5,
  },
  listItem: {
    paddingVertical: 10,
    justifyContent: "center",
    height: 60,
  },

  listItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  columnText: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
    color: "black",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    overflow: "hidden",
    textAlign: "center",
    minWidth: 80,
  },
  verifiedStatus: {
    backgroundColor: "#E8F5E8",
    color: "#2D7D32",
  },
  frustratedStatus: {
    backgroundColor: "#FFEBEE",
    color: "#D32F2F",
  },
  naStatus: {
    backgroundColor: "#F5F5F5",
    color: "#8E8E93",
  },
  backdropStyle: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  bottomSheetContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheetContent: {
    height: "100%",
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  bottomSheetTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  bottomSheetOption: { padding: 10, width: "100%", alignItems: "center" },
  bottomSheetOptionText: { fontSize: 16 },
  bottomSheetCancel: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  bottomSheetCancelText: { fontSize: 16, fontWeight: "bold" },
  toolButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  calcSoft: {
    backgroundColor: "#E6F4FF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    minWidth: 220,
  },
  calcTextSoft: {
    color: "#006DCC",
    fontSize: 20,
    fontWeight: "600",
  },
  disabledToolButton: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    width: 350,
    opacity: 0.6,
  },
  disabledToolButtonText: {
    color: "#b0b0b0",
    fontSize: 20,
    fontWeight: "600",
  },
  sddgStatusTouchable: {
    // Ensure the touchable area covers the entire cell area
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.5,
  },
  listItemContainer: {
    paddingVertical: 15,
    paddingHorizontal: 0,
    margin: 0,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    borderRadius: 0,
    backgroundColor: "#fff",
  },
  swipeAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 120,
  },
  swipeActionLeft: {
    backgroundColor: "#007AFF",
  },
  swipeActionRight: {
    backgroundColor: "red",
  },
  swipeButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#007AFF",
    flexDirection: "row",
  },
  swipeButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: colors.white,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    flex: 1,
  },
  modalCloseButton: {
    padding: 8,
    marginLeft: 16,
  },
  modalFormContainer: {
    flex: 1,
  },
});
