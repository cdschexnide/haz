import { Reference } from "./../../yjs";

export interface ValtioLifeCycleSDDGInspectionContextEvent {
    uuid: string;
    sddgInspectionContext__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}
