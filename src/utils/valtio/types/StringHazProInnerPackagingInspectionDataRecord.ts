import { ValtioInnerPackagingInspectionData, ValtioStringHazProInnerPackagingInspectionDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProInnerPackagingInspectionDataRecordEvent } from "./StringHazProInnerPackagingInspectionDataRecordEvent";

export interface ValtioStringHazProInnerPackagingInspectionDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InnerPackagingInspectionData entity */
    innerPackagingInspectionData__REF: Reference<string>;
    /** Back reference to the InnerPackagingInspectionData entity */
    get innerPackagingInspectionData(): ValtioInnerPackagingInspectionData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProInnerPackagingInspectionDataRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProInnerPackagingInspectionDataRecord(input: any): ValtioStringHazProInnerPackagingInspectionDataRecord {
    return {
        __typename: 'StringHazProInnerPackagingInspectionDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProInnerPackagingInspectionDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
