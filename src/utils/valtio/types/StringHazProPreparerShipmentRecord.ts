import { ValtioPreparerShipment, ValtioStringHazProPreparerShipmentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProPreparerShipmentRecordEvent } from "./StringHazProPreparerShipmentRecordEvent";

export interface ValtioStringHazProPreparerShipmentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the PreparerShipment entity */
    preparerShipment__REF: Reference<string>;
    /** Back reference to the PreparerShipment entity */
    get preparerShipment(): ValtioPreparerShipment;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProPreparerShipmentRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProPreparerShipmentRecord(input: any): ValtioStringHazProPreparerShipmentRecord {
    return {
        __typename: 'StringHazProPreparerShipmentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProPreparerShipmentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
