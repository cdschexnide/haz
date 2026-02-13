# Special Authorization Workflow Redesign

**Date:** 2026-02-13
**Status:** Design approved (rev 2 — addresses code review findings)

## Problem

The current special authorization flow spans 4 screens with poor UX:

1. `InspectorSpecialAuthorizationCheckScreen` — sparse layout, clinical feel
2. `InspectorSpecialAuthorizationAttestationScreen` — overloaded (type selection + upload trigger + reference matching + attestation all in one)
3. `InspectorCoeAndCaaScreen` — 700-line document scanner for COE/CAA
4. `InspectorDotSpScreen` — 600-line near-duplicate scanner for DOT-SP

Issues: code duplication between scanner screens (~80% shared), inconsistent styling (hardcoded colors vs design tokens), too many screens for a simple upload-and-attest workflow, unnecessary text input fields (reference numbers, agency names).

## Solution

Replace with a 3-screen pipeline:

```
SpecialAuthorizationCheck → WaiverUpload → WaiverAttestation → Home
```

## Intentional Compliance Decision: Reference Matching Removed

The current `InspectorSpecialAuthorizationAttestationScreen` requires the inspector to type a reference number for each uploaded document, then cross-validates that reference against Key 17 from the SDDG. This redesign **intentionally removes** that text-entry and cross-validation step. The rationale:

1. The inspector uploads the actual authorization document (the source of truth).
2. The inspector attests under their name that the shipment complies with the uploaded authorization.
3. Key 17 value is displayed on the attestation screen for visual cross-reference.
4. Requiring typed reference numbers created friction with no additional safety — a bad-faith inspector could type anything to pass the match.

This was explicitly approved during brainstorming. The attestation checkbox serves as the compliance gate.

---

### Screen 1: SpecialAuthorizationCheck (Redesigned)

**File:** `src/screens/inspector/InspectorSpecialAuthorizationCheckScreen.tsx` (modify in-place)

**Purpose:** Binary gate — is this shipment using special authorization?

**Layout:**
- `SafeAreaView` wrapper (fixes missing SafeAreaView bug)
- `ScreenHeader` with title "Special Authorization Check"
- Single prominent card combining the warning and Key 17 value:
  - Warning icon + "Key 17 Flagged" header
  - Explanation text: "The packing instruction doesn't match a known AFMAN 24-604 paragraph."
  - Embedded Key 17 value in a highlighted sub-card
- Two `SelectableCard` options (bigger tap targets than current `RadioGroup`):
  - "Uses special authorization (COE, CAA, or DOT-SP)"
  - "Key 17 is incorrect — should be a valid AFMAN packaging paragraph"
- `ActionFooter` with Back + Continue

**Behavior:**
- "Yes" path: `navigation.navigate("WaiverUploadScreen", { key17Value })`
- "No" path: auto-frustrate Key 17 via `addFrustration(...)`, then **navigate to `SDDGFrustrationSummary`** (NOT `goBack()`). This avoids a state-sync bug: `InteractiveSDDGComplianceScreen` tracks frustrated fields in a local `Set` initialized once on mount. A simple `goBack()` would return there without the new frustration in the local state, causing the user to loop back into the special auth check. Navigating to the frustration summary ensures the context-level frustration is displayed and the user proceeds from there.
- Continue button disabled until selection is made

**Design system components:** `SafeAreaView`, `ScreenHeader`, `SelectableCard`, `ActionFooter`, `colors`, `spacing`

### Screen 2: WaiverUpload (New)

**File:** `src/screens/inspector/WaiverUploadScreen.tsx` (create new)

**Purpose:** Select authorization type and upload document(s). No text input fields.

**Layout:**
- `SafeAreaView` + `ScreenHeader` with title "Upload Authorization"
- **Permission denied state:** If camera permission is denied on Android, show a centered error state with icon, explanation, and "Grant Permission" retry button (same UX pattern as current `InspectorCoeAndCaaScreen.tsx:322`). Gallery picking remains available regardless of camera permission.
- **Type selector:** Three horizontal pill buttons (COE / CAA / DOT-SP). Custom segment control using `TouchableOpacity` with `colors.primary` fill for active state. Only one active at a time. **Disabled during document processing** to prevent type-switch race conditions where a document could be classified under the wrong type.
- **Upload zone:** Dashed-border card with two action buttons:
  - "Scan" — launches `react-native-document-scanner-plugin` (same pattern as current COE/CAA/DOT-SP screens: `DocumentScanner.scanDocument({ croppedImageQuality: 80, maxNumDocuments: 1, responseType: ResponseType.ImageFilePath })`)
  - "Gallery" — launches `expo-image-picker` with `launchImageLibraryAsync({ mediaTypes: 'images' })`
  - Both paths produce an image URI → convert to PDF via `expo-print` `printToFileAsync` + `expo-file-system` base64 encoding (reuse existing pattern)
- **Document list:** `SectionHeader` "Documents (N)" followed by cards showing:
  - 60x80 PDF icon placeholder (not an `<Image>` — PDF URIs don't render reliably via RN `<Image>`, and scanned source images are temp files that may be cleaned up)
  - Type label + date added
  - Delete button (trash icon) with confirmation `Alert`
- `ActionFooter` with Back + Continue (disabled until type selected + at least 1 document uploaded)

**State management:**
- Reads: `inspection.coeAndCaaDocuments`, `inspection.dotSpWaivers`
- Writes: `addCoeCaaDocument(doc)` / `addDotSpWaiver(doc)` on successful capture
- Writes: `removeCoeCaaDocument(id, type)` / `removeDotSpWaiver(id)` on delete
- Writes: `pruneAuthorizationDocumentsByType(newType)` when switching type with existing docs (with confirmation alert)
- On Continue: `navigation.navigate("WaiverAttestationScreen", { authorizationType, key17Value })`

**PDF generation:** Reuse the exact pattern from `InspectorCoeAndCaaScreen`:
```ts
const pagesHtml = await Promise.all(images.map(async (uri) => {
  const ext = uri.toLowerCase().endsWith(".png") ? "png" : "jpeg";
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  return `<div style="page-break-after:always;"><img src="data:image/${ext};base64,${base64}" style="width:100%;height:auto;display:block;" /></div>`;
}));
const { uri: tmpPdf } = await Print.printToFileAsync({ html: `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body style="margin:0;padding:0;">${pagesHtml.join("")}</body></html>` });
```

**Camera permissions:** Same `PermissionsAndroid.request` pattern for Android with full denied-state recovery UI. iOS assumes granted (same as current).

### Screen 3: WaiverAttestation (New)

**File:** `src/screens/inspector/WaiverAttestationScreen.tsx` (create new)

**Purpose:** Review uploaded documents and attest before completing inspection.

**Layout:**
- `SafeAreaView` + `ScreenHeader` with title "Review & Attest"
- **Summary card:** `DetailCard` with key-value rows:
  - Authorization type (COE / CAA / DOT-SP)
  - Key 17 value from SDDG
  - Document count
- **Document previews:** Read-only cards with PDF icon placeholder + document metadata (same card style as WaiverUpload but without delete buttons).
- **Attestation checkbox:** `ChecklistItem` with text: "I attest that this shipment has been prepared in accordance with the selected authorization and its conditions/criteria."
- `ActionFooter` with Back + Complete Inspection (disabled until checkbox checked, shows loading spinner via `loading` prop)

**Completion logic (on "Complete Inspection" press):**
```ts
setSpecialAuthorizationData({ type: authorizationType, referenceNumber: key17Value, attested: true });
setQuantityType("standard");
setExceptedQuantityData(null);
setLimitedQuantityData(null);
setPackagePackagingType(null);
setPackageComplete(true);

const result = await finalizeInspection();
if (!result.success) {
  Alert.alert("Unable to Complete Inspection", result.error || "Failed to save.");
  return;
}

navigation.reset({ index: 0, routes: [{ name: "InspectorHomeStack", params: { screen: "InspectorHome" } }] });
```

## Navigation Changes

**File:** `src/screens/inspector/InspectorLayoutNavigator.tsx`

**Add:**
```tsx
import WaiverUploadScreen from "./WaiverUploadScreen";
import WaiverAttestationScreen from "./WaiverAttestationScreen";

// In MainStack.Navigator:
<MainStack.Screen name="WaiverUploadScreen" component={WaiverUploadScreen} />
<MainStack.Screen name="WaiverAttestationScreen" component={WaiverAttestationScreen} />
```

**Remove:**
```tsx
// Remove imports:
import InspectorSpecialAuthorizationAttestationScreen from "./InspectorSpecialAuthorizationAttestationScreen";
import InspectorCoeAndCaaScreen from "./InspectorCoeAndCaaScreen";
import InspectorDotSpScreen from "./InspectorDotSpScreen";

// Remove screen registrations:
<MainStack.Screen name="InspectorSpecialAuthorizationAttestationScreen" ... />
<MainStack.Screen name="InspectorCoeAndCaaScreen" ... />
<MainStack.Screen name="InspectorDotSpScreen" ... />
```

**Keep:** `InspectorSpecialAuthorizationCheckScreen` registration (same route name, modified component).

## NavigationRefContext Type Map Update

**File:** `src/contexts/NavigationRefProvider/NavigationRefContext.ts`

**Remove** old route type entries:
```ts
InspectorSpecialAuthorizationAttestationScreen: { referenceNumber?: string };
InspectorCoeAndCaaScreen: { documentType?: "COE" | "CAA" };
InspectorDotSpScreen: undefined;
```

**Add** new route type entries:
```ts
WaiverUploadScreen: { key17Value?: string };
WaiverAttestationScreen: { authorizationType?: "COE" | "CAA" | "DOT-SP"; key17Value?: string };
```

**Keep** existing `InspectorSpecialAuthorizationCheckScreen` entry (params unchanged).

## Upstream Navigation Updates

Two files navigate INTO this flow and must be updated:

**`src/screens/inspector/InteractiveSDDGComplianceScreen.tsx` (line 513):**
- Currently: `navigation.navigate("InspectorSpecialAuthorizationCheckScreen", { packingInstruction })`
- No change needed — same route name, same params.

**`src/components/SDDGFrustrationSummary.tsx` (line 203):**
- Currently: `navigation.navigate("InspectorSpecialAuthorizationCheckScreen", { packingInstruction })`
- No change needed — same route name, same params.

## Files to Delete

After migration is complete and tested:
- `src/screens/inspector/InspectorSpecialAuthorizationAttestationScreen.tsx`
- `src/screens/inspector/InspectorCoeAndCaaScreen.tsx`
- `src/screens/inspector/InspectorDotSpScreen.tsx`

## Files to Create
- `src/screens/inspector/WaiverUploadScreen.tsx`
- `src/screens/inspector/WaiverAttestationScreen.tsx`

## Files to Modify
- `src/screens/inspector/InspectorSpecialAuthorizationCheckScreen.tsx` — full UI redesign + auto-frustrate logic
- `src/screens/inspector/InspectorLayoutNavigator.tsx` — add new routes, remove old routes
- `src/contexts/NavigationRefProvider/NavigationRefContext.ts` — update route type map

## Context Provider Dependencies

Both new screens use `useInspectionForm()` from `InspectionFormProvider`. Required methods:
- `WaiverUploadScreen`: `addCoeCaaDocument`, `removeCoeCaaDocument`, `addDotSpWaiver`, `removeDotSpWaiver`, `pruneAuthorizationDocumentsByType`
- `WaiverAttestationScreen`: `setSpecialAuthorizationData`, `setQuantityType`, `setExceptedQuantityData`, `setLimitedQuantityData`, `setPackagePackagingType`, `setPackageComplete`, `finalizeInspection`
- `InspectorSpecialAuthorizationCheckScreen`: `addFrustration` (new dependency for auto-frustrate), `completeSDDGSubstep`, `setCurrentSDDGStep` (needed to set SDDG state before navigating to frustration summary)

## Design Tokens

All three screens exclusively use the shared design system (`colors`, `spacing`, `borderRadius`, `shadows` from `src/components/ui/theme.ts`). No hardcoded color values. This fixes the style inconsistency from the old COE/CAA and DOT-SP scanner screens.
