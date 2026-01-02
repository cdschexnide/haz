import {
  DocumentNode,
  RequirementCheckResult,
  HazardousMaterialContext,
  AnswerType,
} from "../../types";

export const Attachment3: DocumentNode = {
  id: "A3.",
  parentId: "AFMAN24-604",
  title: "GENERAL AND HAZARD CLASS SPECIFIC AIR TRANSPORTATION REQUIREMENTS",
  childNodeIds: ["A3.1.", "A3.2.", "A3.3.", "A3.4."],
};

export const A3_1: DocumentNode = {
  id: "A3.1.",
  parentId: "A3.",
  title: "General Packaging Requirements.",
  bodyText: `The general requirements of Attachment 3 are in
  addition to the specific packaging requirements outlined in Attachment 5 through Attachment
  13. Hazardous material packaging must be authorized by this manual, 49 CFR Part 173, ICAO,
  or IATA, and meet the requirements outlined in this attachment. (T-0). Comply with specific
  requirements contained in a technical directive governing the packaging or preparation of an
  item, commodity, or article, when stricter than requirements in this manual.`,
  childNodeIds: [
    "A3.1.1.",
    "A3.1.2.",
    "A3.1.3.",
    "A3.1.4.",
    "A3.1.5.",
    "A3.1.6.",
    "A3.1.7.",
    "A3.1.8.",
    "A3.1.9.",
    "A3.1.10.",
    "A3.1.11.",
    "A3.1.12.",
    "A3.1.13.",
    "A3.1.14.",
    "A3.1.15.",
    "A3.1.16.",
    "A3.1.17.",
  ],
};

export const A3_1_1: DocumentNode = {
  id: "A3.1.1.",
  parentId: "A3.1.",
  title: "United Nations (UN) Performance Specification Packaging.",
  bodyText: `Prepare hazardous
  materials in UN specification containers unless exempted by a specific packaging
  paragraph in this manual. DOD activities use the DOD POP Program to locate tested and
  authorized DOD packaging configurations. If the hazardous material is procured in a
  manufacturer's UN specification container, use that container. Ensure compliance with all
  other requirements of this manual, including air-eligibility. If the managing activity has
  specified a container SPI, use that UN specification container. For additional information
  concerning UN specification packaging or performance test requirements see DLAR
  4145.41/AR 700-143/AFI 24-210_IP/NAVSUPINST 4030.55/MCO 4030.40, Packaging
  of Hazardous Material. Service Focal Points are unable to waive UN specification
  requirements.`,
  childNodeIds: ["A3.1.1.1."],
};

export const A3_1_1_1: DocumentNode = {
  id: "A3.1.1.1.",
  parentId: "A3.1.1.",
  title: "Exempt Items.",
  bodyText: `The following materials are exempt from UN performance
  specification packaging test requirements. The packaging paragraph from Table A4.1.
  specifies required packaging. While UN specification packaging is not required, material
  may be subject to package performance tests.`,
  childNodeIds: [
    "A3.1.1.1.1.",
    "A3.1.1.1.2.",
    "A3.1.1.1.3.",
    "A3.1.1.1.4.",
    "A3.1.1.1.5.",
    "A3.1.1.1.6.",
    "A3.1.1.1.7.",
    "A3.1.1.1.8.",
    "A3.1.1.1.9.",
  ],
};

export const A3_1_1_1_1: DocumentNode = {
  id: "A3.1.1.1.1.",
  parentId: "A3.1.1.1.",
  bodyText: "Compressed gas cylinders",
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { material } = context;
    const EXEMPT_CATEGORY = "Compressed Gas Cylinders";

    if (!material.properShippingName.toLowerCase().includes(EXEMPT_CATEGORY)) {
      return {
        isApplicable: false,
        requirementId: "A3.1.1.1.1.",
        reason:
          "Hazardous material is not an exempt item, per paragraph A3.1.1.1.1. Therefore, the hazardous material is subject to UN performance packaging test requirements.",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.1.1.1.",
        reason:
          "Hazardous material is an exempt item, per paragraph A3.1.1.1.1. While UN specification packaging is not required, material may be subject to package performance tests.",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_1_1_2: DocumentNode = {
  id: "A3.1.1.1.2.",
  parentId: "A3.1.1.1.",
  bodyText: "Radioactive material",
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { material } = context;
    const EXEMPT_CATEGORY = "Radioactive material";

    if (!material.properShippingName.toLowerCase().includes(EXEMPT_CATEGORY)) {
      return {
        isApplicable: false,
        requirementId: "A3.1.1.1.2.",
        reason:
          "Hazardous material is not an exempt item, per paragraph A3.1.1.1.2. Therefore, the hazardous material is subject to UN performance packaging test requirements.",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.1.1.2.",
        reason:
          "Hazardous material is an exempt item, per paragraph A3.1.1.1.2. While UN specification packaging is not required, material may be subject to package performance tests.",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_1_1_3: DocumentNode = {
  id: "A3.1.1.1.3.",
  parentId: "A3.1.1.1.",
  bodyText: "Dry ice",
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { material } = context;
    const EXEMPT_CATEGORY = "Dry ice";

    if (!material.properShippingName.toLowerCase().includes(EXEMPT_CATEGORY)) {
      return {
        isApplicable: false,
        requirementId: "A3.1.1.1.3.",
        reason:
          "Hazardous material is not an exempt item, per paragraph A3.1.1.1.3. Therefore, the hazardous material is subject to UN performance packaging test requirements.",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.1.1.3.",
        reason:
          "Hazardous material is an exempt item, per paragraph A3.1.1.1.3. While UN specification packaging is not required, material may be subject to package performance tests.",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_1_1_4: DocumentNode = {
  id: "A3.1.1.1.4.",
  parentId: "A3.1.1.1.",
  bodyText: "Magnetized material",
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { material } = context;
    const EXEMPT_CATEGORY = "Magnetized material";

    if (!material.properShippingName.toLowerCase().includes(EXEMPT_CATEGORY)) {
      return {
        isApplicable: false,
        requirementId: "A3.1.1.1.4.",
        reason:
          "Hazardous material is not an exempt item, per paragraph A3.1.1.1.4. Therefore, the hazardous material is subject to UN performance packaging test requirements.",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.1.1.4.",
        reason:
          "Hazardous material is an exempt item, per paragraph A3.1.1.1.4. While UN specification packaging is not required, material may be subject to package performance tests.",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_1_1_5: DocumentNode = {
  id: "A3.1.1.1.5.",
  parentId: "A3.1.1.1.",
  bodyText: "Life-saving appliances",
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { material } = context;
    const EXEMPT_CATEGORY = "Life-saving appliances";

    if (!material.properShippingName.toLowerCase().includes(EXEMPT_CATEGORY)) {
      return {
        isApplicable: false,
        requirementId: "A3.1.1.1.5.",
        reason:
          "Hazardous material is not an exempt item, per paragraph A3.1.1.1.5. Therefore, the hazardous material is subject to UN performance packaging test requirements.",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.1.1.5.",
        reason:
          "Hazardous material is an exempt item, per paragraph A3.1.1.1.5. While UN specification packaging is not required, material may be subject to package performance tests.",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_1_1_6: DocumentNode = {
  id: "A3.1.1.1.6.",
  parentId: "A3.1.1.1.",
  bodyText: "Mercury contained in manufactured articles",
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { material } = context;
    const EXEMPT_CATEGORY = "Mercury contained in manufactured articles";

    if (!material.properShippingName.toLowerCase().includes(EXEMPT_CATEGORY)) {
      return {
        isApplicable: false,
        requirementId: "A3.1.1.1.6.",
        reason:
          "Hazardous material is not an exempt item, per paragraph A3.1.1.1.6. Therefore, the hazardous material is subject to UN performance packaging test requirements.",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.1.1.6.",
        reason:
          "Hazardous material is an exempt item, per paragraph A3.1.1.1.6. While UN specification packaging is not required, material may be subject to package performance tests.",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_1_1_7: DocumentNode = {
  id: "A3.1.1.1.7.",
  parentId: "A3.1.1.1.",
  bodyText:
    'Items identified in this manual as requiring "strong outer packaging"',
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { material } = context;
    const EXEMPT_CATEGORY =
      'Items identified in this manual as requiring "strong outer packaging"';

    if (!material.properShippingName.toLowerCase().includes(EXEMPT_CATEGORY)) {
      return {
        isApplicable: false,
        requirementId: "A3.1.1.1.7.",
        reason:
          "Hazardous material is not an exempt item, per paragraph A3.1.1.1.7. Therefore, the hazardous material is subject to UN performance packaging test requirements.",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.1.1.7.",
        reason:
          "Hazardous material is an exempt item, per paragraph A3.1.1.1.7. While UN specification packaging is not required, material may be subject to package performance tests.",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_1_1_8: DocumentNode = {
  id: "A3.1.1.1.8.",
  parentId: "A3.1.1.1.",
  bodyText: "Limited and Excepted Quantities.",
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { material } = context;
    const EXEMPT_CATEGORY = "Limited and Excepted Quantities.";

    if (!material.properShippingName.toLowerCase().includes(EXEMPT_CATEGORY)) {
      return {
        isApplicable: false,
        requirementId: "A3.1.1.1.8.",
        reason:
          "Hazardous material is not an exempt item, per paragraph A3.1.1.1.8. Therefore, the hazardous material is subject to UN performance packaging test requirements.",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.1.1.8.",
        reason:
          "Hazardous material is an exempt item, per paragraph A3.1.1.1.8. While UN specification packaging is not required, material may be subject to package performance tests.",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_1_1_9: DocumentNode = {
  id: "A3.1.1.1.9.",
  parentId: "A3.1.1.1.",
  bodyText: "Biological Substances, Category B.",
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { material } = context;
    const EXEMPT_CATEGORY = "Biological Substances, Category B.";

    if (!material.properShippingName.toLowerCase().includes(EXEMPT_CATEGORY)) {
      return {
        isApplicable: false,
        requirementId: "A3.1.1.1.9.",
        reason:
          "Hazardous material is not an exempt item, per paragraph A3.1.1.1.9. Therefore, the hazardous material is subject to UN performance packaging test requirements.",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.1.1.9.",
        reason:
          "Hazardous material is an exempt item, per paragraph A3.1.1.1.9. While UN specification packaging is not required, material may be subject to package performance tests.",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_2: DocumentNode = {
  id: "A3.1.2.",
  parentId: "A3.1.",
  title: "Transportability.",
  bodyText: `Securely close and construct containers to prevent leakage due to
changes in temperature, humidity, altitude, and damage during transportation and in-transit
handling. Hazardous materials must be packaged/prepared according to one of the following:
DoD Performance Oriented Packaging Program, DOD SPI or an approved service drawing,
technical publication (e.g., technical order/manual), manufacturer’s supplied closing
instructions, UN specification test report, or technical knowledge/training to construct strong
outer packaging when required by this manual. (T-0).`,
  childNodeIds: ["A3.1.2.1.", "A3.1.2.2.", "A3.1.2.3."],
};

export const A3_1_2_1: DocumentNode = {
  id: "A3.1.2.1.",
  parentId: "A3.1.2.",
  bodyText: `Primary and secondary items and their containers (unit or exterior) must provide
    protection without deformation, leakage, or rupture against:`,
  childNodeIds: ["A3.1.2.1.1.", "A3.1.2.1.2.", "A3.1.2.1.3."],
};

export const A3_1_2_1_1: DocumentNode = {
  id: "A3.1.2.1.1.",
  parentId: "A3.1.2.1.",
  bodyText: `Temperature changes (-40 to 65.5 degrees C [-40 to +150 degrees F]).`,
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { packagingQuantities } = context;

    const transportParams = packagingQuantities.transportabilityParameters;

    const meetsTemperatureFahrenheit =
      transportParams.minTemperature.fahrenheit <= -40 &&
      transportParams.maxTemperature.fahrenheit >= 150;

    const meetsTemperatureCelsius =
      transportParams.minTemperature.celsius <= -40 &&
      transportParams.maxTemperature.celsius >= 65.5;

    if (meetsTemperatureFahrenheit || meetsTemperatureCelsius) {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.2.1.1.",
        reason:
          "The packaging parameters satisfy the required temperature range (-40°C to +65.5°C or -40°F to +150°F).",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: false,
        requirementId: "A3.1.2.1.1.",
        reason:
          "The packaging parameters do not satisfy the required temperature range (-40°C to +65.5°C or -40°F to +150°F).",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_2_1_2: DocumentNode = {
  id: "A3.1.2.1.2.",
  parentId: "A3.1.2.1.",
  bodyText: `Pressure changes due to altitude changes (sea level to 3.7km (12,000 feet)).`,
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { packagingQuantities } = context;

    const transportParams = packagingQuantities.transportabilityParameters;

    /* A3.1.2.1.2. Pressure changes due to altitude changes (sea level to 3.7 km (12,000 feet)) */
    const meetsAltitude = transportParams.maxAltitude.kilometers >= 3.7;

    if (meetsAltitude) {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.2.1.2.",
        reason:
          "The packaging parameters meet the altitude requirement (up to at least 3.7km).",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: false,
        requirementId: "A3.1.2.1.2.",
        reason:
          "The packaging parameters do not meet the altitude requirement (must handle up to 3.7km).",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_2_1_3: DocumentNode = {
  id: "A3.1.2.1.3.",
  parentId: "A3.1.2.1.",
  bodyText: `Pressure changes due to explosive decompression from 3.7 to 15.24 km
(12,000 to 50,000 feet). (T-0).`,
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { packagingQuantities } = context;

    const transportParams = packagingQuantities.transportabilityParameters;

    const meetsExplosiveDecompression =
      transportParams.explosiveDecompressionRange.minimum.kilometers <= 3.7 &&
      transportParams.explosiveDecompressionRange.maximum.kilometers >= 15.24;

    if (meetsExplosiveDecompression) {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.2.1.3.",
        reason:
          "The packaging parameters meet the explosive decompression requirement (3.7 to 15.24 km or 12,000 to 50,000 feet).",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: false,
        requirementId: "A3.1.2.1.3.",
        reason:
          "The packaging parameters do not meet the explosive decompression requirement (must handle 3.7 to 15.24 km or 12,000 to 50,000 feet).",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_2_2: DocumentNode = {
  id: "A3.1.2.2.",
  parentId: "A3.1.2.",
  bodyText: `Do not fill a UN specification packaging to a gross mass greater than the
    authorized gross mass marked on the packaging.`,
  requirement: (context: HazardousMaterialContext): RequirementCheckResult => {
    const { transportabilityParameters } = context.packagingQuantities;

    if (
      !transportabilityParameters.grossMassOfPackage ||
      !transportabilityParameters.authorizedGrossMassBasedOnPackageMarking
    ) {
      return {
        isApplicable: true,
        isCompliant: false,
        requirementId: "A3.1.2.2.",
        reason:
          "Either the package gross mass or the authorized gross mass is missing, making verification impossible.",
      };
    }

    if (
      transportabilityParameters.grossMassOfPackage >
      transportabilityParameters.authorizedGrossMassBasedOnPackageMarking
    ) {
      return {
        isApplicable: false,
        requirementId: "A3.1.2.2.",
        reason: "The package gross mass exceeds the authorized gross mass.",
      };
    } else {
      return {
        isApplicable: true,
        isCompliant: true,
        requirementId: "A3.1.2.2.",
        reason:
          "The package gross mass does not exceed the authorized gross mass.",
      };
    }
  },
  answerType: AnswerType.ACKNOWLEDGE,
};

export const A3_1_2_3: DocumentNode = {
  id: "A3.1.2.3.",
  parentId: "A3.1.2.",
  bodyText: `Provide adequate protection for material susceptible to damage by temperature
    extremes during both ground and air operations.`,
};

export const A3_1_3: DocumentNode = {
  id: "A3.1.3.",
  parentId: "A3.1.",
  title: "Compatibility.",
  bodyText: `All containers must be designed and constructed of materials that do
    not react with, or are not decomposed by, the material contained therein. (T-0). Plastic
    containers or liners must prevent permeation of contents. (T-0). Plastic packaging or
    receptacles used for liquid hazardous materials must be capable of withstanding, without
    failure, the test specified in 49 CFR Part 173, Appendix B, Procedure for Testing Chemical
    Compatibility and Rate of Permeation in Plastic Packagings and Receptacles. (T-0).`,
};

export const A3_1_4: DocumentNode = {
  id: "A3.1.4.",
  parentId: "A3.1.",
  title: "Leak Containment (Liner) General Requirements.",
  bodyText: `Leak containment must be provided
    for hazardous liquids when required outer packaging is not liquid-tight. (T-0). This does not
    apply to overpacks used only for air shipment consolidation. Use a leak-proof liner, plastic
    bag, or other equally efficient means of containment specified in packaging or closure
    instructions according to A3.1.2. Items drained and purged that are susceptible to leaking
    purging fluid (e.g., small fuel components) will also be contained in a liner to prevent
    leaking. (T-0).`,
};

export const A3_1_5: DocumentNode = {
  id: "A3.1.5.",
  parentId: "A3.1.",
  title: "Ullage (Outage).",
  bodyText: `Do not entirely fill containers designed to hold liquids. When filling
    packagings with liquid hazardous material, leave sufficient interior space (outage) to prevent
    leakage of contents or distortion of containers due to change of temperature during
    transportation, storage, and handling. For flammable liquids and other volatile liquids with
    a high coefficient of expansion, a minimum outage of 2 percent at 54 degrees C (130 degrees
    F), is required.`,
};

export const A3_1_6: DocumentNode = {
  id: "A3.1.6.",
  parentId: "A3.1.",
  title: "Closures.",
  bodyText: `Packages and containers must be closed as specified in a test report,
    packaging instruction, drawing, or manufacturers closure instructions except as identified in
    A28.2.2. (T-0). When used, stoppers, corks, or other such friction-type devices must be held
    in place securely, tightly, and effectively. (T-0). Each screw-type closure on any
    packaging/container (other than UN specification jerricans) containing a hazardous liquid
    must be secured with pressure-sensitive tape, self-shrinking plastic, wire, a device designed
    to prevent the cap from loosening (integral locking cap), or other positive means to prevent
    the closure from loosening due to vibration or substantial temperature change. (T-0).`,
};

export const A3_1_7: DocumentNode = {
  id: "A3.1.7.",
  parentId: "A3.1.",
  title: "Air-Eligible Packaging Requirements.",
  childNodeIds: ["A3.1.7.1.", "A3.1.7.2.", "A3.1.7.3."],
};

export const A3_1_7_1: DocumentNode = {
  id: "A3.1.7.1.",
  parentId: "A3.1.7.",
  bodyText: `Combination Packaging Pressure Standard. Inner packagings (including closures)
    used to retain a hazardous liquid or semi-solid in a combination packaging must be 
    AFMAN24-604 9 October 2020 55 capable of withstanding (without leaking) an internal air gauge 
    pressure of not less than 95 kPa (14 psi); or 75 kPa (11 psi) for Packing Group III liquids in Class 3 or Class 6.1;
    or a pressure related to the vapor pressure of the liquid contained in the receptacle,
    whichever is greater. (T-0). Repack or pack liquid hazardous materials in containers that
    do not meet the internal hydraulic pressure standard, into supplementary UN certified
    specification containers that meet this requirement. Determine the pressure related to the
    vapor pressure of the liquid by one of the following methods:`,
  childNodeIds: ["A3.1.7.1.1.", "A3.1.7.1.2.", "A3.1.7.1.3."],
};

export const A3_1_7_1_1: DocumentNode = {
  id: "A3.1.7.1.1.",
  parentId: "A3.1.7.1.",
  bodyText: `The total gauge pressure measured in the receptacle (that is, the vapor
    pressure of the liquid and the partial pressure of the air, or other inert gases, less 100
    kPa (15 psi) at 55 degrees C (131 degrees F), multiplied by a safety factor of 1.5. The
    total gauge pressure is determined on the basis of a filling temperature of 15 degrees C
    (59 degrees F) and a degree of filling such that the receptacle is not liquid full at a
    temperature of 55 degrees C (131 degrees F).`,
};

export const A3_1_7_1_2: DocumentNode = {
  id: "A3.1.7.1.2.",
  parentId: "A3.1.7.1.",
  bodyText: `Not less than 1.75 times the vapor pressure at 50 degrees C (122 degrees F)
of the material to be transported minus 100 kPa (15 psi) but with a minimum test
pressure of 100 kPa (15 psi).`,
};

export const A3_1_7_1_3: DocumentNode = {
  id: "A3.1.7.1.3.",
  parentId: "A3.1.7.1.",
  bodyText: `Not less than 1.5 times the vapor pressure at 55 degrees C (131 degrees F) of
the material to be transported minus 100 kPa (15 psi) but with a minimum test pressure
of 100 kPa (15 psi).`,
};

export const A3_1_7_2: DocumentNode = {
  id: "A3.1.7.2.",
  parentId: "A3.1.7.",
  title: "Single and Composite Packaging Pressure Requirement.",
  bodyText: `Single packagings containing liquid hazardous material must meet the hydraulic pressure
    test requirements of 49 CFR Section 178.605. A test pressure of not less than 250 kPa (36 psi)
    for liquids of PG I; 80 kPa (12 psi) for PG III liquids in Class 3 or Class 6.1; and 100 kPa (15 psi)
    for all other liquids as outlined in 49 CFR Paragraph 173.27(c). (T-0). If shipping liquid hazardous
    materials in containers that do not meet the internal hydraulic pressure requirement, repack or
    pack into supplementary UN specification certified containers that do meet the requirement.`,
};

export const A3_1_7_3: DocumentNode = {
  id: "A3.1.7.3.",
  parentId: "A3.1.7.",
  title: "Supplementary Packaging.",
  bodyText: `Pack containers holding liquids that do not meet the pressure requirement for air transport
    into a supplementary packaging that does meet the requirement. Separate interior containers by
    absorbent and/or cushioning material as required by Attachment 20. Do not pack pressurized
    containers in sealed metal drums. See Attachment 14 and Attachment 15 for marking/labeling
    requirements and Table A17.1. for certification instructions.`,
};

export const A3_1_8: DocumentNode = {
  id: "A3.1.8.",
  parentId: "A3.1.",
  title: "Indicators.",
  bodyText: `Valves and indicators (with protective caps when required), which are necessary to ensure
    safe transportation, must be installed in the shipping container. (T-0). Examples are relief valves
    (vacuum or pressure), humidity indicators, or leak indicators with adequate sensitivity to alert
    monitor or crew of imminent danger.`,
};

export const A3_1_9: DocumentNode = {
  id: "A3.1.9.",
  parentId: "A3.1.",
  title: "Packaging for certain Class/Divisions.",
  bodyText: `A packaging containing a Packing Group III material with a primary or subsidiary hazard
    of Class/Division 4.1, 4.2, 4.3, 5.1, or 8 must meet Packing Group II performance level. (T-0).`,
};

export const A3_1_10: DocumentNode = {
  id: "A3.1.10.",
  parentId: "A3.1.",
  title: "Inner Packaging.",
  bodyText: `Pack, secure, and cushion inner packagings of combination packagings to prevent breakage
    or leakage and to control movement within the outer container. When partial contents are removed,
    fill voids to ensure a tight pack. Cushioning material must not react dangerously with the contents
    of the inner packagings. (T-0). Inner packagings are required as specified by the applicable packaging
    paragraph. If inner packagings are not required, the packaging paragraph states that inner packagings
    are not necessary. See Attachment 20 for absorbent, closure, and cushioning requirements.`,
};

export const A3_1_11: DocumentNode = {
  id: "A3.1.11.",
  parentId: "A3.1.",
  title: "Outside Package/Container.",
  bodyText: `The package or container must be of such size that there is adequate space to affix all
    markings and labels in a manner required by this manual (Attachment 14 and Attachment 15). (T-0).
    If necessary, use overpacks to provide adequate space.`,
};

export const A3_1_12: DocumentNode = {
  id: "A3.1.12.",
  parentId: "A3.1.",
  title: "Solids in a Liquid Single Packaging.",
  bodyText: `A single or composite packaging which is tested and marked for liquid hazardous materials
    may be filled with a solid hazardous material to a gross mass, in kilograms, not exceeding the
    rated capacity of the packaging in liters, multiplied by the specific gravity marked on the packaging,
    or 1.2 if not marked. In addition:`,
  childNodeIds: ["A3.1.12.1.", "A3.1.12.2."],
};

export const A3_1_12_1: DocumentNode = {
  id: "A3.1.12.1.",
  parentId: "A3.1.12.",
  title: "Single or Composite Packaging for PG I Liquids.",
  bodyText: `A single or composite packaging which is tested and marked for PG I liquid hazardous
    materials may be filled with:`,
  childNodeIds: ["A3.1.12.1.1.", "A3.1.12.1.2."],
};

export const A3_1_12_1_1: DocumentNode = {
  id: "A3.1.12.1.1.",
  parentId: "A3.1.12.1.",
  title: "PG II Solids in PG I Liquid Packagings.",
  bodyText: `A PG II solid hazardous material to a gross mass, in kilograms, not exceeding the rated capacity
    of the packaging in liters, multiplied by 1.5, multiplied by the specific gravity marked on the packaging,
    or 1.2 if not marked.`,
};

export const A3_1_12_1_2: DocumentNode = {
  id: "A3.1.12.1.2.",
  parentId: "A3.1.12.1.",
  title: "PG III Solids in PG I Liquid Packagings.",
  bodyText: `A PG III solid hazardous material to a gross mass, in kilograms, not exceeding the rated capacity
    of the packaging in liters, multiplied by 2.25, multiplied by the specific gravity marked on the packaging,
    or 1.2 if not marked.`,
};

export const A3_1_12_2: DocumentNode = {
  id: "A3.1.12.2.",
  parentId: "A3.1.12.",
  title: "Single or Composite Packaging for PG II Liquids.",
  bodyText: `A single or composite packaging which is tested and marked for PG II liquid hazardous
    materials may be filled with a PG III solid hazardous material to a gross mass, in kilograms,
    not exceeding the rated capacity of the packaging in liters, multiplied by 1.5, multiplied by
    the specific gravity marked on the packaging, or 1.2 if not marked.`,
};

export const A3_1_13: DocumentNode = {
  id: "A3.1.13.",
  parentId: "A3.1.",
  title: "Quantity limits for UN Specification Nonbulk Packagings.",
  bodyText: `Unless otherwise specified, the maximum capacity allowed in a UN Specification
    packaging is expressed in the following table.`,
};

export const A3_1_14: DocumentNode = {
  id: "A3.1.14.",
  parentId: "A3.1.",
  title: "Plastics Drums and Jerricans.",
  bodyText: `The period of use permitted for the transport of a hazardous material in plastics drums and
    jerricans is five years from the date of manufacture. Plastic jerricans used after five years must
    meet all requirements of 49 CFR Section 173.28 for use. (T-0).`,
};

export const A3_1_15: DocumentNode = {
  id: "A3.1.15.",
  parentId: "A3.1.",
  title: "Foreign Packaging.",
  bodyText: `UN standard non-bulk packaging manufactured outside the United States may be shipped by
    military air provided packages are marked according to A14.2, when applicable, and all other
    requirements of this manual are complied with. Refer to A3.3.2.10. for shipping of foreign cylinders.`,
};

export const A3_1_16: DocumentNode = {
  id: "A3.1.16.",
  parentId: "A3.1.",
  title:
    "Empty Packagings, (articles, Fuel Tanks, Containers, Cylinders, Radioactive Packages and Nonhazardous Materials).",
  bodyText: `Except as specified in this paragraph, empty packagings are not subject to any other
    requirements of this manual.`,
  childNodeIds: ["A3.1.16.1.", "A3.1.16.2.", "A3.1.16.3.", "A3.1.16.4."],
};

export const A3_1_16_1: DocumentNode = {
  id: "A3.1.16.1.",
  parentId: "A3.1.16.",
  title: "Empty Containers.",
  bodyText: `Inspect packages that formerly contained a hazardous material covered by this manual to
    determine the presence or absence of hazardous material. If there is presence of hazardous
    material, purge the hazardous material or the package is regulated in the same manner as
    prescribed for the package when it was full. A container is considered empty if:`,
  childNodeIds: ["A3.1.16.1.1.", "A3.1.16.1.2."],
};

export const A3_1_16_1_1: DocumentNode = {
  id: "A3.1.16.1.1.",
  parentId: "A3.1.16.1.",
  title: "Definition of Empty for Hazardous Articles.",
  bodyText: `A hazardous article has been removed from its container and there is no
    possibility of remaining residue (e.g., empty torpedo or missile containers).`,
};

export const A3_1_16_1_2: DocumentNode = {
  id: "A3.1.16.1.2.",
  parentId: "A3.1.16.1.",
  title: "Definition of Empty for Purged Containers.",
  bodyText: `The container has been purged of the hazardous material it previously contained.
    Note: When purging equipment/facilities are not present at a given location, items must
    be properly packaged and certified as hazardous materials. (T-0).`,
};

export const A3_1_16_2: DocumentNode = {
  id: "A3.1.16.2.",
  parentId: "A3.1.16.",
  title: "Empty Cylinders.",
  bodyText: `Compressed gas cylinders are empty if the pressure in the cylinder is less than 40 pounds per
    square inch absolute (psia) at 21 degrees C (70 degrees F). Psia equals the gauge pressure plus
    atmospheric pressure (14.7 psi).`,
  childNodeIds: ["A3.1.16.2.1.", "A3.1.16.2.2.", "A3.1.16.2.3."],
};

export const A3_1_16_2_1: DocumentNode = {
  id: "A3.1.16.2.1.",
  parentId: "A3.1.16.2.",
  title: "Cylinder Inspection.",
  bodyText: `Before shipment, inspect empty cylinders for dents, bulges, oxidation pits, or other damage.
    Handle faulty cylinders as required by the latest DOT regulations or DLAI 4145.25/A700-68/NAVSUPINST
    4440.128D/MCO 10330.2D/AFMAN 23-227(I), Storage and Handling of Liquefied and Gaseous Compressed
    Gasses and Their Full and Empty Cylinders.`,
};

export const A3_1_16_2_2: DocumentNode = {
  id: "A3.1.16.2.2.",
  parentId: "A3.1.16.2.",
  title: "Cylinder Valve Closure.",
  bodyText: `Tightly close valves of cylinders before offering for transportation. The requirements of
    A3.3.2.3. apply to the protection of the valves.`,
};

export const A3_1_16_2_3: DocumentNode = {
  id: "A3.1.16.2.3.",
  parentId: "A3.1.16.2.",
  title: "Residue in Cylinders.",
  bodyText: `If the cylinder contains residue of the following material, ship regulated as full cylinders,
    regardless of psia, unless completely cleaned and purged of residue or vapors:`,
  childNodeIds: ["A3.1.16.2.3.1.", "A3.1.16.2.3.2.", "A3.1.16.2.3.3."],
};

export const A3_1_16_2_3_1: DocumentNode = {
  id: "A3.1.16.2.3.1.",
  parentId: "A3.1.16.2.3.",
  title: "Residue Type: Ammonia, Anhydrous.",
  bodyText: `Ammonia, Anhydrous.`,
};

export const A3_1_16_2_3_2: DocumentNode = {
  id: "A3.1.16.2.3.2.",
  parentId: "A3.1.16.2.3.",
  title: "Residue Type: Division 2.2 with Subsidiary Hazard.",
  bodyText: `Division 2.2 with a subsidiary hazard (other than division 5.1).`,
};

export const A3_1_16_2_3_3: DocumentNode = {
  id: "A3.1.16.2.3.3.",
  parentId: "A3.1.16.2.3.",
  title: "Residue Type: Flammable or Poisonous Material.",
  bodyText: `Contains a flammable or poisonous material.`,
};

export const A3_1_16_3: DocumentNode = {
  id: "A3.1.16.3.",
  parentId: "A3.1.16.",
  title: "Empty Radioactive Material Packaging.",
  bodyText: `Empty the contents of the packaging as far as practical, and ensure the requirements of
    49 CFR Section 173.428 and Attachment 11 are met.`,
};

export const A3_1_16_4: DocumentNode = {
  id: "A3.1.16.4.",
  parentId: "A3.1.16.",
  title: "Identifying Nonregulated Material, Containers or Cylinders.",
  bodyText: `An item listed in Table A4.1. may not be regulated because it does not meet the definition of
    the hazard class. This includes containers or articles defined as empty according to this paragraph.
    In this situation, when the item is determined to be nonregulated, the shipper alerts the carrier by:`,
  childNodeIds: [
    "A3.1.16.4.1.",
    "A3.1.16.4.2.",
    "A3.1.16.4.3.",
    "A3.1.16.4.4.",
  ],
};

export const A3_1_16_4_1: DocumentNode = {
  id: "A3.1.16.4.1.",
  parentId: "A3.1.16.4.",
  title: "Annotate Military Shipment Label.",
  bodyText: `Annotating "NONHAZARDOUS" in the address block of the Military Shipment Label (MSL)
    and/or mark container “Non-Regulated”. In the absence of the MSL, the shipper uses an equivalent
    means of notification.`,
};

export const A3_1_16_4_2: DocumentNode = {
  id: "A3.1.16.4.2.",
  parentId: "A3.1.16.4.",
  title: "Ship as General Cargo.",
  bodyText: `Ship the item as general cargo and a Shipper's Declaration for Dangerous Goods form is not required.`,
};

export const A3_1_16_4_3: DocumentNode = {
  id: "A3.1.16.4.3.",
  parentId: "A3.1.16.4.",
  title: "Apply an 'EMPTY' Label.",
  bodyText: `Apply an "EMPTY" label according to Attachment 15, when applicable. A label is not required for
    equipment or articles unless packaged, crated, or otherwise enclosed to prevent ready identification.`,
};

export const A3_1_16_4_4: DocumentNode = {
  id: "A3.1.16.4.4.",
  parentId: "A3.1.16.4.",
  title: "Conditions When Labels Are Not Required.",
  bodyText: `The "NONHAZARDOUS" entry on the MSL and the use of an "EMPTY" label is not required when
    the hazardous contents are completely removed from the container and there is no possibility of remaining
    residue, and the hazard communication markings and labels are removed or covered. Identify cylinders as
    empty as required by A15.3.4.`,
};

export const A3_1_17: DocumentNode = {
  id: "A3.1.17.",
  parentId: "A3.1.",
  title: "Hidden Hazardous Shipment Indicators.",
  bodyText: `Shippers have not always properly identified all hazardous materials prior to entering the DTS.
    The main reason is lack of knowledge of hazardous materials located or packed in equipment, toolboxes,
    parts, etc. Personnel that ship, inspect or handle cargo in DTS should be aware of potential hidden hazards.
    If hazards are suspected, frustrate the shipment and coordinate with the shipping activity to resolve. The
    following table has examples of cargo that could contain hidden hazards that may endanger the safety of aircraft.`,
};
