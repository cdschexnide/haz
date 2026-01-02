import { ValtioCylinderDetails, ValtioStringHazProCylinderDetailsRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProCylinderDetailsRecordEvent } from "./StringHazProCylinderDetailsRecordEvent";

export interface ValtioStringHazProCylinderDetailsRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the CylinderDetails entity */
    cylinderDetails__REF: Reference<string>;
    /** Back reference to the CylinderDetails entity */
    get cylinderDetails(): ValtioCylinderDetails;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProCylinderDetailsRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProCylinderDetailsRecord(input: any): ValtioStringHazProCylinderDetailsRecord {
    return {
        __typename: 'StringHazProCylinderDetailsRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProCylinderDetailsRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
