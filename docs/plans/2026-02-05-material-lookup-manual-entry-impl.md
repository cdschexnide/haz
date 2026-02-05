# Material Lookup for SDDG Manual Entry — Implementation Plan

**Goal:** Replace the plain text modal for the UN/ID No. cell in SDDGManualEntryScreen with a material lookup modal that auto-populates hazmat fields from the hazardousMaterialsList database.

**Architecture:** A new `MaterialLookupModal` component with two internal views (typeahead search → detail table picker). It integrates into `SDDGManualEntryScreen` by intercepting the `unIdNo` field tap. A pure helper function `mapMaterialToSDDGFields` handles the data mapping between `HazardousMaterialItem` and `ExtractedSDDGContent`. See `docs/plans/2026-02-05-material-lookup-manual-entry-design.md` for full design.

**Tech Stack:** React Native, TypeScript, Jest

**Revision:** 2 — fixes dedup bug, adds Submit button (no auto-select), normalizes fields to `""`, excludes all-FORBIDDEN UNIDs, adds manual entry fallback, deterministic detail keys, adds missing tests.

---

## Task 1: Create the Material-to-SDDG Field Mapping Helper

**Files:**
- Create: `src/components/Inspector/materialLookupUtils.ts`
- Create: `src/components/Inspector/__tests__/materialLookupUtils.test.ts`

### Step 1: Write failing tests for `mapMaterialToSDDGFields`

Create `src/components/Inspector/__tests__/materialLookupUtils.test.ts`:

```typescript
import {
  mapMaterialToSDDGFields,
  filterMaterialsByUnid,
  getDeduplicatedUnids,
} from "../materialLookupUtils";
import { HazardousMaterialItem } from "../../../hazardousMaterials/hazardousMaterialsList";

describe("mapMaterialToSDDGFields", () => {
  it("maps a simple material with no subsidiary risk or details", () => {
    const material: HazardousMaterialItem = {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1088",
      properShippingName: "ACETAL",
      hazclassDiv: "3",
      subsidiaryRisk: "",
      packingGroup: "II",
      specialProvision: "P5",
      packagingParagraph: "A7.2.",
    };

    const result = mapMaterialToSDDGFields(material);

    expect(result.unIdNo).toBe("UN1088");
    expect(result.properShippingName).toBe("ACETAL");
    expect(result.hazardClass).toBe("3");
    expect(result.subsidiaryRisk).toBe("");
    expect(result.packingGroup).toBe("II");
    expect(result.packingInstruction).toBe("A7.2.");
    expect(result.authorization).toBe("P5");
  });

  it("includes subsidiary risk in hazardClass when present", () => {
    const material: HazardousMaterialItem = {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1072",
      properShippingName: "OXYGEN, COMPRESSED",
      hazclassDiv: "2.2",
      subsidiaryRisk: "5.1",
      packingGroup: "",
      specialProvision: "P5, 110",
      packagingParagraph: "A6.3., A6.5.",
    };

    const result = mapMaterialToSDDGFields(material);

    expect(result.hazardClass).toBe("2.2 (5.1)");
    expect(result.subsidiaryRisk).toBe("5.1");
    expect(result.packingInstruction).toBe("A6.3., A6.5.");
    expect(result.authorization).toBe("P5, 110");
  });

  it("appends details to properShippingName when present", () => {
    const material: HazardousMaterialItem = {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN2789",
      properShippingName: "ACETIC ACID, GLACIAL",
      details: "with more than 80% acid, by mass",
      hazclassDiv: "8",
      subsidiaryRisk: "3",
      packingGroup: "II",
      specialProvision: "P5, A3, A7, A10",
      packagingParagraph: "A12.2.",
    };

    const result = mapMaterialToSDDGFields(material);

    expect(result.properShippingName).toBe(
      "ACETIC ACID, GLACIAL, with more than 80% acid, by mass"
    );
    expect(result.hazardClass).toBe("8 (3)");
  });

  it("sets empty fields to empty string", () => {
    const material: HazardousMaterialItem = {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS, FLAMMABLE",
      hazclassDiv: "2.1",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P5",
      packagingParagraph: "A6.2.",
    };

    const result = mapMaterialToSDDGFields(material);

    expect(result.packingGroup).toBe("");
  });

  it("normalizes undefined optional fields to empty string", () => {
    // Simulate a material where optional fields could be undefined at runtime
    const material = {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN9999",
      properShippingName: "TEST MATERIAL",
      hazclassDiv: "3",
      subsidiaryRisk: undefined as unknown as string,
      packingGroup: undefined as unknown as string,
      specialProvision: undefined as unknown as string,
      packagingParagraph: "A7.2.",
    } as HazardousMaterialItem;

    const result = mapMaterialToSDDGFields(material);

    expect(result.subsidiaryRisk).toBe("");
    expect(result.packingGroup).toBe("");
    expect(result.authorization).toBe("");
    expect(result.hazardClass).toBe("3");
  });
});

describe("filterMaterialsByUnid", () => {
  const materials: HazardousMaterialItem[] = [
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS, FLAMMABLE",
      hazclassDiv: "2.1",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P5",
      packagingParagraph: "A6.2.",
    },
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS",
      details: "flammable, containing toxic gas",
      hazclassDiv: "2.3",
      subsidiaryRisk: "2.1",
      packingGroup: "",
      specialProvision: "",
      packagingParagraph: "FORBIDDEN",
    },
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS, NON-FLAMMABLE",
      hazclassDiv: "2.2",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P5",
      packagingParagraph: "A6.2.",
    },
  ];

  it("returns only non-FORBIDDEN materials for a given UNID", () => {
    const result = filterMaterialsByUnid(materials, "UN1950");

    expect(result).toHaveLength(2);
    expect(result[0].properShippingName).toBe("AEROSOLS, FLAMMABLE");
    expect(result[1].properShippingName).toBe("AEROSOLS, NON-FLAMMABLE");
  });

  it("returns empty array when no matches", () => {
    const result = filterMaterialsByUnid(materials, "UN9999");
    expect(result).toHaveLength(0);
  });
});

describe("getDeduplicatedUnids", () => {
  const materials: HazardousMaterialItem[] = [
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS, FLAMMABLE",
      hazclassDiv: "2.1",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "P5",
      packagingParagraph: "A6.2.",
    },
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1950",
      properShippingName: "AEROSOLS",
      hazclassDiv: "",
      subsidiaryRisk: "",
      packingGroup: "",
      specialProvision: "",
      packagingParagraph: "FORBIDDEN",
    },
    {
      isFixed: "false",
      isDomesticShipment: false,
      isTechnicalNameRequired: false,
      unid: "UN1088",
      properShippingName: "ACETAL",
      hazclassDiv: "3",
      subsidiaryRisk: "",
      packingGroup: "II",
      specialProvision: "P5",
      packagingParagraph: "A7.2.",
    },
  ];

  it("returns deduplicated UNIDs with first non-FORBIDDEN PSN as subtitle", () => {
    const result = getDeduplicatedUnids(materials, "UN", "19");

    expect(result).toHaveLength(1);
    expect(result[0].unid).toBe("UN1950");
    expect(result[0].subtitle).toBe("AEROSOLS, FLAMMABLE");
  });

  it("filters by prefix and digits", () => {
    const result = getDeduplicatedUnids(materials, "UN", "1088");

    expect(result).toHaveLength(1);
    expect(result[0].unid).toBe("UN1088");
    expect(result[0].subtitle).toBe("ACETAL");
  });

  it("returns empty when no digits match", () => {
    const result = getDeduplicatedUnids(materials, "UN", "9999");
    expect(result).toHaveLength(0);
  });

  it("returns empty when digits is empty", () => {
    const result = getDeduplicatedUnids(materials, "UN", "");
    expect(result).toHaveLength(0);
  });

  it("uses first non-FORBIDDEN PSN even when FORBIDDEN entries come first", () => {
    const forbiddenFirstMaterials: HazardousMaterialItem[] = [
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN7777",
        properShippingName: "THING A",
        hazclassDiv: "",
        subsidiaryRisk: "",
        packingGroup: "",
        specialProvision: "",
        packagingParagraph: "FORBIDDEN",
      },
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN7777",
        properShippingName: "THING B",
        hazclassDiv: "",
        subsidiaryRisk: "",
        packingGroup: "",
        specialProvision: "",
        packagingParagraph: "FORBIDDEN",
      },
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN7777",
        properShippingName: "THING C (VALID)",
        hazclassDiv: "3",
        subsidiaryRisk: "",
        packingGroup: "II",
        specialProvision: "P5",
        packagingParagraph: "A7.2.",
      },
    ];

    const result = getDeduplicatedUnids(forbiddenFirstMaterials, "UN", "7777");

    expect(result).toHaveLength(1);
    expect(result[0].unid).toBe("UN7777");
    expect(result[0].subtitle).toBe("THING C (VALID)");
  });

  it("excludes UNIDs where ALL entries are FORBIDDEN", () => {
    const allForbiddenMaterials: HazardousMaterialItem[] = [
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN8888",
        properShippingName: "BANNED ITEM A",
        hazclassDiv: "",
        subsidiaryRisk: "",
        packingGroup: "",
        specialProvision: "",
        packagingParagraph: "FORBIDDEN",
      },
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN8888",
        properShippingName: "BANNED ITEM B",
        hazclassDiv: "",
        subsidiaryRisk: "",
        packingGroup: "",
        specialProvision: "",
        packagingParagraph: "FORBIDDEN",
      },
      {
        isFixed: "false",
        isDomesticShipment: false,
        isTechnicalNameRequired: false,
        unid: "UN8889",
        properShippingName: "VALID ITEM",
        hazclassDiv: "3",
        subsidiaryRisk: "",
        packingGroup: "I",
        specialProvision: "P5",
        packagingParagraph: "A7.2.",
      },
    ];

    const result = getDeduplicatedUnids(allForbiddenMaterials, "UN", "888");

    // UN8888 excluded (all FORBIDDEN), UN8889 included
    expect(result).toHaveLength(1);
    expect(result[0].unid).toBe("UN8889");
  });
});
```

### Step 2: Run tests to verify they fail

Run: `npx jest src/components/Inspector/__tests__/materialLookupUtils.test.ts --no-cache`

Expected: FAIL — module `../materialLookupUtils` not found.

### Step 3: Implement the helper functions

Create `src/components/Inspector/materialLookupUtils.ts`:

```typescript
import { HazardousMaterialItem } from "../../hazardousMaterials/hazardousMaterialsList";

/**
 * Maps a HazardousMaterialItem to the ExtractedSDDGContent fields
 * used in the NATURE AND QUANTITY OF DANGEROUS GOODS table.
 *
 * All string fields are normalized to "" if undefined/falsy to ensure
 * table cells display "Tap..." for unfilled values.
 */
export function mapMaterialToSDDGFields(material: HazardousMaterialItem) {
  const psn = material.details
    ? `${material.properShippingName || ""}, ${material.details}`
    : material.properShippingName || "";

  const hazclassDiv = material.hazclassDiv || "";
  const subsidiaryRisk = material.subsidiaryRisk || "";

  const hazardClass =
    subsidiaryRisk ? `${hazclassDiv} (${subsidiaryRisk})` : hazclassDiv;

  return {
    unIdNo: material.unid || "",
    properShippingName: psn,
    hazardClass,
    subsidiaryRisk,
    packingGroup: material.packingGroup || "",
    packingInstruction: material.packagingParagraph || "",
    authorization: material.specialProvision || "",
  };
}

/**
 * Returns non-FORBIDDEN materials matching a specific UNID.
 */
export function filterMaterialsByUnid(
  materials: HazardousMaterialItem[],
  unid: string
): HazardousMaterialItem[] {
  return materials.filter(
    (m) => m.unid === unid && m.packagingParagraph !== "FORBIDDEN"
  );
}

export interface DeduplicatedUnidEntry {
  unid: string;
  subtitle: string;
}

/**
 * Returns deduplicated UNID entries matching prefix + digits,
 * with the first non-FORBIDDEN PSN as subtitle for each UNID.
 *
 * UNIDs where ALL entries are FORBIDDEN are excluded entirely.
 */
export function getDeduplicatedUnids(
  materials: HazardousMaterialItem[],
  prefix: string,
  digits: string
): DeduplicatedUnidEntry[] {
  if (!digits) return [];

  const searchTerm = prefix + digits;

  // Phase 1: Collect all matching UNIDs and find first non-FORBIDDEN PSN
  const unidMap = new Map<string, string | null>();

  for (const m of materials) {
    if (!m.unid.startsWith(searchTerm)) continue;

    const existing = unidMap.get(m.unid);

    if (existing === undefined) {
      // First time seeing this UNID
      if (m.packagingParagraph !== "FORBIDDEN") {
        unidMap.set(m.unid, m.properShippingName);
      } else {
        unidMap.set(m.unid, null); // Seen but no valid subtitle yet
      }
    } else if (existing === null && m.packagingParagraph !== "FORBIDDEN") {
      // Had only FORBIDDEN entries so far — promote this valid one
      unidMap.set(m.unid, m.properShippingName);
    }
    // If existing is already a string, we already have a valid subtitle — skip
  }

  // Phase 2: Build results, excluding all-FORBIDDEN UNIDs (subtitle === null)
  const result: DeduplicatedUnidEntry[] = [];
  for (const [unid, subtitle] of unidMap) {
    if (subtitle !== null) {
      result.push({ unid, subtitle });
    }
  }

  return result;
}
```

### Step 4: Run tests to verify they pass

Run: `npx jest src/components/Inspector/__tests__/materialLookupUtils.test.ts --no-cache`

Expected: All 11 tests PASS.

### Step 5: Commit

```bash
git add src/components/Inspector/materialLookupUtils.ts src/components/Inspector/__tests__/materialLookupUtils.test.ts
git commit -m "feat: add material-to-SDDG field mapping helpers with tests"
```

---

## Task 2: Create the MaterialLookupModal Component

**Files:**
- Create: `src/components/Inspector/MaterialLookupModal.tsx`

**Reference files to read first:**
- `src/components/Inspector/SimpleFieldEditModal.tsx` — for modal styling patterns
- `src/components/Inspector/materialLookupUtils.ts` — the helpers from Task 1
- `src/hazardousMaterials/hazardousMaterialsList.ts:1-18` — the type and array export

### Step 1: Create the MaterialLookupModal component

Create `src/components/Inspector/MaterialLookupModal.tsx`:

```tsx
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  HazardousMaterialItem,
  hazardousMaterialsList,
} from "../../hazardousMaterials/hazardousMaterialsList";
import {
  getDeduplicatedUnids,
  filterMaterialsByUnid,
  DeduplicatedUnidEntry,
} from "./materialLookupUtils";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type Prefix = "UN" | "NA" | "ID";

interface MaterialLookupModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (material: HazardousMaterialItem) => void;
  onManualEntry: () => void;
}

const MaterialLookupModal: React.FC<MaterialLookupModalProps> = ({
  visible,
  onClose,
  onSelect,
  onManualEntry,
}) => {
  const [prefix, setPrefix] = useState<Prefix>("UN");
  const [digits, setDigits] = useState("");
  const [mode, setMode] = useState<"search" | "detail">("search");
  const [selectedUnid, setSelectedUnid] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setPrefix("UN");
      setDigits("");
      setMode("search");
      setSelectedUnid(null);
      setSubmitError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [visible]);

  // Clear error when user changes input
  useEffect(() => {
    setSubmitError(null);
  }, [prefix, digits]);

  // Typeahead results — deduplicated UNIDs, excluding all-FORBIDDEN
  const typeaheadResults = useMemo(
    () => getDeduplicatedUnids(hazardousMaterialsList, prefix, digits),
    [prefix, digits]
  );

  // Detail view — non-FORBIDDEN materials for the selected UNID
  const detailMaterials = useMemo(() => {
    if (!selectedUnid) return [];
    return filterMaterialsByUnid(hazardousMaterialsList, selectedUnid);
  }, [selectedUnid]);

  // Shared resolution logic — used by both typeahead tap and Submit button
  const resolveUnid = useCallback(
    (unid: string) => {
      const nonForbidden = filterMaterialsByUnid(
        hazardousMaterialsList,
        unid
      );

      if (nonForbidden.length === 1) {
        // Single match — auto-select and close
        onSelect(nonForbidden[0]);
      } else if (nonForbidden.length > 1) {
        // Multiple matches — show detail picker
        setSelectedUnid(unid);
        setMode("detail");
      } else {
        // All FORBIDDEN or no matches
        setSubmitError(
          `All entries for ${unid} are forbidden for air transport. Use "Enter Manually" to type the value directly.`
        );
      }
    },
    [onSelect]
  );

  const handleTypeaheadSelect = useCallback(
    (entry: DeduplicatedUnidEntry) => {
      resolveUnid(entry.unid);
    },
    [resolveUnid]
  );

  const handleSubmit = useCallback(() => {
    if (digits.length === 0) return;

    const fullUnid = prefix + digits;
    resolveUnid(fullUnid);
  }, [prefix, digits, resolveUnid]);

  const handleDigitsChange = useCallback((text: string) => {
    // Only allow digits
    const cleaned = text.replace(/[^0-9]/g, "");
    setDigits(cleaned);
  }, []);

  const handleBackToSearch = useCallback(() => {
    setMode("search");
    setSelectedUnid(null);
  }, []);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleManualEntry = useCallback(() => {
    onManualEntry();
  }, [onManualEntry]);

  const renderPrefixButton = (p: Prefix) => (
    <TouchableOpacity
      key={p}
      style={[
        styles.prefixButton,
        prefix === p && styles.prefixButtonActive,
      ]}
      onPress={() => setPrefix(p)}
    >
      <Text
        style={[
          styles.prefixButtonText,
          prefix === p && styles.prefixButtonTextActive,
        ]}
      >
        {p}
      </Text>
    </TouchableOpacity>
  );

  const renderTypeaheadItem = ({
    item,
  }: {
    item: DeduplicatedUnidEntry;
  }) => (
    <TouchableOpacity
      style={styles.typeaheadItem}
      onPress={() => handleTypeaheadSelect(item)}
    >
      <Text style={styles.typeaheadUnid}>{item.unid}</Text>
      <Text style={styles.typeaheadSubtitle} numberOfLines={1}>
        {item.subtitle}
      </Text>
    </TouchableOpacity>
  );

  const getDetailPSN = (m: HazardousMaterialItem) =>
    m.details ? `${m.properShippingName}, ${m.details}` : m.properShippingName;

  const getDetailKey = (m: HazardousMaterialItem, index: number) =>
    `${m.unid}-${m.properShippingName}-${m.hazclassDiv}-${index}`;

  const renderDetailItem = ({
    item,
  }: {
    item: HazardousMaterialItem;
  }) => (
    <TouchableOpacity
      style={styles.detailRow}
      onPress={() => onSelect(item)}
    >
      <Text style={[styles.detailCell, styles.detailCellPSN]} numberOfLines={3}>
        {getDetailPSN(item)}
      </Text>
      <Text style={styles.detailCell}>{item.hazclassDiv || "—"}</Text>
      <Text style={styles.detailCell}>{item.subsidiaryRisk || "—"}</Text>
      <Text style={styles.detailCell}>{item.packingGroup || "—"}</Text>
      <Text style={styles.detailCell}>{item.specialProvision || "—"}</Text>
      <Text style={styles.detailCell}>{item.packagingParagraph}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCancel}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={styles.modalContent}
          >
            {mode === "search" ? (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.headerTitle}>Material Lookup</Text>
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <MaterialIcons name="close" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                {/* Segmented Control */}
                <View style={styles.segmentedControl}>
                  {(["UN", "NA", "ID"] as Prefix[]).map(renderPrefixButton)}
                </View>

                {/* Numeric Input */}
                <View style={styles.inputContainer}>
                  <Text style={styles.prefixLabel}>{prefix}</Text>
                  <TextInput
                    ref={inputRef}
                    style={styles.textInput}
                    value={digits}
                    onChangeText={handleDigitsChange}
                    placeholder="Enter 4-digit number..."
                    placeholderTextColor="#C7C7CC"
                    keyboardType="number-pad"
                    maxLength={4}
                    autoCorrect={false}
                  />
                </View>

                {/* Error Message */}
                {submitError && (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="warning" size={16} color="#FF3B30" />
                    <Text style={styles.errorText}>{submitError}</Text>
                  </View>
                )}

                {/* Typeahead Results */}
                {digits.length > 0 && !submitError && (
                  <View style={styles.typeaheadContainer}>
                    {typeaheadResults.length > 0 ? (
                      <FlatList
                        data={typeaheadResults}
                        keyExtractor={(item) => item.unid}
                        renderItem={renderTypeaheadItem}
                        style={styles.typeaheadList}
                        keyboardShouldPersistTaps="handled"
                      />
                    ) : (
                      <Text style={styles.noResults}>
                        No materials found for {prefix}{digits}
                      </Text>
                    )}
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.buttonRow}>
                  {/* Submit Button */}
                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      digits.length === 0 && styles.submitButtonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={digits.length === 0}
                  >
                    <MaterialIcons name="search" size={20} color="#FFFFFF" />
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>

                {/* Manual Entry Fallback */}
                <TouchableOpacity
                  style={styles.manualEntryLink}
                  onPress={handleManualEntry}
                >
                  <MaterialIcons name="edit" size={16} color="#007AFF" />
                  <Text style={styles.manualEntryLinkText}>
                    Enter Manually
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Detail View Header */}
                <View style={styles.header}>
                  <TouchableOpacity
                    onPress={handleBackToSearch}
                    style={styles.backButton}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <MaterialIcons
                      name="arrow-back"
                      size={24}
                      color="#007AFF"
                    />
                  </TouchableOpacity>
                  <View style={styles.detailHeaderText}>
                    <Text style={styles.headerTitle}>{selectedUnid}</Text>
                    <Text style={styles.detailSubheader}>
                      {detailMaterials.length} material(s) — select one
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.closeButton}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <MaterialIcons name="close" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>

                {/* Detail Table */}
                <ScrollView horizontal showsHorizontalScrollIndicator>
                  <View>
                    {/* Table Header */}
                    <View style={styles.detailTableHeader}>
                      <Text
                        style={[
                          styles.detailHeaderCell,
                          styles.detailCellPSN,
                        ]}
                      >
                        PSN / Description
                      </Text>
                      <Text style={styles.detailHeaderCell}>
                        {"Hazard\nClass/Div"}
                      </Text>
                      <Text style={styles.detailHeaderCell}>
                        {"Subsidiary\nRisk"}
                      </Text>
                      <Text style={styles.detailHeaderCell}>
                        {"Packing\nGroup"}
                      </Text>
                      <Text style={styles.detailHeaderCell}>
                        {"Special\nProvision"}
                      </Text>
                      <Text style={styles.detailHeaderCell}>
                        {"Packaging\nParagraph"}
                      </Text>
                    </View>

                    {/* Table Body */}
                    <FlatList
                      data={detailMaterials}
                      keyExtractor={(item, index) => getDetailKey(item, index)}
                      renderItem={renderDetailItem}
                      style={styles.detailList}
                      keyboardShouldPersistTaps="handled"
                    />
                  </View>
                </ScrollView>

                {/* Cancel Button */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default MaterialLookupModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "95%",
    maxWidth: 700,
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D1D1F",
  },
  closeButton: {
    padding: 4,
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  detailHeaderText: {
    flex: 1,
  },
  detailSubheader: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },

  // Segmented Control
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 2,
    marginBottom: 16,
  },
  prefixButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 6,
  },
  prefixButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  prefixButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  prefixButtonTextActive: {
    color: "#007AFF",
  },

  // Input
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
    marginBottom: 12,
  },
  prefixLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#D1D1D6",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1D1D1F",
  },

  // Error
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#FF3B30",
    lineHeight: 18,
  },

  // Typeahead
  typeaheadContainer: {
    maxHeight: 200,
    marginBottom: 12,
  },
  typeaheadList: {
    maxHeight: 200,
  },
  typeaheadItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  typeaheadUnid: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  typeaheadSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  noResults: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    paddingVertical: 16,
  },

  // Buttons
  buttonRow: {
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#B0B0B5",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  manualEntryLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  manualEntryLinkText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },

  // Detail Table
  detailTableHeader: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D1D6",
    paddingVertical: 10,
  },
  detailHeaderCell: {
    width: 100,
    fontSize: 12,
    fontWeight: "700",
    color: "#1D1D1F",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  detailList: {
    maxHeight: SCREEN_HEIGHT * 0.45,
  },
  detailRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    paddingVertical: 12,
    alignItems: "center",
  },
  detailCell: {
    width: 100,
    fontSize: 13,
    color: "#1D1D1F",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  detailCellPSN: {
    width: 180,
    textAlign: "left",
  },

  // Cancel Button
  cancelButton: {
    backgroundColor: "#F2F2F7",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
  },
});
```

### Step 2: Verify component compiles

Run: `npx tsc --noEmit src/components/Inspector/MaterialLookupModal.tsx 2>&1 | head -20`

Expected: No errors (or only project-wide pre-existing errors, not from this file).

### Step 3: Commit

```bash
git add src/components/Inspector/MaterialLookupModal.tsx
git commit -m "feat: add MaterialLookupModal with typeahead, Submit button, and detail picker"
```

---

## Task 3: Integrate MaterialLookupModal into SDDGManualEntryScreen

**Files:**
- Modify: `src/screens/inspector/SDDGManualEntryScreen.tsx`

**Reference files to read first:**
- `src/screens/inspector/SDDGManualEntryScreen.tsx:1-18` — current imports
- `src/screens/inspector/SDDGManualEntryScreen.tsx:69-110` — state and handleFieldPress
- `src/screens/inspector/SDDGManualEntryScreen.tsx:525-574` — the hazmat table rendering
- `src/screens/inspector/SDDGManualEntryScreen.tsx:698-714` — modal rendering at bottom of component

### Step 1: Add imports and state

Add these imports after the existing imports (after line 18):

```typescript
import MaterialLookupModal from "../../components/Inspector/MaterialLookupModal";
import { HazardousMaterialItem } from "../../hazardousMaterials/hazardousMaterialsList";
import { mapMaterialToSDDGFields } from "../../components/Inspector/materialLookupUtils";
```

Add this state after line 76 (the `selectedField` state block):

```typescript
const [materialLookupVisible, setMaterialLookupVisible] = useState(false);
```

### Step 2: Add the material selection handler

Add this handler after the `handleSaveField` callback (after line 130):

```typescript
// Handle material selection from lookup modal
const handleMaterialSelect = useCallback(
  (material: HazardousMaterialItem) => {
    const mapped = mapMaterialToSDDGFields(material);

    const updatedFormData = {
      ...formData,
      unIdNo: mapped.unIdNo,
      properShippingName: mapped.properShippingName,
      hazardClass: mapped.hazardClass,
      subsidiaryRisk: mapped.subsidiaryRisk,
      packingGroup: mapped.packingGroup,
      packingInstruction: mapped.packingInstruction,
      authorization: mapped.authorization,
    };

    setFormData(updatedFormData);

    // Update each field in context
    updateVerificationField("unIdNo", mapped.unIdNo);
    updateVerificationField("properShippingName", mapped.properShippingName);
    updateVerificationField("hazardClass", mapped.hazardClass);
    updateVerificationField("subsidiaryRisk", mapped.subsidiaryRisk);
    updateVerificationField("packingGroup", mapped.packingGroup);
    updateVerificationField("packingInstruction", mapped.packingInstruction);
    updateVerificationField("authorization", mapped.authorization);

    setMaterialLookupVisible(false);

    console.log(
      `🔍 [ManualEntry] Material selected: ${material.unid} - ${material.properShippingName}`
    );
  },
  [formData, updateVerificationField]
);

// Handle manual entry fallback from lookup modal
const handleMaterialLookupManualEntry = useCallback(() => {
  setMaterialLookupVisible(false);

  // Open the standard SimpleFieldEditModal for the unIdNo field
  setSelectedField({
    key: "unIdNo" as keyof ExtractedSDDGContent,
    label: "UN or ID NO. (Key 11)",
    multiline: false,
  });
  setModalVisible(true);
}, []);
```

### Step 3: Modify handleFieldPress to intercept the unIdNo tap

Replace the `handleFieldPress` callback (lines 90-110) with:

```typescript
// Handle field press - open appropriate modal
const handleFieldPress = useCallback(
  (fieldKey: string, fieldLabel: string, fieldValue: string) => {
    Vibration.vibrate(10);

    // Special case: UN/ID No. opens the material lookup modal
    if (fieldKey === "unIdNo") {
      setMaterialLookupVisible(true);
      return;
    }

    // All other fields use the simple text input modal
    const multilineFields = [
      "shipper",
      "consignee",
      "additionalHandlingInfo",
    ];
    const isMultiline = multilineFields.includes(fieldKey);

    setSelectedField({
      key: fieldKey as keyof ExtractedSDDGContent,
      label: fieldLabel,
      multiline: isMultiline,
    });
    setModalVisible(true);
  },
  []
);
```

### Step 4: Add MaterialLookupModal to the render tree

After the existing `SimpleFieldEditModal` block (after line 713, before the closing `</SafeAreaView>`), add:

```tsx
{/* Material Lookup Modal */}
<MaterialLookupModal
  visible={materialLookupVisible}
  onClose={() => setMaterialLookupVisible(false)}
  onSelect={handleMaterialSelect}
  onManualEntry={handleMaterialLookupManualEntry}
/>
```

### Step 5: Verify the app compiles

Run: `npx tsc --noEmit src/screens/inspector/SDDGManualEntryScreen.tsx 2>&1 | head -20`

Expected: No new errors.

### Step 6: Commit

```bash
git add src/screens/inspector/SDDGManualEntryScreen.tsx
git commit -m "feat: integrate MaterialLookupModal into SDDGManualEntryScreen

Tapping the UN/ID No. cell opens a material lookup modal with prefix
toggle, typeahead search, and Submit button. Selecting a material
auto-populates PSN, hazard class, subsidiary risk, packing group,
packing instruction, and authorization. Includes 'Enter Manually'
fallback to type the UN number directly."
```

---

## Task 4: Manual Smoke Test Checklist

This is a manual verification task. Run the app in the simulator and verify:

1. **Navigate:** Inspector Home → Start New Inspection → SDDG Upload → Manual Entry
2. **Tap the "UN or ID No." cell** → MaterialLookupModal opens (not SimpleFieldEditModal)
3. **Segmented control:** Defaults to "UN". Tapping "NA" or "ID" changes the prefix label in the input
4. **Type "1088"** → Typeahead shows "UN1088 / ACETAL". Submit button is enabled
5. **Press Submit** → Single match: auto-populates and closes
6. **Verify fields populated:** PSN = "ACETAL", Class = "3", Packing Group = "II", Packing Inst. = "A7.2.", Authorization = "P5"
7. **Re-tap UN/ID cell** → Modal resets. Type "1950" → Typeahead shows "UN1950 / AEROSOLS, FLAMMABLE"
8. **Press Submit** → Detail table appears with multiple materials (FORBIDDEN ones excluded)
9. **Tap "AEROSOLS, NON-FLAMMABLE"** → Fields update, modal closes
10. **Re-tap UN/ID cell** → Type "1072", press Submit → Single match. Verify Class = "2.2 (5.1)"
11. **Prefix toggle test:** Type "1088", toggle to "NA", press Submit → Should show no matches or error
12. **All-FORBIDDEN test:** Find a UNID where all entries are FORBIDDEN. Type it, press Submit → Error message appears with "forbidden for air transport" text
13. **"Enter Manually" test:** Tap "Enter Manually" → SimpleFieldEditModal opens for "UN or ID NO. (Key 11)"
14. **Tap any other cell** (e.g., Quantity) → SimpleFieldEditModal still works normally
15. **Press "Continue to SDDG Inspection"** → Navigates to InteractiveSDDGComplianceScreen with all populated data visible
