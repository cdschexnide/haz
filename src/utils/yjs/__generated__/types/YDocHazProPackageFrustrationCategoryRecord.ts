import { Reference } from "./Reference";

export interface YDocHazProPackageFrustrationCategoryRecordEvent {
    uuid: string;
    createdAt: string;
    createdBy: Reference<string>;
    value: PackageFrustrationCategory;
    __typename: string;
}

export interface YDocHazProPackageFrustrationCategoryRecord {
    uuid: string;
    packageFrustration: Reference<string>;
    eventHistory: YDocHazProPackageFrustrationCategoryRecordEvent[];
    currentValue?: PackageFrustrationCategory;
    __typename: string;
}
