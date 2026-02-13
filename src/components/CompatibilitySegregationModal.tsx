import {
  HazardousMaterialItem,
  hazardousMaterialsList,
} from "@/hazardousMaterials/hazardousMaterialsList";
import { allHazmatCompatibilityKeys } from "@/utils/hazmat-compatibility-engine/allHazmatCompatibilityKeys";
import { runGraphEngineOptimized } from "@/utils/hazmat-compatibility-engine/optimizedEngine";
import { NoteConditionPair } from "@/utils/hazmat-compatibility-engine/engineTypes";
import {
  buildCompatibilityMatrix,
  CellDetail,
} from "@/utils/hazmat-compatibility-engine/matrixBuilder";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { rules } from "@/utils/hazmat-compatibility-engine/rules";

// Local colors object
const colors = {
  white: "#FFFFFF",
  text: "#000000",
  borderGray: "#CCCCCC",
  primary: "#007AFF",
  background: "#F5F5F5",
  danger: "#DC2626",
  warning: "#F59E0B",
  success: "#10B981",
  darkGray: "#374151",
  lightGray: "#E5E7EB",
  militaryGreen: "#4B5320",
  headerBg: "#1F2937",
};

export type CheckCompatibleHazmatInput = {
  compatibilityGroup: string;
  hazardClassDivisionNumber: string;
  properShippingName: string;
  unid: string;
  packingGroup: string;
};

interface HazmatRow {
  id: string;
  unNumber: string;
  properShippingName: string;
  hazardClass: string;
  packingGroup: string;
  selectedMaterial?: HazardousMaterialItem;
  availableMaterials?: HazardousMaterialItem[];
  showPicker?: boolean;
  editingShippingName?: boolean;
  availablePackingGroups?: string[]; // e.g., ['II', 'III']
  selectedPackingGroup?: string; // User's choice
}

// Type for grouped and deduplicated notes
type GroupedNoteCondition = {
  noteCondition: string;
  noteContent: string;
  status: "compatible" | "incompatible" | "segregation";
  pairs: Array<{
    material1: { unid: string; hazardClass: string };
    material2: { unid: string; hazardClass: string };
  }>;
};

const getNoteMetadata = (
  noteCondition: string
): { table: "A18.1" | "A18.2" | "A18.4" | "UNKNOWN"; number: number } => {
  const a182Match = noteCondition.match(/^a18_2_note(\d+)$/);
  if (a182Match) {
    return { table: "A18.2", number: parseInt(a182Match[1], 10) };
  }

  const chapter3Match = noteCondition.match(/^chapter3_note(\d+)$/);
  if (chapter3Match) {
    return { table: "A18.4", number: parseInt(chapter3Match[1], 10) };
  }

  if (noteCondition === "chapter3_general") {
    return { table: "A18.4", number: 0 };
  }

  const a181Match = noteCondition.match(/^note(\d+)$/);
  if (a181Match) {
    return { table: "A18.1", number: parseInt(a181Match[1], 10) };
  }

  return { table: "UNKNOWN", number: 999 };
};

const getNoteSortKey = (noteCondition: string): number => {
  const metadata = getNoteMetadata(noteCondition);
  const tableOrder =
    metadata.table === "A18.1"
      ? 1000
      : metadata.table === "A18.2"
      ? 2000
      : metadata.table === "A18.4"
      ? 3000
      : 9000;
  return tableOrder + metadata.number;
};

const formatNoteLabel = (noteCondition: string): string => {
  if (noteCondition === "chapter3_general") {
    return "CHAPTER 3 AUTHORIZATION";
  }

  const metadata = getNoteMetadata(noteCondition);
  if (metadata.table === "UNKNOWN") {
    return noteCondition.toUpperCase();
  }

  if (metadata.table === "A18.4") {
    return `CHAPTER 3 RULE ${metadata.number}`;
  }

  return `TABLE ${metadata.table} NOTE ${metadata.number}`;
};

const formatNoteReference = (noteCondition: string): string => {
  if (noteCondition === "chapter3_general") {
    return "AFMAN 24-604 A18.4";
  }

  const metadata = getNoteMetadata(noteCondition);
  if (metadata.table === "UNKNOWN") {
    return "AFMAN 24-604";
  }

  if (metadata.table === "A18.4") {
    return `AFMAN 24-604 A18.4.${metadata.number}`;
  }

  return `AFMAN 24-604 Table ${metadata.table} Note ${metadata.number}`;
};

interface CompatibilitySegregationModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * Deduplicate notes by noteContent and group all applicable material pairs
 * Sort by noteCondition (note1, note4, note5, etc.)
 */
const deduplicateAndSortNotes = (
  notes: NoteConditionPair[]
): GroupedNoteCondition[] => {
  // Group by noteCondition (which should have unique noteContent per condition)
  const groupedMap = new Map<string, GroupedNoteCondition>();

  notes.forEach(note => {
    const key = note.noteCondition;

    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        noteCondition: note.noteCondition,
        noteContent: note.noteContent,
        status: note.status,
        pairs: [],
      });
    }

    const grouped = groupedMap.get(key)!;
    grouped.pairs.push({
      material1: {
        unid: note.hazmatObjectPair[0].unid,
        hazardClass: note.hazmatObjectPair[0].hazardClassDivisionNumber,
      },
      material2: {
        unid: note.hazmatObjectPair[1].unid,
        hazardClass: note.hazmatObjectPair[1].hazardClassDivisionNumber,
      },
    });
  });

  // Sort by noteCondition (note1, note4, note5, etc.)
  return Array.from(groupedMap.values()).sort((a, b) => {
    return getNoteSortKey(a.noteCondition) - getNoteSortKey(b.noteCondition);
  });
};

/**
 * PackingGroupSelector Component
 * Displays packing group selection interface:
 * - Plain text for single option
 * - Pill button selector for multiple options
 */
interface PackingGroupSelectorProps {
  packingGroup: string;
  availablePackingGroups?: string[];
  selectedPackingGroup?: string;
  onSelect: (group: string) => void;
  hasError?: boolean;
}

const PackingGroupSelector: React.FC<PackingGroupSelectorProps> = ({
  packingGroup,
  availablePackingGroups,
  selectedPackingGroup,
  onSelect,
  hasError = false,
}) => {
  // Single packing group - display as plain text
  if (!availablePackingGroups || availablePackingGroups.length <= 1) {
    return (
      <Text style={[styles.enhancedInput, styles.packingGroupText]}>
        {packingGroup || "N/A"}
      </Text>
    );
  }

  // Multiple packing groups - display as pill buttons
  return (
    <View
      style={[
        styles.packingGroupSelectorContainer,
        hasError && styles.errorInputContainer,
      ]}
    >
      {availablePackingGroups.map(group => {
        const isSelected = selectedPackingGroup === group;
        return (
          <TouchableOpacity
            key={group}
            style={[styles.pillButton, isSelected && styles.pillButtonSelected]}
            onPress={() => onSelect(group)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.pillButtonText,
                isSelected && styles.pillButtonTextSelected,
              ]}
            >
              {group}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const CompatibilitySegregationModal: React.FC<
  CompatibilitySegregationModalProps
> = ({ visible, onClose }) => {
  const [hazmatRows, setHazmatRows] = useState<HazmatRow[]>([
    {
      id: "1",
      unNumber: "",
      properShippingName: "",
      hazardClass: "",
      packingGroup: "",
    },
  ]);
  const [chapter3Enabled, setChapter3Enabled] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentView, setCurrentView] = useState<"input" | "matrix">("input");
  const [matrixData, setMatrixData] = useState<string[][]>([]);
  const [matrixHeaders, setMatrixHeaders] = useState<string[]>([]);
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [hazmatInputs, setHazmatInputs] = useState<
    CheckCompatibleHazmatInput[]
  >([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const [showClass1Only, setShowClass1Only] = useState(false);
  const [cellDetailsMatrix, setCellDetailsMatrix] = useState<CellDetail[][]>(
    []
  );
  const [selectedCellDetails, setSelectedCellDetails] =
    useState<CellDetail | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeNotes, setActiveNotes] = useState<GroupedNoteCondition[]>([]);
  const [notesExpanded, setNotesExpanded] = useState(true);

  const unNumberRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    unNumberRefs.current = unNumberRefs.current.slice(0, hazmatRows.length);
  }, [hazmatRows.length]);

  const focusNextUNField = (currentRowIndex: number) => {
    const nextRowIndex = currentRowIndex + 1;

    if (nextRowIndex < hazmatRows.length) {
      const nextInput = unNumberRefs.current[nextRowIndex];
      if (nextInput) {
        setTimeout(() => {
          nextInput.focus();
        }, 100);
        return;
      }
    }

    Keyboard.dismiss();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true);
        setShowFooter(false);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false);
        setShowFooter(true);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleClose = () => {
    setHazmatRows([
      {
        id: "1",
        unNumber: "",
        properShippingName: "",
        hazardClass: "",
        packingGroup: "",
      },
    ]);
    setCurrentView("input");
    setMatrixData([]);
    setMatrixHeaders([]);
    setHazmatInputs([]);
    setShowClass1Only(false);
    setActiveNotes([]);
    setNotesExpanded(true);
    Keyboard.dismiss();
    onClose();
  };

  const addRow = React.useCallback(() => {
    const newRow: HazmatRow = {
      id: Date.now().toString(),
      unNumber: "",
      properShippingName: "",
      hazardClass: "",
      packingGroup: "",
    };
    setHazmatRows(prevRows => [...prevRows, newRow]);
  }, []);

  const deleteRow = React.useCallback((id: string) => {
    setHazmatRows(prevRows => {
      if (prevRows.length === 1) {
        Alert.alert("Error", "At least one row is required");
        return prevRows;
      }
      return prevRows.filter(row => row.id !== id);
    });
  }, []);

  const clearAll = React.useCallback(() => {
    setHazmatRows([
      {
        id: "1",
        unNumber: "",
        properShippingName: "",
        hazardClass: "",
        packingGroup: "",
      },
    ]);
  }, []);

  const updateRowRef = useRef<NodeJS.Timeout | null>(null);

  const updateRow = React.useCallback(
    (id: string, field: keyof HazmatRow, value: string) => {
      if (field === "unNumber" && value.replace(/[^0-9]/g, "").length === 4) {
        const normalizedUnNumber = value.trim().toUpperCase();
        const unNumberToFind = normalizedUnNumber.startsWith("UN")
          ? normalizedUnNumber
          : `UN${normalizedUnNumber}`;

        const directMatches = hazardousMaterialsList.filter(
          material => material.unid === unNumberToFind
        );
        const matchingMaterials = [...directMatches];

        if (directMatches.length > 0) {
          const indices = directMatches.map(match =>
            hazardousMaterialsList.indexOf(match)
          );
          for (const index of indices) {
            for (
              let i = Math.max(0, index - 5);
              i <= Math.min(hazardousMaterialsList.length - 1, index + 5);
              i++
            ) {
              const material = hazardousMaterialsList[i];
              if (
                material.unid === "" &&
                material.properShippingName &&
                directMatches.some(
                  dm =>
                    material.properShippingName.includes(
                      dm.properShippingName.split(",")[0]
                    ) ||
                    dm.properShippingName.includes(
                      material.properShippingName.split(",")[0]
                    )
                ) &&
                !matchingMaterials.includes(material)
              ) {
                matchingMaterials.push(material);
              }
            }
          }
        }

        if (matchingMaterials.length === 1) {
          const material = matchingMaterials[0];

          // Parse packing group for multiple options
          const packingGroupOptions = (material.packingGroup || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);
          const hasMultipleOptions = packingGroupOptions.length > 1;

          setHazmatRows(prevRows =>
            prevRows.map(row => {
              if (row.id === id) {
                return {
                  ...row,
                  unNumber: value,
                  selectedMaterial: material,
                  properShippingName:
                    material.properShippingName +
                    (material.details ? ` ${material.details}` : ""),
                  hazardClass: material.hazclassDiv,
                  packingGroup: material.packingGroup,
                  availablePackingGroups: hasMultipleOptions
                    ? packingGroupOptions
                    : undefined,
                  selectedPackingGroup: hasMultipleOptions
                    ? undefined
                    : material.packingGroup,
                  editingShippingName: false,
                  availableMaterials: undefined,
                  showPicker: false,
                };
              }
              return row;
            })
          );

          if (material.packagingParagraph === "FORBIDDEN") {
            setTimeout(
              () =>
                Alert.alert(
                  "FORBIDDEN ITEM",
                  `${material.properShippingName} cannot be shipped by military airlift.`,
                  [{ text: "OK" }]
                ),
              100
            );
          }
        } else if (matchingMaterials.length > 1) {
          Keyboard.dismiss();
          setHazmatRows(prevRows =>
            prevRows.map(row => {
              if (row.id === id) {
                return {
                  ...row,
                  unNumber: value,
                  availableMaterials: matchingMaterials,
                  showPicker: true,
                  selectedMaterial: undefined,
                  properShippingName: "",
                  hazardClass: "",
                  packingGroup: "",
                };
              }
              return row;
            })
          );
        } else {
          setHazmatRows(prevRows =>
            prevRows.map(row => {
              if (row.id === id) {
                return {
                  ...row,
                  unNumber: value,
                  properShippingName: "",
                  hazardClass: "",
                  packingGroup: "",
                  selectedMaterial: undefined,
                  availableMaterials: undefined,
                  showPicker: false,
                };
              }
              return row;
            })
          );
        }
      } else {
        setHazmatRows(prevRows =>
          prevRows.map(row => {
            if (row.id === id) {
              const updates: any = { [field]: value };
              if (field === "unNumber") {
                updates.properShippingName = "";
                updates.hazardClass = "";
                updates.packingGroup = "";
                updates.selectedMaterial = undefined;
                updates.availableMaterials = undefined;
                updates.showPicker = false;
              }
              return { ...row, ...updates };
            }
            return row;
          })
        );
      }
    },
    []
  );

  const selectMaterial = React.useCallback(
    (rowId: string, material: HazardousMaterialItem) => {
      setHazmatRows(prevRows =>
        prevRows.map(row => {
          if (row.id === rowId) {
            // Parse packing group for multiple options
            const packingGroupOptions = (material.packingGroup || "")
              .trim()
              .split(/\s+/)
              .filter(Boolean);
            const hasMultipleOptions = packingGroupOptions.length > 1;

            const updatedRow = { ...row };
            Object.assign(updatedRow, {
              selectedMaterial: material,
              properShippingName:
                material.properShippingName +
                (material.details ? ` ${material.details}` : ""),
              hazardClass: material.hazclassDiv,
              packingGroup: material.packingGroup,
              availablePackingGroups: hasMultipleOptions
                ? packingGroupOptions
                : undefined,
              selectedPackingGroup: hasMultipleOptions
                ? undefined
                : material.packingGroup,
              showPicker: false,
              editingShippingName: false,
            });

            if (material.packagingParagraph === "FORBIDDEN") {
              setTimeout(() => {
                Alert.alert(
                  "FORBIDDEN ITEM",
                  `${material.properShippingName} cannot be shipped by military airlift.`,
                  [{ text: "OK" }]
                );
              }, 100);
            }

            return updatedRow;
          }
          return row;
        })
      );
    },
    []
  );

  const formatHazmatInput = (row: HazmatRow): CheckCompatibleHazmatInput => {
    if (!row.selectedMaterial) {
      const hazardClass = (row.hazardClass || "").trim();
      const lastChar = hazardClass[hazardClass.length - 1];
      const isLetter = /[A-Z]/i.test(lastChar);

      let hazardClassDivisionNumber = hazardClass;
      let compatibilityGroup = "";

      if (isLetter) {
        hazardClassDivisionNumber = hazardClass.slice(0, -1);
        compatibilityGroup = lastChar.toUpperCase();
      }

      return {
        unid: (row.unNumber || "").trim(),
        properShippingName: (row.properShippingName || "").trim(),
        hazardClassDivisionNumber: hazardClassDivisionNumber.trim(),
        compatibilityGroup: compatibilityGroup.trim(),
        packingGroup: row.selectedPackingGroup || "",
      };
    }

    const material = row.selectedMaterial;
    const hazclassDiv = (material.hazclassDiv || "").trim();

    let hazardClassDivisionNumber = hazclassDiv;
    let compatibilityGroup = "";

    if (hazclassDiv.startsWith("1.") && hazclassDiv.length > 3) {
      const lastChar = hazclassDiv[hazclassDiv.length - 1];
      if (/[A-Z]/i.test(lastChar)) {
        hazardClassDivisionNumber = hazclassDiv.slice(0, -1);
        compatibilityGroup = lastChar.toUpperCase();
      }
    }

    const correspondingKey = allHazmatCompatibilityKeys.find(
      key =>
        key.unid === material.unid &&
        key.hazardClassDivisionNumber === hazardClassDivisionNumber &&
        (compatibilityGroup
          ? key.compatibilityGroup === compatibilityGroup
          : true)
    );

    return {
      unid: (material.unid || "").trim(),
      properShippingName: (
        correspondingKey?.properShippingName ||
        material.properShippingName ||
        ""
      ).trim(),
      hazardClassDivisionNumber: hazardClassDivisionNumber.trim(),
      compatibilityGroup: (
        correspondingKey?.compatibilityGroup ||
        compatibilityGroup ||
        ""
      ).trim(),
      packingGroup: row.selectedPackingGroup || "",
    };
  };

  const handleRun = async () => {
    const invalidRows = hazmatRows.filter(
      row =>
        !row.unNumber.trim() ||
        !row.properShippingName.trim() ||
        !row.hazardClass.trim()
    );

    if (invalidRows.length > 0) {
      Alert.alert(
        "Error",
        "Please fill in all fields for each hazardous material"
      );
      return;
    }

    setIsProcessing(true);

    try {
      const formattedInputs = hazmatRows.map(formatHazmatInput);
      setHazmatInputs(formattedInputs);

      console.log("Formatted hazmat inputs:", formattedInputs);
      console.log("Chapter 3 enabled:", chapter3Enabled);

      console.log("About to call runGraphEngineOptimized...");

      console.log(
        "formattedInputs: ",
        JSON.stringify(formattedInputs, null, 2)
      );
      const result = await runGraphEngineOptimized(formattedInputs, rules, false, {
        chapter3Enabled,
      });

      console.log("!! Engine result:", JSON.stringify(result, null, 2));

      const { matrix, headers, cellDetails } = buildCompatibilityMatrix(
        formattedInputs,
        result
      );
      setMatrixData(matrix);
      setMatrixHeaders(headers);
      setCellDetailsMatrix(cellDetails);

      // Deduplicate and sort notes before setting activeNotes
      const groupedNotes = deduplicateAndSortNotes(
        result.noteConditionPairs || []
      );
      setActiveNotes(groupedNotes);

      setCurrentView("matrix");
    } catch (error) {
      console.error("Error running compatibility engine:", error);
      console.error("Error details:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Count Class 1 materials
  const class1Count = React.useMemo(() => {
    return hazmatInputs.filter(material =>
      material.hazardClassDivisionNumber.startsWith("1")
    ).length;
  }, [hazmatInputs]);

  // Only show tabs if there are 2 or more Class 1 materials
  const shouldShowTabs = class1Count >= 2;

  const getDisplayedMaterials = React.useCallback(() => {
    if (!showClass1Only) {
      return { inputs: hazmatInputs, headers: matrixHeaders, data: matrixData };
    }

    // Find indices of Class 1 materials (hazard class starts with '1')
    const class1Indices = hazmatInputs
      .map((material, index) => ({ material, index }))
      .filter(({ material }) =>
        material.hazardClassDivisionNumber.startsWith("1")
      )
      .map(({ index }) => index);

    if (class1Indices.length === 0) {
      return { inputs: [], headers: [], data: [] };
    }

    // Filter inputs and headers
    const filteredInputs = class1Indices.map(i => hazmatInputs[i]);
    const filteredHeaders = class1Indices.map(i => matrixHeaders[i]);

    // Extract sub-matrix (only Class 1 rows/columns)
    const filteredData = class1Indices.map(i =>
      class1Indices.map(j => matrixData[i][j])
    );

    return {
      inputs: filteredInputs,
      headers: filteredHeaders,
      data: filteredData,
    };
  }, [showClass1Only, hazmatInputs, matrixHeaders, matrixData]);

  const calculateStatistics = (data: string[][]) => {
    let incompatibleCount = 0;
    let segregationCount = 0;
    let compatibleCount = 0;

    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (rowIndex < colIndex) {
          if (cell === "X") incompatibleCount++;
          else if (cell === "0") segregationCount++;
          else if (rowIndex !== colIndex) compatibleCount++;
        }
      });
    });

    return { incompatibleCount, segregationCount, compatibleCount };
  };

  const getCellDetails = (row: number, col: number) => {
    const material1 = hazmatInputs[row];
    const material2 = hazmatInputs[col];
    const status = matrixData[row][col];

    return {
      material1,
      material2,
      status,
      statusText:
        status === "X"
          ? "Incompatible"
          : status === "0"
          ? "Requires Segregation"
          : "Compatible",
    };
  };

  const getNoteDescription = (
    noteCondition: string | null
  ): { title: string; description: string } | null => {
    if (!noteCondition) return null;

    const noteDescriptions: Record<
      string,
      { title: string; description: string }
    > = {
      note1: {
        title: "Note 1 - UN2067 Exception",
        description:
          "UN2067 (Ammonium nitrate fertilizer, Class 5.1) can be loaded with Class 1.1 or 1.5 materials, overriding normal incompatibility rules.",
      },
      note4: {
        title: "Note 4 - Cyanide Restriction",
        description:
          "Cyanides or cyanide mixtures (Class 6.1) CANNOT be loaded with any Class 8 (corrosive) materials.",
      },
      note5: {
        title: "Note 5 - Nitric Acid Segregation",
        description:
          "Nitric acid in carboys (Class 8) must be separated by 2.2 m (88 inches) in all directions from other corrosive materials in carboys.",
      },
      note6: {
        title: "Note 6 - Battery Restriction",
        description:
          "Charged electric storage batteries (Class 8) CANNOT be loaded with Class 1.1 or 1.2 explosives.",
      },
      note8: {
        title: "Note 8 - Corrosive Liquid Segregation",
        description:
          "Class 8 corrosive liquids may not be loaded above or adjacent to Class 4 (flammable solid) material or Class 5 (oxidizing) material.",
      },
      note9: {
        title: "Note 9 - Aerosol Exception",
        description:
          "UN1950 (Class 2.1 aerosol cans) may be shipped with other incompatible items when separated in all directions by a minimum of 88 inches.",
      },
      note11: {
        title: "Note 11 - Lithium Battery Segregation",
        description:
          "Lithium batteries (UN3480 and UN3090 only) must be segregated from hazardous materials classified in Class 1 (other than Division 1.4S), Division 2.1, Class 3, Division 4.1, or Division 5.1.",
      },
      note12: {
        title: "Note 12 - UN3528 Exception",
        description:
          "UN3528 does NOT require segregation from other hazardous materials, removing normal segregation requirements.",
      },
      a18_2_note1: {
        title: "Table A18.2 Note 1 - Group B Exception",
        description:
          'Group "B" explosives UN0255, UN0257, UN0267, and UN0361 may be loaded with groups "C," "D," and "E".',
      },
      a18_2_note2: {
        title: "Table A18.2 Note 2 - MK 663 MOD 0",
        description:
          'Group "B" explosives in an EOD MK 663, MOD 0 container may be loaded with groups "C" through "H" and group "S".',
      },
      a18_2_note3: {
        title: "Table A18.2 Note 3 - Group F Exception",
        description:
          'Group "F" explosives UN0292 may be loaded with groups "C," "D," and "E".',
      },
      a18_2_note4: {
        title: "Table A18.2 Note 4 - Group G/S Exception",
        description:
          'Group "G" explosives UN0019, UN0300, UN0301, and UN0325 may be loaded with explosives compatible with group "S".',
      },
      a18_2_note5: {
        title: "Table A18.2 Note 5 - Group G Exception",
        description:
          'Group "G" explosives UN0009, UN0018, UN0314, UN0315, UN0317, UN0319, and UN0320 may be loaded with groups "C," "D," and "E".',
      },
      a18_2_note6: {
        title: "Table A18.2 Note 6 - Group L Restriction",
        description:
          'Group "L" explosives may only be loaded and transported with an identical item.',
      },
      a18_2_note7: {
        title: "Table A18.2 Note 7 - UN0333 to UN0337 Restriction",
        description:
          "Class 1.1 and 1.2 explosives may not be shipped with UN0333, UN0334, UN0335, UN0336, and UN0337.",
      },
      a18_2_note8: {
        title: "Table A18.2 Note 8 - Class 1.4 Group Exception",
        description:
          'Class 1.4 groups "B" and "G" may be loaded together or with Class 1.4 groups "C," "D," and "E".',
      },
      chapter3_general: {
        title: "Chapter 3 Authorization",
        description:
          "Chapter 3 authorization permits deviations from Table A18.1 and Table A18.2; normally incompatible hazardous materials may be transported on the same aircraft when separated to the maximum extent possible.",
      },
      chapter3_note1: {
        title: "Chapter 3 Rule 1 - Groups A/J/K/L Restriction",
        description:
          "Explosives in compatibility groups A, J, K, and L can only be shipped with material in compatibility group S and Class 9.",
      },
      chapter3_note2: {
        title: "Chapter 3 Rule 2 - Class 7 Restriction",
        description:
          "Fissile class III radioactive materials (Class 7) cannot be loaded, transported, or stored on the same aircraft with any other hazardous material.",
      },
      chapter3_note3: {
        title: "Chapter 3 Rule 3 - Inhalation Hazard Zone A Restriction",
        description:
          "Class 1.1, 1.2, and 1.3 cannot be shipped with any Inhalation Hazard Zone A material.",
      },
      chapter3_note4: {
        title: "Chapter 3 Rule 4 - Class 6.1 PG I Restriction",
        description:
          "Class 1.1, 1.2, and 1.3 cannot be shipped with Class 6.1 poisonous liquids, PG I.",
      },
      chapter3_note5: {
        title: "Chapter 3 Rule 5 - Cyanide Restriction",
        description:
          "Cyanides or cyanide mixtures (Class 6.1) cannot be loaded, transported, or stored with any corrosive Class 8 material.",
      },
    };

    return noteDescriptions[noteCondition] || null;
  };

  // Helper function to get status label text
  const getStatusLabel = (
    status: "compatible" | "incompatible" | "segregation"
  ): string => {
    switch (status) {
      case "compatible":
        return "COMPATIBLE";
      case "incompatible":
        return "INCOMPATIBLE";
      case "segregation":
        return "SEGREGATION";
      default:
        return "";
    }
  };

  // Regulatory Notes Section Component
  const RegulatoryNotesSection = React.memo<{
    notes: GroupedNoteCondition[];
    expanded: boolean;
    onToggle: () => void;
  }>(({ notes, expanded, onToggle }) => {
    const renderNoteCard = ({ item }: { item: GroupedNoteCondition }) => {
      const borderColorStyle =
        item.status === "incompatible"
          ? styles.noteCardBorderIncompatible
          : item.status === "segregation"
          ? styles.noteCardBorderSegregation
          : styles.noteCardBorderCompatible;

      const badgeStyle =
        item.status === "incompatible"
          ? styles.noteStatusBadgeIncompatible
          : item.status === "segregation"
          ? styles.noteStatusBadgeSegregation
          : styles.noteStatusBadgeCompatible;

      return (
        <View style={[styles.noteCard, borderColorStyle]}>
          <View style={styles.noteCardHeader}>
            <Text style={styles.noteNumber}>
              {formatNoteLabel(item.noteCondition)}
            </Text>
            <View style={[styles.noteStatusBadgeSmall, badgeStyle]}>
              <Text style={styles.noteStatusText}>
                {getStatusLabel(item.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.noteContentText}>{item.noteContent}</Text>

          {/* Display all applicable material pairs */}
          <View style={styles.allPairsContainer}>
            {item.pairs.map((pair, index) => (
              <View key={index} style={styles.materialsRow}>
                <View style={styles.materialBadge}>
                  <Text style={styles.materialBadgeText}>
                    {pair.material1.unid}
                  </Text>
                </View>
                <Feather name="arrow-right" size={14} color={colors.darkGray} />
                <View style={styles.materialBadge}>
                  <Text style={styles.materialBadgeText}>
                    {pair.material2.unid}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      );
    };

    return (
      <View style={styles.regulatoryNotesContainer}>
        <TouchableOpacity
          onPress={onToggle}
          style={styles.regulatoryNotesHeader}
          activeOpacity={0.8}
        >
          <View style={styles.notesHeaderLeft}>
            <Text style={styles.regulatoryNotesTitle}>
              REGULATORY NOTES APPLIED
            </Text>
          </View>
        </TouchableOpacity>

        {expanded && (
          <View style={styles.notesListContainer}>
            <FlatList
              data={notes}
              renderItem={renderNoteCard}
              keyExtractor={(item, index) => `${index}-${item.noteCondition}`}
              style={styles.notesList}
              contentContainerStyle={styles.notesListContent}
              showsVerticalScrollIndicator={true}
              scrollEnabled={true}
              nestedScrollEnabled={false}
            />
          </View>
        )}
      </View>
    );
  });

  const renderMatrix = () => {
    const {
      inputs: displayedInputs,
      headers: displayedHeaders,
      data: displayedData,
    } = getDisplayedMaterials();

    // Empty state for Class 1 only mode with no Class 1 materials
    if (showClass1Only && displayedInputs.length === 0) {
      return (
        <View style={styles.matrixContainer}>
          <View style={styles.enhancedHeader}>
            <View style={styles.headerTopRow}>
              <TouchableOpacity
                onPress={() => setCurrentView("input")}
                style={styles.backButtonEnhanced}
              >
                <Feather name="arrow-left" size={20} color={colors.white} />
                <Text style={styles.backButtonTextEnhanced}>BACK</Text>
              </TouchableOpacity>
              <View style={styles.titleSection}>
                <Text style={styles.matrixTitleEnhanced}>
                  HAZMAT COMPATIBILITY MATRIX
                </Text>
                <Text style={styles.matrixSubtitle}>
                  AFMAN24-604 Compliance Check
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.matrixCloseButton}
              >
                <Feather name="x" size={20} color={colors.white} />
              </TouchableOpacity>
            </View>

            {/* Material View Toggle - Only show if there are 2+ Class 1 materials */}
            {shouldShowTabs && (
              <View style={styles.matrixViewToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    styles.toggleButtonLeft,
                    !showClass1Only && styles.toggleButtonActive,
                  ]}
                  onPress={() => setShowClass1Only(false)}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      !showClass1Only && styles.toggleButtonTextActive,
                    ]}
                  >
                    ALL MATERIALS
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    styles.toggleButtonRight,
                    showClass1Only && styles.toggleButtonActive,
                  ]}
                  onPress={() => setShowClass1Only(true)}
                >
                  <Text
                    style={[
                      styles.toggleButtonText,
                      showClass1Only && styles.toggleButtonTextActive,
                    ]}
                  >
                    CLASS 1 ONLY
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.emptyStateContainer}>
            <Feather name="alert-circle" size={48} color={colors.warning} />
            <Text style={styles.emptyStateText}>No Class 1 Materials</Text>
            <Text style={styles.emptyStateSubtext}>
              Toggle to "All Materials" to view the full compatibility matrix
            </Text>
          </View>
        </View>
      );
    }

    const stats = calculateStatistics(displayedData);
    const totalPairs =
      (displayedInputs.length * (displayedInputs.length - 1)) / 2;

    return (
      <View style={styles.matrixContainer}>
        {/* Enhanced Header with Stats */}
        <View style={styles.enhancedHeader}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity
              onPress={() => setCurrentView("input")}
              style={styles.backButtonEnhanced}
            >
              <Feather name="arrow-left" size={20} color={colors.white} />
              <Text style={styles.backButtonTextEnhanced}>BACK</Text>
            </TouchableOpacity>
            <View style={styles.titleSection}>
              <Text style={styles.matrixTitleEnhanced}>
                HAZMAT COMPATIBILITY MATRIX
              </Text>
              <Text style={styles.matrixSubtitle}>
                AFMAN24-604 Compliance Check
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.matrixCloseButton}
            >
              <Feather name="x" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>

          {/* Material View Toggle - Only show if there are 2+ Class 1 materials */}
          {shouldShowTabs && (
            <View style={styles.matrixViewToggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  styles.toggleButtonLeft,
                  !showClass1Only && styles.toggleButtonActive,
                ]}
                onPress={() => setShowClass1Only(false)}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    !showClass1Only && styles.toggleButtonTextActive,
                  ]}
                >
                  ALL MATERIALS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  styles.toggleButtonRight,
                  showClass1Only && styles.toggleButtonActive,
                ]}
                onPress={() => setShowClass1Only(true)}
              >
                <Text
                  style={[
                    styles.toggleButtonText,
                    showClass1Only && styles.toggleButtonTextActive,
                  ]}
                >
                  CLASS 1 ONLY
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Matrix and Notes Container - Horizontal Split */}
        <View style={styles.matrixAndNotesContainer}>
          {/* Matrix Grid */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={styles.matrixScrollContainer}
            contentContainerStyle={styles.matrixScrollContent}
          >
            <ScrollView
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              contentContainerStyle={styles.verticalScrollContent}
            >
              <View style={styles.enhancedMatrixTable}>
                {/* Enhanced Header Row */}
                <View style={styles.enhancedMatrixRow}>
                  <View
                    style={[styles.enhancedMatrixCell, styles.cornerCell]}
                  />
                  {displayedHeaders.map((header, index) => {
                    const material = displayedInputs[index];
                    const hazardClass =
                      material?.hazardClassDivisionNumber || "";
                    const compatGroup = material?.compatibilityGroup || "";
                    const displayText =
                      hazardClass.startsWith("1") && compatGroup
                        ? `${hazardClass}${compatGroup}`
                        : hazardClass;

                    return (
                      <View
                        key={`header-${index}`}
                        style={[
                          styles.enhancedMatrixCell,
                          styles.enhancedHeaderCell,
                        ]}
                      >
                        <Text style={styles.unNumberHeader}>UN{header}</Text>
                        <Text style={styles.hazardClassHeader}>
                          {displayText}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Enhanced Data Rows */}
                {displayedData.map((row, rowIndex) => (
                  <View
                    key={`row-${rowIndex}`}
                    style={[
                      styles.enhancedMatrixRow,
                      rowIndex % 2 === 1 && styles.alternateRow,
                    ]}
                  >
                    {/* Row Header */}
                    <View
                      style={[
                        styles.enhancedMatrixCell,
                        styles.enhancedHeaderCell,
                      ]}
                    >
                      <Text style={styles.unNumberHeader}>
                        UN{displayedHeaders[rowIndex]}
                      </Text>
                      <Text style={styles.hazardClassHeader}>
                        {(() => {
                          const material = displayedInputs[rowIndex];
                          const hazardClass =
                            material?.hazardClassDivisionNumber || "";
                          const compatGroup =
                            material?.compatibilityGroup || "";
                          return hazardClass.startsWith("1") && compatGroup
                            ? `${hazardClass}${compatGroup}`
                            : hazardClass;
                        })()}
                      </Text>
                    </View>

                    {/* Data Cells with Enhanced Styling */}
                    {row.map((cell, colIndex) => {
                      const isHovered =
                        hoveredCell?.row === rowIndex ||
                        hoveredCell?.col === colIndex;
                      const isDiagonal = rowIndex === colIndex;
                      const cellStatus = isDiagonal
                        ? "diagonal"
                        : cell === "X"
                        ? "incompatible"
                        : cell === "0"
                        ? "segregation"
                        : "compatible";

                      return (
                        <TouchableOpacity
                          key={`cell-${rowIndex}-${colIndex}`}
                          onPress={() => {
                            if (!isDiagonal && cellDetailsMatrix.length > 0) {
                              // Get the original indices if we're in Class 1 only mode
                              const originalRowIndex = showClass1Only
                                ? hazmatInputs.indexOf(displayedInputs[rowIndex])
                                : rowIndex;
                              const originalColIndex = showClass1Only
                                ? hazmatInputs.indexOf(displayedInputs[colIndex])
                                : colIndex;

                              if (
                                originalRowIndex !== -1 &&
                                originalColIndex !== -1
                              ) {
                                const details =
                                  cellDetailsMatrix[originalRowIndex][
                                    originalColIndex
                                  ];
                                setSelectedCellDetails(details);
                                setShowDetailsModal(true);
                              }
                            }
                          }}
                          onPressIn={() =>
                            setHoveredCell({ row: rowIndex, col: colIndex })
                          }
                          onPressOut={() => setHoveredCell(null)}
                          style={[
                            styles.enhancedMatrixCell,
                            styles.enhancedDataCell,
                            isDiagonal && styles.diagonalCellEnhanced,
                            !isDiagonal &&
                              cellStatus === "incompatible" &&
                              styles.incompatibleCell,
                            !isDiagonal &&
                              cellStatus === "segregation" &&
                              styles.segregationCell,
                            !isDiagonal &&
                              cellStatus === "compatible" &&
                              styles.compatibleCell,
                            isHovered && !isDiagonal && styles.hoveredCell,
                          ]}
                          disabled={isDiagonal}
                        >
                          {!isDiagonal && (
                            <View style={styles.cellContent}>
                              {cellStatus === "incompatible" ? (
                                <>
                                  <Feather
                                    name="x-circle"
                                    size={24}
                                    color="#FFFFFF"
                                  />
                                  <Text style={styles.cellStatusText}>
                                    NO LOAD
                                  </Text>
                                </>
                              ) : cellStatus === "segregation" ? (
                                <>
                                  <Text style={styles.segregationOText}>O</Text>
                                  <Text style={styles.cellStatusText}>
                                    SEGREGATE 88"
                                  </Text>
                                </>
                              ) : (
                                <>
                                  <Feather
                                    name="check-circle"
                                    size={24}
                                    color="#FFFFFF"
                                  />
                                  <Text style={styles.cellStatusText}>
                                    COMPATIBLE
                                  </Text>
                                </>
                              )}
                            </View>
                          )}
                          {isDiagonal && (
                            <View style={styles.diagonalContent}>
                              <Feather
                                name="minus"
                                size={20}
                                color="rgba(255,255,255,0.3)"
                              />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>

          {/* Notes Sidebar - Right Side */}
          {activeNotes.length > 0 && (
            <View style={styles.notesSidebar}>
              <RegulatoryNotesSection
                notes={activeNotes}
                expanded={notesExpanded}
                onToggle={() => setNotesExpanded(!notesExpanded)}
              />
            </View>
          )}
        </View>

        {/* ORIGINAL PLACEMENT - COMMENTED OUT */}
        {/* Regulatory Notes Section */}
        {/* {activeNotes.length > 0 && (
          <RegulatoryNotesSection
            notes={activeNotes}
            expanded={notesExpanded}
            onToggle={() => setNotesExpanded(!notesExpanded)}
          />
        )} */}

        {/* Simplified Legend */}
        <View style={styles.simplifiedLegend}>
          <View style={styles.legendItemEnhanced}>
            <View
              style={[styles.legendIndicator, styles.incompatibleIndicator]}
            >
              <Feather name="x-circle" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendMainText}>Incompatible</Text>
              <Text style={styles.legendSubText}>
                Cannot be loaded together
              </Text>
            </View>
          </View>

          <View style={styles.legendItemEnhanced}>
            <View style={[styles.legendIndicator, styles.segregationIndicator]}>
              <Text style={styles.legendOText}>O</Text>
            </View>
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendMainText}>Segregation Required</Text>
              <Text style={styles.legendSubText}>
                Minimum 2.2m (88in) separation
              </Text>
            </View>
          </View>

          <View style={styles.legendItemEnhanced}>
            <View style={[styles.legendIndicator, styles.compatibleIndicator]}>
              <Feather name="check-circle" size={18} color="#FFFFFF" />
            </View>
            <View style={styles.legendTextContainer}>
              <Text style={styles.legendMainText}>Compatible</Text>
              <Text style={styles.legendSubText}>Can be loaded together</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const allRowsValid = React.useMemo(
    () =>
      hazmatRows.every(row => {
        const hasBasicFields =
          row.unNumber && row.properShippingName && row.hazardClass;
        // If multiple packing groups available, user must select one
        const hasValidPackingGroup =
          row.availablePackingGroups && row.availablePackingGroups.length > 1
            ? !!row.selectedPackingGroup
            : true;
        return hasBasicFields && hasValidPackingGroup;
      }),
    [
      hazmatRows
        .map(
          row =>
            `${row.unNumber}-${row.properShippingName}-${row.hazardClass}-${
              row.selectedPackingGroup || ""
            }`
        )
        .join(","),
    ]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {currentView === "input" ? (
          <KeyboardAvoidingView
            style={styles.keyboardAvoidingView}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <View style={styles.enhancedFormHeader}>
              <View style={styles.formHeaderTop}>
                <TouchableOpacity
                  onPress={handleClose}
                  style={styles.enhancedCloseButton}
                >
                  <Feather name="x" size={20} color={colors.white} />
                </TouchableOpacity>
                <View style={styles.formTitleSection}>
                  <Text style={styles.formMainTitle}>HAZMAT ENTRY FORM</Text>
                  <Text style={styles.formSubtitle}>
                    AFMAN 24-604 Compliance Input
                  </Text>
                </View>
                <View style={styles.enhancedChapterToggle}>
                  <Text style={styles.enhancedChapterLabel}>CHAPTER 3</Text>
                  <Switch
                    value={chapter3Enabled}
                    onValueChange={setChapter3Enabled}
                    trackColor={{ false: "#4A5568", true: colors.success }}
                    thumbColor={colors.white}
                  />
                </View>
              </View>
            </View>

            <ScrollView
              style={styles.enhancedContent}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
            >
              <View style={[styles.enhancedRow, styles.headerRow]}>
                <View style={styles.inputWrapper}>
                  <View style={styles.headerCellContent}>
                    <Text style={styles.enhancedColumnHeader}>UN NUMBER</Text>
                  </View>
                </View>

                <View style={[styles.inputWrapper, styles.flexTwo]}>
                  <View style={styles.headerCellContent}>
                    <Text style={styles.enhancedColumnHeader}>
                      PROPER SHIPPING NAME
                    </Text>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.headerCellContent}>
                    <Text style={styles.enhancedColumnHeader}>
                      HAZARD CLASS
                    </Text>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <View style={styles.headerCellContent}>
                    <Text style={styles.enhancedColumnHeader}>
                      PACKING GROUP
                    </Text>
                  </View>
                </View>

                <View style={styles.headerDeleteSpace} />
              </View>

              {hazmatRows.map((row, index) => {
                const hasBasicFields =
                  row.unNumber && row.properShippingName && row.hazardClass;
                const hasValidPackingGroup =
                  row.availablePackingGroups &&
                  row.availablePackingGroups.length > 1
                    ? !!row.selectedPackingGroup
                    : true;
                const isValid = hasBasicFields && hasValidPackingGroup;
                const hasContent =
                  row.unNumber || row.properShippingName || row.hazardClass;

                const isLastRow = index === hazmatRows.length - 1;

                return (
                  <View
                    key={row.id}
                    style={[
                      styles.enhancedRow,
                      index === 0 && styles.firstRow,
                      hasContent && !isValid && styles.invalidRow,
                    ]}
                  >
                    <View style={styles.inputWrapper}>
                      <View
                        style={[
                          styles.unNumberInputContainer,
                          hasContent &&
                            !row.unNumber &&
                            styles.errorInputContainer,
                        ]}
                      >
                        <Text style={styles.unNumberPrefix}>UN</Text>
                        <TextInput
                          ref={ref => (unNumberRefs.current[index] = ref)}
                          style={[styles.enhancedInput, styles.unNumberInput]}
                          placeholder="0000"
                          value={row.unNumber.replace("UN", "")}
                          onChangeText={text => {
                            const numericText = text
                              .replace(/[^0-9]/g, "")
                              .slice(0, 4);
                            updateRow(row.id, "unNumber", `UN${numericText}`);
                          }}
                          onSubmitEditing={() => focusNextUNField(index)}
                          returnKeyType={isLastRow ? "done" : "next"}
                          placeholderTextColor="#9CA3AF"
                          keyboardType="numeric"
                          maxLength={4}
                        />
                      </View>
                    </View>

                    <View style={[styles.inputWrapper, styles.flexTwo]}>
                      {row.properShippingName && !row.editingShippingName ? (
                        <TouchableOpacity
                          style={[
                            styles.enhancedInput,
                            styles.flexTwo,
                            styles.readOnlyField,
                          ]}
                          onPress={() => {
                            setHazmatRows(
                              hazmatRows.map(r =>
                                r.id === row.id
                                  ? { ...r, editingShippingName: true }
                                  : r
                              )
                            );
                          }}
                        >
                          <Text
                            style={styles.readOnlyText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {row.properShippingName}
                          </Text>
                          <Feather
                            name="edit-3"
                            size={14}
                            color="#718096"
                            style={styles.editIcon}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TextInput
                          style={[
                            styles.enhancedInput,
                            styles.flexTwo,
                            hasContent &&
                              !row.properShippingName &&
                              styles.errorInput,
                          ]}
                          placeholder=""
                          value={row.properShippingName}
                          onChangeText={text =>
                            updateRow(row.id, "properShippingName", text)
                          }
                          onBlur={() => {
                            if (row.properShippingName) {
                              setHazmatRows(
                                hazmatRows.map(r =>
                                  r.id === row.id
                                    ? { ...r, editingShippingName: false }
                                    : r
                                )
                              );
                            }
                          }}
                          returnKeyType="done"
                          placeholderTextColor="#9CA3AF"
                          autoCapitalize="characters"
                          autoFocus={row.editingShippingName}
                        />
                      )}
                    </View>

                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={[
                          styles.enhancedInput,
                          hasContent && !row.hazardClass && styles.errorInput,
                        ]}
                        placeholder=""
                        value={row.hazardClass}
                        onChangeText={text =>
                          updateRow(row.id, "hazardClass", text)
                        }
                        returnKeyType="done"
                        placeholderTextColor="#9CA3AF"
                        autoCapitalize="characters"
                        editable={false}
                      />
                    </View>

                    <View style={styles.inputWrapper}>
                      <PackingGroupSelector
                        packingGroup={row.packingGroup}
                        availablePackingGroups={row.availablePackingGroups}
                        selectedPackingGroup={row.selectedPackingGroup}
                        onSelect={group =>
                          updateRow(row.id, "selectedPackingGroup", group)
                        }
                        hasError={
                          hasContent &&
                          row.availablePackingGroups &&
                          row.availablePackingGroups.length > 1 &&
                          !row.selectedPackingGroup
                        }
                      />
                    </View>

                    {hazmatRows.length > 1 && (
                      <TouchableOpacity
                        onPress={() => deleteRow(row.id)}
                        style={styles.enhancedDeleteButton}
                      >
                        <Feather name="x" size={18} color={colors.danger} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}

              {hazmatRows.some(row => row.showPicker) && (
                <View style={styles.pickerOverlay}>
                  <View style={styles.pickerModal}>
                    {hazmatRows
                      .filter(row => row.showPicker)
                      .map(row => (
                        <View key={`picker-${row.id}`}>
                          <Text style={styles.pickerTitle}>
                            Select material for {row.unNumber}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: "gray",
                              marginBottom: 10,
                            }}
                          >
                            Found {row.availableMaterials?.length || 0}{" "}
                            materials
                          </Text>
                          {!row.availableMaterials && (
                            <Text style={{ color: "red" }}>
                              availableMaterials is null/undefined
                            </Text>
                          )}
                          {row.availableMaterials &&
                            row.availableMaterials.length === 0 && (
                              <Text style={{ color: "red" }}>
                                availableMaterials is empty array
                              </Text>
                            )}
                          <ScrollView
                            style={styles.pickerScrollView}
                            nestedScrollEnabled
                          >
                            {row.availableMaterials?.map((material, index) => (
                              <TouchableOpacity
                                key={index}
                                style={[
                                  styles.pickerItem,
                                  material.packagingParagraph === "FORBIDDEN" &&
                                    styles.pickerItemForbidden,
                                ]}
                                onPress={() => selectMaterial(row.id, material)}
                              >
                                <Text style={styles.pickerItemTitle}>
                                  {material.properShippingName}
                                  {material.details && ` ${material.details}`}
                                </Text>
                                <Text style={styles.pickerItemSubtitle}>
                                  Class: {material.hazclassDiv || "N/A"} |
                                  Packing Group:{" "}
                                  {material.packingGroup || "N/A"}
                                  {material.subsidiaryRisk &&
                                    ` | Subsidiary Risk: ${material.subsidiaryRisk}`}
                                </Text>
                                {material.packagingParagraph ===
                                  "FORBIDDEN" && (
                                  <Text style={styles.pickerItemForbiddenText}>
                                    ⚠️ FORBIDDEN - Cannot ship by military
                                    airlift
                                  </Text>
                                )}
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                          <TouchableOpacity
                            style={styles.pickerCancelButton}
                            onPress={() => updateRow(row.id, "unNumber", "")}
                          >
                            <Text style={styles.pickerCancelText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                  </View>
                </View>
              )}
            </ScrollView>

            {showFooter && (
              <View style={styles.enhancedFormFooter}>
                <View style={styles.footerLeftButtons}>
                  <TouchableOpacity
                    style={styles.enhancedAddButton}
                    onPress={addRow}
                  >
                    <Feather name="plus" size={18} color={colors.white} />
                    <Text style={styles.enhancedAddButtonText}>
                      ADD MATERIAL
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.enhancedClearButton}
                    onPress={clearAll}
                  >
                    <Feather name="trash" size={16} color={colors.danger} />
                    <Text style={styles.enhancedClearButtonText}>
                      CLEAR ALL
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[
                    styles.enhancedRunButton,
                    isProcessing && styles.runButtonProcessing,
                    !allRowsValid && styles.runButtonIncomplete,
                  ]}
                  onPress={handleRun}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <>
                      <Feather name="play" size={20} color={colors.white} />
                      <Text style={styles.enhancedRunButtonText}>
                        RUN COMPATIBILITY CHECK
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        ) : (
          renderMatrix()
        )}
      </View>

      {/* Cell Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.detailsModalContainer}>
          <View style={styles.detailsModalHeader}>
            <Text style={styles.detailsModalTitle}>Compatibility Details</Text>
            <TouchableOpacity
              onPress={() => setShowDetailsModal(false)}
              style={styles.detailsModalCloseButton}
            >
              <Feather name="x" size={24} color={colors.white} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.detailsModalContent}>
            {selectedCellDetails && (
              <>
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>Materials</Text>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Material 1:</Text>
                    <Text style={styles.detailsValue}>
                      {selectedCellDetails.material1Unid} - Class{" "}
                      {selectedCellDetails.material1Class}
                    </Text>
                  </View>
                  <View style={styles.detailsRow}>
                    <Text style={styles.detailsLabel}>Material 2:</Text>
                    <Text style={styles.detailsValue}>
                      {selectedCellDetails.material2Unid} - Class{" "}
                      {selectedCellDetails.material2Class}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>
                    Compatibility Status
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      selectedCellDetails.status === "X" &&
                        styles.statusBadgeIncompatible,
                      selectedCellDetails.status === "0" &&
                        styles.statusBadgeSegregation,
                      selectedCellDetails.status === "✓" &&
                        styles.statusBadgeCompatible,
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>
                      {selectedCellDetails.status === "X"
                        ? "INCOMPATIBLE"
                        : selectedCellDetails.status === "0"
                        ? "SEGREGATION REQUIRED"
                        : "COMPATIBLE"}
                    </Text>
                  </View>
                  <Text style={styles.detailsMessage}>
                    {selectedCellDetails.message}
                  </Text>
                </View>

                {selectedCellDetails.noteCondition &&
                  selectedCellDetails.noteContent && (
                    <View style={styles.detailsSection}>
                      <View style={styles.noteHeader}>
                        <Feather name="info" size={20} color={colors.primary} />
                        <Text style={styles.noteTitle}>
                          {formatNoteLabel(selectedCellDetails.noteCondition)}
                        </Text>
                      </View>
                      <Text style={styles.noteDescription}>
                        {selectedCellDetails.noteContent}
                      </Text>
                      <Text style={styles.noteReference}>
                        Reference:{" "}
                        {formatNoteReference(selectedCellDetails.noteCondition)}
                      </Text>
                    </View>
                  )}

                {!selectedCellDetails.noteCondition && (
                  <View style={styles.detailsSection}>
                    <Text style={styles.noNoteText}>
                      No special note conditions apply to this material pair.
                    </Text>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  enhancedFormHeader: {
    backgroundColor: colors.headerBg,
    paddingTop: 60,
    paddingBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  formHeaderTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  enhancedCloseButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  formTitleSection: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  formMainTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.white,
    letterSpacing: 2,
    ...Platform.select({
      ios: { fontFamily: "System" },
      android: { fontFamily: "sans-serif-medium" },
    }),
  },
  formSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
    letterSpacing: 0.5,
  },
  enhancedChapterToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  enhancedChapterLabel: {
    marginRight: 10,
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 1,
  },
  formStatusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  statusItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  statusText: {
    marginLeft: 8,
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "600",
  },
  statusDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 20,
  },
  enhancedContent: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContentContainer: {
    padding: 20,
    paddingBottom: 60,
  },

  headerRow: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: "#003366",
    borderRadius: 0,
    marginBottom: 15,
    shadowOpacity: 0,
    elevation: 0,
  },
  headerCellContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  enhancedColumnHeader: {
    fontSize: 16,
    fontWeight: "800",
    color: "#003366",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  headerHint: {
    fontSize: 10,
    color: "#718096",
    fontStyle: "italic",
  },
  headerDeleteSpace: {
    width: 36,
  },
  enhancedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: colors.white,
    padding: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  firstRow: {
    borderColor: "#003366",
  },
  invalidRow: {
    borderColor: colors.warning,
    backgroundColor: "#FEF3C7",
  },
  inputWrapper: {
    flex: 1,
    marginRight: 8,
    position: "relative",
  },
  enhancedInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1A202C",
    backgroundColor: colors.white,
    fontWeight: "600",
    textAlign: "left",
    ...Platform.select({
      ios: { fontFamily: "Menlo" },
      android: { fontFamily: "monospace" },
    }),
  },
  unNumberInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CBD5E0",
    borderRadius: 8,
    backgroundColor: colors.white,
    overflow: "hidden",
  },
  unNumberPrefix: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#F7FAFC",
    borderRightWidth: 1,
    borderRightColor: "#CBD5E0",
    fontSize: 14,
    fontWeight: "700",
    color: "#2D3748",
    ...Platform.select({
      ios: { fontFamily: "Menlo" },
      android: { fontFamily: "monospace" },
    }),
  },
  unNumberInput: {
    borderWidth: 0,
    borderRadius: 0,
    flex: 1,
  },
  errorInput: {
    borderColor: colors.danger,
    backgroundColor: "#FEF2F2",
  },
  errorInputContainer: {
    borderColor: colors.danger,
    backgroundColor: "#FEF2F2",
  },
  disabledInput: {
    backgroundColor: "#F7FAFC",
    borderColor: "#E2E8F0",
    color: "#A0AEC0",
    opacity: 0.6,
  },
  enhancedDeleteButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  footerLeftButtons: {
    flexDirection: "row",
    gap: 12,
  },
  enhancedAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003366",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: "#002244",
  },
  enhancedAddButtonText: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 1,
  },
  enhancedClearButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  enhancedClearButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "700",
    color: colors.danger,
    letterSpacing: 1,
  },
  enhancedFormFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopWidth: 2,
    borderTopColor: "#003366",
    backgroundColor: colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  enhancedRunButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003366",
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: "#002244",
  },
  runButtonProcessing: {
    opacity: 0.8,
  },
  runButtonIncomplete: {
    backgroundColor: "#718096",
    borderColor: "#4A5568",
  },
  enhancedRunButtonText: {
    marginLeft: 10,
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1.5,
  },
  flexTwo: {
    flex: 2,
  },
  matrixContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  matrixAndNotesContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
  },
  notesSidebar: {
    width: 320,
    backgroundColor: colors.white,
    borderLeftWidth: 2,
    borderLeftColor: colors.headerBg,
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  matrixHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderGray,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  matrixTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
  },
  matrixTable: {
    margin: 20,
  },
  matrixRow: {
    flexDirection: "row",
  },
  matrixCell: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: colors.borderGray,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  headerCell: {
    backgroundColor: colors.background,
  },
  dataCell: {
    backgroundColor: colors.white,
  },
  diagonalCell: {
    backgroundColor: colors.background,
    opacity: 0.5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  cellText: {
    fontSize: 16,
    fontWeight: "600",
  },
  incompatibleText: {
    color: "#FF0000",
    fontWeight: "700",
  },
  segregationText: {
    color: "#0000FF",
    fontWeight: "700",
  },
  legend: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderGray,
    backgroundColor: colors.white,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  legendSymbol: {
    width: 30,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginRight: 10,
  },
  legendBox: {
    width: 30,
    height: 20,
    borderWidth: 1,
    borderColor: colors.borderGray,
    backgroundColor: colors.white,
    marginRight: 10,
  },
  emptyBox: {
    backgroundColor: colors.white,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
  },
  enhancedHeader: {
    backgroundColor: colors.headerBg,
    paddingTop: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButtonEnhanced: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 20,
  },
  backButtonTextEnhanced: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 1,
  },
  titleSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 90,
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  exportButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 1,
  },
  matrixCloseButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  matrixTitleEnhanced: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  matrixSubtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginTop: 2,
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingVertical: 15,
    paddingHorizontal: 20,
    justifyContent: "space-around",
  },
  textDanger: {
    color: "#EF4444",
  },
  textWarning: {
    color: "#FCD34D",
  },
  textSuccess: {
    color: "#86EFAC",
  },
  matrixScrollContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    minWidth: 0, // Allows flex shrinking
  },
  matrixScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  verticalScrollContent: {
    alignItems: "center",
  },
  enhancedMatrixTable: {
    marginVertical: 20,
    marginHorizontal: 0,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  enhancedMatrixRow: {
    flexDirection: "row",
  },
  alternateRow: {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  enhancedMatrixCell: {
    width: 100,
    height: 80,
    borderWidth: 1,
    borderColor: colors.borderGray,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cornerCell: {
    backgroundColor: colors.darkGray,
  },
  enhancedHeaderCell: {
    backgroundColor: "#F3F4F6",
    borderBottomWidth: 2,
    borderBottomColor: colors.darkGray,
    padding: 8,
  },
  enhancedDataCell: {
    padding: 8,
  },
  unNumberHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.darkGray,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  hazardClassHeader: {
    fontSize: 11,
    color: colors.militaryGreen,
    marginTop: 2,
    fontWeight: "600",
  },
  diagonalCellEnhanced: {
    backgroundColor: colors.darkGray,
    opacity: 0.4,
  },
  diagonalContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  incompatibleCell: {
    backgroundColor: colors.danger,
  },
  segregationCell: {
    backgroundColor: colors.warning,
  },
  compatibleCell: {
    backgroundColor: colors.success,
  },
  hoveredCell: {
    opacity: 0.8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  cellContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  cellStatusText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  segregationOText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif",
    }),
  },
  legendOText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    fontFamily: Platform.select({
      ios: "System",
      android: "sans-serif",
    }),
  },
  simplifiedLegend: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderTopWidth: 2,
    borderTopColor: colors.headerBg,
    padding: 20,
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  legendItemEnhanced: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 10,
  },
  legendIndicator: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  incompatibleIndicator: {
    backgroundColor: colors.danger,
  },
  segregationIndicator: {
    backgroundColor: colors.warning,
  },
  compatibleIndicator: {
    backgroundColor: colors.success,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendMainText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.darkGray,
  },
  legendSubText: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  pickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  pickerModal: {
    backgroundColor: colors.white,
    borderRadius: 12,
    margin: 20,
    maxHeight: "85%",
    maxWidth: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.headerBg,
    marginBottom: 15,
    textAlign: "center",
  },
  pickerScrollView: {
    maxHeight: 300,
  },
  pickerItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },
  pickerItemForbidden: {
    backgroundColor: "#FEF2F2",
    borderColor: colors.danger,
  },
  pickerItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 5,
  },
  pickerItemSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 5,
  },
  pickerItemForbiddenText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: "700",
    fontStyle: "italic",
  },
  pickerCancelButton: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    alignItems: "center",
  },
  pickerCancelText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  readOnlyField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 8,
  },
  readOnlyText: {
    flex: 1,
    fontSize: 14,
    color: "#1A202C",
    fontWeight: "600",
    marginRight: 8,
    ...Platform.select({
      ios: { fontFamily: "Menlo" },
      android: { fontFamily: "monospace" },
    }),
  },
  editIcon: {
    marginLeft: 4,
  },
  // Toggle styles
  matrixViewToggleRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 0,
  },
  toggleButtonLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderRightWidth: 0.5,
  },
  toggleButtonRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    borderLeftWidth: 0.5,
  },
  toggleButtonActive: {
    backgroundColor: colors.white,
    borderColor: colors.white,
  },
  toggleButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 1.2,
  },
  toggleButtonTextActive: {
    color: colors.headerBg,
  },
  // Empty state styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: colors.background,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.darkGray,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  // Details Modal styles
  detailsModalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  detailsModalHeader: {
    backgroundColor: colors.headerBg,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  detailsModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 1,
  },
  detailsModalCloseButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  detailsModalContent: {
    flex: 1,
    padding: 20,
  },
  detailsSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.headerBg,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  detailsRow: {
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 2,
  },
  detailsValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  statusBadge: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  statusBadgeIncompatible: {
    backgroundColor: colors.danger,
  },
  statusBadgeSegregation: {
    backgroundColor: colors.warning,
  },
  statusBadgeCompatible: {
    backgroundColor: colors.success,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 1,
  },
  detailsMessage: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  noteTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
    marginLeft: 8,
    flex: 1,
  },
  noteDescription: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  noteReference: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#6B7280",
  },
  noNoteText: {
    fontSize: 14,
    color: "#6B7280",
    fontStyle: "italic",
    textAlign: "center",
  },
  // Regulatory Notes Section styles
  regulatoryNotesContainer: {
    backgroundColor: "#FFF7ED",
    borderTopWidth: 3,
    borderTopColor: colors.warning,
    flex: 1,
  },
  regulatoryNotesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FFF7ED",
  },
  notesHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notesHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  regulatoryNotesTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.darkGray,
    letterSpacing: 1,
  },
  notesCountBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  notesCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  notesListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    flex: 1,
  },
  notesList: {
    // maxHeight: 200,  // Removed to allow full height in sidebar
    flex: 1,
  },
  notesListContent: {
    gap: 10,
  },
  noteCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  noteCardBorderIncompatible: {
    borderLeftColor: colors.danger,
  },
  noteCardBorderSegregation: {
    borderLeftColor: colors.warning,
  },
  noteCardBorderCompatible: {
    borderLeftColor: colors.success,
  },
  noteCardHeader: {
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  noteNumber: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.darkGray,
    letterSpacing: 0.5,
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    paddingRight: 0,
    marginBottom: 6,
  },
  noteStatusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flexShrink: 0,
    alignSelf: "flex-start",
  },
  noteStatusBadgeIncompatible: {
    backgroundColor: colors.danger,
  },
  noteStatusBadgeSegregation: {
    backgroundColor: colors.warning,
  },
  noteStatusBadgeCompatible: {
    backgroundColor: colors.success,
  },
  noteStatusText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
  },
  noteContentText: {
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
    marginBottom: 8,
  },
  allPairsContainer: {
    gap: 8,
  },
  materialsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  materialBadge: {
    backgroundColor: colors.headerBg,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 50,
    alignItems: "center",
  },
  materialBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  noteMaterialsPill: {
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  noteMaterialsText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.darkGray,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  // // Active Notes styles (old implementation - commented out)
  // activeNotesContainer: {
  //   backgroundColor: '#FFF7ED',
  //   borderTopWidth: 3,
  //   borderTopColor: colors.warning,
  //   paddingVertical: 15,
  //   paddingHorizontal: 20,
  //   maxHeight: 200,
  // },
  // activeNotesHeader: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 12,
  // },
  // activeNotesTitle: {
  //   fontSize: 14,
  //   fontWeight: '800',
  //   color: colors.darkGray,
  //   letterSpacing: 1,
  //   marginLeft: 10,
  // },
  // activeNotesScroll: {
  //   maxHeight: 150,
  // },
  // activeNoteItem: {
  //   backgroundColor: colors.white,
  //   borderRadius: 8,
  //   padding: 12,
  //   marginBottom: 10,
  //   borderLeftWidth: 4,
  //   borderLeftColor: colors.warning,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 1 },
  //   shadowOpacity: 0.05,
  //   shadowRadius: 2,
  //   elevation: 1,
  // },
  // activeNoteHeader: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 8,
  //   gap: 10,
  // },
  // noteStatusBadge: {
  //   paddingHorizontal: 8,
  //   paddingVertical: 4,
  //   borderRadius: 4,
  // },
  // noteStatusCompatible: {
  //   backgroundColor: colors.success,
  // },
  // noteStatusIncompatible: {
  //   backgroundColor: colors.danger,
  // },
  // noteStatusSegregation: {
  //   backgroundColor: colors.warning,
  // },
  // noteStatusText: {
  //   fontSize: 10,
  //   fontWeight: '700',
  //   color: colors.white,
  //   letterSpacing: 0.5,
  // },
  // activeNoteCondition: {
  //   fontSize: 12,
  //   fontWeight: '700',
  //   color: colors.darkGray,
  //   letterSpacing: 0.5,
  // },
  // activeNoteContent: {
  //   fontSize: 13,
  //   color: colors.text,
  //   lineHeight: 18,
  //   marginBottom: 8,
  // },
  // activeNoteMaterials: {
  //   backgroundColor: colors.background,
  //   paddingHorizontal: 10,
  //   paddingVertical: 6,
  //   borderRadius: 4,
  //   alignSelf: 'flex-start',
  // },
  // activeNoteMaterialsText: {
  //   fontSize: 11,
  //   fontWeight: '600',
  //   color: colors.darkGray,
  //   fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  // },

  // Packing Group Selector Styles
  packingGroupSelectorContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  packingGroupText: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  pillButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#F3F4F6",
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  pillButtonSelected: {
    backgroundColor: "#E6F2FF", // Light blue background
    borderWidth: 2, // Thicker border for selected state
    borderColor: "#007AFF", // Blue border
  },
  pillButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    letterSpacing: 0.5,
  },
  pillButtonTextSelected: {
    color: "#374151", // Keep same text color as unselected
  },
});

export default CompatibilitySegregationModal;
