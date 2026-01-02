import { ValtioHazardousMaterialItem, ValtioShipperAddress, ValtioConsigneeAddress, ValtioPreparer, ValtioShipment, ValtioPackaging, ValtioLithiumBatteryData, ValtioMagnetizedMaterialData, ValtioDryIceData, ValtioBatteryVehicleData, ValtioCapacitorData, ValtioLifeSavingApplianceData, ValtioGMOShipmentData, ValtioSafetyDeviceData, ValtioKitPreparationData, ValtioEnginePreparationData, ValtioExplosiveContainer, ValtioBooleanHazProHazProPreparerContextRecord, ValtioCOEDocument, ValtioCAADocument, ValtioDOTSPWaiver, ValtioStringHazProHazProPreparerContextRecord, ValtioModifiersAndAcknowledgements, ValtioIntHazProHazProPreparerContextRecord, ValtioLifeCycleHazProPreparerContextEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocHazProPreparerContext, Reference } from "./../../yjs";
import { buildBooleanHazProHazProPreparerContextRecord } from "./BooleanHazProHazProPreparerContextRecord";
import { buildStringHazProHazProPreparerContextRecord } from "./StringHazProHazProPreparerContextRecord";
import { buildIntHazProHazProPreparerContextRecord } from "./IntHazProHazProPreparerContextRecord";

export interface ValtioHazProPreparerContext {
    uuid: string;
    /** Hazardous material item details */
    hazardousMaterial__REF?: Reference<string>;
    /** Hazardous material item details */
    get hazardousMaterial(): ValtioHazardousMaterialItem | undefined;
    /** Shipper address information */
    shipper__REF?: Reference<string>;
    /** Shipper address information */
    get shipper(): ValtioShipperAddress | undefined;
    /** Consignee address information */
    consignee__REF?: Reference<string>;
    /** Consignee address information */
    get consignee(): ValtioConsigneeAddress | undefined;
    /** Preparer information */
    preparer__REF?: Reference<string>;
    /** Preparer information */
    get preparer(): ValtioPreparer | undefined;
    /** Shipment routing and details */
    shipment__REF?: Reference<string>;
    /** Shipment routing and details */
    get shipment(): ValtioShipment | undefined;
    /** Packaging configuration */
    packaging__REF?: Reference<string>;
    /** Packaging configuration */
    get packaging(): ValtioPackaging | undefined;
    /** Lithium battery specific data */
    lithiumBatteryData__REF?: Reference<string>;
    /** Lithium battery specific data */
    get lithiumBatteryData(): ValtioLithiumBatteryData | undefined;
    /** Magnetized material specific data */
    magnetizedMaterialData__REF?: Reference<string>;
    /** Magnetized material specific data */
    get magnetizedMaterialData(): ValtioMagnetizedMaterialData | undefined;
    /** Dry ice specific data */
    dryIceData__REF?: Reference<string>;
    /** Dry ice specific data */
    get dryIceData(): ValtioDryIceData | undefined;
    /** Battery-powered vehicle specific data */
    batteryVehicle__REF?: Reference<string>;
    /** Battery-powered vehicle specific data */
    get batteryVehicle(): ValtioBatteryVehicleData | undefined;
    /** Capacitor specific data */
    capacitorData__REF?: Reference<string>;
    /** Capacitor specific data */
    get capacitorData(): ValtioCapacitorData | undefined;
    /** Life-saving appliance specific data */
    lifeSavingApplianceData__REF?: Reference<string>;
    /** Life-saving appliance specific data */
    get lifeSavingApplianceData(): ValtioLifeSavingApplianceData | undefined;
    /** Genetically modified organism specific data */
    geneticallyModifiedOrganism__REF?: Reference<string>;
    /** Genetically modified organism specific data */
    get geneticallyModifiedOrganism(): ValtioGMOShipmentData | undefined;
    /** Safety device specific data */
    safetyDeviceData__REF?: Reference<string>;
    /** Safety device specific data */
    get safetyDeviceData(): ValtioSafetyDeviceData | undefined;
    /** Kit preparation specific data */
    kitPreparationData__REF?: Reference<string>;
    /** Kit preparation specific data */
    get kitPreparationData(): ValtioKitPreparationData | undefined;
    /** Engine or machinery preparation specific data */
    engineOrMachineryPreparationData__REF?: Reference<string>;
    /** Engine or machinery preparation specific data */
    get engineOrMachineryPreparationData(): ValtioEnginePreparationData | undefined;
    /** Explosives details */
    explosivesDetails__REF?: Reference<string>;
    /** Explosives details */
    get explosivesDetails(): ValtioExplosiveContainer | undefined;
    /** Whether Certificate of Equivalency is used */
    usesCoeCertificationRecord: ValtioBooleanHazProHazProPreparerContextRecord;
    /** Whether Competent Authority Approval is used */
    usesCaaCertificationRecord: ValtioBooleanHazProHazProPreparerContextRecord;
    /** Whether DOT Special Permit is used */
    usesDotSpPermitRecord: ValtioBooleanHazProHazProPreparerContextRecord;
    /** COE documents attached */
    coeDocuments__REF: Reference<string[]>;
    /** COE documents attached */
    get coeDocuments(): ValtioCOEDocument[];
    /** CAA documents attached */
    caaDocuments__REF: Reference<string[]>;
    /** CAA documents attached */
    get caaDocuments(): ValtioCAADocument[];
    /** DOT SP waivers attached */
    dotSpWaivers__REF: Reference<string[]>;
    /** DOT SP waivers attached */
    get dotSpWaivers(): ValtioDOTSPWaiver[];
    /** COE approval entity name */
    coeApprovalEntityRecord?: ValtioStringHazProHazProPreparerContextRecord;
    /** CAA approval entity name */
    caaApprovalEntityRecord?: ValtioStringHazProHazProPreparerContextRecord;
    /** Emergency contact for excepted lithium batteries */
    exceptedLithiumBatteryEmergencyContactRecord?: ValtioStringHazProHazProPreparerContextRecord;
    /** Modifiers and required acknowledgements */
    modifiersAndRequiredAcknowledgements__REF?: Reference<string>;
    /** Modifiers and required acknowledgements */
    get modifiersAndRequiredAcknowledgements(): ValtioModifiersAndAcknowledgements | undefined;
    /** Current shipment identifier */
    currentShipmentIdRecord?: ValtioStringHazProHazProPreparerContextRecord;
    /** Active workflow step index */
    activeStepRecord?: ValtioIntHazProHazProPreparerContextRecord;
    /** Active workflow substep index */
    activeSubstepRecord?: ValtioIntHazProHazProPreparerContextRecord;
    /** List of completed substep identifiers */
    completedSubsteps: string[];
    /** Selected packaging method */
    packagingMethodRecord?: ValtioStringHazProHazProPreparerContextRecord;
    /** Allowable packing groups for this material */
    allowablePackingGroupsRecord?: ValtioStringHazProHazProPreparerContextRecord;
    /** Redirect UN ID if applicable */
    redirectUnidRecord?: ValtioStringHazProHazProPreparerContextRecord;
    /** Whether explosives are authorized to be shipped unpacked */
    explosivesAuthorizedToBeShippedUnpackedRecord?: ValtioBooleanHazProHazProPreparerContextRecord;
    /** Technical name for the hazardous material (if required) */
    technicalName?: string;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleHazProPreparerContextEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: HazProPreparerContextFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleHazProPreparerContextEvents(events: any[]): ValtioLifeCycleHazProPreparerContextEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            hazProPreparerContext__REF: event.hazProPreparerContext__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleHazProPreparerContextEvent',
        }
    });
}

export async function upsertHazProPreparerContextValtioEntity(ydoc: YDocHazProPreparerContext) {
    if (!store.HazProPreparerContextMap[ydoc.uuid]) {
        store.HazProPreparerContextMap[ydoc.uuid] = proxy({} as ValtioHazProPreparerContext)
    }

    const hazProPreparerContext = store.HazProPreparerContextMap[ydoc.uuid]
    if (!hazProPreparerContext) {
        throw new Error('HazProPreparerContext does not exist')
    }

    hazProPreparerContext.__typename = 'HazProPreparerContext';
    hazProPreparerContext.path = ydoc.path;
    hazProPreparerContext._version = 0;
    hazProPreparerContext.uuid = ydoc.uuid;
    hazProPreparerContext.hazardousMaterial__REF = ydoc.hazardousMaterial__REF;
    hazProPreparerContext.shipper__REF = ydoc.shipper__REF;
    hazProPreparerContext.consignee__REF = ydoc.consignee__REF;
    hazProPreparerContext.preparer__REF = ydoc.preparer__REF;
    hazProPreparerContext.shipment__REF = ydoc.shipment__REF;
    hazProPreparerContext.packaging__REF = ydoc.packaging__REF;
    hazProPreparerContext.lithiumBatteryData__REF = ydoc.lithiumBatteryData__REF;
    hazProPreparerContext.magnetizedMaterialData__REF = ydoc.magnetizedMaterialData__REF;
    hazProPreparerContext.dryIceData__REF = ydoc.dryIceData__REF;
    hazProPreparerContext.batteryVehicle__REF = ydoc.batteryVehicle__REF;
    hazProPreparerContext.capacitorData__REF = ydoc.capacitorData__REF;
    hazProPreparerContext.lifeSavingApplianceData__REF = ydoc.lifeSavingApplianceData__REF;
    hazProPreparerContext.geneticallyModifiedOrganism__REF = ydoc.geneticallyModifiedOrganism__REF;
    hazProPreparerContext.safetyDeviceData__REF = ydoc.safetyDeviceData__REF;
    hazProPreparerContext.kitPreparationData__REF = ydoc.kitPreparationData__REF;
    hazProPreparerContext.engineOrMachineryPreparationData__REF = ydoc.engineOrMachineryPreparationData__REF;
    hazProPreparerContext.explosivesDetails__REF = ydoc.explosivesDetails__REF;
    hazProPreparerContext.usesCoeCertificationRecord = buildBooleanHazProHazProPreparerContextRecord(ydoc.usesCoeCertificationRecord);
    hazProPreparerContext.usesCaaCertificationRecord = buildBooleanHazProHazProPreparerContextRecord(ydoc.usesCaaCertificationRecord);
    hazProPreparerContext.usesDotSpPermitRecord = buildBooleanHazProHazProPreparerContextRecord(ydoc.usesDotSpPermitRecord);
    hazProPreparerContext.coeDocuments__REF = ydoc.coeDocuments__REF;
    hazProPreparerContext.caaDocuments__REF = ydoc.caaDocuments__REF;
    hazProPreparerContext.dotSpWaivers__REF = ydoc.dotSpWaivers__REF;
    hazProPreparerContext.coeApprovalEntityRecord = buildStringHazProHazProPreparerContextRecord(ydoc.coeApprovalEntityRecord);
    hazProPreparerContext.caaApprovalEntityRecord = buildStringHazProHazProPreparerContextRecord(ydoc.caaApprovalEntityRecord);
    hazProPreparerContext.exceptedLithiumBatteryEmergencyContactRecord = buildStringHazProHazProPreparerContextRecord(ydoc.exceptedLithiumBatteryEmergencyContactRecord);
    hazProPreparerContext.modifiersAndRequiredAcknowledgements__REF = ydoc.modifiersAndRequiredAcknowledgements__REF;
    hazProPreparerContext.currentShipmentIdRecord = buildStringHazProHazProPreparerContextRecord(ydoc.currentShipmentIdRecord);
    hazProPreparerContext.activeStepRecord = buildIntHazProHazProPreparerContextRecord(ydoc.activeStepRecord);
    hazProPreparerContext.activeSubstepRecord = buildIntHazProHazProPreparerContextRecord(ydoc.activeSubstepRecord);
    hazProPreparerContext.completedSubsteps = ydoc.completedSubsteps;
    hazProPreparerContext.packagingMethodRecord = buildStringHazProHazProPreparerContextRecord(ydoc.packagingMethodRecord);
    hazProPreparerContext.allowablePackingGroupsRecord = buildStringHazProHazProPreparerContextRecord(ydoc.allowablePackingGroupsRecord);
    hazProPreparerContext.redirectUnidRecord = buildStringHazProHazProPreparerContextRecord(ydoc.redirectUnidRecord);
    hazProPreparerContext.explosivesAuthorizedToBeShippedUnpackedRecord = buildBooleanHazProHazProPreparerContextRecord(ydoc.explosivesAuthorizedToBeShippedUnpackedRecord);
    hazProPreparerContext.technicalName = ydoc.technicalName;
    hazProPreparerContext.lifeCycleEvents = buildLifeCycleHazProPreparerContextEvents(ydoc.lifeCycleEvents);
    Object.defineProperty(hazProPreparerContext, 'hazardousMaterial', {
        get() {
            return Object.values(store.HazardousMaterialItemMap).filter((hazardousMaterialItem) => hazardousMaterialItem?.uuid === this.hazardousMaterial__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'shipper', {
        get() {
            return Object.values(store.ShipperAddressMap).filter((shipperAddress) => shipperAddress?.uuid === this.shipper__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'consignee', {
        get() {
            return Object.values(store.ConsigneeAddressMap).filter((consigneeAddress) => consigneeAddress?.uuid === this.consignee__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'preparer', {
        get() {
            return Object.values(store.PreparerMap).filter((preparer) => preparer?.uuid === this.preparer__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'shipment', {
        get() {
            return Object.values(store.ShipmentMap).filter((shipment) => shipment?.uuid === this.shipment__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'packaging', {
        get() {
            return Object.values(store.PackagingMap).filter((packaging) => packaging?.uuid === this.packaging__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'lithiumBatteryData', {
        get() {
            return Object.values(store.LithiumBatteryDataMap).filter((lithiumBatteryData) => lithiumBatteryData?.uuid === this.lithiumBatteryData__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'magnetizedMaterialData', {
        get() {
            return Object.values(store.MagnetizedMaterialDataMap).filter((magnetizedMaterialData) => magnetizedMaterialData?.uuid === this.magnetizedMaterialData__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'dryIceData', {
        get() {
            return Object.values(store.DryIceDataMap).filter((dryIceData) => dryIceData?.uuid === this.dryIceData__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'batteryVehicle', {
        get() {
            return Object.values(store.BatteryVehicleDataMap).filter((batteryVehicleData) => batteryVehicleData?.uuid === this.batteryVehicle__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'capacitorData', {
        get() {
            return Object.values(store.CapacitorDataMap).filter((capacitorData) => capacitorData?.uuid === this.capacitorData__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'lifeSavingApplianceData', {
        get() {
            return Object.values(store.LifeSavingApplianceDataMap).filter((lifeSavingApplianceData) => lifeSavingApplianceData?.uuid === this.lifeSavingApplianceData__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'geneticallyModifiedOrganism', {
        get() {
            return Object.values(store.GMOShipmentDataMap).filter((gMOShipmentData) => gMOShipmentData?.uuid === this.geneticallyModifiedOrganism__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'safetyDeviceData', {
        get() {
            return Object.values(store.SafetyDeviceDataMap).filter((safetyDeviceData) => safetyDeviceData?.uuid === this.safetyDeviceData__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'kitPreparationData', {
        get() {
            return Object.values(store.KitPreparationDataMap).filter((kitPreparationData) => kitPreparationData?.uuid === this.kitPreparationData__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'engineOrMachineryPreparationData', {
        get() {
            return Object.values(store.EnginePreparationDataMap).filter((enginePreparationData) => enginePreparationData?.uuid === this.engineOrMachineryPreparationData__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'explosivesDetails', {
        get() {
            return Object.values(store.ExplosiveContainerMap).filter((explosiveContainer) => explosiveContainer?.uuid === this.explosivesDetails__REF.uuid)[0];
        }
    });
    Object.defineProperty(hazProPreparerContext, 'coeDocuments', {
        get() {
            return Object.values(store.COEDocumentMap).filter((cOEDocument) => cOEDocument?.hazProPreparerContext__REF?.uuid === this.uuid).map((cOEDocument) => cOEDocument);
        }
    });
    Object.defineProperty(hazProPreparerContext, 'caaDocuments', {
        get() {
            return Object.values(store.CAADocumentMap).filter((cAADocument) => cAADocument?.hazProPreparerContext__REF?.uuid === this.uuid).map((cAADocument) => cAADocument);
        }
    });
    Object.defineProperty(hazProPreparerContext, 'dotSpWaivers', {
        get() {
            return Object.values(store.DOTSPWaiverMap).filter((dOTSPWaiver) => dOTSPWaiver?.hazProPreparerContext__REF?.uuid === this.uuid).map((dOTSPWaiver) => dOTSPWaiver);
        }
    });
    Object.defineProperty(hazProPreparerContext, 'modifiersAndRequiredAcknowledgements', {
        get() {
            return Object.values(store.ModifiersAndAcknowledgementsMap).filter((modifiersAndAcknowledgements) => modifiersAndAcknowledgements?.uuid === this.modifiersAndRequiredAcknowledgements__REF.uuid)[0];
        }
    });
}
