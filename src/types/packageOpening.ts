import type { ContainerType } from "./innerPackaging";

export type FiberboardClosureMethod =
  | "tape-only"
  | "adhesive-or-stapled"
  | null;

export interface PackageOpeningData {
  wasOpened: boolean | null;
  containerType: ContainerType;
  fiberboardClosureMethod: FiberboardClosureMethod;
  newCertificationRequired: boolean;
  openedAt: Date | null;
  closedAt: Date | null;
  inspectorNotes: string;
}

export const createInitialPackageOpeningData = (): PackageOpeningData => ({
  wasOpened: null,
  containerType: null,
  fiberboardClosureMethod: null,
  newCertificationRequired: false,
  openedAt: null,
  closedAt: null,
  inspectorNotes: "",
});
