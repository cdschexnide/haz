import { Reference } from "./Reference";
import { YDocStringHazProConsigneeAddressRecord } from "./YDocStringHazProConsigneeAddressRecord";

export interface YDocLifeCycleConsigneeAddressEvent {
    uuid: string;
    consigneeAddress__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocConsigneeAddress {
    uuid: string;
    nameRecord: YDocStringHazProConsigneeAddressRecord;
    streetRecord: YDocStringHazProConsigneeAddressRecord;
    cityRecord: YDocStringHazProConsigneeAddressRecord;
    stateRecord: YDocStringHazProConsigneeAddressRecord;
    zipRecord: YDocStringHazProConsigneeAddressRecord;
    countryRecord: YDocStringHazProConsigneeAddressRecord;
    lifeCycleEvents: YDocLifeCycleConsigneeAddressEvent[];
    path: string;
    __typename: string;
}
