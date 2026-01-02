import { ValtioLifeSavingApplianceData, ValtioStringHazProLifeSavingApplianceDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProLifeSavingApplianceDataRecordEvent } from "./StringHazProLifeSavingApplianceDataRecordEvent";

export interface ValtioStringHazProLifeSavingApplianceDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the LifeSavingApplianceData entity */
    lifeSavingApplianceData__REF: Reference<string>;
    /** Back reference to the LifeSavingApplianceData entity */
    get lifeSavingApplianceData(): ValtioLifeSavingApplianceData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProLifeSavingApplianceDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProLifeSavingApplianceDataRecord(input: any): ValtioStringHazProLifeSavingApplianceDataRecord {
    return {
        __typename: 'StringHazProLifeSavingApplianceDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProLifeSavingApplianceDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
