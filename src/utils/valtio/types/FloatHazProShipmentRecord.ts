import { ValtioShipment, ValtioFloatHazProShipmentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildFloatHazProShipmentRecordEvent } from "./FloatHazProShipmentRecordEvent";

export interface ValtioFloatHazProShipmentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the Shipment entity */
    shipment__REF: Reference<string>;
    /** Back reference to the Shipment entity */
    get shipment(): ValtioShipment;
    /** Complete history of all changes to this field */
    eventHistory: ValtioFloatHazProShipmentRecordEvent[];
    /** Current Float value */
    currentValue?: number;
    __typename: string;
}

export function buildFloatHazProShipmentRecord(input: any): ValtioFloatHazProShipmentRecord {
    return {
        __typename: 'FloatHazProShipmentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildFloatHazProShipmentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
