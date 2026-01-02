import { ValtioEmergencyPhoneNumber, ValtioStringHazProEmergencyPhoneNumberRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProEmergencyPhoneNumberRecordEvent } from "./StringHazProEmergencyPhoneNumberRecordEvent";

export interface ValtioStringHazProEmergencyPhoneNumberRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the EmergencyPhoneNumber entity */
    emergencyPhoneNumber__REF: Reference<string>;
    /** Back reference to the EmergencyPhoneNumber entity */
    get emergencyPhoneNumber(): ValtioEmergencyPhoneNumber;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProEmergencyPhoneNumberRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProEmergencyPhoneNumberRecord(input: any): ValtioStringHazProEmergencyPhoneNumberRecord {
    return {
        __typename: 'StringHazProEmergencyPhoneNumberRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProEmergencyPhoneNumberRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
