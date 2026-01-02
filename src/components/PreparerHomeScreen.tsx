import DatabaseErrorDisplay from "@/components/DatabaseErrorDisplay";
import { SavedShipment } from "@/contexts/HazProPreparerProvider/reducer";
import { RootStackParamList } from "@/contexts/NavigationRefProvider/NavigationRefContext";
import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import ShipmentDatabase from "@/services/shipment/ShipmentDatabase";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheet } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, ListItem } from "react-native-elements";
import DryIceCalculator from "./DryIceCalculator";
import GasCalculatorTool from "./GasCalculatorTool";
import PlacardingTool from "./PlacardingTool";
import TopNavBar from "./TopNavBar";
import UnitConversionTool from "./UnitConversionTool";

console.warn = () => {};

export default function PreparerHomeScreen({
  navigation,
}: {
  navigation: any;
}) {
  // ✅ NEW: Using Valtio store instead of Context
  const { state, store, actions, isLoading, error, initializeDatabase } =
    useHazProStore();

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
  const [bottomSheetVisible, setBottomSheetVisible] = useState<boolean>(false);
  const [selectedShipment, setSelectedShipment] = useState<SavedShipment>();

  // ✅ NEW: Local state for shipments list (same approach with Valtio)
  const [shipmentsList, setShipmentsList] = useState<SavedShipment[]>([]);
  const [localLoading, setLocalLoading] = useState<boolean>(true);

  // ✅ NEW: Load shipments from database on component mount
  useEffect(() => {
    loadShipmentsList();
  }, []);

  // ✅ NEW: React to Valtio store changes - Convert ShipmentMetadata to SavedShipment format
  useEffect(() => {
    const convertToSavedShipments = async () => {
      const shipmentsMetadata = Object.values(state.shipmentsIndex);
      const savedShipments: SavedShipment[] = [];

      for (const metadata of shipmentsMetadata) {
        try {
          const fullShipment = await ShipmentDatabase.loadShipment(metadata.id);
          if (fullShipment) {
            savedShipments.push(fullShipment);
          }
        } catch (error) {
          console.warn(
            `Failed to load full shipment data for ${metadata.id}:`,
            error
          );
        }
      }

      const sortedShipments = savedShipments.sort(
        (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      );

      console.log(
        "Shipments from Valtio store:",
        sortedShipments.length,
        sortedShipments
      );
      setShipmentsList(sortedShipments);
    };

    convertToSavedShipments();
  }, [state.shipmentsIndex]);

  const loadShipmentsList = async () => {
    try {
      setLocalLoading(true);
      console.log("Loading shipments list...");

      // ✅ NEW: Initialize database with mock data on first load
      await initializeDatabase();
      console.log("Database initialized");

      // Using Valtio's refreshShipmentsIndex action
      await actions.refreshShipmentsIndex();
      console.log("Shipments index refreshed");

      // Small delay to ensure Valtio state has propagated
      await new Promise(resolve => setTimeout(resolve, 100));

      // Convert ShipmentMetadata to SavedShipment format for display
      const shipmentsMetadata = Object.values(state.shipmentsIndex);
      const savedShipments: SavedShipment[] = [];

      for (const metadata of shipmentsMetadata) {
        try {
          const fullShipment = await ShipmentDatabase.loadShipment(metadata.id);
          if (fullShipment) {
            savedShipments.push(fullShipment);
          }
        } catch (error) {
          console.warn(
            `Failed to load full shipment data for ${metadata.id}:`,
            error
          );
        }
      }

      const shipmentsArray = savedShipments.sort(
        (a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
      );
      console.log(
        "Shipments array after refresh:",
        shipmentsArray.length,
        shipmentsArray
      );
      setShipmentsList(shipmentsArray);
    } catch (error) {
      console.error("Failed to load shipments:", error);
    } finally {
      console.log("Setting localLoading to false");
      setLocalLoading(false);
    }
  };

  // ✅ NEW: Lightweight Database - Refresh Implementation
  const onRefresh = async () => {
    setRefreshing(true);
    await loadShipmentsList();
    setRefreshing(false);
  };

  // ❌ OLD: Heavy Context Implementation (commented out for comparison)
  /*
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  */

  const handleLongPress = (shipment: SavedShipment) => {
    setSelectedShipment(shipment);
    setBottomSheetVisible(true);
  };

  // ✅ NEW: Using Valtio actions for database operations
  const handleOptionSelect = async (option: string) => {
    setBottomSheetVisible(false);

    if (option === "View SDDG" && selectedShipment?.id) {
      try {
        await actions.loadShipment(selectedShipment.id);
        navigation.navigate("WrappedStack", {
          screen: "ShippersDeclarationScreen",
        });
      } catch (error) {
        console.error("Failed to load shipment for SDDG view:", error);
      }
    } else if (
      option === "View Packaging Information" &&
      selectedShipment?.id
    ) {
      try {
        await actions.loadShipment(selectedShipment.id);
        navigation.navigate("WrappedStack", {
          screen: "LabelingAndMarking",
        });
      } catch (error) {
        console.error("Failed to load shipment for packaging view:", error);
      }
    }
  };

  // ✅ NEW: Filtered Shipments (using original Context property paths)
  const filteredShipments: SavedShipment[] = shipmentsList.filter(
    savedShipment => {
      const searchLower = searchQuery.toLowerCase();
      return (
        savedShipment.hazProPreparerContext.shipment?.tcn
          ?.toLowerCase()
          .includes(searchLower) ||
        savedShipment.hazProPreparerContext.hazardousMaterial?.unid
          ?.toLowerCase()
          .includes(searchLower) ||
        savedShipment.hazProPreparerContext.hazardousMaterial?.hazclassDiv
          ?.toLowerCase()
          .includes(searchLower) ||
        savedShipment.hazProPreparerContext.shipment?.poe
          ?.toLowerCase()
          .includes(searchLower) ||
        savedShipment.hazProPreparerContext.shipment?.pod
          ?.toLowerCase()
          .includes(searchLower) ||
        savedShipment.hazProPreparerContext.preparer?.preparerName
          ?.toLowerCase()
          .includes(searchLower)
      );
    }
  );

  // Debug logging
  console.log("Debug - shipmentsList count:", shipmentsList.length);
  console.log("Debug - filteredShipments count:", filteredShipments.length);
  console.log("Debug - searchQuery:", searchQuery);
  console.log("Debug - localLoading:", localLoading);

  // ❌ OLD: Heavy Context Implementation (commented out for comparison)
  /*
  const filteredShipments: SavedShipment[] = state.savedShipments.filter(
    savedShipment => {
      const searchLower = searchQuery.toLowerCase();
      return (
        savedShipment.hazProPreparerContext.shipment?.tcn
          .toLowerCase()
          .includes(searchLower) ||
        savedShipment.hazProPreparerContext.hazardousMaterial?.unid
          .toLowerCase()
          .includes(searchLower) ||
        savedShipment.hazProPreparerContext.hazardousMaterial?.hazclassDiv
          .toLowerCase()
          .includes(searchLower) ||
        savedShipment.hazProPreparerContext.shipment?.poe
          .toLowerCase()
          .includes(searchLower) ||
        savedShipment.hazProPreparerContext.shipment?.pod
          .toLowerCase()
          .includes(searchLower) ||
        savedShipment.hazProPreparerContext.preparer?.preparerName
          .toLowerCase()
          .includes(searchLower)
      );
    }
  );
  */

  // ✅ NEW: Using Valtio actions for resume functionality
  const handleResume = async (shipmentId: string) => {
    try {
      // First get the shipment data to determine navigation
      const shipmentFile = await ShipmentDatabase.loadShipment(shipmentId);
      if (!shipmentFile) {
        console.error("Shipment not found:", shipmentId);
        return;
      }

      // Then load it into store for navigation
      await actions.loadShipment(shipmentId);

      const step = shipmentFile.hazProPreparerContext.activeStep;
      const substep = shipmentFile.hazProPreparerContext.packagingWizardStep;
      const completed = shipmentFile.hazProPreparerContext.completedSubsteps;

      const stepToScreenMap: Record<number, keyof RootStackParamList> = {
        1: "MaterialID",
        2: "PackagingScreen",
        3: "LabelingAndMarking",
        4: "ShippersDeclarationScreen",
        5: "Certify",
      };

      if (step === 2 && completed.includes("PackagingWizard")) {
        navigation.navigate("WrappedStack", { screen: "POPMarkingDataEntry" });
        return;
      } else if (
        step === 2 &&
        completed.includes("PackagingScreen") &&
        !completed.includes("PackagingWizard") &&
        typeof substep === "number" &&
        substep >= 0 &&
        substep <= 3
      ) {
        navigation.navigate("WrappedStack", { screen: "PackagingWizard" });
        return;
      } else if (typeof step === "number" && stepToScreenMap[step]) {
        navigation.navigate("WrappedStack", { screen: stepToScreenMap[step] });
      }
    } catch (error) {
      console.error("Failed to resume shipment:", error);
    }
  };

  // ❌ OLD: Heavy Context Implementation (commented out for comparison)
  /*
  const handleResume = (shipmentId: string) => {
    const shipmentToLoad = state.savedShipments.find(s => s.id === shipmentId);
    if (!shipmentToLoad) return;

    dispatch({ type: "LOAD_SHIPMENT", payload: shipmentId });

    const step = shipmentToLoad.hazProPreparerContext.activeStep;
    const substep = shipmentToLoad.hazProPreparerContext.packagingWizardStep;
    const completed = shipmentToLoad.hazProPreparerContext.completedSubsteps;

    // Navigation logic...
  };
  */

  // Error handling functions for retry functionality
  const retryLastOperation = async () => {
    await loadShipmentsList();
  };

  return (
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
          {/* === SHIPMENTS HEADER ROW === */}
          {/* <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Shipments</Text>
          </View> */}

          {/* ✅ NEW: Database Error Display */}
          {error && (
            <DatabaseErrorDisplay
              error={error}
              service="HazProValtioStore"
              operation="listShipments"
              onRetry={retryLastOperation}
              showTechnicalDetails={false}
            />
          )}

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
            <TouchableOpacity style={styles.disabledToolButton} disabled={true}>
              <Text style={styles.disabledToolButtonText}>
                Compatibility/Segregation Tool
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>
              Shipments {!localLoading && `(${filteredShipments.length})`}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <TextInput
                style={styles.searchInput}
                placeholder="Search by TCN, UN/ID, Class, POE, POD, or Signatory"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={styles.createButton}
                onPress={
                  () =>
                    navigate("WrappedStack", {
                      screen: "Disclaimer",
                    })
                  // navigate("WrappedStack", {
                  //   screen: "SDDGUploadAndParse",
                  // })
                }
              >
                <Text style={styles.createButtonText}>Create New Shipment</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ✅ NEW: TABLE WITH LIGHTWEIGHT DATABASE DATA */}
          <FlatList
            data={filteredShipments}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            getItemLayout={(data, index) => ({
              length: 60,
              offset: 60 * index,
              index,
            })}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <View style={styles.tableHeader}>
                <View style={styles.column}>
                  <Text style={styles.headerText}>TCN</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.headerText}>UN, NA, ID No.</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.headerText}>Class/Div/Comp. Group</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.headerText}>POE</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.headerText}>POD</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.headerText}>Signatory</Text>
                </View>
                <View style={styles.column}>
                  <Text style={styles.headerText}>Status</Text>
                </View>
              </View>
            }
            ListEmptyComponent={
              localLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.blue} />
                  <Text style={styles.loadingText}>Loading shipments...</Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No shipments found</Text>
                  <Text style={styles.emptySubtext}>
                    Create a new shipment to get started
                  </Text>
                </View>
              )
            }
            renderItem={({ item, index }) => (
              <ListItem.Swipeable
                containerStyle={styles.listItemContainer}
                leftWidth={120}
                rightWidth={120}
                onLongPress={() => handleLongPress(item)}
                leftContent={
                  <Button
                    title="Copy"
                    icon={
                      <Feather
                        style={{ marginRight: 10 }}
                        name="copy"
                        size={20}
                        color="white"
                      />
                    }
                    buttonStyle={{ minHeight: "100%" }}
                  />
                }
                rightContent={
                  <Button
                    title="Delete"
                    onPress={async () => {
                      try {
                        await actions.deleteShipment(item.id);
                        await loadShipmentsList(); // Refresh list
                      } catch (error) {
                        console.error("Failed to delete shipment:", error);
                      }
                    }}
                    icon={{ name: "delete", color: "white" }}
                    buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
                  />
                }
              >
                <ListItem.Content>
                  <View
                    style={[
                      styles.listItemRow,
                      index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                    ]}
                  >
                    <View style={styles.columnCells}>
                      <Text style={styles.columnText}>
                        {item.hazProPreparerContext.shipment?.tcn}
                      </Text>
                    </View>
                    <View style={styles.columnCells}>
                      <Text style={styles.columnText}>
                        {item.hazProPreparerContext.hazardousMaterial?.unid}
                      </Text>
                    </View>
                    <View style={styles.columnCells}>
                      <Text style={styles.columnText}>
                        {
                          item.hazProPreparerContext.hazardousMaterial
                            ?.hazclassDiv
                        }
                      </Text>
                    </View>
                    <View style={styles.columnCells}>
                      <Text style={styles.columnText}>
                        {item.hazProPreparerContext.shipment?.poe}
                      </Text>
                    </View>
                    <View style={styles.columnCells}>
                      <Text style={styles.columnText}>
                        {item.hazProPreparerContext.shipment?.pod}
                      </Text>
                    </View>
                    <View style={styles.columnCells}>
                      <Text style={styles.columnText}>
                        {store.hazProPreparerContext.preparer?.preparerName}
                      </Text>
                    </View>
                    <View style={styles.columnCells}>
                      <Text
                        style={[
                          styles.statusBadge,
                          item.status === "completed"
                            ? styles.statusCompleted
                            : styles.statusInProgress,
                        ]}
                      >
                        {item.status === "completed"
                          ? "✅ Completed"
                          : "🕗 In Progress"}
                      </Text>
                    </View>
                  </View>
                </ListItem.Content>
              </ListItem.Swipeable>
            )}
          />
        </View>
      </View>
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

          {selectedShipment?.status === "completed" ? (
            <>
              <TouchableOpacity
                style={styles.bottomSheetOption}
                onPress={() => handleOptionSelect("View SDDG")}
              >
                <Text style={styles.bottomSheetOptionText}>📄 View SDDG</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bottomSheetOption}
                onPress={() => handleOptionSelect("View Packaging Information")}
              >
                <Text style={styles.bottomSheetOptionText}>
                  📦 View Packaging Information
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={() => {
                setBottomSheetVisible(false);
                if (selectedShipment?.id) {
                  handleResume(selectedShipment.id);
                }
              }}
            >
              <Text style={styles.bottomSheetOptionText}>
                🔄 Resume Preparation
              </Text>
            </TouchableOpacity>
          )}

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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
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
    backgroundColor: "#e0e0e0",
    alignItems: "center",
  },
  whiteContainer: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 10,
    paddingBottom: 0,
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
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 10,
    color: "#000",
  },
  searchInput: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 10,
    height: 50,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 10,
    // height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    textAlignVertical: "center",
    paddingVertical: 8,
    marginLeft: 20,
    color: "#000",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  rowText: {
    fontSize: 15,
    textAlign: "center",
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
    // paddingVertical: 10,
    justifyContent: "center",
    // height: 60,
  },
  listItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // height: 60,
  },
  columnText: {
    fontSize: 15,
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    color: "#000",
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
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  bottomSheetOption: { padding: 10, width: "100%", alignItems: "center" },
  bottomSheetOptionText: { fontSize: 16, color: "#000" },
  bottomSheetCancel: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  bottomSheetCancelText: { fontSize: 16, fontWeight: "bold" },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "bold",
    overflow: "hidden",
    textAlign: "center",
  },
  statusCompleted: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  statusInProgress: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  column: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  columnCells: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    // paddingHorizontal: 5,
    borderTopWidth: 0.5,
    borderColor: "#ddd",
    width: "100%",
  },
  rowEven: {
    backgroundColor: "#ffffff",
  },
  rowOdd: {
    backgroundColor: "#ffffff",
  },
  listItemContainer: {
    padding: 0,
    margin: 0,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    borderRadius: 0,
  },
  calcOutline: {
    borderWidth: 1,
    borderColor: colors.blue,
    backgroundColor: "transparent",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
    width: 220,
  },
  calcTextOutline: { color: colors.blue, fontSize: 16, fontWeight: "600" },
  calcTextSoft: { color: "#006DCC", fontSize: 20, fontWeight: "600" },
  createButton: {
    backgroundColor: colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 5,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  toolButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
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
  // ✅ NEW: Loading and empty state styles
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  loadingText: {
    fontSize: 16,
    color: colors.blue,
    fontStyle: "italic",
    marginLeft: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay2: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    width: "60%",
    height: "55%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContentExpanded: {
    width: "85%",
    height: "80%",
  },
});
