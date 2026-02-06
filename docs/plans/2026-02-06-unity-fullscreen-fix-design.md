# Unity Fullscreen Fix Design — Refactor Repo

## Problem

The `UnityPackagePreview` component uses a Modal-based unmount/remount pattern for fullscreen. The mini UnityView is unmounted before the fullscreen one mounts inside the Modal, creating a 150ms gap where Unity's GL rendering surface has no native view. Since Unity is a singleton on Android, the orphaned surface never reattaches — causing a black screen.

## Constraint: MainLayout

`LabelingAndMarkingScreen` renders inside `MainLayout`'s `dynamicContent` pane, which is offset by a TopNavBar, header row, and 24%-width left sidebar. Absolute positioning from within the screen component cannot reach the full device window. Therefore, `Modal` must be used for true fullscreen (it creates a separate native window above everything).

## Solution

**Keep Modal for fullscreen, but never unmount the mini UnityView.** The root cause is the timing gap, not the Modal itself. Fix by:

1. Always keep the mini `UnityApp` mounted (hidden with `opacity: 0` when fullscreen)
2. Open the Modal immediately with its own `UnityApp` (no 150ms delay)
3. The Unity singleton transfers rendering to whichever `UnityView` was most recently mounted
4. When the Modal closes, rendering returns to the still-mounted mini view

## Files Changed

1. **`src/components/preparer/UnityPackagePreview.tsx`** — All changes in this one file

## Files NOT Changed

- `src/screens/preparer/LabelingAndMarkingScreen.tsx` — No changes needed
- `src/components/UnityModeling/Unity.tsx` — No changes needed

## Architecture

### State Simplification

Remove:
- `shouldRenderFullscreenUnity` (delayed mount flag)
- `isUnityLoading` (fullscreen loading overlay)
- `isMiniLoading` (mini loading overlay)
- `unityKey` (forces remount via key change)

Keep:
- `isExpanded` — toggles fullscreen Modal visibility

### Handler Simplification

Replace setTimeout chains with single setState calls:

```typescript
const handleExpand = useCallback(() => {
  setIsExpanded(true);
}, []);

const handleClose = useCallback(() => {
  setIsExpanded(false);
}, []);
```

### Component Structure

```
<View>
  <Header />

  {/* Mini view — ALWAYS mounted, hidden via opacity when fullscreen */}
  <View style={[unityContainer, isExpanded && { opacity: 0 }]}>
    <UnityApp isFullscreen={false} ... />
    {!isExpanded && <TapOverlay onPress={handleExpand} />}
  </View>

  {/* Modal for fullscreen — true full-window coverage */}
  <Modal visible={isExpanded} onRequestClose={handleClose}>
    <View style={fullscreen}>
      <UnityApp isFullscreen={true} ... />
      <CloseButton onPress={handleClose} />
    </View>
  </Modal>
</View>
```

### Why This Works

- **No timing gap:** The mini UnityView is never unmounted. When the Modal opens, its UnityApp mounts immediately. The Unity singleton transfers rendering to the new surface. No orphan period.
- **Clean return:** When the Modal closes, its UnityApp unmounts. The Unity singleton returns to the still-mounted mini UnityView.
- **No `key` prop changes:** Neither UnityApp uses a dynamic `key`, so React never force-remounts them.
- **Full-window fullscreen:** Modal creates a separate native window above MainLayout's chrome.
- **BackHandler:** Added for Android hardware back button.

### Touch Handling

- **Mini mode:** `TouchableOpacity` overlay intercepts taps to trigger expand.
- **Fullscreen mode:** No overlay. Modal's UnityApp receives direct touches for rotate/zoom.

## Testing

Manual device testing required:
- Mini view renders 3D package
- Tap expands to fullscreen (no black screen)
- Rotate/zoom via touch in fullscreen
- Close button and Android back button both work
- Return to mini preserves rendering
- ActionFooter and DocumentModal still work
- Vehicle shipment screen unaffected
