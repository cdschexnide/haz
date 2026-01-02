import { ValtioPackageFrustration, ValtioHazProPackageFrustrationCategoryRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildHazProPackageFrustrationCategoryRecordEvent } from "./HazProPackageFrustrationCategoryRecordEvent";

export interface ValtioHazProPackageFrustrationCategoryRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the PackageFrustration entity */
    packageFrustration__REF: Reference<string>;
    /** Back reference to the PackageFrustration entity */
    get packageFrustration(): ValtioPackageFrustration;
    /** Complete history of all changes to this field */
    eventHistory: ValtioHazProPackageFrustrationCategoryRecordEvent[];
    /** Current PackageFrustrationCategory value */
    currentValue?: string;
    __typename: string;
}

export function buildHazProPackageFrustrationCategoryRecord(input: any): ValtioHazProPackageFrustrationCategoryRecord {
    return {
        __typename: 'HazProPackageFrustrationCategoryRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildHazProPackageFrustrationCategoryRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
