import { ValtioBooleanHazProModifiersAndAcknowledgementsRecord, ValtioLifeCycleModifiersAndAcknowledgementsEvent } from ".";
import { store } from "./../__generated__/store";
import { proxy } from "valtio";
import { YDocModifiersAndAcknowledgements } from "./../../yjs";
import { buildBooleanHazProModifiersAndAcknowledgementsRecord } from "./BooleanHazProModifiersAndAcknowledgementsRecord";

export interface ValtioModifiersAndAcknowledgements {
    uuid: string;
    /** Whether general packaging requirements have been acknowledged */
    generalPackagingRequirementsAcknowledgedRecord: ValtioBooleanHazProModifiersAndAcknowledgementsRecord;
    /** Whether informative statements have been acknowledged */
    informativeStatementsAcknowledgedRecord: ValtioBooleanHazProModifiersAndAcknowledgementsRecord;
    /** Whether workflow modifiers have been acknowledged */
    workflowModifiersAcknowledgedRecord: ValtioBooleanHazProModifiersAndAcknowledgementsRecord;
    /** Document node informative statements */
    documentNodeInformativeStatements: string[];
    /** Document node workflow modifiers */
    documentNodeWorkflowModifiers: string[];
    /** Lifecycle events tracking creation and archival */
    lifeCycleEvents: ValtioLifeCycleModifiersAndAcknowledgementsEvent[];
    __typename: string;
    path: string;
    _version: number;
    update: <K extends FieldName>(field: K, value: ModifiersAndAcknowledgementsFieldPayloadMap[K]) => Promise<string>;
}

export function buildLifeCycleModifiersAndAcknowledgementsEvents(events: any[]): ValtioLifeCycleModifiersAndAcknowledgementsEvent[] {
    return events.map((event) => {
        return {
            uuid: event.uuid,
            modifiersAndAcknowledgements__REF: event.modifiersAndAcknowledgements__REF,
            type: event.type,
            value: event.value === '' ? undefined : new Date(event.value),
            createdAt: new Date(event.createdAt),
            __typename: 'LifeCycleModifiersAndAcknowledgementsEvent',
        }
    });
}

export async function upsertModifiersAndAcknowledgementsValtioEntity(ydoc: YDocModifiersAndAcknowledgements) {
    if (!store.ModifiersAndAcknowledgementsMap[ydoc.uuid]) {
        store.ModifiersAndAcknowledgementsMap[ydoc.uuid] = proxy({} as ValtioModifiersAndAcknowledgements)
    }

    const modifiersAndAcknowledgements = store.ModifiersAndAcknowledgementsMap[ydoc.uuid]
    if (!modifiersAndAcknowledgements) {
        throw new Error('ModifiersAndAcknowledgements does not exist')
    }

    modifiersAndAcknowledgements.__typename = 'ModifiersAndAcknowledgements';
    modifiersAndAcknowledgements.path = ydoc.path;
    modifiersAndAcknowledgements._version = 0;
    modifiersAndAcknowledgements.uuid = ydoc.uuid;
    modifiersAndAcknowledgements.generalPackagingRequirementsAcknowledgedRecord = buildBooleanHazProModifiersAndAcknowledgementsRecord(ydoc.generalPackagingRequirementsAcknowledgedRecord);
    modifiersAndAcknowledgements.informativeStatementsAcknowledgedRecord = buildBooleanHazProModifiersAndAcknowledgementsRecord(ydoc.informativeStatementsAcknowledgedRecord);
    modifiersAndAcknowledgements.workflowModifiersAcknowledgedRecord = buildBooleanHazProModifiersAndAcknowledgementsRecord(ydoc.workflowModifiersAcknowledgedRecord);
    modifiersAndAcknowledgements.documentNodeInformativeStatements = ydoc.documentNodeInformativeStatements;
    modifiersAndAcknowledgements.documentNodeWorkflowModifiers = ydoc.documentNodeWorkflowModifiers;
    modifiersAndAcknowledgements.lifeCycleEvents = buildLifeCycleModifiersAndAcknowledgementsEvents(ydoc.lifeCycleEvents);
}
