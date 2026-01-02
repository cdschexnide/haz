import { ValtioInspectorShipment, ValtioInspectionItemStatusHazProInspectorShipmentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildInspectionItemStatusHazProInspectorShipmentRecordEvent } from "./InspectionItemStatusHazProInspectorShipmentRecordEvent";

export interface ValtioInspectionItemStatusHazProInspectorShipmentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InspectorShipment entity */
    inspectorShipment__REF: Reference<string>;
    /** Back reference to the InspectorShipment entity */
    get inspectorShipment(): ValtioInspectorShipment;
    /** Complete history of all changes to this field */
    eventHistory: ValtioInspectionItemStatusHazProInspectorShipmentRecordEvent[];
    /** Current InspectionItemStatus value */
    currentValue?: string;
    __typename: string;
}

export function buildInspectionItemStatusHazProInspectorShipmentRecord(input: any): ValtioInspectionItemStatusHazProInspectorShipmentRecord {
    return {
        __typename: 'InspectionItemStatusHazProInspectorShipmentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildInspectionItemStatusHazProInspectorShipmentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
