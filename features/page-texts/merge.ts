type Messages = Record<string, unknown>;

/**
 * Lay dashboard text overrides over the bundled messages. Only replaces
 * existing string entries with non-empty strings, so a bad or stale override
 * can never add keys or break a message's shape.
 *
 * @example
 * applyTextOverrides({ Cta: { title: "A" } }, { Cta: { title: "B" } }) // { Cta: { title: "B" } }
 */
export function applyTextOverrides(base: Messages, overrides: unknown): Messages {
  if (!overrides || typeof overrides !== "object") return base;

  const result: Messages = { ...base };
  for (const [key, value] of Object.entries(overrides as Messages)) {
    const current = base[key];
    if (typeof current === "string") {
      if (typeof value === "string" && value.trim() !== "") result[key] = value;
    } else if (current && typeof current === "object" && value && typeof value === "object") {
      result[key] = applyTextOverrides(current as Messages, value);
    }
  }
  return result;
}
