# Unity Label/Marking Placement Fixes — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix four visual defects in the 3D package preview: text overflow, marking overlap, Z-offset hovering, and backface bleed-through.

**Architecture:** All changes in two Unity C# files. Fix A swaps `Sprites/Default` shader for `Unlit/Texture` (which has implicit `Cull Back`). Fix B introduces Z-offset constants and updates geometry. Fix C adds `allocatedWidth` to `JsonText` with auto-scaling. Fix D tweaks placement rules.

**Tech Stack:** Unity 2022, C# (MonoBehaviour), TextMeshPro, `Unlit/Texture` shader

**Unity project root:** `/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity/Unity Projects/HazProModeling/`

**Files:**
- `Assets/Scripts/PackageLayoutEngine.cs`
- `Assets/Scripts/DataFromReact.cs`

---

### Task 1: Replace Sprites/Default with Unlit/Texture for Backface Culling

Unity's `Sprites/Default` shader hardcodes `Cull Off` and does NOT expose `_Cull` as a property — `SetInt("_Cull", ...)` is silently ignored. We swap to `Unlit/Texture` which uses Unity's implicit default `Cull Back`.

**Files:**
- Modify: `Assets/Scripts/DataFromReact.cs` — 3 shader sites

**Step 1: Find and replace first CreateSprite shader (UN label path)**

Search for the first occurrence of `Shader.Find("Sprites/Default")` in the method that creates the UN label sprite. It appears in a `CreateSprite`-style block near a `GenerateSubdividedQuad` call, before a `labelObject.transform.localScale` assignment.

Current:
```csharp
Material spriteMaterial = new Material(Shader.Find("Sprites/Default"));
spriteMaterial.mainTexture = loadedSprite.texture;
meshRenderer.material = spriteMaterial;
```

Change to:
```csharp
Material spriteMaterial = new Material(Shader.Find("Unlit/Texture"));
spriteMaterial.mainTexture = loadedSprite.texture;
meshRenderer.material = spriteMaterial;
```

**Step 2: Find and replace CreateTextObject background shader**

Search for `Shader.Find("Sprites/Default")` inside the `CreateTextObject` method, within the `if (textData.hasBackground)` block.

Current:
```csharp
// Simple white translucent material
meshRenderer.material = new Material(Shader.Find("Sprites/Default"));
meshRenderer.material.color = new Color(1f, 1f, 1f, 0.9f);
```

Change to:
```csharp
// White background material with backface culling
meshRenderer.material = new Material(Shader.Find("Unlit/Texture"));
meshRenderer.material.color = new Color(1f, 1f, 1f, 0.9f);
```

**Step 3: Find and replace second CreateSprite shader (general labels path)**

Search for the second/last occurrence of `Shader.Find("Sprites/Default")` — it's in the general `CreateSprite` method, near another `GenerateSubdividedQuad` call.

Current:
```csharp
// Create a material from the sprite texture
Material spriteMaterial = new Material(Shader.Find("Sprites/Default"));
spriteMaterial.mainTexture = loadedSprite.texture;
meshRenderer.material = spriteMaterial;
```

Change to:
```csharp
// Create a material from the sprite texture (Unlit/Texture has implicit Cull Back)
Material spriteMaterial = new Material(Shader.Find("Unlit/Texture"));
spriteMaterial.mainTexture = loadedSprite.texture;
meshRenderer.material = spriteMaterial;
```

**Step 4: Verify no remaining Sprites/Default references**

Run:
```bash
grep -n "Sprites/Default" "Assets/Scripts/DataFromReact.cs"
```
Expected: 0 matches.

**Step 5: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity/Unity Projects/HazProModeling"
git add Assets/Scripts/DataFromReact.cs
git commit -m "fix: replace Sprites/Default with Unlit/Texture for backface culling"
```

---

### Task 2: Fix Jerrican Z-Offsets with Constants

Introduces `JERRICAN_FRONT_Z` and `JERRICAN_SIDE_Z` constants as a single source of truth, replacing 14 hardcoded literals. Also updates the geometry definition and reduces cumulative Z-drift.

**Files:**
- Modify: `Assets/Scripts/PackageLayoutEngine.cs` — jerrican geometry
- Modify: `Assets/Scripts/DataFromReact.cs` — constants + 14 replacements + Z-drift

**Step 1: Update jerrican geometry in PackageLayoutEngine.cs**

Search for the string `"jerrican", new PackageGeometry` in PackageLayoutEngine.cs.

Current:
```csharp
{ "jerrican", new PackageGeometry {
    modelType = "jerrican",
    surfaceZ = -0.9f,
    cylinderRadius = 0f,
    surfaceMinX = -0.7f, surfaceMaxX = 0.7f,
    surfaceMinY = -1.2f, surfaceMaxY = 1.5f,
    backSideRotationY = 180f,
    backSideZ = 0.9f
}},
```

Change to:
```csharp
{ "jerrican", new PackageGeometry {
    modelType = "jerrican",
    surfaceZ = -0.7f,
    cylinderRadius = 0f,
    surfaceMinX = -0.7f, surfaceMaxX = 0.7f,
    surfaceMinY = -1.2f, surfaceMaxY = 1.5f,
    backSideRotationY = 180f,
    backSideZ = 0.7f
}},
```

**Step 2: Add Z constants to DataFromReact.cs**

Near the top of the `DataFromReact` class (after the field declarations, before methods), add:

```csharp
// Jerrican surface Z-offsets — single source of truth.
// Adjust these if markings hover or clip after model changes.
private const float JERRICAN_FRONT_Z = -0.7f;
private const float JERRICAN_SIDE_Z = -0.35f;
```

**Step 3: Replace all 13 front-face jerrican `-0.9f` literals**

Search for `position_z = -0.9f` within jerrican code blocks and replace each with `position_z = JERRICAN_FRONT_Z`. These appear in these method contexts:

| Method/Context | Item IDs |
|----------------|----------|
| Text marking positioning (`modelType == "jerrican"`) | `proper-shipping-name-unid`, `flash-point`, `watt-hour-storage-capacity`, `net-mass-dry-ice`, `kit-marking` |
| Sprite marking positioning (`modelType == "jerrican"`) | `overpack`, `lithium-battery-marking`, `keep-away-from-heat`, `limited-quantity` |
| Orientation arrows (`modelType == "jerrican"`) | `side1` front arrow |
| Lithium battery excepted quantity | sprite position |
| POP marking positioning | `popMarking` |
| Label base Z (`modelType == "jerrican"`) | All hazard labels (1 line covers all) |

**Step 4: Replace side orientation arrow Z literal**

In the orientation arrows section for jerrican, find `side2.position_z = -0.45f` and change to `side2.position_z = JERRICAN_SIDE_Z`.

**Step 5: Verify all jerrican Z literals are replaced**

Run these verification commands:
```bash
# Should find 0 matches for -0.9f within jerrican blocks
grep -n "position_z = -0.9f" "Assets/Scripts/DataFromReact.cs"
# Then manually verify none of the matches are in jerrican blocks

# Should find 14 matches for the constants
grep -cn "JERRICAN_FRONT_Z\|JERRICAN_SIDE_Z" "Assets/Scripts/DataFromReact.cs"
# Expected: 16 (2 constant definitions + 14 usages)
```

**Step 6: Reduce cumulative Z-drift**

In the `CreateTextObject` method, search for `0.001f * activeTexts.Count`.

Current:
```csharp
float zOffset = 0.001f * activeTexts.Count; // each text layer a bit forward
```

Change to:
```csharp
float zOffset = 0.0002f * activeTexts.Count; // small offset to prevent z-fighting
```

**Step 7: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity/Unity Projects/HazProModeling"
git add Assets/Scripts/PackageLayoutEngine.cs Assets/Scripts/DataFromReact.cs
git commit -m "fix: correct jerrican surfaceZ to -0.7f using constants, reduce Z-drift"
```

**Note:** `-0.7f` is an educated estimate. After applying, visually validate in Unity Editor. If tuning is needed, only update `JERRICAN_FRONT_Z`, `JERRICAN_SIDE_Z`, and the PackageLayoutEngine geometry — no other sites need changes.

---

### Task 3: Add Text Auto-Scaling to Prevent Overflow

Adds an `allocatedWidth` field to `JsonText`, passes it from the layout engine, and auto-scales `fontSize` down when rendered text exceeds its allocated width. Clamps to 50% minimum to prevent illegible text.

**Files:**
- Modify: `Assets/Scripts/DataFromReact.cs` — `JsonText` class, layout engine bridge, `CreateTextObject`

**Step 1: Add `allocatedWidth` field to `JsonText` class**

Search for `public class JsonText` in DataFromReact.cs. Add the new field at the end:

Current:
```csharp
public class JsonText
{
    public string labelText;
    public float position_x;
    public float position_y;
    public float position_z;
    public float textSize;
    public bool hasBackground;
    public float cylinderRadius;
    public float rotation_y;
}
```

Change to:
```csharp
public class JsonText
{
    public string labelText;
    public float position_x;
    public float position_y;
    public float position_z;
    public float textSize;
    public bool hasBackground;
    public float cylinderRadius;
    public float rotation_y;
    public float allocatedWidth;  // world-space width from layout engine; 0 = no limit
}
```

**Step 2: Pass `placed.worldSizeX` from layout engine text case**

Search for `case PackageLayoutEngine.RenderType.Text:` in the `ProcessAllItemsWithEngine` method. The `CreateTextObject(new JsonText { ... })` call is right after it.

Current:
```csharp
case PackageLayoutEngine.RenderType.Text:
    CreateTextObject(new JsonText
    {
        labelText = placed.item.text,
        position_x = placed.position.x,
        position_y = placed.position.y,
        position_z = placed.position.z,
        textSize = placed.item.textSize,
        hasBackground = placed.item.hasBackground,
        cylinderRadius = placed.cylinderRadius,
        rotation_y = placed.rotationY,
    });
    break;
```

Change to:
```csharp
case PackageLayoutEngine.RenderType.Text:
    CreateTextObject(new JsonText
    {
        labelText = placed.item.text,
        position_x = placed.position.x,
        position_y = placed.position.y,
        position_z = placed.position.z,
        textSize = placed.item.textSize,
        hasBackground = placed.item.hasBackground,
        cylinderRadius = placed.cylinderRadius,
        rotation_y = placed.rotationY,
        allocatedWidth = placed.worldSizeX,
    });
    break;
```

**Step 3: Add auto-scaling logic in CreateTextObject**

In the `CreateTextObject` method, find the block that starts with:
```csharp
// If background exists, size it to match the text
if (background != null)
{
    // Adjust background size to match the text
    textMesh.ForceMeshUpdate();
```

Replace that entire block with:
```csharp
// Auto-scale text if it exceeds allocated width (min 50% to stay legible)
textMesh.ForceMeshUpdate();
if (textData.allocatedWidth > 0)
{
    var renderedSize = textMesh.GetRenderedValues(false);
    if (renderedSize.x > textData.allocatedWidth)
    {
        float scaleFactor = Mathf.Max(0.5f, textData.allocatedWidth / renderedSize.x);
        textMesh.fontSize *= scaleFactor;
        textMesh.ForceMeshUpdate();
    }
}

// If background exists, size it to match the (possibly scaled) text
if (background != null)
{
```

The rest of the background sizing block (`var textBounds = ...`, `background.transform.localScale = ...`) stays the same — but remove the duplicate `textMesh.ForceMeshUpdate()` that was inside the old `if (background != null)` block since it's now called above unconditionally.

Final result for this section:
```csharp
// Auto-scale text if it exceeds allocated width (min 50% to stay legible)
textMesh.ForceMeshUpdate();
if (textData.allocatedWidth > 0)
{
    var renderedSize = textMesh.GetRenderedValues(false);
    if (renderedSize.x > textData.allocatedWidth)
    {
        float scaleFactor = Mathf.Max(0.5f, textData.allocatedWidth / renderedSize.x);
        textMesh.fontSize *= scaleFactor;
        textMesh.ForceMeshUpdate();
    }
}

// If background exists, size it to match the (possibly scaled) text
if (background != null)
{
    var textBounds = textMesh.textBounds;
    float bgWidth = textBounds.size.x * 1.1f;  // 10% padding
    float bgHeight = textBounds.size.y * 1.4f; // 40% vertical padding
    background.transform.localScale = new Vector3(bgWidth, bgHeight, 1);
}
```

**Step 4: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity/Unity Projects/HazProModeling"
git add Assets/Scripts/DataFromReact.cs
git commit -m "feat: auto-scale text to fit allocated width with 50% minimum clamp"
```

**Design notes:**
- `allocatedWidth = 0` (default) skips scaling — this applies to manually-positioned text (POP text, MSL fields) which use their own sizing logic
- The 50% minimum clamp prevents text from becoming illegible on very narrow packages with very long strings
- If a string can't fit even at 50% scale, it will overflow slightly — acceptable tradeoff vs illegibility

---

### Task 4: Adjust Placement Rules for PSN and Flash-Point

Widens the PSN allocation and moves flash-point away from the MSL zone.

**Files:**
- Modify: `Assets/Scripts/PackageLayoutEngine.cs` — `PlacementRules` array

**Step 1: Widen PSN allocation**

Search for `itemCategory = "proper-shipping-name-unid"` in the `PlacementRules` array.

Current:
```csharp
new ItemPlacementRule {
    itemCategory = "proper-shipping-name-unid", group = "text-marking", priority = 90,
    preferredZones = new[] { "front-mid-left", "front-top-left", "front-mid-right" },
    sizeX = 0.45f, sizeY = 0.1f },
```

Change `sizeX` from `0.45f` to `0.5f`:
```csharp
new ItemPlacementRule {
    itemCategory = "proper-shipping-name-unid", group = "text-marking", priority = 90,
    preferredZones = new[] { "front-mid-left", "front-top-left", "front-mid-right" },
    sizeX = 0.5f, sizeY = 0.1f },
```

**Step 2: Reorder flash-point zones and increase AABB height**

Search for `itemCategory = "flash-point"` in the `PlacementRules` array.

Current:
```csharp
new ItemPlacementRule {
    itemCategory = "flash-point", group = "text-marking", priority = 60,
    preferredZones = new[] { "front-mid-right", "front-top-right", "front-mid-left" },
    sizeX = 0.3f, sizeY = 0.07f },
```

Change zones and `sizeY`:
```csharp
new ItemPlacementRule {
    itemCategory = "flash-point", group = "text-marking", priority = 60,
    preferredZones = new[] { "front-mid-left", "front-bottom-left", "front-mid-right" },
    sizeX = 0.3f, sizeY = 0.09f },
```

Changes:
- `front-top-right` removed (MSL's home zone at priority 95)
- Left column preferred first
- `sizeY` from `0.07f` to `0.09f` to match actual rendered height with background

**Step 3: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity/Unity Projects/HazProModeling"
git add Assets/Scripts/PackageLayoutEngine.cs
git commit -m "fix: widen PSN allocation and reorder flash-point zones away from MSL"
```

---

## Validation Checklist

After all 4 tasks, visually test in Unity Editor:

| # | Package | UN | Hazard | Checks |
|---|---------|-----|--------|--------|
| 1 | Jerrican (3H1) | UN1093 | Class 3, flash point | PSN fits, flash point doesn't overlap MSL |
| 2 | Jerrican (3H1) | UN1093 | Class 3, flash point | 360° rotate — no hover, no backface bleed |
| 3 | Drum (1A1) | UN2719 | Class 5.1, sub 6.1 | Curvature wrapping intact, labels curve |
| 4 | Box (4G) | UN2719 | Class 5.1 | No regression, text at normal size |
| 5 | Bag (5H1) | UN2719 | Class 5.1 | Tall/narrow package, markings within bounds |
| 6 | Barrel (1A1) | UN2719 | Class 5.1 | Cylindrical wrapping, wide package |
| 7 | Jerrican (3H1) | UN1093 | Class 3 | Fullscreen expand — rendering works |
| 8 | Box (4G) | UN1093 | Class 3 | Compare text size: box PSN vs jerrican PSN |

If jerrican markings still hover or clip, adjust only `JERRICAN_FRONT_Z`, `JERRICAN_SIDE_Z` in DataFromReact.cs and `surfaceZ`/`backSideZ` in PackageLayoutEngine.cs.

---

## Review Findings Addressed

| # | Finding | Resolution |
|---|---------|-----------|
| 1 | `SetInt("_Cull")` no-op on `Sprites/Default` | Swap to `Unlit/Texture` (implicit `Cull Back`) |
| 2 | Z-depth duplicated across hardcoded sites | `JERRICAN_FRONT_Z` / `JERRICAN_SIDE_Z` constants |
| 3 | Site count inconsistency (15 vs 14) | Corrected to 14, verified via grep |
| 4 | Back-side updates not operationalized | Clarified: no back-side literals in DataFromReact.cs; only geometry def |
| 5 | Auto-scaling lacks minimum bounds | `Mathf.Max(0.5f, ...)` clamp |
| 6 | Naming mismatch (`size_x` vs `allocatedWidth`) | Aligned to `allocatedWidth` everywhere |
| 7 | Validation scope too narrow | Expanded to all 5 package types, 8 test cases |
| 8 | Line-number dependent | Keyed steps by method signature + search patterns |
