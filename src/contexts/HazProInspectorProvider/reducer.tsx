import { SpecialProvisionsMap } from "../../../server/informativeStatements/informativeStatements";
import {
  Form1015Field,
  form1015Fields,
  form1015Questions,
  initial1015QuestionnaireState,
} from "../../../server/inspector/inspectionQuestions";
import { ReportableQuantityCriteria } from "../../../server/lookupFunctions/hazardousSubstanceCriteria";
import { HazProContextLookupOutput } from "../../../server/lookupFunctions/hazProContextLookup";
import {
  AccessorialHazard,
  ConsigneeAddress,
  DocumentNode,
  EmergencyPhoneNumberMap,
  HazardousMaterialItem,
  Inspector,
  Pre1015Question,
  Preparer,
  QuantityUnit,
  ShipperAddress,
  UN3166Details,
  Validation,
  WorkflowFieldContext,
} from "../../../types";

export interface HazProInspectorContext {
  hazardousMaterial: HazardousMaterialItem | null;
  isReportableQuantity: boolean;
  lookupFunctionsOutput: HazProContextLookupOutput | null;
  modifiersAndRequiredAcknowledgements: {
    generalPackagingRequirementsAcknowledged: boolean;
    informativeStatementsAcknowledged: boolean;
    workflowModifiersAcknowledged: boolean;
    documentNodeInformativeStatements: DocumentNode[];
    documentNodeWorkflowModifiers: DocumentNode[];
    specialProvisionsInformativeStatements: SpecialProvisionsMap;
    specialProvisionsWorkflowModifiers: SpecialProvisionsMap;
  } | null;
  allowablePackingGroups: string;
  totalNetMass?: {
    lbs: number;
    kg: number;
  };
  totalNetVolume?: {
    liters: number;
    gallons: number;
  };
  preparer: Preparer | null;
  packaging: {
    packagingType:
      | "Single"
      | "Combination"
      | "Composite"
      | "CompositePackagingWithPlasticInnerReceptacles"
      | "CompositePackagingWithGlassPorcelainOrStonewareInnerReceptacles"
      | "";
    usesPopMarking?: boolean;
    usesDotCylinderMarking?: boolean;
    inputPOPMarking?: {
      type?: "Solid" | "Liquid" | "Bulk";
      A: string;
      B: string;
      C: string;
      D: string;
      E: string;
      F: string;
      G: string;
      H: string;
    };
    inputCylinderPOPMarking?: string;
    cylinderDetails?: {
      numberOfCylinders: string;
      quantityPerCylinder: {
        lbs: string;
        kgs: string;
      };
      unit: QuantityUnit;
    };
    /* single packaging properties */
    singlePackagingType?: {
      code: string;
      packagingType: string;
    };

    /* composite packaging properties */
    compositePackagingType?: {
      code: string;
      packagingType: string;
    };

    /* intermediate packaging properties */
    intermediatePackagingType?: {
      code: string;
      packagingType: string;
    };

    /* combination packaging properties */
    combinationPackaging?: {
      innerPackaging?: {
        code: string;
        packagingType: string;
      };
      intermediatePackaging?: {
        code: string;
        packagingType: string;
      };
      outerPackaging?: {
        code: string;
        packagingType: string;
      };
      numberOfInnerContainers?: number;
      massPerInnerContainer?: {
        lbs: number;
        kg: number;
      };
      volumePerInnerContainer?: {
        liters: number;
        gallons: number;
      };
    };
    totalNetMass?: {
      lbs: number;
      kg: number;
    };
    totalNetVolume?: {
      liters: number;
      gallons: number;
    };
    popIsValid?: boolean;
  } | null;
  shipment: {
    poeOption: string;
    podOption: string;
    isChapter3?: string;
    tcn: string;
    poe: string;
    pod: string;
    pcs?: number;
    wt?: number;
    cube?: number;
    shipmentType?: string;
    inspector?: string;
    selectedOuterPackaging?: string;
    beingShippedAsExceptedQuantity?: boolean;
    beingShippedAsLimitedQuantity?: boolean;
  } | null;
  inspector: Inspector | null;
  isLimitedQuantity: boolean;
  isExceptedQuantity: boolean;
  olderThanJanuary1st1990?: boolean;
  activeStep: number | null;
  activeSubstep: number | null;
  completedSubsteps: string[];
  absorbentStepRequired: boolean;
  vehiclePreparation?: {
    fuelComplianceConfirmed: boolean;
    batteryComplianceConfirmed: boolean;
    accessoryComplianceConfirmed: boolean;
    technicalManualConfirmed: boolean;
    additionalNotes?: string;
  };
  un3166Details: UN3166Details;
  additionalHandlingInfo: {
    accessorialHazmat: AccessorialHazard[];
    notes: string[];
  };
  activePersona: "Preparer" | "Inspector";
  emergencyPhoneNumberMap: EmergencyPhoneNumberMap;
  exceptedQuantityMarkingStatus: {
    applicable: boolean;
    exceptedQuantityMarkingListItem?: WorkflowFieldContext;
  };
  // key 1
  shipper: {
    name: string;
    movementType: "Channel" | "Mobility" | null;
    // Address
    address: ShipperAddress;
    worldwideMobility: boolean; // If Mobility, allow this instead of address information
    phoneNumber: {
      type: "DSN" | "Commercial";
      number: string;
      isInternational?: boolean;
      countryCode?: string;
    } | null;
  } | null;
  // key 2
  consignee: {
    movementType: "Channel" | "Mobility" | null;
    address: ConsigneeAddress;
    worldwideMobility: boolean; // If Mobility, allow this instead of address information
    phoneNumber: {
      type: "DSN" | "Commercial";
      number: string;
      isInternational?: boolean;
      countryCode?: string;
    } | null;
  } | null;
  // key 3
  airWaybillNo: string | null; // Aircraft manifest number (optional)
  // key 4
  pagination: {
    currentPage: number;
    totalPages: number;
  } | null;
  // key 5
  tcn: string | null; // 17-character Transportation Control Number (TCN)
  // key 6
  optionalBlock?: {
    inspectionDate?: string;
    cargoIdentification?: string;
  } | null;
  // key 7 (can  be determined by HazardousMaterial.specialProvisions (the p-code))
  specialApprovalDocument?: {
    approvalTransportationMode: string;
  } | null;
  // shipmentWithinPassengerAndCargoAircraftLimitations: {
  //   passengerAircraft?: boolean;
  //   cargoAircraft?: bo olean;
  //   cargoAircraftOnly?: boolean;
  //   passengersAndCargoAircraft?: boolean;
  //   passengerLimitations?: string; // Determined by P-code (P1-P5)
  //   specialApprovalDocument?: {
  //     approvalTransportationMode: string;
  //   };
  // };
  // key 8
  airportOfDeparture: {
    // Airfield
    portOfEmbarkation: string;
    geographicalLocation: string;
  } | null;
  // key 9
  airportOfDestination: {
    // Airfield
    portOfDebarkation?: string;
    geographicalLocation: string;
    orldwideMobility?: boolean; // If Mobility movement, allow this instead of a specific POD
  } | null;
  // key 10 (can be determined by HazardousMaterial.hazardClass)
  // shipmentType: {
  //   radioactive : boolean;
  //   nonRadioactive: boolean;
  // };
  // key 11 (can be determined by HazardousMaterial.unid)
  reportableQuantity?: ReportableQuantityCriteria | null;
  // hazardousMaterialIdentifier: {
  //   unNumber?: string;
  //   naNumber?: string;
  //   idNumber?: string;
  //   rq?: boolean;
  // };
  // key 12 (can be  determined by HazardousMaterial)
  technicalName?: string | null;
  mixtureTechnicalNames: string[] | null;
  isWaste: boolean | null;
  emptyUncleaned?: boolean | null;
  residueLastContained?: boolean | null;
  // properShippingName: {
  //   // HazardousMaterial
  //   psn: string;
  //   technica lName?: string;
  //   mixtureTechnicalNames: string[];
  //   isInhalationHazard: boolean;
  //   inhalatio nHazardZone?: InhalationHazardZone;
  //   isWaste: boolea n;
  //   emptyUncleaned?: boolean;
  //   residueLastContained?: boolean;
  // };
  // key 13 (can be determined by HazardousMaterial.hazardClass.classDivisionNumber)
  // classAndDivision: SDDGHazardClass; // HazardousMaterial
  // key 14 (can be determined by HazardousMaterial.subsidiaryRisks)
  // subsidiaryHazards?: SDDGHazardClass[]; // HazardousMaterial
  source?: string | null; // if material is identified by a source other than Table A4.1.
  // key 15 (can be determined by HazardousMaterial.packingGroup)
  // packingGroup: PackingGroup; // HazardousMaterial
  form1015Questions: WorkflowFieldContext[];
  form1015Fields: Form1015Field[];
  initial1015Questions: Pre1015Question[];
  // key 16
  quantityAndTypeOfPacking: {
    nonRadioactive?: {
      // 16.1.1. and 16.1.2. number of packages and type of packaging
      // e.g. 1 fiberboard box x 3 kg (6.6 pounds)
      numberOfPackages?: number;
      typeOfPackaging?: {
        descriptionOfPackaging: string;
        unPackagingSpecificationCode?: string;
      };
      // 16.1.3. optional nomenclature and basic description for self-propelled vehicle and mechanical apparatus
      // e.g. 50 KW, 60 HZ for generator
      nomenclature?: string;
      basicDescription?: string;
      // 16.1.4. w eight, volume, and other measurements of hazardous material (per package)
      // 16.1.4.2. net quantity in metric units, follwed by English unit equivalent in parentheses
      // 16.1.4.3. show the quantity per package immediately following the number and type of package
      // e.g. 2 wooden boxes x 4.5kg (10 pounds)
      perPackageMeasurements?: {
        weightPerPackage: {
          lb: number;
          kg: number;

          volumePerPackage?: {
            L?: number;
            gal?: number;
            cubicMeters?: number;
            cubicFeet?: number;

            weight: {
              m: number;
              ft: number;
            };
            netMetricQuantityContentOfShipment: {
              kg: number;
              L: number;
            };
            // 16.1.4.4.NEW in metric weight per package or per warehouse pallet or skid
            // Entry of pounds in association with metric weight is preferred but not required
            // e.g., 3 wooden boxes x 120 kg(264.6 pounds) NEW
            newPerPackage?: {
              kg: number;
              lb: number;
            };
            // 16.1.4.5. for unpackaged explosives (A5.2.), enter the total NEW per PSN/UN number
            // e.g. "On Airdrop Platform X 50 Kg N.E.W, "In Ready Racks X 15 Kg N.E.W",
            packagedExplosives?: {
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
            // 16.1.5. Limited Quantity: Net or Gross weight
            limitedQuantity?: {
              typeOfPackage: string;
              netWeight?: {
                kgs: number;
                lbs?: number;

                grossWeight?: {
                  kgs: number;
                  lbs?: number;
                  isGrossWeight: boolean; // If true, "G" should be appended
                };
                // 16.1.6. Overpack Handling
                // “Overpack Used" may alternatively be entered following the Packaging Instruction (Key 17), or applicable authorizations (Key 18) when the open continuous printing form is used.
                overpack?: {
                  erpackUsed: boolean;
                  mberOfOverpacksUsed?: number;
                  totalQuantityPerOverpack?: number;
                };
                // 16.1.7.Magnetized Material(only number/ type of packages needed)
                // no entry for net quantity is required
                magnetizedMaterial?: {
                  numberOfPackages: number;
                  ypeOfPackaging: string;
                  eightOrSizeOptional?: boolean;
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
                  nit: "kg" | "L";
                  otCylinderSpecification: string;
                };
                // 16.1.10. Life-Saving Appliances, Class 9
                // e.g. 1 wooden box x 3 self-inflating life vests
                lifeSavingAppliance?: {
                  ackaging: string;
                  umberOfItems: number;
                  escription: string; // e.g. "Self-inflating life vests"
                };

                radioactive?: {
                  radionuclide: {
                    name: string;
                    ymbol: string;
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
                    nit: string; // MARK => should the unit be a defined set of values, or any string?
                    unit: "Bq" | "TBq" | "Ci" | "mCi" | "uCi";
                  };
                };
              };
            };
          };
        };
      };
    } | null;
  } | null;
  // key 17
  packagingInstructions: {
    nonRadioactive?: {
      // packagingParagraphReference?: string; (can be determined by HazardousMaterial.packagingParagraph)
      // packagingSubparagraphReferences?: string[]; (can be determined by HazardousMaterial.packagingParagraph)
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
      // e.g., AFM C 24-204-96-09, COE NA-84-505, DOT-SP 3489
      dotSpecialPermit?: {
        pprovalNumber: string;
      };
      coe?: {
        pprovalNumber: string;
      };
      caa?: {
        pprovalNumber: string;
      };
      // When the packaging requirement is included as part of the explosives hazard classification approval document enter the EX number
      exNumber?: string;
      // 17.1.3. If a UN packaging specification certified package is overpacked to meet air eligibility requirements, cite A3.1.7.3. and the applicable packaging paragraph for the material
      overPack?: {
        3_1_7_3: string;
        ackagingParagraph: string;
      };
      // 17.1.4 Consumer Commodities enter "A13.3." when an item is classified as a “Consumer Commodity”
      // regardless of the original hazard classification of the substance within an individual inner packaging or receptacles
      consumerCommodity?: {
        seConsumerCommodityCitation: boolean;
      };
      // 17.1.5 Limited Quantities enter “A19.3” when an item, regardless of original classification,
      // is packaged as a limited quantity. If an item, in a limited quantity, is packaged under a
      // Special Permit, CAA, COE, or waiver enter the special authorization approval in place of “A19.3.”
      limitedQuantity?: {
        isPackagedUnderSpecialPermitOrWaiver?: boolean;
        seLimitedQuantityCitation?: boolean;
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
      //  MARK => ask M ark about this one

      radioactive?: {
        // packagingParagraph?: string; (can be determined by HazardousMaterial.packagingParagraph)
        packageCategory?: string; // e.g., "I-White", "II-Yellow", "III-Yellow"
        // 17.2.3. The transport index, preceded by the prefix "Ti", assigned each package having a
        // "Radioactive Yellow-II" or "Radioactive Yellow-III" label and dimensions of each package,
        // including di mensional units (for drums, the capacity is acceptable (e.g., 55 gallons)).
        transportIndex?: {
          transportIndexValue?: number;
          // imensionsOfEachPackage?: RadioActivePackageDimensions[];
        };
        // 17.2.4. The fissile class. If the package is exempt enter the words "Fissile Exempt"
        // fissileClass?: FissileClass;
      };
    };
  } | null;
  // key 18
  authorization: {
    // (can be determined by Context.limitedQuantity)
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
        sTypeBPackageDesignApprovalCertificateAttached?: boolean;
        sTypeBmPackageDesignApprovalCertificateAttached?: boolean;
        isFissileMaterialPackageDesignApprovalCertificateAttached?: boolean;
        sFissileMaterialPackageShipmentApprovalCertificateAttached?: boolean;
        sSpecialArrangementApprovalCertificateAttached?: boolean;
        therAttachedDocuments?: string[];
      };
    };
  } | null;
  // key 19
  additionalHandlingInformation: {
    general?: {
      // accessorialHazards?: Key19AccessorialHazard[];
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
        ermitNumber?: string;
        nnotationStatement?: string;
      };

      // 19.2.1.Identify that the item is a kit.This does not apply to an item classified and described
      // in Table A4.1.as a "KIT"
      // e.g., FIRST AID KITS, CHEMICAL KITS, POLYESTER RESIN KITS, etc)
      kits?: {
        itemIsKit?: string;
        // 19.2.2. If shipping a kit consisting of more than one container, enter the statement:
        // "contained in kit piece number ***" (replace "***" with the piece number which contains
        // the hazardous material).
        multiContainerKitStatement?: string;
        class1?: {
          netExplosiveQDWeight?: string; // e.g., "NEWQD: 22.23kg"
          ottoFuelIIEntry?: string; // "Contains Otto Fuel II as a liquid propellant..."
          // Identify all installed or embedded explosive components as accessorial
          // hazards by entering PSN, hazard class/division, and NEW
          installedOrEmbeddedExplosives?: {
            overallDescription?: string;
            mbeddedExplosiveComponents?: {
              psn?: string;
              hazardClassDivision?: string;
              netExplosiveWeight?: string;
            }[];
          };
          hazardousLiquidOrHypergolicFuel?: {
            andlingInstructions?: string; // "Exercise extreme caution in handling..."
            eakDetectionIndicator?: string; // One of the predefined leak detection statements
          };
          grandfatheredMunitionsStatement?: string; // "Government-owned goods packaged before January 1, 1990."

          class2?: {
            shippingOrientation?: string; // "Ship valve up in vertical position" or "Ship in horizontal position"
            fireExtinguishers?: {
              certificationInstructions?: string;
              attachedEquipment?: string; // e.g., "Trailer"
            };
            cryogenicLiquids?: {
              entingInstructions?: string;
              entValveLocation?: string;
              entingExemptionStatement?: string; // "Container is excepted from venting" or "Vent container to outside of aircraft. Aircrew members monitor vent valves during flight."
            };
          };
          class4And5?: {
            temperatureControl?: {
              controlTemperature?: string;
              mergencyTemperature?: string;
            };
            handlingInstructions?: string; // "Protect from direct sunlight and all sources of heat and place in adequately ventilated area"
            additionalInformation?: {
              authorityApprovalStatement?: string;
              temperatureControlledShippingName?: string;
              sampleIndicator?: string; // Include the word "SAMPLE" in the description if applicable

              class7?: {
                isRadioactiveCategoryIIYellow: boolean;
                isRadioactiveCategoryIIIYellow: boolean;

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
          };
        };
      };
    };
  } | null;
  // key 20
  // name of official signing the form, military rank may be included
  nameOfSignatory: string | null;
  // key 21
  Date: Date | null;
  // key 22
  // the official who certifies that the shipment complies with the requirements of AFMAN24-604
  //can written manually, by mechanical entry, or by a digital method
  signature: string | null;
}

export interface HazProInspectorState {
  hazProInspectorContext: HazProInspectorContext;
}

export type HazProInspectorAction =
  | { type: "UPDATE_FIELD"; field: keyof HazProInspectorContext; value: any }
  | { type: "UPDATE_NESTED_FIELD"; field: string; value: any }
  | { type: "COMPLETE_SUBSTEP"; payload: string }
  | { type: "RESET_CONTEXT" }
  | {
      type: "UPDATE_1015_FORM";
      id: string;
      childId?: string;
      value: Validation;
      inspectionFailedAt?: Date;
      failureCorrectedAt?: Date;
      hasBeenFailed?: boolean;
    };

export const hazProInspectorReducer = (
  state: HazProInspectorState,
  action: HazProInspectorAction
): HazProInspectorState => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        hazProInspectorContext: {
          ...state.hazProInspectorContext,
          [action.field]: action.value,
        },
      };
    case "UPDATE_NESTED_FIELD":
      const keys = action.field.split(".");
      return {
        ...state,
        hazProInspectorContext: updateNestedField(
          state.hazProInspectorContext,
          keys,
          action.value
        ),
      };
    case "UPDATE_1015_FORM": {
      const updatedQuestions =
        state.hazProInspectorContext.form1015Questions.map(question => {
          if (question.identifier === action.id) {
            if (action.childId) {
              const updatedChildFields = question.childFields.map(child => {
                if (
                  child.id === action.childId ||
                  child.identifier === action.childId
                ) {
                  return {
                    ...child,
                    currentValue: action.value,
                  };
                }
                return child;
              });

              return { ...question, childFields: updatedChildFields };
            } else {
              return {
                ...question,
                currentValue: action.value,
                ...(action.inspectionFailedAt && {
                  inspectionFailedAt: action.inspectionFailedAt,
                }),
                ...(action.hasBeenFailed && {
                  hasBeenFailed: action.hasBeenFailed,
                }),
                ...(action.failureCorrectedAt && {
                  failureCorrectedAt: action.failureCorrectedAt,
                }),
              };
            }
          }
          return question;
        });

      return {
        ...state,
        hazProInspectorContext: {
          ...state.hazProInspectorContext,
          form1015Questions: updatedQuestions,
        },
      };
    }

    case "RESET_CONTEXT":
      return initialHazProInspectorState;
    default:
      return state;
  }
};

const updateNestedField = (
  obj: any,
  keys: string[],
  value: any
): HazProInspectorContext => {
  if (keys.length === 1) {
    return { ...obj, [keys[0]]: value };
  }
  const [firstKey, ...restKeys] = keys;
  return {
    ...obj,
    [firstKey]: updateNestedField(obj[firstKey] || {}, restKeys, value),
  };
};

export const initialHazProInspectorState: HazProInspectorState = {
  hazProInspectorContext: {
    hazardousMaterial: null,
    isReportableQuantity: false,
    lookupFunctionsOutput: null,
    modifiersAndRequiredAcknowledgements: null,
    inspector: null,
    isLimitedQuantity: false,
    isExceptedQuantity: false,
    shipment: {
      poeOption: "Channel",
      podOption: "Channel",
      tcn: "",
      poe: "",
      pod: "",
    },
    un3166Details: {
      vehicleNomenclature: "",
      quantity: null,
      fuelType: null,
      fuelEntryMode: null,
      unit: "liters",
      tankCount: 0,
      multiTanks: [],
      accessorialHazards: {
        batteries: {
          accessorialHazardousMaterialIdentification: null,
          quantity: "",
        },
        fireExtinguishers: {
          accessorialHazardousMaterialIdentification: null,
          quantity: "",
        },
        starterFluid: {
          accessorialHazardousMaterialIdentification: null,
          volume: {
            liters: null,
            gallons: null,
          },
        },
        other: [],
      },
    },
    activePersona: "Preparer",
    emergencyPhoneNumberMap: {
      class1Explosives: [
        {
          name: "The Army Operations Center",
          phoneNumber: {
            commercial: "+1 (703) 695-4695/4696",
            dsn: "312-225-4695/4696",
          },
        },
      ],
      class7RadioactiveMaterial: [
        {
          name: "Army",
          phoneNumber: {
            commercial: "+1 (703) 695-4695/4696",
            dsn: "(312) 225-4695/4696",
          },
        },
        {
          name: "Air Force",
          phoneNumber: {
            commercial: "+1 (202) 767-4011",
          },
        },
        {
          name: "Navy/Marines",
          phoneNumber: {
            commercial: "+1 (757) 887-4692",
            dsn: "(312) 953-4692",
          },
        },
        {
          name: "DLA",
          phoneNumber: {
            commercial: "+1 (717) 770-5283",
          },
        },
      ],
      allOtherHazardousMaterials: {
        domestic: {
          phoneNumber: "1-800-851-8061",
        },
        international: {
          phoneNumber: "+1-804-279-3131",
        },
      },
    },
    allowablePackingGroups: "",
    packaging: {
      packagingType: "",
      cylinderDetails: {
        numberOfCylinders: "",
        quantityPerCylinder: {
          lbs: "",
          kgs: "",
        },
        unit: QuantityUnit.LBS,
      },
      inputPOPMarking: {
        A: "",
        B: "",
        C: "",
        D: "",
        E: "",
        F: "",
        G: "",
        H: "",
      },
      totalNetMass: {
        lbs: 0,
        kg: 0,
      },
      totalNetVolume: {
        liters: 0,
        gallons: 0,
      },
      combinationPackaging: {
        massPerInnerContainer: {
          lbs: 0,
          kg: 0,
        },
        volumePerInnerContainer: {
          liters: 0,
          gallons: 0,
        },
      },
      popIsValid: true,
    },
    shipper: {
      name: "",
      movementType: null,
      worldwideMobility: false,
      address: {
        shipperLocation: "",
        shipperStreet: "",
        shipperCity: "",
        shipperState: "",
        selectedShipperCountry: "",
        shipperZipcode: "",
      },
      phoneNumber: null,
    },
    consignee: {
      movementType: null,
      worldwideMobility: false,
      address: {
        consigneeDodaac: "",
        consigneeStreet: "",
        consigneeCity: "",
        consigneeState: "",
        selectedConsigneeCountry: "",
        consigneeZipcode: "",
      },
      phoneNumber: null,
    },
    airWaybillNo: "",
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
    tcn: "",
    optionalBlock: {},
    specialApprovalDocument: {
      approvalTransportationMode: "",
    },
    airportOfDeparture: {
      portOfEmbarkation: "",
      geographicalLocation: "",
    },
    airportOfDestination: {
      geographicalLocation: "",
    },
    reportableQuantity: undefined,
    technicalName: "",
    mixtureTechnicalNames: [],
    isWaste: false,
    emptyUncleaned: false,
    residueLastContained: false,
    source: "",
    quantityAndTypeOfPacking: {},
    packagingInstructions: {},
    authorization: {},
    additionalHandlingInformation: {},
    nameOfSignatory: "",
    activeStep: null,
    activeSubstep: null,
    completedSubsteps: [],
    Date: new Date(),
    signature: "",
    absorbentStepRequired: false,
    additionalHandlingInfo: {
      accessorialHazmat: [],
      notes: [],
    },
    form1015Questions: form1015Questions,
    form1015Fields: form1015Fields,
    initial1015Questions: initial1015QuestionnaireState,
    exceptedQuantityMarkingStatus: {
      applicable: false,
    },
    preparer: null,
  },
};
