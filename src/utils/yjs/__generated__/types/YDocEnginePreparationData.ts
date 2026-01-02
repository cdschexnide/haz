import { Reference } from "./Reference";
import { YDocStringHazProEnginePreparationDataRecord } from "./YDocStringHazProEnginePreparationDataRecord";
import { YDocVehicleFuelTypeHazProEnginePreparationDataRecord } from "./YDocVehicleFuelTypeHazProEnginePreparationDataRecord";
import { YDocFloatHazProEnginePreparationDataRecord } from "./YDocFloatHazProEnginePreparationDataRecord";
import { YDocBooleanHazProEnginePreparationDataRecord } from "./YDocBooleanHazProEnginePreparationDataRecord";

export interface YDocLifeCycleEnginePreparationDataEvent {
    uuid: string;
    enginePreparationData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocEnginePreparationData {
    uuid: string;
    engineType: YDocStringHazProEnginePreparationDataRecord;
    fuelType: YDocVehicleFuelTypeHazProEnginePreparationDataRecord;
    displacement?: YDocFloatHazProEnginePreparationDataRecord;
    isDrained: YDocBooleanHazProEnginePreparationDataRecord;
    drainageMethod?: YDocStringHazProEnginePreparationDataRecord;
    residualFuel?: YDocStringHazProEnginePreparationDataRecord;
    specialPrecautions?: YDocStringHazProEnginePreparationDataRecord;
    lifeCycleEvents: YDocLifeCycleEnginePreparationDataEvent[];
    path: string;
    __typename: string;
}
