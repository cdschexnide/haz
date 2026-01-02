import { ValtioInspectorShipment, ValtioDateHazProInspectorShipmentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildDateHazProInspectorShipmentRecordEvent } from "./DateHazProInspectorShipmentRecordEvent";

export interface ValtioDateHazProInspectorShipmentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InspectorShipment entity */
    inspectorShipment__REF: Reference<string>;
    /** Back reference to the InspectorShipment entity */
    get inspectorShipment(): ValtioInspectorShipment;
    /** Complete history of all changes to this field */
    eventHistory: ValtioDateHazProInspectorShipmentRecordEvent[];
    /** Current Date value */
    currentValue__REF?: Reference<string>;
    __typename: string;
}

export function buildDateHazProInspectorShipmentRecord(input: any): ValtioDateHazProInspectorShipmentRecord {
    return {
        __typename: 'DateHazProInspectorShipmentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildDateHazProInspectorShipmentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
