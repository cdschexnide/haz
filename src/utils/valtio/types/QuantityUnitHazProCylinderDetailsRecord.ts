import { ValtioCylinderDetails, ValtioQuantityUnitHazProCylinderDetailsRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildQuantityUnitHazProCylinderDetailsRecordEvent } from "./QuantityUnitHazProCylinderDetailsRecordEvent";

export interface ValtioQuantityUnitHazProCylinderDetailsRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the CylinderDetails entity */
    cylinderDetails__REF: Reference<string>;
    /** Back reference to the CylinderDetails entity */
    get cylinderDetails(): ValtioCylinderDetails;
    /** Complete history of all changes to this field */
    eventHistory: ValtioQuantityUnitHazProCylinderDetailsRecordEvent[];
    /** Current QuantityUnit value */
    currentValue?: string;
    __typename: string;
}

export function buildQuantityUnitHazProCylinderDetailsRecord(input: any): ValtioQuantityUnitHazProCylinderDetailsRecord {
    return {
        __typename: 'QuantityUnitHazProCylinderDetailsRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildQuantityUnitHazProCylinderDetailsRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
