import { ValtioPackaging, ValtioPackagingTypeHazProPackagingRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildPackagingTypeHazProPackagingRecordEvent } from "./PackagingTypeHazProPackagingRecordEvent";

export interface ValtioPackagingTypeHazProPackagingRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the Packaging entity */
    packaging__REF: Reference<string>;
    /** Back reference to the Packaging entity */
    get packaging(): ValtioPackaging;
    /** Complete history of all changes to this field */
    eventHistory: ValtioPackagingTypeHazProPackagingRecordEvent[];
    /** Current PackagingType value */
    currentValue?: string;
    __typename: string;
}

export function buildPackagingTypeHazProPackagingRecord(input: any): ValtioPackagingTypeHazProPackagingRecord {
    return {
        __typename: 'PackagingTypeHazProPackagingRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildPackagingTypeHazProPackagingRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
