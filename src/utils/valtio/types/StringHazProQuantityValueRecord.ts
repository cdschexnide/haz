import { ValtioQuantityValue, ValtioStringHazProQuantityValueRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProQuantityValueRecordEvent } from "./StringHazProQuantityValueRecordEvent";

export interface ValtioStringHazProQuantityValueRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the QuantityValue entity */
    quantityValue__REF: Reference<string>;
    /** Back reference to the QuantityValue entity */
    get quantityValue(): ValtioQuantityValue;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProQuantityValueRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProQuantityValueRecord(input: any): ValtioStringHazProQuantityValueRecord {
    return {
        __typename: 'StringHazProQuantityValueRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProQuantityValueRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
