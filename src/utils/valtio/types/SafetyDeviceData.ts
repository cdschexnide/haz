import { ValtioStringHazProSafetyDeviceDataRecord, ValtioIntHazProSafetyDeviceDataRecord, ValtioBooleanHazProSafetyDeviceDataRecord, ValtioLifeCycleSafetyDeviceDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocSafetyDeviceData } from "./../../yjs";
import { buildStringHazProSafetyDeviceDataRecord } from "./StringHazProSafetyDeviceDataRecord";
import { buildIntHazProSafetyDeviceDataRecord } from "./IntHazProSafetyDeviceDataRecord";
import { buildBooleanHazProSafetyDeviceDataRecord } from "./BooleanHazProSafetyDeviceDataRecord";

export interface ValtioSafetyDeviceData {
    uuid: string;
    /** Type of safety device */
    deviceTypeRecord: ValtioStringHazProSafetyDeviceDataRecord;
    /** Method of activation */
    activationMethodRecord: ValtioStringHazProSafetyDeviceDataRecord;
    /** Number of devices */
    numberOfDevicesRecord: ValtioIntHazProSafetyDeviceDataRecord;
    /** Type of gas if applicable */
    gasTypeRecord?: ValtioStringHazProSafetyDeviceDataRecord;
    /** Whether device contains pyrotechnic components */
    pyrotechnicComponentsRecord?: ValtioBooleanHazProSafetyDeviceDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleSafetyDeviceDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: SafetyDeviceDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleSafetyDeviceDataEvents(events: any[]): ValtioLifeCycleSafetyDeviceDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            safetyDeviceData__REF: event.safetyDeviceData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleSafetyDeviceDataEvent',
        }
    });
}

export async function upsertSafetyDeviceDataValtioEntity(ydoc: YDocSafetyDeviceData) {
    if (!store.SafetyDeviceDataMap[ydoc.uuid]) {
        store.SafetyDeviceDataMap[ydoc.uuid] = proxy({} as ValtioSafetyDeviceData)
    }

    const safetyDeviceData = store.SafetyDeviceDataMap[ydoc.uuid]
    if (!safetyDeviceData) {
        throw new Error('SafetyDeviceData does not exist')
    }

    safetyDeviceData.__typename = 'SafetyDeviceData';
    safetyDeviceData.path = ydoc.path;
    safetyDeviceData._version = 0;
    safetyDeviceData.uuid = ydoc.uuid;
    safetyDeviceData.deviceTypeRecord = buildStringHazProSafetyDeviceDataRecord(ydoc.deviceTypeRecord);
    safetyDeviceData.activationMethodRecord = buildStringHazProSafetyDeviceDataRecord(ydoc.activationMethodRecord);
    safetyDeviceData.numberOfDevicesRecord = buildIntHazProSafetyDeviceDataRecord(ydoc.numberOfDevicesRecord);
    safetyDeviceData.gasTypeRecord = buildStringHazProSafetyDeviceDataRecord(ydoc.gasTypeRecord);
    safetyDeviceData.pyrotechnicComponentsRecord = buildBooleanHazProSafetyDeviceDataRecord(ydoc.pyrotechnicComponentsRecord);
    safetyDeviceData.lifeCycleEvents = buildLifeCycleSafetyDeviceDataEvents(ydoc.lifeCycleEvents);
}
