import { Reference } from "./Reference";
import { YDocBooleanHazProInnerPackagingInspectionDataRecord } from "./YDocBooleanHazProInnerPackagingInspectionDataRecord";
import { YDocContainerTypeHazProInnerPackagingInspectionDataRecord } from "./YDocContainerTypeHazProInnerPackagingInspectionDataRecord";
import { YDocDateHazProInnerPackagingInspectionDataRecord } from "./YDocDateHazProInnerPackagingInspectionDataRecord";
import { YDocStringHazProInnerPackagingInspectionDataRecord } from "./YDocStringHazProInnerPackagingInspectionDataRecord";
import { YDocComplianceStatusHazProInnerPackagingInspectionDataRecord } from "./YDocComplianceStatusHazProInnerPackagingInspectionDataRecord";

export interface YDocLifeCycleInnerPackagingInspectionDataEvent {
    uuid: string;
    innerPackagingInspectionData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocInnerPackagingInspectionData {
    uuid: string;
    hasInnerPackagingRecord?: YDocBooleanHazProInnerPackagingInspectionDataRecord;
    containerTypeRecord?: YDocContainerTypeHazProInnerPackagingInspectionDataRecord;
    inspectionItems__REF: Reference<string[]>;
    openedAtRecord?: YDocDateHazProInnerPackagingInspectionDataRecord;
    inspectedAtRecord?: YDocDateHazProInnerPackagingInspectionDataRecord;
    closedAtRecord?: YDocDateHazProInnerPackagingInspectionDataRecord;
    newCertificationRequiredRecord: YDocBooleanHazProInnerPackagingInspectionDataRecord;
    reclosureMethodRecord: YDocStringHazProInnerPackagingInspectionDataRecord;
    inspectorNotesRecord: YDocStringHazProInnerPackagingInspectionDataRecord;
    overallStatusRecord?: YDocComplianceStatusHazProInnerPackagingInspectionDataRecord;
    lifeCycleEvents: YDocLifeCycleInnerPackagingInspectionDataEvent[];
    path: string;
    __typename: string;
}
