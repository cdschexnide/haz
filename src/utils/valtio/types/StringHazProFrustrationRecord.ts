import { ValtioFrustration, ValtioStringHazProFrustrationRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProFrustrationRecordEvent } from "./StringHazProFrustrationRecordEvent";

export interface ValtioStringHazProFrustrationRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the Frustration entity */
    frustration__REF: Reference<string>;
    /** Back reference to the Frustration entity */
    get frustration(): ValtioFrustration;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProFrustrationRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProFrustrationRecord(input: any): ValtioStringHazProFrustrationRecord {
    return {
        __typename: 'StringHazProFrustrationRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProFrustrationRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
