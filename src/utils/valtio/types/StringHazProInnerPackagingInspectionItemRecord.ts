import { ValtioInnerPackagingInspectionItem, ValtioStringHazProInnerPackagingInspectionItemRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProInnerPackagingInspectionItemRecordEvent } from "./StringHazProInnerPackagingInspectionItemRecordEvent";

export interface ValtioStringHazProInnerPackagingInspectionItemRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InnerPackagingInspectionItem entity */
    innerPackagingInspectionItem__REF: Reference<string>;
    /** Back reference to the InnerPackagingInspectionItem entity */
    get innerPackagingInspectionItem(): ValtioInnerPackagingInspectionItem;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProInnerPackagingInspectionItemRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProInnerPackagingInspectionItemRecord(input: any): ValtioStringHazProInnerPackagingInspectionItemRecord {
    return {
        __typename: 'StringHazProInnerPackagingInspectionItemRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProInnerPackagingInspectionItemRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
