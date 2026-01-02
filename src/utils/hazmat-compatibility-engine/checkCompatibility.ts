const COMPATIBILITY_GROUPS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'J',
  'K',
  'L',
  'N',
  'S',
  'N/A',
] as const;

export type HazmatCompatibilityKey = {
  compatibilityGroup: typeof COMPATIBILITY_GROUPS[number];
  hazardClassDivisionNumber: string;
  properShippingName: string;
  unid: string;
  numericSpecialProvision?: string;
};

export const compatibilityMap: Record<
  // typeof COMPATIBILITY_GROUPS[number],
  Exclude<typeof COMPATIBILITY_GROUPS[number], 'N/A'>,
  typeof COMPATIBILITY_GROUPS[number][]
> = {
  A: ['A'],
  B: ['B', 'S'],
  C: ['C', 'D', 'E', 'N', 'S'],
  D: ['C', 'D', 'E', 'N', 'S'],
  E: ['C', 'D', 'E', 'N', 'S'],
  F: ['F', 'S'],
  G: ['G', 'S'],
  H: ['H', 'S'],
  J: ['J', 'S'],
  K: ['K', 'S'],
  L: [],
  N: ['C', 'D', 'E', 'N', 'S'],
  S: ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'N', 'S'],
};

type PairInput = {
  a: HazmatCompatibilityKey;
  b: HazmatCompatibilityKey;
};

export const isCompatible = ({ a, b }: PairInput): boolean => {
  if (!a || !b) {
    console.warn('isCompatible: One or both materials are undefined', { a, b });
    return true; // Default to compatible if data is missing
  }

  const groupA = a.compatibilityGroup || 'N/A';
  const groupB = b.compatibilityGroup || 'N/A';

  if (groupA === 'N/A' || groupB === 'N/A') {
    return true;
  }

  // Defensive check for compatibilityMap
  const compatibleGroups = compatibilityMap[groupA];
  if (!compatibleGroups || !Array.isArray(compatibleGroups)) {
    console.warn('isCompatible: Invalid compatibility group or map entry', { groupA, groupB });
    return true; // Default to compatible if mapping is missing
  }

  return compatibleGroups.includes(groupB);
};

// all
type RuleOutput = {
  type: 'ADD' | 'RESTRICT';
  applicable: boolean;
  compatible?: boolean;
};
/**
 * 
 1. Group "B" explosives UN0255, UN0257, UN0267, and UN0361 may be loaded and
transported with groups "C," "D," and "E" explosives on cargo aircraft only. Passenger
deviations are not authorized.
 */
export const rule1 = ({ a, b }: PairInput): RuleOutput => {
  const type = 'ADD';

  if (!a || !b) {
    return { type, applicable: false };
  }

  const groupA = a.compatibilityGroup || '';
  const groupB = b.compatibilityGroup || '';
  const unidA = a.unid || '';
  const unidB = b.unid || '';

  const applicable =
    (groupA === 'B' && ['C', 'D', 'E'].includes(groupB)) ||
    (groupB === 'B' && ['C', 'D', 'E'].includes(groupA));

  if (!applicable) {
    return {
      type,
      applicable,
    };
  }

  return {
    type,
    applicable,
    compatible:
      (groupA === 'B' && ['UN0255', 'UN0256', 'UN0267', 'UN0361'].includes(unidA)) ||
      (groupB === 'B' && ['UN0255', 'UN0256', 'UN0267', 'UN0361'].includes(unidB)),
  };
};

/**
 * 
2. Group "B" explosives packaged in an EOD MK 663, MOD 0 container may be loaded
and transported with groups "C" through "H" and group "S" explosives.

We don't have this info
 */
// const rule2 = ({a, b}: PairInput): RuleOutput => {
//   return {
//     ty
//     applicable: false,
//   }
// const [a1, b1] = [a, b].sort((a, b) => a.compatibilityGroup < b.compatibilityGroup ? -1 : 1 )

// const applicable = a1.compatibilityGroup === 'B' && ['C', 'D', 'E'].includes(b1.compatibilityGroup);

//if (!applicable) {
// return {
//   applicable,
// };
//}
//}
/**
 * 
 * 3. Group "F" explosives UN0292 may be loaded and transported with groups "C," "D," and
"E" explosives on cargo aircraft only. Passenger deviations are not authorized
*/
export const rule3 = ({ a, b }: PairInput): RuleOutput => {
  const type = 'ADD';

  if (!a || !b) {
    return { type, applicable: false };
  }

  const groupA = a.compatibilityGroup || '';
  const groupB = b.compatibilityGroup || '';
  const unidA = a.unid || '';
  const unidB = b.unid || '';

  const applicable =
    (groupA === 'F' && ['C', 'D', 'E'].includes(groupB)) ||
    (groupB === 'F' && ['C', 'D', 'E'].includes(groupA));

  if (!applicable) {
    return {
      type,
      applicable,
    };
  }

  return {
    type,
    applicable,
    compatible:
      (groupA === 'F' && 'UN0292' === unidA) ||
      (groupB === 'F' && 'UN0292' === unidB),
  };
};

/**
 * 
4. Group "G" explosives UN0019, UN0300, UN0301, and UN0325 may be loaded and
transported with all other explosives compatible with group "S" explosives on cargo aircraft
only. Passenger deviations are not authorized
 */
export const rule4 = ({ a, b }: PairInput): RuleOutput => {
  const type = 'ADD';

  if (!a || !b) {
    return { type, applicable: false };
  }

  const applicableUnids = ['UN0019', 'UN0300', 'UN0301', 'UN0325'];
  const groupA = a.compatibilityGroup || '';
  const groupB = b.compatibilityGroup || '';
  const unidA = a.unid || '';
  const unidB = b.unid || '';

  const aIsGroupGWithApplicableUnid = groupA === 'G' && applicableUnids.includes(unidA);
  const bIsGroupGWithApplicableUnid = groupB === 'G' && applicableUnids.includes(unidB);

  const sCompatibleGroups = compatibilityMap['S'] || [];
  const aIsCompatibleWithS = Array.isArray(sCompatibleGroups) && sCompatibleGroups.includes(groupA);
  const bIsCompatibleWithS = Array.isArray(sCompatibleGroups) && sCompatibleGroups.includes(groupB);

  const applicable =
    (aIsGroupGWithApplicableUnid && bIsCompatibleWithS) ||
    (bIsGroupGWithApplicableUnid && aIsCompatibleWithS);

  if (!applicable) {
    return {
      type,
      applicable: false,
      compatible: undefined,
    };
  }

  return {
    type,
    applicable: true,
    compatible: true,
  };
};

// export const rule4 = ({ a, b }: PairInput): RuleOutput => {
//   const type = 'ADD';

//   const applicable =
//     (a.compatibilityGroup === 'G' && b.compatibilityGroup === 'S') ||
//     (b.compatibilityGroup === 'G' && a.compatibilityGroup === 'S');

// if (!applicable) {
//   return {
//     type,
//     applicable,
//   };
// }

//   return {
//     type,
//     applicable,
//     compatible:
//       (a.compatibilityGroup === 'G' &&
//         ['UN0019', 'UN0300', 'UN0301', 'UN0325'].includes(a.unid)) ||
//       (b.compatibilityGroup === 'G' &&
//         ['UN0019', 'UN0300', 'UN0301', 'UN0325'].includes(b.unid)),
//   };
// };
/**
 * 
5. Group "G" explosives UN0009, UN0018, UN0314, UN0315, UN0317, UN0319, and
UN0320 may be transported with groups "C," "D," and "E" explosives on cargo aircraft only.
Passenger deviations are not authorized
ADDS COMPATIBILITY
 */
export const rule5 = ({ a, b }: PairInput): RuleOutput => {
  const type = 'ADD';

  if (!a || !b) {
    return { type, applicable: false };
  }

  const groupA = a.compatibilityGroup || '';
  const groupB = b.compatibilityGroup || '';
  const unidA = a.unid || '';
  const unidB = b.unid || '';

  const applicable =
    (groupA === 'G' && ['C', 'D', 'E'].includes(groupB)) ||
    (groupB === 'G' && ['C', 'D', 'E'].includes(groupA));

  if (!applicable) {
    return {
      type,
      applicable,
    };
  }

  const applicableUnids = ['UN0009', 'UN0018', 'UN0314', 'UN0315', 'UN0317', 'UN0319', 'UN0320'];

  return {
    type,
    applicable,
    compatible:
      (groupA === 'G' && applicableUnids.includes(unidA)) ||
      (groupB === 'G' && applicableUnids.includes(unidB)),
  };
};
/**
 * 
6. Group "L" explosives may only be loaded and transported with an identical item.
ADDS COMPATIBILITY
 */
export const rule6 = ({ a, b }: PairInput): RuleOutput => {
  const type = 'ADD';

  if (!a || !b) {
    return { type, applicable: false };
  }

  const groupA = a.compatibilityGroup || '';
  const groupB = b.compatibilityGroup || '';
  const unidA = a.unid || '';
  const unidB = b.unid || '';

  const applicable = groupA === 'L' && groupB === 'L';

  if (!applicable) {
    return {
      type,
      applicable,
    };
  }

  return {
    type,
    applicable,
    compatible: unidA === unidB,
  };
};
/**
 * 
7. Class 1.1 and 1.2 explosives may not be shipped with UN0333, UN0334, UN0335,
UN0336, and UN0337.

RESTRICTS COMPATIBILITY
 */
export const rule7 = ({ a, b }: PairInput): RuleOutput => {
  const type = 'RESTRICT';

  if (!a || !b) {
    return { type, applicable: false };
  }

  const applicableUnids = ['UN0333', 'UN0334', 'UN0335', 'UN0336', 'UN0337'];
  const applicableClasses = ['1.1', '1.2'];

  const unidA = a.unid || '';
  const unidB = b.unid || '';
  const classA = a.hazardClassDivisionNumber || '';
  const classB = b.hazardClassDivisionNumber || '';

  const aHasRestrictedUnid = applicableUnids.includes(unidA);
  const bHasRestrictedUnid = applicableUnids.includes(unidB);
  const aHasRestrictedClass = applicableClasses.includes(classA);
  const bHasRestrictedClass = applicableClasses.includes(classB);

  const applicable =
    (aHasRestrictedUnid && bHasRestrictedClass) ||
    (bHasRestrictedUnid && aHasRestrictedClass);

  if (!applicable) {
    return {
      type,
      applicable: false,
    };
  }

  // If the rule is applicable, the materials are not compatible
  return {
    type,
    applicable: true,
    compatible: false,
  };
};

/**
 * 
8. Class 1.4, Compatibility Groups B and G may be loaded and transported together or with
Class 1.4 Compatibility Groups C, D, and E on cargo aircraft only.

ADDS COMPATIBILITY
 */
export const rule8 = ({ a, b }: PairInput): RuleOutput => {
  const type = 'ADD';

  if (!a || !b) {
    return { type, applicable: false };
  }

  const restricted = ['B', 'G'];
  const lessRestricted = ['C', 'D', 'E'];

  const groupA = a.compatibilityGroup || '';
  const groupB = b.compatibilityGroup || '';
  const classA = a.hazardClassDivisionNumber || '';
  const classB = b.hazardClassDivisionNumber || '';

  const applicable =
    groupA !== groupB &&
    ((restricted.includes(groupA) && lessRestricted.includes(groupB)) || // with c, d, e
      (restricted.includes(groupB) && lessRestricted.includes(groupA)) || // with c, d, e
      (restricted.includes(groupA) && restricted.includes(groupB))); // just b, g

  if (!applicable) {
    return {
      type,
      applicable,
    };
  }

  return {
    type,
    applicable,
    compatible: classA === '1.4' && classB === '1.4',
  };
};

export const checkCompatibility = (
  input: HazmatCompatibilityKey[],
  debug?: boolean,
): HazmatCompatibilityKey[] => {
  debug && console.log(debug);

  if (!input || !Array.isArray(input) || input.length < 2) {
    // ignore null, undefined, non-array, or arrays with 0 or 1 items
    return [];
  }

  const pairs: [HazmatCompatibilityKey, HazmatCompatibilityKey][] =
    input.flatMap((item, index) =>
      input
        .slice(index + 1)
        .map(
          (nextItem) =>
            [item, nextItem] as [
              HazmatCompatibilityKey,
              HazmatCompatibilityKey,
            ],
        ),
    );

  const rules = [rule1, rule3, rule4, rule5, rule6, rule7, rule8];

  const res = pairs
    .map(([a, b]) => ({
      a,
      b,
      compatible: isCompatible({ a, b }),
      applicableRules: rules
        .map((rule) => rule({ a, b }))
        .filter((result) => result.applicable),
    }))
    .map(({ a, b, compatible, applicableRules }) => ({
      a,
      b,
      compatible: applicableRules.reduce((curr, rule) => {
        if (rule.type === 'ADD') {
          return !!rule.compatible || curr;
        }
        if (rule.type == 'RESTRICT') {
          return !!rule.compatible && curr;
        }
        return curr;
      }, compatible),
    }))
    .filter((checked) => !checked.compatible);

  // console.log('res: ', res);

  const outputSet = new Set();
  const flatResult = res
    .map(({ a, b }) => [a, b])
    .flat()
    .filter((hazObject) => {
      if (!hazObject || !hazObject.unid) {
        console.warn('checkCompatibility: Found undefined hazObject or unid', hazObject);
        return false;
      }
      if (outputSet.has(hazObject.unid)) {
        return false;
      }
      outputSet.add(hazObject.unid);
      return true;
    })
    .sort((a, b) => {
      const groupA = a?.compatibilityGroup || '';
      const groupB = b?.compatibilityGroup || '';
      return groupA < groupB ? -1 : 1;
    });

  // console.log('flatResult: ', flatResult);

  return flatResult;
};
