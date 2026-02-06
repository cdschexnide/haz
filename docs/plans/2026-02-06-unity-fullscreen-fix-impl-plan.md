# Unity Fullscreen Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the fullscreen black screen by keeping the mini UnityView always mounted and eliminating the timing gap between unmount/remount.

**Architecture:** Keep Modal for fullscreen (required because MainLayout wraps the screen in a side panel). Fix the root cause: the mini UnityApp gets unmounted before the fullscreen one mounts, leaving Unity's GL surface orphaned. Solution: always keep the mini view mounted (hidden with opacity), open Modal immediately with no delay, remove all setTimeout chains. The Unity singleton transfers rendering to the most-recently-mounted surface automatically.

**Tech Stack:** React Native, TypeScript, @azesmway/react-native-unity

**Design doc:** `docs/plans/2026-02-06-unity-fullscreen-fix-design.md`

---

### Task 1: Rewrite UnityPackagePreview

All changes are in one file: `src/components/preparer/UnityPackagePreview.tsx`

**Step 1: Replace the entire file**

Replace the full contents of `src/components/preparer/UnityPackagePreview.tsx` with:

```typescript
// src/components/preparer/UnityPackagePreview.tsx

import React, { useCallback, useEffect, useState } from "react";
import {
  BackHandler,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UnityApp, { UnityShipmentData } from "@/components/UnityModeling/Unity";
import { RequiredLabel } from "@/utils/labelingRequirements";
import { RequiredMarking } from "@/utils/markingRequirements";
import { colors, spacing } from "@/components/ui";

interface UnityPackagePreviewProps {
  requiredMarkings: readonly RequiredMarking[];
  requiredLabels: readonly RequiredLabel[];
  packageCode?: string;
  packageType?: string;
  shipmentData?: UnityShipmentData;
}

export const UnityPackagePreview: React.FC<UnityPackagePreviewProps> = ({
  requiredMarkings,
  requiredLabels,
  packageCode,
  packageType,
  shipmentData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
  }, []);

  // Android hardware back button closes fullscreen
  useEffect(() => {
    if (!isExpanded) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleClose();
      return true;
    });
    return () => sub.remove();
  }, [isExpanded, handleClose]);

  // Shared props for both UnityApp instances
  const unityProps = {
    requiredMarkings,
    requiredLabels,
    packageCode,
    packageType,
    shipmentData,
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>3D Package Preview</Text>
      </View>

      {/* Mini view — ALWAYS mounted. Hidden via opacity when fullscreen.
          The Unity singleton needs this surface to exist at all times
          so it can return here when the fullscreen Modal closes. */}
      <View
        style={[styles.unityContainer, isExpanded && styles.hiddenContent]}
        testID="unity-preview"
      >
        <View style={styles.unityContent}>
          <UnityApp isFullscreen={false} {...unityProps} />
        </View>

        {/* Tap overlay — only active in mini mode */}
        {!isExpanded && (
          <TouchableOpacity
            testID="unity-expand-overlay"
            style={styles.unityOverlay}
            activeOpacity={1}
            onPress={handleExpand}
          />
        )}
      </View>

      {/* Fullscreen Modal — creates a separate native window above MainLayout.
          The Unity singleton transfers rendering to this surface on mount.
          When this unmounts, rendering returns to the mini view above. */}
      <Modal
        visible={isExpanded}
        transparent={false}
        animationType="fade"
        onRequestClose={handleClose}
        hardwareAccelerated={true}
        statusBarTranslucent={true}
      >
        <View style={styles.fullscreenWrapper}>
          <UnityApp isFullscreen={true} {...unityProps} />

          <TouchableOpacity
            testID="unity-close-button"
            onPress={handleClose}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  headerRow: {
    marginBottom: spacing.sm,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  unityContainer: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
    backgroundColor: colors.surface,
  },
  unityContent: {
    flex: 1,
  },
  unityOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  fullscreenWrapper: {
    flex: 1,
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 6,
  },
  hiddenContent: {
    opacity: 0,
  },
});

export default UnityPackagePreview;
```

**What changed vs. the old file:**

| Old | New |
|-----|-----|
| 5 state vars (`isExpanded`, `shouldRenderFullscreenUnity`, `isUnityLoading`, `isMiniLoading`, `unityKey`) | 1 state var (`isExpanded`) |
| `handleExpand` with 2 nested setTimeouts (150ms + 1000ms) | `handleExpand` = single `setIsExpanded(true)` |
| `handleClose` with 2 nested setTimeouts (150ms + 1000ms) | `handleClose` = single `setIsExpanded(false)` |
| Mini UnityApp unmounted when expanded via conditional | Mini always mounted, hidden with `opacity: 0` |
| Fullscreen UnityApp delayed by 150ms (`shouldRenderFullscreenUnity`) | Fullscreen UnityApp mounts immediately with Modal |
| Both UnityApps use `key={...unityKey}` forcing remount | No `key` props — React never force-remounts |
| Loading overlays (ActivityIndicator) during transitions | No loading overlays needed — transition is instant |
| `useEffect` to reset `shouldRenderFullscreenUnity` | Removed (state no longer exists) |
| No BackHandler | BackHandler for Android hardware back |

**What stayed the same:**
- Props interface (no consumer changes needed)
- Header text ("3D Package Preview")
- Mini container dimensions (260px height)
- Modal with `hardwareAccelerated`, `statusBarTranslucent`, `animationType="fade"`
- Close button position and styling
- Exports (named + default)

---

### Task 2: Update test mocks if needed

**Files:**
- Check: `src/screens/preparer/__tests__/LabelingAndMarkingScreen.test.tsx`
- Check: `src/components/preparer/__tests__/UnityPackagePreview.test.tsx` (if exists)

**Step 1: Check for existing Unity test mocks**

Search for files that mock `UnityPackagePreview`, `UnityApp`, `@azesmway/react-native-unity`, or `Ionicons`:

```
grep -r "UnityPackagePreview\|UnityApp\|react-native-unity\|Ionicons" src/**/__tests__/ --include="*.ts" --include="*.tsx"
```

**Step 2: Update mocks if needed**

If any test file imports or mocks `UnityPackagePreview` and relies on props that changed (there are no prop changes, so this is unlikely), update the mock. The component's external API (props) is unchanged, so existing tests should pass without changes.

If `Ionicons` is already mocked globally (e.g., in jest setup), no changes needed. If not, and tests for `UnityPackagePreview` exist, add a mock:

```typescript
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));
```

---

### Task 3: Verify and test

**Step 1: Check TypeScript compilation**

Run: `npx tsc --noEmit --pretty 2>&1 | head -50`

Expected: No errors.

**Step 2: Run existing tests**

Run: `npx jest --testPathPattern="LabelingAndMarkingScreen|UnityPackagePreview" --verbose 2>&1 | tail -30`

Expected: All pass. If a test fails due to the BackHandler or Ionicons mock, fix the mock per Task 2.

**Step 3: Search for stale references**

Search the entire `src/` directory for any remaining references to removed patterns:
- `shouldRenderFullscreenUnity`
- `isUnityLoading`
- `isMiniLoading`
- `unityKey`
- `ActivityIndicator` (should no longer appear in UnityPackagePreview)

**Step 4: Manual test checklist on Android device**

- [ ] Mini Unity view renders 3D package in the preview area
- [ ] Tapping mini view expands to true fullscreen (covers entire window including MainLayout chrome)
- [ ] No black screen during transition
- [ ] In fullscreen, can rotate package by dragging
- [ ] In fullscreen, can zoom by pinching
- [ ] Close button (X) returns to mini view
- [ ] Android back button returns to mini view
- [ ] Mini view still shows package correctly after returning from fullscreen
- [ ] Cancel / Save & Exit / Save & Continue buttons all work
- [ ] Packaging Info modal still opens correctly
- [ ] Vehicle shipment (UN3166) screen still renders correctly
- [ ] Left sidebar (Material/Shipment Details) not affected

**Note on automated testing:** This fix addresses Unity's native GL rendering surface lifecycle on Android. The GL context transfer between two simultaneously-mounted UnityViews cannot be verified through unit tests — manual device testing is the appropriate verification method.
