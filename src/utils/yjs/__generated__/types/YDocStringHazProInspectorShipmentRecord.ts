import { Reference } from "./Reference";

export interface YDocStringHazProInspectorShipmentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: string;
    __typename: string;
}

export interface YDocStringHazProInspectorShipmentRecord {
    uuid: string;
    inspectorShipment: Reference<string>;
    eventHistory: YDocStringHazProInspectorShipmentRecordEvent[];
    currentValue?: string;
    __typename: string;
}
