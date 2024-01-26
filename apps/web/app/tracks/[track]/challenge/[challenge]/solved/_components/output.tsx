"use client";
import { Markdown } from "@/components/markdown";

function JestOutputRenderer({ output }: { output: string }) {
  return (
    <div className="p-2">
      <Markdown
        // eslint-disable-next-line react/no-children-prop
        children={`\`\`\`bash\n${output}\n\`\`\``}
      />
    </div>
  );
}

export default JestOutputRenderer;
