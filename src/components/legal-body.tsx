// Простой показ текста документа: заголовки «## », списки «- » и абзацы.
export function LegalBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/);
  return (
    <div className="flex flex-col gap-4 text-ink">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="mt-4 font-heading text-xl font-bold">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.split("\n").every((line) => line.startsWith("- "))) {
          return (
            <ul key={index} className="list-disc pl-6">
              {block.split("\n").map((line) => (
                <li key={line}>{line.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
