export enum InhalationHazardZone {
  ZONE_A = "ZONE A",
  ZONE_B = "ZONE B",
  ZONE_C = "ZONE C",
  ZONE_D = "ZONE D",
}

export enum FissileClass {
  FISSILE = "Fissile",
  FISSILE_EXEMPT = "Fissile Exempt",
  CATEGORY_I = "Category I",
  CATEGORY_II = "Category II",
  CATEGORY_III = "Category III",
  CATEGORY_IV = "Category IV",
  NON_FISSILE = "Non-Fissile",
}

export enum PackingGroup {
  PG_I = "PG I",
  PG_II = "PG II",
  PG_III = "PG III",
}

export type SDDGHazardClass = {
  classDivisionNumber: string;
  class: number;
  division?: number;
  subDivision?: string;
  compatibilityGroup?: string;
  storageCompatibilityGroup?: string; // For non-Class 1 materials
  sourceOfIdentification?: string;
};

export interface Key19AccessorialHazard {
  properShippingName: string;
  classDivisionNumber: string;
  class: number;
  division?: number;
  subDivision?: string;
  compatibilityGroup?: string;
  quantity: {
    metricUnits: string;
    usStandardUnits?: string;
  };
}

export enum LWHDimensionalUnits {
  IN = "in",
  FT = "ft",
  CM = "cm",
  M = "m",
  L = "L",
  GALLONS = "gallons",
}

export enum VolumeDimensionalUnits {
  L = "L",
  GALLONS = "gallons",
}

export interface RadioActivePackageDimensions {
  length: {
    value: number;
    unitOfMeasurement: LWHDimensionalUnits;
  };
  width: {
    value: number;
    unitOfMeasurement: LWHDimensionalUnits;
  };
  height: {
    value: number;
    unitOfMeasurement: LWHDimensionalUnits;
  };
  volume: {
    value: number;
    unitOfMeasurement: VolumeDimensionalUnits;
  };
}

export interface DangerousGoodsDeclarationForm {
  key1: {
    shipper: {
      address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      phoneNumber: {
        type: "DSN" | "Commercial";
        number: string; // Phone number format is based on type
        isInternational?: boolean;
        countryCode?: string;
      };
    };
  };
  key2: {
    consignee: {
      movementType: "Channel" | "Mobility";
      dodaac?: string; // Required for Channel, optional for Mobility
      worldwideMobility?: boolean; // If Mobility, allow this instead of DODAAC
    };
  };
  key3: {
    airWaybillNo?: string; // Aircraft manifest number (optional)
  };
  key4?: {
    pagination: {
      currentPage: number;
      totalPages: number;
    };
  };
  key5: {
    tcn: string; // 17-character Transportation Control Number (TCN)
  };
  key6: {
    optionalBlock?: {
      inspectionDate?: string;
      cargoIdentification?: string;
    };
  };
  key7: {
    shipmentWithinPassengerAndCargoAircraftLimitations: {
      passengerAircraft?: boolean;
      cargoAircraft?: boolean;
      cargoAircraftOnly?: boolean;
      passengersAndCargoAircraft?: boolean;
      passengerLimitations?: string; // Determined by P-code (P1-P5)
      specialApprovalDocument?: {
        approvalTransportationMode: string;
      };
    };
  };
  key8: {
    airportOfDeparture: {
      portOfEmbarkation: string;
      geographicalLocation: string;
    };
  };
  key9: {
    airportOfDestination: {
      portOfDebarkation?: string;
      geographicalLocation: string;
      worldwideMobility?: boolean; // If Mobility movement, allow this instead of a specific POD
    };
  };
  key10: {
    shipmentType: {
      radioactive: boolean;
      nonRadioactive: boolean;
    };
  };
  key11: {
    hazardousMaterialIdentifier: {
      unNumber?: string;
      naNumber?: string;
      idNumber?: string;
      rq?: boolean;
    };
  };
  key12: {
    properShippingName: {
      psn: string;
      technicalName?: string;
      mixtureTechnicalNames: string[];
      isInhalationHazard: boolean;
      inhalationHazardZone?: InhalationHazardZone;
      isWaste: boolean;
      emptyUncleaned?: boolean;
      residueLastContained?: boolean;
    };
  };
  key13: {
    classAndDivision: SDDGHazardClass;
  };
  key14: {
    subsidiaryHazards?: SDDGHazardClass[];
    source?: string;
  };
  key15: {
    packingGroup: PackingGroup;
  };
  key16: {
    quantityAndTypeOfPacking: {
      nonRadioactive?: {
        // 16.1.1. and 16.1.2. number of packages and type of packaging
        // e.g. 1 fiberboard box x 3 kg (6.6 pounds)
        numberOfPackages: number;
        typeOfPackaging: {
          descriptionOfPackaging: string;
          unPackagingSpecificationCode?: string;
        };
        // 16.1.3. optional nomenclature and basic description for self-propelled vehicle and mechanical apparatus
        // e.g. 50 KW, 60 HZ for generator
        nomenclature?: string;
        basicDescription?: string;
        // 16.1.4. weight, volume, and other measurements of hazardous material (per package)
        // 16.1.4.2. net quantity in metric units, follwed by English unit equivalent in parentheses
        // 16.1.4.3. show the quantity per package immediately following the number and type of package
        // e.g. 2 wooden boxes x 4.5kg (10 pounds)
        perPackageMeasurements: {
          weightPerPackage: {
            lb: number;
            kg: number;
          };
          volumePerPackage?: {
            L?: number;
            gal?: number;
            cubicMeters?: number;
            cubicFeet?: number;
          };
          height: {
            m: number;
            ft: number;
          };
          netMetricQuantityContentOfShipment: {
            kg: number;
            L: number;
          };
          // 16.1.4.4. NEW in metric weight per package or per warehouse pallet or skid
          // Entry of pounds in association with metric weight is preferred but not required
          // e.g., 3 wooden boxes x 120 kg (264.6 pounds) NEW
          newPerPackage?: {
            kg: number;
            lb: number;
          };
          // 16.1.4.5. for unpackaged explosives (A5.2.), enter the total NEW per PSN/UN number
          // e.g. "On Airdrop Platform X 50 Kg N.E.W, "In Ready Racks X 15 Kg N.E.W",
          unpackagedExplosives?: {
            locationOfStorage: string;
            totalNewPerPsnorUnid: number;
          };
          // 16.1.4.6. Non-explosive items containing explosive components (use predominant hazard)
          nonExplosiveWithExplosives?: {
            predominantHazardQuantity: number;
            unit: "kg" | "L";
          };
          // 16.1.4.7. Compressed gas (must be in kg or L)
          compressedGas?: {
            quantity: number;
            unit: "kg" | "L";
            alternativeUnits?: {
              // Optional alternative units like fluid ounces
              fluidOunces?: number;
              gallons?: number;
              ounces?: number;
            };
          };
        };
        // 16.1.5. Limited Quantity: Net or Gross weight
        limitedQuantity?: {
          typeOfPackage: string;
          netWeight?: {
            kgs: number;
            lbs?: number;
          };
          grossWeight?: {
            kgs: number;
            lbs?: number;
            isGrossWeight: boolean; // If true, "G" should be appended
          };
        };
        // 16.1.6. Overpack Handling
        // “Overpack Used" may alternatively be entered following the Packaging Instruction (Key 17), or applicable authorizations (Key 18) when the open continuous printing form is used.
        overpack?: {
          overpackUsed: boolean;
          numberOfOverpacksUsed?: number;
          totalQuantityPerOverpack?: number;
        };
        // 16.1.7. Magnetized Material (only number/type of packages needed)
        // no entry for net quantity is required
        magnetizedMaterial?: {
          numberOfPackages: number;
          typeOfPackaging: string;
          weightOrSizeOptional?: boolean;
        };
        // 16.1.8. Items classified as "KIT" must enter aggregate quantity
        kitDetails?: {
          aggregateQuantityOfHazardousMaterials: number;
          unit: "kg" | "L";
        };
        // 16.1.9. Multiple-Element Gas Containers
        // e.g. 1 Multiple-Element Gas Container X 40 kg
        // MARK => *** review this section with Mark ***
        multipleElementGasContainers?: {
          numberOfContainers: number;
          quantityPerContainer: number;
          unit: "kg" | "L";
          DotCylinderSpecification: string;
        };
        // 16.1.10. Life-Saving Appliances, Class 9
        // e.g. 1 wooden box x 3 self-inflating life vests
        lifeSavingAppliance?: {
          packaging: string;
          numberOfItems: number;
          description: string; // e.g. "Self-inflating life vests"
        };
      };
      radioactive?: {
        radionuclide: {
          name: string;
          symbol: string;
        };
        description: {
          physicalForm: string;
          chemicalForm: string;
        };
        specialForm?: boolean; // if true, enter "Special Form"
        numberOfPackages: number; // of same type and content
        typeOfPackage: string;
        // activity contained in each package in terms of Becquerel or Terabecquerel
        // the equivalent customary unit of measure (e.g., Ci, mCi, or uCi) may be included in parenthesis
        activityContainedInEachPackage: {
          value: number;
          unit: string; // MARK => should the unit be a defined set of values, or any string?
          // unit: "Bq" | "TBq" | "Ci" | "mCi" | "uCi";
        };
      };
    };
  };
  key17: {
    packagingInstructions: {
      nonRadioactive?: {
        packagingParagraphReference?: string;
        packagingSubparagraphReferences?: string[];
        // 17.1.1.2. IATA, Dangerous Goods Regulations, use packing instruction from Section 4, “List of Dangerous Goods”
        // e.g., 806, 134, etc
        IataDgr?: string;
        // 17.1.1.3. ICAO, Technical Instructions, use packing instructions from Table 3-1, “Dangerous Goods List”
        // 309, 619, etc
        IcaoTechnicalInstructions?: string;
        // 17.1.1.4. 49 CFR, use packaging reference from Part 173 specified in the Hazardous Materials Table (49 CFR Section 172.101, Column 8b)
        // e.g., 173.62, 173.202
        packagingReference49CFR?: string;
        // 17.1.2. If the packaging has been approved by a DOT Special Permit, CAA, COE, or waiver cite the approval number
        // e.g., AFMC 24-204-96-09, COE NA-84-505, DOT-SP 3489
        dotSpecialPermit?: {
          approvalNumber: string;
        };
        coe?: {
          approvalNumber: string;
        };
        caa?: {
          approvalNumber: string;
        };
        // When the packaging requirement is included as part of the explosives hazard classification approval document enter the EX number
        exNumber?: string;
        // 17.1.3. If a UN packaging specification certified package is overpacked to meet air eligibility requirements, cite A3.1.7.3. and the applicable packaging paragraph for the material
        overPack?: {
          A3_1_7_3: string;
          packagingParagraph: string;
        };
        // 17.1.4 Consumer Commodities enter "A13.3." when an item is classified as a “Consumer Commodity”
        // regardless of the original hazard classification of the substance within an individual inner packaging or receptacles
        consumerCommodity?: {
          useConsumerCommodityCitation: boolean;
        };
        // 17.1.5 Limited Quantities enter “A19.3” when an item, regardless of original classification,
        // is packaged as a limited quantity. If an item, in a limited quantity, is packaged under a
        // Special Permit, CAA, COE, or waiver enter the special authorization approval in place of “A19.3.”
        limitedQuantity?: {
          isPackagedUnderSpecialPermitOrWaiver?: boolean;
          useLimitedQuantityCitation?: boolean;
        };
        // 17.1.6. For captured ammunition and ammunition with unknown characteristics shipped
        // according to A3.3.1.7., include in key 17 the reference to A3.3.1.7. and the applicable
        // packaging paragraph from Table A4.1. Include a copy of the EOD safety certification (EOD
        // refer to Joint Service EOD Technical Manual 60A-1-1-7 for an example). Comply with A17.2.7. for classified information
        // e.g., "A3.3.1.7./A5.20."
        // MARK => ask Mark about this one

        // 17.1.7. When shipping unpackaged explosives as specified in paragraph A5.2., enter "A5.2.”
        unpackagedExplosives?: boolean;

        // 17.1.8 When Class 1 materials are secured in authorized packaging and loaded on a tactical
        // vehicle as an operational component according to specified procedures in a technical manual
        // or publication, cite appropriate packaging reference from Attachment 5.
        // MARK => ask Mark about this one
      };
      radioactive?: {
        packagingParagraph?: string;
        packageCategory?: string; // e.g., "I-White", "II-Yellow", "III-Yellow"
        // 17.2.3. The transport index, preceded by the prefix "Ti", assigned each package having a
        // "Radioactive Yellow-II" or "Radioactive Yellow-III" label and dimensions of each package,
        // including dimensional units (for drums, the capacity is acceptable (e.g., 55 gallons)).
        transportIndex?: {
          transportIndexValue?: number;
          dimensionsOfEachPackage?: RadioActivePackageDimensions[];
        };
        // 17.2.4. The fissile class. If the package is exempt enter the words "Fissile Exempt"
        fissileClass?: FissileClass;
      };
    };
  };
  key18: {
    authorization: {
      nonRadioactive?: {
        limitedQuantity?: "Limited Quantity" | "LTD. QTY";
      };
      radioactive?: {
        // 18.2. Radioactive shipments enter Approval Identification Markings (if relevant). List the
        // package identification markings of any of the documents listed below issued by a competent
        // authority. Include the words "attached" to indicate that the documents are attached to the
        // declaration form.
        approvalIdentificationMarkings: {
          isSpecialFormApprovalCertificateAttached?: boolean;
          isTypeBPackageDesignApprovalCertificateAttached?: boolean;
          isTypeBmPackageDesignApprovalCertificateAttached?: boolean;
          isFissileMaterialPackageDesignApprovalCertificateAttached?: boolean;
          isFissileMaterialPackageShipmentApprovalCertificateAttached?: boolean;
          isSpecialArrangementApprovalCertificateAttached?: boolean;
          otherAttachedDocuments?: string[];
        };
      };
    };
  };
  key19: {
    additionalHandlingInformation: {
      general?: {
        accessorialHazards?: Key19AccessorialHazard[];
        handlingInstructions?: {
          // the packaging paragraph reference (if it specifies handling instructions)
          packagingParagraphReference: string;
          instructions: string;
        };
        caa?: {
          authorizationStatement?: string;
          countryOfApproval?: string;
          approvalNumber?: string;
        };
        // See paragraph A17.2.9.3. for Emergency Response numbers used by DOD activities.
        emergencyResponseNumber?: string;
        hazardClassLabelExemption?: {
          permitNumber?: string;
          annotationStatement?: string;
        };
      };
      // 19.2.1. Identify that the item is a kit. This does not apply to an item classified and described
      // in Table A4.1. as a "KIT"
      // e.g., FIRST AID KITS, CHEMICAL KITS, POLYESTER RESIN KITS, etc)
      kits?: {
        itemIsKit?: string;
        // 19.2.2. If shipping a kit consisting of more than one container, enter the statement:
        // "contained in kit piece number ***" (replace "***" with the piece number which contains
        // the hazardous material).
        multiContainerKitStatement?: string;
      };
      class1?: {
        netExplosiveQDWeight?: string; // e.g., "NEWQD: 22.23kg"
        ottoFuelIIEntry?: string; // "Contains Otto Fuel II as a liquid propellant..."
        installedOrEmbeddedExplosives?: {
          properShippingName?: string;
          embeddedExplosiveComponents?: {
            psn?: string;
            hazardClassDivision?: string;
            netExplosiveWeight?: string;
          }[];
        };
        hazardousLiquidOrHypergolicFuel?: {
          handlingInstructions?: string; // "Exercise extreme caution in handling..."
          leakDetectionIndicator?: string; // One of the predefined leak detection statements
        };
        grandfatheredMunitionsStatement?: string; // "Government-owned goods packaged before January 1, 1990."
      };
      class2?: {
        shippingOrientation?: string; // "Ship valve up in vertical position" or "Ship in horizontal position"
        fireExtinguishers?: {
          certificationInstructions?: string;
          attachedEquipment?: string; // e.g., "Trailer"
        };
        cryogenicLiquids?: {
          ventingInstructions?: string;
          ventValveLocation?: string;
          ventingExemptionStatement?: string; // "Container is excepted from venting" or "Vent container to outside of aircraft. Aircrew members monitor vent valves during flight."
        };
      };
      class4And5?: {
        temperatureControl?: {
          controlTemperature?: string;
          emergencyTemperature?: string;
        };
        handlingInstructions?: string; // "Protect from direct sunlight and all sources of heat and place in adequately ventilated area"
        additionalInformation?: {
          authorityApprovalStatement?: string;
          temperatureControlledShippingName?: string;
          sampleIndicator?: string; // Include the word "SAMPLE" in the description if applicable
        };
      };
      class7?: {
        isRadioactiveCategoryIIYellow: boolean;
        isRadioactiveCategoryIIIYellow: boolean;
      };
      class9?: {
        vehiclesAndEquipment?: {
          fuelDetails?: {
            psn?: string;
            hazardClass?: string;
            netQuantity?: string; // e.g., "38 L"
            estimatedQuantityIfDrained?: string;
            nonHazardousFuel?: {
              name?: string;
              quantity?: string;
            };
          };
          accessorialHazards?: {
            batteries?: string; // e.g., "1 each Batteries, Wet, Filled with Acid, 8"
            mountedCylindersAndFireExtinguishers?: string; // e.g., "2 ea. Fire Extinguishers, 2.2"
            installedFireSuppressionSystem?: string;
            mountedEnginesAndGenerators?: string;
            nonHazardousBatteryStatement?: string;
          };
          drainedAndPurgedStatement?: string; // "Drained and Purged"
          technicalDirectiveReference?: string; // e.g., "Drained IAW T.O. XX-XX-XX"
          jerricans?: {
            psn?: string;
            hazardClass?: string;
            numberOfJerricans?: string;
            quantityPerJerrican?: string; // e.g., "4 Jerricans X 19 L"
          };
          magnetizedMaterialStatement?: string; // "Contains Magnetized Material"
        };
        dangerousGoodsInMachineryOrApparatus?: {
          psn?: string;
          hazardClass?: string;
          netQuantity?: string;
        };
        lifeSavingAppliances?: {
          psn?: string;
          hazardClass?: string;
          hazardousComponents?: string[];
        };
        dryIceAsRefrigerant?: {
          psn?: string;
          hazardClass?: string;
          netQuantity?: string;
        };
      };
    };
  };
  key20: {
    // name of official signing the form, military rank may be included
    nameOfSignatory: string;
  };
  key21: {
    Date: Date;
  };
  key22: {
    // the official who certifies that the shipment complies with the requirements of AFMAN24-604
    // can written manually, by mechanical entry, or by a digital method
    signature: string;
  };

  // nonRadioactive?: {
  //   packagingParagraphReference: {
  //     primaryParagraphReference: string;
  //     subParagraphReferences?: string[];
  //   }
  //   caaApprovalNumber?: string;
  //   coeApprovalNumber?: string;
  //   dotSpecialPermitApprovalNumber?: string;
  //   waiverApprovalNumber?: string;
  //   exNumber?: string;
  //   overpackedPackageCitation?: {
  //     packagingParagraphReference: string;
  //   }
  //   consumerCommodity?: boolean;
  //   numberOfPackages: number;
  //   packagingType: string;
  //   netQuantity: {
  //     value: number;
  //     unit: "kg" | "lbs";
  //   };
  //   description?: string; // For vehicles, apparatus, etc.
  //   overpackUsed?: boolean;
  // };
  // radioactive?: {
  //   radionuclide: string;
  //   physicalChemicalForm?: string;
  //   specialForm?: boolean;
  //   numberOfPackages: number;
  //   activity: {
  //     value: number;
  //     unit: "Bq" | "TBq" | "Ci" | "mCi" | "uCi";
  //   };
  // };

  hazardousMaterials: {
    // unNumber: string; // UN, NA, or ID Number
    // properShippingName: string;
    // technicalName?: string;
    // inhalationHazardZone?: "ZONE A" | "ZONE B" | "ZONE C" | "ZONE D";
    // waste?: boolean;
    // emptyUncleaned?: boolean;
    // residueLastContained?: boolean;
    // classAndDivision: {
    //   primary: string; // Hazard class and division number
    //   compatibilityGroup?: string; // For Class 1 materials
    //   storageCompatibilityGroup?: string; // For non-Class 1 materials
    // };
    // subsidiaryHazard?: string; // e.g., "(8,6.1)"
    // packingGroup?: string; // Packing group (PG)
    quantityAndPacking: {
      nonRadioactive?: {
        numberOfPackages: number;
        packagingType: string;
        netQuantity: {
          value: number;
          unit: "kg" | "lbs";
        };
        description?: string; // For vehicles, apparatus, etc.
        overpackUsed?: boolean;
      };
      radioactive?: {
        radionuclide: string;
        physicalChemicalForm?: string;
        specialForm?: boolean;
        numberOfPackages: number;
        activity: {
          value: number;
          unit: "Bq" | "TBq" | "Ci" | "mCi" | "uCi";
        };
      };
    };
  }[];
  packagingInstructions: {
    nonRadioactive?: {
      packagingReference: string; // e.g., A9.8, A13.5, etc.
      approvalNumber?: string; // e.g., DOT-SP XXXX
      overpackUsed?: boolean;
      limitedQuantity?: boolean;
    };
    radioactive?: {
      packagingReference: string; // From Table A4.1
      category: "I-White" | "II-Yellow" | "III-Yellow";
      transportIndex?: string; // e.g., "Ti1.5"
      dimensions?: string; // e.g., "55 gallons"
      fissileClass?: string; // e.g., "Fissile Exempt"
    };
  };
  authorization: {
    nonRadioactive?: {
      limitedQuantity?: boolean;
    };
    radioactive?: {
      approvalCertificates?: string[]; // e.g., ["Special form approval", "Type B design approval"]
    };
  };
  additionalHandlingInformation: {
    accessorialHazards?: {
      unNumber: string;
      properShippingName: string;
      quantity: {
        value: number;
        unit: "kg" | "lbs";
      };
    }[];
    packagingParagraphReference?: string;
    competentAuthorityAnnotation?: string; // If CAA is used
    emergencyResponseNumbers: {
      class1: string;
      class7: string;
      others: {
        domestic: string;
        international: string;
      };
    };
    isKit?: boolean; // Indicates whether the material is a kit
    kitPieceNumber?: string; // If the kit consists of multiple containers
  };
  signatory: {
    name: string; // Name of the logged-in user preparing the shipment
    rank?: string; // Military rank (optional)
    title: string; // e.g., "Hazardous Material Preparer"
  };
  preparationDate: string; // Date the shipment was prepared
  signature: {
    value: string; // Signature of the person certifying compliance
    compliesWith: string; // Certifies compliance with the 24-604
  };
}
