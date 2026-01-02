import { ValtioMassValue, ValtioFloatHazProMassValueRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildFloatHazProMassValueRecordEvent } from "./FloatHazProMassValueRecordEvent";

export interface ValtioFloatHazProMassValueRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the MassValue entity */
    massValue__REF: Reference<string>;
    /** Back reference to the MassValue entity */
    get massValue(): ValtioMassValue;
    /** Complete history of all changes to this field */
    eventHistory: ValtioFloatHazProMassValueRecordEvent[];
    /** Current Float value */
    currentValue?: number;
    __typename: string;
}

export function buildFloatHazProMassValueRecord(input: any): ValtioFloatHazProMassValueRecord {
    return {
        __typename: 'FloatHazProMassValueRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildFloatHazProMassValueRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
