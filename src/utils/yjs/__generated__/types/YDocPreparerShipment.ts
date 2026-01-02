import { Reference } from "./Reference";
import { YDocStringHazProPreparerShipmentRecord } from "./YDocStringHazProPreparerShipmentRecord";
import { YDocDateHazProPreparerShipmentRecord } from "./YDocDateHazProPreparerShipmentRecord";

export interface YDocLifeCyclePreparerShipmentEvent {
    uuid: string;
    preparerShipment__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocPreparerShipment {
    uuid: string;
    statusRecord: YDocStringHazProPreparerShipmentRecord;
    savedAtRecord: YDocDateHazProPreparerShipmentRecord;
    hazProPreparerContext__REF: Reference<string>;
    lifeCycleEvents: YDocLifeCyclePreparerShipmentEvent[];
    path: string;
    __typename: string;
}
