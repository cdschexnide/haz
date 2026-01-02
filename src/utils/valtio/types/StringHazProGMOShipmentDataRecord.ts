import { ValtioGMOShipmentData, ValtioStringHazProGMOShipmentDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProGMOShipmentDataRecordEvent } from "./StringHazProGMOShipmentDataRecordEvent";

export interface ValtioStringHazProGMOShipmentDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the GMOShipmentData entity */
    gmoShipmentData__REF: Reference<string>;
    /** Back reference to the GMOShipmentData entity */
    get gmoShipmentData(): ValtioGMOShipmentData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProGMOShipmentDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProGMOShipmentDataRecord(input: any): ValtioStringHazProGMOShipmentDataRecord {
    return {
        __typename: 'StringHazProGMOShipmentDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProGMOShipmentDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
