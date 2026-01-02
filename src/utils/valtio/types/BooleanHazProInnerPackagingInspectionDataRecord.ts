import { ValtioInnerPackagingInspectionData, ValtioBooleanHazProInnerPackagingInspectionDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildBooleanHazProInnerPackagingInspectionDataRecordEvent } from "./BooleanHazProInnerPackagingInspectionDataRecordEvent";

export interface ValtioBooleanHazProInnerPackagingInspectionDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InnerPackagingInspectionData entity */
    innerPackagingInspectionData__REF: Reference<string>;
    /** Back reference to the InnerPackagingInspectionData entity */
    get innerPackagingInspectionData(): ValtioInnerPackagingInspectionData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioBooleanHazProInnerPackagingInspectionDataRecordEvent[];
    /** Current Boolean value */
    currentValue?: boolean;
    __typename: string;
}

export function buildBooleanHazProInnerPackagingInspectionDataRecord(input: any): ValtioBooleanHazProInnerPackagingInspectionDataRecord {
    return {
        __typename: 'BooleanHazProInnerPackagingInspectionDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildBooleanHazProInnerPackagingInspectionDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
