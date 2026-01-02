import { Reference } from "./Reference";
import { YDocStringHazProShipperAddressRecord } from "./YDocStringHazProShipperAddressRecord";

export interface YDocLifeCycleShipperAddressEvent {
    uuid: string;
    shipperAddress__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocShipperAddress {
    uuid: string;
    nameRecord: YDocStringHazProShipperAddressRecord;
    streetRecord: YDocStringHazProShipperAddressRecord;
    cityRecord: YDocStringHazProShipperAddressRecord;
    stateRecord: YDocStringHazProShipperAddressRecord;
    zipRecord: YDocStringHazProShipperAddressRecord;
    countryRecord: YDocStringHazProShipperAddressRecord;
    lifeCycleEvents: YDocLifeCycleShipperAddressEvent[];
    path: string;
    __typename: string;
}
