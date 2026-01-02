import { ValtioLifeSavingApplianceData, ValtioIntHazProLifeSavingApplianceDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildIntHazProLifeSavingApplianceDataRecordEvent } from "./IntHazProLifeSavingApplianceDataRecordEvent";

export interface ValtioIntHazProLifeSavingApplianceDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the LifeSavingApplianceData entity */
    lifeSavingApplianceData__REF: Reference<string>;
    /** Back reference to the LifeSavingApplianceData entity */
    get lifeSavingApplianceData(): ValtioLifeSavingApplianceData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioIntHazProLifeSavingApplianceDataRecordEvent[];
    /** Current Int value */
    currentValue?: number;
    __typename: string;
}

export function buildIntHazProLifeSavingApplianceDataRecord(input: any): ValtioIntHazProLifeSavingApplianceDataRecord {
    return {
        __typename: 'IntHazProLifeSavingApplianceDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildIntHazProLifeSavingApplianceDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
