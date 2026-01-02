import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioFloatHazProMassValueRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The Float value that was recorded */
    value: number;
    __typename: string;
}

export function buildFloatHazProMassValueRecordEvent(input: any): ValtioFloatHazProMassValueRecordEvent {
    return {
        __typename: 'FloatHazProMassValueRecordEvent',
        uuid: input.uuid,



    }
}
