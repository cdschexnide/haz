import { Reference } from "./Reference";

export interface YDocFloatHazProInspectorMagnetizedMaterialDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocFloatHazProInspectorMagnetizedMaterialDataRecord {
    uuid: string;
    inspectorMagnetizedMaterialData: Reference<string>;
    eventHistory: YDocFloatHazProInspectorMagnetizedMaterialDataRecordEvent[];
    currentValue?: number;
    __typename: string;
}
