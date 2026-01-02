import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioVehicleFuelTypeHazProEnginePreparationDataRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The VehicleFuelType value that was recorded */
    value?: string;
    __typename: string;
}

export function buildVehicleFuelTypeHazProEnginePreparationDataRecordEvent(input: any): ValtioVehicleFuelTypeHazProEnginePreparationDataRecordEvent {
    return {
        __typename: 'VehicleFuelTypeHazProEnginePreparationDataRecordEvent',
        uuid: input.uuid,



    }
}
