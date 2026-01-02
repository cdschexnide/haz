// Table A16.1. Placard Requirements from AFMAN24-604
// Placards Required for Parked Area Aircraft Containing Hazardous Cargo

export interface PlacardRequirement {
  hazardClass: string;
  placard: string;
  requiresWeight?: boolean; // true if this requirement only applies to 1,001+ lbs
  specialConditions?: string; // for special conditions like "Inhalation Hazard Zone A or B"
}

// Top section: Placards required for any quantity
export const anyQuantityPlacardRequirements: PlacardRequirement[] = [
  {
    hazardClass: "1.1",
    placard: "EXPLOSIVES 1.1",
    requiresWeight: false
  },
  {
    hazardClass: "1.2", 
    placard: "EXPLOSIVES 1.2",
    requiresWeight: false
  },
  {
    hazardClass: "1.3",
    placard: "EXPLOSIVES 1.3", 
    requiresWeight: false
  },
  {
    hazardClass: "2.3",
    placard: "TOXIC GAS",
    requiresWeight: false
  },
  {
    hazardClass: "4.3",
    placard: "DANGEROUS WHEN WET",
    requiresWeight: false
  },
  {
    hazardClass: "5.2",
    placard: "ORGANIC PEROXIDE",
    requiresWeight: false,
    specialConditions: "Organic peroxide, Type B, liquid or solid temperature controlled"
  },
  {
    hazardClass: "6.1",
    placard: "TOXIC INHALATION HAZARD", 
    requiresWeight: false,
    specialConditions: "Inhalation Hazard Zone A or B"
  },
  {
    hazardClass: "7",
    placard: "RADIOACTIVE",
    requiresWeight: false,
    specialConditions: "Radioactive Category III-Yellow label only"
  }
];

// Bottom section: Placards required for 1,001 pounds or more aggregate gross weight
export const weightBasedPlacardRequirements: PlacardRequirement[] = [
  {
    hazardClass: "1.4",
    placard: "EXPLOSIVES 1.4",
    requiresWeight: true
  },
  {
    hazardClass: "1.5",
    placard: "EXPLOSIVES 1.5", 
    requiresWeight: true
  },
  {
    hazardClass: "1.6",
    placard: "EXPLOSIVES 1.6",
    requiresWeight: true
  },
  {
    hazardClass: "2.1",
    placard: "FLAMMABLE GAS",
    requiresWeight: true
  },
  {
    hazardClass: "2.2", 
    placard: "NONFLAMMABLE GAS",
    requiresWeight: true
  },
  {
    hazardClass: "3",
    placard: "FLAMMABLE",
    requiresWeight: true
  },
  {
    hazardClass: "4.1",
    placard: "FLAMMABLE SOLID",
    requiresWeight: true
  },
  {
    hazardClass: "4.2",
    placard: "SPONTANEOUSLY COMBUSTIBLE", 
    requiresWeight: true
  },
  {
    hazardClass: "5.1",
    placard: "OXIDIZER",
    requiresWeight: true
  },
  {
    hazardClass: "5.2",
    placard: "ORGANIC PEROXIDE",
    requiresWeight: true,
    specialConditions: "Other than organic peroxide, Type B, liquid or solid, temperature controlled"
  },
  {
    hazardClass: "6.1",
    placard: "TOXIC",
    requiresWeight: true,
    specialConditions: "other than inhalation hazard, Zone A or B"
  },
  {
    hazardClass: "6.2",
    placard: "NONE REQUIRED",
    requiresWeight: true
  },
  {
    hazardClass: "8",
    placard: "CORROSIVE",
    requiresWeight: true
  }
];

// Combined requirements for easy lookup
export const allPlacardRequirements = [
  ...anyQuantityPlacardRequirements,
  ...weightBasedPlacardRequirements
];

// Weight threshold for bottom section requirements (in pounds)
export const WEIGHT_THRESHOLD_LBS = 1001;

// Helper function to convert kg to lbs
export const kgToLbs = (kg: number): number => {
  return kg * 2.20462;
};

// Helper function to convert lbs to kg  
export const lbsToKg = (lbs: number): number => {
  return lbs / 2.20462;
};

// Function to determine placard requirements based on hazard class and weight
export const getPlacardRequirements = (hazardClass: string, weightInLbs: number): PlacardRequirement[] => {
  const requirements: PlacardRequirement[] = [];
  
  // Check any quantity requirements first
  const anyQuantityReq = anyQuantityPlacardRequirements.find(req => req.hazardClass === hazardClass);
  if (anyQuantityReq) {
    requirements.push(anyQuantityReq);
  }
  
  // Check weight-based requirements if weight is 1,001 lbs or more
  if (weightInLbs >= WEIGHT_THRESHOLD_LBS) {
    const weightBasedReq = weightBasedPlacardRequirements.find(req => req.hazardClass === hazardClass);
    if (weightBasedReq) {
      requirements.push(weightBasedReq);
    }
  }
  
  return requirements;
};
