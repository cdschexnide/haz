import { ValtioInspectorShipment, ValtioStringHazProInspectorShipmentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProInspectorShipmentRecordEvent } from "./StringHazProInspectorShipmentRecordEvent";

export interface ValtioStringHazProInspectorShipmentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InspectorShipment entity */
    inspectorShipment__REF: Reference<string>;
    /** Back reference to the InspectorShipment entity */
    get inspectorShipment(): ValtioInspectorShipment;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProInspectorShipmentRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProInspectorShipmentRecord(input: any): ValtioStringHazProInspectorShipmentRecord {
    return {
        __typename: 'StringHazProInspectorShipmentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProInspectorShipmentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
