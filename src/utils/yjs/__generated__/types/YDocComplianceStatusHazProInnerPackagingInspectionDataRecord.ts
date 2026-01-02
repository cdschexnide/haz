import { Reference } from "./Reference";

export interface YDocComplianceStatusHazProInnerPackagingInspectionDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: ComplianceStatus;
    __typename: string;
}

export interface YDocComplianceStatusHazProInnerPackagingInspectionDataRecord {
    uuid: string;
    innerPackagingInspectionData: Reference<string>;
    eventHistory: YDocComplianceStatusHazProInnerPackagingInspectionDataRecordEvent[];
    currentValue?: ComplianceStatus;
    __typename: string;
}
