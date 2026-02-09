# Unity Package Surface Layout Engine Design

## Problem

The current Unity label/marking positioning system in `DataFromReact.cs` uses ~1,800 lines of hardcoded if/else blocks. Every marking ID x package type combination has manually specified x/y/z coordinates. Adding a new marking type requires adding a position block for all 5 package types. Adding a new package type requires adding a block for every existing marking/label.

## Solution

A declarative, zone-based layout engine that auto-places items on package surfaces using priorities and constraints. One new file (~350 lines), zero changes to the React Native side.

## Hard Requirements

1. Primary hazard label and subsidiary risk label must be on the **same side** of the package, with the primary hazard **higher on the Y axis**.
2. Orientation arrows must be placed on **two opposite sides** of the package, high up.
3. No items may overlap.

## Architecture

### Package Geometry

Each of the 5 package types defines its surface once:

```csharp
[Serializable]
public struct PackageGeometry
{
    public string modelType;        // "box", "drum", "jerrican", "bag", "barrel"
    public float surfaceZ;          // depth offset to front surface
    public float cylinderRadius;    // 0 for flat, >0 for cylindrical
    public float surfaceMinX;       // left bound in world units
    public float surfaceMaxX;       // right bound
    public float surfaceMinY;       // bottom bound
    public float surfaceMaxY;       // top bound
    public float backSideRotationY; // rotation to face the back
    public float backSideZ;         // z offset for back surface
}
```

Values are derived from the existing hardcoded positions (min/max x/y across all current placements for each package type).

### Zone Grid

The surface is divided into a 3x2 grid of named zones, defined in normalized coordinates (0.0-1.0). Identical for all package types:

```
Front face:
+-------------------+-------------------+  1.0 (top)
| front-top-left    | front-top-right   |
|  (0.0-0.5,        |  (0.5-1.0,        |
|   0.6-1.0)        |   0.6-1.0)        |
+-------------------+-------------------+  0.6
| front-mid-left    | front-mid-right   |
|  (0.0-0.5,        |  (0.5-1.0,        |
|   0.25-0.6)       |   0.25-0.6)       |
+-------------------+-------------------+  0.25
| front-bottom-left | front-bottom-right|
|  (0.0-0.5,        |  (0.5-1.0,        |
|   0.0-0.25)       |   0.0-0.25)       |
+-------------------+-------------------+  0.0 (bottom)

Back face: identical layout, mirrored
```

6 zones per side, 12 total. Zone boundaries (0.6, 0.25) are tunable constants.

### Zone Stacking

Each zone is a vertical stack, not a single slot. Multiple items stack top-down within a zone with configurable padding. A Y cursor tracks available space. If a zone overflows, the item falls through to its next preferred zone.

### Overlap Detection

In addition to zone-cursor overflow checks, the engine maintains a global list of placed item AABBs (axis-aligned bounding boxes) in normalized coordinates. Before placing any item, it checks for intersection against all previously placed items across all zones. This prevents wide items that approach a zone boundary from overlapping items in adjacent zones.

```csharp
struct PlacedRect { float minX, minY, maxX, maxY; }

bool Overlaps(PlacedRect a, PlacedRect b)
{
    return a.minX < b.maxX && a.maxX > b.minX
        && a.minY < b.maxY && a.maxY > b.minY;
}
```

### Item Placement Rules

Each marking/label type gets one entry in a static table:

```csharp
[Serializable]
public struct ItemPlacementRule
{
    public string itemCategory;       // matches marking/label ID
    public string group;              // for constraint grouping
    public int priority;              // higher = placed first
    public string[] preferredZones;   // ordered fallback list
    public float sizeX;               // normalized width
    public float sizeY;               // normalized height
}
```

Full placement table:

| Item | Group | Priority | Preferred Zones | Size (norm) |
|------|-------|----------|-----------------|-------------|
| primary-hazard | hazard-label | 100 | front-top-left, front-mid-left | 0.3 x 0.3 |
| subsidiary-risk | hazard-label | 99 | front-top-left, front-mid-left | 0.3 x 0.3 |
| magnetized-material | hazard-label | 100 | front-top-left, front-mid-left | 0.3 x 0.3 |
| military-shipping-label | info-label | 95 | front-top-right, front-mid-right | 0.25 x 0.35 |
| proper-shipping-name-unid | text-marking | 90 | front-mid-left, front-top-left, front-mid-right | 0.45 x 0.12 |
| orientation-arrows | orientation | 85 | front-top-right (+ back-top-right via constraint) | 0.15 x 0.2 |
| cargo-aircraft-only | handling-label | 80 | front-mid-right, front-bottom-right | 0.3 x 0.3 |
| pop-marking | text-marking | 70 | front-bottom-left, front-bottom-right | 0.5 x 0.1 |
| flash-point | text-marking | 60 | front-mid-right, front-top-right, front-mid-left | 0.3 x 0.08 |
| net-mass-dry-ice | text-marking | 60 | front-mid-left, front-mid-right | 0.35 x 0.08 |
| lithium-battery-marking | sprite-marking | 55 | front-mid-right, front-top-right | 0.2 x 0.2 |
| overpack | sprite-marking | 50 | front-mid-left, front-top-left, front-bottom-left | 0.2 x 0.2 |
| limited-quantity | sprite-marking | 50 | front-bottom-left, front-mid-left | 0.2 x 0.2 |
| keep-away-from-heat | sprite-marking | 50 | front-mid-right, front-bottom-right | 0.2 x 0.2 |
| watt-hour-storage-capacity | text-marking | 60 | front-mid-left, front-mid-right | 0.35 x 0.08 |
| kit-marking | text-marking | 55 | front-mid-right, front-bottom-right | 0.3 x 0.08 |
| lithium-battery-excepted-quantity | sprite-marking | 55 | front-mid-right, front-top-right | 0.2 x 0.25 |

Adding a new marking = adding one row. No positioning code.

**Unknown items fallback:** If an item arrives with no matching placement rule, the engine uses a default fallback rule (priority 1, preferred zones: all bottom zones, size 0.2 x 0.1). The item still renders. A warning is logged.

### Sprite Name Resolution

Label sprite names in the existing code are broken: `label.value` (e.g., `"3"`) doesn't match actual resource filenames (e.g., `"HAZMAT_Class_3_Flammable_Liquids"`). The engine includes a centralized `SpriteNameResolver` — a static dictionary mapping `(itemId, value)` pairs to the actual sprite resource name. This resolves names for both labels and markings at the bridge layer before rendering.

```csharp
private static readonly Dictionary<string, string> LabelSpriteMap = new Dictionary<string, string>
{
    // hazard class labels — value is the hazclass-div string
    { "primary-hazard:1.1", "HAZMAT_Class_1.1" },
    { "primary-hazard:1.2", "HAZMAT_Class_1.2" },
    { "primary-hazard:1.3", "HAZMAT_Class_1.3" },
    { "primary-hazard:1.4", "HAZMAT_Class_1.4" },
    { "primary-hazard:2.1", "HAZMAT_Class_2.1_Flammable_Gas" },
    { "primary-hazard:2.2", "HAZMAT_Class_2.2_Non-Flammable_Gas" },
    { "primary-hazard:2.3", "HAZMAT_Class_2.3_Poison_Gas" },
    { "primary-hazard:3", "HAZMAT_Class_3_Flammable_Liquids" },
    // ... etc for all hazard classes + subsidiary-risk variants
    { "cargo-aircraft-only:cargo-aircraft-only", "cargo-aircraft-only" },
    { "military-shipping-label:", "military-shipping-label" },
    { "magnetized-material:", "magnetized-material" },
};

public static string ResolveLabelSprite(string itemId, string value)
{
    string key = itemId + ":" + (value ?? "");
    if (LabelSpriteMap.TryGetValue(key, out string spriteName))
        return spriteName;
    // Fallback: try value directly, then id directly
    return !string.IsNullOrEmpty(value) ? value : itemId;
}
```

The full map is populated from the actual filenames in `Assets/Resources/Labels/` and `Assets/Resources/Markings/`. This fixes the broken label rendering without changing the React Native side.

### Composite Items: POP Marking

POP marking renders two elements: a UN symbol sprite + a text string (e.g., `"1A1/X/25/23/USA/DOD"`). In the layout engine, POP is tracked as a **single composite item** whose `sizeX` encompasses both the UN symbol and the text. The bridge renders both sub-elements within the allocated footprint:

- UN symbol: positioned at the left edge of the allocated space
- Text: positioned to the right of the UN symbol

This ensures the UN symbol doesn't escape the layout's occupied space and overlap other items.

### Constraint Rules

Exactly 2 hard constraints, with **strict enforcement**:

```csharp
// 1. Primary and subsidiary hazard labels share zone column, primary above
ConstraintRule { type: SameSide, itemA: "primary-hazard", itemB: "subsidiary-risk", aAboveB: true }

// 2. Orientation arrows on opposite sides
ConstraintRule { type: OppositeSides, itemA: "orientation-arrows", zoneA: "front-top-right", zoneB: "back-top-right" }
```

**Strict SameSide enforcement:** If primary-hazard is placed in a zone column (e.g., "left"), subsidiary-risk is **restricted** to zones in that same column. If no space remains in that column, the engine evicts the lowest-priority non-constrained item from that column and retries. Constraints are never silently relaxed.

### NormalizedToWorld Conversion

Single function that converts normalized coordinates to world positions, handling both flat and cylindrical surfaces:

```csharp
PlacedItem NormalizedToWorld(float normX, float normY, float normSizeX, float normSizeY,
                              PackageGeometry geo, PlacementZone zone)
{
    bool isBackSide = zone.side == "back";
    float worldX = Mathf.Lerp(geo.surfaceMinX, geo.surfaceMaxX, normX);
    float worldY = Mathf.Lerp(geo.surfaceMinY, geo.surfaceMaxY, normY);
    float worldZ = isBackSide ? geo.backSideZ : geo.surfaceZ;
    float rotY   = isBackSide ? geo.backSideRotationY : 0f;
    float surfaceWidth  = geo.surfaceMaxX - geo.surfaceMinX;
    float surfaceHeight = geo.surfaceMaxY - geo.surfaceMinY;

    return new PlacedItem {
        position = new Vector3(worldX, worldY, worldZ),
        rotationY = rotY,
        cylinderRadius = isBackSide ? -geo.cylinderRadius : geo.cylinderRadius,
        worldSizeX = normSizeX * surfaceWidth,
        worldSizeY = normSizeY * surfaceHeight,
        side = zone.side
    };
}
```

Note: `isBackSide` is derived from `zone.side` rather than passed as a separate parameter, ensuring the zone metadata is the single source of truth.

For cylindrical packages, `worldX` maps to angular offset. The existing `ApplyCurvatureToMesh` and `ApplyCurvature` methods handle deformation using the `cylinderRadius` value. No changes needed to curvature code.

### Layout Algorithm

```
1. Sort items by priority (descending)
2. Initialize Y cursor at top of each zone
3. Initialize global placedRects list (empty)
4. Pre-process constraints:
   - Split orientation-arrows into side1 (front) + side2 (back)
   - Link primary-hazard and subsidiary-risk as paired
5. For each item in priority order:
   a. Try each preferred zone in order
   b. Check: does item height fit below zone's Y cursor?
   c. Compute candidate AABB in normalized coords
   d. Check: does candidate AABB overlap any rect in placedRects?
   e. Check: would placement violate any constraint?
   f. If fits: place at (zone center X, cursor Y - half height),
      advance cursor, add AABB to placedRects
   g. If no zone fits: use fallback rule (bottom zones, small size)
   h. If fallback also fails: log warning, skip item
6. Post-process SameSide constraints:
   - Verify primary-hazard is above subsidiary-risk
   - If violated (due to zone overflow), swap their Y positions
7. For each placed item: resolve sprite name via SpriteNameResolver,
   then call existing CreateSprite() or CreateTextObject()
```

### Buffering Strategy

The Unity bridge receives markings and labels as separate messages (`GetRequiredMarkings`, `GetRequiredLabels`) with no correlation ID. The engine buffers both until ready:

1. On receipt of markings: store parsed array, clear any previously buffered labels (prevents stale cross-contamination).
2. On receipt of labels: store parsed array, clear any previously buffered markings.
3. When both buffers are populated: flush to the layout engine.
4. Safety timeout: if only one message arrives within 2 seconds, flush with whatever data is available + log a warning.

This approach handles both the normal case (both messages arrive quickly) and edge cases (one message lost or delayed).

## File Changes

### New file:
- `Assets/Scripts/PackageLayoutEngine.cs` (~350 lines)

### Modified file:
- `Assets/Scripts/DataFromReact.cs` — replace per-item per-package positioning with single call to layout engine. `ProcessRequiredMarking`, `ProcessRequiredLabel`, `RenderMarkingAsSprite`, `RenderOrientationArrows`, per-package branches in `ProcessRequiredLabel` all collapse into ~30 lines calling the engine. Estimated net: -1,500 lines.

### Unchanged:
- React Native side (zero changes, same message contract)
- `CreateSprite`, `CreateTextObject`, `ApplyCurvature*` methods
- `BuildPOPMarkingText`, `ExtractPOPMetadata`, metadata parsing
- `GetShipmentData` (renders onto MSL sprite, separate system)
- `EditorTestData.cs` (still works, calls new path)
- Prefab system, Resources/sprites

## Migration Path

1. **Build alongside**: Add `PackageLayoutEngine.cs` + Inspector toggle `useLayoutEngine` (default false). Old code still runs.
2. **Tune geometry values**: Derive surface bounds from existing positions. Iterate in Unity Editor with `EditorTestData.cs`.
3. **Validate**: Compare old vs new for known test cases (UN2719, UN1093, UN2334, kitchen-sink combo).
4. **Delete old code**: Remove if/else blocks once layout engine is validated. ~1,500-1,800 lines removed.

## Future Extensibility

- New marking type: add 1 row to placement rules table (~6 lines) + 1 sprite name mapping if needed
- New package type: add 1 PackageGeometry entry (~8 lines) + packaging codes + prefab. All markings auto-place.
