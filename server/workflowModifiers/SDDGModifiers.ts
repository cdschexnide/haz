import { SpecialProvisionsMap } from "../lookupFunctions/specialProvisions";

export const numericSpecialProvisionsSDDGModifiers: SpecialProvisionsMap = {
  "1": "This material is poisonous by inhalation in Hazard Zone A, describe as an inhalation hazard.",
  "2": "This material is poisonous by inhalation in Hazard Zone B, describe as an inhalation hazard.",
  "3": "This material is poisonous by inhalation in Hazard Zone C, describe as an inhalation hazard.",
  "4": "This material is poisonous by inhalation in Hazard Zone D, describe as an inhalation hazard.",
  "6": "This material is poisonous by inhalation and must be described as an inhalation hazard. (T-0).",
  "8": "A hazardous substance that is not a hazardous waste may be shipped under the shipping description “Other regulated substance, liquid or solid”, as appropriate.",
  "13": "Enter the words “Inhalation Hazard” on each shipping paper in association with the shipping description.",
  "46": "During transport, it must be protected from direct sunshine and stored (or kept) in a cool and well-ventilated place, away from all sources of heat. (T-0).",
  "51": "This description applies to items previously described as “Toy propellant devices, Class C” and includes reloaded kits. Model rocket motors containing 30 grams or less propellant are classed as Division 1.4S and items containing more than 30 grams of propellant but not more than 62.5 grams of propellant are classed as Division 1.4C.",
  "165":
    /* Is this an Key 19 modifier? */ "These substances are susceptible to exothermic decomposition at elevated temperatures. Decomposition can be initiated by heat, moisture or by impurities (e.g., powdered metals (iron, manganese, cobalt, magnesium)). During the course of transportation, these substances must be shaded from direct sunlight and all sources of heat and be placed in adequately ventilated areas. (T-0).",
  "182":
    "Equipment containing only lithium batteries must be classified as either UN3091 or UN3481. (T- 0).",
  "328":
    "When lithium metal or lithium ion batteries are contained in the fuel cell system, the item must be described under this entry and the appropriate entries for “Lithium metal batteries contained in equipment” or “Lithium ion batteries contained in equipment”. (T-0).",
  "368":
    "In the case of non-fissile or fissile-excepted uranium hexafluoride, the material must be classified under UN3507 or UN2978. (T-0).",
  "369":
    "This radioactive material in an excepted package possessing toxic and corrosive properties is classified in Division 6.1 with radioactivity and corrosive subsidiary risks.",
};

export const aCodeSDDGModifiers: SpecialProvisionsMap = {
  A43: "Toxins from plant, animal or bacterial sources, which contain infectious substances, or toxins that are contained in infectious substances, must be classified as Division 6.2. (T-0).",
  A69: "May be transported using a DOT hazard classification approval. Except for Class/Division 1.4S, a copy of the approval must accompany the shipment. (T-0). See A3.3.1.4.",
  A213: "Lithium batteries containing both primary lithium metal cells and rechargeable lithium ion cells must be assigned to UN numbers 3090 or 3091 as appropriate. (T-0).",
};
