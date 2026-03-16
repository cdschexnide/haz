# Package Opening for Inspection — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a guided package opening/closing workflow at the end of Attachment 28 that captures whether the package was opened, walks through AFMAN A28.2.2 procedures, and wires the result to the Form 1015 "OPENED FOR INSPECTION" checkbox.

**Architecture:** Three new screens form a mini-wizard after Attachment 28 completes (first-pass only, skipped on reinspection). A new `PackageOpeningData` type persists on `SDDGInspectionContext`. The existing `innerPackagingProcedures.ts` provides AFMAN procedure text. The Form 1015 checkbox (live view, viewer component, and PDF) reads from the new field. The GraphQL schema and Yjs generated types must also be updated to keep the sync model consistent.

**Tech Stack:** React Native, React Navigation stack navigator, TypeScript, existing InspectionFormProvider context pattern.

---

### Task 1: Create the PackageOpeningData type

**Files:**
- Create: `src/types/packageOpening.ts`

**Step 1: Write the type file**

```typescript
// src/types/packageOpening.ts
import type { ContainerType } from './innerPackaging';

export type FiberboardClosureMethod =
  | 'tape-only'
  | 'adhesive-or-stapled'
  | null;

export interface PackageOpeningData {
  wasOpened: boolean | null;
  containerType: ContainerType;
  fiberboardClosureMethod: FiberboardClosureMethod;
  newCertificationRequired: boolean;
  openedAt: Date | null;
  closedAt: Date | null;
  inspectorNotes: string;
}

export const createInitialPackageOpeningData = (): PackageOpeningData => ({
  wasOpened: null,
  containerType: null,
  fiberboardClosureMethod: null,
  newCertificationRequired: false,
  openedAt: null,
  closedAt: null,
  inspectorNotes: '',
});
```

**Step 2: Commit**

```bash
git add src/types/packageOpening.ts
git commit -m "feat: add PackageOpeningData type for package opening inspection"
```

---

### Task 2: Add packageOpeningInspection to SDDGInspectionContext

**Files:**
- Modify: `src/types/sddg.ts:1-2` (imports) and `src/types/sddg.ts:161-193` (SDDGInspectionContext)
- Modify: `src/contexts/InspectionFormProvider/types.ts:90-125` (initialInspectionContext)

**Step 1: Add import to sddg.ts**

At `src/types/sddg.ts:2`, after the `InnerPackagingInspectionData` import, add:

```typescript
import { PackageOpeningData } from "./packageOpening";
```

**Step 2: Add field to SDDGInspectionContext**

At `src/types/sddg.ts:170`, after `innerPackagingInspection`, add:

```typescript
  packageOpeningInspection: PackageOpeningData | null;
```

**Step 3: Add to initialInspectionContext**

At `src/contexts/InspectionFormProvider/types.ts:99`, after `innerPackagingInspection: null,` add:

```typescript
  packageOpeningInspection: null,
```

**Step 4: Commit**

```bash
git add src/types/sddg.ts src/contexts/InspectionFormProvider/types.ts
git commit -m "feat: add packageOpeningInspection field to inspection context"
```

---

### Task 3: Update GraphQL schema and Yjs generated types

The `SDDGInspectionContext` is mirrored in the GraphQL schema (`src/graphql/schema.graphql`) and Yjs generated types (`src/utils/yjs/__generated__/types/`). Both must be updated to keep the sync model consistent.

**Files:**
- Modify: `src/graphql/schema.graphql`
- Create: `src/utils/yjs/__generated__/types/YDocPackageOpeningData.ts`
- Modify: `src/utils/yjs/__generated__/types/YDocSDDGInspectionContext.ts`

**Step 1: Add PackageOpeningData type to GraphQL schema**

Follow the exact pattern used by `InnerPackagingInspectionData` (schema.graphql:2493-2549). After the `InnerPackagingInspectionData` block and its Record types, add:

```graphql
"""
Fiberboard closure method for package reclosure
"""
enum FiberboardClosureMethod {
  TAPE_ONLY
  ADHESIVE_OR_STAPLED
}

"""
Package opening inspection data (AFMAN 24-604 A28.2.2)
"""
type PackageOpeningData @tag(name: "sync") {
  uuid: ID!
  """
  Whether the package was opened for inspection
  """
  wasOpenedRecord: BooleanHazProPackageOpeningDataRecord

  """
  Type of outer container opened
  """
  containerTypeRecord: ContainerTypeHazProPackageOpeningDataRecord

  """
  Fiberboard closure method (only for fiberboard boxes)
  """
  fiberboardClosureMethodRecord: FiberboardClosureMethodHazProPackageOpeningDataRecord

  """
  Whether new shipper certification is required
  """
  newCertificationRequiredRecord: BooleanHazProPackageOpeningDataRecord!

  """
  Timestamp when container was opened
  """
  openedAtRecord: DateHazProPackageOpeningDataRecord

  """
  Timestamp when container was closed
  """
  closedAtRecord: DateHazProPackageOpeningDataRecord

  """
  Inspector notes about opening/closing
  """
  inspectorNotesRecord: StringHazProPackageOpeningDataRecord!

  """
  Lifecycle events
  """
  lifeCycleEvents: [LifeCyclePackageOpeningDataEvent!]!
}

type LifeCyclePackageOpeningDataEvent {
  uuid: ID!
  packageOpeningData: PackageOpeningData!
  type: LifeCyclePackageOpeningDataEventType!
  value: Date
  createdAt: Date!
}

enum LifeCyclePackageOpeningDataEventType {
  CREATION
  ARCHIVAL
}
```

Then add the Record types for `PackageOpeningData` following the same pattern as `InnerPackagingInspectionData` Records (schema.graphql:2554-2808):
- `BooleanHazProPackageOpeningDataRecord` and `BooleanHazProPackageOpeningDataRecordEvent`
- `ContainerTypeHazProPackageOpeningDataRecord` and `ContainerTypeHazProPackageOpeningDataRecordEvent`
- `FiberboardClosureMethodHazProPackageOpeningDataRecord` and `FiberboardClosureMethodHazProPackageOpeningDataRecordEvent`
- `DateHazProPackageOpeningDataRecord` and `DateHazProPackageOpeningDataRecordEvent`
- `StringHazProPackageOpeningDataRecord` and `StringHazProPackageOpeningDataRecordEvent`

**Step 2: Add field to SDDGInspectionContext in schema**

At `schema.graphql:2958`, after `innerPackagingInspection: InnerPackagingInspectionData`, add:

```graphql
  """
  Package opening inspection data (A28.2.2)
  """
  packageOpeningInspection: PackageOpeningData
```

**Step 3: Add PackageOpeningDataInput**

After `InnerPackagingInspectionDataInput`, add:

```graphql
"""
Input for creating/updating package opening inspection data
"""
input PackageOpeningDataInput {
  wasOpened: Boolean
  containerType: ContainerType
  fiberboardClosureMethod: FiberboardClosureMethod
  newCertificationRequired: Boolean
  openedAt: Date
  closedAt: Date
  inspectorNotes: String
}
```

**Step 4: Add to SDDGInspectionContextInput**

At `schema.graphql:3257`, after `innerPackagingInspection: InnerPackagingInspectionDataInput`, add:

```graphql
  """
  Package opening inspection data (A28.2.2)
  """
  packageOpeningInspection: PackageOpeningDataInput
```

**Step 5: Create Yjs generated type**

Create `src/utils/yjs/__generated__/types/YDocPackageOpeningData.ts` following the pattern of `YDocInnerPackagingInspectionData.ts`:

```typescript
import { Reference } from "./Reference";
import { YDocBooleanHazProPackageOpeningDataRecord } from "./YDocBooleanHazProPackageOpeningDataRecord";
import { YDocContainerTypeHazProPackageOpeningDataRecord } from "./YDocContainerTypeHazProPackageOpeningDataRecord";
import { YDocFiberboardClosureMethodHazProPackageOpeningDataRecord } from "./YDocFiberboardClosureMethodHazProPackageOpeningDataRecord";
import { YDocDateHazProPackageOpeningDataRecord } from "./YDocDateHazProPackageOpeningDataRecord";
import { YDocStringHazProPackageOpeningDataRecord } from "./YDocStringHazProPackageOpeningDataRecord";

export interface YDocLifeCyclePackageOpeningDataEvent {
    uuid: string;
    packageOpeningData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocPackageOpeningData {
    uuid: string;
    wasOpenedRecord?: YDocBooleanHazProPackageOpeningDataRecord;
    containerTypeRecord?: YDocContainerTypeHazProPackageOpeningDataRecord;
    fiberboardClosureMethodRecord?: YDocFiberboardClosureMethodHazProPackageOpeningDataRecord;
    newCertificationRequiredRecord: YDocBooleanHazProPackageOpeningDataRecord;
    openedAtRecord?: YDocDateHazProPackageOpeningDataRecord;
    closedAtRecord?: YDocDateHazProPackageOpeningDataRecord;
    inspectorNotesRecord: YDocStringHazProPackageOpeningDataRecord;
    lifeCycleEvents: YDocLifeCyclePackageOpeningDataEvent[];
    path: string;
    __typename: string;
}
```

Also create the individual Record type files following the existing patterns, and create the corresponding RecordEvent files.

**Step 6: Update YDocSDDGInspectionContext**

At `src/utils/yjs/__generated__/types/YDocSDDGInspectionContext.ts:24`, after `innerPackagingInspection__REF`, add:

```typescript
    packageOpeningInspection__REF?: Reference<string>;
```

**Step 7: Commit**

```bash
git add src/graphql/schema.graphql src/utils/yjs/__generated__/types/
git commit -m "feat: add PackageOpeningData to GraphQL schema and Yjs types"
```

---

### Task 4: Add provider methods for package opening

**Files:**
- Modify: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`

**Step 1: Add import**

At the top imports (after the `InnerPackagingInspectionData` import on line 24), add:

```typescript
import { PackageOpeningData } from "@/types/packageOpening";
```

**Step 2: Add to context interface**

After `clearInnerPackagingInspection` (line 128), add:

```typescript
  // Package opening inspection (A28.2.2)
  setPackageOpeningInspection: (data: PackageOpeningData | null) => void;
  clearPackageOpeningInspection: () => void;
```

**Step 3: Add implementation callbacks**

After `clearInnerPackagingInspection` implementation (around line 1376), add:

```typescript
  const setPackageOpeningInspection = useCallback(
    (data: PackageOpeningData | null) => {
      setInspection(prev => ({
        ...prev,
        packageOpeningInspection: data,
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const clearPackageOpeningInspection = useCallback(() => {
    setInspection(prev => ({
      ...prev,
      packageOpeningInspection: null,
    }));
    setHasUnsavedChanges(true);
  }, []);
```

**Step 4: Add to context value object and useMemo deps**

In the context value object (around line 1826-1830), after `clearInnerPackagingInspection`, add:

```typescript
      setPackageOpeningInspection,
      clearPackageOpeningInspection,
```

Also add both to the useMemo dependency array (around line 1887-1890).

**Step 5: Add to useInspectionForm return**

In the `useInspectionForm` hook return (around line 1985-1988), after `clearInnerPackagingInspection`, add:

```typescript
    setPackageOpeningInspection: context.setPackageOpeningInspection,
    clearPackageOpeningInspection: context.clearPackageOpeningInspection,
```

**Step 6: Commit**

```bash
git add src/contexts/InspectionFormProvider/InspectionFormProvider.tsx
git commit -m "feat: add provider methods for package opening inspection"
```

---

### Task 5: Add date rehydration for package opening in BOTH persistence backends

**Files:**
- Modify: `src/contexts/DataProvider/DataProvider.tsx:211-237` (date rehydration block)
- Modify: `src/services/inspection/InspectorShipmentDatabase.ts:60-81` (date rehydration block)

**Step 1: Add rehydration to DataProvider**

After the `packageFrustrations` rehydration block (around line 237 in DataProvider.tsx), add:

```typescript
    if (context.packageOpeningInspection) {
      if (context.packageOpeningInspection.openedAt) {
        context.packageOpeningInspection.openedAt = new Date(context.packageOpeningInspection.openedAt);
      }
      if (context.packageOpeningInspection.closedAt) {
        context.packageOpeningInspection.closedAt = new Date(context.packageOpeningInspection.closedAt);
      }
    }
```

**Step 2: Add rehydration to InspectorShipmentDatabase**

After the `packageFrustrations` rehydration block (around line 81 in InspectorShipmentDatabase.ts), add the same rehydration:

```typescript
      if (inspection.inspectionContext.packageOpeningInspection) {
        if (inspection.inspectionContext.packageOpeningInspection.openedAt) {
          inspection.inspectionContext.packageOpeningInspection.openedAt = new Date(
            inspection.inspectionContext.packageOpeningInspection.openedAt
          );
        }
        if (inspection.inspectionContext.packageOpeningInspection.closedAt) {
          inspection.inspectionContext.packageOpeningInspection.closedAt = new Date(
            inspection.inspectionContext.packageOpeningInspection.closedAt
          );
        }
      }
```

**Step 3: Commit**

```bash
git add src/contexts/DataProvider/DataProvider.tsx src/services/inspection/InspectorShipmentDatabase.ts
git commit -m "feat: add date rehydration for package opening in both persistence backends"
```

---

### Task 6: Create InspectorPackageOpeningScreen

This is the "Was the package opened?" YES/NO screen with A28.2.4 exception warnings.

**Files:**
- Create: `src/screens/inspector/InspectorPackageOpeningScreen.tsx`

**Step 1: Write the screen**

```typescript
// src/screens/inspector/InspectorPackageOpeningScreen.tsx
import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { createInitialPackageOpeningData } from "../../types/packageOpening";

interface Props {
  navigation: any;
  route?: {
    params?: {
      continueRoute?: string;
      continueParams?: any;
    };
  };
}

// A28.2.4 exception materials — require specialized training
const RESTRICTED_UN_NUMBERS = ["UN2814", "UN2900", "UN3245"];

/**
 * Checks A28.2.4 exceptions to inspection.
 * Uses hazard class, UN number, Key 19 additional handling info, and packing instruction
 * to determine if specialized training is required.
 */
const isRestrictedMaterial = (
  hazardClass: string | undefined,
  unId: string | undefined,
  additionalHandlingInfo: string | undefined,
  packingInstruction: string | undefined,
): { restricted: boolean; reason: string } => {
  const hc = (hazardClass || "").trim();
  const un = (unId || "").trim().toUpperCase();
  const ahi = (additionalHandlingInfo || "").toUpperCase();
  const pi = (packingInstruction || "").trim().toUpperCase();

  // A28.2.4.1 — Radioactive material (Class 7)
  if (hc.startsWith("7")) {
    return { restricted: true, reason: "Radioactive material (A28.2.4.1)" };
  }
  // A28.2.4.2 — Class 1 ammunition and explosives
  if (hc.startsWith("1")) {
    return { restricted: true, reason: "Class 1 ammunition and explosives (A28.2.4.2)" };
  }
  // A28.2.4.3 — Etiological agents or infectious substances
  if (RESTRICTED_UN_NUMBERS.includes(un)) {
    return { restricted: true, reason: "Etiological agents or infectious substances (A28.2.4.3)" };
  }
  // A28.2.4.4 — Pressurized metal shipping containers or drums
  // Detected via A6 packing instruction (compressed gas cylinders/drums)
  if (pi.startsWith("A6")) {
    return { restricted: true, reason: "Pressurized metal shipping containers or drums (A28.2.4.4)" };
  }
  // A28.2.4.5 — Material identified as "inhalation hazard"
  // Check Key 19 additional handling info for explicit inhalation hazard text
  if (
    ahi.includes("INHALATION HAZARD") ||
    ahi.includes("POISON INHALATION HAZARD")
  ) {
    return { restricted: true, reason: 'Material identified as "inhalation hazard" (A28.2.4.5)' };
  }
  return { restricted: false, reason: "" };
};

export default function InspectorPackageOpeningScreen({ navigation, route }: Props) {
  const { inspection, setPackageOpeningInspection } = useInspectionForm();

  const continueRoute = route?.params?.continueRoute || "InspectorSpecialProvisionsScreen";
  const continueParams = route?.params?.continueParams;

  const verificationCopy = inspection?.verificationCopy || inspection?.extractedContent;
  const hazardClass = verificationCopy?.hazardClass;
  const unId = verificationCopy?.unIdNo;
  const additionalHandlingInfo = verificationCopy?.additionalHandlingInfo;
  const packingInstruction = verificationCopy?.packingInstruction;

  const restriction = useMemo(
    () => isRestrictedMaterial(hazardClass, unId, additionalHandlingInfo, packingInstruction),
    [hazardClass, unId, additionalHandlingInfo, packingInstruction]
  );

  const handleNo = useCallback(() => {
    setPackageOpeningInspection({
      ...createInitialPackageOpeningData(),
      wasOpened: false,
    });
    navigation.navigate(continueRoute, continueParams);
  }, [navigation, continueRoute, continueParams, setPackageOpeningInspection]);

  const proceedToOpeningProcedures = useCallback(() => {
    const data = createInitialPackageOpeningData();
    data.wasOpened = true;
    setPackageOpeningInspection(data);
    navigation.navigate("InspectorPackageOpeningProceduresScreen", {
      continueRoute,
      continueParams,
    });
  }, [navigation, continueRoute, continueParams, setPackageOpeningInspection]);

  const handleYes = useCallback(() => {
    if (restriction.restricted) {
      Alert.alert(
        "Specialized Training Required",
        `AFMAN 24-604 A28.2.4 requires specialized training to open this packaging:\n\n${restriction.reason}\n\nOnly individuals trained and qualified in these specialized areas are authorized to open this packaging.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "I Am Qualified",
            onPress: proceedToOpeningProcedures,
          },
        ]
      );
      return;
    }
    proceedToOpeningProcedures();
  }, [restriction, proceedToOpeningProcedures]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Package Opening</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <MaterialIcons name="inventory-2" size={48} color="#007AFF" />
          <Text style={styles.questionText}>
            Was the package opened for inspection?
          </Text>
          <Text style={styles.referenceText}>
            AFMAN 24-604, A28.2.2
          </Text>

          {restriction.restricted && (
            <View style={styles.warningBanner}>
              <MaterialIcons name="warning" size={20} color="#FF9500" />
              <Text style={styles.warningText}>
                This material requires specialized training to open: {restriction.reason}
              </Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.yesButton} onPress={handleYes}>
              <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
              <Text style={styles.yesButtonText}>YES</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.noButton} onPress={handleNo}>
              <MaterialIcons name="cancel" size={24} color="#FFFFFF" />
              <Text style={styles.noButtonText}>NO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    color: "#1D1D1F",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  questionText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1D1D1F",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  referenceText: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 24,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FF9500",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    gap: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: "#1D1D1F",
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  yesButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  yesButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  noButton: {
    flex: 1,
    backgroundColor: "#8E8E93",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  noButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
```

**Step 2: Commit**

```bash
git add src/screens/inspector/InspectorPackageOpeningScreen.tsx
git commit -m "feat: add InspectorPackageOpeningScreen (was package opened? YES/NO)"
```

---

### Task 7: Create InspectorPackageOpeningProceduresScreen

Container type selection + opening procedures display.

**Files:**
- Create: `src/screens/inspector/InspectorPackageOpeningProceduresScreen.tsx`

**Step 1: Write the screen**

```typescript
// src/screens/inspector/InspectorPackageOpeningProceduresScreen.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { ContainerType } from "../../types/innerPackaging";
import { OPENING_PROCEDURES, ProcedureStep } from "../../utils/innerPackagingProcedures";

interface Props {
  navigation: any;
  route?: {
    params?: {
      continueRoute?: string;
      continueParams?: any;
    };
  };
}

const CONTAINER_TYPE_OPTIONS: { value: Exclude<ContainerType, null>; label: string; icon: string }[] = [
  { value: "fiberboard-box", label: "Fiberboard Box", icon: "inventory-2" },
  { value: "wood-box", label: "Wood Box", icon: "carpenter" },
  { value: "drum", label: "Drum", icon: "oil-barrel" },
  { value: "overpack", label: "Overpack", icon: "layers" },
  { value: "jerrican", label: "Jerrican", icon: "local-gas-station" },
  { value: "non-specification", label: "Non-Specification", icon: "all-inbox" },
];

export default function InspectorPackageOpeningProceduresScreen({ navigation, route }: Props) {
  const { inspection, setPackageOpeningInspection } = useInspectionForm();
  const [selectedType, setSelectedType] = useState<Exclude<ContainerType, null> | null>(null);

  const continueRoute = route?.params?.continueRoute || "InspectorSpecialProvisionsScreen";
  const continueParams = route?.params?.continueParams;

  const procedures: ProcedureStep[] = selectedType ? OPENING_PROCEDURES[selectedType] : [];

  const handleContinue = useCallback(() => {
    if (!selectedType || !inspection?.packageOpeningInspection) return;
    setPackageOpeningInspection({
      ...inspection.packageOpeningInspection,
      containerType: selectedType,
      openedAt: new Date(),
    });
    navigation.navigate("InspectorPackageClosingProceduresScreen", {
      continueRoute,
      continueParams,
    });
  }, [selectedType, inspection?.packageOpeningInspection, setPackageOpeningInspection, navigation, continueRoute, continueParams]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Opening Procedures</Text>
        <Text style={styles.stepIndicator}>1/2</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {/* Container Type Selection */}
        <Text style={styles.sectionTitle}>Select Container Type</Text>
        <View style={styles.typeGrid}>
          {CONTAINER_TYPE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.typeCard,
                selectedType === option.value && styles.typeCardSelected,
              ]}
              onPress={() => setSelectedType(option.value)}
            >
              <MaterialIcons
                name={option.icon as any}
                size={28}
                color={selectedType === option.value ? "#007AFF" : "#8E8E93"}
              />
              <Text
                style={[
                  styles.typeLabel,
                  selectedType === option.value && styles.typeLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Opening Procedures */}
        {selectedType && (
          <>
            <Text style={styles.sectionTitle}>Opening Procedures</Text>
            <View style={styles.procedureCard}>
              {procedures.map((step) => (
                <View
                  key={step.id}
                  style={[
                    styles.procedureStep,
                    step.isWarning && styles.procedureWarning,
                  ]}
                >
                  <MaterialIcons
                    name={step.isWarning ? "warning" : "check-circle-outline"}
                    size={20}
                    color={step.isWarning ? "#FF9500" : "#34C759"}
                  />
                  <View style={styles.procedureTextContainer}>
                    <Text style={styles.procedureText}>{step.instruction}</Text>
                    <Text style={styles.procedureRef}>{step.afmanRef}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Inner Package Inspection Reminder (A28.2.3) */}
            <Text style={styles.sectionTitle}>Inner Package Inspection</Text>
            <View style={styles.procedureCard}>
              <View style={styles.procedureStep}>
                <MaterialIcons name="visibility" size={20} color="#007AFF" />
                <View style={styles.procedureTextContainer}>
                  <Text style={styles.procedureText}>
                    Perform visual inspection only. Do not rearrange inner packaging contents or configuration.
                  </Text>
                  <Text style={styles.procedureRef}>A28.2.3.1</Text>
                </View>
              </View>
              <View style={[styles.procedureStep, styles.procedureWarning]}>
                <MaterialIcons name="warning" size={20} color="#FF9500" />
                <View style={styles.procedureTextContainer}>
                  <Text style={styles.procedureText}>
                    Do not cut wraps or barrier material.
                  </Text>
                  <Text style={styles.procedureRef}>A28.2.3.2</Text>
                </View>
              </View>
              <View style={[styles.procedureStep, styles.procedureWarning]}>
                <MaterialIcons name="warning" size={20} color="#FF9500" />
                <View style={styles.procedureTextContainer}>
                  <Text style={styles.procedureText}>
                    Any change to the inner configuration is considered repacking and requires a new shipper's certification.
                  </Text>
                  <Text style={styles.procedureRef}>A28.2.3.3</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Footer */}
      {selectedType && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue to Closing Procedures</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    color: "#1D1D1F",
  },
  stepIndicator: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  content: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 12,
    marginTop: 8,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  typeCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E5EA",
    gap: 8,
  },
  typeCardSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8E8E93",
    textAlign: "center",
  },
  typeLabelSelected: {
    color: "#007AFF",
  },
  procedureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  procedureStep: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  procedureWarning: {
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: -4,
  },
  procedureTextContainer: { flex: 1 },
  procedureText: {
    fontSize: 15,
    color: "#1D1D1F",
    lineHeight: 22,
  },
  procedureRef: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    padding: 16,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
});
```

**Step 2: Commit**

```bash
git add src/screens/inspector/InspectorPackageOpeningProceduresScreen.tsx
git commit -m "feat: add InspectorPackageOpeningProceduresScreen (container type + opening procedures)"
```

---

### Task 8: Create InspectorPackageClosingProceduresScreen

Closing procedures + fiberboard closure method + certification determination.

**Files:**
- Create: `src/screens/inspector/InspectorPackageClosingProceduresScreen.tsx`

**Step 1: Write the screen**

```typescript
// src/screens/inspector/InspectorPackageClosingProceduresScreen.tsx
import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import type { ContainerType } from "../../types/innerPackaging";
import type { FiberboardClosureMethod } from "../../types/packageOpening";
import {
  CLOSING_PROCEDURES,
  FIBERBOARD_RECLOSURE_METHODS,
  ProcedureStep,
} from "../../utils/innerPackagingProcedures";

interface Props {
  navigation: any;
  route?: {
    params?: {
      continueRoute?: string;
      continueParams?: any;
    };
  };
}

/**
 * Determines if new certification is required based on container type and closure method.
 * Per AFMAN 24-604 A28.2.2:
 * - Fiberboard tape-only: NO (A28.2.2.2.7)
 * - Fiberboard adhesive/stapled: YES (A28.2.2.2.8)
 * - Wood box: YES (A28.2.2.4.3)
 * - Drum: YES (A28.2.2.6.3)
 * - Overpack: NO (A28.2.2.7.2)
 * - Jerrican: NO (A28.2.2.9.2)
 * - Non-specification: NO (A28.2.2.8.2)
 */
const deriveNewCertificationRequired = (
  containerType: Exclude<ContainerType, null>,
  fiberboardClosureMethod: FiberboardClosureMethod
): boolean => {
  switch (containerType) {
    case "fiberboard-box":
      return fiberboardClosureMethod === "adhesive-or-stapled";
    case "wood-box":
      return true;
    case "drum":
      return true;
    case "overpack":
      return false;
    case "jerrican":
      return false;
    case "non-specification":
      return false;
    default:
      return false;
  }
};

export default function InspectorPackageClosingProceduresScreen({ navigation, route }: Props) {
  const { inspection, setPackageOpeningInspection } = useInspectionForm();
  const [fiberboardMethod, setFiberboardMethod] = useState<FiberboardClosureMethod>(null);
  const [notes, setNotes] = useState("");

  const continueRoute = route?.params?.continueRoute || "InspectorSpecialProvisionsScreen";
  const continueParams = route?.params?.continueParams;

  const containerType = inspection?.packageOpeningInspection?.containerType;
  const isFiberboard = containerType === "fiberboard-box";

  const procedures: ProcedureStep[] = containerType ? CLOSING_PROCEDURES[containerType] : [];

  const newCertRequired = useMemo(() => {
    if (!containerType) return false;
    return deriveNewCertificationRequired(containerType, fiberboardMethod);
  }, [containerType, fiberboardMethod]);

  const canContinue = !isFiberboard || fiberboardMethod !== null;

  const handleContinue = useCallback(() => {
    if (!containerType || !inspection?.packageOpeningInspection) return;
    setPackageOpeningInspection({
      ...inspection.packageOpeningInspection,
      fiberboardClosureMethod: isFiberboard ? fiberboardMethod : null,
      newCertificationRequired: newCertRequired,
      closedAt: new Date(),
      inspectorNotes: notes.trim(),
    });
    navigation.navigate(continueRoute, continueParams);
  }, [
    containerType,
    inspection?.packageOpeningInspection,
    setPackageOpeningInspection,
    isFiberboard,
    fiberboardMethod,
    newCertRequired,
    notes,
    navigation,
    continueRoute,
    continueParams,
  ]);

  if (!containerType) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>No container type selected</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Closing Procedures</Text>
          <Text style={styles.stepIndicator}>2/2</Text>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* Closing Procedures */}
          <Text style={styles.sectionTitle}>Closing Procedures</Text>
          <View style={styles.procedureCard}>
            {procedures.map((step) => (
              <View
                key={step.id}
                style={[
                  styles.procedureStep,
                  step.isWarning && styles.procedureWarning,
                ]}
              >
                <MaterialIcons
                  name={step.isWarning ? "warning" : "check-circle-outline"}
                  size={20}
                  color={step.isWarning ? "#FF9500" : "#34C759"}
                />
                <View style={styles.procedureTextContainer}>
                  <Text style={styles.procedureText}>{step.instruction}</Text>
                  <Text style={styles.procedureRef}>{step.afmanRef}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Fiberboard Closure Method */}
          {isFiberboard && (
            <>
              <Text style={styles.sectionTitle}>How was the package reclosed?</Text>
              <View style={styles.procedureCard}>
                {FIBERBOARD_RECLOSURE_METHODS.map((method) => (
                  <TouchableOpacity
                    key={method.value}
                    style={[
                      styles.methodOption,
                      fiberboardMethod === method.value && styles.methodOptionSelected,
                    ]}
                    onPress={() =>
                      setFiberboardMethod(
                        method.value === "adhesive-sealed" || method.value === "stapled"
                          ? "adhesive-or-stapled"
                          : "tape-only"
                      )
                    }
                  >
                    <MaterialIcons
                      name={
                        fiberboardMethod ===
                        (method.value === "adhesive-sealed" || method.value === "stapled"
                          ? "adhesive-or-stapled"
                          : "tape-only")
                          ? "radio-button-checked"
                          : "radio-button-unchecked"
                      }
                      size={24}
                      color={
                        fiberboardMethod ===
                        (method.value === "adhesive-sealed" || method.value === "stapled"
                          ? "adhesive-or-stapled"
                          : "tape-only")
                          ? "#007AFF"
                          : "#8E8E93"
                      }
                    />
                    <View style={styles.methodTextContainer}>
                      <Text style={styles.methodLabel}>{method.label}</Text>
                      {method.requiresCertification && (
                        <Text style={styles.certWarning}>
                          Requires new shipper's certification
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {/* Certification Status */}
          <View style={[styles.certCard, newCertRequired ? styles.certCardWarning : styles.certCardGood]}>
            <MaterialIcons
              name={newCertRequired ? "warning" : "check-circle"}
              size={24}
              color={newCertRequired ? "#FF9500" : "#34C759"}
            />
            <Text style={styles.certText}>
              {newCertRequired
                ? "New shipper's certification IS required"
                : "New shipper's certification is NOT required"}
            </Text>
          </View>

          {/* Inspector Notes */}
          <Text style={styles.sectionTitle}>Inspector Notes (Optional)</Text>
          <View style={styles.notesContainer}>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add notes about the opening/closing..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={!canContinue}
          >
            <Text style={styles.continueButtonText}>Complete</Text>
            <MaterialIcons name="check" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    color: "#1D1D1F",
  },
  stepIndicator: { fontSize: 16, fontWeight: "500", color: "#007AFF" },
  content: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 12,
    marginTop: 8,
  },
  procedureCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  procedureStep: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  procedureWarning: {
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 8,
    marginHorizontal: -4,
  },
  procedureTextContainer: { flex: 1 },
  procedureText: { fontSize: 15, color: "#1D1D1F", lineHeight: 22 },
  procedureRef: { fontSize: 12, color: "#8E8E93", marginTop: 4 },
  methodOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  methodOptionSelected: {
    backgroundColor: "#F0F8FF",
  },
  methodTextContainer: { flex: 1 },
  methodLabel: { fontSize: 15, color: "#1D1D1F" },
  certWarning: { fontSize: 13, color: "#FF9500", marginTop: 2 },
  certCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  certCardGood: { backgroundColor: "#F0FFF4", borderWidth: 1, borderColor: "#34C759" },
  certCardWarning: { backgroundColor: "#FFF8E1", borderWidth: 1, borderColor: "#FF9500" },
  certText: { flex: 1, fontSize: 15, fontWeight: "600", color: "#1D1D1F" },
  notesContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginBottom: 16,
  },
  notesInput: {
    padding: 16,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: "top",
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    padding: 16,
  },
  continueButton: {
    backgroundColor: "#34C759",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonDisabled: { opacity: 0.5 },
  continueButtonText: { color: "#FFFFFF", fontSize: 17, fontWeight: "600" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  backBtn: { backgroundColor: "#007AFF", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginTop: 16 },
  backBtnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
```

**Step 2: Commit**

```bash
git add src/screens/inspector/InspectorPackageClosingProceduresScreen.tsx
git commit -m "feat: add InspectorPackageClosingProceduresScreen (closing procedures + cert determination)"
```

---

### Task 9: Register screens in navigator

**Files:**
- Modify: `src/screens/inspector/InspectorLayoutNavigator.tsx`

**Step 1: Add imports**

After the existing screen imports (around line 57, after `InspectorSddgOriginalCopiesCheckScreen`), add:

```typescript
import InspectorPackageOpeningScreen from "./InspectorPackageOpeningScreen";
import InspectorPackageOpeningProceduresScreen from "./InspectorPackageOpeningProceduresScreen";
import InspectorPackageClosingProceduresScreen from "./InspectorPackageClosingProceduresScreen";
```

**Step 2: Add screen registrations**

In the `InspectorWrappedStack` component, after `InspectorSddgOriginalCopiesCheckScreen` registration (around line 333), add:

```tsx
      <MainStack.Screen
        name="InspectorPackageOpeningScreen"
        component={InspectorPackageOpeningScreen}
      />
      <MainStack.Screen
        name="InspectorPackageOpeningProceduresScreen"
        component={InspectorPackageOpeningProceduresScreen}
      />
      <MainStack.Screen
        name="InspectorPackageClosingProceduresScreen"
        component={InspectorPackageClosingProceduresScreen}
      />
```

**Step 3: Commit**

```bash
git add src/screens/inspector/InspectorLayoutNavigator.tsx
git commit -m "feat: register package opening screens in InspectorLayoutNavigator"
```

---

### Task 10: Wire Attachment 28 to navigate to package opening screen (first-pass only)

**Files:**
- Modify: `src/screens/inspector/InspectorAttachment28WizardScreen.tsx:121-141` (navigateToNext)

**Step 1: Update navigateToNext**

Replace the `navigateToNext` callback (lines 121-141) with:

```typescript
  const navigateToNext = useCallback(() => {
    // Reinspection mode: preserve existing package opening data, go directly to outcome
    if (workflow.reinspection.mode === "package") {
      const hasPackageFrustrations = (inspection?.packageFrustrations?.length ?? 0) > 0;
      if (hasPackageFrustrations) {
        navigation.navigate("PackageFrustrationSummary");
      } else {
        navigation.navigate("PackageInspectionCompleteScreen");
      }
      return;
    }

    // First-pass flow: route through package opening question
    const continueRoute = route?.params?.continueRoute || "InspectorSpecialProvisionsScreen";
    const continueParams = route?.params?.continueParams;
    navigation.navigate("InspectorPackageOpeningScreen", {
      continueRoute,
      continueParams,
    });
  }, [
    navigation,
    inspection?.packageFrustrations?.length,
    route?.params?.continueParams,
    route?.params?.continueRoute,
    workflow.reinspection.mode,
  ]);
```

This preserves the existing reinspection behavior (direct to outcome screens) and only inserts the package opening question on first-pass inspections.

**Step 2: Commit**

```bash
git add src/screens/inspector/InspectorAttachment28WizardScreen.tsx
git commit -m "feat: wire Attachment 28 completion to package opening screen (first-pass only)"
```

---

### Task 11: Wire Form 1015 checkbox — InspectorAMC1015Form

**Files:**
- Modify: `src/screens/inspector/InspectorAMC1015Form.tsx:2843-2851`

**Step 1: Update the checkbox rendering**

Replace lines 2846-2851 (the static checkbox) with:

```tsx
                <Text style={styles.label2}>OPENED FOR INSPECTION:</Text>
                <View
                  style={[
                    styles.checkbox,
                    inspection?.packageOpeningInspection?.wasOpened === true && styles.checkboxChecked,
                  ]}
                >
                  {inspection?.packageOpeningInspection?.wasOpened === true && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </View>
                <Text style={styles.labelSmall}>YES</Text>
                <View
                  style={[
                    styles.checkbox,
                    { marginLeft: 12 },
                    inspection?.packageOpeningInspection?.wasOpened === false && styles.checkboxChecked,
                  ]}
                >
                  {inspection?.packageOpeningInspection?.wasOpened === false && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </View>
                <Text style={styles.labelSmall}>NO</Text>
```

**Step 2: Add checkbox styles**

If not already present in the styles, add:

```typescript
  checkboxChecked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
```

**Step 3: Commit**

```bash
git add src/screens/inspector/InspectorAMC1015Form.tsx
git commit -m "feat: wire Form 1015 OPENED FOR INSPECTION checkbox to provider state"
```

---

### Task 12: Wire Form 1015 checkbox — Form1015Viewer

**Files:**
- Modify: `src/components/Inspector/Form1015Viewer.tsx:835-841`

**Step 1: Update the checkbox rendering**

The `Form1015Viewer` receives `inspection: InspectorShipment` as a prop. The `packageOpeningInspection` is inside `inspection.inspectionContext`. The screen already reads `context` from `(inspection.inspectionContext || {}) as any` on line 49.

Replace lines 836-840 with:

```tsx
                <Text style={styles.label2}>OPENED FOR INSPECTION:</Text>
                <View
                  style={[
                    styles.checkbox,
                    context.packageOpeningInspection?.wasOpened === true && styles.checkboxChecked,
                  ]}
                >
                  {context.packageOpeningInspection?.wasOpened === true && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </View>
                <Text style={styles.labelSmall}>YES</Text>
                <View
                  style={[
                    styles.checkbox,
                    { marginLeft: 12 },
                    context.packageOpeningInspection?.wasOpened === false && styles.checkboxChecked,
                  ]}
                >
                  {context.packageOpeningInspection?.wasOpened === false && (
                    <Text style={styles.checkMark}>✓</Text>
                  )}
                </View>
                <Text style={styles.labelSmall}>NO</Text>
```

**Step 2: Add checkbox styles (same as Task 11)**

Add `checkboxChecked` and `checkMark` styles if not already present.

**Step 3: Commit**

```bash
git add src/components/Inspector/Form1015Viewer.tsx
git commit -m "feat: wire Form1015Viewer OPENED FOR INSPECTION checkbox"
```

---

### Task 13: Wire Form 1015 checkbox — PDF generator

**Files:**
- Modify: `src/utils/form1015PdfGenerator.ts:13-28` (Form1015PdfData) and `src/utils/form1015PdfGenerator.ts:72-74` (buildForm1015PdfData) and `src/utils/form1015PdfGenerator.ts:540-543` (HTML template)

**Step 1: Add field to Form1015PdfData**

At `src/utils/form1015PdfGenerator.ts:27`, after `quantityAndPacking`, add:

```typescript
  openedForInspection: boolean | null;
```

**Step 2: Set it in buildForm1015PdfData**

At `src/utils/form1015PdfGenerator.ts:75` (after `const context = ...`), add:

```typescript
  const openedForInspection = context.packageOpeningInspection?.wasOpened ?? null;
```

Then add `openedForInspection` to the returned `Form1015PdfData` object.

**Step 3: Update the HTML template**

Replace lines 541-543 (the static checkbox HTML) with:

```typescript
          <strong>OPENED FOR INSPECTION:</strong>
          <span style="display:inline-block;width:16px;height:16px;border:1px solid #000;text-align:center;margin:0 4px;${data.openedForInspection === true ? 'background:#007AFF;color:#fff;font-weight:bold;' : ''}">${data.openedForInspection === true ? '✓' : '&nbsp;'}</span> YES
          <span style="display:inline-block;width:16px;height:16px;border:1px solid #000;text-align:center;margin:0 4px;${data.openedForInspection === false ? 'background:#007AFF;color:#fff;font-weight:bold;' : ''}">${data.openedForInspection === false ? '✓' : '&nbsp;'}</span> NO
```

**Step 4: Commit**

```bash
git add src/utils/form1015PdfGenerator.ts
git commit -m "feat: wire Form 1015 PDF OPENED FOR INSPECTION checkbox"
```

---

### Task 14: Update test mocks and add targeted tests

**Files:**
- Modify: `src/__mocks__/testUtils.tsx:133-156`

**Step 1: Update createMockInspectionForm**

Add `packageOpeningInspection: null` to the `inspection` object defaults (around line 138):

```typescript
  inspection: {
    id: 'test-inspection-id',
    sddgStatus: 'NOT_STARTED',
    packageStatus: 'NOT_STARTED',
    frustrations: [],
    packageFrustrations: [],
    packageOpeningInspection: null,
    ...overrides.inspection,
  },
```

Add mock functions to the spread (around line 155):

```typescript
  setPackageOpeningInspection: jest.fn(),
  clearPackageOpeningInspection: jest.fn(),
  ...overrides,
```

**Step 2: Commit**

```bash
git add src/__mocks__/testUtils.tsx
git commit -m "feat: update test mocks for package opening inspection"
```

---

### Task 15: Verify the full flow compiles

**Step 1: Run TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors related to package opening types or screens.

**Step 2: Run existing tests**

```bash
npx jest --passWithNoTests
```

Expected: All existing tests still pass.

**Step 3: Fix any type errors or test failures if found**

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve any TypeScript errors from package opening feature"
```
