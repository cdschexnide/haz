import { ValtioStringHazProLithiumBatteryDataRecord, ValtioFloatHazProLithiumBatteryDataRecord, ValtioIntHazProLithiumBatteryDataRecord, ValtioBooleanHazProLithiumBatteryDataRecord, ValtioLifeCycleLithiumBatteryDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocLithiumBatteryData } from "./../../yjs";
import { buildStringHazProLithiumBatteryDataRecord } from "./StringHazProLithiumBatteryDataRecord";
import { buildFloatHazProLithiumBatteryDataRecord } from "./FloatHazProLithiumBatteryDataRecord";
import { buildIntHazProLithiumBatteryDataRecord } from "./IntHazProLithiumBatteryDataRecord";
import { buildBooleanHazProLithiumBatteryDataRecord } from "./BooleanHazProLithiumBatteryDataRecord";

export interface ValtioLithiumBatteryData {
    uuid: string;
    /** Type of lithium battery */
    batteryTypeRecord: ValtioStringHazProLithiumBatteryDataRecord;
    /** Battery capacity in watt-hours */
    wattHoursRecord?: ValtioFloatHazProLithiumBatteryDataRecord;
    /** Lithium content in grams */
    lithiumContentRecord?: ValtioFloatHazProLithiumBatteryDataRecord;
    /** Number of cells in the battery */
    numberOfCellsRecord?: ValtioIntHazProLithiumBatteryDataRecord;
    /** Packing instruction number */
    packingInstructionRecord: ValtioStringHazProLithiumBatteryDataRecord;
    /** Total number of batteries */
    numberOfBatteriesRecord?: ValtioIntHazProLithiumBatteryDataRecord;
    /** Mass per individual battery */
    massPerBatteryRecord?: ValtioFloatHazProLithiumBatteryDataRecord;
    /** Whether battery is contained in equipment */
    isInEquipmentRecord?: ValtioBooleanHazProLithiumBatteryDataRecord;
    /** Whether battery is packed with equipment */
    isPackedWithEquipmentRecord?: ValtioBooleanHazProLithiumBatteryDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleLithiumBatteryDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: LithiumBatteryDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleLithiumBatteryDataEvents(events: any[]): ValtioLifeCycleLithiumBatteryDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            lithiumBatteryData__REF: event.lithiumBatteryData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleLithiumBatteryDataEvent',
        }
    });
}

export async function upsertLithiumBatteryDataValtioEntity(ydoc: YDocLithiumBatteryData) {
    if (!store.LithiumBatteryDataMap[ydoc.uuid]) {
        store.LithiumBatteryDataMap[ydoc.uuid] = proxy({} as ValtioLithiumBatteryData)
    }

    const lithiumBatteryData = store.LithiumBatteryDataMap[ydoc.uuid]
    if (!lithiumBatteryData) {
        throw new Error('LithiumBatteryData does not exist')
    }

    lithiumBatteryData.__typename = 'LithiumBatteryData';
    lithiumBatteryData.path = ydoc.path;
    lithiumBatteryData._version = 0;
    lithiumBatteryData.uuid = ydoc.uuid;
    lithiumBatteryData.batteryTypeRecord = buildStringHazProLithiumBatteryDataRecord(ydoc.batteryTypeRecord);
    lithiumBatteryData.wattHoursRecord = buildFloatHazProLithiumBatteryDataRecord(ydoc.wattHoursRecord);
    lithiumBatteryData.lithiumContentRecord = buildFloatHazProLithiumBatteryDataRecord(ydoc.lithiumContentRecord);
    lithiumBatteryData.numberOfCellsRecord = buildIntHazProLithiumBatteryDataRecord(ydoc.numberOfCellsRecord);
    lithiumBatteryData.packingInstructionRecord = buildStringHazProLithiumBatteryDataRecord(ydoc.packingInstructionRecord);
    lithiumBatteryData.numberOfBatteriesRecord = buildIntHazProLithiumBatteryDataRecord(ydoc.numberOfBatteriesRecord);
    lithiumBatteryData.massPerBatteryRecord = buildFloatHazProLithiumBatteryDataRecord(ydoc.massPerBatteryRecord);
    lithiumBatteryData.isInEquipmentRecord = buildBooleanHazProLithiumBatteryDataRecord(ydoc.isInEquipmentRecord);
    lithiumBatteryData.isPackedWithEquipmentRecord = buildBooleanHazProLithiumBatteryDataRecord(ydoc.isPackedWithEquipmentRecord);
    lithiumBatteryData.lifeCycleEvents = buildLifeCycleLithiumBatteryDataEvents(ydoc.lifeCycleEvents);
}
