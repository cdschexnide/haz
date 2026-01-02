import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioFloatHazProBatteryVehicleDataRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The Float value that was recorded */
    value?: number;
    __typename: string;
}

export function buildFloatHazProBatteryVehicleDataRecordEvent(input: any): ValtioFloatHazProBatteryVehicleDataRecordEvent {
    return {
        __typename: 'FloatHazProBatteryVehicleDataRecordEvent',
        uuid: input.uuid,



    }
}
