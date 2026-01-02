import { Reference } from "./Reference";

export interface YDocVehicleFuelTypeHazProEnginePreparationDataRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value?: VehicleFuelType;
    __typename: string;
}

export interface YDocVehicleFuelTypeHazProEnginePreparationDataRecord {
    uuid: string;
    enginePreparationData: Reference<string>;
    eventHistory: YDocVehicleFuelTypeHazProEnginePreparationDataRecordEvent[];
    currentValue?: VehicleFuelType;
    __typename: string;
}
