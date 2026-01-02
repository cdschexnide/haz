import { Reference } from "./../../yjs";

export interface ValtioLifeCyclePackagePopMarkingEvent {
    uuid: string;
    packagePopMarking__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}
