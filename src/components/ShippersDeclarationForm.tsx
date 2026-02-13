import { useHazProStore } from "@/stores/useHazProStore";
import { AccessorialHazard, PhysicalState } from "../../types";
import { getHazardousMaterialPhysicalStateByHazardClass } from "@/utils/getHazardousMaterialPhysicalState";
import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import QRCode from "react-native-qrcode-svg";

const { width } = Dimensions.get("window");

export type ShippersDeclarationProps = {
  shipperName: string | undefined;
  shipperAddress: string | undefined;
  phoneNumber:
    | {
        type: "DSN" | "Commercial" | "Both";
        format: "Domestic" | "International";
        number: string;
        dsnNumber?: string;
      }
    | undefined;
  dsNumber: string | undefined;
  airWaybillNo?: string | undefined;
  referenceNumber: string | undefined;
  airportOfDeparture: string | undefined;
  airportOfDestination: string | undefined;
  shipmentType: "RADIOACTIVE" | "NON-RADIOACTIVE";
  unid: string | undefined;
  shippingName: string | undefined;
  classDiv: string | undefined;
  packingGroup?: string | undefined;
  quantityAndPacking: string | undefined;
  packingInstruction: string | undefined;
  authorization?: string | undefined;
  additionalInfo: AccessorialHazard[] | undefined;
  signatoryName: string | undefined;
  signatoryTitle: string | undefined;
  location: string | undefined;
  date: string | undefined;
  cargoOnly: boolean | undefined;
};

const ShippersDeclarationForm = ({
  shipperName,
  shipperAddress,
  phoneNumber,
  dsNumber,
  airWaybillNo,
  referenceNumber,
  airportOfDeparture,
  airportOfDestination,
  shipmentType,
  unid,
  shippingName,
  classDiv,
  packingGroup,
  quantityAndPacking,
  packingInstruction,
  authorization,
  signatoryName,
  signatoryTitle,
  location,
  date,
  cargoOnly,
  additionalInfo,
}: ShippersDeclarationProps) => {
  const { store, state } = useHazProStore();
  const consignee = state.hazProPreparerContext.consignee;
  const shipper = state.hazProPreparerContext.shipper;

  const engineUnids = ["UN3528", "UN3529", "UN3530"];

  const armyOperationsCenterCollectEmergencyNumber: string =
    "+1(703)-695-4695/4696";
  const armyOperationsCenterDsnEmergencyNumber: string = "312-225-4695/4696";
  const domesticEmergencyNumberForNonClass1Materials: string = "1-800-851-8061";
  const internationalEmergencyNumberForNonClass1Materials = "+1-804-279- 3131";

  const emergencyPhoneNumber1 =
    state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith("1")
      ? armyOperationsCenterCollectEmergencyNumber
      : domesticEmergencyNumberForNonClass1Materials;
  const emergencyPhoneNumber2 =
    state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith("1")
      ? armyOperationsCenterDsnEmergencyNumber
      : internationalEmergencyNumberForNonClass1Materials;

  const specialAuthorizationType =
    state.hazProPreparerContext.specialAuthorizationType;
  const isCoeAuthorization =
    specialAuthorizationType === "COE" ||
    state.hazProPreparerContext.usesCoeCertification;
  const isCaaAuthorization =
    specialAuthorizationType === "CAA" ||
    state.hazProPreparerContext.usesCaaCertification;
  const isDotSpAuthorization =
    specialAuthorizationType === "DOT-SP" ||
    state.hazProPreparerContext.usesDotSpPermit;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.redStripeLeft} />
      <View style={styles.redStripeRight} />

      <View style={styles.formContainer}>
        {/* Header Title */}
        <Text style={styles.title}>
          SHIPPER'S DECLARATION FOR DANGEROUS GOODS
        </Text>

        {/* Top Section */}
        <View style={styles.row}>
          <View style={styles.boxLeft}>
            <Text style={styles.label}>Shipper</Text>
            <Text style={styles.text}>{shipperName}</Text>
            <Text style={styles.text}>{shipper?.address.shipperStreet}</Text>
            <Text
              style={styles.text}
            >{`${shipper?.address.shipperCity}, ${shipper?.address.shipperState} ${shipper?.address.shipperZipcode}`}</Text>
            <Text style={styles.text2}>
              <Text style={[styles.text2, { fontWeight: 600 }]}>Phone:</Text>{" "}
              {state.hazProPreparerContext.shipper?.phoneNumber?.number}
            </Text>
            <Text style={styles.text5}>
              <Text style={[styles.text2, { fontWeight: 600 }]}>DSN:</Text>{" "}
              {state.hazProPreparerContext.shipper?.phoneNumber?.dsnNumber}
            </Text>
            {/* <Text style={styles.text}>DSN: {dsNumber}</Text> */}
          </View>
          <View style={styles.boxRight}>
            <View style={styles.boxRightContent}>
              <View style={styles.boxRightText}>
                <Text style={styles.label}>Air Waybill No.</Text>
                {/* <Text style={styles.text}>{airWaybillNo || "—"}</Text> */}
                <Text style={styles.text3}>Page 1 of 1</Text>
                <Text style={styles.text}>SHIPPER'S REFERENCE NUMBER</Text>
                <Text style={styles.text4}>TCN: {referenceNumber}</Text>
              </View>
              {referenceNumber && (
                <View style={styles.qrCodeContainer}>
                  <QRCode
                    value={referenceNumber}
                    size={85}
                    color="#000000"
                    backgroundColor="#ffffff"
                  />
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.boxLeft}>
            <Text style={styles.label}>Consignee</Text>
            <Text style={styles.text}>
              {consignee?.address?.consigneeDodaac}
            </Text>
            <Text style={styles.text}>
              {consignee?.address?.consigneeStreet}
            </Text>
            <Text style={styles.text2}>
              {[
                consignee?.address?.consigneeCity,
                consignee?.address?.selectedConsigneeCountry,
              ]
                .filter(Boolean)
                .join(", ")}
            </Text>
            <Text style={styles.text2}>
              <Text style={[styles.text2, { fontWeight: 600 }]}>Phone:</Text>{" "}
              {state.hazProPreparerContext.shipper?.phoneNumber?.number}
            </Text>
            <Text style={styles.text5}>
              <Text style={[styles.text2, { fontWeight: 600 }]}>DSN:</Text>{" "}
              {state.hazProPreparerContext.shipper?.phoneNumber?.dsnNumber}
            </Text>
          </View>

          <View style={styles.boxRight}>
            <Text style={styles.label}>Warning</Text>
            <Text style={styles.warningText}>
              Failure to comply in all respects with the applicable Dangerous
              Goods Regulations may be in breach of the applicable law, subject
              to legal penalties.
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.transportBox, { flex: 2 }]}>
            <Text style={styles.label}>TRANSPORT DETAILS</Text>
            <Text>This shipment is within the limitations prescribed for:</Text>
            <View style={styles.transportOptions}>
              <View style={styles.aircraftBox}>
                <Text style={styles.aircraftLabel}>
                  PASSENGER AND{"\n"}CARGO AIRCRAFT
                </Text>
                {cargoOnly && <Text style={styles.xOverlayText}>XXXXXXXX</Text>}
              </View>
              <View style={styles.aircraftBox}>
                <Text style={styles.aircraftLabel}>
                  CARGO AIRCRAFT{"\n"}ONLY
                </Text>
                {!cargoOnly && <Text style={styles.xOverlayText}>XXXXXXX</Text>}
              </View>
            </View>
          </View>
          <View style={[styles.transportBox, { flex: 1 }]}>
            <Text style={styles.label}>Airport of Departure:</Text>
            <Text style={styles.text}>{airportOfDeparture}</Text>
          </View>
          <View style={[styles.transportBox, { flex: 1 }]}>
            <Text style={styles.label}>Airport of Destination:</Text>
            <Text style={styles.text}>{airportOfDestination}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.transportBox}>
            <View style={styles.shipmentTypeRow}>
              <Text style={styles.label}>
                Shipment type:{" "}
                <Text style={styles.italic}>(delete non-applicable)</Text>
              </Text>
              <View style={styles.shipmentTypeBox}>
                <View style={styles.shipmentOption}>
                  <Text style={styles.aircraftLabel}>NON-RADIOACTIVE</Text>
                  {shipmentType === "RADIOACTIVE" && (
                    <Text style={styles.xOverlayText}>XXXXXXXXXXXX</Text>
                  )}
                </View>
                <View style={styles.shipmentOption}>
                  <Text style={styles.aircraftLabel}>RADIOACTIVE</Text>
                  {shipmentType === "NON-RADIOACTIVE" && (
                    <Text style={styles.xOverlayText}>XXXXXXXXXXXX</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Dangerous Goods Table */}
        <View style={styles.tableWrapper}>
          <Text style={styles.label}>
            NATURE AND QUANTITY OF DANGEROUS GOODS
          </Text>
          <View style={styles.tableHeader}>
            {[
              "UN or ID No.",
              "Proper Shipping Name",
              "Class or Division\n(subsidiary hazard)",
              "Packing Group",
              "Quantity and Type of Packing",
              "Packing Inst.",
              "Authorization",
            ].map((title, idx) => (
              <View style={styles.tableCell} key={idx}>
                <Text style={styles.cellLabel}>{title}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableRow}>
            {[
              unid,
              shippingName,
              classDiv,
              packingGroup || "—",
              quantityAndPacking,
              packingInstruction,
              authorization || "—",
            ].map((val, idx) => (
              <View style={styles.tableCell} key={idx}>
                <Text style={styles.tableCellText}>{val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Additional Info */}
        <View style={styles.infoBox}>
          <Text style={styles.label}>Additional Handling Information</Text>
          <View>
            {state.hazProPreparerContext.isGrandfatheredExplosive === true && (
              <Text style={styles.infoLine}>
                {`Government-owned goods packaged before 1 January 1990.`}
              </Text>
            )}
            {state.hazProPreparerContext.hazardousMaterial?.unid &&
              engineUnids.includes(
                state.hazProPreparerContext.hazardousMaterial.unid
              ) && (
                <>
                  <Text style={styles.infoLine}>
                    {`${state.hazProPreparerContext.engineOrMachineryPreparationData?.fuelType?.properShippingName}, ${state.hazProPreparerContext.engineOrMachineryPreparationData?.fuelType?.hazclassDiv}, ${state.hazProPreparerContext.engineOrMachineryPreparationData?.residualFuelMl} mL`}
                  </Text>
                  {state.hazProPreparerContext.engineOrMachineryPreparationData
                    ?.accessorialHazards.batteries && (
                    <Text style={styles.infoLine}>
                      {`${
                        state.hazProPreparerContext
                          .engineOrMachineryPreparationData?.accessorialHazards
                          .batteries.quantity
                      } x ${state.hazProPreparerContext.engineOrMachineryPreparationData?.accessorialHazards.batteries.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${
                        state.hazProPreparerContext
                          .engineOrMachineryPreparationData?.accessorialHazards
                          .batteries.accessorialHazardousMaterialIdentification
                          ?.hazclassDiv
                      }`}
                    </Text>
                  )}
                  {state.hazProPreparerContext.engineOrMachineryPreparationData
                    ?.accessorialHazards.fireExtinguishers && (
                    <Text style={styles.infoLine}>
                      {`${
                        state.hazProPreparerContext
                          .engineOrMachineryPreparationData?.accessorialHazards
                          .fireExtinguishers.quantity
                      } x ${state.hazProPreparerContext.engineOrMachineryPreparationData?.accessorialHazards.fireExtinguishers.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${
                        state.hazProPreparerContext
                          .engineOrMachineryPreparationData?.accessorialHazards
                          .fireExtinguishers
                          .accessorialHazardousMaterialIdentification
                          ?.hazclassDiv
                      }`}
                    </Text>
                  )}
                  {state.hazProPreparerContext.engineOrMachineryPreparationData
                    ?.accessorialHazards.starterFluid && (
                    <Text style={styles.infoLine}>
                      {`${state.hazProPreparerContext.engineOrMachineryPreparationData?.accessorialHazards.starterFluid.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${
                        state.hazProPreparerContext
                          .engineOrMachineryPreparationData?.accessorialHazards
                          .starterFluid
                          .accessorialHazardousMaterialIdentification
                          ?.hazclassDiv
                      }, 1 x ${
                        state.hazProPreparerContext
                          .engineOrMachineryPreparationData?.accessorialHazards
                          .starterFluid.volume.liters
                      } LITERS`}
                    </Text>
                  )}
                  {state.hazProPreparerContext.engineOrMachineryPreparationData?.accessorialHazards.other?.map(
                    accessorialHazmatElement => {
                      const material =
                        accessorialHazmatElement.hazardousMaterial;
                      const stateChar = material.hazclassDiv[0];
                      const physicalState =
                        getHazardousMaterialPhysicalStateByHazardClass(
                          stateChar
                        );

                      const amount =
                        physicalState === PhysicalState.SOLID
                          ? accessorialHazmatElement.mass?.kg
                          : accessorialHazmatElement.volume?.liters;

                      const unit =
                        physicalState === PhysicalState.SOLID
                          ? "KG"
                          : physicalState === PhysicalState.LIQUID ||
                            physicalState === PhysicalState.GAS
                          ? "LITERS"
                          : "";

                      if (
                        accessorialHazmatElement.hazardousMaterial.unid ===
                        "UN3334"
                      ) {
                        return (
                          <Text
                            key={material.properShippingName}
                            style={styles.infoLine}
                          >
                            {`${accessorialHazmatElement.hazardousMaterial.properShippingName}, ${accessorialHazmatElement.hazardousMaterial.hazclassDiv}, ${accessorialHazmatElement.quantity} x ${accessorialHazmatElement.volume?.liters} LITERS`}
                          </Text>
                        );
                      }
                      return (
                        <Text
                          key={material.properShippingName}
                          style={styles.infoLine}
                        >
                          {`${
                            accessorialHazmatElement.hazardousMaterial
                              .properShippingName
                          }, ${
                            accessorialHazmatElement.hazardousMaterial
                              .hazclassDiv
                          }, ${accessorialHazmatElement.quantity} x ${
                            unit === "KG"
                              ? accessorialHazmatElement.mass?.kg
                              : accessorialHazmatElement.volume?.liters
                          } ${unit}`}
                        </Text>
                      );
                    }
                  )}
                </>
              )}
            {/* {state.hazProPreparerContext.hazardousMaterial?.unid && !engineUnids.includes(state.hazProPreparerContext.hazardousMaterial.unid) && state.hazProPreparerContext.hazardousMaterial?.unid === "UN2807" && (
              
            )} */}
            {state.hazProPreparerContext.hazardousMaterial?.unid &&
              !engineUnids.includes(
                state.hazProPreparerContext.hazardousMaterial.unid
              ) &&
              state.hazProPreparerContext.hazardousMaterial?.unid ===
                "UN3166" && (
                <>
                  <Text style={styles.infoLine}>
                    {/* {`${state.hazProPreparerContext.un3166Details.accessorialHazards.batteries.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${state.hazProPreparerContext.un3166Details.accessorialHazards.batteries.accessorialHazardousMaterialIdentification?.hazclassDiv}, ${state.hazProPreparerContext.un3166Details.accessorialHazards.batteries.quantity} EACH`} */}
                    {`${
                      state.hazProPreparerContext.un3166Details.fuel
                        ?.properShippingName
                    }, ${
                      state.hazProPreparerContext.un3166Details.fuel
                        ?.hazclassDiv
                    }, ${
                      state.hazProPreparerContext.un3166Details.amount
                    } ${state.hazProPreparerContext.un3166Details.unit.toUpperCase()}`}
                  </Text>
                  {/* batteries */}
                  {state.hazProPreparerContext.un3166Details.accessorialHazards
                    .batteries && (
                    <Text style={styles.infoLine}>
                      {/* {`${state.hazProPreparerContext.un3166Details.accessorialHazards.batteries.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${state.hazProPreparerContext.un3166Details.accessorialHazards.batteries.accessorialHazardousMaterialIdentification?.hazclassDiv}, ${state.hazProPreparerContext.un3166Details.accessorialHazards.batteries.quantity} EACH`} */}
                      {`${
                        state.hazProPreparerContext.un3166Details
                          .accessorialHazards.batteries.quantity
                      } x ${state.hazProPreparerContext.un3166Details.accessorialHazards.batteries.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${
                        state.hazProPreparerContext.un3166Details
                          .accessorialHazards.batteries
                          .accessorialHazardousMaterialIdentification
                          ?.hazclassDiv
                      }`}
                    </Text>
                  )}

                  {/* fire extinguishers */}
                  {state.hazProPreparerContext.un3166Details.accessorialHazards
                    .fireExtinguishers && (
                    <Text style={styles.infoLine}>
                      {/* {`${state.hazProPreparerContext.un3166Details.accessorialHazards.fireExtinguishers.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${state.hazProPreparerContext.un3166Details.accessorialHazards.fireExtinguishers.accessorialHazardousMaterialIdentification?.hazclassDiv}, ${state.hazProPreparerContext.un3166Details.accessorialHazards.fireExtinguishers.quantity} EACH`} */}
                      {`${
                        state.hazProPreparerContext.un3166Details
                          .accessorialHazards.fireExtinguishers.quantity
                      } x ${state.hazProPreparerContext.un3166Details.accessorialHazards.fireExtinguishers.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${
                        state.hazProPreparerContext.un3166Details
                          .accessorialHazards.fireExtinguishers
                          .accessorialHazardousMaterialIdentification
                          ?.hazclassDiv
                      }`}
                    </Text>
                  )}

                  {/* starter fluid */}
                  {state.hazProPreparerContext.un3166Details.accessorialHazards
                    .starterFluid && (
                    <Text style={styles.infoLine}>
                      {`${state.hazProPreparerContext.un3166Details.accessorialHazards.starterFluid.accessorialHazardousMaterialIdentification?.properShippingName.toUpperCase()}, ${
                        state.hazProPreparerContext.un3166Details
                          .accessorialHazards.starterFluid
                          .accessorialHazardousMaterialIdentification
                          ?.hazclassDiv
                      }, 1 x ${
                        state.hazProPreparerContext.un3166Details
                          .accessorialHazards.starterFluid.volume.liters
                      } LITERS`}
                    </Text>
                  )}
                  {additionalInfo?.map(accessorialHazmatElement => {
                    const material = accessorialHazmatElement.hazardousMaterial;
                    const stateChar = material.hazclassDiv[0];
                    const physicalState =
                      getHazardousMaterialPhysicalStateByHazardClass(stateChar);

                    const amount =
                      physicalState === PhysicalState.SOLID
                        ? accessorialHazmatElement.mass?.kg
                        : accessorialHazmatElement.volume?.liters;

                    const unit =
                      physicalState === PhysicalState.SOLID
                        ? "KG"
                        : physicalState === PhysicalState.LIQUID ||
                          physicalState === PhysicalState.GAS
                        ? "LITERS"
                        : "";

                    return (
                      <Text
                        key={material.properShippingName}
                        style={styles.infoLine}
                      >
                        {/* {`${material.properShippingName.toUpperCase()}, ${material.hazclassDiv}${amount ? `, ${accessorialHazmatElement.quantity || 1} x ${amount} ${unit}` : ""}`} */}
                        {"AVIATION REGULATED LIQUID, N.O.S., 9, 5 x 1 LITER"}
                      </Text>
                    );
                  })}
                </>
              )}
            {state.hazProPreparerContext.hazardousMaterial?.unid &&
              !engineUnids.includes(
                state.hazProPreparerContext.hazardousMaterial.unid
              ) &&
              state.hazProPreparerContext.hazardousMaterial?.unid !==
                "UN3166" &&
              (() => {
                const hazmat = state.hazProPreparerContext.hazardousMaterial;
                const stateChar = hazmat?.hazclassDiv?.[0];
                const physicalState =
                  getHazardousMaterialPhysicalStateByHazardClass(
                    stateChar || ""
                  );

                if (
                  state.hazProPreparerContext.isGrandfatheredExplosive === true
                ) {
                  return (
                    <Text style={styles.infoLine}>
                      {`${hazmat?.properShippingName?.toUpperCase()}, ${
                        hazmat?.hazclassDiv
                      }, ${
                        state.hazProPreparerContext
                          .grandfatheredExplosivesContainers[0].grossMass
                      } KG`}
                    </Text>
                  );
                }

                // if (physicalState === PhysicalState.SOLID) {
                //   if (state.hazProPreparerContext.hazardousMaterial?.unid === "UN3072" || state.hazProPreparerContext.hazardousMaterial?.unid === "UN2990") {
                //     return (
                //       <Text style={styles.infoLine}>
                //         {`${hazmat?.properShippingName?.toUpperCase()}, ${hazmat?.hazclassDiv}`}
                //       </Text>
                //     );
                //   }

                if (
                  typeof state.hazProPreparerContext.lithiumBatteryData !==
                  "undefined"
                ) {
                  return (
                    <Text style={styles.infoLine}>
                      {`${hazmat?.properShippingName?.toUpperCase()}, ${
                        hazmat?.hazclassDiv
                      }, ${
                        state.hazProPreparerContext.lithiumBatteryData
                          .totalWeight.value
                      } KG`}
                    </Text>
                  );
                }
                if (
                  typeof state.hazProPreparerContext.dryIceData !== "undefined"
                ) {
                  return (
                    <Text style={styles.infoLine}>
                      {`${hazmat?.properShippingName?.toUpperCase()}, ${
                        hazmat?.hazclassDiv
                      }, ${
                        state.hazProPreparerContext.dryIceData.quantity
                      } KG (${(
                        parseFloat(
                          state.hazProPreparerContext.dryIceData.quantity
                        ) / 0.45359237
                      ).toFixed(2)} LBS)`}
                    </Text>
                  );
                }
                //   if (state.hazProPreparerContext.hazardousMaterial?.unid === "UN2807") {
                //     return (
                //       <Text style={styles.infoLine}>
                //         {`${hazmat?.properShippingName?.toUpperCase()}, ${hazmat?.hazclassDiv}`}
                //       </Text>
                //     );
                //   }
                if (
                  state.hazProPreparerContext.hazardousMaterial?.unid ===
                  "UN3171"
                ) {
                  return (
                    <Text style={styles.infoLine}>
                      {`${
                        state.hazProPreparerContext.batteryVehicle?.key19
                          .containsMagnetizedMaterial
                          ? "Contains Magnetized Material"
                          : ""
                      }`}
                    </Text>
                  );
                }
                //   if (state.hazProPreparerContext.hazardousMaterial?.unid === "UN3245") {
                //     return;
                //   }
                //   if (state.hazProPreparerContext.hazardousMaterial?.unid === "UN3268") {
                //     return;
                //   }
                //   return (
                //     <Text style={styles.infoLine}>
                //       {`${hazmat?.properShippingName?.toUpperCase()}, ${hazmat?.hazclassDiv}, ${state.hazProPreparerContext.packaging?.totalNetMass?.kg} KG`}
                //     </Text>
                //   );
                // }

                if (
                  state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith(
                    "2"
                  ) &&
                  typeof state.hazProPreparerContext.megcProperties !==
                    "undefined"
                ) {
                  return (
                    <Text style={styles.infoLine}>
                      {`${hazmat?.properShippingName?.toUpperCase()}, ${
                        hazmat?.hazclassDiv
                      }, ${state.hazProPreparerContext.megcProperties.totalQuantity.kg.toFixed(
                        2
                      )} KG`}
                    </Text>
                  );
                }

                if (
                  state.hazProPreparerContext.hazardousMaterial?.hazclassDiv.startsWith(
                    "2"
                  ) &&
                  Array.isArray(state.hazProPreparerContext.cylinderProperties)
                ) {
                  // total mass of all cylinders (kg), rounded to 2 decimals
                  const totalKg = state.hazProPreparerContext.cylinderProperties
                    .reduce((sum, c) => sum + (c.quantity?.kg ?? 0), 0)
                    .toFixed(2);

                  return (
                    <Text style={styles.infoLine}>
                      {`${hazmat?.properShippingName?.toUpperCase()}, ${
                        hazmat?.hazclassDiv
                      }, ${totalKg} KG`}
                    </Text>
                  );
                }

                return null;
              })()}
            {state.hazProPreparerContext.hazardousMaterial?.unid ===
              "UN2807" && (
              <Text style={styles.infoLine}>
                {
                  "Do not store magnetic materials suitable for military airlift closer than 4.6 m (15 feet) to compass sensing devices or other devices unduly affected by magnetic fields."
                }
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial?.unid ===
              "UN3245" && (
              <Text style={styles.infoLine}>
                {state.hazProPreparerContext.geneticallyModifiedOrganism?.key19}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial?.unid ===
              "UN1845" && (
              <Text style={styles.infoLine}>
                {
                  "Dry ice is extremely cold and will damage human tissue on contact. Store only in well ventilated areas. Never store in hermetically or tightly sealed containers. To minimize carbon dioxide concentration within the aircraft during ground operations, open the cargo/ access doors and emergency escape hatches for maximum ventilation."
                }
              </Text>
            )}

            {(state.hazProPreparerContext.hazardousMaterial?.unid ===
              "UN3072" ||
              state.hazProPreparerContext.hazardousMaterial?.unid ===
                "UN2990") && (
              <Text style={styles.infoLine}>
                {
                  "Store in cool, well-ventilated areas away from fire hazards and sources of heat or ignition. Do not drop or rough handle."
                }
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial?.unid ===
              "UN2900" && (
              <Text style={styles.infoLine}>
                {"This material has the potential to cause disease in animals."}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial?.unid ===
              "UN2814" && (
              <Text style={styles.infoLine}>
                {"This material has the potential to cause disease in humans"}
              </Text>
            )}

            {typeof state.hazProPreparerContext.lifeSavingApplianceData !==
              "undefined" &&
              state.hazProPreparerContext.lifeSavingApplianceData.components.map(
                (component: any, index: number) => {
                  return (
                    <Text
                      key={`${component.properShippingName}-${index}`}
                      style={styles.infoLine}
                    >{`${component.properShippingName}, ${component.hazclassDiv}`}</Text>
                  );
                }
              )}

            {isCoeAuthorization && (
              <Text style={styles.infoLine}>
                {`Item packaged as approved by the ${state.hazProPreparerContext.coeApprovalEntity || "issuing authority"}. See attached COE.`}
              </Text>
            )}

            {isCaaAuthorization && (
              <Text style={styles.infoLine}>
                {/* {`Item packaged as approved by the ${state.hazProPreparerContext.caaApprovalEntity}. See attached waiver.`} */}
                {
                  "PACKAGING AUTHORIZED BY COMPETENT AUTHORITY OF THE UNITED STATES OF AMERICA (USA)"
                }
              </Text>
            )}

            {isDotSpAuthorization && (
              <Text style={styles.infoLine}>
                {`Packaging authorized under DOT-SP ${packingInstruction || state.hazProPreparerContext.specialAuthorizationReference || ""}. See attached permit.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A5.3." && (
              <Text style={styles.infoLine}>
                {`Exercise extreme caution in handling this item. Keep well
ventilated, away from sparks, fire hazards, and oxidizing materials. Vapors are toxic when
inhaled. Liquid is corrosive. Fuel in presence of an oxidizer is self-igniting and highly
reactive. Approved protective clothing, gloves, safety goggles, and a positive pressure
breathing apparatus must be available during handling of this material, and worn when
handling leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A6.11." && (
              <Text style={styles.infoLine}>
                {`Store in cool, well-ventilated area away from fire hazards,
direct rays of the sun, and organic or easily oxidizable materials such as grease and oil.
Handle containers with extreme care. Avoid direct contact.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A6.15." && (
              <Text style={styles.infoLine}>
                {`These items are extremely dangerous. Approved chemical
safety mask and clothing must be available when handling this material and worn when
handling leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A6.16." && (
              <Text style={styles.infoLine}>
                {`These materials and mixtures are extremely dangerous
poisons. Approved chemical safety mask and clothing must be available when handling this
material, and worn when handling leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A6.18." && (
              <Text style={styles.infoLine}>
                {`These materials and mixtures are extremely dangerous
poisons. Make approved chemical safety mask and clothing available when handling this
material, and wear when handling leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A6.19." && (
              <Text style={styles.infoLine}>
                {`These items are extremely dangerous. Make approved
chemical safety mask and clothing available when handling this material, and wear when
handling leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A6.20." && (
              <Text style={styles.infoLine}>
                {`Nitric oxide is extremely dangerous and poisonous. Make
approved chemical safety mask and clothing available when handling this material, and wear
when handling leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A7.4." && (
              <Text style={styles.infoLine}>
                {`In the event of a leak during transportation of hydrazine, crew
members use their aircraft oxygen masks in a positive pressure mode.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A7.5." && (
              <Text style={styles.infoLine}>
                {`These items are extremely dangerous. Make approved chemical
safety mask and clothing available when handling this material, and wear when handling
leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A9.9." && (
              <Text style={styles.infoLine}>
                {`These items are extremely dangerous. Make approved chemical
safety mask and clothing available when handling this material, and wear when handling
leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A10.2." && (
              <Text style={styles.infoLine}>
                {`These items may produce extremely toxic vapors. Make
approved chemical safety mask and clothing available when handling this material, and wear
when handling leaking packages. See paragraph 2.8. for additional requirements.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A10.3." && (
              <Text style={styles.infoLine}>
                {`These materials and mixtures are extremely dangerous
poisons. Make approved chemical safety mask and clothing available when handling this
material, and wear when handling leaking packages. See paragraph 2.8. for additional
information.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A7.4." && (
              <Text style={styles.infoLine}>
                {`In the event of a leak during transportation of hydrazine, crew members use their aircraft oxygen masks in a positive pressure mode.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A7.5." && (
              <Text style={styles.infoLine}>
                {`These items are extremely dangerous. Make approved chemical
safety mask and clothing available when handling this material, and wear when handling
leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A10.6." && (
              <Text style={styles.infoLine}>
                {`These items are extremely dangerous. Make approved
chemical safety mask and clothing available when handling this material, and wear when
handling leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A12.9." && (
              <Text style={styles.infoLine}>
                {`Mercury is poisonous in liquid and vapor form and can be
absorbed through the skin at room temperature. It is corrosive to aluminum and its alloys. It
expands on freezing, and may crack glass containers.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A12.11." && (
              <Text style={styles.infoLine}>
                {`These items are extremely dangerous. Make available
approved chemical safety mask and clothing when handling this material, and wear when
handling leaking packages.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial?.unid ===
              "UN1941" && (
              <Text style={styles.infoLine}>
                {`Do not expose Dibromodifluoromethane to high temperature because, when it
decomposes, toxic fumes are emitted. Store in a cool, ventilated area away from flame.`}
              </Text>
            )}

            {state.hazProPreparerContext?.technicalName
              ?.toUpperCase()
              .includes("OTTO FUEL II") && (
              <Text style={styles.infoLine}>
                {`In the event of a leak, avoid direct skin contact, ingestion, or inhalation
of vapors. Vapors are toxic and may cause severe headache and nausea.`}
              </Text>
            )}

            {state.hazProPreparerContext.hazardousMaterial
              ?.packagingParagraph === "A13.12." && (
              <Text style={styles.infoLine}>
                {`Store in cool, well-ventilated areas away from fire hazards
and sources of heat or ignition. Do not drop or rough handle.`}
              </Text>
            )}

            <View style={styles.emergencyLineContainer}>
              <Text style={styles.emergencyLabel}>
                EMERGENCY TELEPHONE NUMBER:{" "}
              </Text>
              <Text style={styles.emergencyNumber}>
                {emergencyPhoneNumber1}
                {"   "}
                {emergencyPhoneNumber2}
              </Text>
            </View>
          </View>
        </View>

        {/* Declaration and Signature */}
        <View style={styles.declarationRow}>
          <View style={styles.declarationBox}>
            <Text style={styles.declarationText}>
              I hereby declare that the contents of this consignment are fully
              and accurately described above by the proper shipping name, and
              are classified, packaged, marked and labelled/placarded, and are
              in all respects in proper condition for transport according to
              applicable international and national governmental regulations. I
              declare that all of the applicable air transport requirements have
              been met.
            </Text>
          </View>
          {/* <View style={styles.signatoryBox}>
            <Text style={styles.label}>Name of Signatory</Text>
            <Text>{signatoryName}</Text>
            <Text style={{ marginTop: 8 }}>Date: {date}</Text>
            <Text>{location}</Text>
            <Text style={styles.signatureNote}>Signature (see warning above)</Text>
          </View> */}
          <View style={styles.signatoryBox}>
            <Text style={styles.labelUpper}>NAME/TITLE OF SIGNATORY</Text>
            <Text style={{ color: "#000" }}>
              {store.hazProPreparerContext.preparer?.preparerName}
            </Text>
            <Text style={{ color: "#000" }}>
              {store.hazProPreparerContext.preparer?.preparerTitle}
            </Text>

            <Text style={[styles.labelUpper, { marginTop: 12 }]}>
              PLACE AND DATE
            </Text>
            <View style={styles.placeDateRow}>
              <Text style={{ color: "#000" }}>{location}</Text>
              <Text style={{ color: "#000" }}>{date}</Text>
            </View>

            <Text style={styles.signatureNote}>
              SIGNATURE (see warning above)
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ShippersDeclarationForm;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    position: "relative",
  },
  redStripeLeft: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 10,
    borderLeftWidth: 5,
    borderLeftColor: "red",
    borderStyle: "dashed",
    zIndex: 0,
  },
  redStripeRight: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 10,
    borderRightWidth: 5,
    borderRightColor: "red",
    borderStyle: "dashed",
    zIndex: 0,
  },
  formContainer: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 12,
    zIndex: 1,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 16,
    color: "#000",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  column: {
    flex: 1,
  },
  boxLeft: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
  },
  boxRight: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
  },
  transportBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    padding: 10,
    color: "#000",
  },
  warningText: {
    fontSize: 12,
    lineHeight: 16,
    paddingLeft: 10,
    color: "#000",
  },
  underline: {
    textDecorationLine: "underline",
    marginTop: 4,
  },
  tableWrapper: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#000",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    height: 300,
    // borderBottomWidth: 1,
    // borderColor: "#000",
  },
  tableCell: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  cellLabel: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#000",
  },
  infoBox: {
    borderTopWidth: 1,
    borderColor: "#000",
    paddingTop: 10,
    marginTop: 16,
    marginBottom: 16,
    color: "#000",
  },
  declarationRow: {
    flexDirection: "row",
    gap: 8,
    borderTopWidth: 1,
    borderColor: "#000",
    paddingTop: 12,
    color: "#000",
  },
  declarationBox: {
    flex: 2,
    paddingRight: 10,
    color: "#000",
  },
  signatoryBox: {
    flex: 1,
    borderLeftWidth: 1,
    borderColor: "#000",
    paddingLeft: 10,
    color: "#000",
  },
  declarationText: {
    fontSize: 14,
    lineHeight: 18,
    padding: 5,
    color: "#000",
  },
  signatureNote: {
    fontSize: 10,
    fontStyle: "italic",
    marginTop: 12,
    color: "#000",
  },
  transportOptions: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 4,
    color: "#000",
  },
  aircraftBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRightWidth: 1,
    borderRightColor: "#000",
    position: "relative",
  },
  aircraftLabel: {
    textAlign: "center",
    fontSize: 10,
    lineHeight: 14,
    color: "#000",
  },
  xOverlayText: {
    position: "absolute",
    fontWeight: "bold",
    fontSize: 28,
    textAlign: "center",
    color: "#000",
  },
  shipmentTypeRow: {
    marginTop: 12,
    color: "#000",
  },
  shipmentTypeBox: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    marginTop: 4,
    color: "#000",
  },
  shipmentOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRightWidth: 1,
    borderRightColor: "#000",
    position: "relative",
    color: "#000",
  },
  italic: {
    fontStyle: "italic",
  },
  infoLine: {
    fontSize: 14,
    marginBottom: 2,
    paddingLeft: 10,
    color: "#000",
  },
  emergencyLineContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  emergencyLabel: {
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 4,
    color: "#000",
  },
  emergencyNumber: {
    fontSize: 13,
    color: "#000",
  },
  text: {
    paddingLeft: 10,
    color: "#000",
  },
  text2: {
    paddingLeft: 10,
    color: "#000",
  },
  text3: {
    paddingLeft: 10,
    paddingBottom: 10,
    paddingTop: 10,
    color: "#000",
  },
  text4: {
    paddingLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  text5: {
    paddingLeft: 10,
    paddingBottom: 10,
    color: "#000",
  },
  labelUpper: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
    color: "#000",
  },

  placeDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    color: "#000",
  },
  tableCellText: {
    fontSize: 12,
    color: "#000",
  },
  boxRightContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  boxRightText: {
    flex: 1,
  },
  qrCodeContainer: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
