import { ValtioStringHazProGMOShipmentDataRecord, ValtioLifeCycleGMOShipmentDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocGMOShipmentData } from "./../../yjs";
import { buildStringHazProGMOShipmentDataRecord } from "./StringHazProGMOShipmentDataRecord";

export interface ValtioGMOShipmentData {
    uuid: string;
    /** Type of organism */
    organismTypeRecord: ValtioStringHazProGMOShipmentDataRecord;
    /** Genotype information */
    genotypeRecord: ValtioStringHazProGMOShipmentDataRecord;
    /** Containment level required */
    containmentLevelRecord: ValtioStringHazProGMOShipmentDataRecord;
    /** Packaging specification */
    packagingSpecificationRecord: ValtioStringHazProGMOShipmentDataRecord;
    /** Handling requirements */
    handlingRequirementsRecord?: ValtioStringHazProGMOShipmentDataRecord;
    /** Emergency procedures */
    emergencyProceduresRecord?: ValtioStringHazProGMOShipmentDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleGMOShipmentDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: GMOShipmentDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleGMOShipmentDataEvents(events: any[]): ValtioLifeCycleGMOShipmentDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            gMOShipmentData__REF: event.gMOShipmentData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleGMOShipmentDataEvent',
        }
    });
}

export async function upsertGMOShipmentDataValtioEntity(ydoc: YDocGMOShipmentData) {
    if (!store.GMOShipmentDataMap[ydoc.uuid]) {
        store.GMOShipmentDataMap[ydoc.uuid] = proxy({} as ValtioGMOShipmentData)
    }

    const gMOShipmentData = store.GMOShipmentDataMap[ydoc.uuid]
    if (!gMOShipmentData) {
        throw new Error('GMOShipmentData does not exist')
    }

    gMOShipmentData.__typename = 'GMOShipmentData';
    gMOShipmentData.path = ydoc.path;
    gMOShipmentData._version = 0;
    gMOShipmentData.uuid = ydoc.uuid;
    gMOShipmentData.organismTypeRecord = buildStringHazProGMOShipmentDataRecord(ydoc.organismTypeRecord);
    gMOShipmentData.genotypeRecord = buildStringHazProGMOShipmentDataRecord(ydoc.genotypeRecord);
    gMOShipmentData.containmentLevelRecord = buildStringHazProGMOShipmentDataRecord(ydoc.containmentLevelRecord);
    gMOShipmentData.packagingSpecificationRecord = buildStringHazProGMOShipmentDataRecord(ydoc.packagingSpecificationRecord);
    gMOShipmentData.handlingRequirementsRecord = buildStringHazProGMOShipmentDataRecord(ydoc.handlingRequirementsRecord);
    gMOShipmentData.emergencyProceduresRecord = buildStringHazProGMOShipmentDataRecord(ydoc.emergencyProceduresRecord);
    gMOShipmentData.lifeCycleEvents = buildLifeCycleGMOShipmentDataEvents(ydoc.lifeCycleEvents);
}
