import { Reference } from "./Reference";

export interface YDocDateHazProInspectorShipmentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: Reference<string>;
    __typename: string;
}

export interface YDocDateHazProInspectorShipmentRecord {
    uuid: string;
    inspectorShipment: Reference<string>;
    eventHistory: YDocDateHazProInspectorShipmentRecordEvent[];
    currentValue?: Reference<string>;
    __typename: string;
}
