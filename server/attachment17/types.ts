interface CertificationContext {
  shipper: string; // Key 1
  consignee: string; // Key 2
  airWaybillNo?: string; // Key 3 (Optional)
  tcn: string; // Key 5
  shipmentType: "Radioactive" | "Nonradioactive"; // Key 10
  hazardousMaterials: HazardousMaterial[];
  airportOfDeparture: string; // Key 8
  airportOfDestination: string; // Key 9
  additionalHandlingInfo?: string; // Key 19
}

interface HazardousMaterial {
  unNumber: string; // Key 11
  properShippingName: string; // Key 12
  hazardClass: string; // Key 13
  subsidiaryHazards?: string[]; // Key 14
  packingGroup?: string; // Key 15
  quantity: {
    type: string; // e.g., "boxes", "cylinders"
    count: number;
    netWeightKg: number;
  }; // Key 16
  packagingInstructions: string; // Key 17
  authorization?: string; // Key 18
}

interface SDDGResult {
  success: boolean;
  sddgData?: string; // Generated SDDG form data as a string
  errors?: string[]; // Error messages if validation fails
}

type HazardousMaterialMap = Map<string, HazardousMaterial>;
