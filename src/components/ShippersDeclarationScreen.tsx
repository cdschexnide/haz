import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { PhysicalState } from "../../types";
import { buildLithiumBatteryKey16 } from "@/utils/buildLithiumBatteryKey16";
import { getContainerDescriptionFromCode } from "@/utils/getContainerDescriptionFromPackagingCode";
import { getHazardousMaterialPhysicalStateByHazardClass } from "@/utils/getHazardousMaterialPhysicalState";
import { appendInhalationHazardIfNeeded } from "@/utils/specialProvisionsHelpers";
import { summarizeCylinderDescriptionForSddg } from "@/utils/summarizeCylinderDescriptionForSddg";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { PDFDocument } from "pdf-lib";
import QRCode from "qrcode";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ShippersDeclarationForm from "./ShippersDeclarationForm";

// interface DocumentType {
//   id: string;
//   documentType: "COE" | "CAA";
//   base64Data: string;
//   name: string;
//   dateAdded: string;
// }

const ShippersDeclarationScreen = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const { navigate } = useNavigationRef();
  const [megcData, setMegcData] = useState<string>("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const formRef = useRef<View>(null);
  const isExceptedQuantity = state.hazProPreparerContext.isExceptedQuantity;
  const isLimitedQuantity = state.hazProPreparerContext.isLimitedQuantity;

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 4;
  }, []);

  const shipperName =
    state.hazProPreparerContext.shipper?.address.shipperLocation;
  const shipperAddress = `${state.hazProPreparerContext.shipper?.address.shipperStreet} ${state.hazProPreparerContext.shipper?.address.shipperCity}, ${state.hazProPreparerContext.shipper?.address.shipperState} ${state.hazProPreparerContext.shipper?.address.shipperZipcode}`;
  const shipperPhoneNumber =
    state.hazProPreparerContext.shipper?.phoneNumber?.number;
  const referenceNumber = state.hazProPreparerContext.shipment?.tcn;
  const airportOfDeparture = state.hazProPreparerContext.shipment?.poe;
  const airportOfDestination = state.hazProPreparerContext.shipment?.pod;
  const shipmentType =
    state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith("7")
      ? "RADIOACTIVE"
      : "NON-RADIOACTIVE";
  const unid = state.hazProPreparerContext.hazardousMaterial?.unid;
  const shippingName = appendInhalationHazardIfNeeded(
    state.hazProPreparerContext.hazardousMaterial?.properShippingName,
    state.hazProPreparerContext.specialProvisionsMap
  );
  const classDiv = state.hazProPreparerContext.hazardousMaterial?.hazclassDiv;
  const packingGroup =
    state.hazProPreparerContext.hazardousMaterial?.packingGroup;
  const standardPackingInstruction =
    state.hazProPreparerContext.hazardousMaterial?.packagingParagraph;
  const waiverPackingInstruction = state.hazProPreparerContext
    .usesCoeCertification
    ? "COE"
    : state.hazProPreparerContext.usesCaaCertification
    ? "CAA"
    : "";
  const packingInstruction =
    waiverPackingInstruction !== ""
      ? waiverPackingInstruction
      : standardPackingInstruction;
  const signatoryName = state.hazProPreparerContext.preparer?.preparerName;
  const signatoryTitle = state.hazProPreparerContext.preparer?.preparerTitle;
  const location = state.hazProPreparerContext.preparer?.certificationPlace;
  const date = state.hazProPreparerContext.preparer?.certificationDate;
  const additionalInfo =
    state.hazProPreparerContext.un3166Details.accessorialHazards.other;

  const isCargoAircraftOnly =
    state.hazProPreparerContext.hazardousMaterial?.specialProvision.includes(
      "P1"
    ) ||
    state.hazProPreparerContext.hazardousMaterial?.specialProvision.includes(
      "P2"
    ) ||
    state.hazProPreparerContext.hazardousMaterial?.specialProvision.includes(
      "P3"
    ) ||
    state.hazProPreparerContext.hazardousMaterial?.specialProvision.includes(
      "P4"
    );

  const vehicleNomenclaturePostfix =
    state.hazProPreparerContext.un3166Details &&
    typeof state.hazProPreparerContext.un3166Details?.quantity === "string" &&
    parseInt(state.hazProPreparerContext.un3166Details?.quantity) > 1
      ? `s`
      : ``;

  const quantityAndTypeOfPackingForVehicles =
    state.hazProPreparerContext.un3166Details.vehicleNomenclature !== ""
      ? `${state.hazProPreparerContext.un3166Details.quantity} ${state.hazProPreparerContext.un3166Details.vehicleNomenclature}${vehicleNomenclaturePostfix}`
      : "";

  const cylinderString = summarizeCylinderDescriptionForSddg(
    state.hazProPreparerContext.cylinderProperties
  );

  const afmanAuthorization = "AFMAN24-604";
  const coeAuthorization = state.hazProPreparerContext.usesCoeCertification
    ? state.hazProPreparerContext.coeAndCaaDocuments?.coeDocuments[0].name
    : "";
  const caaAuthorization = state.hazProPreparerContext.usesCaaCertification
    ? state.hazProPreparerContext.coeAndCaaDocuments?.caaDocuments[0].name
    : "";

  const authorization =
    coeAuthorization !== ""
      ? coeAuthorization
      : caaAuthorization !== ""
      ? caaAuthorization
      : afmanAuthorization;

  const containerDescription = state.hazProPreparerContext
    .isGrandfatheredExplosive
    ? `1 ${state.hazProPreparerContext.grandfatheredExplosive?.generalPackageDescription.toUpperCase()}`
    : state.hazProPreparerContext.hazardousMaterial?.physicalState ===
      PhysicalState.SOLID
    ? `1 ${getContainerDescriptionFromCode(
        state.hazProPreparerContext.packaging?.inputPOPMarking?.B
      )?.toUpperCase()} (${
        state.hazProPreparerContext.packaging?.inputPOPMarking?.B
      }) x ${state.hazProPreparerContext.packaging?.totalNetMass?.kg} KG`
    : `1 ${getContainerDescriptionFromCode(
        state.hazProPreparerContext.packaging?.inputPOPMarking?.B
      )?.toUpperCase()} (${
        state.hazProPreparerContext.packaging?.inputPOPMarking?.B
      }) x ${state.hazProPreparerContext.packaging?.totalNetVolume?.liters} L`;
  const key16NEWData = state.hazProPreparerContext.isGrandfatheredExplosive
    ? `${state.hazProPreparerContext.grandfatheredExplosivesContainers[0].grossMass}`
    : state.hazProPreparerContext.shipment?.totalNetExplosiveWeight;
  // “1 wooden box (20”x20”x20” x 15 KG)
  const magnetizedMaterialKey16Data = state.hazProPreparerContext
    .magnetizedMaterialData?.wantsToSpecifyWeightAndSize
    ? `${state.hazProPreparerContext.magnetizedMaterialData?.outerPackagingDescription} (${state.hazProPreparerContext.magnetizedMaterialData?.length}in x ${state.hazProPreparerContext.magnetizedMaterialData?.width}in x ${state.hazProPreparerContext.magnetizedMaterialData?.height}in x ${state.hazProPreparerContext.magnetizedMaterialData?.weight} KG)`
    : `${state.hazProPreparerContext.magnetizedMaterialData?.outerPackagingDescription}`;

  const lithiumBatteriesKey16 = buildLithiumBatteryKey16(
    state.hazProPreparerContext.lithiumBatteryData
  );

  const batteryPoweredVehicleOrEquipment =
    `${
      state.hazProPreparerContext.batteryVehicle?.key16.description
    }, ${state.hazProPreparerContext.batteryVehicle?.key16.netQuantity.valueKg.toFixed(
      2
    )} kg` +
    (state.hazProPreparerContext.batteryVehicle?.key16.netQuantity.unit ===
    "lbs"
      ? ` (${state.hazProPreparerContext.batteryVehicle?.key16.netQuantity.value.toFixed(
          1
        )} lbs)`
      : "");

  const quantityAndTypeOfPackaging =
    typeof state.hazProPreparerContext.capacitorData !== "undefined"
      ? `${state.hazProPreparerContext.capacitorData.outerPackagingDescription}`
      : typeof state.hazProPreparerContext.safetyDeviceData !== "undefined"
      ? `${state.hazProPreparerContext.safetyDeviceData.numberOfArticles} x ${state.hazProPreparerContext.safetyDeviceData.outerPackagingTypeLabel} (${state.hazProPreparerContext.safetyDeviceData.prepType})`
      : typeof state.hazProPreparerContext.batteryVehicle !== "undefined"
      ? batteryPoweredVehicleOrEquipment
      : typeof state.hazProPreparerContext.lifeSavingApplianceData !==
        "undefined"
      ? state.hazProPreparerContext.lifeSavingApplianceData.key16
      : typeof state.hazProPreparerContext.geneticallyModifiedOrganism !==
        "undefined"
      ? state.hazProPreparerContext.geneticallyModifiedOrganism.key16
      : typeof state.hazProPreparerContext.dryIceData !== "undefined"
      ? `1 ${state.hazProPreparerContext.dryIceData.packagingType} x ${state.hazProPreparerContext.dryIceData.quantity}KG`
      : typeof state.hazProPreparerContext.lithiumBatteryData !== "undefined"
      ? lithiumBatteriesKey16
      : typeof state.hazProPreparerContext.cylinderProperties !== "undefined"
      ? cylinderString
      : state.hazProPreparerContext.usesCoeCertification ||
        state.hazProPreparerContext.usesCaaCertification
      ? ""
      : state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith(
          "1"
        )
      ? `${containerDescription} (${key16NEWData}KG NEW)`
      : state.hazProPreparerContext.hazardousMaterial?.unid === "UN2807"
      ? magnetizedMaterialKey16Data
      : containerDescription;

  useEffect(() => {
    if (typeof state.hazProPreparerContext.megcProperties !== "undefined") {
      // const megcString = `${state.hazProPreparerContext.megcProperties.numberOfCylinders} ${state.hazProPreparerContext.megcProperties.cylinderType} Cylinders X ${state.hazProPreparerContext.megcProperties.quantityPerCylinder.kg} kg`;
      const megcString = `1 Multiple-Element Gas Container X ${state.hazProPreparerContext.megcProperties.quantityPerCylinder.kg} KG`;
      setMegcData(megcString);
    } else {
      setMegcData("");
    }
  }, [state.hazProPreparerContext.megcProperties]);

  // New function to generate HTML directly instead of capturing the view
  const generateFormHtml = async (): Promise<string> => {
    // Generate QR code as base64 data URL
    let qrCodeDataUrl = "";
    if (referenceNumber) {
      try {
        qrCodeDataUrl = await QRCode.toDataURL(referenceNumber, {
          width: 85,
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });
      } catch (error) {
        console.error("QR code generation failed:", error);
      }
    }

    // Helper function to create conditional content
    const getXOverlayHTML = (condition: boolean): string => {
      return condition ? "" : '<div class="x-overlay">XXXXXXXX</div>';
    };

    const armyOperationsCenterCollectEmergencyNumber: string =
      "+1(703)-695-4695/4696";
    const armyOperationsCenterDsnEmergencyNumber: string = "312-225-4695/4696";
    const domesticEmergencyNumberForNonClass1Materials: string =
      "1-800-851-8061";
    const internationalEmergencyNumberForNonClass1Materials =
      "+1-804-279- 3131";

    const emergencyPhoneNumber1 =
      state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith("1")
        ? armyOperationsCenterCollectEmergencyNumber
        : domesticEmergencyNumberForNonClass1Materials;
    const emergencyPhoneNumber2 =
      state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith("1")
        ? armyOperationsCenterDsnEmergencyNumber
        : internationalEmergencyNumberForNonClass1Materials;

    // Generate additional information HTML
    let additionalInfoHTML = "";

    if (state.hazProPreparerContext.isGrandfatheredExplosive === true) {
      additionalInfoHTML += `<p class="info-line">Government-owned goods packaged before 1 January 1990.</p>`;
    }

    if (state.hazProPreparerContext.hazardousMaterial?.unid === "UN3166") {
      // Vehicle details
      additionalInfoHTML += `<p class="info-line">${
        state.hazProPreparerContext.un3166Details.fuel?.properShippingName
      }, ${state.hazProPreparerContext.un3166Details.fuel?.hazclassDiv}, ${
        state.hazProPreparerContext.un3166Details.amount
      } ${state.hazProPreparerContext.un3166Details.unit.toUpperCase()}</p>`;

      // Batteries
      if (
        state.hazProPreparerContext.un3166Details.accessorialHazards.batteries
      ) {
        additionalInfoHTML += `<p class="info-line">${
          state.hazProPreparerContext.un3166Details.accessorialHazards.batteries
            .quantity
        } x ${state.hazProPreparerContext.un3166Details.accessorialHazards.batteries.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${
          state.hazProPreparerContext.un3166Details.accessorialHazards.batteries
            .accessorialHazardousMaterialIdentification?.hazclassDiv
        }</p>`;
      }

      // Fire extinguishers
      if (
        state.hazProPreparerContext.un3166Details.accessorialHazards
          .fireExtinguishers
      ) {
        additionalInfoHTML += `<p class="info-line">${
          state.hazProPreparerContext.un3166Details.accessorialHazards
            .fireExtinguishers.quantity
        } x ${state.hazProPreparerContext.un3166Details.accessorialHazards.fireExtinguishers.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${
          state.hazProPreparerContext.un3166Details.accessorialHazards
            .fireExtinguishers.accessorialHazardousMaterialIdentification
            ?.hazclassDiv
        }</p>`;
      }

      // Starter fluid
      if (
        state.hazProPreparerContext.un3166Details.accessorialHazards
          .starterFluid
      ) {
        additionalInfoHTML += `<p class="info-line">${state.hazProPreparerContext.un3166Details.accessorialHazards.starterFluid.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${
          state.hazProPreparerContext.un3166Details.accessorialHazards
            .starterFluid.accessorialHazardousMaterialIdentification
            ?.hazclassDiv
        }, 1 x ${
          state.hazProPreparerContext.un3166Details.accessorialHazards
            .starterFluid.volume.liters
        } LITERS</p>`;
      }

      // Other accessorial hazards
      if (additionalInfo && additionalInfo.length > 0) {
        additionalInfoHTML += `<p class="info-line">AVIATION REGULATED LIQUID, N.O.S., 9, 5 x 1 LITER</p>`;
      }
    } else {
      // Non-vehicle hazardous materials
      const hazmat = state.hazProPreparerContext.hazardousMaterial;
      const stateChar = hazmat?.hazclassDiv?.[0];
      const physicalState = getHazardousMaterialPhysicalStateByHazardClass(
        stateChar || ""
      );

      if (physicalState === "SOLID") {
        if (state.hazProPreparerContext.isGrandfatheredExplosive === true) {
          additionalInfoHTML += `<p class="info-line">${hazmat?.properShippingName?.toUpperCase()}, ${
            hazmat?.hazclassDiv
          }, ${
            state.hazProPreparerContext.shipment?.totalNetExplosiveWeight
          } KG</p>`;
        } else {
          additionalInfoHTML += `<p class="info-line">${hazmat?.properShippingName?.toUpperCase()}, ${
            hazmat?.hazclassDiv
          }, ${state.hazProPreparerContext.packaging?.totalNetMass?.kg} KG</p>`;
        }
      } else if (physicalState === "LIQUID" || physicalState === "GAS") {
        additionalInfoHTML += `<p class="info-line">${hazmat?.properShippingName?.toUpperCase()}, ${
          hazmat?.hazclassDiv
        }, ${
          state.hazProPreparerContext.packaging?.totalNetVolume?.liters
        } LITERS</p>`;
      }
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shipper's Declaration for Dangerous Goods</title>
        <style>
          @page {
            size: letter portrait;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            color: black;
          }
          .container {
            position: relative;
            border: 1px solid black;
            padding: 5px;
            margin: 10px;
            background: white;
          }
          .red-stripe-left,
          .red-stripe-right {
            position: fixed;
            top: 0;
            bottom: 0;
            width: 5px;
            border-left: 5px dashed red;
            z-index: 1000;
          }

          .red-stripe-left {
            left: 0;
          }

          .red-stripe-right {
            right: 0;
          }
          .title {
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 16px;
          }
          .row {
            display: flex;
            margin-bottom: 12px;
          }
          .box {
            border: 1px solid black;
            padding: 8px;
          }
          .box-left {
            flex: 1;
            margin-right: 8px;
          }
          .box-right {
            flex: 1;
          }
          .label {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 4px;
            padding: 4px 0;
          }
          .text {
            font-size: 13px;
            margin: 4px 0;
          }
          .warning-text {
            font-size: 12px;
            line-height: 16px;
          }
          .transport-box {
            border: 1px solid black;
            padding: 8px;
            flex: 1;
          }
          .transport-options {
            display: flex;
            border: 1px solid black;
            margin-top: 4px;
          }
          .aircraft-box {
            flex: 1;
            text-align: center;
            padding: 10px 0;
            position: relative;
            border-right: 1px solid black;
          }
          .aircraft-box:last-child {
            border-right: none;
          }
          .x-overlay {
            position: absolute;
            font-weight: bold;
            font-size: 24px;
            text-align: center;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .shipment-type-row {
            margin-top: 12px;
          }
          .shipment-type-box {
            display: flex;
            border: 1px solid black;
            margin-top: 4px;
          }
          .shipment-option {
            flex: 1;
            text-align: center;
            padding: 10px 0;
            position: relative;
            border-right: 1px solid black;
          }
          .shipment-option:last-child {
            border-right: none;
          }
          .table-wrapper {
            margin-top: 16px;
            border: 1px solid black;
          }
          .table-header {
            display: flex;
            background-color: #e9ecef;
            border-bottom: 1px solid black;
          }
          .table-row {
            display: flex;
            min-height: 200px;
          }
          .table-cell {
            flex: 1;
            padding: 6px;
            border-right: 1px solid black;
            font-size: 13px;
          }
          .table-cell:last-child {
            border-right: none;
          }
          .cell-label {
            font-weight: bold;
            font-size: 12px;
          }
          .info-box {
            border-top: 1px solid black;
            padding-top: 10px;
            margin-top: 16px;
            margin-bottom: 16px;
          }
          .info-line {
            font-size: 14px;
            margin: 4px 0;
          }
          .emergency-line {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top: 8px;
            flex-wrap: wrap;
          }
          .emergency-label {
            font-size: 13px;
            font-weight: bold;
            margin-right: 4px;
          }
          .emergency-number {
            font-size: 13px;
          }
          .declaration-row {
            display: flex;
            border-top: 1px solid black;
            padding-top: 12px;
          }
          .declaration-box {
            flex: 2;
            padding-right: 10px;
          }
          .signatory-box {
            flex: 1;
            border-left: 1px solid black;
            padding-left: 10px;
          }
          .declaration-text {
            font-size: 14px;
            line-height: 18px;
          }
          .label-upper {
            font-size: 13px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 4px;
          }
          .place-date-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .signature-note {
            font-size: 10px;
            font-style: italic;
            margin-top: 12px;
          }
          .italic {
            font-style: italic;
          }
        </style>
      </head>
      <body>
          <div class="red-stripe-left"></div>
          <div class="red-stripe-right"></div>
        <div class="container">
          <div class="title">SHIPPER'S DECLARATION FOR DANGEROUS GOODS</div>
          
          <!-- Shipper and Air Waybill Info -->
          <div class="row">
            <div class="box box-left">
              <div class="label">Shipper</div>
              <div class="text">${shipperName || ""}</div>
              <div class="text">${
                state.hazProPreparerContext.shipper?.address.shipperStreet || ""
              }</div>
              <div class="text">${
                state.hazProPreparerContext.shipper?.address.shipperCity || ""
              }, ${
      state.hazProPreparerContext.shipper?.address.shipperState || ""
    } ${state.hazProPreparerContext.shipper?.address.shipperZipcode || ""}</div>
              <div class="text">Phone: ${
                state.hazProPreparerContext.shipper?.phoneNumber?.number || ""
              }</div>
            </div>
            <div class="box box-right">
              <div style="display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                  <div class="label">Air Waybill No.</div>
                  <div class="text">Page 1 of 1</div>
                  <div class="text">SHIPPER'S REFERENCE NUMBER</div>
                  <div class="text" style="font-size: 16px;">TCN: ${
                    referenceNumber || ""
                  }</div>
                </div>
                ${
                  qrCodeDataUrl
                    ? `<div style="margin-left: 8px; display: flex; align-items: center; justify-content: center;">
                  <img src="${qrCodeDataUrl}" style="width: 85px; height: 85px;" alt="QR Code"/>
                </div>`
                    : ""
                }
              </div>
            </div>
          </div>
          
          <!-- Consignee and Warning -->
          <div class="row">
            <div class="box box-left">
              <div class="label">Consignee</div>
              <div class="text">${
                state.hazProPreparerContext.consignee?.address
                  ?.consigneeDodaac || ""
              }</div>
              <div class="text">${
                state.hazProPreparerContext.consignee?.address
                  ?.consigneeStreet || ""
              }</div>
              <div class="text">${[
                state.hazProPreparerContext.consignee?.address?.consigneeCity,
                state.hazProPreparerContext.consignee?.address
                  ?.selectedConsigneeCountry,
              ]
                .filter(Boolean)
                .join(", ")}</div>
            </div>
            <div class="box box-right">
              <div class="label">Warning</div>
              <div class="warning-text">Failure to comply in all respects with the applicable Dangerous Goods Regulations may be in breach of the applicable law, subject to legal penalties.</div>
            </div>
          </div>
          
          <!-- Transport Details -->
          <div class="row">
            <div class="transport-box" style="flex: 2;">
              <div class="label">TRANSPORT DETAILS</div>
              <div>This shipment is within the limitations prescribed for:</div>
              <div class="transport-options">
                <div class="aircraft-box">
                  PASSENGER AND<br>CARGO AIRCRAFT
                  ${getXOverlayHTML(isCargoAircraftOnly === false)}
                </div>
                <div class="aircraft-box">
                  CARGO AIRCRAFT<br>ONLY
                  ${getXOverlayHTML(isCargoAircraftOnly === true)}
                </div>
              </div>
            </div>
            <div class="transport-box" style="flex: 1;">
              <div class="label">Airport of Departure:</div>
              <div class="text">${airportOfDeparture || ""}</div>
            </div>
            <div class="transport-box" style="flex: 1;">
              <div class="label">Airport of Destination:</div>
              <div class="text">${airportOfDestination || ""}</div>
            </div>
          </div>
          
          <!-- Shipment Type -->
          <div class="row">
            <div class="transport-box">
              <div class="shipment-type-row">
                <div class="label">Shipment type: <span class="italic">(delete non-applicable)</span></div>
                <div class="shipment-type-box">
                  <div class="shipment-option">
                    NON-RADIOACTIVE
                    ${getXOverlayHTML(shipmentType === "NON-RADIOACTIVE")}
                  </div>
                  <div class="shipment-option">
                    RADIOACTIVE
                    ${getXOverlayHTML(shipmentType === "RADIOACTIVE")}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Dangerous Goods Table -->
          <div class="table-wrapper">
            <div class="label">NATURE AND QUANTITY OF DANGEROUS GOODS</div>
            <div class="table-header">
              <div class="table-cell"><div class="cell-label">UN or ID No.</div></div>
              <div class="table-cell"><div class="cell-label">Proper Shipping Name</div></div>
              <div class="table-cell"><div class="cell-label">Class or Division<br>(subsidiary hazard)</div></div>
              <div class="table-cell"><div class="cell-label">Packing Group</div></div>
              <div class="table-cell"><div class="cell-label">Quantity and Type of Packing</div></div>
              <div class="table-cell"><div class="cell-label">Packing Inst.</div></div>
              <div class="table-cell"><div class="cell-label">Authorization</div></div>
            </div>
            <div class="table-row">
              <div class="table-cell">${unid || ""}</div>
              <div class="table-cell">${shippingName || ""}</div>
              <div class="table-cell">${classDiv || ""}</div>
              <div class="table-cell">${packingGroup || "—"}</div>
              <div class="table-cell">${
                megcData !== ""
                  ? megcData
                  : quantityAndTypeOfPackingForVehicles === ""
                  ? quantityAndTypeOfPackaging
                  : quantityAndTypeOfPackingForVehicles || ""
              }</div>
              <div class="table-cell">${packingInstruction || ""}</div>
              <div class="table-cell">${authorization}</div>
            </div>
          </div>
          
          <!-- Additional Info -->
          <div class="info-box">
            <div class="label">Additional Handling Information</div>
            ${additionalInfoHTML}
            <div class="emergency-line">
              <span class="emergency-label">EMERGENCY TELEPHONE NUMBER:</span>
              <span class="emergency-number">${emergencyPhoneNumber1} ${emergencyPhoneNumber2}</span>
            </div>
          </div>
          
          <!-- Declaration and Signature -->
          <div class="declaration-row">
            <div class="declaration-box">
              <div class="declaration-text">
                I hereby declare that the contents of this consignment are fully and accurately described above by the proper shipping name, and are classified,
                packaged, marked and labelled/placarded, and are in all respects in proper condition for transport according to applicable international and national governmental regulations. I declare that all of the applicable air transport requirements have been met.
              </div>
            </div>
            <div class="signatory-box">
              <div class="label-upper">NAME/TITLE OF SIGNATORY</div>
              <div>${signatoryName || ""}</div>
              <div>${signatoryTitle || ""}</div>
              
              <div class="label-upper" style="margin-top: 12px;">PLACE AND DATE</div>
              <div class="place-date-row">
                <span>${location || ""}</span>
                <span>${date || ""}</span>
              </div>
              
              <div class="signature-note">SIGNATURE (see warning above)</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Function to generate HTML for a COE/CAA document with debugging
  const generateDocumentHtml = (
    base64Data: string,
    documentName: string
  ): string => {
    console.log("Generating HTML for document:", documentName);
    console.log("Base64 data length:", base64Data ? base64Data.length : 0);
    console.log(
      "Base64 data prefix:",
      base64Data ? base64Data.substring(0, 30) + "..." : "null"
    );

    // Determine document type based on data
    let contentType = "application/pdf";
    let dataPrefix = "data:application/pdf;base64,";

    // Check if it's an image by examining the first few characters
    if (base64Data && base64Data.length > 0) {
      if (base64Data.startsWith("data:image/")) {
        // It's already a data URL for an image
        console.log("Document appears to be an image data URL");
        dataPrefix = "";
        contentType = "image/jpeg"; // or whatever is in the data URL
      } else if (base64Data.startsWith("/9j/")) {
        console.log("Document appears to be a JPEG image");
        contentType = "image/jpeg";
        dataPrefix = "data:image/jpeg;base64,";
      } else if (base64Data.startsWith("iVBOR")) {
        console.log("Document appears to be a PNG image");
        contentType = "image/png";
        dataPrefix = "data:image/png;base64,";
      } else if (base64Data.startsWith("JVBERi0")) {
        console.log("Document appears to be a PDF");
        contentType = "application/pdf";
        dataPrefix = "data:application/pdf;base64,";
      } else {
        console.log(
          "Unknown document format, first chars:",
          base64Data.substring(0, 10)
        );
        // Try to detect by checking for common PDF header (in base64)
        if (base64Data.includes("JVBERi0")) {
          console.log("Found PDF header within the data");
          contentType = "application/pdf";
          dataPrefix = "data:application/pdf;base64,";
        }
      }
    }

    // Make sure we don't double the prefix
    let imageData = base64Data;
    if (!imageData.startsWith("data:")) {
      imageData = dataPrefix + imageData;
    }

    // For PDFs, we'll embed them in an iframe
    if (contentType === "application/pdf") {
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${documentName}</title>
            <style>
              @page {
                size: letter portrait;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                background-color: white;
              }
              iframe {
                width: 100%;
                height: 100vh;
                border: none;
              }
            </style>
          </head>
          <body>
            <iframe src="${imageData}" type="application/pdf"></iframe>
          </body>
        </html>
      `;
    } else {
      // For images, we'll use an img tag
      return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${documentName}</title>
            <style>
              @page {
                size: letter portrait;
                margin: 0.5in;
              }
              body {
                margin: 0;
                padding: 0;
                background-color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
              }
              .document-container {
                width: 100%;
                max-width: 100%;
                text-align: center;
              }
              .document-image {
                max-width: 100%;
                height: auto;
                margin: 0 auto;
              }
              .document-title {
                font-family: Arial, sans-serif;
                font-size: 14px;
                margin-top: 10px;
                text-align: center;
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="document-container">
              <img src="${imageData}" class="document-image" alt="${documentName}" />
              <p class="document-title">${documentName}</p>
            </div>
          </body>
        </html>
      `;
    }
  };

  // Updated function to handle document conversion
  const convertDocumentToPdf = async (
    doc: any,
    index: number,
    docType: string
  ): Promise<string | null> => {
    try {
      // Skip invalid documents
      if (!doc.base64Data || doc.base64Data.trim() === "") {
        console.warn(`Skipping ${docType} document ${doc.id}: No base64 data`);
        return null;
      }

      console.log(
        `Converting ${docType} document ${index} (${doc.name}) to PDF...`
      );

      // Generate HTML for this document
      const docHtml = generateDocumentHtml(doc.base64Data, doc.name);

      // Save the HTML to a file for debugging
      const htmlPath = `${FileSystem.cacheDirectory}doc_${index}_debug.html`;
      await FileSystem.writeAsStringAsync(htmlPath, docHtml);
      console.log(`Debug HTML saved to ${htmlPath}`);

      // Convert to PDF
      const { uri: docPdfUri } = await Print.printToFileAsync({
        html: docHtml,
        base64: false,
      });

      console.log(`Document converted to PDF at ${docPdfUri}`);
      return docPdfUri;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`Error converting document to PDF: ${errorMsg}`);
      return null;
    }
  };

  // Function to generate a PDF from the HTML form and append COE/CAA documents
  const generateAndSharePdf = async () => {
    try {
      setIsGeneratingPdf(true);
      console.log("== Starting PDF generation process ==");

      // First generate the SDDG HTML
      const html = await generateFormHtml();
      console.log("Generated HTML for SDDG");

      // Create a PDF of the SDDG
      const { uri: sddgPdfUri } = await Print.printToFileAsync({
        html,
        base64: false,
      });
      console.log("Created SDDG PDF at:", sddgPdfUri);

      // Get COE and CAA documents
      const coeAndCaaDocuments = state.hazProPreparerContext
        .coeAndCaaDocuments || {
        coeDocuments: [],
        caaDocuments: [],
      };

      // Check if we have any documents to combine
      const coeDocuments = coeAndCaaDocuments.coeDocuments || [];
      const caaDocuments = coeAndCaaDocuments.caaDocuments || [];

      console.log(
        `Found ${coeDocuments.length} COE docs and ${caaDocuments.length} CAA docs`
      );

      const hasDocuments = coeDocuments.length > 0 || caaDocuments.length > 0;

      // If no documents, just share the SDDG
      if (!hasDocuments) {
        console.log("No additional documents, sharing only SDDG");
        await Sharing.shareAsync(sddgPdfUri, {
          mimeType: "application/pdf",
          dialogTitle: "Share SDDG",
        });
        await FileSystem.deleteAsync(sddgPdfUri, { idempotent: true });
        setIsGeneratingPdf(false);
        return;
      }

      // Get the documents to merge (either COE or CAA)
      const documentsToMerge =
        coeDocuments.length > 0 ? coeDocuments : caaDocuments;
      const docType = coeDocuments.length > 0 ? "COE" : "CAA";
      console.log(
        `Using ${documentsToMerge.length} ${docType} documents to merge`
      );

      // Save the SDDG PDF to a debug location
      const sddgDebugUri = `${
        FileSystem.cacheDirectory
      }SDDG_debug_${new Date().getTime()}.pdf`;
      await FileSystem.copyAsync({
        from: sddgPdfUri,
        to: sddgDebugUri,
      });
      console.log(`Saved debug copy of SDDG at: ${sddgDebugUri}`);

      // Simple approach: Just combine PDF files directly as binary
      if (documentsToMerge.length > 0 && documentsToMerge[0].base64Data) {
        try {
          console.log("Using direct PDF concatenation approach");

          // Get the first COE document
          const doc = documentsToMerge[0];

          // Create file paths for our PDF handling
          const tempSddgPath = `${
            FileSystem.cacheDirectory
          }temp_sddg_${Date.now()}.pdf`;
          const tempCoePath = `${
            FileSystem.cacheDirectory
          }temp_coe_${Date.now()}.pdf`;
          const outputPath = `${
            FileSystem.cacheDirectory
          }SDDG_with_${docType}_${Date.now()}.pdf`;

          // Write SDDG to file
          await FileSystem.copyAsync({
            from: sddgPdfUri,
            to: tempSddgPath,
          });

          // Write COE to file - extract base64 data properly
          let base64Data = doc.base64Data;
          if (base64Data.startsWith("data:")) {
            base64Data = base64Data.split(",")[1];
          }
          await FileSystem.writeAsStringAsync(tempCoePath, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          console.log("Saved temporary PDFs for concatenation");

          // Use PDFLib to concat the PDFs
          try {
            // Read the SDDG PDF as bytes
            const sddgBytes = await FileSystem.readAsStringAsync(tempSddgPath, {
              encoding: FileSystem.EncodingType.Base64,
            });

            // Read the COE PDF as bytes
            const coeBytes = await FileSystem.readAsStringAsync(tempCoePath, {
              encoding: FileSystem.EncodingType.Base64,
            });

            // Create a fresh PDF document
            const mergedPdf = await PDFDocument.create();

            // Function to convert base64 to Uint8Array (alternative to Buffer)
            const base64ToUint8Array = (base64: any) => {
              const binary = atob(base64);
              const len = binary.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) {
                bytes[i] = binary.charCodeAt(i);
              }
              return bytes;
            };

            // Convert base64 strings to Uint8Array
            const sddgUint8 = base64ToUint8Array(sddgBytes);
            const coeUint8 = base64ToUint8Array(coeBytes);

            // Load SDDG document
            const sddgDoc = await PDFDocument.load(sddgUint8);

            // Load COE document
            const coeDoc = await PDFDocument.load(coeUint8);

            // Add all pages from SDDG
            const sddgPages = await mergedPdf.copyPages(
              sddgDoc,
              sddgDoc.getPageIndices()
            );
            for (const page of sddgPages) {
              mergedPdf.addPage(page);
            }
            console.log(`Added ${sddgPages.length} pages from SDDG`);

            // Add all pages from COE
            const coePages = await mergedPdf.copyPages(
              coeDoc,
              coeDoc.getPageIndices()
            );
            for (const page of coePages) {
              mergedPdf.addPage(page);
            }
            console.log(`Added ${coePages.length} pages from COE`);

            // Set PDF metadata for better compatibility
            mergedPdf.setTitle("SDDG with Attachments");
            mergedPdf.setAuthor("HazPro Mobile App");
            mergedPdf.setSubject("Shipper's Declaration for Dangerous Goods");
            mergedPdf.setKeywords([
              "SDDG",
              "COE",
              "CAA",
              "hazardous materials",
            ]);
            mergedPdf.setProducer("HazPro Mobile");
            mergedPdf.setCreator("HazPro Mobile App");

            // Save the merged PDF and convert to base64
            const mergedPdfBytes = await mergedPdf.save();

            // Convert bytes to base64 string (alternative to Buffer)
            const uint8ToBase64 = (u8Arr: any) => {
              const binary = Array.from(u8Arr)
                .map((b: any) => String.fromCharCode(b))
                .join("");
              return btoa(binary);
            };

            const mergedBase64 = uint8ToBase64(new Uint8Array(mergedPdfBytes));

            await FileSystem.writeAsStringAsync(outputPath, mergedBase64, {
              encoding: FileSystem.EncodingType.Base64,
            });

            console.log(`Created merged PDF at: ${outputPath}`);

            // Clean up temp files
            await FileSystem.deleteAsync(tempSddgPath, { idempotent: true });
            await FileSystem.deleteAsync(tempCoePath, { idempotent: true });

            // Share the new PDF
            await Sharing.shareAsync(outputPath, {
              mimeType: "application/pdf",
              dialogTitle: `SDDG with ${docType}`,
              UTI: "com.adobe.pdf",
            });

            // Clean up all files
            await FileSystem.deleteAsync(sddgPdfUri, { idempotent: true });
            setTimeout(() => {
              FileSystem.deleteAsync(outputPath, { idempotent: true });
            }, 5000);

            console.log("PDF generation and sharing completed");
            return;
          } catch (pdfError) {
            console.error("Error in PDF merging process:", pdfError);
            throw pdfError;
          }
        } catch (error) {
          console.error("Error with direct PDF concatenation:", error);
          // Continue to the fallback approach
        }
      }

      // Fallback: Just share the SDDG if merge fails
      Alert.alert(
        "Warning",
        "Unable to include attachments. Sharing only the SDDG form.",
        [{ text: "OK" }]
      );

      await Sharing.shareAsync(sddgPdfUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share SDDG",
      });
      await FileSystem.deleteAsync(sddgPdfUri, { idempotent: true });
    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
      Alert.alert("Error", "Failed to generate or share PDF");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Excepted Quantities are EXEMPT from SDDG - should not reach this screen
  // But if they do, auto-navigate to the confirmation screen
  if (isExceptedQuantity) {
    React.useEffect(() => {
      navigation.navigate("ExceptedQuantityConfirmationScreen");
    }, []);
    return null;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Limited Quantity informational banner */}
        {isLimitedQuantity && (
          <View style={styles.limitedQuantityBanner}>
            <Text style={styles.limitedQuantityTitle}>⚡ Limited Quantity Shipment</Text>
            <Text style={styles.limitedQuantityText}>
              This shipment qualifies as a Limited Quantity. The SDDG form is still required,
              but no UN specification packaging (POP marking) is needed.
            </Text>
          </View>
        )}
        <View
          style={[styles.container, { backgroundColor: "white" }]}
          ref={formRef}
          collapsable={false}
        >
          <ShippersDeclarationForm
            shipperName={shipperName}
            shipperAddress={shipperAddress}
            phoneNumber={shipperPhoneNumber}
            // dsNumber="787-4409"
            dsNumber=""
            airWaybillNo="N/A"
            referenceNumber={referenceNumber}
            airportOfDeparture={airportOfDeparture}
            airportOfDestination={airportOfDestination}
            shipmentType={shipmentType}
            unid={unid}
            shippingName={shippingName}
            classDiv={classDiv}
            packingGroup={packingGroup}
            quantityAndPacking={
              megcData !== ""
                ? megcData
                : quantityAndTypeOfPackingForVehicles === ""
                ? quantityAndTypeOfPackaging
                : quantityAndTypeOfPackingForVehicles
            }
            packingInstruction={packingInstruction}
            authorization={authorization}
            signatoryName={signatoryName || ""}
            signatoryTitle={signatoryTitle || ""}
            location={location || ""}
            date={date || ""}
            cargoOnly={isCargoAircraftOnly}
            additionalInfo={additionalInfo}
          />
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            store.hazProPreparerContext.completedSubsteps =
              completedSubsteps.slice(0, -1);
            navigation.goBack();
          }}
          accessibilityLabel="Cancel button"
          accessibilityRole="button"
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={generateAndSharePdf}
          disabled={isGeneratingPdf}
          accessibilityLabel="Share SDDG button"
          accessibilityRole="button"
          accessibilityState={{ disabled: isGeneratingPdf }}
        >
          {isGeneratingPdf ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Share SDDG</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => {
            store.hazProPreparerContext.completedSubsteps = [
              ...completedSubsteps,
              "ShippersDeclarationScreen",
            ];
            navigate("Certify");
          }}
          accessibilityLabel="Save and continue button"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
      {isGeneratingPdf && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ShippersDeclarationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  limitedQuantityBanner: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginBottom: 0,
  },
  limitedQuantityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400e",
    marginBottom: 8,
  },
  limitedQuantityText: {
    fontSize: 14,
    color: "#78350f",
    lineHeight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    backgroundColor: "#ffffff",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#28a745",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
