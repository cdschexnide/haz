import { ValtioInnerPackagingInspectionData, ValtioDateHazProInnerPackagingInspectionDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildDateHazProInnerPackagingInspectionDataRecordEvent } from "./DateHazProInnerPackagingInspectionDataRecordEvent";

export interface ValtioDateHazProInnerPackagingInspectionDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InnerPackagingInspectionData entity */
    innerPackagingInspectionData__REF: Reference<string>;
    /** Back reference to the InnerPackagingInspectionData entity */
    get innerPackagingInspectionData(): ValtioInnerPackagingInspectionData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioDateHazProInnerPackagingInspectionDataRecordEvent[];
    /** Current Date value */
    currentValue__REF?: Reference<string>;
    __typename: string;
}

export function buildDateHazProInnerPackagingInspectionDataRecord(input: any): ValtioDateHazProInnerPackagingInspectionDataRecord {
    return {
        __typename: 'DateHazProInnerPackagingInspectionDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildDateHazProInnerPackagingInspectionDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
