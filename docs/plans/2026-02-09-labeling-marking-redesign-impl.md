# LabelingAndMarking Screen Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the LabelingAndMarking screen from a flat text list to a two-column tablet layout with card-based requirements (including inline hazard diamond pictograms) on the left and a pinned 3D Unity preview on the right.

**Architecture:** Replace `StandardLabelingContent` with a new card-based component. Restructure `LabelingAndMarkingScreen` to use a two-column layout (ScrollView left, fixed right). Create a hazard diamond image mapping utility that maps `hazclassDiv` strings to existing assets in `assets/hazmatPngs/`. Single info button in a header section replaces per-row info icons. Multi-value subsidiary risks split into separate cards.

**Tech Stack:** React Native, TypeScript, Valtio, existing UI design system (`@/components/ui`), existing hazmat PNG assets in `assets/hazmatPngs/primaryHazardLabels/`

**Design Doc:** `docs/plans/2026-02-09-labeling-marking-redesign.md`

**Target Device:** Tablet-first (iPad)

**Out of Scope:** LQ/EQ re-enablement (remains intentionally disabled), Class 5.2 / Class 7 materials (not supported by this app)

---

## Task 1: Create Hazard Diamond Image Mapping Utility

**Files:**
- Create: `src/utils/hazardDiamondImages.ts`
- Test: `src/utils/__tests__/hazardDiamondImages.test.ts`

This utility maps a `hazclassDiv` string to the correct `require()` call for existing PNG assets. It handles:
- Direct matches (e.g., `"5.1"` → exact key)
- Class 1 compatibility letters (e.g., `"1.1D"` → strip trailing letter, lookup `"1.1"`)
- Unknown classes → `null`

**Step 1: Write the failing test**

Create `src/utils/__tests__/hazardDiamondImages.test.ts`:

```typescript
import {
  getHazardDiamondImage,
  getHazardClassName,
  parseSubsidiaryRisks,
} from '../hazardDiamondImages';

describe('getHazardDiamondImage', () => {
  it('returns an image source for known hazard classes', () => {
    const result = getHazardDiamondImage('3');
    expect(result).toBeDefined();
    expect(typeof result).toBe('number'); // require() returns a number in RN
  });

  it('returns an image source for hazard class with division', () => {
    const result = getHazardDiamondImage('5.1');
    expect(result).toBeDefined();
  });

  it('handles Class 1 compatibility letters by stripping the letter', () => {
    // Real data uses values like "1.1D", "1.3G", "1.4S"
    expect(getHazardDiamondImage('1.1D')).toBeDefined();
    expect(getHazardDiamondImage('1.3G')).toBeDefined();
    expect(getHazardDiamondImage('1.4S')).toBeDefined();
    expect(getHazardDiamondImage('1.5D')).toBeDefined();
    expect(getHazardDiamondImage('1.6N')).toBeDefined();
  });

  it('returns null for unknown hazard class', () => {
    expect(getHazardDiamondImage('99.9')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(getHazardDiamondImage('')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(getHazardDiamondImage(undefined)).toBeNull();
  });

  it('returns null for out-of-scope classes (5.2, 7)', () => {
    expect(getHazardDiamondImage('5.2')).toBeNull();
    expect(getHazardDiamondImage('7')).toBeNull();
  });
});

describe('getHazardClassName', () => {
  it('returns class name for known hazard classes', () => {
    expect(getHazardClassName('3')).toBe('Flammable Liquid');
    expect(getHazardClassName('5.1')).toBe('Oxidizer');
    expect(getHazardClassName('6.1')).toBe('Toxic');
    expect(getHazardClassName('8')).toBe('Corrosive');
  });

  it('handles Class 1 compatibility letters', () => {
    expect(getHazardClassName('1.1D')).toBe('Explosives (Mass Explosion)');
    expect(getHazardClassName('1.4S')).toBe('Explosives (Minor)');
  });

  it('returns null for unknown hazard class', () => {
    expect(getHazardClassName('99')).toBeNull();
  });
});

describe('parseSubsidiaryRisks', () => {
  it('returns empty array for empty/null input', () => {
    expect(parseSubsidiaryRisks('')).toEqual([]);
    expect(parseSubsidiaryRisks(undefined)).toEqual([]);
    expect(parseSubsidiaryRisks(null)).toEqual([]);
  });

  it('parses single subsidiary risk', () => {
    expect(parseSubsidiaryRisks('8')).toEqual(['8']);
    expect(parseSubsidiaryRisks('5.1')).toEqual(['5.1']);
  });

  it('parses comma-separated subsidiary risks', () => {
    expect(parseSubsidiaryRisks('2.1, 8')).toEqual(['2.1', '8']);
    expect(parseSubsidiaryRisks('5.1, 8')).toEqual(['5.1', '8']);
    expect(parseSubsidiaryRisks('6.1, 8')).toEqual(['6.1', '8']);
  });

  it('handles extra whitespace', () => {
    expect(parseSubsidiaryRisks('2.1,8')).toEqual(['2.1', '8']);
    expect(parseSubsidiaryRisks(' 2.1 , 8 ')).toEqual(['2.1', '8']);
  });

  it('passes through non-numeric values like EXPLOSIVE', () => {
    expect(parseSubsidiaryRisks('EXPLOSIVE')).toEqual(['EXPLOSIVE']);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/utils/__tests__/hazardDiamondImages.test.ts --no-coverage`
Expected: FAIL — module not found

**Step 3: Write the implementation**

Create `src/utils/hazardDiamondImages.ts`:

```typescript
import { ImageSourcePropType } from 'react-native';

/**
 * Maps hazclassDiv strings to the primary hazard diamond image asset.
 * Uses existing PNGs from assets/hazmatPngs/primaryHazardLabels/.
 *
 * Handles Class 1 compatibility letters (e.g., "1.1D" → strips letter, looks up "1.1").
 * Out-of-scope classes (5.2, 7) are intentionally unmapped.
 */

const hazardDiamondMap: Record<string, ImageSourcePropType> = {
  // Class 1 - Explosives
  '1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.png'),
  '1.1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.1.png'),
  '1.2': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.2.png'),
  '1.3': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.3.png'),
  '1.4': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.4.png'),
  '1.5': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.5.png'),
  '1.6': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass1/explosives1.6.png'),

  // Class 2 - Gases
  '2.1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass2/flammableGasHazmatClass2.1.png'),
  '2.2': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass2/nonFlammableGasHazmatClass2.2.png'),
  '2.3': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass2/toxicGasHazmatClass2.3.png'),

  // Class 3 - Flammable Liquids
  '3': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass3/flammableLiquidHazmatClass3.png'),

  // Class 4 - Flammable Solids
  '4.1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass4/flammableSolidHazmatClass4.1.png'),
  '4.2': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass4/spontaneouslyCombustibleHazmatClass4.2.png'),
  '4.3': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass4/dangerousWhenWetHazmatClass4.3.png'),

  // Class 5 - Oxidizers (5.2 intentionally excluded — not in scope)
  '5.1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass5/oxidizerHazmatClass5.1.png'),

  // Class 6 - Toxic / Infectious
  '6.1': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass6/toxicHazmatClass6.png'),
  '6.2': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass6/infectiousSubstanceHazmatClass6.2.png'),

  // Class 7 - Radioactive — intentionally excluded (not in scope)

  // Class 8 - Corrosive
  '8': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass8/corrosiveHazmatClass8.png'),

  // Class 9 - Miscellaneous
  '9': require('../../assets/hazmatPngs/primaryHazardLabels/hazardClass9/miscellaneousHazmatClass9.png'),
};

const hazardClassNames: Record<string, string> = {
  '1': 'Explosives',
  '1.1': 'Explosives (Mass Explosion)',
  '1.2': 'Explosives (Projection)',
  '1.3': 'Explosives (Fire/Minor Blast)',
  '1.4': 'Explosives (Minor)',
  '1.5': 'Explosives (Insensitive)',
  '1.6': 'Explosives (Extremely Insensitive)',
  '2.1': 'Flammable Gas',
  '2.2': 'Non-Flammable Gas',
  '2.3': 'Toxic Gas',
  '3': 'Flammable Liquid',
  '4.1': 'Flammable Solid',
  '4.2': 'Spontaneously Combustible',
  '4.3': 'Dangerous When Wet',
  '5.1': 'Oxidizer',
  '6.1': 'Toxic',
  '6.2': 'Infectious Substance',
  '8': 'Corrosive',
  '9': 'Miscellaneous Dangerous Goods',
};

/**
 * Normalizes a hazclassDiv string to a base key for lookup.
 * Handles Class 1 compatibility letters: "1.1D" → "1.1", "1.4S" → "1.4"
 */
function normalizeHazclassDiv(hazclassDiv: string): string {
  // Class 1 with compatibility letter: match pattern like "1.1D", "1.3G", "1.4S"
  const class1Match = hazclassDiv.match(/^(1\.\d)[A-Z]$/);
  if (class1Match) {
    return class1Match[1];
  }
  return hazclassDiv;
}

/**
 * Returns the hazard diamond image source for a given hazclassDiv string.
 * Handles Class 1 compatibility letters (e.g., "1.1D" → "1.1").
 * Returns null if no image is available for the given class.
 */
export function getHazardDiamondImage(
  hazclassDiv: string | undefined | null
): ImageSourcePropType | null {
  if (!hazclassDiv) return null;
  const key = normalizeHazclassDiv(hazclassDiv);
  return hazardDiamondMap[key] ?? null;
}

/**
 * Returns the human-readable name for a hazard class/division.
 * Handles Class 1 compatibility letters (e.g., "1.1D" → "Explosives (Mass Explosion)").
 * Returns null if unknown.
 */
export function getHazardClassName(
  hazclassDiv: string | undefined | null
): string | null {
  if (!hazclassDiv) return null;
  const key = normalizeHazclassDiv(hazclassDiv);
  return hazardClassNames[key] ?? null;
}

/**
 * Parses a subsidiary risk string into individual risk values.
 * Real data includes comma-separated values like "2.1, 8" or "5.1, 8".
 * Returns an array of trimmed individual values.
 */
export function parseSubsidiaryRisks(
  subsidiaryRisk: string | undefined | null
): string[] {
  if (!subsidiaryRisk || subsidiaryRisk.trim() === '') return [];
  return subsidiaryRisk.split(',').map(s => s.trim()).filter(Boolean);
}
```

**Step 4: Run test to verify it passes**

Run: `npx jest src/utils/__tests__/hazardDiamondImages.test.ts --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/hazardDiamondImages.ts src/utils/__tests__/hazardDiamondImages.test.ts
git commit -m "feat: add hazard diamond image mapping utility with Class 1 normalization"
```

---

## Task 2: Rewrite StandardLabelingContent with Card-Based Design

**Files:**
- Modify: `src/components/preparer/StandardLabelingContent.tsx`
- Test: `src/components/preparer/__tests__/StandardLabelingContent.test.tsx` (create)

Replace the flat row-based layout with card-based layout. Hazard class labels get inline diamond thumbnails. Non-pictogram labels get Material Icons. Markings get prominent monospace-style text. Remove all per-row info buttons. Multi-value subsidiary risks split into separate cards. Label-only markings render without fallback text.

**Step 1: Write the failing test**

Create `src/components/preparer/__tests__/StandardLabelingContent.test.tsx`:

```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { StandardLabelingContent } from '../StandardLabelingContent';
import { RequiredLabel } from '@/utils/labelingRequirements';
import { RequiredMarking } from '@/utils/markingRequirements';

// Mock the hazard diamond utility
jest.mock('@/utils/hazardDiamondImages', () => ({
  getHazardDiamondImage: (hc: string) => {
    const map: Record<string, number> = { '5.1': 1, '6.1': 2, '2.1': 3, '8': 4 };
    return map[hc] ?? null;
  },
  getHazardClassName: (hc: string) => {
    const map: Record<string, string> = {
      '5.1': 'Oxidizer',
      '6.1': 'Toxic',
      '2.1': 'Flammable Gas',
      '8': 'Corrosive',
    };
    return map[hc] ?? null;
  },
  parseSubsidiaryRisks: (val: string) =>
    val ? val.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

const mockLabels: RequiredLabel[] = [
  { id: 'military-shipping-label', label: 'Military Shipping Label (MSL) or DD Form 1387' },
  { id: 'primary-hazard', label: 'Primary Hazard', value: '5.1' },
  { id: 'subsidiary-risk', label: 'Subsidiary Risk', value: '6.1' },
  { id: 'cargo-aircraft-only', label: 'Cargo Aircraft Only', value: 'Cargo Aircraft Only' },
];

const mockMarkings: RequiredMarking[] = [
  {
    id: 'proper-shipping-name-unid',
    label: 'Proper Shipping Name and UN Number',
    value: 'BARIUM BROMATE UN2719',
  },
  {
    id: 'pop-marking',
    label: 'POP Marking, stenciled and/or printed',
    renderType: 'pop',
    metadata: { B: '4G', C: 'Y', D: '75', E: 'S', F: '24', G: 'USA', H: 'AB' },
  },
];

describe('StandardLabelingContent', () => {
  it('renders labels section header', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );
    expect(getByText('Required Labels')).toBeTruthy();
  });

  it('renders markings section header', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );
    expect(getByText('Required Markings')).toBeTruthy();
  });

  it('renders primary hazard label with class name', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );
    expect(getByText('Primary Hazard')).toBeTruthy();
    expect(getByText('Oxidizer')).toBeTruthy();
  });

  it('renders subsidiary risk label with class name', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );
    expect(getByText('Subsidiary Risk')).toBeTruthy();
    expect(getByText('Toxic')).toBeTruthy();
  });

  it('renders cargo aircraft only card', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );
    expect(getByText('Cargo Aircraft Only')).toBeTruthy();
  });

  it('renders proper shipping name marking prominently', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );
    expect(getByText('BARIUM BROMATE UN2719')).toBeTruthy();
  });

  it('renders assembled POP marking string from metadata', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );
    expect(getByText('UN / 4G / Y / 75 / S / 24 / USA / AB')).toBeTruthy();
  });

  it('shows limited quantity banner when limitedQuantity is true', () => {
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={true}
      />
    );
    expect(getByText('Limited Quantity Notice')).toBeTruthy();
  });

  it('does not render per-row info buttons', () => {
    const { queryAllByTestId } = render(
      <StandardLabelingContent
        requiredLabels={mockLabels}
        requiredMarkings={mockMarkings}
        limitedQuantity={false}
      />
    );
    expect(queryAllByTestId('info-button')).toHaveLength(0);
  });

  it('renders multi-value subsidiary risk as separate cards', () => {
    const multiSubLabels: RequiredLabel[] = [
      { id: 'subsidiary-risk', label: 'Subsidiary Risk', value: '2.1, 8' },
    ];
    const { getByText } = render(
      <StandardLabelingContent
        requiredLabels={multiSubLabels}
        requiredMarkings={[]}
        limitedQuantity={false}
      />
    );
    expect(getByText('Flammable Gas')).toBeTruthy();
    expect(getByText('Corrosive')).toBeTruthy();
  });

  it('renders label-only markings without fallback text', () => {
    const labelOnlyMarkings: RequiredMarking[] = [
      { id: 'overpack', label: 'OVERPACK' },
      { id: 'limited-quantity', label: 'Limited Quantity' },
    ];
    const { getByText, queryByText } = render(
      <StandardLabelingContent
        requiredLabels={[]}
        requiredMarkings={labelOnlyMarkings}
        limitedQuantity={false}
      />
    );
    expect(getByText('OVERPACK')).toBeTruthy();
    expect(getByText('Limited Quantity')).toBeTruthy();
    expect(queryByText('Stenciled and/or printed')).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx jest src/components/preparer/__tests__/StandardLabelingContent.test.tsx --no-coverage`
Expected: FAIL — old component renders flat rows, not cards

**Step 3: Rewrite StandardLabelingContent**

Rewrite `src/components/preparer/StandardLabelingContent.tsx`:

```typescript
// src/components/preparer/StandardLabelingContent.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SectionHeader, InfoBox, spacing, colors, borderRadius, shadows, typography } from '@/components/ui';
import { RequiredLabel } from '@/utils/labelingRequirements';
import { RequiredMarking } from '@/utils/markingRequirements';
import {
  getHazardDiamondImage,
  getHazardClassName,
  parseSubsidiaryRisks,
} from '@/utils/hazardDiamondImages';

export interface StandardLabelingContentProps {
  requiredLabels: readonly RequiredLabel[];
  requiredMarkings: readonly RequiredMarking[];
  limitedQuantity: boolean;
}

// Assemble POP marking string from metadata fields A-H
function assemblePOPString(metadata?: Record<string, any>): string | null {
  if (!metadata) return null;
  const fields = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const values = fields.map(f => metadata[f]).filter(Boolean);
  if (values.length === 0) return null;
  return `UN / ${values.join(' / ')}`;
}

// Icon mapping for non-pictogram labels
const labelIconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  'military-shipping-label': 'local-shipping',
  'cargo-aircraft-only': 'flight',
  'compatibility-group': 'warning',
  'magnetized-material': 'settings-input-antenna',
};

// Labels that have hazard diamond pictograms
const pictogramLabelIds = new Set(['primary-hazard', 'subsidiary-risk']);

// Markings that are label-only (no stencil value expected)
const labelOnlyMarkingIds = new Set([
  'limited-quantity',
  'overpack',
  'kit-marking',
  'lithium-battery-marking',
  'lithium-battery-excepted-quantity',
]);

const HazardLabelCard: React.FC<{ labelType: string; hazclassDiv: string }> = ({
  labelType,
  hazclassDiv,
}) => {
  const diamondImage = getHazardDiamondImage(hazclassDiv);
  const className = getHazardClassName(hazclassDiv);

  return (
    <View style={styles.card}>
      {diamondImage ? (
        <Image source={diamondImage} style={styles.diamondImage} resizeMode="contain" />
      ) : (
        <View style={styles.iconContainer}>
          <MaterialIcons name="warning" size={24} color={colors.warning} />
        </View>
      )}
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{labelType}</Text>
        {className && <Text style={styles.cardSubtitle}>{className}</Text>}
        {!className && <Text style={styles.cardSubtitle}>Class {hazclassDiv}</Text>}
      </View>
    </View>
  );
};

const IconLabelCard: React.FC<{ label: RequiredLabel }> = ({ label }) => {
  const iconName = labelIconMap[label.id] ?? 'label';
  const isCAO = label.id === 'cargo-aircraft-only';

  return (
    <View style={[styles.card, isCAO && styles.cardWarning]}>
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={iconName}
          size={24}
          color={isCAO ? colors.warning : colors.textSecondary}
        />
      </View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{label.label}</Text>
        {isCAO && (
          <Text style={styles.cardSubtitle}>Restriction — passenger aircraft prohibited</Text>
        )}
      </View>
    </View>
  );
};

const MarkingCard: React.FC<{ marking: RequiredMarking }> = ({ marking }) => {
  const isPOP = marking.renderType === 'pop';
  const displayValue = isPOP
    ? assemblePOPString(marking.metadata)
    : marking.displayValue || marking.value;

  const isLabelOnly = labelOnlyMarkingIds.has(marking.id);
  const showFallback = isPOP && !displayValue;

  return (
    <View style={styles.card}>
      <View style={styles.markingContent}>
        <Text style={styles.markingLabel}>{marking.label}</Text>
        {displayValue ? (
          <Text style={styles.markingValue}>{displayValue}</Text>
        ) : showFallback ? (
          <Text style={styles.markingValueMuted}>Stenciled and/or printed</Text>
        ) : isLabelOnly ? null : (
          marking.value ? (
            <Text style={styles.markingValue}>{marking.value}</Text>
          ) : null
        )}
      </View>
    </View>
  );
};

/**
 * Renders a label item. For subsidiary-risk labels with comma-separated values,
 * splits into multiple HazardLabelCards (one per risk).
 */
function renderLabelItem(label: RequiredLabel): React.ReactNode {
  if (!pictogramLabelIds.has(label.id)) {
    return <IconLabelCard key={label.id} label={label} />;
  }

  // For subsidiary risk, parse comma-separated values into multiple cards
  if (label.id === 'subsidiary-risk' && label.value) {
    const risks = parseSubsidiaryRisks(label.value);
    if (risks.length > 1) {
      return risks.map((risk, index) => (
        <HazardLabelCard
          key={`${label.id}-${index}`}
          labelType="Subsidiary Risk"
          hazclassDiv={risk}
        />
      ));
    }
  }

  return (
    <HazardLabelCard
      key={label.id}
      labelType={label.label}
      hazclassDiv={label.value ?? ''}
    />
  );
}

export const StandardLabelingContent: React.FC<StandardLabelingContentProps> = ({
  requiredLabels,
  requiredMarkings,
  limitedQuantity,
}) => {
  return (
    <View style={styles.container}>
      {limitedQuantity && (
        <View style={styles.bannerContainer}>
          <InfoBox
            variant="warning"
            title="Limited Quantity Notice"
            message="This shipment qualifies as a Limited Quantity. While you DO NOT need UN specification packaging (no POP marking), you still MUST apply the hazard labels shown below."
          />
        </View>
      )}

      <SectionHeader
        title="Required Labels"
        icon="label"
        count={{ completed: requiredLabels.length, total: requiredLabels.length }}
      />
      <View style={styles.sectionContent}>
        {requiredLabels.map(label => renderLabelItem(label))}
      </View>

      <SectionHeader
        title="Required Markings"
        icon="edit"
        count={{ completed: requiredMarkings.length, total: requiredMarkings.length }}
      />
      <View style={styles.sectionContent}>
        {requiredMarkings.map(marking => (
          <MarkingCard key={marking.id} marking={marking} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    padding: spacing.md,
  },
  sectionContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  // Card base
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.light,
  },
  cardWarning: {
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  // Hazard diamond
  diamondImage: {
    width: 48,
    height: 48,
  },
  // Icon labels
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Markings
  markingContent: {
    flex: 1,
  },
  markingLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  markingValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Courier',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  markingValueMuted: {
    ...typography.body,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
});
```

**Key changes from old component:**
- Removed `onInfoPress` prop entirely
- Removed all per-row `TouchableOpacity` info buttons
- Added `HazardLabelCard` with inline 48x48 diamond images + fallback icon for missing images
- Added `IconLabelCard` with Material Icons for non-pictogram labels
- Added `MarkingCard` with large monospace marking text
- Multi-value subsidiary risks split into separate `HazardLabelCard` instances
- Label-only markings (overpack, kit, limited-qty) render without fallback text
- "Stenciled and/or printed" fallback only applies to POP markings missing metadata
- CAO card gets `warningLight` background
- POP marking assembled from metadata fields into formatted string

**Step 4: Run test to verify it passes**

Run: `npx jest src/components/preparer/__tests__/StandardLabelingContent.test.tsx --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/preparer/StandardLabelingContent.tsx src/components/preparer/__tests__/StandardLabelingContent.test.tsx
git commit -m "feat: redesign StandardLabelingContent with card-based layout, diamond pictograms, and multi-value subsidiary risk support"
```

---

## Task 3: Rewrite LabelingAndMarkingScreen with Two-Column Layout

**Files:**
- Modify: `src/screens/preparer/LabelingAndMarkingScreen.tsx`

Restructure the screen to a two-column tablet layout: scrollable left column with header + StandardLabelingContent, fixed right column with UnityPackagePreview. Single info button in the header. Material context subtitle. LQ/EQ remain intentionally disabled.

**Step 1: Rewrite LabelingAndMarkingScreen**

```typescript
// src/screens/preparer/LabelingAndMarkingScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  ActionFooter,
  DocumentModal,
  colors,
  spacing,
  borderRadius,
  typography,
} from '@/components/ui';
import {
  VehicleLabelingNotice,
  StandardLabelingContent,
  UnityPackagePreview,
} from '@/components/preparer';
import { useHazProStore } from '@/stores/useHazProStore';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { getContainerDescriptionFromCode } from '@/utils/getContainerDescriptionFromPackagingCode';
import { getDocumentNodes } from '../../../server/documentNodes';
import renderDocumentNodes from '../../../server/renderDocumentNodes/renderDocumentNodes';

export interface LabelingAndMarkingScreenProps {
  navigation: any;
}

export const LabelingAndMarkingScreen: React.FC<LabelingAndMarkingScreenProps> = ({
  navigation,
}) => {
  const {
    state,
    store,
    actions,
    requiredMarkings,
    requiredLabels,
    saveCurrentShipment,
  } = useHazProStore();
  const { navigate } = useNavigationRef();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const hazMat = state.hazProPreparerContext.hazardousMaterial;
  const isVehicle = hazMat?.unid === 'UN3166';
  const packageCode = state.hazProPreparerContext.packaging?.inputPOPMarking?.B ?? '';
  const packageType = getContainerDescriptionFromCode(packageCode) ?? '';
  // EQ/LQ intentionally disabled — out of scope for this refactor
  const isLimitedQuantity = false;

  // Update required markings and labels when relevant state changes
  useEffect(() => {
    store.hazProPreparerContext.activeStep = 3;
    actions.updateRequiredMarkingsAndLabels();
  }, [
    state.hazProPreparerContext.hazardousMaterial,
    state.hazProPreparerContext.packaging,
    state.hazProPreparerContext.lithiumBatteryData,
    state.hazProPreparerContext.dryIceData,
    state.hazProPreparerContext.technicalName,
    state.hazProPreparerContext.usesCaaCertification,
    state.hazProPreparerContext.usesCoeCertification,
    state.hazProPreparerContext.lookupFunctionsOutput,
  ]);

  // Extract attachment number from packaging paragraph
  const getAttachmentNumber = (paragraph: string): string => {
    return paragraph.split('.')[0].substring(1);
  };

  // Single info button handler — opens packaging regulations modal
  const handleInfoPress = useCallback(() => {
    const packagingParagraph = hazMat?.packagingParagraph;
    if (packagingParagraph) {
      const attachmentNumber = getAttachmentNumber(packagingParagraph);
      const documentNodesList = getDocumentNodes(attachmentNumber);
      const renderedContent = renderDocumentNodes(packagingParagraph, documentNodesList);
      setModalContent(renderedContent);
      setIsModalVisible(true);
    }
  }, [hazMat?.packagingParagraph]);

  // Navigation handlers — unchanged from original
  const handleCancel = useCallback(() => {
    store.hazProPreparerContext.activeStep = 2;
    store.hazProPreparerContext.completedSubsteps = completedSubsteps.slice(0, -1);
    navigation.goBack();
  }, [completedSubsteps, navigation, store.hazProPreparerContext]);

  const handleSaveAndExit = useCallback(() => {
    saveCurrentShipment('in-progress');
    navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  }, [saveCurrentShipment, navigate]);

  const handleSaveAndContinue = useCallback(() => {
    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      'LabelingAndMarking',
    ];
    navigation.navigate('ShippersDeclarationScreen');
  }, [completedSubsteps, navigation, store.hazProPreparerContext]);

  // EQ/LQ routing intentionally disabled — out of scope for this refactor

  const prepareShipmentData = useCallback(() => {
    const shipment = state.hazProPreparerContext.shipment;
    const shipper = state.hazProPreparerContext.shipper;
    const consignee = state.hazProPreparerContext.consignee;

    const shipperAddress = [
      shipper?.address?.shipperStreet,
      shipper?.address?.shipperCity,
      shipper?.address?.shipperState,
      shipper?.address?.shipperZipcode,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    const consigneeAddress = [
      consignee?.address?.consigneeStreet,
      consignee?.address?.consigneeCity,
      consignee?.address?.consigneeState,
      consignee?.address?.consigneeZipcode,
    ]
      .filter(Boolean)
      .join(' ')
      .trim();

    return {
      tcn: shipment?.tcn || '',
      fromDodaac: shipment?.tcn?.substring(0, 6) || '',
      fromAddress: shipperAddress,
      poe: shipment?.poe?.substring(0, 3)?.toUpperCase() || '',
      pod: shipment?.pod?.substring(0, 3)?.toUpperCase() || '',
      consigneeDodaac: consignee?.address?.consigneeDodaac || '',
      consigneeAddress,
    };
  }, [
    state.hazProPreparerContext.consignee,
    state.hazProPreparerContext.shipment,
    state.hazProPreparerContext.shipper,
  ]);

  const footerButtons = [
    { label: 'Cancel', onPress: handleCancel, variant: 'outline' as const },
    { label: 'Save & Exit', onPress: handleSaveAndExit, variant: 'secondary' as const },
    { label: 'Save & Continue', onPress: handleSaveAndContinue, variant: 'primary' as const },
  ];

  // Material context subtitle
  const subtitle = [
    hazMat?.unid,
    hazMat?.properShippingName,
    hazMat?.hazclassDiv ? `Class ${hazMat.hazclassDiv}` : '',
  ]
    .filter(Boolean)
    .join(' \u00B7 '); // middle dot separator

  // Vehicle shipment — two-column with VehicleLabelingNotice + 3D preview
  if (isVehicle) {
    return (
      <View style={styles.container}>
        <View style={styles.columnsContainer}>
          <ScrollView style={styles.leftColumn} contentContainerStyle={styles.leftContent}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Labeling & Marking Requirements</Text>
              <Text style={styles.headerSubtitle}>{subtitle}</Text>
            </View>
            <VehicleLabelingNotice />
          </ScrollView>
          <View style={styles.rightColumn}>
            <UnityPackagePreview
              requiredMarkings={requiredMarkings}
              requiredLabels={requiredLabels}
              packageCode={packageCode}
              packageType={packageType}
              shipmentData={prepareShipmentData()}
            />
          </View>
        </View>
        <ActionFooter buttons={footerButtons} />
      </View>
    );
  }

  // Standard shipment — two-column layout
  return (
    <View style={styles.container}>
      <View style={styles.columnsContainer}>
        <ScrollView style={styles.leftColumn} contentContainerStyle={styles.leftContent}>
          <View style={styles.header}>
            <View style={styles.headerTopRow}>
              <Text style={styles.headerTitle}>Labeling & Marking Requirements</Text>
              <TouchableOpacity
                testID="info-button"
                style={styles.infoButton}
                onPress={handleInfoPress}
                accessibilityLabel="View packaging regulations"
                accessibilityRole="button"
              >
                <MaterialIcons name="menu-book" size={20} color={colors.primary} />
                <Text style={styles.infoButtonText}>Regs</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
          </View>

          <StandardLabelingContent
            requiredLabels={requiredLabels}
            requiredMarkings={requiredMarkings}
            limitedQuantity={isLimitedQuantity}
          />
        </ScrollView>

        <View style={styles.rightColumn}>
          <UnityPackagePreview
            requiredMarkings={requiredMarkings}
            requiredLabels={requiredLabels}
            packageCode={packageCode}
            packageType={packageType}
            shipmentData={prepareShipmentData()}
          />
        </View>
      </View>

      <ActionFooter buttons={footerButtons} />

      <DocumentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Packaging Information"
        htmlContent={modalContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Two-column tablet layout
  columnsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  leftColumn: {
    flex: 45,
  },
  leftContent: {
    paddingBottom: spacing.lg,
  },
  rightColumn: {
    flex: 55,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  // Header
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.headerTitle,
    color: colors.textPrimary,
    flex: 1,
  },
  headerSubtitle: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  // Single info button
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.infoLight,
  },
  infoButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default LabelingAndMarkingScreen;
```

**Key changes from original:**
- Two-column layout: `flex: 45` left, `flex: 55` right (tablet-first)
- Left column is a `ScrollView`, right column is a fixed `View`
- Header with title, material context subtitle, and single "Regs" info button
- `StandardLabelingContent` no longer receives `onInfoPress` (removed from its props in Task 2)
- `UnityPackagePreview` moved to the right column (component itself unchanged)
- Vehicle shipment also gets two-column layout with 3D preview
- LQ/EQ explicitly commented as "intentionally disabled — out of scope for this refactor"
- All navigation handlers, state writes, and `prepareShipmentData` unchanged

**Step 2: Run existing tests**

Run: `npx jest src/screens/preparer/__tests__/LabelingAndMarkingScreen.test.tsx --no-coverage`
Expected: Some tests will need updating because the component structure changed

**Step 3: Update the test file**

Key updates to `src/screens/preparer/__tests__/LabelingAndMarkingScreen.test.tsx`:

1. **`StandardLabelingContent` mock** — remove `onInfoPress` from mock props:
```typescript
StandardLabelingContent: ({ requiredLabels, requiredMarkings, limitedQuantity }: any) =>
  React.createElement(View, { testID: 'standard-content' },
    React.createElement(Text, null, `Labels: ${requiredLabels.length}`),
    React.createElement(Text, null, `Markings: ${requiredMarkings.length}`),
    limitedQuantity && React.createElement(Text, { testID: 'limited-qty-notice' }, 'Limited Quantity'),
  ),
```

2. **Vehicle test** — expect BOTH `vehicle-notice` AND `unity-preview` (vehicles now show 3D preview too):
```typescript
it('renders vehicle labeling notice AND unity preview for UN3166', async () => {
  const { getByTestId } = render(
    <LabelingAndMarkingScreen navigation={mockNavigation as any} />
  );
  await waitFor(() => {
    expect(getByTestId('vehicle-notice')).toBeTruthy();
    expect(getByTestId('unity-preview')).toBeTruthy();
  });
});
```

3. **Info button test** — the info trigger is now `testID="info-button"` in the screen header (not from the mocked StandardLabelingContent). Update the existing info test or replace the `info-trigger` references:
```typescript
it('opens document modal when info button is pressed', async () => {
  const { getByTestId } = render(
    <LabelingAndMarkingScreen navigation={mockNavigation as any} />
  );
  await waitFor(() => {
    fireEvent.press(getByTestId('info-button'));
    expect(getByTestId('document-modal')).toBeTruthy();
  });
});
```

4. **UI mock** — add missing theme exports to the `@/components/ui` mock:
```typescript
borderRadius: { sm: 4, md: 8, lg: 12 },
typography: {
  headerTitle: { fontSize: 18, fontWeight: '600' },
  caption: { fontSize: 12, color: '#8E8E93' },
},
```

**Step 4: Run tests to verify they pass**

Run: `npx jest src/screens/preparer/__tests__/LabelingAndMarkingScreen.test.tsx --no-coverage`
Expected: PASS

**Step 5: Commit**

```bash
git add src/screens/preparer/LabelingAndMarkingScreen.tsx src/screens/preparer/__tests__/LabelingAndMarkingScreen.test.tsx
git commit -m "feat: redesign LabelingAndMarking screen with two-column tablet layout"
```

---

## Task 4: Verify Full Integration

**Files:**
- Verify: All files modified in Tasks 1-3

**Step 1: Run the full test suite for affected files**

Run: `npx jest --testPathPattern="(LabelingAndMarking|StandardLabeling|hazardDiamond)" --no-coverage`
Expected: All tests PASS

**Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --project tsconfig.json`
Expected: No errors in modified files (check exit code)

**Step 3: Fix any issues found**

Address TypeScript errors, missing imports, or test failures.

**Step 4: Commit if fixes were needed**

```bash
git add -A
git commit -m "fix: resolve integration issues from labeling screen redesign"
```

---

## Summary of Changes

| File | Action | Description |
|------|--------|-------------|
| `src/utils/hazardDiamondImages.ts` | Create | Maps hazclassDiv to existing PNG assets, Class 1 compatibility letter normalization, subsidiary risk parsing |
| `src/utils/__tests__/hazardDiamondImages.test.ts` | Create | Tests for mapping, normalization, and parsing |
| `src/components/preparer/StandardLabelingContent.tsx` | Rewrite | Card-based layout, inline diamonds, multi-value subsidiary risk cards, label-only marking handling |
| `src/components/preparer/__tests__/StandardLabelingContent.test.tsx` | Create | Tests for redesigned component |
| `src/screens/preparer/LabelingAndMarkingScreen.tsx` | Rewrite | Two-column tablet layout, header with subtitle + single info button |
| `src/screens/preparer/__tests__/LabelingAndMarkingScreen.test.tsx` | Update | Align mocks and assertions with new component structure |

**No new assets needed** — existing PNGs in `assets/hazmatPngs/primaryHazardLabels/` are used.

**No changes to:** `UnityPackagePreview`, `ActionFooter`, `DocumentModal`, `VehicleLabelingNotice`, navigation handlers, state management, LQ/EQ disabled logic, or any other files.

## Review Findings Addressed

| # | Finding | Resolution |
|---|---------|------------|
| 1 | LQ/EQ behavior conflict | Both design and plan explicitly mark as "intentionally disabled — out of scope for this refactor" |
| 2 | Class 1 compatibility letters not handled | `normalizeHazclassDiv()` strips trailing letter: `"1.1D"` → `"1.1"` |
| 3 | Class 5.2 mapped to 5.1 image | 5.2 removed entirely — not in scope for this app |
| 4 | Class 7 incomplete | Removed entirely — not in scope for this app |
| 5 | Multi-value subsidiary risks not parsed | `parseSubsidiaryRisks()` splits comma-separated values; `renderLabelItem()` renders separate cards |
| 6 | Marking fallback text too broad | "Stenciled and/or printed" only for POP markings; label-only markings render without fallback |
| 7 | No responsive breakpoint | Documented as tablet-first; not designed for phone portrait |
| 8 | Design/impl disagree on asset strategy | Both now say "use existing assets in `assets/hazmatPngs/`" |
| 9 | Test run commands wrong extension | Fixed all to `.test.tsx` where JSX is used, `.test.ts` where pure TS |
| 10 | TypeScript verification masks failures | Removed `| head -30` pipe |
