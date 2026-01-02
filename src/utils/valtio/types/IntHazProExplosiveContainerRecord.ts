import { ValtioExplosiveContainer, ValtioIntHazProExplosiveContainerRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildIntHazProExplosiveContainerRecordEvent } from "./IntHazProExplosiveContainerRecordEvent";

export interface ValtioIntHazProExplosiveContainerRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the ExplosiveContainer entity */
    explosiveContainer__REF: Reference<string>;
    /** Back reference to the ExplosiveContainer entity */
    get explosiveContainer(): ValtioExplosiveContainer;
    /** Complete history of all changes to this field */
    eventHistory: ValtioIntHazProExplosiveContainerRecordEvent[];
    /** Current Int value */
    currentValue?: number;
    __typename: string;
}

export function buildIntHazProExplosiveContainerRecord(input: any): ValtioIntHazProExplosiveContainerRecord {
    return {
        __typename: 'IntHazProExplosiveContainerRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildIntHazProExplosiveContainerRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
