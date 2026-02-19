# Inspector Home Search: Preparer Shipment Lookup — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** When a TCN typed into the InspectorHomeScreen search has no inspector inspection match but exists as a completed preparer shipment, show an inline card allowing the user to start that inspection directly.

**Architecture:** Extract the preparer-shipment-to-inspection-seed loading logic into a shared utility. Add debounced preparer lookup to InspectorHomeScreen triggered when filtered results are empty. Refactor SDDGUploadAndParse QR handler to use the same shared utility.

**Tech Stack:** React Native, ShipmentDatabase (expo-file-system JSON storage), InspectionFormProvider context, React Navigation

**Design doc:** `docs/plans/2026-02-19-inspector-search-preparer-lookup-design.md`

---

### Task 1: Create shared utility — `loadPreparerShipmentForInspection`

**Files:**
- Create: `src/utils/loadPreparerShipmentForInspection.ts`
- Test: `src/utils/__tests__/loadPreparerShipmentForInspection.test.ts`

**Step 1: Write the failing test**

Create `src/utils/__tests__/loadPreparerShipmentForInspection.test.ts`:

```typescript
import { loadPreparerShipmentForInspection } from "../loadPreparerShipmentForInspection";
import ShipmentDatabase from "@/services/shipment/ShipmentDatabase";

jest.mock("@/services/shipment/ShipmentDatabase", () => ({
  __esModule: true,
  default: {
    initialize: jest.fn(),
    loadShipment: jest.fn(),
  },
}));

const mockLoadShipment = ShipmentDatabase.loadShipment as jest.Mock;

describe("loadPreparerShipmentForInspection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns an InspectionSeed when shipment has valid hazProPreparerContext", async () => {
    mockLoadShipment.mockResolvedValue({
      id: "ship-1",
      metadata: { id: "ship-1", status: "completed", savedAt: "2026-01-01", tcn: "TCN001" },
      hazProPreparerContext: {
        hazardousMaterial: {
          unid: "UN3363",
          properShippingName: "Dangerous goods in apparatus",
          hazclassDiv: "9",
          subsidiaryRisk: "",
          packingGroup: "II",
          specialProvision: "P5",
          packagingParagraph: "A13.13.",
        },
        shipment: { tcn: "TCN001", poe: "DOV", pod: "RMS", inspector: "" },
        shipper: { name: "Test", address: { shipperLocation: "Test" }, phoneNumber: {} },
        consignee: { address: { consigneeDodaac: "FB5612" } },
        preparer: { preparerName: "Test User", preparerTitle: "Tester" },
      },
    });

    const result = await loadPreparerShipmentForInspection("ship-1");

    expect(result.extractedContent.unIdNo).toBe("UN3363");
    expect(result.extractedContent.properShippingName).toBe("DANGEROUS GOODS IN APPARATUS");
    expect(result.extractedContent.shippersReferenceNumber).toBe("TCN001");
    expect(result.specialAuthorization).toBeDefined();
    expect(result.authorizationDocuments).toBeDefined();
  });

  it("throws when shipment is not found", async () => {
    mockLoadShipment.mockResolvedValue(null);

    await expect(loadPreparerShipmentForInspection("nonexistent")).rejects.toThrow(
      "Shipment was found but its data is unavailable"
    );
  });

  it("throws when hazProPreparerContext is missing", async () => {
    mockLoadShipment.mockResolvedValue({
      id: "ship-2",
      metadata: { id: "ship-2", status: "completed", savedAt: "2026-01-01", tcn: "TCN002" },
      hazProPreparerContext: null,
    });

    await expect(loadPreparerShipmentForInspection("ship-2")).rejects.toThrow(
      "Shipment was found but its data is unavailable"
    );
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/utils/__tests__/loadPreparerShipmentForInspection.test.ts --no-coverage`
Expected: FAIL — module `loadPreparerShipmentForInspection` does not exist.

**Step 3: Write the implementation**

Create `src/utils/loadPreparerShipmentForInspection.ts`:

```typescript
import ShipmentDatabase from "@/services/shipment/ShipmentDatabase";
import {
  mapPreparerShipmentToInspectionSeed,
  PreparerShipmentInspectionSeed,
} from "@/utils/preparerShipmentToInspection";

/**
 * Loads a preparer shipment by ID and maps it to an InspectionSeed.
 * Pure data utility — callers are responsible for context mutations and navigation.
 */
export async function loadPreparerShipmentForInspection(
  shipmentId: string
): Promise<PreparerShipmentInspectionSeed> {
  const shipmentFile = await ShipmentDatabase.loadShipment(shipmentId);
  const preparerContext = shipmentFile?.hazProPreparerContext;

  if (!preparerContext) {
    throw new Error(
      "Shipment was found but its data is unavailable. Please try another record."
    );
  }

  return mapPreparerShipmentToInspectionSeed(preparerContext);
}
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/utils/__tests__/loadPreparerShipmentForInspection.test.ts --no-coverage`
Expected: PASS (3 tests)

**Step 5: Commit**

```bash
git add src/utils/loadPreparerShipmentForInspection.ts src/utils/__tests__/loadPreparerShipmentForInspection.test.ts
git commit -m "feat: add shared loadPreparerShipmentForInspection utility"
```

---

### Task 2: Refactor SDDGUploadAndParse QR handler to use shared utility

**Files:**
- Modify: `src/components/SDDGUploadAndParse.tsx:2413-2476` (inside `handleBarcodeScanned`)

**Step 1: Add import at top of file**

At `src/components/SDDGUploadAndParse.tsx`, after line 27 (`import { DevBenchmarkButton }...`), add:

```typescript
import { loadPreparerShipmentForInspection } from "@/utils/loadPreparerShipmentForInspection";
```

**Step 2: Replace the shipment loading logic in `handleBarcodeScanned`**

Replace lines 2413-2476 (from `const shipmentFile = await ShipmentDatabase.loadShipment(...)` through the closing of the authorization seeding block) with:

```typescript
        const seed = await loadPreparerShipmentForInspection(selectedShipment.id);

        // Start a fresh inspection session and seed SDDG + authorization data
        startNewInspection();
        await setExtractedSDDGContent(seed.extractedContent);

        if (
          seed.specialAuthorization.type &&
          seed.specialAuthorization.attested
        ) {
          setSpecialAuthorizationData({
            type: seed.specialAuthorization.type,
            referenceNumber: seed.specialAuthorization.referenceNumber,
            attested: true,
          });

          if (seed.specialAuthorization.type === "COE") {
            seed.authorizationDocuments.coeDocuments.forEach(doc => {
              addCoeCaaDocument({
                id: doc.id,
                documentType: "COE",
                uri: doc.uri,
                base64Data: doc.base64Data,
                name: doc.name,
                agency: doc.agency,
                dateAdded: doc.dateAdded,
              });
            });
          } else if (seed.specialAuthorization.type === "CAA") {
            seed.authorizationDocuments.caaDocuments.forEach(doc => {
              addCoeCaaDocument({
                id: doc.id,
                documentType: "CAA",
                uri: doc.uri,
                base64Data: doc.base64Data,
                name: doc.name,
                agency: doc.agency,
                dateAdded: doc.dateAdded,
              });
            });
          } else if (seed.specialAuthorization.type === "DOT-SP") {
            seed.authorizationDocuments.dotSpWaivers.forEach(doc => {
              addDotSpWaiver({
                id: doc.id,
                uri: doc.uri,
                base64Data: doc.base64Data,
                waiverNumber: doc.waiverNumber,
                description: doc.description,
                agency: doc.agency,
                dateAdded: doc.dateAdded,
              });
            });
          }
        } else {
          setSpecialAuthorizationData(null);
        }
```

This replaces the old `ShipmentDatabase.loadShipment` + `mapPreparerShipmentToInspectionSeed` calls with the single `loadPreparerShipmentForInspection` call. The authorization seeding stays in the caller since it depends on context actions.

**Step 3: Remove now-unused imports**

If `ShipmentDatabase` and `mapPreparerShipmentToInspectionSeed` are no longer used elsewhere in this file, remove them from the imports:

- Remove: `import ShipmentDatabase from "@/services/shipment/ShipmentDatabase";` (line 25)
- Remove: `import { mapPreparerShipmentToInspectionSeed } from "@/utils/preparerShipmentToInspection";` (line 26)

**Important:** Check if `ShipmentDatabase` is still used at line 2388 (`await ShipmentDatabase.initialize()` and `ShipmentDatabase.searchShipments`). If so, keep that import — only remove `mapPreparerShipmentToInspectionSeed`.

**Step 4: Verify the app compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No new type errors.

**Step 5: Commit**

```bash
git add src/components/SDDGUploadAndParse.tsx
git commit -m "refactor: use shared loadPreparerShipmentForInspection in QR handler"
```

---

### Task 3: Add debounced preparer lookup state and effect to InspectorHomeScreen

**Files:**
- Modify: `src/screens/inspector/InspectorHomeScreen.tsx`

**Step 1: Add imports**

At the top of `src/screens/inspector/InspectorHomeScreen.tsx`, add after line 48 (`import * as Sharing...`):

```typescript
import ShipmentDatabase, {
  ShipmentMetadata,
} from "../../services/shipment/ShipmentDatabase";
import { loadPreparerShipmentForInspection } from "../../utils/loadPreparerShipmentForInspection";
```

**Step 2: Add new state variables**

Inside `InspectorHomeScreenComponent`, after line 115 (`const [sddgImageUriCache, ...]`), add:

```typescript
  const [preparerMatch, setPreparerMatch] = useState<ShipmentMetadata | null>(null);
  const [preparerSearchState, setPreparerSearchState] = useState<
    "idle" | "searching" | "found" | "not-found"
  >("idle");
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
```

**Step 3: Add the debounced preparer lookup useEffect**

After the `useFocusEffect` block at line 391 (the BackHandler one), add:

```typescript
  // Debounced preparer shipment lookup when inspector table has no results
  useEffect(() => {
    // Reset when there are inspector results or search is empty
    if (filteredInspections.length > 0 || !searchQuery.trim()) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      setPreparerSearchState("idle");
      setPreparerMatch(null);
      return;
    }

    // Stale response guard — prevents a slower prior request from overwriting newer results
    let cancelled = false;

    // Debounce the preparer lookup
    setPreparerSearchState("searching");
    debounceTimerRef.current = setTimeout(async () => {
      try {
        await ShipmentDatabase.initialize();
        const matches = await ShipmentDatabase.searchShipments({
          tcn: searchQuery.trim(),
        });

        // Don't write state if this effect was superseded
        if (cancelled) return;

        // Exact match only (case-insensitive), completed shipments only
        const normalizedQuery = searchQuery.trim().toUpperCase();
        const exactMatch = matches.find(
          shipment =>
            shipment.tcn?.trim().toUpperCase() === normalizedQuery &&
            shipment.status === "completed"
        );

        if (exactMatch) {
          setPreparerMatch(exactMatch);
          setPreparerSearchState("found");
        } else {
          setPreparerMatch(null);
          setPreparerSearchState("not-found");
        }
      } catch (error) {
        if (cancelled) return;
        console.error("Preparer shipment lookup failed:", error);
        setPreparerMatch(null);
        setPreparerSearchState("not-found");
      }
    }, 600);

    return () => {
      cancelled = true;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [searchQuery, filteredInspections.length]);
```

**Step 4: Verify the app compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No new type errors.

**Step 5: Commit**

```bash
git add src/screens/inspector/InspectorHomeScreen.tsx
git commit -m "feat: add debounced preparer shipment lookup to InspectorHomeScreen"
```

---

### Task 4: Add "Start Inspection from Preparer" handler to InspectorHomeScreen

**Files:**
- Modify: `src/screens/inspector/InspectorHomeScreen.tsx`

**Step 1: Add the handler**

After `handlePackageStatusClick` (around line 524), add:

```typescript
  // Start inspection from a preparer shipment found via search
  const handleStartInspectionFromPreparer = useCallback(async () => {
    if (!preparerMatch) return;

    try {
      const seed = await loadPreparerShipmentForInspection(preparerMatch.id);

      startNewInspection();
      await setExtractedSDDGContent(seed.extractedContent);

      if (
        seed.specialAuthorization.type &&
        seed.specialAuthorization.attested
      ) {
        setSpecialAuthorizationData({
          type: seed.specialAuthorization.type,
          referenceNumber: seed.specialAuthorization.referenceNumber,
          attested: true,
        });

        if (seed.specialAuthorization.type === "COE") {
          seed.authorizationDocuments.coeDocuments.forEach(doc => {
            addCoeCaaDocument({
              id: doc.id,
              documentType: "COE",
              uri: doc.uri,
              base64Data: doc.base64Data,
              name: doc.name,
              agency: doc.agency,
              dateAdded: doc.dateAdded,
            });
          });
        } else if (seed.specialAuthorization.type === "CAA") {
          seed.authorizationDocuments.caaDocuments.forEach(doc => {
            addCoeCaaDocument({
              id: doc.id,
              documentType: "CAA",
              uri: doc.uri,
              base64Data: doc.base64Data,
              name: doc.name,
              agency: doc.agency,
              dateAdded: doc.dateAdded,
            });
          });
        } else if (seed.specialAuthorization.type === "DOT-SP") {
          seed.authorizationDocuments.dotSpWaivers.forEach(doc => {
            addDotSpWaiver({
              id: doc.id,
              uri: doc.uri,
              base64Data: doc.base64Data,
              waiverNumber: doc.waiverNumber,
              description: doc.description,
              agency: doc.agency,
              dateAdded: doc.dateAdded,
            });
          });
        }
      } else {
        setSpecialAuthorizationData(null);
      }

      completeSDDGSubstep("SDDGUploadAndParse");
      setCurrentSDDGStep("compliance");
      setCurrentSDDGScreen("InteractiveSDDGComplianceScreen");

      reset({
        index: 0,
        routes: [
          {
            name: "InspectorWrappedStack",
            params: { screen: "InteractiveSDDGComplianceScreen" },
          },
        ],
      });
    } catch (error) {
      console.error("Failed to start inspection from preparer shipment:", error);
      Alert.alert(
        "Error",
        "Failed to load shipment data. Please try again.",
        [{ text: "OK" }]
      );
    }
  }, [
    preparerMatch,
    startNewInspection,
    setExtractedSDDGContent,
    setSpecialAuthorizationData,
    addCoeCaaDocument,
    addDotSpWaiver,
    completeSDDGSubstep,
    setCurrentSDDGStep,
    setCurrentSDDGScreen,
    reset,
  ]);
```

**Step 2: Destructure the additional actions from `useInspectionFormActions`**

At line 85, update the destructuring to include the new actions needed:

```typescript
  const {
    loadInspectionForEdit,
    startNewInspection,
    setExtractedSDDGContent,
    setSpecialAuthorizationData,
    addCoeCaaDocument,
    addDotSpWaiver,
    completeSDDGSubstep,
    setCurrentSDDGStep,
    setCurrentSDDGScreen,
  } = useInspectionFormActions();
```

**Step 3: Verify the app compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No new type errors.

**Step 4: Commit**

```bash
git add src/screens/inspector/InspectorHomeScreen.tsx
git commit -m "feat: add handleStartInspectionFromPreparer handler"
```

---

### Task 5: Add ListFooterComponent with inline preparer search UI

**Files:**
- Modify: `src/screens/inspector/InspectorHomeScreen.tsx`

**Step 1: Create the footer component**

Inside `InspectorHomeScreenComponent`, after the `ListHeaderContent` component (around line 968), add:

```typescript
  const ListFooterContent = () => {
    // Only show when inspector table has no results and search is active
    if (filteredInspections.length > 0 || !searchQuery.trim()) {
      return null;
    }

    if (preparerSearchState === "idle") {
      return null;
    }

    if (preparerSearchState === "searching") {
      return (
        <View style={styles.preparerSearchFooter}>
          <ActivityIndicator size="small" color={colors.textSecondary} />
          <Text style={styles.preparerSearchingText}>
            Searching preparer records...
          </Text>
        </View>
      );
    }

    if (preparerSearchState === "found" && preparerMatch) {
      return (
        <View style={styles.preparerFoundCard}>
          <View style={styles.preparerFoundContent}>
            <Text style={styles.preparerFoundLabel}>Found in Preparer Records</Text>
            <Text style={styles.preparerFoundTCN}>{preparerMatch.tcn}</Text>
          </View>
          <TouchableOpacity
            style={styles.preparerStartButton}
            onPress={handleStartInspectionFromPreparer}
          >
            <Text style={styles.preparerStartButtonText}>Start Inspection</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (preparerSearchState === "not-found") {
      return (
        <View style={styles.preparerSearchFooter}>
          <Text style={styles.preparerNotFoundText}>
            No shipment found for &apos;{searchQuery.trim()}&apos;
          </Text>
        </View>
      );
    }

    return null;
  };
```

**Step 2: Wire the footer into the FlatList**

At line 992 (the `ListHeaderComponent={ListHeaderContent}` line in the FlatList), add on the next line:

```typescript
          ListFooterComponent={ListFooterContent}
```

**Step 3: Add styles**

At the bottom of the `StyleSheet.create({...})` block (before the closing `});`), add:

```typescript
  preparerSearchFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  preparerSearchingText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  preparerFoundCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.sm,
  },
  preparerFoundContent: {
    flex: 1,
  },
  preparerFoundLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  preparerFoundTCN: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  preparerStartButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.md,
  },
  preparerStartButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  preparerNotFoundText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
```

**Step 4: Verify the app compiles**

Run: `npx tsc --noEmit --pretty`
Expected: No new type errors.

**Step 5: Commit**

```bash
git add src/screens/inspector/InspectorHomeScreen.tsx
git commit -m "feat: add inline preparer search result UI to InspectorHomeScreen"
```

---

### Task 6: Manual smoke test

**Step 1: Test existing search still works**

1. Open Inspector Home Screen
2. Type a TCN that exists in the inspector inspections table
3. Verify the table filters correctly (existing behavior unchanged)

**Step 2: Test preparer match flow**

1. Clear the search input
2. Type a TCN that exists only in preparer records (from a completed preparer shipment)
3. After ~600ms, verify the inline card appears with "Found in Preparer Records" + the TCN + "Start Inspection" button
4. Tap "Start Inspection"
5. Verify navigation to `InteractiveSDDGComplianceScreen` with SDDG fields populated from preparer data

**Step 3: Test not-found flow**

1. Type a TCN that doesn't exist anywhere (e.g., "ZZZZZZZZZZZ")
2. After ~600ms, verify the muted message appears: "No shipment found for 'ZZZZZZZZZZZ'"
3. Verify the existing "Start New Inspection" button in the header still works

**Step 4: Test debounce behavior**

1. Type quickly — verify no premature results flash
2. Clear the search input — verify the inline card/message disappears immediately
3. Type a matching TCN, then quickly change to a non-matching one — verify only the final state shows

**Step 5: Commit**

No code changes in this task — smoke test only. If any fixups were needed during testing, they should have been committed in the relevant task above.
