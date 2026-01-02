import { Reference } from "./Reference";
import { YDocInspectionStatusHazProInspectorShipmentRecord } from "./YDocInspectionStatusHazProInspectorShipmentRecord";
import { YDocDateHazProInspectorShipmentRecord } from "./YDocDateHazProInspectorShipmentRecord";
import { YDocStringHazProInspectorShipmentRecord } from "./YDocStringHazProInspectorShipmentRecord";
import { YDocInspectionItemStatusHazProInspectorShipmentRecord } from "./YDocInspectionItemStatusHazProInspectorShipmentRecord";
import { YDocIntHazProInspectorShipmentRecord } from "./YDocIntHazProInspectorShipmentRecord";

export interface YDocLifeCycleInspectorShipmentEvent {
    uuid: string;
    inspectorShipment__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocInspectorShipment {
    uuid: string;
    statusRecord: YDocInspectionStatusHazProInspectorShipmentRecord;
    inspectedAtRecord: YDocDateHazProInspectorShipmentRecord;
    inspectionContext__REF: Reference<string>;
    tcnRecord: YDocStringHazProInspectorShipmentRecord;
    unIdRecord: YDocStringHazProInspectorShipmentRecord;
    properShippingNameRecord: YDocStringHazProInspectorShipmentRecord;
    inspector__REF: Reference<string>;
    sddgStatusRecord: YDocInspectionItemStatusHazProInspectorShipmentRecord;
    packageStatusRecord: YDocInspectionItemStatusHazProInspectorShipmentRecord;
    totalFrustrationsRecord: YDocIntHazProInspectorShipmentRecord;
    sddgFrustrationsRecord: YDocIntHazProInspectorShipmentRecord;
    packageFrustrationsRecord: YDocIntHazProInspectorShipmentRecord;
    lifeCycleEvents: YDocLifeCycleInspectorShipmentEvent[];
    path: string;
    __typename: string;
}
