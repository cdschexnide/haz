import { runGraphEngineOptimized, clearCache } from '../optimizedEngine';
import { COMPATIBILITY_GROUPS, HazmatCompatibilityKey } from '../engineTypes';

function createMaterial(
  hazardClass: string,
  unid: string,
  psn: string,
  compatibilityGroup: typeof COMPATIBILITY_GROUPS[number]
): HazmatCompatibilityKey {
  return {
    hazardClassDivisionNumber: hazardClass,
    unid,
    properShippingName: psn,
    compatibilityGroup: compatibilityGroup,
    numericSpecialProvision: 'N/A',
  };
}

// Helper function to evaluate a pair and return the result
async function evaluatePair(material1: HazmatCompatibilityKey, material2: HazmatCompatibilityKey) {
  const result = await runGraphEngineOptimized([material1, material2], [], false);
  return {
    incompatible: result.hazmatCompatibilityKeys.length > 0,
    requiresSegregation: result.segregatedHazmatMaterials.length > 0,
    segregationMessage: result.segregatedHazmatMaterials[0]?.segregationDescription || 'N/A',
    noteCondition: result.segregatedHazmatMaterials[0]?.noteCondition || null,
  };
}
// tested and verified
describe('PHASE 1: Class 1.1 Relationships (Table A18.1)', () => {
  beforeEach(() => {
    clearCache();
  });
  describe('1.1 - Incompatible Pairs (X) - Cannot be loaded together', () => {
    test('Class 1.1D + Class 1.3G = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D');
      const class13 = createMaterial('1.3', 'UN0010', 'AMMUNITION, INCENDIARY', 'G');

      const result = await evaluatePair(class11, class13);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 1.5D = Compatible', async () => {
      const class11 = createMaterial('1.1', 'UN0027', 'BLACK POWDER, GUNPOWDER', 'D');
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');

      const result = await evaluatePair(class11, class15);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 2.1 (Flammable Gases) = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0033', 'BOMBS', 'D');
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');

      const result = await evaluatePair(class11, class21);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 2.2 (Non-Flammable Gases) = Compatible', async () => {
      const class11 = createMaterial('1.1', 'UN0042', 'BOOSTERS', 'D');
      const class22 = createMaterial('2.2', 'UN1066', 'NITROGEN, COMPRESSED', 'N/A');

      const result = await evaluatePair(class11, class22);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 2.3 Gas Zone A = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0048', 'CHARGES, DEMOLITION', 'D');
      const class23ZoneA = createMaterial('2.3', 'UN1092', 'ACROLEIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class11, class23ZoneA);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 2.3 Gas Other than Zone A = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0059', 'CHARGES, SHAPED', 'D');
      const class23Other = createMaterial('2.3', 'UN1098', 'ALLYL ALCOHOL', 'N/A');

      const result = await evaluatePair(class11, class23Other);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 3 (Flammable Liquids) = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0065', 'CORD, DETONATING', 'D');
      const class3 = createMaterial('3', 'UN1090', 'ACETONE', 'N/A');

      const result = await evaluatePair(class11, class3);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 4.1 (Flammable Solids) = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0074', 'DIAZODINITROPHENOL, WETTED', 'D');
      const class41 = createMaterial('4.1', 'UN1325', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'N/A');

      const result = await evaluatePair(class11, class41);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 4.2 (Spontaneously Combustible) = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0081', 'EXPLOSIVE, BLASTING, TYPE A', 'D');
      const class42 = createMaterial('4.2', 'UN1369', 'p-NITROSODIMETHYLANILINE', 'N/A');

      const result = await evaluatePair(class11, class42);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 4.3 (Dangerous When Wet) = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0094', 'FLASH POWDER', 'G');
      const class43 = createMaterial('4.3', 'UN1428', 'SODIUM', 'N/A');

      const result = await evaluatePair(class11, class43);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 5.1 (Oxidizers) = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0106', 'FUZES, DETONATING', 'B');
      const class51 = createMaterial('5.1', 'UN1479', 'OXIDIZING SOLID, N.O.S.', 'N/A');

      const result = await evaluatePair(class11, class51);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 5.2 (Organic Peroxides) = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0113', 'GUANYL NITROSAMINOGUANYLIDENE HYDRAZINE, WETTED', 'D');
      const class52 = createMaterial('5.2', 'UN3109', 'ORGANIC PEROXIDE TYPE F, LIQUID', 'N/A');

      const result = await evaluatePair(class11, class52);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 6.1 (Toxic Materials) = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0121', 'IGNITERS', 'B');
      const class61 = createMaterial('6.1', 'UN1541', 'ACETONE CYANOHYDRIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class11, class61);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 7 (Radioactive) = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0129', 'LEAD AZIDE', 'B');
      const class7 = createMaterial('7', 'UN2912', 'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY', 'N/A');

      const result = await evaluatePair(class11, class7);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 8 (Corrosives) = Incompatible', async () => {
      const class11 = createMaterial('1.1', 'UN0133', 'MANNITOL HEXANITRATE, WETTED', 'D');
      const class8 = createMaterial('8', 'UN1715', 'ACETIC ANHYDRIDE', 'N/A');

      const result = await evaluatePair(class11, class8);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });
  });

  describe('1.2 - Segregation Pairs (O) - Requires segregation', () => {
    test('Class 1.1D + Class 9 (UN3480/UN3090 only) = Segregation Required', async () => {
      const class11 = createMaterial('1.1', 'UN0137', 'MINES', 'D');
      const class9 = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES', 'N/A');

      const result = await evaluatePair(class11, class9);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.segregationMessage).toContain('Segregate lithium batteries');
      expect(result.noteCondition).toBe('note11');
    });
  });

  describe('1.3 - Compatible Pairs (Blank) - No restrictions', () => {
    test('Class 1.1D + Class 1.1D (same compatibility group) = Compatible', async () => {
      const class11a = createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D');
      const class11b = createMaterial('1.1', 'UN0027', 'BLACK POWDER, GUNPOWDER', 'D');

      const result = await evaluatePair(class11a, class11b);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 1.2D (compatible groups) = Compatible', async () => {
      const class11 = createMaterial('1.1', 'UN0033', 'BOMBS', 'D');
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');

      const result = await evaluatePair(class11, class12);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 1.4S (compatible groups) = Compatible', async () => {
      const class11 = createMaterial('1.1', 'UN0042', 'BOOSTERS', 'D');
      const class14 = createMaterial('1.4', 'UN0297', 'AMMUNITION, ILLUMINATING', 'S');

      const result = await evaluatePair(class11, class14);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.1D + Class 1.6N = Compatible', async () => {
      const class11 = createMaterial('1.1', 'UN0048', 'CHARGES, DEMOLITION', 'D');
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');

      const result = await evaluatePair(class11, class16);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });
  });
});

describe('PHASE 2: Class 1.2 Relationships (Table A18.1)', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('2.1 - Incompatible Pairs (X)', () => {
    test('Class 1.2D + Class 1.3G = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');
      const class13 = createMaterial('1.3', 'UN0010', 'AMMUNITION, INCENDIARY', 'G');

      const result = await evaluatePair(class12, class13);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2G + Class 1.5D = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0171', 'AMMUNITION, ILLUMINATING', 'G');
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');

      const result = await evaluatePair(class12, class15);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2H + Class 2.1 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0243', 'AMMUNITION, INCENDIARY, WHITE PHOSPHOROUS', 'H');
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');

      const result = await evaluatePair(class12, class21);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2D + Class 2.2 = Compatible', async () => {
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');
      const class22 = createMaterial('2.2', 'UN1066', 'NITROGEN, COMPRESSED', 'N/A');

      const result = await evaluatePair(class12, class22);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2G + Class 2.3 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0171', 'AMMUNITION, ILLUMINATING', 'G');
      const class23 = createMaterial('2.3', 'UN1092', 'ACROLEIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class12, class23);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2H + Class 3 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0243', 'AMMUNITION, INCENDIARY, WHITE PHOSPHOROUS', 'H');
      const class3 = createMaterial('3', 'UN1090', 'ACETONE', 'N/A');

      const result = await evaluatePair(class12, class3);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2D + Class 4.1 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');
      const class41 = createMaterial('4.1', 'UN1325', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'N/A');

      const result = await evaluatePair(class12, class41);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2G + Class 4.2 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0171', 'AMMUNITION, ILLUMINATING', 'G');
      const class42 = createMaterial('4.2', 'UN1369', 'p-NITROSODIMETHYLANILINE', 'N/A');

      const result = await evaluatePair(class12, class42);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2H + Class 4.3 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0243', 'AMMUNITION, INCENDIARY, WHITE PHOSPHOROUS', 'H');
      const class43 = createMaterial('4.3', 'UN1428', 'SODIUM', 'N/A');

      const result = await evaluatePair(class12, class43);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2D + Class 5.1 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');
      const class51 = createMaterial('5.1', 'UN1479', 'OXIDIZING SOLID, N.O.S.', 'N/A');

      const result = await evaluatePair(class12, class51);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2G + Class 5.2 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0171', 'AMMUNITION, ILLUMINATING', 'G');
      const class52 = createMaterial('5.2', 'UN3109', 'ORGANIC PEROXIDE TYPE F, LIQUID', 'N/A');

      const result = await evaluatePair(class12, class52);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2H + Class 6.1 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0243', 'AMMUNITION, INCENDIARY, WHITE PHOSPHOROUS', 'H');
      const class61 = createMaterial('6.1', 'UN1541', 'ACETONE CYANOHYDRIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class12, class61);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2D + Class 7 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');
      const class7 = createMaterial('7', 'UN2912', 'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY', 'N/A');

      const result = await evaluatePair(class12, class7);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2G + Class 8 = Incompatible', async () => {
      const class12 = createMaterial('1.2', 'UN0171', 'AMMUNITION, ILLUMINATING', 'G');
      const class8 = createMaterial('8', 'UN1715', 'ACETIC ANHYDRIDE', 'N/A');

      const result = await evaluatePair(class12, class8);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });
  });

  describe('2.2 - Segregation Pairs (O)', () => {
    test('Class 1.2H + Class 9 = Segregation Required', async () => {
      const class12 = createMaterial('1.2', 'UN0243', 'AMMUNITION, INCENDIARY, WHITE PHOSPHOROUS', 'H');
      const class9 = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES', 'N/A');

      const result = await evaluatePair(class12, class9);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note11');
    });
  });

  describe('2.3 - Compatible Pairs (Blank)', () => {
    test('Class 1.2D + Class 1.1D = Compatible', async () => {
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');
      const class11 = createMaterial('1.1', 'UN0027', 'BLACK POWDER, GUNPOWDER', 'D');

      const result = await evaluatePair(class12, class11);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2D + Class 1.2H = Incompatible', async () => {
      const class12a = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');
      const class12b = createMaterial('1.2', 'UN0243', 'AMMUNITION, INCENDIARY, WHITE PHOSPHOROUS', 'H');

      const result = await evaluatePair(class12a, class12b);

      expect(result.incompatible).toBe(true); 
    });

    test('Class 1.2D + Class 1.2D = Compatible', async () => {
      const class12a = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');
      const class12b = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');

      const result = await evaluatePair(class12a, class12b);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2H + Class 1.4S = Compatible', async () => {
      const class12 = createMaterial('1.2', 'UN0243', 'AMMUNITION, INCENDIARY, WHITE PHOSPHOROUS', 'H');
      const class14 = createMaterial('1.4', 'UN0297', 'AMMUNITION, ILLUMINATING', 'S');

      const result = await evaluatePair(class12, class14);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.2D + Class 1.6N = Compatible', async () => {
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');

      const result = await evaluatePair(class12, class16);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });
  });
});

describe('PHASE 3: Class 1.3 Relationships (Table A18.1)', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('3.1 - Incompatible Pairs (X) - Cannot be loaded together', () => {
    test('Class 1.3G + Class 1.1D = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0010', 'AMMUNITION, INCENDIARY', 'G');
      const class11 = createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D');

      const result = await evaluatePair(class13, class11);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3C + Class 1.2D = Compatible', async () => {
      const class13 = createMaterial('1.3', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'C');
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');

      const result = await evaluatePair(class13, class12);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3C + Class 1.5D = Compatible', async () => {
      const class13 = createMaterial('1.3', 'UN0242', 'CHARGES, PROPELLING', 'C');
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');

      const result = await evaluatePair(class13, class15);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3D + Class 2.1 (Flammable Gases) = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0161', 'POWDER CAKE, WETTED', 'D');
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');

      const result = await evaluatePair(class13, class21);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3C + Class 2.2 (Non-Flammable Gases) = Compatible', async () => {
      const class13 = createMaterial('1.3', 'UN0240', 'ROCKETS, LINE-THROWING', 'C');
      const class22 = createMaterial('2.2', 'UN1066', 'NITROGEN, COMPRESSED', 'N/A');

      const result = await evaluatePair(class13, class22);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3B + Class 2.3 Gas Zone A = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0255', 'DETONATORS, ELECTRIC', 'B');
      const class23ZoneA = createMaterial('2.3', 'UN1092', 'ACROLEIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class13, class23ZoneA);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3G + Class 2.3 Gas Other than Zone A = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0312', 'CARTRIDGES, SIGNAL', 'G');
      const class23Other = createMaterial('2.3', 'UN1098', 'ALLYL ALCOHOL', 'N/A');

      const result = await evaluatePair(class13, class23Other);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3G + Class 3 (Flammable Liquids) = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0403', 'FLARES, AERIAL', 'G');
      const class3 = createMaterial('3', 'UN1090', 'ACETONE', 'N/A');

      const result = await evaluatePair(class13, class3);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3G + Class 4.1 (Flammable Solids) = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0431', 'AMMUNITION, ILLUMINATING', 'G');
      const class41 = createMaterial('4.1', 'UN1325', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'N/A');

      const result = await evaluatePair(class13, class41);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3G + Class 4.2 (Spontaneously Combustible) = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0454', 'IGNITERS', 'G');
      const class42 = createMaterial('4.2', 'UN1369', 'p-NITROSODIMETHYLANILINE', 'N/A');

      const result = await evaluatePair(class13, class42);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3G + Class 4.3 (Dangerous When Wet) = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0487', 'SIGNALS, SMOKE', 'G');
      const class43 = createMaterial('4.3', 'UN1428', 'SODIUM', 'N/A');

      const result = await evaluatePair(class13, class43);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3G + Class 5.1 (Oxidizers) = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0505', 'SIGNALS, DISTRESS, ship', 'G');
      const class51 = createMaterial('5.1', 'UN1479', 'OXIDIZING SOLID, N.O.S.', 'N/A');

      const result = await evaluatePair(class13, class51);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3G + Class 5.2 (Organic Peroxides) = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0507', 'SIGNALS, SMOKE', 'G');
      const class52 = createMaterial('5.2', 'UN3109', 'ORGANIC PEROXIDE TYPE F, LIQUID', 'N/A');

      const result = await evaluatePair(class13, class52);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3G + Class 6.1 (Toxic Materials) = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0010', 'AMMUNITION, INCENDIARY', 'G');
      const class61 = createMaterial('6.1', 'UN1541', 'ACETONE CYANOHYDRIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class13, class61);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3C + Class 8 (Corrosives) = Incompatible', async () => {
      const class13 = createMaterial('1.3', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'C');
      const class8 = createMaterial('8', 'UN1715', 'ACETIC ANHYDRIDE', 'N/A');

      const result = await evaluatePair(class13, class8);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });
  });

  describe('3.2 - Segregation Pairs (O) - Requires segregation', () => {
    test('Class 1.3C + Class 7 (Radioactive) = Segregation Required', async () => {
      const class13 = createMaterial('1.3', 'UN0242', 'CHARGES, PROPELLING', 'C');
      const class7 = createMaterial('7', 'UN2912', 'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY', 'N/A');

      const result = await evaluatePair(class13, class7);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 1.3D + Class 9 (UN3480/UN3090) = Segregation Required', async () => {
      const class13 = createMaterial('1.3', 'UN0161', 'POWDER CAKE, WETTED', 'D');
      const class9 = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES', 'N/A');

      const result = await evaluatePair(class13, class9);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note11');
    });
  });

  describe('3.3 - Compatible Pairs (Blank) - No restrictions', () => {
    test('Class 1.3C + Class 1.3C = Compatible', async () => {
      const class13a = createMaterial('1.3', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'C');
      const class13b = createMaterial('1.3', 'UN0242', 'CHARGES, PROPELLING', 'C');

      const result = await evaluatePair(class13a, class13b);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3C + Class 1.3D = Compatible', async () => {
      const class13c = createMaterial('1.3', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'C');
      const class13d = createMaterial('1.3', 'UN0161', 'POWDER CAKE, WETTED', 'D');

      const result = await evaluatePair(class13c, class13d);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3C + Class 1.4S = Compatible', async () => {
      const class13 = createMaterial('1.3', 'UN0242', 'CHARGES, PROPELLING', 'C');
      const class14 = createMaterial('1.4', 'UN0297', 'AMMUNITION, ILLUMINATING', 'S');

      const result = await evaluatePair(class13, class14);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.3C + Class 1.6N = Compatible', async () => {
      const class13 = createMaterial('1.3', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'C');
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');

      const result = await evaluatePair(class13, class16);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });
  });
});

describe('PHASE 4: Class 1.4 Relationships (Table A18.1)', () => {
  beforeEach(() => {
    clearCache();
  });

  // Class 1.4 has no incompatible relationships

  describe('4.2 - Segregation Pairs (O) - Requires segregation', () => {
    test('Class 1.4S + Class 2.1 = Segregation Required', async () => {
      const class14 = createMaterial('1.4', 'UN0012', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE', 'S');
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');

      const result = await evaluatePair(class14, class21);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 1.4S + Class 2.2 = No Segregation Required', async () => {
      const class14 = createMaterial('1.4', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'S');
      const class22 = createMaterial('2.2', 'UN1066', 'NITROGEN, COMPRESSED', 'N/A');

      const result = await evaluatePair(class14, class22);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4S + Class 2.3 Gas Zone A = Segregation Required', async () => {
      const class14 = createMaterial('1.4', 'UN0044', 'PRIMERS, CAP TYPE', 'S');
      const class23ZoneA = createMaterial('2.3', 'UN1092', 'ACROLEIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class14, class23ZoneA);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 1.4S + Class 2.3 Gas Other than Zone A = Segregation Required', async () => {
      const class14 = createMaterial('1.4', 'UN0055', 'CASES, CARTRIDGE, EMPTY, WITH PRIMER', 'S');
      const class23Other = createMaterial('2.3', 'UN1098', 'ALLYL ALCOHOL', 'N/A');

      const result = await evaluatePair(class14, class23Other);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 1.4S + Class 3 = Segregation Required', async () => {
      const class14 = createMaterial('1.4', 'UN0070', 'CUTTERS, CABLE, EXPLOSIVE', 'S');
      const class3 = createMaterial('3', 'UN1090', 'ACETONE', 'N/A');

      const result = await evaluatePair(class14, class3);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 1.4S + Class 4.2 = Segregation Required', async () => {
      const class14 = createMaterial('1.4', 'UN0106', 'FUZES, DETONATING', 'S');
      const class42 = createMaterial('4.2', 'UN1369', 'p-NITROSODIMETHYLANILINE', 'N/A');

      const result = await evaluatePair(class14, class42);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 1.4S + Class 6.1 = Segregation Required', async () => {
      const class14 = createMaterial('1.4', 'UN0297', 'AMMUNITION, ILLUMINATING', 'S');
      const class61 = createMaterial('6.1', 'UN1541', 'ACETONE CYANOHYDRIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class14, class61);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 1.4S + Class 8 = Segregation Required', async () => {
      const class14 = createMaterial('1.4', 'UN0312', 'CARTRIDGES, SIGNAL', 'S');
      const class8 = createMaterial('8', 'UN1715', 'ACETIC ANHYDRIDE', 'N/A');

      const result = await evaluatePair(class14, class8);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });

    test('Class 1.4S + Class 9 = Segregation Required', async () => {
      const class14 = createMaterial('1.4', 'UN0323', 'CARTRIDGES, POWER DEVICE', 'S');
      const class9 = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES', 'N/A');

      const result = await evaluatePair(class14, class9);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
    });
  });

  describe('4.3 - Compatible Pairs (Blank) - No restrictions', () => {
    test('Class 1.4S + Class 1.1D = Compatible', async () => {
      const class14 = createMaterial('1.4', 'UN0012', 'CARTRIDGES FOR WEAPONS, INERT PROJECTILE', 'S');
      const class11 = createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D');

      const result = await evaluatePair(class14, class11);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4S + Class 1.2D = Compatible', async () => {
      const class14 = createMaterial('1.4', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'S');
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');

      const result = await evaluatePair(class14, class12);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4S + Class 1.3C = Compatible', async () => {
      const class14 = createMaterial('1.4', 'UN0044', 'PRIMERS, CAP TYPE', 'S');
      const class13 = createMaterial('1.3', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'C');

      const result = await evaluatePair(class14, class13);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4S + Class 1.4S (same compatibility group) = Compatible', async () => {
      const class14a = createMaterial('1.4', 'UN0055', 'CASES, CARTRIDGE, EMPTY, WITH PRIMER', 'S');
      const class14b = createMaterial('1.4', 'UN0070', 'CUTTERS, CABLE, EXPLOSIVE', 'S');

      const result = await evaluatePair(class14a, class14b);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4D + Class 1.5D = Compatible', async () => {
      const class14 = createMaterial('1.4', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'D');
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');

      const result = await evaluatePair(class14, class15);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4S + Class 1.6N = Compatible', async () => {
      const class14 = createMaterial('1.4', 'UN0106', 'FUZES, DETONATING', 'S');
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');

      const result = await evaluatePair(class14, class16);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4S + Class 4.1 = Compatible', async () => {
      const class14 = createMaterial('1.4', 'UN0297', 'AMMUNITION, ILLUMINATING', 'S');
      const class41 = createMaterial('4.1', 'UN1325', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'N/A');

      const result = await evaluatePair(class14, class41);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4S + Class 4.3 = Compatible', async () => {
      const class14 = createMaterial('1.4', 'UN0312', 'CARTRIDGES, SIGNAL', 'S');
      const class43 = createMaterial('4.3', 'UN1428', 'SODIUM', 'N/A');

      const result = await evaluatePair(class14, class43);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4S + Class 5.1 = Compatible', async () => {
      const class14 = createMaterial('1.4', 'UN0323', 'CARTRIDGES, POWER DEVICE', 'S');
      const class51 = createMaterial('5.1', 'UN1479', 'OXIDIZING SOLID, N.O.S.', 'N/A');

      const result = await evaluatePair(class14, class51);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4S + Class 5.2 = Compatible', async () => {
      const class14 = createMaterial('1.4', 'UN0337', 'FIREWORKS', 'S');
      const class52 = createMaterial('5.2', 'UN3109', 'ORGANIC PEROXIDE TYPE F, LIQUID', 'N/A');

      const result = await evaluatePair(class14, class52);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.4S + Class 7 = Compatible', async () => {
      const class14 = createMaterial('1.4', 'UN0349', 'ARTICLES, EXPLOSIVE, N.O.S.', 'S');
      const class7 = createMaterial('7', 'UN2912', 'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY', 'N/A');

      const result = await evaluatePair(class14, class7);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });
  });
});

describe('PHASE 5: Class 1.5 Relationships (Table A18.1)', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('5.1 - Incompatible Pairs (X) - Cannot be loaded together', () => {
    test('Class 1.5D + Class 2.1 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');

      const result = await evaluatePair(class15, class21);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 2.2 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class22 = createMaterial('2.2', 'UN1066', 'NITROGEN, COMPRESSED', 'N/A');

      const result = await evaluatePair(class15, class22);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 2.3 Gas Zone A = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class23ZoneA = createMaterial('2.3', 'UN1092', 'ACROLEIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class15, class23ZoneA);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 2.3 Gas Other than Zone A = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class23Other = createMaterial('2.3', 'UN1098', 'ALLYL ALCOHOL', 'N/A');

      const result = await evaluatePair(class15, class23Other);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 3 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class3 = createMaterial('3', 'UN1090', 'ACETONE', 'N/A');

      const result = await evaluatePair(class15, class3);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 4.1 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class41 = createMaterial('4.1', 'UN1325', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'N/A');

      const result = await evaluatePair(class15, class41);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 4.2 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class42 = createMaterial('4.2', 'UN1369', 'p-NITROSODIMETHYLANILINE', 'N/A');

      const result = await evaluatePair(class15, class42);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 4.3 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class43 = createMaterial('4.3', 'UN1428', 'SODIUM', 'N/A');

      const result = await evaluatePair(class15, class43);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 5.1 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class51 = createMaterial('5.1', 'UN1479', 'OXIDIZING SOLID, N.O.S.', 'N/A');

      const result = await evaluatePair(class15, class51);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 5.2 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class52 = createMaterial('5.2', 'UN3109', 'ORGANIC PEROXIDE TYPE F, LIQUID', 'N/A');

      const result = await evaluatePair(class15, class52);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 6.1 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class61 = createMaterial('6.1', 'UN1541', 'ACETONE CYANOHYDRIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class15, class61);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 7 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class7 = createMaterial('7', 'UN2912', 'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY', 'N/A');

      const result = await evaluatePair(class15, class7);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 8 = Incompatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class8 = createMaterial('8', 'UN1715', 'ACETIC ANHYDRIDE', 'N/A');

      const result = await evaluatePair(class15, class8);

      expect(result.incompatible).toBe(true);
      expect(result.requiresSegregation).toBe(false);
    });
  });

  describe('5.2 - Segregation Pairs (O) - Requires segregation', () => {
    test('Class 1.5D + Class 9 = Segregation Required', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class9 = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES', 'N/A');

      const result = await evaluatePair(class15, class9);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note11');
    });
  });

  describe('5.3 - Compatible Pairs (Blank) - No restrictions', () => {
    test('Class 1.5D + Class 1.1D = Compatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class11 = createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D');

      const result = await evaluatePair(class15, class11);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 1.2D = Compatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');

      const result = await evaluatePair(class15, class12);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 1.3C = Compatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class13 = createMaterial('1.3', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'C');

      const result = await evaluatePair(class15, class13);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 1.5D = Compatible', async () => {
      const class15a = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class15b = createMaterial('1.5', 'UN0332', 'EXPLOSIVES, BLASTING, TYPE E', 'D');

      const result = await evaluatePair(class15a, class15b);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });
    test('Class 1.5D + Class 1.4S = Compatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class14 = createMaterial('1.4', 'UN0297', 'AMMUNITION, ILLUMINATING', 'S');

      const result = await evaluatePair(class15, class14);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.5D + Class 1.6N = Compatible', async () => {
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');

      const result = await evaluatePair(class15, class16);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });
  });
});

describe('PHASE 6: Class 1.6 Relationships (Table A18.1)', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('6.2 - Segregation Pairs (O) - Requires segregation', () => {
    test('Class 1.6N + Class 9 = Segregation Required', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class9 = createMaterial('9', 'UN3480', 'LITHIUM ION BATTERIES', 'N/A');

      const result = await evaluatePair(class16, class9);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(true);
      expect(result.noteCondition).toBe('note11');
    });
  });

  describe('6.3 - Compatible Pairs (Blank) - No restrictions', () => {
    test('Class 1.6N + Class 1.1D = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class11 = createMaterial('1.1', 'UN0004', 'AMMONIUM PICRATE', 'D');

      const result = await evaluatePair(class16, class11);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 1.2D = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class12 = createMaterial('1.2', 'UN0009', 'AMMUNITION, INCENDIARY', 'D');

      const result = await evaluatePair(class16, class12);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 1.3C = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class13 = createMaterial('1.3', 'UN0014', 'CARTRIDGES FOR WEAPONS, BLANK', 'C');

      const result = await evaluatePair(class16, class13);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 1.4S = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class14 = createMaterial('1.4', 'UN0297', 'AMMUNITION, ILLUMINATING', 'S');

      const result = await evaluatePair(class16, class14);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 1.5D = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class15 = createMaterial('1.5', 'UN0331', 'EXPLOSIVES, BLASTING, TYPE B', 'D');

      const result = await evaluatePair(class16, class15);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 1.6N (same group) = Compatible', async () => {
      const class16a = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class16b = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');

      const result = await evaluatePair(class16a, class16b);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 2.1 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class21 = createMaterial('2.1', 'UN1011', 'BUTANE', 'N/A');

      const result = await evaluatePair(class16, class21);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 2.2 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class22 = createMaterial('2.2', 'UN1066', 'NITROGEN, COMPRESSED', 'N/A');

      const result = await evaluatePair(class16, class22);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 2.3 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class23 = createMaterial('2.3', 'UN1092', 'ACROLEIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class16, class23);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 3 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class3 = createMaterial('3', 'UN1090', 'ACETONE', 'N/A');

      const result = await evaluatePair(class16, class3);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 4.1 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class41 = createMaterial('4.1', 'UN1325', 'FLAMMABLE SOLID, ORGANIC, N.O.S.', 'N/A');

      const result = await evaluatePair(class16, class41);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 4.2 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class42 = createMaterial('4.2', 'UN1369', 'p-NITROSODIMETHYLANILINE', 'N/A');

      const result = await evaluatePair(class16, class42);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 4.3 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class43 = createMaterial('4.3', 'UN1428', 'SODIUM', 'N/A');

      const result = await evaluatePair(class16, class43);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 5.1 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class51 = createMaterial('5.1', 'UN1479', 'OXIDIZING SOLID, N.O.S.', 'N/A');

      const result = await evaluatePair(class16, class51);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 5.2 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class52 = createMaterial('5.2', 'UN3109', 'ORGANIC PEROXIDE TYPE F, LIQUID', 'N/A');

      const result = await evaluatePair(class16, class52);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 6.1 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class61 = createMaterial('6.1', 'UN1541', 'ACETONE CYANOHYDRIN, STABILIZED', 'N/A');

      const result = await evaluatePair(class16, class61);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 7 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class7 = createMaterial('7', 'UN2912', 'RADIOACTIVE MATERIAL, LOW SPECIFIC ACTIVITY', 'N/A');

      const result = await evaluatePair(class16, class7);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });

    test('Class 1.6N + Class 8 = Compatible', async () => {
      const class16 = createMaterial('1.6', 'UN0486', 'ARTICLES, EXPLOSIVE, EXTREMELY INSENSITIVE', 'N');
      const class8 = createMaterial('8', 'UN1715', 'ACETIC ANHYDRIDE', 'N/A');

      const result = await evaluatePair(class16, class8);

      expect(result.incompatible).toBe(false);
      expect(result.requiresSegregation).toBe(false);
    });
  });
});
