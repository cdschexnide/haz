import { ValtioInnerPackagingInspectionItem, ValtioInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecordEvent } from "./InnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecordEvent";

export interface ValtioInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InnerPackagingInspectionItem entity */
    innerPackagingInspectionItem__REF: Reference<string>;
    /** Back reference to the InnerPackagingInspectionItem entity */
    get innerPackagingInspectionItem(): ValtioInnerPackagingInspectionItem;
    /** Complete history of all changes to this field */
    eventHistory: ValtioInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecordEvent[];
    /** Current InnerPackagingInspectionItemStatus value */
    currentValue?: string;
    __typename: string;
}

export function buildInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord(input: any): ValtioInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord {
    return {
        __typename: 'InnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildInnerPackagingInspectionItemStatusHazProInnerPackagingInspectionItemRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
