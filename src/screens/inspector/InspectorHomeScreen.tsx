import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Button, ListItem } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  BackHandler,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
  TapGestureHandler,
  State,
} from "react-native-gesture-handler";
import { HazProPreparerContext } from "../../contexts/HazProPreparerProvider/HazProPreparerContext";
import TopNavBar from "../../components/TopNavBar";
import { useNavigationRef } from "../../contexts/NavigationRefProvider/useNavigationRef";
import { HazProInspectorContext } from "../../contexts/HazProInspectorProvider/HazProInspectorContext";
import legacyColors from "../../theming/colors";
import GasCalculatorTool from "../../components/GasCalculatorTool";
import DryIceCalculator from "../../components/DryIceCalculator";
import UnitConversionTool from "../../components/UnitConversionTool";
import PlacardingTool from "../../components/PlacardingTool";
import CompatibilitySegregationModal from "../../components/CompatibilitySegregationModal";
import { InspectorShipment } from "../../types/sddg";
import { useDatabase } from "../../contexts/DataProvider";
import { useInspectionFormActions } from "../../contexts/InspectionFormProvider";
import { useFocusEffect } from "@react-navigation/native";
import { MLDetectionScreen } from "./MLDetectionScreen";
import { DevBenchmarkButton } from "../../components/dev/DevBenchmarkButton";
import { Form1015Viewer } from "../../components/Inspector/Form1015Viewer";
import { SDDGImageViewer } from "../../components/Inspector/SDDGImageViewer";
import { useRenderTracker, useContextRenderTracker } from "@/hooks/useRenderTracker";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import Svg, { Circle, Line } from "react-native-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  buildForm1015PdfData,
  generateForm1015Pdf,
} from "../../utils/form1015PdfGenerator";
import {
  cleanupInspectorDocumentTempUris,
  composeInspectorSddgPdf,
} from "@/utils/inspectorSddgDocumentComposer";
import { mergePdfDocuments } from "@/utils/sddgPdfGenerator";
import {
  colors,
  spacing,
  borderRadius,
  shadows,
} from "../../components/ui";

console.warn = () => {};

type SelectedDocumentType = "sddg" | "1015";

const sanitizeFilenameSegment = (value: string): string =>
  value.replace(/[^a-zA-Z0-9]/g, "_");

function InspectorHomeScreenComponent({
  navigation,
}: {
  navigation: any;
}) {
  // === CONTEXT SUBSCRIPTIONS ===
  const preparerContext = useContext(HazProPreparerContext);
  const { dispatch } = preparerContext;
  const inspectorContext = useContext(HazProInspectorContext);
  const { dispatch: inspectorDispatch } = inspectorContext;
  const { navigate, reset, navigationRef } = useNavigationRef();
  const database = useDatabase();
  const { loadInspectionForEdit, startNewInspection } = useInspectionFormActions();

  // === LOCAL STATE ===
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
  // Form 1015 viewer modal (FlatList-based, works on Android)
  const [form1015ModalVisible, setForm1015ModalVisible] = useState<boolean>(false);
  const [selectedInspectionForForm, setSelectedInspectionForForm] = useState<InspectorShipment | null>(null);
  const [sddgViewerModalVisible, setSddgViewerModalVisible] = useState<boolean>(false);
  const [selectedInspectionForSDDG, setSelectedInspectionForSDDG] =
    useState<InspectorShipment | null>(null);
  const [mlModalVisible, setMlModalVisible] = useState<boolean>(false);
  const [inspections, setInspections] = useState<InspectorShipment[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<
    Map<string, Set<SelectedDocumentType>>
  >(new Map());
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [sddgImageUriCache, setSddgImageUriCache] = useState<
    Map<string, string | null>
  >(new Map());

  const logWrappedStackDepth = () => {
    const rootState = navigationRef?.getRootState?.();
    const inspectorRoute = rootState?.routes?.find(
      route => route.name === "Hazardous Material Inspector"
    ) as { state?: { routes?: Array<{ name: string; state?: unknown }> } } | undefined;
    const inspectorState = inspectorRoute?.state;
    const wrappedRoute = inspectorState?.routes?.find(
      route => route.name === "InspectorWrappedStack"
    ) as { state?: { routes?: Array<{ name: string }> } } | undefined;
    const routeCount = wrappedRoute?.state?.routes?.length ?? 0;
    const routeNames = wrappedRoute?.state?.routes?.map(route => route.name) ?? [];

    console.log(
      "🧭 [InspectorHome] InspectorWrappedStack depth:",
      routeCount,
      routeNames
    );
  };

  // // === RENDER TRACKING ===
  // useRenderTracker('InspectorHomeScreen', { navigation }, {
  //   searchQuery,
  //   refreshing,
  //   gasModalVisible,
  //   dryIceModalVisible,
  //   unitConversionModalVisible,
  //   placardingModalVisible,
  //   placardingModalExpanded,
  //   compatibilityModalVisible,
  //   form1015ModalVisible,
  //   mlModalVisible,
  //   selectionMode,
  //   inspectionsCount: inspections.length,
  //   dbInitialized: database.isInitialized,
  // });

  // Track context changes
  // useContextRenderTracker('InspectorHomeScreen', 'HazProPreparerContext', preparerContext);
  // useContextRenderTracker('InspectorHomeScreen', 'HazProInspectorContext', inspectorContext);
  // useContextRenderTracker('InspectorHomeScreen', 'Database', { isInitialized: database.isInitialized });

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

  const getSddgImageUri = useCallback(
    (inspection: InspectorShipment): string | null =>
      inspection.inspectionContext?.originalImageUri ||
      sddgImageUriCache.get(inspection.id) ||
      null,
    [sddgImageUriCache]
  );

  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedDocuments(new Map());
  }, []);

  const handleLongPress = useCallback(
    (inspection: InspectorShipment) => {
      const docs = new Set<SelectedDocumentType>();
      if (getSddgImageUri(inspection)) {
        docs.add("sddg");
      }
      docs.add("1015");
      setSelectionMode(true);
      setSelectedDocuments(new Map([[inspection.id, docs]]));
    },
    [getSddgImageUri]
  );

  const toggleDocumentSelection = useCallback(
    (
      inspectionId: string,
      docType: SelectedDocumentType,
      isDocAvailable: boolean
    ) => {
      if (!isDocAvailable) {
        return;
      }

      setSelectedDocuments(prev => {
        const next = new Map(prev);
        const existing = next.get(inspectionId);
        const docs = new Set<SelectedDocumentType>(existing ? Array.from(existing) : []);

        if (docs.has(docType)) {
          docs.delete(docType);
        } else {
          docs.add(docType);
        }

        if (docs.size === 0) {
          next.delete(inspectionId);
        } else {
          next.set(inspectionId, docs);
        }
        return next;
      });
    },
    []
  );

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
    const inspectorValue =
      typeof inspection.inspector === "string"
        ? inspection.inspector
        : inspection.inspector?.inspectorName || "";
    return (
      inspection.tcn.toLowerCase().includes(searchLower) ||
      inspection.unId.toLowerCase().includes(searchLower) ||
      inspection.properShippingName.toLowerCase().includes(searchLower) ||
      inspectorValue.toLowerCase().includes(searchLower) ||
      inspection.status.toLowerCase().includes(searchLower)
    );
  });

  const totalSelectedCount = useMemo(
    () =>
      Array.from(selectedDocuments.values()).reduce(
        (count, docs) => count + docs.size,
        0
      ),
    [selectedDocuments]
  );

  useEffect(() => {
    if (!database.isInitialized || inspections.length === 0) {
      return;
    }

    let cancelled = false;

    const loadSddgImageUris = async () => {
      const results = await Promise.all(
        inspections.map(async inspection => {
          try {
            const fullInspection = await database.loadInspection(inspection.id);
            return {
              inspectionId: inspection.id,
              imageUri: fullInspection?.inspectionContext?.originalImageUri || null,
            };
          } catch {
            return { inspectionId: inspection.id, imageUri: null };
          }
        })
      );

      if (cancelled) {
        return;
      }

      setSddgImageUriCache(prev => {
        const next = new Map(prev);
        results.forEach(({ inspectionId, imageUri }) => {
          next.set(inspectionId, imageUri);
        });
        return next;
      });
    };

    loadSddgImageUris();

    return () => {
      cancelled = true;
    };
  }, [database, database.isInitialized, inspections]);

  // Reset contexts on mount
  useEffect(() => {
    dispatch({ type: "RESET_CONTEXT" });
    inspectorDispatch({ type: "RESET_CONTEXT" });
  }, []);

  const loadInspections = useCallback(async () => {
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
  }, [database]);

  // Load inspections when database is initialized
  useEffect(() => {
    if (!database.isInitialized) {
      console.log("🗄️ [InspectorHome] Waiting for database initialization...");
      return;
    }

    loadInspections();
  }, [database.isInitialized, loadInspections]);

  useFocusEffect(
    useCallback(() => {
      if (!database.isInitialized) {
        return;
      }

      loadInspections();
    }, [database.isInitialized, loadInspections])
  );

  useFocusEffect(
    useCallback(() => {
      if (!selectionMode) {
        return;
      }

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          exitSelectionMode();
          return true;
        }
      );

      return () => subscription.remove();
    }, [exitSelectionMode, selectionMode])
  );

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
      try {
        await loadInspectionForEdit(inspection.id);
        navigate("InspectorWrappedStack", {
          screen: "PackageInspectionCompleteScreen",
        });
      } catch (error) {
        Alert.alert("Error", "Failed to load inspection data. Please try again.");
      }
      return;
    }

    // Package not started yet (N/A)
    if (inspection.packageStatus === null) {
      Alert.alert(
        "Package Inspection Not Started",
        "The SDDG phase is complete. Would you like to continue with the package inspection?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: async () => {
              try {
                await loadInspectionForEdit(inspection.id);
                const unIdNo = inspection.unId || "";
                navigate("InspectorWrappedStack", {
                  screen: "MLDetectionScreen",
                  params: { unIdNo },
                } as any);
              } catch (error) {
                Alert.alert("Error", "Failed to load inspection data. Please try again.");
              }
            },
          },
        ]
      );
      return;
    }

    // Package frustrated -> Load and navigate to summary
    if (inspection.packageStatus === "frustrated") {
      try {
        await loadInspectionForEdit(inspection.id);
        navigate("InspectorWrappedStack", {
          screen: "PackageFrustrationSummary",
        });
      } catch (error) {
        Alert.alert("Error", "Failed to load inspection data. Please try again.");
      }
      return;
    }

    // Package verified -> Show detail view (existing logic handled above)
  };

  // Function to handle View Form 1015 click - load inspection and show modal
  const handleViewForm1015 = async (inspection: InspectorShipment) => {
    console.log(
      "📋 [InspectorHome] View Form 1015 clicked for inspection:",
      inspection.tcn
    );

    try {
      console.log("📋 [InspectorHome] Loading full inspection for form view...");
      const fullInspection = await database.loadInspection(inspection.id);

      if (!fullInspection) {
        Alert.alert("Error", "Inspection not found.");
        return;
      }

      console.log("📋 [InspectorHome] Inspection loaded, showing modal...");
      setSelectedInspectionForForm(fullInspection);
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

  const handleViewSDDG = async (inspection: InspectorShipment) => {
    try {
      const fullInspection = await database.loadInspection(inspection.id);
      if (!fullInspection?.inspectionContext?.originalImageUri) {
        Alert.alert("Not Available", "No SDDG image for this inspection.");
        return;
      }

      const fileInfo = await FileSystem.getInfoAsync(
        fullInspection.inspectionContext.originalImageUri
      );
      if (!fileInfo.exists) {
        Alert.alert("Not Available", "SDDG image not available.");
        return;
      }

      setSelectedInspectionForSDDG(fullInspection);
      setSddgViewerModalVisible(true);
    } catch (error) {
      console.error("Failed to load SDDG image:", error);
      Alert.alert("Error", "Failed to load inspection data. Please try again.");
    }
  };

  const handleShareSelected = useCallback(async () => {
    if (totalSelectedCount === 0) {
      return;
    }

    setIsGeneratingPdf(true);

    let pdfUri: string | null = null;
    let namedUri: string | null = null;
    const tempUrisToCleanup: string[] = [];

    try {
      const selectedSnapshot = new Map(selectedDocuments);
      const inspectionIds = Array.from(selectedSnapshot.keys());
      const errors: string[] = [];
      const warnings: string[] = [];
      const documentUris: string[] = [];
      const sddgIncludesAuthByInspection = new Map<string, boolean>();

      const inspectionResults = await Promise.allSettled(
        inspectionIds.map(id => database.loadInspection(id))
      );

      const loadedInspections = new Map<string, InspectorShipment>();
      inspectionResults.forEach((result, index) => {
        const inspectionId = inspectionIds[index];
        if (result.status === "fulfilled" && result.value) {
          loadedInspections.set(inspectionId, result.value);
        } else {
          errors.push(`Inspection ${inspectionId} could not be loaded`);
        }
      });

      for (const inspectionId of inspectionIds) {
        const docs = selectedSnapshot.get(inspectionId);
        if (!docs || docs.size === 0) {
          continue;
        }

        const inspection = loadedInspections.get(inspectionId);
        if (!inspection) {
          continue;
        }

        if (docs.has("sddg")) {
          try {
            const composed = await composeInspectorSddgPdf(inspection);
            documentUris.push(composed.pdfUri);
            tempUrisToCleanup.push(...composed.tempUris);
            sddgIncludesAuthByInspection.set(
              inspectionId,
              composed.includesAuthAttachments
            );
            warnings.push(
              ...composed.warnings.map(
                warning => `${inspection.tcn || inspection.id}: ${warning}`
              )
            );
          } catch (error) {
            errors.push(`SDDG document missing for ${inspection.tcn}`);
          }
        }

        if (docs.has("1015")) {
          try {
            const form1015Data = buildForm1015PdfData(inspection);
            const form1015PdfUri = await generateForm1015Pdf(form1015Data);
            documentUris.push(form1015PdfUri);
            tempUrisToCleanup.push(form1015PdfUri);
          } catch (error) {
            errors.push(`AMC 1015 document missing for ${inspection.tcn}`);
          }
        }
      }

      if (documentUris.length === 0) {
        Alert.alert("Error", "No valid documents were available to share.");
        return;
      }

      if (documentUris.length === 1) {
        pdfUri = documentUris[0];
      } else {
        pdfUri = await mergePdfDocuments(documentUris, {
          title: "Inspector Document Bundle",
          subject: "Inspector shipment document export",
          keywords: ["inspector", "SDDG", "AMC1015", "hazpro"],
          outputFilenamePrefix: "inspector_documents",
        });
        tempUrisToCleanup.push(pdfUri);
      }

      const singleInspectionId = inspectionIds[0];
      const singleSelectionSet =
        inspectionIds.length === 1 ? selectedSnapshot.get(singleInspectionId) : null;
      const includesSingleSddgWithAuth =
        inspectionIds.length === 1 &&
        totalSelectedCount === 1 &&
        singleSelectionSet?.has("sddg") &&
        sddgIncludesAuthByInspection.get(singleInspectionId) === true;

      const currentDate = new Date().toISOString().split("T")[0];
      const isSingleInspection = inspectionIds.length === 1;
      const singleInspection = isSingleInspection
        ? loadedInspections.get(inspectionIds[0])
        : null;

      let filename: string;
      if (isSingleInspection && totalSelectedCount === 1) {
        const selectedSet = selectedSnapshot.get(inspectionIds[0]);
        const singleDocType = selectedSet ? Array.from(selectedSet)[0] : "1015";
        const tcn = sanitizeFilenameSegment(singleInspection?.tcn || "unknown");
        if (singleDocType === "sddg") {
          filename = includesSingleSddgWithAuth
            ? `SDDG_${tcn}_WITH_AUTH_${currentDate}.pdf`
            : `SDDG_${tcn}_${currentDate}.pdf`;
        } else {
          filename = `AMC1015_${tcn}_${currentDate}.pdf`;
        }
      } else if (isSingleInspection) {
        const tcn = sanitizeFilenameSegment(singleInspection?.tcn || "unknown");
        filename = `Inspection_${tcn}_${currentDate}.pdf`;
      } else {
        filename = `Inspections_${currentDate}.pdf`;
      }

      namedUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.copyAsync({ from: pdfUri, to: namedUri });

      await Sharing.shareAsync(namedUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share Inspections",
        UTI: "com.adobe.pdf",
      });

      if (errors.length > 0 || warnings.length > 0) {
        Alert.alert(
          "Warning",
          `${errors.length + warnings.length} issue(s) detected:\n${[
            ...errors,
            ...warnings,
          ].join("\n")}`
        );
      }

      exitSelectionMode();
    } catch (error) {
      console.error("Failed to generate/share combined PDF:", error);
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    } finally {
      await cleanupInspectorDocumentTempUris(tempUrisToCleanup);
      setIsGeneratingPdf(false);
    }
  }, [database, exitSelectionMode, selectedDocuments, totalSelectedCount]);

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
                color={legacyColors.blue}
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
                color={legacyColors.blue}
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
                color={legacyColors.blue}
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
                color={legacyColors.blue}
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
                color={legacyColors.blue}
              />
              <Text style={styles.calcTextSoft}>
                Compatibility/Segregation Tool
              </Text>
            </TouchableOpacity>
            {/* ML Label Detection Test Button */}
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
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
              testID="start-new-inspection-button"
              onPress={() => {
                console.log("🧭 [InspectorHome] Start New Inspection pressed");
                startNewInspection();
                logWrappedStackDepth();
                reset({
                  index: 0,
                  routes: [
                    {
                      name: "InspectorWrappedStack",
                      params: { screen: "SDDGUploadAndParse" },
                    },
                  ],
                });
              }}
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
            <Text style={[styles.headerText, styles.docHeaderCell]}>SDDG Doc</Text>
            <Text style={[styles.headerText, styles.docHeaderCell]}>AMC 1015</Text>
          </View>
        </View>
      </View>
    </>
  );

  const class2Materials = hazardousMaterialsList.filter((material) => material.packagingParagraph.startsWith("A6") && material.packagingParagraph !== "FORBIDDEN");
  console.log("class2Materials: ", JSON.stringify(class2Materials, null, 2));

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
          contentContainerStyle={selectionMode ? styles.listWithSelectionFooter : undefined}
          renderItem={({ item }) => {
            const sddgImageUri = getSddgImageUri(item);
            const hasSddgDoc = Boolean(sddgImageUri);
            const selectedForInspection = selectedDocuments.get(item.id);
            const sddgSelected = selectedForInspection?.has("sddg") || false;
            const formSelected = selectedForInspection?.has("1015") || false;
            const inspectorName =
              typeof item.inspector === "string"
                ? item.inspector
                : item.inspector?.inspectorName || "";
            const authType = item.specialAuthorizationType || null;

            const rowContent = (
              <TouchableOpacity
                onLongPress={() => {
                  if (!selectionMode) {
                    handleLongPress(item);
                  }
                }}
                style={styles.listItemContainer}
                activeOpacity={1}
              >
                <View style={styles.listItemRow}>
                  <Text style={styles.columnText}>{item.tcn?.replace(/^'?SREFERENCENUMBERTCN:/i, "")}</Text>
                  <Text style={styles.columnText}>{item.unId}</Text>
                  <Text style={styles.columnText}>{item.properShippingName}</Text>

                  <View style={styles.sddgStatusTouchable}>
                    {selectionMode ? (
                      <View style={styles.statusCellCenter}>
                        <Text
                          style={[
                            styles.columnText,
                            styles.statusText,
                            item.sddgStatus === "verified"
                              ? styles.verifiedStatus
                              : styles.frustratedStatus,
                          ]}
                        >
                          {item.sddgStatus === "verified" ? "Verified" : "Frustrated"}
                        </Text>
                      </View>
                    ) : (
                      <TapGestureHandler
                        onHandlerStateChange={({ nativeEvent }) => {
                          if (nativeEvent.state === State.ACTIVE) {
                            handleSDDGStatusClick(item);
                          }
                        }}
                      >
                        <View style={styles.statusCellCenter}>
                          <Text
                            style={[
                              styles.columnText,
                              styles.statusText,
                              item.sddgStatus === "verified"
                                ? styles.verifiedStatus
                                : styles.frustratedStatus,
                            ]}
                          >
                            {item.sddgStatus === "verified" ? "Verified" : "Frustrated"}
                          </Text>
                        </View>
                      </TapGestureHandler>
                    )}
                  </View>

                  <View style={styles.sddgStatusTouchable}>
                    {selectionMode ? (
                      <View style={styles.statusCellCenter}>
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
                    ) : (
                      <TapGestureHandler
                        onHandlerStateChange={({ nativeEvent }) => {
                          if (nativeEvent.state === State.ACTIVE) {
                            handlePackageStatusClick(item);
                          }
                        }}
                      >
                        <View style={styles.statusCellCenter}>
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
                    )}
                  </View>

                  <Text style={styles.columnText}>{inspectorName || "N/A"}</Text>

                  {/* SDDG Doc column */}
                  <View style={styles.iconColumn}>
                    {selectionMode ? (
                      <TapGestureHandler
                        onHandlerStateChange={({ nativeEvent }) => {
                          if (nativeEvent.state === State.ACTIVE) {
                            toggleDocumentSelection(item.id, "sddg", hasSddgDoc);
                          }
                        }}
                      >
                        <View style={styles.sddgDocCellWrapper}>
                          <MaterialIcons
                            name={sddgSelected ? "check-box" : "check-box-outline-blank"}
                            size={28}
                            color={
                              !hasSddgDoc
                                ? colors.textSecondary
                                : sddgSelected
                                ? colors.primary
                                : colors.textSecondary
                            }
                          />
                          {authType && (
                            <View style={styles.authBadge}>
                              <Text style={styles.authBadgeText}>{authType}</Text>
                            </View>
                          )}
                        </View>
                      </TapGestureHandler>
                    ) : hasSddgDoc ? (
                      <TouchableOpacity onPress={() => handleViewSDDG(item)} activeOpacity={0.7}>
                        <View style={styles.sddgDocCellWrapper}>
                          <MaterialCommunityIcons
                            name="file-document"
                            size={28}
                            color={colors.primary}
                          />
                          {authType && (
                            <View style={styles.authBadge}>
                              <Text style={styles.authBadgeText}>{authType}</Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <Text style={styles.docUnavailableText}>—</Text>
                    )}
                  </View>

                  {/* AMC 1015 column */}
                  <View style={styles.iconColumn}>
                    {selectionMode ? (
                      <TapGestureHandler
                        onHandlerStateChange={({ nativeEvent }) => {
                          if (nativeEvent.state === State.ACTIVE) {
                            toggleDocumentSelection(item.id, "1015", true);
                          }
                        }}
                      >
                        <View>
                          <MaterialIcons
                            name={formSelected ? "check-box" : "check-box-outline-blank"}
                            size={28}
                            color={formSelected ? colors.primary : colors.textSecondary}
                          />
                        </View>
                      </TapGestureHandler>
                    ) : (
                      <TouchableOpacity onPress={() => handleViewForm1015(item)} activeOpacity={0.7}>
                        <MaterialCommunityIcons
                          name="file-document"
                          size={28}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );

            if (selectionMode) {
              return rowContent;
            }

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
                {rowContent}
              </Swipeable>
            );
          }}
        />

        {selectionMode && (
          <View style={styles.selectionActionBar}>
            <TouchableOpacity
              onPress={exitSelectionMode}
              style={styles.selectionActionIconButton}
            >
              <MaterialIcons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <Text style={styles.selectionCountText}>
              {totalSelectedCount} document{totalSelectedCount !== 1 ? "s" : ""} selected
            </Text>

            <TouchableOpacity
              onPress={handleShareSelected}
              disabled={totalSelectedCount === 0 || isGeneratingPdf}
              style={[
                styles.selectionActionIconButton,
                (totalSelectedCount === 0 || isGeneratingPdf) &&
                  styles.selectionActionButtonDisabled,
              ]}
            >
              {isGeneratingPdf ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Svg width={28} height={28} viewBox="0 0 64 64" fill="none">
                  <Line
                    x1="25.5"
                    y1="32"
                    x2="38.5"
                    y2="22"
                    stroke="#223654"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Line
                    x1="25.5"
                    y1="32"
                    x2="38.5"
                    y2="42"
                    stroke="#223654"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle cx="20" cy="32" r="5.5" stroke="#223654" strokeWidth="4" />
                  <Circle cx="44" cy="18" r="5.5" stroke="#223654" strokeWidth="4" />
                  <Circle cx="44" cy="46" r="5.5" stroke="#223654" strokeWidth="4" />
                </Svg>
              )}
            </TouchableOpacity>
          </View>
        )}

        <StatusBar style="auto" />

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

        {/* === ML DETECTION MODAL === */}
        <Modal
          visible={mlModalVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setMlModalVisible(false)}
        >
          <MLDetectionScreen onClose={() => setMlModalVisible(false)} />
        </Modal>

        {/* === FORM 1015 VIEWER MODAL === */}
        <Modal
          visible={form1015ModalVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => {
            setForm1015ModalVisible(false);
            setSelectedInspectionForForm(null);
          }}
        >
          {selectedInspectionForForm && (
            <Form1015Viewer
              inspection={selectedInspectionForForm}
              onClose={() => {
                setForm1015ModalVisible(false);
                setSelectedInspectionForForm(null);
              }}
            />
          )}
        </Modal>

        {/* === SDDG IMAGE VIEWER MODAL === */}
        <Modal
          visible={sddgViewerModalVisible}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => {
            setSddgViewerModalVisible(false);
            setSelectedInspectionForSDDG(null);
          }}
        >
          {selectedInspectionForSDDG && (
            <SDDGImageViewer
              inspection={selectedInspectionForSDDG}
              onClose={() => {
                setSddgViewerModalVisible(false);
                setSelectedInspectionForSDDG(null);
              }}
            />
          )}
        </Modal>

        {/* Dev Benchmark Button - only visible in __DEV__ */}
        <DevBenchmarkButton position="bottom-right" />
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: colors.surface,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  grayBackground: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  whiteContainer: {
    width: "100%",
    backgroundColor: colors.surface,
    padding: spacing.sm,
    ...shadows.light,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "bold",
    flex: 1,
    marginLeft: spacing.sm,
    color: colors.textPrimary,
  },
  searchInput: {
    flex: 1,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.sm,
    height: 50,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.background,
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: "center",
    zIndex: 2,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
    color: colors.textPrimary,
  },
  flex1: { flex: 1 },
  docHeaderCell: {
    width: 74,
    fontSize: 14,
  },
  iconColumn: {
    width: 74,
    alignItems: "center",
    justifyContent: "center",
  },
  sddgDocCellWrapper: {
    position: "relative",
  },
  authBadge: {
    position: "absolute",
    top: -4,
    right: -12,
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 3,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: "center",
  },
  authBadgeText: {
    fontSize: 8,
    fontWeight: "700",
    color: colors.white,
  },
  docUnavailableText: {
    fontSize: 18,
    color: colors.textSecondary,
    textAlign: "center",
  },
  listItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
  },
  columnText: {
    fontSize: 15,
    flex: 1,
    textAlign: "center",
    color: colors.textPrimary,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    overflow: "hidden",
    textAlign: "center",
    minWidth: 80,
  },
  verifiedStatus: {
    backgroundColor: colors.successLight,
    color: colors.success,
  },
  frustratedStatus: {
    backgroundColor: colors.errorLight,
    color: colors.error,
  },
  naStatus: {
    backgroundColor: colors.background,
    color: colors.textSecondary,
  },
  selectionActionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.light,
  },
  selectionActionIconButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  selectionActionButtonDisabled: {
    opacity: 0.55,
  },
  selectionCountText: {
    flex: 1,
    marginHorizontal: spacing.md,
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  listWithSelectionFooter: {
    paddingBottom: 88,
  },
  toolButtonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  calcSoft: {
    backgroundColor: colors.infoLight,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.xs,
    minWidth: 220,
  },
  calcTextSoft: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "600",
  },
  disabledToolButton: {
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    width: 350,
    opacity: 0.6,
  },
  disabledToolButtonText: {
    color: colors.textSecondary,
    fontSize: 20,
    fontWeight: "600",
  },
  sddgStatusTouchable: {
    // Ensure the touchable area covers the entire cell area
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
  },
  statusCellCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.5,
  },
  listItemContainer: {
    paddingVertical: spacing.lg,
    paddingHorizontal: 0,
    margin: 0,
    borderBottomWidth: 1,
    borderColor: colors.border,
    width: "100%",
    borderRadius: 0,
    backgroundColor: colors.surface,
  },
  swipeAction: {
    justifyContent: "center",
    alignItems: "center",
    width: 120,
  },
  swipeActionLeft: {
    backgroundColor: colors.primary,
  },
  swipeActionRight: {
    backgroundColor: colors.error,
  },
  swipeButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.primary,
    flexDirection: "row",
  },
  swipeButtonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
});

// Wrap in React.memo with custom comparison
// The navigation prop from React Navigation changes frequently, so we ignore it
// Screen re-renders should only happen from internal state/context changes
export default React.memo(InspectorHomeScreenComponent, () => {
  // Return true = props are equal = don't re-render from parent
  // Screens get navigation state via hooks, not props, so this is safe
  return true;
});
