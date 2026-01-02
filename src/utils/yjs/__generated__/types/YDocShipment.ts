import { Reference } from "./Reference";
import { YDocStringHazProShipmentRecord } from "./YDocStringHazProShipmentRecord";
import { YDocFloatHazProShipmentRecord } from "./YDocFloatHazProShipmentRecord";

export interface YDocLifeCycleShipmentEvent {
    uuid: string;
    shipment__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocShipment {
    uuid: string;
    poeOptionRecord: YDocStringHazProShipmentRecord;
    podOptionRecord: YDocStringHazProShipmentRecord;
    isChapter3Record?: YDocStringHazProShipmentRecord;
    tcnRecord: YDocStringHazProShipmentRecord;
    poeRecord: YDocStringHazProShipmentRecord;
    podRecord: YDocStringHazProShipmentRecord;
    shipmentTypeRecord?: YDocStringHazProShipmentRecord;
    inspector__REF: Reference<string>;
    selectedOuterPackagingRecord?: YDocStringHazProShipmentRecord;
    totalNetExplosiveWeightRecord?: YDocFloatHazProShipmentRecord;
    lifeCycleEvents: YDocLifeCycleShipmentEvent[];
    path: string;
    __typename: string;
}
