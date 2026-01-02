import { ValtioHazProPreparerContext, ValtioIntHazProHazProPreparerContextRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildIntHazProHazProPreparerContextRecordEvent } from "./IntHazProHazProPreparerContextRecordEvent";

export interface ValtioIntHazProHazProPreparerContextRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the HazProPreparerContext entity */
    hazProPreparerContext__REF: Reference<string>;
    /** Back reference to the HazProPreparerContext entity */
    get hazProPreparerContext(): ValtioHazProPreparerContext;
    /** Complete history of all changes to this field */
    eventHistory: ValtioIntHazProHazProPreparerContextRecordEvent[];
    /** Current Int value */
    currentValue?: number;
    __typename: string;
}

export function buildIntHazProHazProPreparerContextRecord(input: any): ValtioIntHazProHazProPreparerContextRecord {
    return {
        __typename: 'IntHazProHazProPreparerContextRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildIntHazProHazProPreparerContextRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
