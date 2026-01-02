import { ValtioPackageFrustration, ValtioStringHazProPackageFrustrationRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProPackageFrustrationRecordEvent } from "./StringHazProPackageFrustrationRecordEvent";

export interface ValtioStringHazProPackageFrustrationRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the PackageFrustration entity */
    packageFrustration__REF: Reference<string>;
    /** Back reference to the PackageFrustration entity */
    get packageFrustration(): ValtioPackageFrustration;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProPackageFrustrationRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProPackageFrustrationRecord(input: any): ValtioStringHazProPackageFrustrationRecord {
    return {
        __typename: 'StringHazProPackageFrustrationRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProPackageFrustrationRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
