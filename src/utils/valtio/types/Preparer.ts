import { ValtioStringHazProPreparerRecord, ValtioLifeCyclePreparerEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocPreparer } from "./../../yjs";
import { buildStringHazProPreparerRecord } from "./StringHazProPreparerRecord";

type PreparerFieldPayloadMap = {
    shipment: any;
    shipment: any;
    shipment: any;
    shipment: any;
};
type FieldName = keyof PreparerFieldPayloadMap;

export interface ValtioPreparer {
    uuid: string;
    /** Preparer name */
    nameRecord: ValtioStringHazProPreparerRecord;
    /** Preparer title */
    titleRecord: ValtioStringHazProPreparerRecord;
    /** Contact phone number */
    phoneRecord: ValtioStringHazProPreparerRecord;
    /** Contact email address */
    emailRecord: ValtioStringHazProPreparerRecord;
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCyclePreparerEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: PreparerFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCyclePreparerEvents(events: any[]): ValtioLifeCyclePreparerEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            preparer__REF: event.preparer__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCyclePreparerEvent',
        }
    });
}

export async function upsertPreparerValtioEntity(ydoc: YDocPreparer) {
    if (!store.PreparerMap[ydoc.uuid]) {
        store.PreparerMap[ydoc.uuid] = proxy({} as ValtioPreparer)
    }

    const preparer = store.PreparerMap[ydoc.uuid]
    if (!preparer) {
        throw new Error('Preparer does not exist')
    }

    preparer.__typename = 'Preparer';
    preparer.path = ydoc.path;
    preparer._version = 0;
    preparer.uuid = ydoc.uuid;
    preparer.nameRecord = buildStringHazProPreparerRecord(ydoc.nameRecord);
    preparer.titleRecord = buildStringHazProPreparerRecord(ydoc.titleRecord);
    preparer.phoneRecord = buildStringHazProPreparerRecord(ydoc.phoneRecord);
    preparer.emailRecord = buildStringHazProPreparerRecord(ydoc.emailRecord);
    preparer.lifeCycleEvents = buildLifeCyclePreparerEvents(ydoc.lifeCycleEvents);
}
