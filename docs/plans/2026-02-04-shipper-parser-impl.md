# Shipper Block Parser Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rewrite `parseShipperInfo` in `InteractiveSDDGForm.tsx` to handle all SDDG shipper block variations without losing data. Replace rigid 3-slot parsing (name/street/city) with flexible line-by-line extraction that detects phone/DSN and renders all remaining lines dynamically.

**Architecture:** Extract phone and DSN from the raw text (labeled or standalone), treat everything else as address lines rendered in order. No fixed slot assumptions, no data loss.

**Tech Stack:** TypeScript, React Native

**Design doc:** `docs/plans/2026-02-04-shipper-parser-design.md`

---

### Task 1: Write failing tests for the new parseShipperInfo

**Files:**
- Create: `src/components/Inspector/__tests__/parseShipperInfo.test.ts`
- Modify: `src/components/Inspector/InteractiveSDDGForm.tsx` (export the function)

**Step 1: Export parseShipperInfo for testing**

In `src/components/Inspector/InteractiveSDDGForm.tsx`, change the function declaration from:

```typescript
const parseShipperInfo = (shipper: string) => {
```

to:

```typescript
export const parseShipperInfo = (shipper: string): ShipperInfo => {
```

Also add the type definition before the function (after the existing `parseNameOfSignatory` function, around line 60):

```typescript
export interface ShipperInfo {
  addressLines: string[];
  phone: string;
  dsn: string;
}
```

**Step 2: Create the test file**

Create `src/components/Inspector/__tests__/parseShipperInfo.test.ts`:

```typescript
import { parseShipperInfo } from "../InteractiveSDDGForm";

describe("parseShipperInfo", () => {
  it("should extract labeled phone and DSN (PHONE NUMBER: / DSN: format)", () => {
    const input = [
      "FY4484",
      "BLDG 1757 VANDENBERG AVE",
      "MCGUIRE AFB NJ 08641",
      "",
      "PHONE NUMBER:",
      "(609) 754-2665    DSN:    650-2665",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("(609) 754-2665");
    expect(result.dsn).toBe("650-2665");
    expect(result.addressLines).toEqual([
      "FY4484",
      "BLDG 1757 VANDENBERG AVE",
      "MCGUIRE AFB NJ 08641",
    ]);
  });

  it("should extract standalone phone at top of block", () => {
    const input = [
      "(808) 786-2398",
      "DLA DISTRIBUTION PEARL HARBOR",
      "2000 GAFFNEY ST BLDG 1900",
      "PEARL HARBOR USA HI 96860 4518",
      "USA",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("(808) 786-2398");
    expect(result.dsn).toBe("");
    expect(result.addressLines).toEqual([
      "DLA DISTRIBUTION PEARL HARBOR",
      "2000 GAFFNEY ST BLDG 1900",
      "PEARL HARBOR USA HI 96860 4518",
      "USA",
    ]);
  });

  it("should extract standalone phone at bottom (bare 10 digits)", () => {
    const input = [
      "THE BOEING COMPANY",
      "BLDG 598A",
      "2600 NORTH THIRD STREET",
      "ST. CHARLES, MO 63301",
      "U.S.A.",
      "3144612582",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("3144612582");
    expect(result.addressLines).toEqual([
      "THE BOEING COMPANY",
      "BLDG 598A",
      "2600 NORTH THIRD STREET",
      "ST. CHARLES, MO 63301",
      "U.S.A.",
    ]);
  });

  it("should extract standalone phone in middle of block", () => {
    const input = [
      "Wesco/Northlake Hub",
      "4250 DALE EARNHARDT WAY SUITE#100",
      "817-767-4353",
      "76262 NORTHLAKE TX",
      "U.S.A.",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("817-767-4353");
    expect(result.addressLines).toEqual([
      "Wesco/Northlake Hub",
      "4250 DALE EARNHARDT WAY SUITE#100",
      "76262 NORTHLAKE TX",
      "U.S.A.",
    ]);
  });

  it("should extract dash-formatted phone at bottom", () => {
    const input = [
      "NUWC KEYPORT (US NAVY)",
      "610 DOWELL STREET",
      "KEYPORT, WA 98345 US",
      "360-396-2185",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("360-396-2185");
    expect(result.addressLines).toEqual([
      "NUWC KEYPORT (US NAVY)",
      "610 DOWELL STREET",
      "KEYPORT, WA 98345 US",
    ]);
  });

  it("should extract phone at top with dash format", () => {
    const input = [
      "904-542-0156",
      "DLA DISTRIBUTION JACKSONVILLE FL",
      "BLDG 175, SWAN ROAD",
      "NAS JACKSONVILLE    FL    32212 0103",
      "USA",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("904-542-0156");
    expect(result.addressLines).toEqual([
      "DLA DISTRIBUTION JACKSONVILLE FL",
      "BLDG 175, SWAN ROAD",
      "NAS JACKSONVILLE    FL    32212 0103",
      "USA",
    ]);
  });

  it("should handle no phone and no DSN", () => {
    const input = [
      "DF YOUNG INC",
      "176-20 147 AVENUE",
      "JAMAICA, NY 11434",
      "UNITED STATES",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("");
    expect(result.dsn).toBe("");
    expect(result.addressLines).toEqual([
      "DF YOUNG INC",
      "176-20 147 AVENUE",
      "JAMAICA, NY 11434",
      "UNITED STATES",
    ]);
  });

  it("should NOT extract phone embedded in address text", () => {
    // "717 267 8800" is part of the address line, not a standalone phone
    const input = [
      "W39Z LETTERKENNY MUNITIONS CTR",
      "VOELZ GATE EMERGENCY 717 267 8800",
      "CHAMBERSBURG PA  17201-4150",
      "",
      "PHONE NUMBER:",
      "7172675421    DSN:",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("7172675421");
    expect(result.dsn).toBe("");
    expect(result.addressLines).toEqual([
      "W39Z LETTERKENNY MUNITIONS CTR",
      "VOELZ GATE EMERGENCY 717 267 8800",
      "CHAMBERSBURG PA  17201-4150",
    ]);
  });

  it("should handle labeled phone and DSN on same line", () => {
    const input = [
      "N00109 Navy Munitions Command Det Yorktown",
      "Naval Weapons Station Bldg 2037",
      "Yorktown VA 23691-4099",
      "",
      "PHONE NUMBER:",
      "(757) 887-4099                DSN:    953-4099",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("(757) 887-4099");
    expect(result.dsn).toBe("953-4099");
    expect(result.addressLines).toEqual([
      "N00109 Navy Munitions Command Det Yorktown",
      "Naval Weapons Station Bldg 2037",
      "Yorktown VA 23691-4099",
    ]);
  });

  it("should handle no phone/DSN with NAVSUP format", () => {
    const input = [
      "NAVSUP FLTLOGCEN JACKSONVILLE DETACHMENT,",
      "GULFPORT, MS (RIC 4NN)",
      "511 NORTH BROWN AVE, BLDG 437",
      "GULFPORT, MS  39501-5000 UNITED STATES",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("");
    expect(result.dsn).toBe("");
    expect(result.addressLines).toEqual([
      "NAVSUP FLTLOGCEN JACKSONVILLE DETACHMENT,",
      "GULFPORT, MS (RIC 4NN)",
      "511 NORTH BROWN AVE, BLDG 437",
      "GULFPORT, MS  39501-5000 UNITED STATES",
    ]);
  });

  it("should handle empty input", () => {
    const result = parseShipperInfo("");
    expect(result.addressLines).toEqual([]);
    expect(result.phone).toBe("");
    expect(result.dsn).toBe("");
  });

  it("should handle whitespace-only input", () => {
    const result = parseShipperInfo("   \n  \n  ");
    expect(result.addressLines).toEqual([]);
    expect(result.phone).toBe("");
    expect(result.dsn).toBe("");
  });
});
```

**Step 3: Run tests to verify they fail**

Run: `npx jest src/components/Inspector/__tests__/parseShipperInfo.test.ts --verbose`
Expected: FAIL — the current function returns `{ name, street, city, phone, dsn }`, not `{ addressLines, phone, dsn }`.

---

### Task 2: Implement the new parseShipperInfo

**Files:**
- Modify: `src/components/Inspector/InteractiveSDDGForm.tsx:125-183`

**Step 1: Replace the parseShipperInfo function**

Replace the entire `parseShipperInfo` function (and add the `ShipperInfo` interface above it) with:

```typescript
export interface ShipperInfo {
  addressLines: string[];
  phone: string;
  dsn: string;
}

/**
 * Parse shipper block text into address lines + phone/DSN.
 *
 * Handles all SDDG shipper block variations:
 * - Labeled phone/DSN: "PHONE NUMBER:" / "DSN:" with values on same or next line
 * - Standalone phone: line that is purely a phone number (any position)
 * - No phone/DSN: address-only blocks
 *
 * Phone numbers embedded in address text (e.g., "VOELZ GATE EMERGENCY 717 267 8800")
 * are NOT extracted — only lines that are purely a phone number are moved to the phone slot.
 */
export const parseShipperInfo = (shipper: string): ShipperInfo => {
  if (!shipper || shipper.trim() === "") {
    return { addressLines: [], phone: "", dsn: "" };
  }

  const lines = shipper.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  let phone = "";
  let dsn = "";
  const removedIndices = new Set<number>();

  // --- Step 1: Find labeled PHONE NUMBER / DSN section ---
  for (let i = 0; i < lines.length; i++) {
    if (/PHONE\s*NUMBER/i.test(lines[i])) {
      // Phone zone: this line and potentially the next
      const zoneText = lines[i] + " " + (lines[i + 1] || "");

      // Extract phone from zone
      if (!phone) {
        const phoneMatch = zoneText.match(/(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/);
        if (phoneMatch) phone = phoneMatch[1].trim();
        // Also try bare 10+ digits
        if (!phone) {
          const bareMatch = zoneText.match(/\b(\d{7,})\b/);
          if (bareMatch) phone = bareMatch[1];
        }
      }

      // Extract DSN from zone
      if (!dsn) {
        const dsnMatch = zoneText.match(/DSN[:\s]*(\d{3}[-.\s]?\d{4})/i);
        if (dsnMatch) dsn = dsnMatch[1].trim();
      }

      // Mark lines for removal
      removedIndices.add(i);
      if (i + 1 < lines.length) removedIndices.add(i + 1);
      break;
    }
  }

  // --- Step 2: Find standalone DSN (not in phone zone) ---
  if (!dsn) {
    for (let i = 0; i < lines.length; i++) {
      if (removedIndices.has(i)) continue;
      const dsnMatch = lines[i].match(/^DSN[:\s]*(\d{3}[-.\s]?\d{4})\s*$/i);
      if (dsnMatch) {
        dsn = dsnMatch[1].trim();
        removedIndices.add(i);
        break;
      }
    }
  }

  // --- Step 3: Find standalone phone line (if not already found) ---
  // A standalone phone is a line whose ENTIRE content is a phone number pattern.
  if (!phone) {
    const standalonePhonePattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$|^\d{10,}$/;
    for (let i = 0; i < lines.length; i++) {
      if (removedIndices.has(i)) continue;
      if (standalonePhonePattern.test(lines[i])) {
        phone = lines[i];
        removedIndices.add(i);
        break;
      }
    }
  }

  // --- Step 4: Remaining lines → addressLines ---
  const addressLines = lines.filter((_, i) => !removedIndices.has(i));

  return { addressLines, phone, dsn };
};
```

**Step 2: Run tests to verify they pass**

Run: `npx jest src/components/Inspector/__tests__/parseShipperInfo.test.ts --verbose`
Expected: ALL 12 tests pass.

**Step 3: Commit**

```bash
git add src/components/Inspector/InteractiveSDDGForm.tsx src/components/Inspector/__tests__/parseShipperInfo.test.ts
git commit -m "feat: rewrite parseShipperInfo for flexible shipper block parsing

Replace rigid 3-slot (name/street/city) parser with line-by-line
extraction. Detects phone and DSN (labeled or standalone), renders
all remaining lines dynamically. No data loss regardless of line
count or field order."
```

---

### Task 3: Update the JSX rendering to use addressLines

**Files:**
- Modify: `src/components/Inspector/InteractiveSDDGForm.tsx:296-314`

**Step 1: Update the shipper display JSX**

In `src/components/Inspector/InteractiveSDDGForm.tsx`, replace the shipper rendering block (lines 296-314) from:

```jsx
              <View style={styles.boxLeft}>
                <Text style={styles.label}>Shipper</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{shipperInfo.name}</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{shipperInfo.street}</Text>
                <Text style={[styles.text, { paddingLeft: 25 }]}>{shipperInfo.city}</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                  <Text style={styles.text2}>
                    <Text style={[styles.text2, { fontWeight: "600" }]}>
                      PHONE NUMBER:
                    </Text>{" "}
                    {shipperInfo.phone}
                  </Text>
                  <Text style={[styles.text2, { marginLeft: 20 }]}>
                    <Text style={[styles.text2, { fontWeight: "600" }]}>
                      DSN:
                    </Text>{" "}
                    {shipperInfo.dsn}
                  </Text>
                </View>
              </View>
```

to:

```jsx
              <View style={styles.boxLeft}>
                <Text style={styles.label}>Shipper</Text>
                {shipperInfo.addressLines.map((line, i) => (
                  <Text key={i} style={[styles.text, { paddingLeft: 25 }]}>{line}</Text>
                ))}
                {(shipperInfo.phone || shipperInfo.dsn) ? (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                    {shipperInfo.phone ? (
                      <Text style={styles.text2}>
                        <Text style={[styles.text2, { fontWeight: "600" }]}>
                          PHONE NUMBER:
                        </Text>{" "}
                        {shipperInfo.phone}
                      </Text>
                    ) : null}
                    {shipperInfo.dsn ? (
                      <Text style={[styles.text2, { marginLeft: shipperInfo.phone ? 20 : 0 }]}>
                        <Text style={[styles.text2, { fontWeight: "600" }]}>
                          DSN:
                        </Text>{" "}
                        {shipperInfo.dsn}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
              </View>
```

**Step 2: Remove the old default fallback**

The old function returned hardcoded defaults for empty input:
```typescript
name: "TRAFFIC MANAGEMENT FLIGHT",
street: "5236 CHASE ST",
city: "WRIGHT PATTERSON AFB, OH 45433-5501",
```

The new function returns empty `addressLines` for empty input. The display will just show "Shipper" with no content, which is correct — empty extraction should show empty, not fake data.

**Step 3: Run all tests**

Run: `npx jest src/components/Inspector/__tests__/parseShipperInfo.test.ts --verbose`
Expected: ALL pass.

**Step 4: Commit**

```bash
git add src/components/Inspector/InteractiveSDDGForm.tsx
git commit -m "feat: update shipper display to render dynamic address lines

Replace fixed 3-line rendering with dynamic addressLines.map().
Hide PHONE NUMBER and DSN labels when empty."
```
