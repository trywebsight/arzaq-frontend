/**
 * Renders one or more Schema.org objects as a JSON-LD `<script>` tag.
 *
 * @param data - A single object, an array, or `null`/`undefined` (no-op).
 * @example
 * <JsonLd data={realEstateAgentJsonLd({ name, description, address })} />
 */
export function JsonLd({
  data,
}: {
  data:
    | Record<string, unknown>
    | Array<Record<string, unknown> | null>
    | null
    | undefined;
}) {
  if (data == null) return null;

  const payload = Array.isArray(data)
    ? data.filter((item): item is Record<string, unknown> => item != null)
    : data;

  if (Array.isArray(payload) && payload.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}
