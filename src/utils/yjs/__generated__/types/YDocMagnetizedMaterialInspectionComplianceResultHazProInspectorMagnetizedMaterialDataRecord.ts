import { Reference } from "./Reference";

export interface YDocMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: MagnetizedMaterialInspectionComplianceResult;
    __typename: string;
}

export interface YDocMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecord {
    uuid: string;
    inspectorMagnetizedMaterialData: Reference<string>;
    eventHistory: YDocMagnetizedMaterialInspectionComplianceResultHazProInspectorMagnetizedMaterialDataRecordEvent[];
    currentValue?: MagnetizedMaterialInspectionComplianceResult;
    __typename: string;
}
