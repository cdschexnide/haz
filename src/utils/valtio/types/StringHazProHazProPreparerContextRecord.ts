import { ValtioHazProPreparerContext, ValtioStringHazProHazProPreparerContextRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProHazProPreparerContextRecordEvent } from "./StringHazProHazProPreparerContextRecordEvent";

export interface ValtioStringHazProHazProPreparerContextRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the HazProPreparerContext entity */
    hazProPreparerContext__REF: Reference<string>;
    /** Back reference to the HazProPreparerContext entity */
    get hazProPreparerContext(): ValtioHazProPreparerContext;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProHazProPreparerContextRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProHazProPreparerContextRecord(input: any): ValtioStringHazProHazProPreparerContextRecord {
    return {
        __typename: 'StringHazProHazProPreparerContextRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProHazProPreparerContextRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
