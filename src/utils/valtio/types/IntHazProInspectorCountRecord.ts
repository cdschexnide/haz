import { ValtioIntHazProInspectorCountRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildIntHazProInspectorCountRecordEvent } from "./IntHazProInspectorCountRecordEvent";

export interface ValtioIntHazProInspectorCountRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InspectorCount entity */
    inspectorCount__REF: Reference<string>;
    /** Complete history of all changes to this field */
    eventHistory: ValtioIntHazProInspectorCountRecordEvent[];
    /** Current Int value */
    currentValue?: number;
    __typename: string;
}

export function buildIntHazProInspectorCountRecord(input: any): ValtioIntHazProInspectorCountRecord {
    return {
        __typename: 'IntHazProInspectorCountRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildIntHazProInspectorCountRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
