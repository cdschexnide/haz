import { ValtioInnerPackagingInspectionData, ValtioContainerTypeHazProInnerPackagingInspectionDataRecordEvent } from ".";
import { Reference } from "./../../yjs";
import { buildContainerTypeHazProInnerPackagingInspectionDataRecordEvent } from "./ContainerTypeHazProInnerPackagingInspectionDataRecordEvent";

export interface ValtioContainerTypeHazProInnerPackagingInspectionDataRecord {
    /** Unique identifier for this record */
    uuid: string;
    /** Back reference to the InnerPackagingInspectionData entity */
    innerPackagingInspectionData__REF: Reference<string>;
    /** Back reference to the InnerPackagingInspectionData entity */
    get innerPackagingInspectionData(): ValtioInnerPackagingInspectionData;
    /** Complete history of all changes to this field */
    eventHistory: ValtioContainerTypeHazProInnerPackagingInspectionDataRecordEvent[];
    /** Current ContainerType value */
    currentValue?: string;
    __typename: string;
}

export function buildContainerTypeHazProInnerPackagingInspectionDataRecord(input: any): ValtioContainerTypeHazProInnerPackagingInspectionDataRecord {
    return {
        __typename: 'ContainerTypeHazProInnerPackagingInspectionDataRecord',
        uuid: input.uuid,

        eventHistory: input.eventHistory.map((event: any) => buildContainerTypeHazProInnerPackagingInspectionDataRecordEvent(event)),
        get currentValue() {
            return this.eventHistory.slice(-1)?.[0]?.value;
        }

    }
}
