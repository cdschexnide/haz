import { ValtioFloatHazProCapacitorDataRecord, ValtioIntHazProCapacitorDataRecord, ValtioBooleanHazProCapacitorDataRecord, ValtioStringHazProCapacitorDataRecord, ValtioLifeCycleCapacitorDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocCapacitorData } from "./../../yjs";
import { buildFloatHazProCapacitorDataRecord } from "./FloatHazProCapacitorDataRecord";
import { buildIntHazProCapacitorDataRecord } from "./IntHazProCapacitorDataRecord";
import { buildBooleanHazProCapacitorDataRecord } from "./BooleanHazProCapacitorDataRecord";
import { buildStringHazProCapacitorDataRecord } from "./StringHazProCapacitorDataRecord";

export interface ValtioCapacitorData {
    uuid: string;
    /** Capacitance value */
    capacitance: ValtioFloatHazProCapacitorDataRecord;
    /** Voltage rating */
    voltage: ValtioFloatHazProCapacitorDataRecord;
    /** Energy storage capacity */
    energyStorage: ValtioFloatHazProCapacitorDataRecord;
    /** Number of capacitors */
    numberOfCapacitors: ValtioIntHazProCapacitorDataRecord;
    /** Whether capacitor has been discharged */
    discharged: ValtioBooleanHazProCapacitorDataRecord;
    /** Protection measures applied */
    protectionMeasures?: ValtioStringHazProCapacitorDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleCapacitorDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: CapacitorDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleCapacitorDataEvents(events: any[]): ValtioLifeCycleCapacitorDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            capacitorData__REF: event.capacitorData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleCapacitorDataEvent',
        }
    });
}

export async function upsertCapacitorDataValtioEntity(ydoc: YDocCapacitorData) {
    if (!store.CapacitorDataMap[ydoc.uuid]) {
        store.CapacitorDataMap[ydoc.uuid] = proxy({} as ValtioCapacitorData)
    }

    const capacitorData = store.CapacitorDataMap[ydoc.uuid]
    if (!capacitorData) {
        throw new Error('CapacitorData does not exist')
    }

    capacitorData.__typename = 'CapacitorData';
    capacitorData.path = ydoc.path;
    capacitorData._version = 0;
    capacitorData.uuid = ydoc.uuid;
    capacitorData.capacitance = buildFloatHazProCapacitorDataRecord(ydoc.capacitance);
    capacitorData.voltage = buildFloatHazProCapacitorDataRecord(ydoc.voltage);
    capacitorData.energyStorage = buildFloatHazProCapacitorDataRecord(ydoc.energyStorage);
    capacitorData.numberOfCapacitors = buildIntHazProCapacitorDataRecord(ydoc.numberOfCapacitors);
    capacitorData.discharged = buildBooleanHazProCapacitorDataRecord(ydoc.discharged);
    capacitorData.protectionMeasures = buildStringHazProCapacitorDataRecord(ydoc.protectionMeasures);
    capacitorData.lifeCycleEvents = buildLifeCycleCapacitorDataEvents(ydoc.lifeCycleEvents);
}
