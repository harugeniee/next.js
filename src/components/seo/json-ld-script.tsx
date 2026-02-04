/**
 * JSON-LD Script Component
 *
 * Injects JSON-LD structured data into the page for search engines.
 * This component renders a <script type="application/ld+json"> tag
 * with the provided structured data.
 *
 * @example
 * ```tsx
 * <JsonLdScript data={generateSeriesJsonLd(series, seriesId)} />
 * ```
 */

interface JsonLdScriptProps {
  /** The JSON-LD data object to inject */
  readonly data: Record<string, unknown>;
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
