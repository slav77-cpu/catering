export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Menu text comes from the database, so "<" is escaped to rule out breaking out of the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
