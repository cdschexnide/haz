import { ValtioFrustration, ValtioDateHazProFrustrationRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildDateHazProFrustrationRecordEvent } from "./DateHazProFrustrationRecordEvent";

export interface ValtioDateHazProFrustrationRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the FrustrationRecord entity */
    frustration__REF: Reference<string>;
    /** Back reference to the FrustrationRecord entity */
    get frustration(): ValtioFrustration;
    /** Complete history of all changes to this field */
    eventHistory: ValtioDateHazProFrustrationRecordEvent[];
    /** Current Date value */
    currentValue__REF?: Reference<string>;
    __typename: string;
}

export function buildDateHazProFrustrationRecord(input: any): ValtioDateHazProFrustrationRecord {
    return {
        __typename: 'DateHazProFrustrationRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildDateHazProFrustrationRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
