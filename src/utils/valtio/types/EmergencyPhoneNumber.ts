import { ValtioStringHazProEmergencyPhoneNumberRecord, ValtioLifeCycleEmergencyPhoneNumberEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocEmergencyPhoneNumber } from "./../../yjs";
import { buildStringHazProEmergencyPhoneNumberRecord } from "./StringHazProEmergencyPhoneNumberRecord";

export interface ValtioEmergencyPhoneNumber {
    uuid: string;
    /** Service provider name */
    providerRecord: ValtioStringHazProEmergencyPhoneNumberRecord;
    /** Phone number */
    numberRecord: ValtioStringHazProEmergencyPhoneNumberRecord;
    /** Country code */
    countryRecord: ValtioStringHazProEmergencyPhoneNumberRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleEmergencyPhoneNumberEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: EmergencyPhoneNumberFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleEmergencyPhoneNumberEvents(events: any[]): ValtioLifeCycleEmergencyPhoneNumberEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            emergencyPhoneNumber__REF: event.emergencyPhoneNumber__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleEmergencyPhoneNumberEvent',
        }
    });
}

export async function upsertEmergencyPhoneNumberValtioEntity(ydoc: YDocEmergencyPhoneNumber) {
    if (!store.EmergencyPhoneNumberMap[ydoc.uuid]) {
        store.EmergencyPhoneNumberMap[ydoc.uuid] = proxy({} as ValtioEmergencyPhoneNumber)
    }

    const emergencyPhoneNumber = store.EmergencyPhoneNumberMap[ydoc.uuid]
    if (!emergencyPhoneNumber) {
        throw new Error('EmergencyPhoneNumber does not exist')
    }

    emergencyPhoneNumber.__typename = 'EmergencyPhoneNumber';
    emergencyPhoneNumber.path = ydoc.path;
    emergencyPhoneNumber._version = 0;
    emergencyPhoneNumber.uuid = ydoc.uuid;
    emergencyPhoneNumber.providerRecord = buildStringHazProEmergencyPhoneNumberRecord(ydoc.providerRecord);
    emergencyPhoneNumber.numberRecord = buildStringHazProEmergencyPhoneNumberRecord(ydoc.numberRecord);
    emergencyPhoneNumber.countryRecord = buildStringHazProEmergencyPhoneNumberRecord(ydoc.countryRecord);
    emergencyPhoneNumber.lifeCycleEvents = buildLifeCycleEmergencyPhoneNumberEvents(ydoc.lifeCycleEvents);
}
