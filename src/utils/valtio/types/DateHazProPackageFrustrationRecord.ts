import { ValtioPackageFrustration, ValtioDateHazProPackageFrustrationRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildDateHazProPackageFrustrationRecordEvent } from "./DateHazProPackageFrustrationRecordEvent";

export interface ValtioDateHazProPackageFrustrationRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the PackageFrustration entity */
    packageFrustration__REF: Reference<string>;
    /** Back reference to the PackageFrustration entity */
    get packageFrustration(): ValtioPackageFrustration;
    /** Complete history of all changes to this field */
    eventHistory: ValtioDateHazProPackageFrustrationRecordEvent[];
    /** Current Date value */
    currentValue__REF?: Reference<string>;
    __typename: string;
}

export function buildDateHazProPackageFrustrationRecord(input: any): ValtioDateHazProPackageFrustrationRecord {
    return {
        __typename: 'DateHazProPackageFrustrationRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildDateHazProPackageFrustrationRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
