import { Reference } from "./Reference";
import { YDocBooleanHazProModifiersAndAcknowledgementsRecord } from "./YDocBooleanHazProModifiersAndAcknowledgementsRecord";

export interface YDocLifeCycleModifiersAndAcknowledgementsEvent {
    uuid: string;
    modifiersAndAcknowledgements__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}

export interface YDocModifiersAndAcknowledgements {
    uuid: string;
    generalPackagingRequirementsAcknowledgedRecord: YDocBooleanHazProModifiersAndAcknowledgementsRecord;
    informativeStatementsAcknowledgedRecord: YDocBooleanHazProModifiersAndAcknowledgementsRecord;
    workflowModifiersAcknowledgedRecord: YDocBooleanHazProModifiersAndAcknowledgementsRecord;
    documentNodeInformativeStatements: string[];
    documentNodeWorkflowModifiers: string[];
    lifeCycleEvents: YDocLifeCycleModifiersAndAcknowledgementsEvent[];
    path: string;
    __typename: string;
}
