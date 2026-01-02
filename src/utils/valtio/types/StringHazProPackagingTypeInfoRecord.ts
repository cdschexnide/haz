import { ValtioPackagingTypeInfo, ValtioStringHazProPackagingTypeInfoRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProPackagingTypeInfoRecordEvent } from "./StringHazProPackagingTypeInfoRecordEvent";

export interface ValtioStringHazProPackagingTypeInfoRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the PackagingTypeInfo entity */
    packagingTypeInfo__REF: Reference<string>;
    /** Back reference to the PackagingTypeInfo entity */
    get packagingTypeInfo(): ValtioPackagingTypeInfo;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProPackagingTypeInfoRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProPackagingTypeInfoRecord(input: any): ValtioStringHazProPackagingTypeInfoRecord {
    return {
        __typename: 'StringHazProPackagingTypeInfoRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProPackagingTypeInfoRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
