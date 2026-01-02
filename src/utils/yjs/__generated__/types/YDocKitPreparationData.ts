import { Reference } from "./Reference";
import { YDocStringHazProKitPreparationDataRecord } from "./YDocStringHazProKitPreparationDataRecord";

export interface YDocLifeCycleKitPreparationDataEvent {
    uuid: string;
    kitPreparationData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocKitPreparationData {
    uuid: string;
    kitTypeRecord: YDocStringHazProKitPreparationDataRecord;
    contents: string[];
    hazardousComponents: string[];
    packagingMethodRecord: YDocStringHazProKitPreparationDataRecord;
    specialInstructionsRecord?: YDocStringHazProKitPreparationDataRecord;
    lifeCycleEvents: YDocLifeCycleKitPreparationDataEvent[];
    path: string;
    __typename: string;
}
