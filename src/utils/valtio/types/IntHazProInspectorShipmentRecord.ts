import { ValtioInspectorShipment, ValtioIntHazProInspectorShipmentRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildIntHazProInspectorShipmentRecordEvent } from "./IntHazProInspectorShipmentRecordEvent";

export interface ValtioIntHazProInspectorShipmentRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InspectorShipment entity */
    inspectorShipment__REF: Reference<string>;
    /** Back reference to the InspectorShipment entity */
    get inspectorShipment(): ValtioInspectorShipment;
    /** Complete history of all changes to this field */
    eventHistory: ValtioIntHazProInspectorShipmentRecordEvent[];
    /** Current Int value */
    currentValue?: number;
    __typename: string;
}

export function buildIntHazProInspectorShipmentRecord(input: any): ValtioIntHazProInspectorShipmentRecord {
    return {
        __typename: 'IntHazProInspectorShipmentRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildIntHazProInspectorShipmentRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
