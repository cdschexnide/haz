import { Reference } from "./Reference";

export interface YDocMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: MagnetizedMaterialInspectionItemResult;
    __typename: string;
}

export interface YDocMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecord {
    uuid: string;
    inspectorMagnetizedMaterialData: Reference<string>;
    eventHistory: YDocMagnetizedMaterialInspectionItemResultHazProInspectorMagnetizedMaterialDataRecordEvent[];
    currentValue?: MagnetizedMaterialInspectionItemResult;
    __typename: string;
}
