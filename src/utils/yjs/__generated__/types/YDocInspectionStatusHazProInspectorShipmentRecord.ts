import { Reference } from "./Reference";

export interface YDocInspectionStatusHazProInspectorShipmentRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: InspectionStatus;
    __typename: string;
}

export interface YDocInspectionStatusHazProInspectorShipmentRecord {
    uuid: string;
    inspectorShipment: Reference<string>;
    eventHistory: YDocInspectionStatusHazProInspectorShipmentRecordEvent[];
    currentValue?: InspectionStatus;
    __typename: string;
}
