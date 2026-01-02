import { ValtioCryogenicLiquidDetails, ValtioStringHazProCryogenicLiquidDetailsRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProCryogenicLiquidDetailsRecordEvent } from "./StringHazProCryogenicLiquidDetailsRecordEvent";

export interface ValtioStringHazProCryogenicLiquidDetailsRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the CryogenicLiquidDetails entity */
    cryogenicLiquidDetails__REF: Reference<string>;
    /** Back reference to the CryogenicLiquidDetails entity */
    get cryogenicLiquidDetails(): ValtioCryogenicLiquidDetails;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProCryogenicLiquidDetailsRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProCryogenicLiquidDetailsRecord(input: any): ValtioStringHazProCryogenicLiquidDetailsRecord {
    return {
        __typename: 'StringHazProCryogenicLiquidDetailsRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProCryogenicLiquidDetailsRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
