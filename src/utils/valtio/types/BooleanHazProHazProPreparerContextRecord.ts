import { ValtioHazProPreparerContext, ValtioBooleanHazProHazProPreparerContextRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildBooleanHazProHazProPreparerContextRecordEvent } from "./BooleanHazProHazProPreparerContextRecordEvent";

export interface ValtioBooleanHazProHazProPreparerContextRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the HazProPreparerContext entity */
    hazProPreparerContext__REF: Reference<string>;
    /** Back reference to the HazProPreparerContext entity */
    get hazProPreparerContext(): ValtioHazProPreparerContext;
    /** Complete history of all changes to this field */
    eventHistory: ValtioBooleanHazProHazProPreparerContextRecordEvent[];
    /** Current Boolean value */
    currentValue?: boolean;
    __typename: string;
}

export function buildBooleanHazProHazProPreparerContextRecord(input: any): ValtioBooleanHazProHazProPreparerContextRecord {
    return {
        __typename: 'BooleanHazProHazProPreparerContextRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildBooleanHazProHazProPreparerContextRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
