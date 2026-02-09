# Unity Package Surface Layout Engine — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace ~1,800 lines of hardcoded if/else label/marking positioning in Unity with a declarative zone-based layout engine.

**Architecture:** A single new C# script (`PackageLayoutEngine.cs`) defines package geometries, placement zones, item rules, sprite name resolution, AABB overlap detection, and a stacking algorithm. `DataFromReact.cs` delegates all positioning to the engine. Existing rendering methods (`CreateSprite`, `CreateTextObject`, `ApplyCurvature*`) are reused unchanged.

**Tech Stack:** Unity C# (2022.3), TextMeshPro, existing `@azesmway/react-native-unity` bridge (unchanged)

**Design doc:** `docs/plans/2026-02-09-unity-layout-engine-design.md`

**Unity project location:** `/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity/Unity Projects/HazProModeling/`

**Key constraint:** This is a Unity C# project — there is no xUnit/NUnit test runner configured. "Testing" means using the existing `EditorTestData.cs` Inspector harness in the Unity Editor to visually validate placement. Each task includes specific visual checks to perform.

---

## Task 1: Create PackageLayoutEngine.cs — Data Structures

**Files:**
- Create: `Assets/Scripts/PackageLayoutEngine.cs`

**Step 1: Create the file with all data structures**

Create `Assets/Scripts/PackageLayoutEngine.cs` in the Unity project at:
`/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity/Unity Projects/HazProModeling/Assets/Scripts/PackageLayoutEngine.cs`

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

/// <summary>
/// Declarative zone-based layout engine for placing labels and markings
/// on 3D package surfaces. Replaces per-item per-package hardcoded positioning.
/// </summary>
public static class PackageLayoutEngine
{
    // ─── Data Structures ───

    [Serializable]
    public struct PackageGeometry
    {
        public string modelType;
        public float surfaceZ;          // front face depth offset
        public float cylinderRadius;    // 0 = flat, >0 = cylindrical
        public float surfaceMinX;
        public float surfaceMaxX;
        public float surfaceMinY;
        public float surfaceMaxY;
        public float backSideRotationY;
        public float backSideZ;
    }

    [Serializable]
    public struct PlacementZone
    {
        public string zoneName;
        public string side;             // "front" or "back"
        public float normalizedMinX;
        public float normalizedMaxX;
        public float normalizedMinY;    // 0 = bottom, 1 = top
        public float normalizedMaxY;
    }

    [Serializable]
    public struct ItemPlacementRule
    {
        public string itemCategory;     // matches marking/label ID
        public string group;            // for constraint grouping
        public int priority;            // higher = placed first
        public string[] preferredZones; // ordered fallback list
        public float sizeX;             // normalized width (0-1)
        public float sizeY;             // normalized height (0-1)
    }

    public enum ConstraintType
    {
        SameSide,       // two items must be in same zone column, A above B
        OppositeSides   // item placed on front AND back
    }

    [Serializable]
    public struct ConstraintRule
    {
        public ConstraintType type;
        public string itemA;
        public string itemB;           // only for SameSide
        public bool aAboveB;           // only for SameSide
        public string placementA;      // only for OppositeSides
        public string placementB;      // only for OppositeSides
    }

    public enum RenderType
    {
        Sprite,
        Text,
        PopMarking,
        OrientationArrows
    }

    public struct LayoutItem
    {
        public string id;
        public RenderType renderType;
        public string spriteName;       // for sprites
        public string text;             // for text markings
        public bool hasBackground;      // for text markings
        public float textSize;          // for text markings (world units, used as hint)
        public object metadata;         // pass-through for POP metadata
    }

    public struct PlacedItem
    {
        public LayoutItem item;
        public Vector3 position;
        public float rotationY;
        public float cylinderRadius;
        public float worldSizeX;
        public float worldSizeY;
        public string side;             // "front" or "back"
    }

    // ─── AABB Overlap Detection ───

    private struct PlacedRect
    {
        public float minX, minY, maxX, maxY;
    }

    private static bool Overlaps(PlacedRect a, PlacedRect b)
    {
        return a.minX < b.maxX && a.maxX > b.minX
            && a.minY < b.maxY && a.maxY > b.minY;
    }

    private static bool OverlapsAny(PlacedRect candidate, List<PlacedRect> placed)
    {
        for (int i = 0; i < placed.Count; i++)
        {
            if (Overlaps(candidate, placed[i]))
                return true;
        }
        return false;
    }
}
```

**Step 2: Verify the file compiles**

Open the Unity Editor. Wait for script compilation. Check the Console window — there should be zero errors from `PackageLayoutEngine.cs`.

**Step 3: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity"
git add "Unity Projects/HazProModeling/Assets/Scripts/PackageLayoutEngine.cs"
git commit -m "feat: add PackageLayoutEngine data structures with AABB overlap detection"
```

---

## Task 2: Add Package Geometries and Zone Definitions

**Files:**
- Modify: `Assets/Scripts/PackageLayoutEngine.cs`

**Step 1: Add geometry definitions after the data structures**

Append inside the `PackageLayoutEngine` class, after the `OverlapsAny` method:

```csharp
    // ─── Zone Grid Constants ───

    private const float ZONE_MID_SPLIT = 0.5f;    // left/right split at 50%
    private const float ZONE_ROW_TOP = 0.6f;       // top row starts at 60%
    private const float ZONE_ROW_MID = 0.25f;      // mid row starts at 25%
    private const float ZONE_PADDING = 0.02f;       // padding between stacked items (normalized)

    // ─── Package Geometries ───
    // Values derived from existing hardcoded positions in DataFromReact.cs

    private static readonly Dictionary<string, PackageGeometry> Geometries = new Dictionary<string, PackageGeometry>
    {
        { "box", new PackageGeometry {
            modelType = "box",
            surfaceZ = -1.01f,
            cylinderRadius = 0f,
            surfaceMinX = -1.1f, surfaceMaxX = 1.1f,
            surfaceMinY = -0.8f, surfaceMaxY = 1.8f,
            backSideRotationY = 180f,
            backSideZ = 1.01f
        }},
        { "drum", new PackageGeometry {
            modelType = "drum",
            surfaceZ = -1.145f,
            cylinderRadius = 1.15f,
            surfaceMinX = -0.9f, surfaceMaxX = 0.9f,
            surfaceMinY = -0.9f, surfaceMaxY = 2.0f,
            backSideRotationY = 180f,
            backSideZ = 0.95f
        }},
        { "jerrican", new PackageGeometry {
            modelType = "jerrican",
            surfaceZ = -0.9f,
            cylinderRadius = 0f,
            surfaceMinX = -0.7f, surfaceMaxX = 0.7f,
            surfaceMinY = -1.2f, surfaceMaxY = 1.5f,
            backSideRotationY = 180f,
            backSideZ = 0.9f
        }},
        { "bag", new PackageGeometry {
            modelType = "bag",
            surfaceZ = -0.69f,
            cylinderRadius = 0f,
            surfaceMinX = -0.8f, surfaceMaxX = 0.8f,
            surfaceMinY = -1.3f, surfaceMaxY = 2.2f,
            backSideRotationY = 180f,
            backSideZ = 0.69f
        }},
        { "barrel", new PackageGeometry {
            modelType = "barrel",
            surfaceZ = -1.26f,
            cylinderRadius = 1.2f,
            surfaceMinX = -1.0f, surfaceMaxX = 1.0f,
            surfaceMinY = -0.7f, surfaceMaxY = 1.8f,
            backSideRotationY = 180f,
            backSideZ = 0.95f
        }},
    };

    // ─── Zone Definitions ───

    private static readonly PlacementZone[] Zones = new PlacementZone[]
    {
        // Front face — 3 rows x 2 columns
        new PlacementZone { zoneName = "front-top-left",      side = "front", normalizedMinX = 0f,             normalizedMaxX = ZONE_MID_SPLIT, normalizedMinY = ZONE_ROW_TOP, normalizedMaxY = 1f },
        new PlacementZone { zoneName = "front-top-right",     side = "front", normalizedMinX = ZONE_MID_SPLIT, normalizedMaxX = 1f,             normalizedMinY = ZONE_ROW_TOP, normalizedMaxY = 1f },
        new PlacementZone { zoneName = "front-mid-left",      side = "front", normalizedMinX = 0f,             normalizedMaxX = ZONE_MID_SPLIT, normalizedMinY = ZONE_ROW_MID, normalizedMaxY = ZONE_ROW_TOP },
        new PlacementZone { zoneName = "front-mid-right",     side = "front", normalizedMinX = ZONE_MID_SPLIT, normalizedMaxX = 1f,             normalizedMinY = ZONE_ROW_MID, normalizedMaxY = ZONE_ROW_TOP },
        new PlacementZone { zoneName = "front-bottom-left",   side = "front", normalizedMinX = 0f,             normalizedMaxX = ZONE_MID_SPLIT, normalizedMinY = 0f,           normalizedMaxY = ZONE_ROW_MID },
        new PlacementZone { zoneName = "front-bottom-right",  side = "front", normalizedMinX = ZONE_MID_SPLIT, normalizedMaxX = 1f,             normalizedMinY = 0f,           normalizedMaxY = ZONE_ROW_MID },

        // Back face — mirror of front
        new PlacementZone { zoneName = "back-top-left",       side = "back",  normalizedMinX = 0f,             normalizedMaxX = ZONE_MID_SPLIT, normalizedMinY = ZONE_ROW_TOP, normalizedMaxY = 1f },
        new PlacementZone { zoneName = "back-top-right",      side = "back",  normalizedMinX = ZONE_MID_SPLIT, normalizedMaxX = 1f,             normalizedMinY = ZONE_ROW_TOP, normalizedMaxY = 1f },
        new PlacementZone { zoneName = "back-mid-left",       side = "back",  normalizedMinX = 0f,             normalizedMaxX = ZONE_MID_SPLIT, normalizedMinY = ZONE_ROW_MID, normalizedMaxY = ZONE_ROW_TOP },
        new PlacementZone { zoneName = "back-mid-right",      side = "back",  normalizedMinX = ZONE_MID_SPLIT, normalizedMaxX = 1f,             normalizedMinY = ZONE_ROW_MID, normalizedMaxY = ZONE_ROW_TOP },
        new PlacementZone { zoneName = "back-bottom-left",    side = "back",  normalizedMinX = 0f,             normalizedMaxX = ZONE_MID_SPLIT, normalizedMinY = 0f,           normalizedMaxY = ZONE_ROW_MID },
        new PlacementZone { zoneName = "back-bottom-right",   side = "back",  normalizedMinX = ZONE_MID_SPLIT, normalizedMaxX = 1f,             normalizedMinY = 0f,           normalizedMaxY = ZONE_ROW_MID },
    };

    public static PackageGeometry? GetGeometry(string modelType)
    {
        if (Geometries.TryGetValue(modelType, out PackageGeometry geo))
            return geo;
        return null;
    }

    private static PlacementZone? GetZone(string zoneName)
    {
        for (int i = 0; i < Zones.Length; i++)
        {
            if (Zones[i].zoneName == zoneName)
                return Zones[i];
        }
        return null;
    }
```

**Step 2: Verify compilation**

Open Unity Editor, check Console for zero errors.

**Step 3: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity"
git add "Unity Projects/HazProModeling/Assets/Scripts/PackageLayoutEngine.cs"
git commit -m "feat: add package geometries and zone definitions"
```

---

## Task 3: Add Placement Rules, Constraints, and Sprite Name Resolver

**Files:**
- Modify: `Assets/Scripts/PackageLayoutEngine.cs`

**Step 1: Add the placement rules table, constraints, and sprite resolver**

Append inside `PackageLayoutEngine` class after the `GetZone` method:

```csharp
    // ─── Placement Rules ───
    // Each marking/label type declares its priority and preferred zones.
    // Higher priority = placed first (gets best position).

    private static readonly ItemPlacementRule[] PlacementRules = new ItemPlacementRule[]
    {
        // === HAZARD LABELS (highest priority — claim primary real estate) ===
        new ItemPlacementRule {
            itemCategory = "primary-hazard", group = "hazard-label", priority = 100,
            preferredZones = new[] { "front-top-left", "front-mid-left" },
            sizeX = 0.35f, sizeY = 0.28f },
        new ItemPlacementRule {
            itemCategory = "subsidiary-risk", group = "hazard-label", priority = 99,
            preferredZones = new[] { "front-top-left", "front-mid-left" },
            sizeX = 0.35f, sizeY = 0.28f },
        new ItemPlacementRule {
            itemCategory = "magnetized-material", group = "hazard-label", priority = 100,
            preferredZones = new[] { "front-top-left", "front-mid-left" },
            sizeX = 0.35f, sizeY = 0.28f },
        new ItemPlacementRule {
            itemCategory = "compatibility-group", group = "hazard-label", priority = 98,
            preferredZones = new[] { "front-top-left", "front-mid-left" },
            sizeX = 0.35f, sizeY = 0.28f },

        // === INFO LABELS ===
        new ItemPlacementRule {
            itemCategory = "military-shipping-label", group = "info-label", priority = 95,
            preferredZones = new[] { "front-top-right", "front-mid-right" },
            sizeX = 0.3f, sizeY = 0.35f },

        // === TEXT MARKINGS ===
        new ItemPlacementRule {
            itemCategory = "proper-shipping-name-unid", group = "text-marking", priority = 90,
            preferredZones = new[] { "front-mid-left", "front-top-left", "front-mid-right" },
            sizeX = 0.45f, sizeY = 0.1f },

        // === ORIENTATION (special — uses OppositeSides constraint) ===
        new ItemPlacementRule {
            itemCategory = "orientation-arrows", group = "orientation", priority = 85,
            preferredZones = new[] { "front-top-right" },
            sizeX = 0.15f, sizeY = 0.18f },

        // === HANDLING LABELS ===
        new ItemPlacementRule {
            itemCategory = "cargo-aircraft-only", group = "handling-label", priority = 80,
            preferredZones = new[] { "front-mid-right", "front-bottom-right" },
            sizeX = 0.3f, sizeY = 0.28f },

        // === POP MARKING (composite: UN symbol + text, sizeX includes both) ===
        new ItemPlacementRule {
            itemCategory = "pop-marking", group = "text-marking", priority = 70,
            preferredZones = new[] { "front-bottom-left", "front-bottom-right" },
            sizeX = 0.5f, sizeY = 0.08f },

        // === SECONDARY TEXT MARKINGS ===
        new ItemPlacementRule {
            itemCategory = "flash-point", group = "text-marking", priority = 60,
            preferredZones = new[] { "front-mid-right", "front-top-right", "front-mid-left" },
            sizeX = 0.3f, sizeY = 0.07f },
        new ItemPlacementRule {
            itemCategory = "net-mass-dry-ice", group = "text-marking", priority = 60,
            preferredZones = new[] { "front-mid-left", "front-mid-right" },
            sizeX = 0.35f, sizeY = 0.07f },
        new ItemPlacementRule {
            itemCategory = "watt-hour-storage-capacity", group = "text-marking", priority = 60,
            preferredZones = new[] { "front-mid-left", "front-mid-right" },
            sizeX = 0.35f, sizeY = 0.07f },
        new ItemPlacementRule {
            itemCategory = "kit-marking", group = "text-marking", priority = 55,
            preferredZones = new[] { "front-mid-right", "front-bottom-right" },
            sizeX = 0.3f, sizeY = 0.07f },
        new ItemPlacementRule {
            itemCategory = "cylinder-marking", group = "text-marking", priority = 55,
            preferredZones = new[] { "front-bottom-left", "front-bottom-right" },
            sizeX = 0.35f, sizeY = 0.07f },

        // === SPRITE MARKINGS ===
        new ItemPlacementRule {
            itemCategory = "lithium-battery-marking", group = "sprite-marking", priority = 55,
            preferredZones = new[] { "front-mid-right", "front-top-right", "front-bottom-right" },
            sizeX = 0.22f, sizeY = 0.22f },
        new ItemPlacementRule {
            itemCategory = "lithium-battery-excepted-quantity", group = "sprite-marking", priority = 55,
            preferredZones = new[] { "front-mid-right", "front-top-right" },
            sizeX = 0.22f, sizeY = 0.25f },
        new ItemPlacementRule {
            itemCategory = "overpack", group = "sprite-marking", priority = 50,
            preferredZones = new[] { "front-bottom-left", "front-mid-left" },
            sizeX = 0.22f, sizeY = 0.22f },
        new ItemPlacementRule {
            itemCategory = "limited-quantity", group = "sprite-marking", priority = 50,
            preferredZones = new[] { "front-bottom-left", "front-mid-left" },
            sizeX = 0.22f, sizeY = 0.22f },
        new ItemPlacementRule {
            itemCategory = "keep-away-from-heat", group = "sprite-marking", priority = 50,
            preferredZones = new[] { "front-mid-right", "front-bottom-right" },
            sizeX = 0.2f, sizeY = 0.2f },
        new ItemPlacementRule {
            itemCategory = "excepted-quantity-e-marking", group = "sprite-marking", priority = 100,
            preferredZones = new[] { "front-top-left", "front-mid-left" },
            sizeX = 0.3f, sizeY = 0.3f },
    };

    // ─── Default Fallback Rule ───
    // Used for unknown item IDs so required DG markings are never silently dropped.

    private static readonly ItemPlacementRule FallbackRule = new ItemPlacementRule
    {
        itemCategory = "_fallback",
        group = "unknown",
        priority = 1,
        preferredZones = new[] { "front-bottom-left", "front-bottom-right", "front-mid-left", "front-mid-right" },
        sizeX = 0.2f,
        sizeY = 0.1f
    };

    // ─── Constraint Rules ───

    private static readonly ConstraintRule[] Constraints = new ConstraintRule[]
    {
        // Primary hazard above subsidiary risk, same zone column
        new ConstraintRule {
            type = ConstraintType.SameSide,
            itemA = "primary-hazard",
            itemB = "subsidiary-risk",
            aAboveB = true
        },
        // Orientation arrows on opposite sides
        new ConstraintRule {
            type = ConstraintType.OppositeSides,
            itemA = "orientation-arrows",
            placementA = "front-top-right",
            placementB = "back-top-right"
        },
    };

    // ─── Sprite Name Resolution ───
    // Maps (itemId, value) -> actual sprite resource name.
    // Fixes the broken label.value passthrough (e.g., "3" doesn't match
    // "HAZMAT_Class_3_Flammable_Liquids" in Resources/Labels/).

    private static readonly Dictionary<string, string> LabelSpriteMap = new Dictionary<string, string>
    {
        // Primary hazard labels
        { "primary-hazard:1.1", "HAZMAT_Class_1.1" },
        { "primary-hazard:1.2", "HAZMAT_Class_1.2" },
        { "primary-hazard:1.3", "HAZMAT_Class_1.3" },
        { "primary-hazard:1.4", "HAZMAT_Class_1.4" },
        { "primary-hazard:1.5", "HAZMAT_Class_1.5" },
        { "primary-hazard:1.6", "HAZMAT_Class_1.6" },
        { "primary-hazard:2.1", "HAZMAT_Class_2.1_Flammable_Gas" },
        { "primary-hazard:2.2", "HAZMAT_Class_2.2_Non-Flammable_Gas" },
        { "primary-hazard:2.3", "HAZMAT_Class_2.3_Poison_Gas" },
        { "primary-hazard:3", "HAZMAT_Class_3_Flammable_Liquids" },
        { "primary-hazard:4.1", "HAZMAT_Class_4.1_Flammable_Solid" },
        { "primary-hazard:4.2", "HAZMAT_Class_4.2_Spontaneously_Combustible" },
        { "primary-hazard:4.3", "HAZMAT_Class_4.3_Dangerous_When_Wet" },
        { "primary-hazard:5.1", "HAZMAT_Class_5.1_Oxidizer" },
        { "primary-hazard:5.2", "HAZMAT_Class_5.2_Organic_Peroxide" },
        { "primary-hazard:6.1", "HAZMAT_Class_6.1_Poison" },
        { "primary-hazard:6.2", "HAZMAT_Class_6.2_Infectious_Substance" },
        { "primary-hazard:7", "HAZMAT_Class_7_Radioactive" },
        { "primary-hazard:8", "HAZMAT_Class_8_Corrosive" },
        { "primary-hazard:9", "HAZMAT_Class_9_Miscellaneous" },

        // Subsidiary risk labels (same sprites, different item ID)
        { "subsidiary-risk:1.1", "HAZMAT_Class_1.1" },
        { "subsidiary-risk:1.2", "HAZMAT_Class_1.2" },
        { "subsidiary-risk:1.3", "HAZMAT_Class_1.3" },
        { "subsidiary-risk:1.4", "HAZMAT_Class_1.4" },
        { "subsidiary-risk:1.5", "HAZMAT_Class_1.5" },
        { "subsidiary-risk:1.6", "HAZMAT_Class_1.6" },
        { "subsidiary-risk:2.1", "HAZMAT_Class_2.1_Flammable_Gas" },
        { "subsidiary-risk:2.2", "HAZMAT_Class_2.2_Non-Flammable_Gas" },
        { "subsidiary-risk:2.3", "HAZMAT_Class_2.3_Poison_Gas" },
        { "subsidiary-risk:3", "HAZMAT_Class_3_Flammable_Liquids" },
        { "subsidiary-risk:4.1", "HAZMAT_Class_4.1_Flammable_Solid" },
        { "subsidiary-risk:4.2", "HAZMAT_Class_4.2_Spontaneously_Combustible" },
        { "subsidiary-risk:4.3", "HAZMAT_Class_4.3_Dangerous_When_Wet" },
        { "subsidiary-risk:5.1", "HAZMAT_Class_5.1_Oxidizer" },
        { "subsidiary-risk:5.2", "HAZMAT_Class_5.2_Organic_Peroxide" },
        { "subsidiary-risk:6.1", "HAZMAT_Class_6.1_Poison" },
        { "subsidiary-risk:6.2", "HAZMAT_Class_6.2_Infectious_Substance" },
        { "subsidiary-risk:7", "HAZMAT_Class_7_Radioactive" },
        { "subsidiary-risk:8", "HAZMAT_Class_8_Corrosive" },
        { "subsidiary-risk:9", "HAZMAT_Class_9_Miscellaneous" },

        // Special labels (value-independent)
        { "military-shipping-label:", "military-shipping-label" },
        { "magnetized-material:", "magnetized-material" },
        { "cargo-aircraft-only:", "cargo-aircraft-only" },
    };

    /// <summary>
    /// Resolves the actual sprite resource name for a label/marking.
    /// Handles the broken passthrough where label.value (e.g., "3") doesn't
    /// match the resource filename (e.g., "HAZMAT_Class_3_Flammable_Liquids").
    /// </summary>
    public static string ResolveLabelSprite(string itemId, string value)
    {
        string key = itemId + ":" + (value ?? "");
        if (LabelSpriteMap.TryGetValue(key, out string spriteName))
            return spriteName;
        // Fallback: try value directly (works for marking sprites where id == filename)
        if (!string.IsNullOrEmpty(value))
            return value;
        return itemId;
    }

    private static ItemPlacementRule GetRule(string itemCategory)
    {
        for (int i = 0; i < PlacementRules.Length; i++)
        {
            if (PlacementRules[i].itemCategory == itemCategory)
                return PlacementRules[i];
        }
        // Unknown item — use fallback rule so required DG markings are never silently dropped
        Debug.LogWarning($"[LayoutEngine] No placement rule for '{itemCategory}', using fallback");
        var fallback = FallbackRule;
        fallback.itemCategory = itemCategory;
        return fallback;
    }
```

**Note:** `GetRule` now returns a non-nullable `ItemPlacementRule` — unknown items get the fallback rule instead of being silently dropped. The `LabelSpriteMap` entries should be verified against the actual filenames in `Assets/Resources/Labels/` during Task 8 tuning.

**Step 2: Verify compilation**

Open Unity Editor, check Console for zero errors.

**Step 3: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity"
git add "Unity Projects/HazProModeling/Assets/Scripts/PackageLayoutEngine.cs"
git commit -m "feat: add placement rules, sprite name resolver, and fallback rule"
```

---

## Task 4: Implement NormalizedToWorld Conversion

**Files:**
- Modify: `Assets/Scripts/PackageLayoutEngine.cs`

**Step 1: Add the coordinate conversion function**

Append inside `PackageLayoutEngine` class after the `GetRule` method:

```csharp
    // ─── Coordinate Conversion ───

    /// <summary>
    /// Converts normalized coordinates to world-space position.
    /// Derives isBackSide from zone.side rather than a separate parameter.
    /// </summary>
    private static PlacedItem NormalizedToWorld(
        float normCenterX, float normCenterY,
        float normSizeX, float normSizeY,
        PackageGeometry geo, PlacementZone zone)
    {
        bool isBackSide = zone.side == "back";
        float worldX = Mathf.Lerp(geo.surfaceMinX, geo.surfaceMaxX, normCenterX);
        float worldY = Mathf.Lerp(geo.surfaceMinY, geo.surfaceMaxY, normCenterY);
        float worldZ = isBackSide ? geo.backSideZ : geo.surfaceZ;
        float rotY = isBackSide ? geo.backSideRotationY : 0f;

        float surfaceWidth = geo.surfaceMaxX - geo.surfaceMinX;
        float surfaceHeight = geo.surfaceMaxY - geo.surfaceMinY;

        return new PlacedItem
        {
            position = new Vector3(worldX, worldY, worldZ),
            rotationY = rotY,
            cylinderRadius = isBackSide ? -geo.cylinderRadius : geo.cylinderRadius,
            worldSizeX = normSizeX * surfaceWidth,
            worldSizeY = normSizeY * surfaceHeight,
            side = zone.side
        };
    }
```

**Step 2: Verify compilation**

Open Unity Editor, check Console for zero errors.

**Step 3: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity"
git add "Unity Projects/HazProModeling/Assets/Scripts/PackageLayoutEngine.cs"
git commit -m "feat: add NormalizedToWorld coordinate conversion (zone-derived side)"
```

---

## Task 5: Implement the Layout Algorithm

**Files:**
- Modify: `Assets/Scripts/PackageLayoutEngine.cs`

**Step 1: Add the main layout method**

Append inside `PackageLayoutEngine` class after the `NormalizedToWorld` method:

```csharp
    // ─── Layout Algorithm ───

    /// <summary>
    /// Main entry point. Takes a list of items to place and the model type,
    /// returns a list of placed items with world-space positions.
    /// Uses AABB overlap detection and strict constraint enforcement.
    /// </summary>
    public static List<PlacedItem> Layout(List<LayoutItem> items, string modelType)
    {
        var result = new List<PlacedItem>();

        PackageGeometry? geoNullable = GetGeometry(modelType);
        if (geoNullable == null)
        {
            Debug.LogWarning($"[LayoutEngine] Unknown model type: {modelType}");
            return result;
        }
        PackageGeometry geo = geoNullable.Value;

        // Track Y cursor per zone (starts at top of each zone)
        var zoneCursors = new Dictionary<string, float>();
        for (int i = 0; i < Zones.Length; i++)
        {
            zoneCursors[Zones[i].zoneName] = Zones[i].normalizedMaxY;
        }

        // Global list of placed AABBs for cross-zone overlap detection
        var placedRects = new List<PlacedRect>();

        // Build (item, rule) pairs and sort by priority descending
        var sortedItems = new List<(LayoutItem item, ItemPlacementRule rule)>();
        foreach (var item in items)
        {
            ItemPlacementRule rule = GetRule(item.id);
            sortedItems.Add((item, rule));
        }
        sortedItems.Sort((a, b) => b.rule.priority.CompareTo(a.rule.priority));

        // Pre-process OppositeSides constraints
        var oppositeSideItems = new Dictionary<string, string>(); // itemA -> backZone
        foreach (var constraint in Constraints)
        {
            if (constraint.type == ConstraintType.OppositeSides)
            {
                oppositeSideItems[constraint.itemA] = constraint.placementB;
            }
        }

        // Track placements for SameSide constraints
        var sameSidePlacements = new Dictionary<string, string>(); // itemId -> placed zone name

        // Place each item
        foreach (var (item, rule) in sortedItems)
        {
            // Handle OppositeSides: place front and back copies
            if (oppositeSideItems.ContainsKey(item.id))
            {
                // Place side 1 (front)
                PlacedItem? frontPlaced = TryPlaceInZones(
                    item, rule, geo, zoneCursors, placedRects, sameSidePlacements);
                if (frontPlaced.HasValue)
                {
                    result.Add(frontPlaced.Value);
                }

                // Place side 2 (back) — use the constraint's back zone
                string backZoneName = oppositeSideItems[item.id];
                PlacedItem? backPlaced = TryPlaceInSpecificZone(
                    item, rule, geo, zoneCursors, placedRects, backZoneName);
                if (backPlaced.HasValue)
                {
                    var backItem = backPlaced.Value;
                    backItem.item.id = item.id + "-side2";
                    result.Add(backItem);
                }
                continue;
            }

            // Handle SameSide constraint (itemB must follow itemA's zone column)
            string[] zonesToTry = rule.preferredZones;
            foreach (var constraint in Constraints)
            {
                if (constraint.type == ConstraintType.SameSide && item.id == constraint.itemB)
                {
                    if (sameSidePlacements.TryGetValue(constraint.itemA, out string aZone))
                    {
                        string column = ExtractColumn(aZone);
                        var filtered = rule.preferredZones
                            .Where(z => ExtractColumn(z) == column)
                            .ToArray();

                        // Strict enforcement: only allow same-column zones
                        if (filtered.Length > 0)
                            zonesToTry = filtered;
                        else
                        {
                            // Column has no matching preferred zones — try ALL zones in that column
                            zonesToTry = Zones
                                .Where(z => z.side == "front" && ExtractColumn(z.zoneName) == column)
                                .Select(z => z.zoneName)
                                .ToArray();
                        }
                    }
                }
            }

            var overrideRule = rule;
            overrideRule.preferredZones = zonesToTry;

            PlacedItem? placed = TryPlaceInZones(item, overrideRule, geo, zoneCursors, placedRects, sameSidePlacements);
            if (placed.HasValue)
            {
                result.Add(placed.Value);
            }
            else
            {
                Debug.LogWarning($"[LayoutEngine] Could not place item: {item.id} (all zones full)");
            }
        }

        return result;
    }

    private static PlacedItem? TryPlaceInZones(
        LayoutItem item, ItemPlacementRule rule,
        PackageGeometry geo, Dictionary<string, float> zoneCursors,
        List<PlacedRect> placedRects,
        Dictionary<string, string> sameSidePlacements)
    {
        foreach (string zoneName in rule.preferredZones)
        {
            PlacedItem? placed = TryPlaceInSpecificZone(item, rule, geo, zoneCursors, placedRects, zoneName);
            if (placed.HasValue)
            {
                sameSidePlacements[item.id] = zoneName;
                return placed;
            }
        }
        return null;
    }

    private static PlacedItem? TryPlaceInSpecificZone(
        LayoutItem item, ItemPlacementRule rule,
        PackageGeometry geo, Dictionary<string, float> zoneCursors,
        List<PlacedRect> placedRects, string zoneName)
    {
        PlacementZone? zoneNullable = GetZone(zoneName);
        if (zoneNullable == null) return null;
        PlacementZone zone = zoneNullable.Value;

        if (!zoneCursors.ContainsKey(zoneName)) return null;

        float cursor = zoneCursors[zoneName];
        float itemHeight = rule.sizeY;
        float newCursor = cursor - itemHeight - ZONE_PADDING;

        // Check if item fits vertically within zone
        if (newCursor < zone.normalizedMinY - ZONE_PADDING)
            return null;

        // Compute candidate center and AABB
        float centerX = (zone.normalizedMinX + zone.normalizedMaxX) / 2f;
        float centerY = cursor - (itemHeight / 2f);
        float halfW = rule.sizeX / 2f;
        float halfH = itemHeight / 2f;

        var candidateRect = new PlacedRect
        {
            minX = centerX - halfW,
            minY = centerY - halfH,
            maxX = centerX + halfW,
            maxY = centerY + halfH
        };

        // Check for cross-zone overlap against all previously placed items
        if (OverlapsAny(candidateRect, placedRects))
            return null;

        // Place the item
        zoneCursors[zoneName] = newCursor;
        placedRects.Add(candidateRect);

        // Convert to world coordinates — derive isBack from zone.side
        PlacedItem placed = NormalizedToWorld(centerX, centerY, rule.sizeX, rule.sizeY, geo, zone);
        placed.item = item;
        return placed;
    }

    private static string ExtractColumn(string zoneName)
    {
        // "front-top-left" -> "left", "back-mid-right" -> "right"
        if (zoneName.EndsWith("left")) return "left";
        if (zoneName.EndsWith("right")) return "right";
        return "center";
    }
```

**Step 2: Verify compilation**

Open Unity Editor, check Console for zero errors.

**Step 3: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity"
git add "Unity Projects/HazProModeling/Assets/Scripts/PackageLayoutEngine.cs"
git commit -m "feat: implement layout algorithm with AABB overlap detection and strict constraints"
```

---

## Task 6: Add Toggle and Bridge Method in DataFromReact.cs

**Files:**
- Modify: `Assets/Scripts/DataFromReact.cs`

This task adds the `useLayoutEngine` toggle and a new method that converts incoming markings/labels into `LayoutItem`s, runs the engine, and calls the existing rendering methods. Key changes from original plan:
- Uses `PackageLayoutEngine.ResolveLabelSprite()` for sprite names
- Treats `lithium-battery-excepted-quantity` as a simple sprite (no special render type — the existing code only logs metadata, never renders it as text)
- POP marking renders both text + UN symbol within the composite footprint

**Step 1: Add the toggle field**

In `DataFromReact.cs`, after line 12 (`private string modelType;`), add:

```csharp
    [Header("Layout Engine")]
    public bool useLayoutEngine = false;
```

**Step 2: Add the bridge method**

Add this new method to `DataFromReact.cs`. Place it after the `ProcessPackageData` method (after line ~1918). This method converts the parsed JSON arrays into `LayoutItem`s, calls the engine, and renders each placed item:

```csharp
    // ─── Layout Engine Bridge ───

    private void ProcessAllItemsWithEngine(
        DataFromReact.JsonRequiredMarking[] markings,
        DataFromReact.JsonRequiredLabel[] labels,
        string originalMarkingsJson)
    {
        var layoutItems = new List<PackageLayoutEngine.LayoutItem>();

        // --- Pre-process markings (same modifier logic as original) ---
        bool hasReportableQuantity = false;
        string technicalNameValue = null;

        if (markings != null)
        {
            for (int i = 0; i < markings.Length; i++)
            {
                if (markings[i].id == "reportable-quantity")
                    hasReportableQuantity = true;
                if (markings[i].id == "technical-name" && !string.IsNullOrEmpty(markings[i].value))
                    technicalNameValue = markings[i].value;
            }
        }

        // --- Convert markings to LayoutItems ---
        if (markings != null)
        {
            for (int i = 0; i < markings.Length; i++)
            {
                var m = markings[i];

                // Skip modifier-only markings (folded into PSN)
                if (m.id == "reportable-quantity" || m.id == "technical-name")
                    continue;

                // Apply modifiers to PSN
                if (m.id == "proper-shipping-name-unid")
                {
                    if (hasReportableQuantity)
                        m.value = "RQ, " + m.value;
                    if (technicalNameValue != null)
                        m.value = AppendTechnicalNameToPSN(m.value, technicalNameValue);
                }

                var layoutItem = new PackageLayoutEngine.LayoutItem
                {
                    id = m.id,
                    spriteName = m.id, // marking sprites use id as filename (works correctly)
                    text = !string.IsNullOrEmpty(m.value) ? m.value : m.label,
                    hasBackground = true,
                    textSize = 0.8f,
                };

                // Determine render type
                if (m.renderType == "pop" && m.id == "pop-marking")
                {
                    layoutItem.renderType = PackageLayoutEngine.RenderType.PopMarking;
                    string individualJson = ExtractMarkingJson(originalMarkingsJson, i);
                    layoutItem.metadata = ExtractPOPMetadata(individualJson);
                }
                else if (m.id == "orientation-arrows")
                {
                    layoutItem.renderType = PackageLayoutEngine.RenderType.OrientationArrows;
                    layoutItem.spriteName = (m.value == "red") ? "orientation-arrows-red" : "orientation-arrows";
                }
                else if (ShouldRenderMarkingAsSprite(m.id))
                {
                    layoutItem.renderType = PackageLayoutEngine.RenderType.Sprite;
                    // Marking sprites: id == resource filename (correct)
                }
                else
                {
                    layoutItem.renderType = PackageLayoutEngine.RenderType.Text;
                }

                layoutItems.Add(layoutItem);
            }
        }

        // --- Convert labels to LayoutItems ---
        if (labels != null)
        {
            foreach (var l in labels)
            {
                // Use sprite name resolver to fix broken value -> filename mapping
                string spriteName = PackageLayoutEngine.ResolveLabelSprite(l.id, l.value);

                if (string.IsNullOrEmpty(spriteName))
                    continue;

                layoutItems.Add(new PackageLayoutEngine.LayoutItem
                {
                    id = l.id,
                    renderType = PackageLayoutEngine.RenderType.Sprite,
                    spriteName = spriteName,
                });
            }
        }

        // --- Run layout engine ---
        var placedItems = PackageLayoutEngine.Layout(layoutItems, modelType);

        SendMessageToReact($"[LayoutEngine] Placed {placedItems.Count} items on {modelType}");

        // --- Render each placed item ---
        foreach (var placed in placedItems)
        {
            switch (placed.item.renderType)
            {
                case PackageLayoutEngine.RenderType.Sprite:
                case PackageLayoutEngine.RenderType.OrientationArrows:
                    CreateSprite(new JsonLabel
                    {
                        name = placed.item.spriteName,
                        position_x = placed.position.x,
                        position_y = placed.position.y,
                        position_z = placed.position.z,
                        size_x = placed.worldSizeX,
                        size_y = placed.worldSizeY,
                        cylinderRadius = placed.cylinderRadius,
                        rotation_y = placed.rotationY,
                    });
                    break;

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

                case PackageLayoutEngine.RenderType.PopMarking:
                    var popMeta = placed.item.metadata as POPMetadata;
                    if (popMeta != null)
                    {
                        string popText = BuildPOPMarkingText(popMeta);
                        // POP is a composite item: UN symbol on the left, text on the right
                        // Both rendered within the allocated footprint
                        float unSymbolWidth = placed.worldSizeY * 0.8f; // square, sized to height
                        float textOffsetX = unSymbolWidth * 0.6f;

                        // UN symbol — left portion of allocated space
                        CreateSprite(new JsonLabel
                        {
                            name = "un",
                            position_x = placed.position.x - (placed.worldSizeX / 2f) + (unSymbolWidth / 2f),
                            position_y = placed.position.y,
                            position_z = placed.position.z,
                            size_x = unSymbolWidth,
                            size_y = unSymbolWidth,
                            cylinderRadius = placed.cylinderRadius,
                            rotation_y = placed.rotationY,
                        });

                        // POP text — right portion of allocated space
                        CreateTextObject(new JsonText
                        {
                            labelText = popText,
                            position_x = placed.position.x + textOffsetX,
                            position_y = placed.position.y,
                            position_z = placed.position.z,
                            textSize = placed.item.textSize,
                            hasBackground = true,
                            cylinderRadius = placed.cylinderRadius,
                            rotation_y = placed.rotationY,
                        });
                    }
                    break;
            }
        }
    }
```

**Step 3: Verify compilation**

Open Unity Editor, check Console for zero errors.

**Step 4: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity"
git add "Unity Projects/HazProModeling/Assets/Scripts/DataFromReact.cs"
git commit -m "feat: add layout engine bridge with sprite name resolution and composite POP"
```

---

## Task 7: Wire Up the Toggle in GetRequiredMarkings and GetRequiredLabels

**Files:**
- Modify: `Assets/Scripts/DataFromReact.cs`

The goal is to make `GetRequiredMarkings` and `GetRequiredLabels` accumulate their data, and when both have been received, call either the old path or the new engine based on the toggle. The buffering approach clears the opposite buffer on receipt of each message to prevent stale cross-contamination (no correlation IDs exist in the Unity bridge).

**Step 1: Add buffer fields**

After the `useLayoutEngine` field (added in Task 6), add:

```csharp
    // Buffers for layout engine — accumulates data until both markings + labels arrive
    // On receipt of either message, the opposite buffer is cleared to prevent stale data mixing.
    private JsonRequiredMarking[] _pendingMarkings;
    private string _pendingMarkingsJson;
    private JsonRequiredLabel[] _pendingLabels;
    private bool _markingsReceived;
    private bool _labelsReceived;
    private float _bufferTimestamp;
    private const float BUFFER_TIMEOUT_SECONDS = 2f;
```

**Step 2: Add the flush method**

After the `ProcessAllItemsWithEngine` method, add:

```csharp
    private void TryFlushLayoutEngine()
    {
        // Only run when both markings and labels have arrived
        if (!_markingsReceived || !_labelsReceived)
        {
            // Start timeout if first message just arrived
            _bufferTimestamp = Time.time;
            return;
        }

        // Clear previous rendering
        ClearObjects(activeTexts);
        ClearObjects(activeSprites);
        ClearObjects(activeLithiumExceptedTexts);

        ProcessAllItemsWithEngine(_pendingMarkings, _pendingLabels, _pendingMarkingsJson);

        // Reset buffers
        _markingsReceived = false;
        _labelsReceived = false;
        _pendingMarkings = null;
        _pendingLabels = null;
        _pendingMarkingsJson = null;
    }

    private void Update()
    {
        // Safety timeout: if only one buffer is populated for too long, flush anyway
        if (useLayoutEngine && (_markingsReceived != _labelsReceived) &&
            (Time.time - _bufferTimestamp > BUFFER_TIMEOUT_SECONDS))
        {
            Debug.LogWarning("[LayoutEngine] Buffer timeout — flushing with partial data");
            // Treat missing buffer as empty
            if (!_markingsReceived) { _markingsReceived = true; _pendingMarkings = new JsonRequiredMarking[0]; }
            if (!_labelsReceived) { _labelsReceived = true; _pendingLabels = new JsonRequiredLabel[0]; }
            TryFlushLayoutEngine();
        }
    }
```

**Note:** If `DataFromReact` already has an `Update()` method, add the timeout check inside it instead of creating a new one.

**Step 3: Modify GetRequiredMarkings**

In the `GetRequiredMarkings` method (line ~381), wrap the existing processing in the toggle. Find the line:

```csharp
            SendMessageToReact($"Processing {wrapper.array.Length} markings");
```

Replace everything from that line through the end of the try block (before the `catch`) with:

```csharp
            SendMessageToReact($"Processing {wrapper.array.Length} markings");

            if (useLayoutEngine)
            {
                _pendingMarkings = wrapper.array;
                _pendingMarkingsJson = json;
                _markingsReceived = true;
                // Clear stale labels from a previous request (no correlation IDs)
                _labelsReceived = false;
                _pendingLabels = null;
                TryFlushLayoutEngine();
                return;
            }

            // --- Original path (unchanged) ---
```

The existing if/else code stays below this new block, indented inside the `if (!useLayoutEngine)` path (or more precisely, the `return` above skips it).

**Step 4: Modify GetRequiredLabels**

In the `GetRequiredLabels` method (line ~550), similarly. Find:

```csharp
            SendMessageToReact($"Processing {wrapper.array.Length} required labels");
```

Replace everything from that line through the end of the try block with:

```csharp
            SendMessageToReact($"Processing {wrapper.array.Length} required labels");

            if (useLayoutEngine)
            {
                _pendingLabels = wrapper.array;
                _labelsReceived = true;
                // Clear stale markings from a previous request (no correlation IDs)
                _markingsReceived = false;
                _pendingMarkings = null;
                _pendingMarkingsJson = null;
                TryFlushLayoutEngine();
                return;
            }

            // --- Original path (unchanged) ---
```

**Wait — this creates a problem.** If markings arrive first and we clear markings when labels arrive, we'd lose the markings we just received. The correct approach:

Actually, the clearing should work like this: when markings arrive, DON'T clear labels (they might be from the same request about to arrive). When labels arrive, DON'T clear markings. Instead, both just set their flag and try to flush. The timeout handles the stale data case — after 2 seconds of only one buffer populated, flush with what we have.

**Corrected Step 3: Modify GetRequiredMarkings**

```csharp
            SendMessageToReact($"Processing {wrapper.array.Length} markings");

            if (useLayoutEngine)
            {
                _pendingMarkings = wrapper.array;
                _pendingMarkingsJson = json;
                _markingsReceived = true;
                TryFlushLayoutEngine();
                return;
            }

            // --- Original path (unchanged) ---
```

**Corrected Step 4: Modify GetRequiredLabels**

```csharp
            SendMessageToReact($"Processing {wrapper.array.Length} required labels");

            if (useLayoutEngine)
            {
                _pendingLabels = wrapper.array;
                _labelsReceived = true;
                TryFlushLayoutEngine();
                return;
            }

            // --- Original path (unchanged) ---
```

The timeout in `Update()` handles the edge case where one message never arrives. The flush method resets both buffers after processing, so stale data from a previous request can't persist.

**Step 5: Verify compilation**

Open Unity Editor, check Console for zero errors.

**Step 6: Visual test — toggle OFF (regression check)**

1. Open the `PackageModel` scene
2. Select the `ReactToUnity` GameObject in the Hierarchy
3. In the Inspector, verify `Use Layout Engine` is **unchecked**
4. Use `EditorTestData` to spawn a box with some test markings/labels
5. Verify everything renders exactly as before (no regression)

**Step 7: Visual test — toggle ON**

1. Check `Use Layout Engine` in the Inspector
2. Use `EditorTestData` to spawn a box with: primary-hazard (3), subsidiary-risk (6.1), military-shipping-label, proper-shipping-name-unid
3. Verify: items appear on the package surface without overlapping
4. Verify: primary hazard is above subsidiary risk on the left side
5. Verify: MSL is on the right side
6. Verify: hazard label sprites load correctly (not blank — confirms sprite name resolution works)

**Step 8: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity"
git add "Unity Projects/HazProModeling/Assets/Scripts/DataFromReact.cs"
git commit -m "feat: wire layout engine toggle with buffering and timeout safety"
```

---

## Task 8: Tune Geometry Values and Verify Sprite Names

**Files:**
- Modify: `Assets/Scripts/PackageLayoutEngine.cs`

This task is iterative. Use the Unity Editor with `EditorTestData.cs` to spawn each package type and adjust the `PackageGeometry` bounds until items appear correctly on the surface. Also verify the `LabelSpriteMap` entries match actual resource filenames.

**Step 1: Verify sprite name mappings**

List the actual files in `Assets/Resources/Labels/` and `Assets/Resources/Markings/`. For each entry in `LabelSpriteMap`, confirm the sprite name matches a file (without extension). Update any mismatches.

**Step 2: Test and tune each package type**

For each of the 5 package types (box, drum, jerrican, bag, barrel):

1. In `EditorTestData`, set the package code to one that maps to this type (e.g., `4G` for box, `1A1` for drum, `3A1` for jerrican, `5H1` for bag, `2C1` for barrel)
2. Enable `useLayoutEngine` on `ReactToUnity`
3. Spawn the package + a set of test markings/labels
4. Observe where items appear — they should be on the visible surface, not floating in space or clipping through the model
5. Adjust `surfaceMinX`, `surfaceMaxX`, `surfaceMinY`, `surfaceMaxY`, `surfaceZ` in the `Geometries` dictionary until items sit correctly on the surface
6. For drums/barrels: verify curvature looks correct (text/sprites wrap around the cylinder)

**Key things to check per package:**
- Items don't clip through the model
- Items don't float far from the surface
- Left-side items appear on the left half of the visible front face
- Right-side items appear on the right half
- Top-row items are near the top, bottom-row near the bottom
- On cylindrical packages, items at the edges wrap naturally
- Hazard class label sprites actually load (not blank) — confirms sprite name resolution

**Step 3: Adjust zone boundaries if needed**

If items are too bunched at the top or bottom, adjust `ZONE_ROW_TOP` and `ZONE_ROW_MID` constants. For example, if markings cluster too tightly in the middle row, increase `ZONE_ROW_TOP` from 0.6 to 0.65.

**Step 4: Adjust item sizes if needed**

If labels appear too large or too small, adjust the `sizeX`/`sizeY` values in the `PlacementRules` table.

**Step 5: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity"
git add "Unity Projects/HazProModeling/Assets/Scripts/PackageLayoutEngine.cs"
git commit -m "tune: adjust geometry bounds, sprite names, and zone sizes for all 5 package types"
```

---

## Task 9: Validate Test Cases

**Files:** None (visual testing only)

Run these specific scenarios with `useLayoutEngine = true` and verify visually:

**Test 1: UN2719 (Barium Bromate) — box (4G)**
- Expected markings: PSN+UN, POP marking
- Expected labels: MSL, primary hazard (5.1), subsidiary risk (6.1), cargo-aircraft-only
- Verify: primary hazard (5.1) is above subsidiary risk (6.1) on same side
- Verify: POP marking with UN symbol appears at bottom, both elements within footprint
- Verify: hazard label sprites load correctly (HAZMAT_Class_5.1_Oxidizer, HAZMAT_Class_6.1_Poison)

**Test 2: UN1093 (Acrylonitrile) — drum (1A1)**
- Expected labels: primary hazard (3), subsidiary risk (6.1)
- Verify: class 3 label above class 6.1 label, same side, on curved surface
- Verify: sprite names resolve correctly on cylindrical surface

**Test 3: UN2334 (Allylamine) — drum (1A1)**
- Expected labels: primary hazard (6.1), subsidiary risk (3)
- Verify: class 6.1 label above class 3 label, same side (flipped from test 2)

**Test 4: Orientation arrows — box (4G)**
- Add orientation-arrows marking
- Verify: one arrow on front face (top-right area), one on back face (visible when rotated)

**Test 5: Kitchen sink — box (4G)**
- Add all of: PSN+UN, POP, primary hazard, subsidiary risk, MSL, cargo-aircraft-only, lithium-battery-marking, overpack
- Verify: nothing overlaps (AABB detection working), all items visible, layout looks reasonable

**Test 6: Repeat Test 5 on drum (1A1), jerrican (3A1), bag (5H1), barrel (2C1)**
- Verify: same items render correctly on each package type with no changes needed

**Test 7: Unknown item fallback**
- Add a marking with an id not in the placement rules (e.g., "test-unknown-marking")
- Verify: it still renders (in a bottom zone), a warning appears in console

After all tests pass, commit any final tuning:

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity"
git add "Unity Projects/HazProModeling/Assets/Scripts/PackageLayoutEngine.cs"
git commit -m "tune: final adjustments after validation across all package types"
```

---

## Task 10: Delete Old Positioning Code

**Files:**
- Modify: `Assets/Scripts/DataFromReact.cs`

Only do this after Task 9 passes. Remove the old if/else positioning code.

**Step 1: Set `useLayoutEngine = true` as default**

Change the field declaration to:
```csharp
    public bool useLayoutEngine = true;
```

**Step 2: Remove old per-package branches**

Delete the per-package-type if/else blocks from these methods:
- `ProcessRequiredMarking` — the giant if/else for box/drum/jerrican/bag/barrel x each marking ID (lines ~690-920)
- `RenderMarkingAsSprite` — per-package-type sprite positioning (lines ~940-1144)
- `RenderOrientationArrows` — per-package-type arrow positioning (lines ~1147-1266)
- `RenderLithiumBatteryExceptedQuantityMarking` — per-package-type positioning (lines ~1268-1334)
- `RenderPOPMarking` — per-package-type POP positioning (lines ~1337-1407)
- `CreateUNLabel` — per-package-type UN label positioning (lines ~1411-1497)
- `ProcessRequiredLabel` — per-package-type label positioning (lines ~1549-1813)

Replace each method body with a simple delegation or remove entirely (since the layout engine bridge method handles everything).

**Step 3: Remove the toggle and buffer fields**

Remove `useLayoutEngine`, `_pendingMarkings`, `_pendingLabels`, etc. Make the engine path the only path.

**Step 4: Clean up `GetRequiredMarkings` and `GetRequiredLabels`**

Remove the `if (useLayoutEngine)` branches. Make the engine path the default (buffer markings, buffer labels, flush when both arrive).

**Step 5: Verify compilation and visual test**

1. Open Unity Editor, verify zero compilation errors
2. Run all 7 test cases from Task 9 again
3. Verify identical visual results

**Step 6: Commit**

```bash
cd "/Users/codyschexnider/Documents/Technergetics/haz-pro-mobile-unity"
git add "Unity Projects/HazProModeling/Assets/Scripts/DataFromReact.cs"
git commit -m "refactor: remove old per-package positioning code, layout engine is now default"
```

---

## Amendments from Code Review

This plan incorporates fixes for the following code review findings:

| # | Severity | Finding | Resolution |
|---|----------|---------|------------|
| 1 | Critical | Buffering can mix data from different requests (no correlation IDs) | Timeout-based flush after 2s; both buffers reset after each flush |
| 2 | Critical | Label sprite names broken (`label.value` doesn't match resource filenames) | Added `LabelSpriteMap` + `ResolveLabelSprite()` in Task 3, used in Task 6 bridge |
| 3 | High | Constraints are best-effort, not guaranteed | Strict column enforcement in Task 5 — tries ALL zones in constrained column |
| 4 | High | No cross-zone overlap prevention | Added `PlacedRect` AABB checks in Task 1 + Task 5 |
| 5 | High | Text treated as fixed-size but is variable length | Sized generously in placement rules; TMP auto-sizing handles overflow within allocated space |
| 6 | High | POP + UN symbol is a composite not tracked in layout occupancy | POP `sizeX` increased to 0.5 to encompass both elements; bridge renders within footprint (Task 6) |
| 7 | High | Unknown items silently dropped | `FallbackRule` in Task 3 — unknown items placed in bottom zones with warning |
| 8 | Medium | `isBack` passed as arg instead of derived from zone metadata | `NormalizedToWorld` now takes `PlacementZone` and derives `isBack` from `zone.side` (Task 4) |
| 9 | Medium | Lithium-excepted metadata extracted but unused | Removed `LithiumExcepted` render type — treated as simple sprite (Task 1, Task 6) |
| 10 | Medium | POP UN symbol rendered outside allocated footprint | Composite rendering within allocated space (Task 6) |
| 11 | Medium | Uniform zones ignore geometry-specific unusable regions | Tunable during Task 8; zone boundaries are constants that can be per-package if needed |
| 12 | Medium | Side selection depends on isBack arg | Fixed — derived from zone metadata (Task 4) |
| 13 | Medium | No reproducible invariant checks | Task 9 adds 7 specific visual test cases including unknown-item fallback |

---

## Summary

| Task | Description | Estimated effort |
|------|-------------|-----------------|
| 1 | Data structures + AABB overlap types | Small |
| 2 | Geometries + zones | Small |
| 3 | Placement rules + constraints + sprite resolver + fallback rule | Medium |
| 4 | NormalizedToWorld (zone-derived side) | Small |
| 5 | Layout algorithm with AABB overlap + strict constraints | Medium |
| 6 | Toggle + bridge with sprite resolution + composite POP | Medium |
| 7 | Wire toggle with buffering + timeout safety | Medium |
| 8 | Tune geometry values + verify sprite names (iterative) | Medium-Large |
| 9 | Validate test cases (7 scenarios) | Medium |
| 10 | Delete old code | Medium |

Tasks 1-7 are code-writing. Task 8 is the main tuning effort. Task 9 is validation. Task 10 is cleanup.
