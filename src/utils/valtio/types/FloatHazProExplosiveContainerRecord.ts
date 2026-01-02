import { ValtioExplosiveContainer, ValtioFloatHazProExplosiveContainerRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildFloatHazProExplosiveContainerRecordEvent } from "./FloatHazProExplosiveContainerRecordEvent";

export interface ValtioFloatHazProExplosiveContainerRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the ExplosiveContainer entity */
    explosiveContainer__REF: Reference<string>;
    /** Back reference to the ExplosiveContainer entity */
    get explosiveContainer(): ValtioExplosiveContainer;
    /** Complete history of all changes to this field */
    eventHistory: ValtioFloatHazProExplosiveContainerRecordEvent[];
    /** Current Float value */
    currentValue?: number;
    __typename: string;
}

export function buildFloatHazProExplosiveContainerRecord(input: any): ValtioFloatHazProExplosiveContainerRecord {
    return {
        __typename: 'FloatHazProExplosiveContainerRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildFloatHazProExplosiveContainerRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
