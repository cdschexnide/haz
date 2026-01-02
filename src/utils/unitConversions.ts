export const convertVolume = (value: string, unit: "liters" | "gallons") => {
  const num = parseFloat(value);
  if (isNaN(num)) return { liters: 0, gallons: 0 };

  return unit === "liters"
    ? { liters: num, gallons: num / 3.78541 }
    : { liters: num * 3.78541, gallons: num };
};

export const convertUnits = (
  value: number,
  from: string,
  to: string
): number => {
  const conversions: Record<string, number> = {
    "kg->lbs": 2.20462,
    "lbs->kg": 0.453592,
    "liters->gallons": 0.264172,
    "gallons->liters": 3.78541,
  };
  const key = `${from}->${to}`;
  return value * (conversions[key] || 1);
};
