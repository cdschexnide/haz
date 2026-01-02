import { Engine, Rule } from 'json-rules-engine';
import {
  CheckHazmatPairingsInput,
  HazmatCompatibilityKey,
  HazmatCompatibilityKeyLookup,
  HazmatPairBeforeLookup,
  SegregatedHazmatMaterial,
} from './engineTypes';
import { allHazmatCompatibilityKeys } from './allHazmatCompatibilityKeys';
import {
  // isChapterThreeCompatible,
  isCompatible,
  pairRequiresSegregation,
} from './incompatibilityEngine';
import { rules } from './rules';
import { CheckCompatibleHazmatInput } from './resolvers-types';
import { checkCompatibility } from './checkCompatibility';

type Graph = Map<string, Set<string>>;

const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== 'object' ||
    obj1 === null ||
    typeof obj2 !== 'object' ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

export const buildGraph = (
  hazmatObjects: HazmatCompatibilityKey[],
  compatibilities: Map<string, HazmatCompatibilityKey[]>,
): Graph => {
  const graph: Graph = new Map();

  // Initialize graph with nodes
  for (const hazmatObject of hazmatObjects) {
    graph.set(hazmatObject.unid, new Set());
  }

  // Add edges for compatibilities
  for (const [unid, compatibleHazmats] of compatibilities) {
    for (const compatibleHazmat of compatibleHazmats) {
      graph.get(unid)!.add(compatibleHazmat.unid);
      graph.get(compatibleHazmat.unid)!.add(unid); // Since the relationship is bi-directional
    }
  }

  return graph;
};

type BronKerboschInput = {
  graph: Graph;
  rVertices: Set<string>;
  pVertices: Set<string>;
  xVertices: Set<string>;
  cliques: Set<string>[];
};

// wikipedia link: https://en.wikipedia.org/wiki/Bron%E2%80%93Kerbosch_algorithm
export const bronKerbosch = ({
  graph,
  rVertices,
  pVertices,
  xVertices,
  cliques,
}: BronKerboschInput): Set<string>[] => {
  if (pVertices.size === 0 && xVertices.size === 0) {
    cliques.push(new Set(rVertices));
    return cliques;
  }

  const pivotVertex = choosePivot(graph, pVertices, xVertices);
  const neighborsOfPivotVertex = graph.get(pivotVertex) || new Set();

  for (const pVertex of pVertices) {
    if (!neighborsOfPivotVertex.has(pVertex)) {
      const neighborsOfV = graph.get(pVertex) || new Set();
      const newrVertices = new Set(rVertices).add(pVertex);
      const newpVertices = new Set(
        Array.from(pVertices).filter((pV) => neighborsOfV.has(pV)),
      );
      const newxVertices = new Set(
        Array.from(xVertices).filter((pX) => neighborsOfV.has(pX)),
      );
      bronKerbosch({
        graph,
        rVertices: newrVertices,
        pVertices: newpVertices,
        xVertices: newxVertices,
        cliques,
      });
      pVertices.delete(pVertex);
      xVertices.add(pVertex);
    }
  }

  return cliques;
};

const choosePivot = (
  graph: Graph,
  pVertices: Set<string>,
  xVertices: Set<string>,
): string => {
  let maxDegree = -1;
  let pivotVertex: string | undefined;

  for (const vertex of new Set([...pVertices, ...xVertices])) {
    const degree = graph.get(vertex)?.size || 0;
    if (degree > maxDegree) {
      maxDegree = degree;
      pivotVertex = vertex;
    }
  }

  return pivotVertex!;
};

export const findIncompatibleHazmatCompatibilityKeysFromGraph = (
  hazmatObjects: HazmatCompatibilityKey[],
  maxClique: Set<string>,
): HazmatCompatibilityKey[] => {
  return hazmatObjects.filter((hazmat) => !maxClique.has(hazmat.unid));
};

type CompatibilityMap = Map<string, HazmatCompatibilityKey[]>;

export const findCompatibilities = async (
  hazmatObjects: HazmatCompatibilityKey[],
  chapterThreeAuthorization: boolean,
): Promise<CompatibilityMap> => {
  const compatibilityMap: CompatibilityMap = new Map();

  for (const hazmat of hazmatObjects) {
    compatibilityMap.set(hazmat.unid, []);
  }

  for (let i = 0; i < hazmatObjects.length; i++) {
    for (let j = i + 1; j < hazmatObjects.length; j++) {
      const material1: HazmatCompatibilityKeyLookup =
        allHazmatCompatibilityKeys.find(
          (material: HazmatCompatibilityKeyLookup) => {
            return (
              material.numericSpecialProvision ===
                hazmatObjects[i].numericSpecialProvision &&
              material.hazardClassDivisionNumber ===
                hazmatObjects[i].hazardClassDivisionNumber &&
              material.unid === hazmatObjects[i].unid &&
              (material.compatibilityGroup ===
                hazmatObjects[i].compatibilityGroup ||
                (material.compatibilityGroup === '' &&
                  hazmatObjects[i].compatibilityGroup === 'N/A'))
            );
          },
        ) as HazmatCompatibilityKeyLookup;
      const material2: HazmatCompatibilityKeyLookup =
        allHazmatCompatibilityKeys.find(
          (material: HazmatCompatibilityKeyLookup) => {
            return (
              material.numericSpecialProvision ===
                hazmatObjects[i].numericSpecialProvision &&
              material.hazardClassDivisionNumber ===
                hazmatObjects[j].hazardClassDivisionNumber &&
              material.unid === hazmatObjects[j].unid &&
              (material.compatibilityGroup ===
                hazmatObjects[j].compatibilityGroup ||
                (material.compatibilityGroup === '' &&
                  hazmatObjects[j].compatibilityGroup === 'N/A'))
            );
          },
        ) as HazmatCompatibilityKeyLookup;
      const engine = new Engine(rules);
      // const chapterThreeEngine = new Engine(chapterThreeRules);
      const classPair = [
        material1.hazardClassDivisionNumber,
        material2.hazardClassDivisionNumber,
      ];
      const psnPair = [
        material1.properShippingName,
        material2.properShippingName,
      ];
      const unidPair = [material1.unid, material2.unid];
      const compatibilityGroupPair = [
        material1.compatibilityGroup || 'N/A',
        material2.compatibilityGroup || 'N/A',
      ];
      if (!chapterThreeAuthorization) {
        const results = await engine.run({
          classPair,
          classPair0: classPair[0],
          classPair1: classPair[1],
          psnPair,
          psnPair0: psnPair[0],
          psnPair1: psnPair[1],
          unidPair,
          unidPair0: unidPair[0],
          unidPair1: unidPair[1],
          compatibilityGroupPair,
          compatibilityGroupPair0: compatibilityGroupPair[0],
          compatibilityGroupPair1: compatibilityGroupPair[1],
          numericSpecialProvisions0: material1.numericSpecialProvision,
          numericSpecialProvisions1: material2.numericSpecialProvision,
        });
        const classesAreEqual = classPair[0] === classPair[1];
        const psnsAreEqual = psnPair[0] === psnPair[1];
        const unidsAreEqual = unidPair[0] === unidPair[1];
        const compatibilityGroupsAreEqual =
          compatibilityGroupPair[0] === compatibilityGroupPair[1];
        const hazmatObjectsAreIdentical =
          classesAreEqual &&
          psnsAreEqual &&
          unidsAreEqual &&
          compatibilityGroupsAreEqual;

        if (hazmatObjectsAreIdentical) {
          continue;
        } else {
          if (isCompatible(results)) {
            compatibilityMap.get(hazmatObjects[i].unid)!.push(hazmatObjects[j]);
          }
        }
      } else {
        // const results = await chapterThreeEngine.run({
        //   classPair,
        //   classPair0: classPair[0],
        //   classPair1: classPair[1],
        //   psnPair,
        //   psnPair0: psnPair[0],
        //   psnPair1: psnPair[1],
        //   unidPair,
        //   unidPair0: unidPair[0],
        //   unidPair1: unidPair[1],
        //   compatibilityGroupPair,
        //   compatibilityGroupPair0: compatibilityGroupPair[0],
        //   compatibilityGroupPair1: compatibilityGroupPair[1],
        //   numericSpecialProvisions0: material1.numericSpecialProvision,
        //   numericSpecialProvisions1: material2.numericSpecialProvision,
        // });
        // if (isChapterThreeCompatible(results)) {
        //   compatibilityMap.get(hazmatObjects[i].unid)!.push(hazmatObjects[j]);
        // }
      }
    }
  }
  return compatibilityMap;
};

export const findSegregationHazmatPairs = async ({
  hazmatPairs,
  rules,
  debug,
}: CheckHazmatPairingsInput): Promise<SegregatedHazmatMaterial[]> => {
  debug && console.log('findSegregationHazmatPairs');
  const engine = new Engine(rules);
  const segregationPairs = await Promise.all(
    hazmatPairs.map(async (pair) => {
      const classPair = [
        pair[0].hazardClassDivisionNumber,
        pair[1].hazardClassDivisionNumber,
      ];
      const psnPair = [pair[0].properShippingName, pair[1].properShippingName];
      const unidPair = [pair[0].unid, pair[1].unid];
      const compatibilityGroupPair = [
        pair[0].compatibilityGroup || 'N/A',
        pair[1].compatibilityGroup || 'N/A',
      ];
      const results = await engine.run({
        classPair,
        classPair0: classPair[0],
        classPair1: classPair[1],
        psnPair,
        psnPair0: psnPair[0],
        psnPair1: psnPair[1],
        unidPair,
        unidPair0: unidPair[0],
        unidPair1: unidPair[1],
        compatibilityGroupPair,
        compatibilityGroupPair0: compatibilityGroupPair[0],
        compatibilityGroupPair1: compatibilityGroupPair[1],
        numericSpecialProvisions0: pair[0].numericSpecialProvision,
        numericSpecialProvisions1: pair[1].numericSpecialProvision,
      });
      if (pairRequiresSegregation(results)) {
        return {
          hazmatObjectPair: pair,
          segregationDescription: results.events[1].params?.message || '',
        };
      }
      return null;
    }),
  );
  const segregationPairsFiltered = segregationPairs.filter((s) => s !== null);
  return segregationPairsFiltered as SegregatedHazmatMaterial[];
};

export const splitHazmatCompatibilityKeysIntoPairs = (
  hazmatObjects: HazmatCompatibilityKey[],
  debug?: boolean,
): HazmatPairBeforeLookup[] => {
  debug && console.log('splitHazmatCompatibilityKeysIntoPairs');
  const combinationArray: HazmatPairBeforeLookup[] = [];
  for (let i = 0; i < hazmatObjects.length; i++) {
    for (let j = i + 1; j < hazmatObjects.length; j++) {
      const material1: HazmatCompatibilityKey = {
        compatibilityGroup:
          hazmatObjects[i].compatibilityGroup === 'N/A'
            ? 'N/A'
            : hazmatObjects[i].compatibilityGroup,
        hazardClassDivisionNumber: hazmatObjects[i].hazardClassDivisionNumber,
        properShippingName: hazmatObjects[i].properShippingName,
        unid: hazmatObjects[i].unid,
        numericSpecialProvision: hazmatObjects[i].numericSpecialProvision,
      };
      const material2: HazmatCompatibilityKey = {
        compatibilityGroup:
          hazmatObjects[j].compatibilityGroup === 'N/A'
            ? 'N/A'
            : hazmatObjects[j].compatibilityGroup,
        hazardClassDivisionNumber: hazmatObjects[j].hazardClassDivisionNumber,
        properShippingName: hazmatObjects[j].properShippingName,
        unid: hazmatObjects[j].unid,
        numericSpecialProvision: hazmatObjects[i].numericSpecialProvision,
      };
      const hazmatPair: HazmatPairBeforeLookup = [material1, material2];
      combinationArray.push(hazmatPair);
    }
  }
  return combinationArray;
};

export const parseNumericSpecialProvisionCode = (input: string): string => {
  const elements = input.split(', ');

  const targetElements = new Set(['1', '2', '3', '4', '5']);

  for (const element of elements) {
    if (targetElements.has(element)) {
      return element;
    }
  }

  return '';
};

export const findIncompatibilities = async (
  hazmatObjects: HazmatCompatibilityKey[],
  rules: Rule[],
): Promise<Set<string>> => {
  const incompatibilitySet: Set<string> = new Set();

  for (let i = 0; i < hazmatObjects.length; i++) {
    for (let j = i + 1; j < hazmatObjects.length; j++) {
      const engine = new Engine(rules);
      const material1 = hazmatObjects[i];
      const material2 = hazmatObjects[j];

      const results = await engine.run({
        unidPair: [material1.unid, material2.unid],
        unidPair0: hazmatObjects[i].unid,
        unidPair1: hazmatObjects[j].unid,
        classPair: [
          material1.hazardClassDivisionNumber,
          material2.hazardClassDivisionNumber,
        ],
        classPair0: hazmatObjects[i].hazardClassDivisionNumber,
        classPair1: hazmatObjects[j].hazardClassDivisionNumber,
        compatibilityGroupPair: [
          material1.compatibilityGroup || 'N/A',
          material2.compatibilityGroup || 'N/A',
        ],
        compatibilityGroupPair0: hazmatObjects[i].compatibilityGroup,
        compatibilityGroupPair1: hazmatObjects[j].compatibilityGroup,
        numericSpecialProvisions0: hazmatObjects[i].numericSpecialProvision,
        numericSpecialProvisions1: hazmatObjects[j].numericSpecialProvision,
        psnPair: [material1.properShippingName, material2.properShippingName],
        psnPair0: material1.properShippingName,
        psnPair1: material2.properShippingName,
      });

      if (!isCompatible(results)) {
        incompatibilitySet.add(material1.unid);
        incompatibilitySet.add(material2.unid);
      }
    }
  }

  return incompatibilitySet;
};

export const calculateIncompatiblePairs = async (
  hazmatObjects: HazmatCompatibilityKey[],
  rules: Rule[],
  debug?: boolean,
): Promise<HazmatPairBeforeLookup[]> => {
  const incompatiblePairs: HazmatPairBeforeLookup[] = [];

  for (let i = 0; i < hazmatObjects.length; i++) {
    for (let j = i + 1; j < hazmatObjects.length; j++) {
      const engine = new Engine(rules);
      const material1 = hazmatObjects[i];
      const material2 = hazmatObjects[j];

      const results = await engine.run({
        unidPair: [material1.unid, material2.unid],
        unidPair0: hazmatObjects[i].unid,
        unidPair1: hazmatObjects[j].unid,
        classPair: [
          material1.hazardClassDivisionNumber,
          material2.hazardClassDivisionNumber,
        ],
        classPair0: hazmatObjects[i].hazardClassDivisionNumber,
        classPair1: hazmatObjects[j].hazardClassDivisionNumber,
        compatibilityGroupPair: [
          material1.compatibilityGroup || 'N/A',
          material2.compatibilityGroup || 'N/A',
        ],
        compatibilityGroupPair0: hazmatObjects[i].compatibilityGroup,
        compatibilityGroupPair1: hazmatObjects[j].compatibilityGroup,
        numericSpecialProvisions0: hazmatObjects[i].numericSpecialProvision,
        numericSpecialProvisions1: hazmatObjects[j].numericSpecialProvision,
      });

      if (!deepEqual(material1, material2) && !isCompatible(results)) {
        incompatiblePairs.push([material1, material2]);
      }

      if (
        material1.hazardClassDivisionNumber.startsWith('1') ||
        material2.hazardClassDivisionNumber.startsWith('1')
      ) {
        const class1CompatibilityResult = checkCompatibility(
          [material1, material2],
          debug,
        );
        if (class1CompatibilityResult.length > 0) {
          incompatiblePairs.push([material1, material2]);
        }
      }
    }
  }

  return incompatiblePairs;
};

export const findMinimalIncompatibleSet = (
  hazmatObjects: HazmatCompatibilityKey[],
  incompatibilitySet: Set<string>,
): HazmatCompatibilityKey[] => {
  const compatibleSet: Set<string> = new Set(
    hazmatObjects.map((hazmat) => hazmat.unid),
  );

  // Remove all incompatible items from the compatible set
  for (const incompatibleUnid of incompatibilitySet) {
    compatibleSet.delete(incompatibleUnid);
  }

  // Collect all hazmat objects that are part of the incompatible set
  const incompatibleHazmatObjects = hazmatObjects.filter(
    (hazmat) => !compatibleSet.has(hazmat.unid),
  );

  return incompatibleHazmatObjects;
};

export const addNumericSpecialProvisionsToHazmatObjects = (
  input: CheckCompatibleHazmatInput[],
) => {
  const hazmatCompatibilityKeys: HazmatCompatibilityKey[] = input.map(
    (obj: any) => ({
      compatibilityGroup: obj.compatibilityGroup,
      hazardClassDivisionNumber: obj.hazardClassDivisionNumber,
      properShippingName: obj.properShippingName,
      unid: obj.unid,
      numericSpecialProvision: parseNumericSpecialProvisionCode(
        String(
          allHazmatCompatibilityKeys.find((key) => {
            if (
              key.compatibilityGroup === obj.compatibilityGroup &&
              key.hazardClassDivisionNumber === obj.hazardClassDivisionNumber &&
              key.properShippingName === obj.properShippingName &&
              key.unid === obj.unid
            ) {
              return key;
            }
            return null;
          })?.numericSpecialProvision,
        ),
      ),
    }),
  );
  return hazmatCompatibilityKeys;
};
