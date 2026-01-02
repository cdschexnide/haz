import { DocumentNode } from "../../types";
import { SpecialProvisionsMap } from "../lookupFunctions/specialProvisions";

export const A3_3_7_12_1: DocumentNode = {
  id: "A3.3.7.12.1.",
  parentId: "A3.3.7.12.",
  title: "",
  bodyText:
    "With the exception of UN2908, UN2909, UN2910, UN2911, UN2977, and UN2978, radioactive material with a subsidiary hazard must meet the following:",
  childNodeIds: ["A3.3.7.12.1.1.", "A3.3.7.12.1.2."],
};

export const A3_3_7_12_1_1: DocumentNode = {
  id: "A3.3.7.12.1.1.",
  parentId: "A3.3.7.12.1.",
  title: "",
  bodyText:
    "Be labeled with subsidiary hazard labels corresponding to each subsidiary hazard exhibited by the material. Affix corresponding placards to transport units in accordance with the provisions of Attachment 16.",
};

export const A3_3_7_12_1_2: DocumentNode = {
  id: "A3.3.7.12.1.2.",
  parentId: "A3.3.7.12.1.",
  title: "",
  bodyText:
    "Be allocated to Packing Groups I, II, or III, and if appropriate, by application of the grouping criteria in A4.2.4. corresponding to the nature of the predominant subsidiary hazard.",
};

export const A3_3_7_12_2: DocumentNode = {
  id: "A3.3.7.12.2.",
  parentId: "A3.3.7.12.",
  title: "",
  bodyText:
    "The basic description required on the Shipper's Declaration for Dangerous Goods must include a description of these subsidiary hazards (e.g., “3, 6.1”), the name of the constituents which most predominantly contribute to the subsidiary hazard(s), and where applicable, the packing group.",
};

export const A3_3_7_12_3: DocumentNode = {
  id: "A3.3.7.12.3.",
  parentId: "A3.3.7.12.",
  title: "",
  bodyText:
    "Transport radioactive material with a subsidiary hazard of Division 4.2 (Packing Group I) in Type B packages. Radioactive material with a subsidiary hazard of Division 2.1 is forbidden from transport on passenger aircraft. Radioactive material with a subsidiary hazard of Division 2.3 is forbidden from transport on passenger and cargo aircraft without a waiver or CAA, as appropriate.",
};

export const numericSpecialProvisionsSDDGAndPackagingModifiers: SpecialProvisionsMap =
  {
    "39": "This substance may be carried under provisions other than those of Class 1 only if it is so packed that the percentage of water will not fall below that stated at any time during transport. When phlegmatized with water and inorganic inert material, the content of urea nitrate must not exceed 75 percent by mass and the mixture should not be capable of being detonated by test 1(a)(i) or test 1(a)(ii) in the UN Manual of Tests and Criteria.",
    "177":
      "Gasoline, or, ethanol and gasoline mixtures, for use in internal combustion engines (e.g., in automobiles, stationary engines and other engines) must be assigned to Packing Group II regardless of variations in volatility. (T-0).",
  };
