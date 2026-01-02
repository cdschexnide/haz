import { ValtioInnerPackagingInspectionData, ValtioComplianceStatusHazProInnerPackagingInspectionDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildComplianceStatusHazProInnerPackagingInspectionDataRecordEvent } from "./ComplianceStatusHazProInnerPackagingInspectionDataRecordEvent";

export interface ValtioComplianceStatusHazProInnerPackagingInspectionDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InnerPackagingInspectionData entity */
    innerPackagingInspectionData__REF: Reference<string>;
    /** Back reference to the InnerPackagingInspectionData entity */
    get innerPackagingInspectionData(): ValtioInnerPackagingInspectionData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioComplianceStatusHazProInnerPackagingInspectionDataRecordEvent[];
    /** Current ComplianceStatus value */
    currentValue?: string;
    __typename: string;
}

export function buildComplianceStatusHazProInnerPackagingInspectionDataRecord(input: any): ValtioComplianceStatusHazProInnerPackagingInspectionDataRecord {
    return {
        __typename: 'ComplianceStatusHazProInnerPackagingInspectionDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildComplianceStatusHazProInnerPackagingInspectionDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
