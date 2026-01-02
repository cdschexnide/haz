import { AnyConditions, Rule } from 'json-rules-engine';
import {
  class_2_3_Zone_A_Gases,
  class_2_3_Zone_B_C_D_Gases,
  class_6_PGI_Liquids,
  class_8_Corrosive_Liquids,
} from './exceptions';

export const incompatibleConditions = {
  any: [
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '1.1' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.3',
            },
            { fact: 'classPair', operator: 'contains', value: '3' },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.2',
            },
            class_6_PGI_Liquids,
            { fact: 'classPair', operator: 'contains', value: '7' },
            class_8_Corrosive_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '1.2' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.3',
            },
            { fact: 'classPair', operator: 'contains', value: '3' },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.2',
            },
            class_6_PGI_Liquids,
            { fact: 'classPair', operator: 'contains', value: '7' },
            class_8_Corrosive_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '1.3' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.3',
            },
            { fact: 'classPair', operator: 'contains', value: '3' },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.2',
            },
            class_6_PGI_Liquids,
            class_8_Corrosive_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '1.5' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.3',
            },
            { fact: 'classPair', operator: 'contains', value: '3' },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.2',
            },
            class_6_PGI_Liquids,
            { fact: 'classPair', operator: 'contains', value: '7' },
            class_8_Corrosive_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '2.1' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            /* Gas Zone A ONLY */
            class_2_3_Zone_A_Gases,
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '2.2' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
          ],
        },
      ],
    },
    /* Gas Zone A */
    {
      all: [
        class_2_3_Zone_A_Gases,
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.2',
            },
            class_8_Corrosive_Liquids,
          ],
        },
      ],
    },
    /* Other than Gas Zone A */
    {
      all: [
        class_2_3_Zone_B_C_D_Gases,
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
          ],
        },
      ],
    },
    {
      all: [
        {
          fact: 'classPair',
          operator: 'contains',
          value: '3',
        },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            /* Gas Zone A ONLY */
            class_2_3_Zone_A_Gases,
            class_6_PGI_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        {
          fact: 'classPair',
          operator: 'contains',
          value: '4.1',
        },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            /* Gas Zone A ONLY */
            class_2_3_Zone_A_Gases,
            class_6_PGI_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        {
          fact: 'classPair',
          operator: 'contains',
          value: '4.2',
        },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            /* Gas Zone A ONLY */
            class_2_3_Zone_A_Gases,
            class_6_PGI_Liquids,
            class_8_Corrosive_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        {
          fact: 'classPair',
          operator: 'contains',
          value: '4.3',
        },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            /* Gas Zone A ONLY */
            class_2_3_Zone_A_Gases,
            class_6_PGI_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        {
          fact: 'classPair',
          operator: 'contains',
          value: '5.1',
        },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            /* Gas Zone A ONLY */
            class_2_3_Zone_A_Gases,
            class_6_PGI_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        {
          fact: 'classPair',
          operator: 'contains',
          value: '5.2',
        },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            /* Gas Zone A ONLY */
            class_2_3_Zone_A_Gases,
            class_6_PGI_Liquids,
          ],
        },
      ],
    },
    /* Liquid PG1 Zone A */
    {
      all: [
        class_6_PGI_Liquids,
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            { fact: 'classPair', operator: 'contains', value: '3' },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.2',
            },
            class_8_Corrosive_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        {
          fact: 'classPair',
          operator: 'contains',
          value: '7',
        },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
          ],
        },
      ],
    },
    /* Liquid Only */
    {
      all: [
        class_8_Corrosive_Liquids,
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            /* Gas Zone A ONLY */
            class_2_3_Zone_A_Gases,
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            class_6_PGI_Liquids,
          ],
        },
      ],
    },
  ],
};

// Note #1 - ammonium nitrate fertilizer may be loaded, transported, or stored with Class 1.1 or 1.5 materials
export const note1Condition = {
  all: [
    {
      fact: 'unidPair',
      operator: 'contains',
      value: 'UN2071',
    },
    {
      any: [
        { fact: 'classPair', operator: 'contains', value: '1.1' },
        { fact: 'classPair', operator: 'contains', value: '1.5' },
      ],
    },
  ],
};

// if class 7 is present, this segregation refers to class I and class II materials only, class III is prohibited
// even when chapter 3 is applied

// Note #2 - Do not load, transport, or store fissile class III radioactive material (Class 7) on the same
// aircraft with any other hazardous material
export const note2Condition = {
  all: [
    {
      fact: 'classPair',
      operator: 'contains',
      value: '7',
    },
  ],
};

// Note #3 - Normal uranium, depleted uranium, and thorium metal in solid form radioactive materials (Class 7)
// may be loaded and transported with Class 1.1, 1.2, and 1.5 (explosives)
export const note3Condition = {
  any: [
    {
      all: [
        {
          any: [
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN2909',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN2978',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN2977',
            },
            // *** URANIUM HEXAFLUORIDE, RADIOACTIVE MATERIAL EXCEPTED PACKAGE
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3507',
            },
          ],
        },
        {
          any: [
            { fact: 'classPair', operator: 'contains', value: '1.1' },
            { fact: 'classPair', operator: 'contains', value: '1.2' },
            { fact: 'classPair', operator: 'contains', value: '1.5' },
          ],
        },
      ],
    },
  ],
};

// Note #4 - Do not load, transport, or store cyanides or cyanide mixtures (Class 6.1) with any Class 8 materials
export const note4Condition = {
  any: [
    {
      all: [
        {
          any: [
            { fact: 'unidPair', operator: 'contains', value: 'UN1051' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1565' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1575' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1587' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1588' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1613' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1614' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1620' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1626' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1636' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1642' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1653' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1679' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1680' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1684' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1689' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1694' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1713' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1935' },
            { fact: 'unidPair', operator: 'contains', value: 'UN2316' },
            { fact: 'unidPair', operator: 'contains', value: 'UN2317' },
            { fact: 'unidPair', operator: 'contains', value: 'UN3294' },
            { fact: 'unidPair', operator: 'contains', value: 'UN3413' },
            { fact: 'unidPair', operator: 'contains', value: 'UN3414' },
            { fact: 'unidPair', operator: 'contains', value: 'UN3449' },
          ],
        },
        {
          fact: 'classPair',
          operator: 'contains',
          value: '8',
        },
      ],
    },
  ],
};

// Note #5 - separate nitric acid (Class 8) in carboys by 2.2m (88 inches) in all directions from other corrosives materials in carboys when loaded on the same aircraft
export const note5Condition = {
  any: [
    {
      all: [
        {
          any: [
            { fact: 'unidPair', operator: 'contains', value: 'UN1796' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1826' },
            { fact: 'unidPair', operator: 'contains', value: 'UN2031' },
            { fact: 'unidPair', operator: 'contains', value: 'UN2032' },
          ],
        },
        {
          fact: 'classPair',
          operator: 'contains',
          value: '8',
        },
      ],
    },
  ],
};

// Note #6 - Do not load, transport, or store charged electric storage batteries (Class 8) on the same aircraft with any Class 1.1 or 1.2
export const note6Condition = {
  any: [
    {
      all: [
        {
          any: [
            { fact: 'unidPair', operator: 'contains', value: 'UN2794' },
            { fact: 'unidPair', operator: 'contains', value: 'UN2795' },
            { fact: 'unidPair', operator: 'contains', value: 'UN2800' },
            { fact: 'unidPair', operator: 'contains', value: 'UN3028' },
          ],
        },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
          ],
        },
      ],
    },
  ],
};

// Note #7 - Ship the following materials with each other and with all other hazardous materials without
// compatibility restrictions (ensure compliance with Notes 4, 5, and 6)
export const note7Condition = {
  any: [
    // 7.1 - Class 6.1 toxic solids and liquids (other than PG I, Zone A)
    // See Note #4 concerning restrictions for cyanides and cyanide mixtures
    // *** look up all Class 6.1 materials and document those that are not PG I, Zone A
    // 7.2 - Class 8 solids
    // *** look up all Class 8 materials to identify solid vs liquid Class 8 materials
    // 7.3 - Class 9
    // *** excluding UN3480 and UN3090
    {
      all: [
        {
          fact: 'classPair',
          operator: 'contains',
          value: '9',
        },
        {
          fact: 'unidPair',
          operator: 'doesNotContain',
          value: 'UN3480',
        },
        {
          fact: 'unidPair',
          operator: 'doesNotContain',
          value: 'UN3090',
        },
      ],
    },
    // 7.4 - Excepted quantities
    // *** ???
    // 7.5 - Containers or articles drained but not purged containing 500 ml (17 ounces) or less of Class 3
    // *** ???
    {
      any: [
        {
          fact: 'classPair',
          operator: 'contains',
          value: '7.5',
        },
      ],
    },
  ],
};

// Note #8 - Class 8 corrosive liquids may not be loaded above or adjacent to Class 4 (flammable solid)
// material or Class 5 (oxidizing) material
export const note8Condition = {
  all: [
    class_8_Corrosive_Liquids,
    {
      any: [
        { fact: 'classPair', operator: 'contains', value: '4' },
        { fact: 'classPair', operator: 'contains', value: '5' },
      ],
    },
  ],
};

// Note #9 - Class 2.1 aerosol cans may be shipped with other incompatible items when separated in all
// directions by a minimum of 88 inches
export const note9Condition = {
  all: [
    {
      fact: 'unidPair',
      operator: 'contains',
      value: 'UN1950',
    },
  ],
};

// Note #10 - Items classified by a predominate hazard other than Class 1 but contain small amounts of
// explosive materials and assigned an explosive compatibility letter for storage may be shipped with
// Class 1 material according to Table A18.2. For example Class 4.2G may be shipped with Class 1.3G
// *** couldn't find any hazardous materials that meet this criteria in AFMAN 24-204

// Note #11 - Segregate lithium batteries (UN3480 and UN3090 only) from hazardous materials classified in Class 1 (other than Division 1.4S), Division 2.1, Class 3, Division 4.1 or Division 5.1
// *** defined above in segregation conditions.
export const note11Condition = {
  all: [
    {
      any: [
        {
          fact: 'unidPair',
          operator: 'contains',
          value: 'UN3480',
        },
        {
          fact: 'unidPair',
          operator: 'contains',
          value: 'UN3090',
        },
      ],
    },
    {
      any: [
        {
          fact: 'classPair',
          operator: 'contains',
          value: '1.1',
        },
        {
          fact: 'classPair',
          operator: 'contains',
          value: '1.2',
        },
        {
          fact: 'classPair',
          operator: 'contains',
          value: '1.3',
        },
        {
          all: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.4',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'S',
            },
          ],
        },
        {
          fact: 'classPair',
          operator: 'contains',
          value: '1.5',
        },
        {
          fact: 'classPair',
          operator: 'contains',
          value: '1.6',
        },
        {
          fact: 'classPair',
          operator: 'contains',
          value: '2.1',
        },
        {
          all: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '3',
            },
            {
              fact: 'unidPair',
              operator: 'doesNotContain',
              value: 'UN3528',
            },
          ],
        },
        {
          fact: 'classPair',
          operator: 'contains',
          value: '4.1',
        },
        {
          fact: 'classPair',
          operator: 'contains',
          value: '5.1',
        },
      ],
    },
  ],
};

// Note #12 - Segregation is not required between UN3528 and other hazardous materials
export const note12Condition = {
  all: [
    {
      fact: 'unidPair',
      operator: 'contains',
      value: 'UN3528',
    },
  ],
};

export const compatibleConditions: AnyConditions = {
  any: [
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'A' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'E',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'N',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'S',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'B' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'E',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'N',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'C' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'D' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'E' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'F' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'E',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'N',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'G' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'E',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'N',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'H' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'E',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'N',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'J' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'E',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'N',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'K' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'E',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'N',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'L' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'E',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'N',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'S',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'N' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'S' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'doesNotContain',
              value: 'L',
            },
          ],
        },
      ],
    },
    /* Table A18.2 - Note 1 */
    /* CARGO AIRCRAFT ONLY */
    /* PASSENGER DEVIATIONS NOT AUTHORIZED */
    {
      all: [
        {
          any: [
            { fact: 'unidPair', operator: 'contains', value: 'UN0255' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0257' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0267' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0361' },
          ],
        },
        {
          any: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'E',
            },
          ],
        },
      ],
    },
    /* Table A18.2 - Note 2 */
    {
      all: [
        {
          fact: 'compatibilityGroupPair',
          operator: 'contains',
          value: 'B',
        },
        {
          any: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'S',
            },
          ],
        },
      ],
    },
    /* Table A18.2 - Note 3 */
    /* CARGO AIRCRAFT ONLY */
    /* PASSENGER DEVIATIONS NOT AUTHORIZED */
    {
      all: [
        { fact: 'unidPair', operator: 'contains', value: 'UN0292' },
        {
          any: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'E',
            },
          ],
        },
      ],
    },
    /* Table A18.2 - Note 4 */
    /* CARGO AIRCRAFT ONLY */
    /* PASSENGER DEVIATIONS NOT AUTHORIZED */
    {
      all: [
        {
          any: [
            { fact: 'unidPair', operator: 'contains', value: 'UN0019' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0300' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0301' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0325' },
          ],
        },
        {
          any: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'B',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'E',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'F',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'G',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'H',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'N',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'S',
            },
          ],
        },
      ],
    },
    /* Table A18.2 - Note 5 */
    /* CARGO AIRCRAFT ONLY */
    /* PASSENGER DEVIATIONS NOT AUTHORIZED */
    {
      all: [
        {
          any: [
            { fact: 'unidPair', operator: 'contains', value: 'UN0009' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0018' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0314' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0315' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0317' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0319' },
            { fact: 'unidPair', operator: 'contains', value: 'UN0320' },
          ],
        },
        {
          any: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'C',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'D',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'E',
            },
          ],
        },
      ],
    },
    /* Table A18.2 - Note 6 */
    {
      all: [
        { fact: 'compatibilityGroupPair', operator: 'contains', value: 'L' },
        {
          all: [
            {
              fact: 'compatibilityGroupPair0',
              operator: 'equal',
              value: 'compatibilityGroupPair1',
            },
            {
              fact: 'classPair0',
              operator: 'equal',
              value: 'classPair1',
            },
            {
              fact: 'unidPair0',
              operator: 'equal',
              value: 'unidPair1',
            },
            // {
            //   fact: 'psnPair0',
            //   operator: 'equal',
            //   value: 'psnPair1',
            // },
          ],
        },
      ],
    },
    /* Table A18.2 - Note 7 */
    {
      not: {
        all: [
          {
            any: [
              { fact: 'classPair', operator: 'contains', value: '1.1' },
              { fact: 'classPair', operator: 'contains', value: '1.2' },
            ],
          },
          {
            any: [
              { fact: 'unidPair', operator: 'contains', value: 'UN0333' },
              { fact: 'unidPair', operator: 'contains', value: 'UN0334' },
              { fact: 'unidPair', operator: 'contains', value: 'UN0335' },
              { fact: 'unidPair', operator: 'contains', value: 'UN0336' },
              { fact: 'unidPair', operator: 'contains', value: 'UN0337' },
            ],
          },
        ],
      },
    },
    /* Table A18.2 - Note 8 */
    /* CARGO AIRCRAFT ONLY */
    /* PASSENGER DEVIATIONS NOT AUTHORIZED */
    {
      all: [
        {
          any: [
            {
              all: [
                { fact: 'classPair0', operator: 'contains', value: '1.4' },
                {
                  any: [
                    {
                      fact: 'compatibilityGroupPair0',
                      operator: 'contains',
                      value: 'B',
                    },
                    {
                      fact: 'compatibilityGroupPair0',
                      operator: 'contains',
                      value: 'G',
                    },
                  ],
                },
              ],
            },
            {
              all: [
                { fact: 'classPair1', operator: 'contains', value: '1.4' },
                {
                  any: [
                    {
                      fact: 'compatibilityGroupPair1',
                      operator: 'contains',
                      value: 'B',
                    },
                    {
                      fact: 'compatibilityGroupPair1',
                      operator: 'contains',
                      value: 'G',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          any: [
            {
              all: [
                { fact: 'classPair0', operator: 'contains', value: '1.4' },
                {
                  any: [
                    {
                      fact: 'compatibilityGroupPair0',
                      operator: 'contains',
                      value: 'C',
                    },
                    {
                      fact: 'compatibilityGroupPair0',
                      operator: 'contains',
                      value: 'D',
                    },
                    {
                      fact: 'compatibilityGroupPair0',
                      operator: 'contains',
                      value: 'E',
                    },
                  ],
                },
              ],
            },
            {
              all: [
                { fact: 'classPair1', operator: 'contains', value: '1.4' },
                {
                  any: [
                    {
                      fact: 'compatibilityGroupPair1',
                      operator: 'contains',
                      value: 'C',
                    },
                    {
                      fact: 'compatibilityGroupPair1',
                      operator: 'contains',
                      value: 'D',
                    },
                    {
                      fact: 'compatibilityGroupPair1',
                      operator: 'contains',
                      value: 'E',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const segregationConditions = {
  any: [
    {
      fact: 'unidPair',
      operator: 'contains',
      value: 'UN1950',
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '1.1' },
        {
          any: [
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3480',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3090',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '1.2' },
        {
          any: [
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3480',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3090',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '1.3' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '7',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3480',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3090',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '1.4' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.3',
            },
            {
              all: [
                {
                  fact: 'classPair',
                  operator: 'contains',
                  value: '3',
                },
                {
                  fact: 'unidPair',
                  operator: 'doesNotContain',
                  value: 'UN3528',
                },
              ],
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            class_6_PGI_Liquids,
            class_8_Corrosive_Liquids,
            {
              all: [
                {
                  fact: 'unidPair',
                  operator: 'contains',
                  value: 'UN3480',
                },
                {
                  fact: 'compatibilityGroupPair',
                  operator: 'doesNotContain',
                  value: 'S',
                },
              ],
            },
            {
              all: [
                {
                  fact: 'unidPair',
                  operator: 'contains',
                  value: 'UN3090',
                },
                {
                  fact: 'compatibilityGroupPair',
                  operator: 'doesNotContain',
                  value: 'S',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '1.5' },
        {
          any: [
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3480',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3090',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '1.6' },
        {
          any: [
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3480',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3090',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '2.1' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.4',
            },
            /* Other than Zone A */
            class_2_3_Zone_B_C_D_Gases,
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.2',
            },
            class_6_PGI_Liquids,
            { fact: 'classPair', operator: 'contains', value: '7' },
            class_8_Corrosive_Liquids,
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3480',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3090',
            },
          ],
        },
      ],
    },
    /* Gas Zone A */
    {
      all: [
        class_2_3_Zone_A_Gases,
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.4',
            },
          ],
        },
      ],
    },
    /* Other than Zone A */
    {
      all: [
        class_2_3_Zone_B_C_D_Gases,
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.4',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            {
              all: [
                {
                  fact: 'classPair',
                  operator: 'contains',
                  value: '3',
                },
                {
                  fact: 'unidPair',
                  operator: 'doesNotContain',
                  value: 'UN3528',
                },
              ],
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.2',
            },
            class_8_Corrosive_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '3' },
        { fact: 'unidPair', operator: 'doesNotContain', value: 'UN3528' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.4',
            },
            /*  Other than Zone A */
            class_2_3_Zone_B_C_D_Gases,
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.2',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3480',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3090',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '4.1' },
        {
          any: [
            /*  Other than Zone A */
            class_2_3_Zone_B_C_D_Gases,
            {
              all: [
                {
                  fact: 'classPair',
                  operator: 'contains',
                  value: '3',
                },
                {
                  fact: 'unidPair',
                  operator: 'doesNotContain',
                  value: 'UN3528',
                },
              ],
            },
            class_8_Corrosive_Liquids,
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3480',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3090',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '4.2' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.4',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            /*  Other than Zone A */
            class_2_3_Zone_B_C_D_Gases,
            {
              all: [
                {
                  fact: 'classPair',
                  operator: 'contains',
                  value: '3',
                },
                {
                  fact: 'unidPair',
                  operator: 'doesNotContain',
                  value: 'UN3528',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '4.3' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            /*  Other than Zone A */
            class_2_3_Zone_B_C_D_Gases,
            {
              all: [
                {
                  fact: 'classPair',
                  operator: 'contains',
                  value: '3',
                },
                {
                  fact: 'unidPair',
                  operator: 'doesNotContain',
                  value: 'UN3528',
                },
              ],
            },
            class_8_Corrosive_Liquids,
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '5.1' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            /*  Other than Zone A */
            class_2_3_Zone_B_C_D_Gases,
            {
              all: [
                {
                  fact: 'classPair',
                  operator: 'contains',
                  value: '3',
                },
                {
                  fact: 'unidPair',
                  operator: 'doesNotContain',
                  value: 'UN3528',
                },
              ],
            },
            class_8_Corrosive_Liquids,
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3480',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3090',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '5.2' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            /*  Other than Zone A */
            class_2_3_Zone_B_C_D_Gases,
            {
              all: [
                {
                  fact: 'classPair',
                  operator: 'contains',
                  value: '3',
                },
                {
                  fact: 'unidPair',
                  operator: 'doesNotContain',
                  value: 'UN3528',
                },
              ],
            },
            class_8_Corrosive_Liquids,
          ],
        },
      ],
    },
    /* Liquid PGI Zone A */
    {
      all: [
        class_6_PGI_Liquids,
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.4',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
          ],
        },
      ],
    },
    {
      all: [
        { fact: 'classPair', operator: 'contains', value: '7' },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
          ],
        },
      ],
    },
    /* Liquid Only */
    {
      all: [
        class_8_Corrosive_Liquids,
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.4',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            /* Other than Zone A */
            class_2_3_Zone_B_C_D_Gases,
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.2',
            },
          ],
        },
      ],
    },
    {
      all: [
        {
          any: [
            { fact: 'unidPair', operator: 'contains', value: 'UN3480' },
            { fact: 'unidPair', operator: 'contains', value: 'UN3090' },
          ],
        },
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.4',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.5',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.6',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '2.1',
            },
            {
              all: [
                {
                  fact: 'classPair',
                  operator: 'contains',
                  value: '3',
                },
                {
                  fact: 'unidPair',
                  operator: 'doesNotContain',
                  value: 'UN3528',
                },
              ],
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '4.1',
            },

            {
              fact: 'classPair',
              operator: 'contains',
              value: '5.1',
            },
          ],
        },
      ],
    },
  ],
};

export const chapter3Condition1 = {
  any: [
    // A18.4.1 - A, J, K, L can only be shipped with S and Class 9
    {
      all: [
        {
          any: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'A',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'J',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'K',
            },
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'L',
            },
          ],
        },
        {
          any: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'S',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '9',
            },
          ],
        },
      ],
    },
    {
      not: {
        any: [
          { fact: 'compatibilityGroupPair', operator: 'contains', value: 'A' },
          { fact: 'compatibilityGroupPair', operator: 'contains', value: 'J' },
          { fact: 'compatibilityGroupPair', operator: 'contains', value: 'K' },
          { fact: 'compatibilityGroupPair', operator: 'contains', value: 'L' },
        ],
      },
    },
  ],
};

export const chapter3Condition2 = {
  any: [
    // A18.4.2 - Fissile class III radioactive materials (Class 7) cannot be loaded, transported,
    // or stored on the same aircraft with any other hazardous material.
    {
      fact: 'classPair',
      operator: 'contains',
      value: '7',
    },
  ],
};

export const chapter3Condition3 = {
  any: [
    // A18.4.3 - Classes 1.1, 1.2, and 1.3 cannot be shipped with any Inhalation Hazard Zone A material.
    {
      all: [
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
          ],
        },
        {
          any: [
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3516',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3514',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3517',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3515',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3512',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3518',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN1955',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3514',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3304',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3305',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN1953',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3306',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3303',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3355',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3308',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3309',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3160',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3162',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3310',
            },
            {
              fact: 'unidPair',
              operator: 'contains',
              value: 'UN3307',
            },
          ],
        },
      ],
    },
  ],
};

export const chapter3Condition4 = {
  any: [
    // A18.4.4 - Classes 1.1, 1.2, and 1.3 cannot be shipped with Class 6.1 poisonous liquids, PG I
    {
      all: [
        {
          any: [
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.1',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.2',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '1.3',
            },
          ],
        },
        {
          any: [
            {
              fact: 'compatibilityGroupPair',
              operator: 'contains',
              value: 'S',
            },
            {
              fact: 'classPair',
              operator: 'contains',
              value: '9',
            },
          ],
        },
      ],
    },
  ],
};

export const chapter3Condition5 = {
  any: [
    // A18.4.5 - Cyanides or cyanide mixtures (Class 6.1) cannot be loaded, transported, or stored with
    // any corrosive Class 8 material
    {
      all: [
        {
          any: [
            { fact: 'unidPair', operator: 'contains', value: 'UN1565' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1694' },
            { fact: 'unidPair', operator: 'contains', value: 'UN3449' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1575' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1587' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1588' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1935' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1613' },
            { fact: 'unidPair', operator: 'contains', value: 'UN3294' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1051' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1614' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1620' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1626' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1636' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1642' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1653' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1679' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1680' },
            { fact: 'unidPair', operator: 'contains', value: 'UN3413' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1684' },
            { fact: 'unidPair', operator: 'contains', value: 'UN2316' },
            { fact: 'unidPair', operator: 'contains', value: 'UN2317' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1689' },
            { fact: 'unidPair', operator: 'contains', value: 'UN3414' },
            { fact: 'unidPair', operator: 'contains', value: 'UN1713' },
          ],
        },
        {
          fact: 'classPair',
          operator: 'contains',
          value: '8',
        },
      ],
    },
  ],
};

export const rules: Rule[] = [
  new Rule({
    conditions: incompatibleConditions,
    event: {
      type: 'incompatibleCondition',
      params: {
        message: 'Incompatible hazardous materials',
      },
    },
  }),
  new Rule({
    conditions: segregationConditions,
    event: {
      type: 'segregationCondition',
      params: {
        message:
          'These hazardous materials may not be loaded together unless separated by a 463L pallet position or not less than a distance of 2.2 m (88 inches) in all directions',
      },
    },
  }),
  new Rule({
    conditions: note1Condition,
    event: {
      type: 'note1Condition',
      params: {
        message:
          'Ammonium nitrate fertilizer may be loaded, transported, or stored with Class 1.1 or 1.5 materials',
      },
    },
  }),
  new Rule({
    conditions: note2Condition,
    event: {
      type: 'note2Condition',
      params: {
        message:
          'Do not load, transport, or store fissile class III radioactive material (Class 7) on the same aircraft with any other hazardous material',
      },
    },
  }),
  new Rule({
    conditions: note3Condition,
    event: {
      type: 'note3Condition',
      params: {
        message:
          'Normal uranium, depleted uranium, and thorium metal in solid form radioactive materials (Class 7) may be loaded and transported with Class 1.1, 1.2, and 1.5 (explosives)',
      },
    },
  }),
  new Rule({
    conditions: note4Condition,
    event: {
      type: 'note4Condition',
      params: {
        message:
          'Do not load, transport, or store cyanides or cyanide mixtures (Class 6.1) with any Class 8 materials',
      },
    },
  }),
  new Rule({
    conditions: note5Condition,
    event: {
      type: 'note5Condition',
      params: {
        message:
          'Separate nitric acid (Class 8) in carboys by 2.2 m (88 inches) in all directions from other corrosives materials in carboys when loaded on the same aircraft',
      },
    },
  }),
  new Rule({
    conditions: note6Condition,
    event: {
      type: 'note6Condition',
      params: {
        message:
          'Do not load, transport, or store charged electric storage batteries (Class 8) on the same aircraft with any Class 1.1 or 1.2',
      },
    },
  }),
  new Rule({
    conditions: note8Condition,
    event: {
      type: 'note8Condition',
      params: {
        message:
          'Class 8 corrosive liquids may not be loaded above or adjacent to Class 4 (flammable solid) material or Class 5 (oxidizing) material',
      },
    },
  }),
  new Rule({
    conditions: note9Condition,
    event: {
      type: 'note9Condition',
      params: {
        message:
          'Class 2.1 aerosol cans may be shipped with other incompatible items when separated in all directions by a minimum of 88 inches',
      },
    },
  }),
  new Rule({
    conditions: note11Condition,
    event: {
      type: 'note11Condition',
      params: {
        message:
          'Segregate lithium batteries (UN3480 and UN3090 only) from hazardous materials classified in Class 1 (other than Division 1.4S), Division 2.1, Class 3, Division 4.1 or Division 5.1',
      },
    },
  }),
  new Rule({
    conditions: note12Condition,
    event: {
      type: 'note12Condition',
      params: {
        message:
          'Segregation is not required between UN3528 and other hazardous materials',
      },
    },
  }),
  new Rule({
    conditions: compatibleConditions,
    event: {
      type: 'compatibleCondition',
    },
  }),
  // new Rule({
  //   conditions: chapter3Condition1,
  //   event: {
  //     type: 'chapter3note1Condition',
  //     params: {
  //       message:
  //         'Explosives in compatibility groups A, J, K, and L can only be shipped with material in compatibility group S and Class 9',
  //     },
  //   },
  // }),
  // Note #2
  // new Rule({
  //   conditions: chapter3Condition2,
  //   event: {
  //     type: 'chapter3noteCondition',
  //     params: {
  //       message:
  //         'Fissile class III radioactive materials (Class 7) cannot be loaded, transported, or stored on the same aircraft with any other hazardous material',
  //     },
  //   },
  // }),
  // Note #3
  // new Rule({
  //   conditions: chapter3Condition3,
  //   event: {
  //     type: 'note3Condition',
  //     params: {
  //       message:
  //         'Class 1.1, 1.2, and 1.3 cannot be shipped with any Inhalation Hazard Zone A material',
  //     },
  //   },
  // }),
  // Note #4
  // new Rule({
  //   conditions: chapter3Condition4,
  //   event: {
  //     type: 'note4Condition',
  //     params: {
  //       message:
  //         'Class 1.1, 1.2, and 1.3 cannot be shipped with Class 6.1 poisonous liquids, PG I',
  //     },
  //   },
  // }),
  // Note #5
  // new Rule({
  //   conditions: chapter3Condition5,
  //   event: {
  //     type: 'note5Condition',
  //     params: {
  //       message:
  //         ' Cyanides or cyanide mixtures (Class 6.1) cannot be loaded, transported, or stored with any corrosive Class 8 material',
  //     },
  //   },
  // }),
];

// export const chapterThreeRules: Rule[] = [
//   new Rule({
//     conditions: chapter3Condition1,
//     event: {
//       type: 'chapter3Condition1',
//       params: {
//         message:
//           'Explosives in compatibility groups A, J, K, and L can only be shipped with material in compatibility group S and Class 9',
//       },
//     },
//   }),
//   // Note #2
//   new Rule({
//     conditions: chapter3Condition2,
//     event: {
//       type: 'chapter3Condition2',
//       params: {
//         message:
//           'Fissile class III radioactive materials (Class 7) cannot be loaded, transported, or stored on the same aircraft with any other hazardous material',
//       },
//     },
//   }),
//   // Note #3
//   new Rule({
//     conditions: chapter3Condition3,
//     event: {
//       type: 'chapter3Condition3',
//       params: {
//         message:
//           'Class 1.1, 1.2, and 1.3 cannot be shipped with any Inhalation Hazard Zone A material',
//       },
//     },
//   }),
//   // Note #4
//   new Rule({
//     conditions: chapter3Condition4,
//     event: {
//       type: 'chapter3Condition4',
//       params: {
//         message:
//           'Class 1.1, 1.2, and 1.3 cannot be shipped with Class 6.1 poisonous liquids, PG I',
//       },
//     },
//   }),
//   // Note #5
//   new Rule({
//     conditions: chapter3Condition5,
//     event: {
//       type: 'chapter3Condition5',
//       params: {
//         message:
//           ' Cyanides or cyanide mixtures (Class 6.1) cannot be loaded, transported, or stored with any corrosive Class 8 material',
//       },
//     },
//   }),
// ];
