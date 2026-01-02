import { ValtioModifiersAndAcknowledgements, ValtioBooleanHazProModifiersAndAcknowledgementsRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildBooleanHazProModifiersAndAcknowledgementsRecordEvent } from "./BooleanHazProModifiersAndAcknowledgementsRecordEvent";

export interface ValtioBooleanHazProModifiersAndAcknowledgementsRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the ModifiersAndAcknowledgements entity */
    modifiersAndAcknowledgements__REF: Reference<string>;
    /** Back reference to the ModifiersAndAcknowledgements entity */
    get modifiersAndAcknowledgements(): ValtioModifiersAndAcknowledgements;
    /** Complete history of all changes to this field */
    eventHistory: ValtioBooleanHazProModifiersAndAcknowledgementsRecordEvent[];
    /** Current Boolean value */
    currentValue?: boolean;
    __typename: string;
}

export function buildBooleanHazProModifiersAndAcknowledgementsRecord(input: any): ValtioBooleanHazProModifiersAndAcknowledgementsRecord {
    return {
        __typename: 'BooleanHazProModifiersAndAcknowledgementsRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildBooleanHazProModifiersAndAcknowledgementsRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
