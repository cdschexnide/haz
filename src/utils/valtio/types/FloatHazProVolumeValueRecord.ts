import { ValtioVolumeValue, ValtioFloatHazProVolumeValueRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildFloatHazProVolumeValueRecordEvent } from "./FloatHazProVolumeValueRecordEvent";

export interface ValtioFloatHazProVolumeValueRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the VolumeValue entity */
    volumeValue__REF: Reference<string>;
    /** Back reference to the VolumeValue entity */
    get volumeValue(): ValtioVolumeValue;
    /** Complete history of all changes to this field */
    eventHistory: ValtioFloatHazProVolumeValueRecordEvent[];
    /** Current Float value */
    currentValue?: number;
    __typename: string;
}

export function buildFloatHazProVolumeValueRecord(input: any): ValtioFloatHazProVolumeValueRecord {
    return {
        __typename: 'FloatHazProVolumeValueRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildFloatHazProVolumeValueRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
