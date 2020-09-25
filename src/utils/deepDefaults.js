export default function deepDefaults(source, defaultValues) {
  if (!source) {
    return defaultValues || {};
  }
  const result = {};
  for (const [key, value] of Object.entries(source)) {
    const defaultValue = defaultValues?.[key];
    if (
      typeof value === "object" &&
      value !== null &&
      typeof defaultValue === "object" &&
      defaultValue !== null
    ) {
      result[key] = deepDefaults(value, defaultValue);
    } else {
      result[key] = value ?? defaultValue;
    }
  }
  return { ...defaultValues, ...result };
}
