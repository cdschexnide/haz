import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";

export function evaluateMarkingRequirementsInspector(
  sddgInspectionContext: any
): Record<string, string[]> {
  const markings: Record<string, string[]> = {};

  if (!sddgInspectionContext) return markings;

  // Use verification copy (post-verification data) if available, fallback to original extracted content
  const extractedContentFromSddg =
    sddgInspectionContext.verificationCopy ||
    sddgInspectionContext.extractedContent;

  console.log(
    "?>? evaluateMarkingRequirementsInspector() function => : extractedContentFromSddg",
    JSON.stringify(extractedContentFromSddg, null, 2)
  );
  console.log(
    "?>? evaluateMarkingRequirementsInspector() function => : verificationCopy available?",
    !!sddgInspectionContext.verificationCopy
  );

  if (!extractedContentFromSddg) return markings;

  const hazmatItem = hazardousMaterialsList.find(
    item => item.unid === extractedContentFromSddg.unIdNo
  );
  const authoritativeHazardClass =
    hazmatItem?.hazclassDiv || extractedContentFromSddg.hazardClass;

  // Required for ALL shipments: Military Shipping Label (MSL) or DD Form 1387
  markings["Military Shipping Label (MSL) or DD Form 1387"] = [
    "Full shipper and consignee name/address (shipping label per MIL-STD-129 acceptable)",
  ];

  //   // TODO Later
  //   if (context.usesCoeCertification === true) {
  //     markings["COE Number"] = [`${context.coeAndCaaDocuments?.coeDocuments?.[0]?.name}`];
  //   }

  //   // TODO Later
  //   if (context.usesDotSpPermit === true) {
  //     markings["DOT Special Permit"] = [`${context.dotSpWaivers?.[0]?.waiverNumber}`];
  //   }

  //   // TODO Later
  //   if (context.usesCaaCertification === true) {
  //     markings["CAA Number"] = [`${context.coeAndCaaDocuments?.caaDocuments?.[0]?.name}`];
  //   }

  //   // TODO Later
  //   if (context.technicalName !== "" && context.technicalName !== null && context.technicalName !== undefined) {
  //     markings["Technical Name"] = [context.technicalName];
  //   }

  //   // TODO Later
  //   if (context.installedExplosivesDetails?.installationLocation !== "" && context.installedExplosivesDetails?.installationLocation !== null && context.installedExplosivesDetails?.installationLocation !== undefined) {
  //     markings["Installation Location"] = [context.installedExplosivesDetails?.installationLocation];
  //   }

  //   // TODO Later
  //   if (context.packaging?.cylinderDetails?.cryogenicLiquidDetails?.ventRateInSCFH !== "" && context.packaging?.cylinderDetails?.cryogenicLiquidDetails?.ventRateInSCFH !== null && context.packaging?.cylinderDetails?.cryogenicLiquidDetails?.ventRateInSCFH !== undefined) {
  //     markings["Vent Rate in SCFH"] = [`${context.packaging?.cylinderDetails?.cryogenicLiquidDetails?.ventRateInSCFH} SCFH`];
  //   }

  //   // add UI to determine this
  //   if (context.hazardousMaterial?.flashPoint !== undefined && context.hazardousMaterial?.flashPoint !== null) {
  //     markings["Flash Point"] = [`${context.hazardousMaterial?.flashPoint?.celsius}°C (${context.hazardousMaterial?.flashPoint?.fahrenheit}°F)`];
  //   }

  // TODO - POP Marking Inspector Screen
  if (extractedContentFromSddg.unIdNo !== "UN3166") {
    markings["PSN and UN Number"] = [
      `${extractedContentFromSddg.properShippingName} ${extractedContentFromSddg.unIdNo}`,
    ];

    // TODO - POP Marking
    // if (packaging?.inputPOPMarking) {
    //   const pop = packaging.inputPOPMarking;
    //   let popMarking = `${pop.B}/${pop.C} ${pop.D}`;
    //   if (pop.E) popMarking += `/${pop.E}`;
    //   if (pop.F) popMarking += `/${pop.F}`;
    //   if (pop.G) popMarking += `/${pop.G}`;
    //   if (pop.H) popMarking += `/${pop.H}`;
    //   markings["POP Marking"] = [popMarking];
    // }
  }

  if (extractedContentFromSddg.unIdNo === "UN3316") {
    const kitType =
      sddgInspectionContext.kitInspectionData?.kitType ||
      extractedContentFromSddg.properShippingName ||
      "";
    const kitTypeUpper = kitType.toUpperCase();
    if (kitTypeUpper.includes("FIRST AID")) {
      markings["First Aid Kit Marking"] = ["FIRST AID KITS"];
    } else if (kitTypeUpper.includes("CHEMICAL")) {
      markings["Chemical Kit Marking"] = ["CHEMICAL KITS"];
    }
  }

  //   // TODO Later
  //   if (context.dryIceData?.quantity) {
  //     markings["DRY ICE"] = [`${context.dryIceData?.quantity} KG`];
  //   }

  //   // TODO Later
  //   if (extractedContentFromSddg.unIdNo === "UN3090" && context.isExceptedQuantity === true) {
  //     markings["Excepted Lithium Batteries"] = ["EXCEPTED LITHIUM BATTERIES"];
  //   } else if (extractedContentFromSddg.unIdNo === "UN3480" && context.isExceptedQuantity === true) {
  //     markings["Excepted Lithium Batteries"] = ["EXCEPTED LITHIUM BATTERIES"];
  //   }

  //   const quantity = hazmat.physicalState === PhysicalState.SOLID ? packaging?.totalNetMass?.kg : undefined;
  //   const reportableQuantityAmount = context.lookupFunctionsOutput?.reportableQuantityRequirement?.kilograms || 0;

  //   // TODO Later
  //   if (quantity !== undefined && reportableQuantityAmount !== 0 && quantity > reportableQuantityAmount) {
  //     markings["Reportable Quantity"] = ["RQ"];
  //   }

  if (
    extractedContentFromSddg.properShippingName
      .toLowerCase()
      .includes("inhalation hazard")
  ) {
    markings["Inhalation Hazard"] = ["Inhalation Hazard"];
  }

  if (sddgInspectionContext.quantityType === "limited") {
    markings["Limited Quantity Marking"] = ["Limited Quantity"];
  }

  // A14.3.7 - Overpack marking (Key 16 includes "overpack")
  if (/overpack/i.test(extractedContentFromSddg.quantityAndPacking || "")) {
    markings["OVERPACK"] = ["OVERPACK"];
  }

  //   // TODO Later
  //   if (hazmat.physicalState === PhysicalState.LIQUID &&
  //       (packaging?.packagingType === "Combination" || overpack === true)) {
  //     markings["Orientation Marking"] = ["This Side Up"];
  //   }

  //   // TODO Later
  //   if (overpack === true) {
  //     markings["Overpack"] = ["OVERPACK"];
  //   }

  //   // TODO Later
  //   if (context.isLimitedQuantity === true) {
  //     markings["Limited Quantity"] = ["LIMITED QUANTITY"];
  //   }

  //   // TODO Later
  //   if (context.isExceptedQuantity === true) {
  //     markings["Excepted Quantity"] = ["EXCEPTED QUANTITY"];
  //   }

  //   // TODO Later
  //   if (context.isGrandfatheredExplosive === true) {
  //     delete markings["PSN and UN Number"];
  //     markings["DOT/Military Specification"] = ["DOT or military/federal specification number"];
  //   }

  //   // TODO Later
  //   if (hazmat.hazclassDiv.startsWith("1") && hazmat.physicalState === PhysicalState.LIQUID) {
  //     markings["This Side Up"] = ["THIS SIDE UP"];
  //   }

  if (extractedContentFromSddg.unIdNo === "UN1040") {
    markings["This End Up"] = ["THIS END UP"];
  }

  if (extractedContentFromSddg.unIdNo === "UN1044") {
    markings["DOT Requirements"] = ["MEETS DOT REQUIREMENTS"];
  }

  //   if (extractedContentFromSddg.properShippingName.includes("cryogenic liquid") && extractedContentFromSddg.packingInstruction === "A6.11.") {
  //     markings["Cryogenic Orientation"] = ["Orientation arrows", "THIS END UP"];
  //     if (context.dryIceData?.quantity) {
  //       const ventRate = "**"; // Placeholder - would need actual vent rate calculation
  //       markings["Vent Rate"] = [`VENT RATE${ventRate}SCFH`];
  //     }
  //   }

  const cylinderMarkingConditions = [
    extractedContentFromSddg.packingInstruction === "A6.2.",
    extractedContentFromSddg.properShippingName.includes("REFRIGERANT GAS") &&
      extractedContentFromSddg.packingInstruction?.includes("A6.4."),
    ["UN1011", "UN1012", "UN1075", "UN1978"].includes(
      extractedContentFromSddg.unIdNo
    ),
  ];

  if (cylinderMarkingConditions.some(condition => condition)) {
    markings["Inside Containers Comply"] = [
      "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS",
    ];
  }

  if (
    authoritativeHazardClass?.startsWith("3") &&
    hazmatItem?.flashPoint
  ) {
    markings["Flash Point"] = [
      `${hazmatItem.flashPoint.celsius}°C (${hazmatItem.flashPoint.fahrenheit}°F)`,
    ];
  }

  //   if ((extractedContentFromSddg.unIdNo === "UN1745" || extractedContentFromSddg.unIdNo === "UN1746") &&
  //       context.cylinderProperties?.some(cylinder => cylinder.cylinderType === "DOT3E1800")) {
  //     markings["Inside Containers Comply Oxidizer"] = ["INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS"];
  //   }

  if (extractedContentFromSddg.unIdNo === "UN3356") {
    markings["Oxygen Generator"] = ["oxygen generator, chemical"];
  }

  //   if (hazmat.hazclassDiv === "6.1" &&
  //       ["4H1", "4H2", "1H1", "1H2", "3H1", "3H2", "5H1", "5H2", "6HA1", "6HB1", "6HC", "6HD", "6HG", "6HH1", "6HH2"].includes(packaging?.inputPOPMarking?.B || "") &&
  //       ["Single", "Composite", "CompositePackagingWithPlasticInnerReceptacles", "CompositePackagingWithGlassPorcelainOrStonewareInnerReceptacles"].includes(packaging?.packagingType || "")) {
  //     markings["Poison"] = ["POISON"];
  //   }

  /* Still need to do this one */
  if (extractedContentFromSddg.unIdNo === "UN3373") {
    markings["Biological Substance"] = [
      "BIOLOGICAL SUBSTANCE, CATEGORY B",
      "UN3373",
    ];
  }

  // Kit markings handled above.

  // UN3508 Capacitor, Asymmetric - Energy Storage Capacity marking requirement
  if (extractedContentFromSddg.unIdNo === "UN3508") {
    markings["Energy Storage Capacity"] = [
      "Energy storage capacity in Watt-hours (Wh)",
      "Required for capacitors manufactured after December 31, 2015",
    ];
  }

  // A14.4.1.2 - EX number or NSN for explosives
  if (authoritativeHazardClass?.startsWith("1")) {
    markings["EX Number/NSN"] = ["EX number or NSN"];
  }

  //   if (hazmat.properShippingName === "BATTERY-POWERED EQUIPMENT" &&
  //       context.batteryVehicle?.isWheelchair === true &&
  //       context.batteryVehicle?.batteryInstalled === false) {
  //     markings["Battery Equipment This Side Up"] = ["THIS SIDE UP"];
  //   }

  // if (extractedContentFromSddg.unIdNo === "UN3363") {
  //   markings["Machinery PSN UN"] = [extractedContentFromSddg.properShippingName, extractedContentFromSddg.unIdNo];
  // }

  //   if (extractedContentFromSddg.unIdNo === "UN1845") {
  //     const dryIceMarkings = ["DRY ICE"];
  //     if (context.dryIceData?.quantity) {
  //       const quantity = context.dryIceData.quantity;
  //       const poundsWeight = (parseFloat(quantity) * 2.20462262).toFixed(2);
  //       dryIceMarkings.push(`${quantity} KG (${poundsWeight}LBS)`);
  //     }
  //     markings["DRY ICE"] = dryIceMarkings;
  //   }

  //   if (["UN3090", "UN3480"].includes(extractedContentFromSddg.unIdNo) && context.isExceptedQuantity === true) {
  //     markings["Lithium Battery Mark"] = ["lithium battery mark"];
  //   }

  //   if (extractedContentFromSddg.unIdNo === "UN3090") {
  //     markings["Lithium Metal Warning"] = [
  //       "LITHIUM METAL BATTERIES – FORBIDDEN FOR TRANSPORT ABOARD PASSENGER AIRCRAFT",
  //       "CARGO AIRCRAFT ONLY"
  //     ];
  //   }

  return markings;
}
