export interface Reference<T extends string | string[]> {
    __typename: string;
    resolvable: boolean;
    uuid: T;
}
