import { ValtioPreparerShipment, ValtioDateHazProPreparerShipmentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildDateHazProPreparerShipmentRecordEvent } from "./DateHazProPreparerShipmentRecordEvent";

export interface ValtioDateHazProPreparerShipmentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the PreparerShipment entity */
    preparerShipment__REF: Reference<string>;
    /** Back reference to the PreparerShipment entity */
    get preparerShipment(): ValtioPreparerShipment;
    /** Complete history of all changes to this field */
    eventHistory: ValtioDateHazProPreparerShipmentRecordEvent[];
    /** Current Date value */
    currentValue__REF?: Reference<string>;
    __typename: string;
}

export function buildDateHazProPreparerShipmentRecord(input: any): ValtioDateHazProPreparerShipmentRecord {
    return {
        __typename: 'DateHazProPreparerShipmentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildDateHazProPreparerShipmentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
