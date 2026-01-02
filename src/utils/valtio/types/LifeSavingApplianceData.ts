import { ValtioStringHazProLifeSavingApplianceDataRecord, ValtioIntHazProLifeSavingApplianceDataRecord, ValtioLifeCycleLifeSavingApplianceDataEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocLifeSavingApplianceData } from "./../../yjs";
import { buildStringHazProLifeSavingApplianceDataRecord } from "./StringHazProLifeSavingApplianceDataRecord";
import { buildIntHazProLifeSavingApplianceDataRecord } from "./IntHazProLifeSavingApplianceDataRecord";

export interface ValtioLifeSavingApplianceData {
    uuid: string;
    /** Type of life-saving device */
    deviceTypeRecord: ValtioStringHazProLifeSavingApplianceDataRecord;
    /** Type of gas used in the device */
    gasTypeRecord: ValtioStringHazProLifeSavingApplianceDataRecord;
    /** Size of the gas cylinder */
    cylinderSizeRecord: ValtioStringHazProLifeSavingApplianceDataRecord;
    /** Number of devices being shipped */
    numberOfDevicesRecord: ValtioIntHazProLifeSavingApplianceDataRecord;
    /** Gas charge amount */
    gasChargeRecord?: ValtioStringHazProLifeSavingApplianceDataRecord;
    /** Method of activation */
    activationMethodRecord?: ValtioStringHazProLifeSavingApplianceDataRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleLifeSavingApplianceDataEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: LifeSavingApplianceDataFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleLifeSavingApplianceDataEvents(events: any[]): ValtioLifeCycleLifeSavingApplianceDataEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            lifeSavingApplianceData__REF: event.lifeSavingApplianceData__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleLifeSavingApplianceDataEvent',
        }
    });
}

export async function upsertLifeSavingApplianceDataValtioEntity(ydoc: YDocLifeSavingApplianceData) {
    if (!store.LifeSavingApplianceDataMap[ydoc.uuid]) {
        store.LifeSavingApplianceDataMap[ydoc.uuid] = proxy({} as ValtioLifeSavingApplianceData)
    }

    const lifeSavingApplianceData = store.LifeSavingApplianceDataMap[ydoc.uuid]
    if (!lifeSavingApplianceData) {
        throw new Error('LifeSavingApplianceData does not exist')
    }

    lifeSavingApplianceData.__typename = 'LifeSavingApplianceData';
    lifeSavingApplianceData.path = ydoc.path;
    lifeSavingApplianceData._version = 0;
    lifeSavingApplianceData.uuid = ydoc.uuid;
    lifeSavingApplianceData.deviceTypeRecord = buildStringHazProLifeSavingApplianceDataRecord(ydoc.deviceTypeRecord);
    lifeSavingApplianceData.gasTypeRecord = buildStringHazProLifeSavingApplianceDataRecord(ydoc.gasTypeRecord);
    lifeSavingApplianceData.cylinderSizeRecord = buildStringHazProLifeSavingApplianceDataRecord(ydoc.cylinderSizeRecord);
    lifeSavingApplianceData.numberOfDevicesRecord = buildIntHazProLifeSavingApplianceDataRecord(ydoc.numberOfDevicesRecord);
    lifeSavingApplianceData.gasChargeRecord = buildStringHazProLifeSavingApplianceDataRecord(ydoc.gasChargeRecord);
    lifeSavingApplianceData.activationMethodRecord = buildStringHazProLifeSavingApplianceDataRecord(ydoc.activationMethodRecord);
    lifeSavingApplianceData.lifeCycleEvents = buildLifeCycleLifeSavingApplianceDataEvents(ydoc.lifeCycleEvents);
}
