import { Reference } from "./../../yjs";

export interface ValtioLifeCycleKitPreparationDataEvent {
    uuid: string;
    kitPreparationData__REF: Reference<string>;
    type: string;
    value__REF?: Reference<string>;
    createdAt__REF: Reference<string>;
    __typename: string;
}
