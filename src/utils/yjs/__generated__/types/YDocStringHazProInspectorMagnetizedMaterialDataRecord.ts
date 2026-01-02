import { Reference } from "./Reference";

export interface YDocStringHazProInspectorMagnetizedMaterialDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProInspectorMagnetizedMaterialDataRecord {
    uuid: string;
    inspectorMagnetizedMaterialData: Reference<string>;
    eventHistory: YDocStringHazProInspectorMagnetizedMaterialDataRecordEvent[];
    currentValue?: string;
    __typename: string;
}
