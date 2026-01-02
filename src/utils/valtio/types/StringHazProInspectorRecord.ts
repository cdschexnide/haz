import { ValtioInspector, ValtioStringHazProInspectorRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProInspectorRecordEvent } from "./StringHazProInspectorRecordEvent";

export interface ValtioStringHazProInspectorRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the Inspector entity */
    inspector__REF: Reference<string>;
    /** Back reference to the Inspector entity */
    get inspector(): ValtioInspector;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProInspectorRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProInspectorRecord(input: any): ValtioStringHazProInspectorRecord {
    return {
        __typename: 'StringHazProInspectorRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProInspectorRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
