import { Reference } from "./Reference";

export interface YDocIntHazProInspectorShipmentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: number;
    __typename: string;
}

export interface YDocIntHazProInspectorShipmentRecord {
    uuid: string;
    inspectorShipment: Reference<string>;
    eventHistory: YDocIntHazProInspectorShipmentRecordEvent[];
    currentValue?: number;
    __typename: string;
}
