import { ValtioInspectorShipment, ValtioInspectionStatusHazProInspectorShipmentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildInspectionStatusHazProInspectorShipmentRecordEvent } from "./InspectionStatusHazProInspectorShipmentRecordEvent";

export interface ValtioInspectionStatusHazProInspectorShipmentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InspectorShipment entity */
    inspectorShipment__REF: Reference<string>;
    /** Back reference to the InspectorShipment entity */
    get inspectorShipment(): ValtioInspectorShipment;
    /** Complete history of all changes to this field */
    eventHistory: ValtioInspectionStatusHazProInspectorShipmentRecordEvent[];
    /** Current InspectionStatus value */
    currentValue?: string;
    __typename: string;
}

export function buildInspectionStatusHazProInspectorShipmentRecord(input: any): ValtioInspectionStatusHazProInspectorShipmentRecord {
    return {
        __typename: 'InspectionStatusHazProInspectorShipmentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildInspectionStatusHazProInspectorShipmentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
