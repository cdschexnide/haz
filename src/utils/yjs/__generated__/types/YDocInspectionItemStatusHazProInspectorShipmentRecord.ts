import { Reference } from "./Reference";

export interface YDocInspectionItemStatusHazProInspectorShipmentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: InspectionItemStatus;
    __typename: string;
}

export interface YDocInspectionItemStatusHazProInspectorShipmentRecord {
    uuid: string;
    inspectorShipment: Reference<string>;
    eventHistory: YDocInspectionItemStatusHazProInspectorShipmentRecordEvent[];
    currentValue?: InspectionItemStatus;
    __typename: string;
}
