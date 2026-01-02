import { ValtioConsigneeAddress, ValtioStringHazProConsigneeAddressRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProConsigneeAddressRecordEvent } from "./StringHazProConsigneeAddressRecordEvent";

export interface ValtioStringHazProConsigneeAddressRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the ConsigneeAddress entity */
    consigneeAddress__REF: Reference<string>;
    /** Back reference to the ConsigneeAddress entity */
    get consigneeAddress(): ValtioConsigneeAddress;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProConsigneeAddressRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProConsigneeAddressRecord(input: any): ValtioStringHazProConsigneeAddressRecord {
    return {
        __typename: 'StringHazProConsigneeAddressRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProConsigneeAddressRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
