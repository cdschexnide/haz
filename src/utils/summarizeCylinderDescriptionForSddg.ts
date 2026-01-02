interface CylinderQuantity {
  kg: number;
  g: number;
}

interface CylinderWaterCapacity {
  L: number;
}

export interface Cylinder {
  cylinderType: string;
  waterCapacity: CylinderWaterCapacity;
  quantity: CylinderQuantity;
}

export const summarizeCylinderDescriptionForSddg = (
  cylinders: Cylinder[] | undefined
): string => {
  if (!Array.isArray(cylinders) || cylinders.length === 0) return "";

  type GroupKey = string;

  interface Group {
    type: string;
    mass: number;
    count: number;
  }

  const groups = new Map<GroupKey, Group>();

  cylinders.forEach(({ cylinderType, quantity }) => {
    const mass = quantity.kg;
    const key = `${cylinderType}|${mass}`;

    const existing = groups.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      groups.set(key, { type: cylinderType, mass, count: 1 });
    }
  });

  const segments = Array.from(groups.values()).map(
    ({ type, mass, count }) =>
      `${count} ${type} Cylinder${count === 1 ? "" : "s"} x ${mass} kg`
  );

  return segments.join(", ");
};
