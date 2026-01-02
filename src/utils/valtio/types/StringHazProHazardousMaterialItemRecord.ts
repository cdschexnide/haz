import { ValtioHazardousMaterialItem, ValtioStringHazProHazardousMaterialItemRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProHazardousMaterialItemRecordEvent } from "./StringHazProHazardousMaterialItemRecordEvent";

export interface ValtioStringHazProHazardousMaterialItemRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the HazardousMaterialItem entity */
    hazardousMaterialItem__REF: Reference<string>;
    /** Back reference to the HazardousMaterialItem entity */
    get hazardousMaterialItem(): ValtioHazardousMaterialItem;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProHazardousMaterialItemRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProHazardousMaterialItemRecord(input: any): ValtioStringHazProHazardousMaterialItemRecord {
    return {
        __typename: 'StringHazProHazardousMaterialItemRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProHazardousMaterialItemRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
