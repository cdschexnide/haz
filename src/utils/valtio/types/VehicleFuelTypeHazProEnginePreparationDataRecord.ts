import { ValtioEnginePreparationData, ValtioVehicleFuelTypeHazProEnginePreparationDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildVehicleFuelTypeHazProEnginePreparationDataRecordEvent } from "./VehicleFuelTypeHazProEnginePreparationDataRecordEvent";

export interface ValtioVehicleFuelTypeHazProEnginePreparationDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the EnginePreparationData entity */
    enginePreparationData__REF: Reference<string>;
    /** Back reference to the EnginePreparationData entity */
    get enginePreparationData(): ValtioEnginePreparationData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioVehicleFuelTypeHazProEnginePreparationDataRecordEvent[];
    /** Current VehicleFuelType value */
    currentValue?: string;
    __typename: string;
}

export function buildVehicleFuelTypeHazProEnginePreparationDataRecord(input: any): ValtioVehicleFuelTypeHazProEnginePreparationDataRecord {
    return {
        __typename: 'VehicleFuelTypeHazProEnginePreparationDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildVehicleFuelTypeHazProEnginePreparationDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
