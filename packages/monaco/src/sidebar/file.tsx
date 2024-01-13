import { useEditorFileState } from "../state";
import { cn } from "../utils";

export default function File({
  name,
  path,
  onClickFile,
  className,
}: {
  name: string;
  path: string;
  onClickFile?: (path: string) => void;
  className?: string;
}) {
  const { setActiveFile, activeFile } = useEditorFileState();
  const handleClick = () => {
    onClickFile?.(path);
    setActiveFile({
      name,
      path,
      type: "file",
    });
  };
  return (
    <button
      className={cn("pl-4 cursor-pointer", className)}
      onClick={handleClick}
      data-active={activeFile?.path === path}
    >
      {name}
    </button>
  );
}
