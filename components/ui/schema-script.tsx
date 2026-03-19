interface SchemaScriptProps {
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function SchemaScript({ schema }: SchemaScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
