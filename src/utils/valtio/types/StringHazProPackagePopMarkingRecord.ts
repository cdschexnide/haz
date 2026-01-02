import { ValtioPackagePopMarking, ValtioStringHazProPackagePopMarkingRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildStringHazProPackagePopMarkingRecordEvent } from "./StringHazProPackagePopMarkingRecordEvent";

export interface ValtioStringHazProPackagePopMarkingRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the PackagePopMarking entity */
    packagePopMarking__REF: Reference<string>;
    /** Back reference to the PackagePopMarking entity */
    get packagePopMarking(): ValtioPackagePopMarking;
    /** Complete history of all changes to this field */
    eventHistory: ValtioStringHazProPackagePopMarkingRecordEvent[];
    /** Current String value */
    currentValue?: string;
    __typename: string;
}

export function buildStringHazProPackagePopMarkingRecord(input: any): ValtioStringHazProPackagePopMarkingRecord {
    return {
        __typename: 'StringHazProPackagePopMarkingRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildStringHazProPackagePopMarkingRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
