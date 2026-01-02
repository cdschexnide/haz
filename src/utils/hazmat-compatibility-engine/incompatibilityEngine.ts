import { Engine, EngineResult, Rule } from 'json-rules-engine';
import { HazmatCompatibilityKey } from './engineTypes';

const compatibilityCache = new Map<string, HazmatCompatibilityKey[]>();

export const isCompatible = (results: EngineResult): boolean => {
  // const compatibleConditions = [
  //   'note1Condition',
  //   'note3Condition',
  //   'note5Condition',
  //   'note8Condition',
  //   'note9Condition',
  //   // 'note10Condition',
  //   'note11Condition',
  //   'note12Condition',
  //   'compatibleCondition',
  // ];
  // const incompatibleConditions = [
  //   'incompatibleCondition',
  //   'note2Condition',
  //   'note4Condition',
  //   'note6Condition',
  // ];
  if (results.events.some((result) => result.type === 'note1Condition')) {
    return true;
  }
  if (results.events.some((result) => result.type === 'note3Condition')) {
    return true;
  }
  if (results.events.some((result) => result.type === 'note5Condition')) {
    return true;
  }
  if (results.events.some((result) => result.type === 'note8Condition')) {
    return true;
  }
  if (results.events.some((result) => result.type === 'note9Condition')) {
    return true;
  }
  if (results.events.some((result) => result.type === 'note11Condition')) {
    return true;
  }
  if (results.events.some((result) => result.type === 'note12Condition')) {
    return true;
  }
  if (
    results.events.some((result) => result.type === 'incompatibleCondition')
  ) {
    return false;
  }
  if (results.events.some((result) => result.type === 'note2Condition')) {
    return false;
  }
  if (results.events.some((result) => result.type === 'note4Condition')) {
    return false;
  }
  if (results.events.some((result) => result.type === 'note6Condition')) {
    return false;
  }
  if (results.events.some((result) => result.type === 'compatibleCondition')) {
    return true;
  }
  // if (
  //   incompatibleConditions.some((cond) =>
  //     results.events.some((result) => result.type === cond),
  //   )
  // ) {
  //   return false;
  // } else if (
  //   compatibleConditions.some((cond) =>
  //     results.events.some((result) => result.type === cond),
  //   )
  // ) {
  //   return true;
  // }

  // if (
  //   compatibleConditions.some((cond) =>
  //     results.events.some((result) => result.type === cond),
  //   )
  // ) {
  //   return true;
  // } else if (
  //   incompatibleConditions.some((cond) =>
  //     results.events.some((result) => result.type === cond),
  //   )
  // ) {
  //   return false;
  // }
  return false;
};

// export const isChapterThreeCompatible = (results: EngineResult): boolean => {
//   const compatibleConditions = ['chapter3Condition1'];
//   const incompatibleConditions = [
//     'chapter3Condition2',
//     'chapter3Condition3',
//     'chapter3Condition4',
//     'chapter3Condition5',
//   ];

//   if (
//     compatibleConditions.every((cond) =>
//       results.events.some((result) => result.type === cond),
//     )
//   ) {
//     return true;
//   } else if (
//     incompatibleConditions.some((cond) =>
//       results.events.some((result) => result.type === cond),
//     )
//   ) {
//     return false;
//   }
//   return false;
// };

export const pairRequiresSegregation = (results: EngineResult): boolean => {
  const failureEvents = [
    'incompatibleCondition',
    'note1Condition',
    'note2Condition',
    'note3Condition',
    'note4Condition',
    'note6Condition',
    'note12Condition',
  ];

  const segregationConditions = [
    'segregationCondition',
    'note5Condition',
    'note8Condition',
    'note9Condition',
    'note11Condition',
  ];

  if (
    failureEvents.every((cond) =>
      results.failureEvents.some((result) => result.type === cond),
    ) &&
    segregationConditions.some((cond) =>
      results.events.some((result) => result.type === cond),
    )
  ) {
    return true;
  }
  return false;
};

async function isListCompatible(
  shipments: HazmatCompatibilityKey[],
  rules: Rule[],
  // chapterThreeRules: Rule[],
  // chapterThree: boolean,
): Promise<boolean> {
  for (let i = 0; i < shipments.length; i++) {
    for (let j = i + 1; j < shipments.length; j++) {
      const classPair = [
        shipments[i].hazardClassDivisionNumber,
        shipments[j].hazardClassDivisionNumber,
      ];
      const compatibilityGroupPair = [
        shipments[i].compatibilityGroup,
        shipments[j].compatibilityGroup,
      ];
      const unidPair = [shipments[i].unid, shipments[j].unid];
      const psnPair = [
        shipments[i].properShippingName,
        shipments[j].properShippingName,
      ];
      // if (!chapterThree) {
      const engine = new Engine(rules);
      const results = await engine.run({
        unidPair,
        unidPair0: shipments[i].unid,
        unidPair1: shipments[j].unid,
        classPair,
        classPair0: shipments[i].hazardClassDivisionNumber,
        classPair1: shipments[j].hazardClassDivisionNumber,
        compatibilityGroupPair,
        compatibilityGroupPair0: shipments[i].compatibilityGroup,
        compatibilityGroupPair1: shipments[j].compatibilityGroup,
        psnPair,
        psnPair0: shipments[i].properShippingName,
        psnPair1: shipments[j].properShippingName,
        numericSpecialProvisions0: shipments[i].numericSpecialProvision,
        numericSpecialProvisions1: shipments[j].numericSpecialProvision,
      });
      if (!isCompatible(results)) {
        return false;
      }
      // } else {
      //   const engine = new Engine(chapterThreeRules);
      //   const results = await engine.run({
      //     classPair,
      //     psnPair,
      //     unidPair,
      //     compatibilityGroupPair,
      //   });
      //   if (isChapterThreeIncompatible(results)) {
      //     return false;
      //   }
      // }
    }
  }
  return true;
}

async function findIncompatibleHazmatObjectsRecursive(
  hazmatObjects: HazmatCompatibilityKey[],
  rules: Rule[],
  // chapterThreeRules: Rule[],
  // chapterThree: boolean,
): Promise<HazmatCompatibilityKey[]> {
  const cacheKey = JSON.stringify(hazmatObjects);

  // Check if the result is already cached
  if (compatibilityCache.has(cacheKey)) {
    return compatibilityCache.get(cacheKey)!;
  }
  // Base case: if the list is already compatible, return an empty list
  const compatibilityCheck = await isListCompatible(
    hazmatObjects,
    rules,
    // chapterThreeRules,
    // chapterThree,
  );
  if (compatibilityCheck) {
    compatibilityCache.set(cacheKey, []);
    return [];
  }

  let smallestIncompatibles: HazmatCompatibilityKey[] = hazmatObjects;

  for (let i = 0; i < hazmatObjects.length; i++) {
    let temp = [...hazmatObjects];
    temp.splice(i, 1);
    const spreadResults = await findIncompatibleHazmatObjectsRecursive(
      temp,
      rules,
      // chapterThreeRules,
      // chapterThree,
    );
    let result = [hazmatObjects[i], ...spreadResults];
    if (result.length < smallestIncompatibles.length) {
      smallestIncompatibles = result;
    }
  }
  compatibilityCache.set(cacheKey, smallestIncompatibles);

  return smallestIncompatibles;
}

export async function findIncompatibleHazmatObjects(
  hazmatObjects: HazmatCompatibilityKey[],
  rules: Rule[],
  // chapterThreeRules: Rule[],
  // chapterThree: boolean,
): Promise<HazmatCompatibilityKey[]> {
  const result = await findIncompatibleHazmatObjectsRecursive(
    hazmatObjects,
    rules,
    // chapterThreeRules,
    // chapterThree,
  );
  return result;
}
