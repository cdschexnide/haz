# Shipper Block Parser Redesign — Design

**Date:** 2026-02-04
**Branch:** `inspector-persona-testing`

---

## Problem

The current `parseShipperInfo` function in `InteractiveSDDGForm.tsx` (lines 125-183) forces the shipper block into exactly 3 display slots (name, street, city). It:

1. **Drops data** — anything after line 2 is lost (e.g., "USA HI 96860 4518 USA")
2. **Only detects labeled phone numbers** — requires "PHONE NUMBER:" prefix, misses standalone phones like `(808) 786-2398` or `3144612582`
3. **Assumes fixed line order** — breaks when phone is at top, middle, or bottom

Real SDDG shipper blocks have 3-7 lines and phone numbers in any position.

---

## Fix: Line-by-line extraction with dynamic address rendering

### New return type

```typescript
interface ShipperInfo {
  addressLines: string[];  // All non-phone/DSN lines, in original order
  phone: string;           // Extracted phone number (empty if not found)
  dsn: string;             // Extracted DSN number (empty if not found)
}
```

### Parsing algorithm

```
Input: raw shipper string (with \n line breaks from OCR)

1. Split into lines, trim each, filter out empty lines.

2. Labeled phone/DSN extraction:
   - Find any line containing "PHONE NUMBER" (case-insensitive).
   - That line + the next line form the "phone zone".
   - Extract phone pattern from phone zone text.
   - Extract DSN pattern from phone zone text (DSN: followed by digits).
   - Remove phone-zone lines from the list.

3. Standalone phone extraction (if phone not already found):
   - Find a line whose entire content (after trimming) is ONLY a phone
     number pattern — no other text.
   - Phone patterns:
     - (XXX) XXX-XXXX
     - XXX-XXX-XXXX
     - XXXXXXXXXX (10 bare digits)
   - Extract as phone, remove that line from the list.

4. Standalone DSN extraction (if DSN not already found):
   - Find a line matching DSN pattern outside the phone zone.
   - Extract and remove.

5. Remaining lines → addressLines (in original order, no data lost).
```

### Phone number patterns

| Format | Example | Source |
|--------|---------|--------|
| `(XXX) XXX-XXXX` | (808) 786-2398 | Images #13, #15-17 |
| `XXX-XXX-XXXX` | 360-396-2185 | Images #20, #21 |
| `XXXXXXXXXX` | 3144612582 | Images #19, #23 |

Note: `XXX XXX XXXX` with spaces (like `717 267 8800` in "VOELZ GATE EMERGENCY") is NOT matched as standalone because it's embedded in address text. Only lines that are purely a phone number are extracted.

### DSN pattern

`/DSN[:\s]*(\d{3}[-.\s]?\d{4})/i` — always appears with "DSN" label.
Examples: `650-2665`, `953-4099`.

---

## Display changes

### Before (rigid 3-slot)

```jsx
<Text>{shipperInfo.name}</Text>
<Text>{shipperInfo.street}</Text>
<Text>{shipperInfo.city}</Text>
<View>
  <Text>PHONE NUMBER: {shipperInfo.phone}</Text>
  <Text>DSN: {shipperInfo.dsn}</Text>
</View>
```

Always renders PHONE NUMBER and DSN labels even when empty.

### After (dynamic address lines, conditional phone/DSN)

```jsx
{shipperInfo.addressLines.map((line, i) => (
  <Text key={i}>{line}</Text>
))}
{(shipperInfo.phone || shipperInfo.dsn) && (
  <View>
    {shipperInfo.phone && <Text>PHONE NUMBER: {shipperInfo.phone}</Text>}
    {shipperInfo.dsn && <Text>DSN: {shipperInfo.dsn}</Text>}
  </View>
)}
```

Phone/DSN labels hidden when empty.

---

## Expected results for each example

| Image | Address Lines | Phone | DSN |
|-------|--------------|-------|-----|
| #13 | DLA DISTRIBUTION PEARL HARBOR / 2000 GAFFNEY ST BLDG 1900 / PEARL HARBOR USA HI 96860 4518 / USA | (808) 786-2398 | |
| #15 | FY4484 / BLDG 1757 VANDENBERG AVE / MCGUIRE AFB NJ 08641 | (609) 754-2665 | 650-2665 |
| #16 | N00109 Navy Munitions Command Det Yorktown / Naval Weapons Station Bldg 2037 / Yorktown VA 23691-4099 | (757) 887-4099 | 953-4099 |
| #18 | NAVSUP FLTLOGCEN JACKSONVILLE DETACHMENT, / GULFPORT, MS (RIC 4NN) / 511 NORTH BROWN AVE, BLDG 437 / GULFPORT, MS 39501-5000 UNITED STATES | | |
| #19 | THE BOEING COMPANY / BLDG 598A / 2600 NORTH THIRD STREET / ST. CHARLES, MO 63301 / U.S.A. | 3144612582 | |
| #20 | NUWC KEYPORT (US NAVY) / 610 DOWELL STREET / KEYPORT, WA 98345 US | 360-396-2185 | |
| #21 | Wesco/Northlake Hub / 4250 DALE EARNHARDT WAY SUITE#100 / 76262 NORTHLAKE TX / U.S.A. | 817-767-4353 | |
| #22 | DLA DISTRIBUTION JACKSONVILLE FL / BLDG 175, SWAN ROAD / NAS JACKSONVILLE FL 32212 0103 / USA | 904-542-0156 | |
| #23 | W39Z LETTERKENNY MUNITIONS CTR / VOELZ GATE EMERGENCY 717 267 8800 / CHAMBERSBURG PA 17201-4150 | 7172675421 | |
| #24 | DF YOUNG INC / 176-20 147 AVENUE / JAMAICA, NY 11434 / UNITED STATES | | |

---

## Files modified

- `src/components/Inspector/InteractiveSDDGForm.tsx` — Rewrite `parseShipperInfo`, update JSX rendering

---

## Testing

Unit tests for `parseShipperInfo` covering:
1. Labeled phone + DSN (PHONE NUMBER: / DSN: format)
2. Standalone phone at top of block
3. Standalone phone at bottom of block (10 bare digits)
4. Standalone phone in middle of block
5. No phone, no DSN (address only)
6. Phone embedded in address text (should NOT be extracted — left in address lines)
7. Empty input (fallback)
