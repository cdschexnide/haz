# Unity Label/Marking Placement Fixes — Design

**Goal:** Fix four visual defects in the 3D package preview: text overflow, marking overlap, Z-offset hovering, and backface bleed-through.

**Scope:** Unity C# changes only — `PackageLayoutEngine.cs` and `DataFromReact.cs`. No React Native changes.

**Tested with:** UN1093 (ACRYLONITRILE, STABILIZED) in a Jerrican (3H1). Validated across all five package types (box, drum, jerrican, bag, barrel).

---

## Problem Summary

| # | Issue | Root Cause |
|---|-------|-----------|
| 1 | PSN+UN text goes off the left edge of the Jerrican | Fixed `fontSize = 0.8f`, no word wrap, text exceeds allocated AABB width |
| 2 | Flash point overlaps onto the MSL label | Flash point's preferred zones collide with MSL zone; AABB height too small |
| 3 | Flash point marking hovers off the Jerrican surface | `surfaceZ = -0.9f` doesn't match the actual model front face (~-0.7f) |
| 4 | Markings visible through the back of the Jerrican | `Sprites/Default` shader hardcodes `Cull Off`, rendering both faces |

---

## Fix A: Backface Culling (Category C — Problem 4)

**What:** Replace `Sprites/Default` shader with `Unlit/Texture` at all 3 material creation sites.

**Why not `SetInt("_Cull", ...)`?** Unity's `Sprites/Default` shader hardcodes `Cull Off` in its SubShader block and does NOT expose `_Cull` as a property. Calling `material.SetInt("_Cull", ...)` is silently ignored — a no-op. The shader must be replaced entirely.

**Why `Unlit/Texture`?** This built-in shader uses Unity's implicit default `Cull Back` (it doesn't specify a Cull directive, so Unity applies `Cull Back`). It supports `_MainTex` for textured quads and `_Color` for tinting. It's lightweight and mobile-friendly.

**Where:** `DataFromReact.cs` — 3 sites in two methods:

| Method | Context |
|--------|---------|
| First `CreateSprite` (UN label path) | Sprite quad for UN symbol in POP markings |
| `CreateTextObject` | White background quad behind text markings |
| Second `CreateSprite` (general path) | Sprite quads for hazard diamonds, orientation arrows, etc. |

**How:** At each site, replace:
```csharp
Material spriteMaterial = new Material(Shader.Find("Sprites/Default"));
```
with:
```csharp
Material spriteMaterial = new Material(Shader.Find("Unlit/Texture"));
```

For the text background (which uses a solid white color, not a texture):
```csharp
meshRenderer.material = new Material(Shader.Find("Unlit/Texture"));
meshRenderer.material.color = new Color(1f, 1f, 1f, 0.9f);
```

**Note:** `Unlit/Texture` renders in the `Geometry` queue (opaque). The background quad uses alpha 0.9 which is close enough to opaque that this works visually. If true transparency is ever needed, a custom shader with `Cull Back` would be required.

TextMeshPro text uses `TextMeshPro/Mobile/Distance Field` which already culls back faces. Only the quad meshes need this fix.

Back-side markings (placed at `backSideZ`, rotated 180°) are unaffected — their front face points toward the camera when orbiting behind the package.

---

## Fix B: Jerrican Z-Offset (Category B — Problem 3)

**What:** Move jerrican Z-offset from `-0.9f` to `-0.7f`. Introduce a `JERRICAN_FRONT_Z` constant to eliminate duplicated literals. Reduce cumulative per-text Z-drift.

### B1: PackageLayoutEngine.cs — Geometry Definition

```csharp
{ "jerrican", new PackageGeometry {
    modelType = "jerrican",
    surfaceZ = -0.7f,       // was -0.9f
    cylinderRadius = 0f,
    surfaceMinX = -0.7f, surfaceMaxX = 0.7f,
    surfaceMinY = -1.2f, surfaceMaxY = 1.5f,
    backSideRotationY = 180f,
    backSideZ = 0.7f         // was 0.9f
}}
```

### B2: DataFromReact.cs — Introduce Constants, Replace All Hardcoded Jerrican Z Literals

Add constants near the top of the class:
```csharp
private const float JERRICAN_FRONT_Z = -0.7f;
private const float JERRICAN_SIDE_Z = -0.35f;  // side arrow, proportional to front
```

Replace all 13 front-face `position_z = -0.9f` occurrences within jerrican blocks with `position_z = JERRICAN_FRONT_Z`:

Verification command (should find 0 matches after replacement):
```bash
grep -n "position_z = -0.9f" Assets/Scripts/DataFromReact.cs
```

Then check the grep only within jerrican context blocks to confirm all are replaced.

The side orientation arrow (currently `-0.45f`) becomes `position_z = JERRICAN_SIDE_Z`.

**Total: 14 sites** (13 front-face `-0.9f` + 1 side `-0.45f`):

| Search pattern | Count | Replacement |
|----------------|-------|-------------|
| `position_z = -0.9f` within jerrican blocks | 13 | `JERRICAN_FRONT_Z` |
| `position_z = -0.45f` within jerrican orientation arrow | 1 | `JERRICAN_SIDE_Z` |

No back-side `0.9f` literals exist in DataFromReact.cs for jerrican — the `backSideZ` is only in the PackageLayoutEngine geometry definition.

### B3: DataFromReact.cs — Reduce Cumulative Z-Drift

In `CreateTextObject`, change:
```csharp
float zOffset = 0.001f * activeTexts.Count;
```
to:
```csharp
float zOffset = 0.0002f * activeTexts.Count;
```

### Note on Tuning

`-0.7f` is an educated estimate based on the raw mesh bounds. After applying, visually validate in Unity Editor. If tuning is needed, update only the two constants (`JERRICAN_FRONT_Z` and `JERRICAN_SIDE_Z`) and the PackageLayoutEngine geometry — no other sites need changes.

---

## Fix C: Text Overflow — Auto-Scale (Category A — Problem 1)

**What:** Add an `allocatedWidth` field to `JsonText`, pass it from the layout engine, and auto-scale `fontSize` down when rendered text exceeds its allocated width. Clamp to a minimum scale factor to prevent illegible text.

**Where:** `DataFromReact.cs` — `JsonText` class and `CreateTextObject` method.

**How:**

1. Add `allocatedWidth` field to `JsonText` (default 0 = no limit)
2. Pass `placed.worldSizeX` when constructing `JsonText` from layout engine results
3. In `CreateTextObject`, after `ForceMeshUpdate()`, measure and scale:

```csharp
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
```

**Minimum scale clamp:** `Mathf.Max(0.5f, ...)` prevents text from shrinking below 50% of its original size. At that point the text would be too small to read on a handheld device. If a string is so long that even 50% doesn't fit, it will still overflow slightly — but that's an acceptable tradeoff vs illegibility.

**Scope:** Only layout-engine-placed text gets auto-scaling (`allocatedWidth > 0`). Manually-positioned text (POP marking text, MSL text fields) passes `allocatedWidth = 0` and is excluded. This is intentional — those items use their own sizing logic (POP has a composite UN-symbol+text layout, MSL uses word wrapping).

---

## Fix D: Placement Rule Tweaks (Category A — Problem 2)

**Where:** `PackageLayoutEngine.cs` — `PlacementRules` array.

### D1: Widen PSN Allocation

```csharp
new ItemPlacementRule {
    itemCategory = "proper-shipping-name-unid", group = "text-marking", priority = 90,
    preferredZones = new[] { "front-mid-left", "front-top-left", "front-mid-right" },
    sizeX = 0.5f, sizeY = 0.1f },  // sizeX was 0.45f
```

### D2: Reorder Flash-Point Zones & Increase AABB

```csharp
new ItemPlacementRule {
    itemCategory = "flash-point", group = "text-marking", priority = 60,
    preferredZones = new[] { "front-mid-left", "front-bottom-left", "front-mid-right" },
    sizeX = 0.3f, sizeY = 0.09f },
```

- `front-top-right` removed (MSL's home zone at priority 95)
- Left column preferred first
- `sizeY` from `0.07f` to `0.09f` to match actual rendered height

---

## Validation Plan

After applying all changes, test with these combinations:

| Package | UN | Hazard | Why |
|---------|-----|--------|-----|
| Jerrican (3H1) | UN1093 | Class 3, flash point | Original bug — long PSN, flash point, narrow package |
| Drum (1A1) | UN2719 | Class 5.1, subsidiary 6.1 | Cylindrical wrapping, multiple labels |
| Box (4G) | UN2719 | Class 5.1 | General case, widest package |
| Bag (5H1) | UN2719 | Class 5.1 | Tall/narrow package variant |
| Barrel (1A1) | UN2719 | Class 5.1 | Cylindrical, wide |

For each test case:
1. Confirm no text overflows the package edge
2. Confirm no markings overlap each other
3. Rotate 360° — confirm no hover gap between markings and surface
4. Rotate 360° — confirm no backface bleed-through (markings NOT visible from back)
5. Expand to fullscreen — confirm rendering still works
6. Compare text legibility on jerrican vs box for the same PSN string

The `surfaceZ` value is the only parameter that may need iterative tuning (±0.05). If tuning is needed, only the constants need updating.

---

## Files Changed

| File | Changes |
|------|---------|
| `Assets/Scripts/PackageLayoutEngine.cs` | Jerrican geometry Z-values, PSN sizeX, flash-point zones + sizeY |
| `Assets/Scripts/DataFromReact.cs` | Shader swap to `Unlit/Texture` (3 sites), jerrican Z constants + 14 replacements, text auto-scale with min clamp, Z-drift reduction |

---

## Review Findings Addressed

| # | Finding | Resolution |
|---|---------|-----------|
| 1 | `SetInt("_Cull")` is no-op on `Sprites/Default` | Replaced approach: swap shader to `Unlit/Texture` which has implicit `Cull Back` |
| 2 | Z-depth duplicated across hardcoded sites | Introduced `JERRICAN_FRONT_Z` / `JERRICAN_SIDE_Z` constants as single source of truth |
| 3 | Site count inconsistency (15 vs 14) | Corrected to 14 (13 front `-0.9f` + 1 side `-0.45f`), verified via grep |
| 4 | Back-side updates not operationalized | Clarified: no back-side Z literals exist in DataFromReact.cs for jerrican; only `backSideZ` in geometry definition |
| 5 | Auto-scaling lacks minimum bounds | Added `Mathf.Max(0.5f, ...)` clamp to prevent illegible text |
| 6 | Design/impl naming mismatch (`size_x` vs `allocatedWidth`) | Aligned to `allocatedWidth` throughout |
| 7 | Validation scope too narrow | Expanded to all 5 package types with specific checks |
| 8 | Line-number dependent | Impl plan updated to use method signatures + grep verification |
