import { ValtioExplosiveContainer, ValtioStringHazProExplosiveContainerRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProExplosiveContainerRecordEvent } from "./StringHazProExplosiveContainerRecordEvent";

export interface ValtioStringHazProExplosiveContainerRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the ExplosiveContainer entity */
    explosiveContainer__REF: Reference<string>;
    /** Back reference to the ExplosiveContainer entity */
    get explosiveContainer(): ValtioExplosiveContainer;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProExplosiveContainerRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProExplosiveContainerRecord(input: any): ValtioStringHazProExplosiveContainerRecord {
    return {
        __typename: 'StringHazProExplosiveContainerRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProExplosiveContainerRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
