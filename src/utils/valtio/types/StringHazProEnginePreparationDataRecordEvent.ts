import { ValtioUser } from ".";
import { Reference } from "./../../yjs";

export interface ValtioStringHazProEnginePreparationDataRecordEvent {
    /** Unique identifier for this event */
    uuid: string;
    /** When this change occurred */
    createdAt__REF: Reference<string>;
    /** User who made this change */
    createdBy__REF: Reference<string>;
    /** User who made this change */
    get createdBy(): ValtioUser;
    /** The String value that was recorded */
    value?: string;
    __typename: string;
}

export function buildStringHazProEnginePreparationDataRecordEvent(input: any): ValtioStringHazProEnginePreparationDataRecordEvent {
    return {
        __typename: 'StringHazProEnginePreparationDataRecordEvent',
        uuid: input.uuid,


        value: input.value !== "" ? input.value : undefined,
    }
}
