import { ValtioShipperAddress, ValtioStringHazProShipperAddressRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProShipperAddressRecordEvent } from "./StringHazProShipperAddressRecordEvent";

export interface ValtioStringHazProShipperAddressRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the ShipperAddress entity */
    shipperAddress__REF: Reference<string>;
    /** Back reference to the ShipperAddress entity */
    get shipperAddress(): ValtioShipperAddress;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProShipperAddressRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProShipperAddressRecord(input: any): ValtioStringHazProShipperAddressRecord {
    return {
        __typename: 'StringHazProShipperAddressRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProShipperAddressRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
