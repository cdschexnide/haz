import { ValtioShipment, ValtioStringHazProShipmentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProShipmentRecordEvent } from "./StringHazProShipmentRecordEvent";

export interface ValtioStringHazProShipmentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the Shipment entity */
    shipment__REF: Reference<string>;
    /** Back reference to the Shipment entity */
    get shipment(): ValtioShipment;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProShipmentRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProShipmentRecord(input: any): ValtioStringHazProShipmentRecord {
    return {
        __typename: 'StringHazProShipmentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProShipmentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
