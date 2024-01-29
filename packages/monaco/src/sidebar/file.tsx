import { useMemo } from "react";
import { useEditorFileState } from "../state";
import { cn } from "../utils";
import { Icons } from "../icons";

export default function File({
  name,
  path,
  onClickFile,
  className,
  editable,
}: {
  name: string;
  path: string;
  onClickFile?: (path: string) => void;
  className?: string;
  editable?: boolean;
}) {
  const { setActiveFile, activeFile } = useEditorFileState();
  const handleClick = () => {
    onClickFile?.(path);
    setActiveFile({
      name,
      path,
      type: "file",
      editable,
    });
  };

  const fileExtension = useMemo(() => {
    const split = name.split(".");
    return `.${split[split.length - 1]}`.toLowerCase();
  }, [name]);
  return (
    <button
      className={cn(
        "pl-4 cursor-pointer flex flex-row items-center gap-2",
        className
      )}
      onClick={handleClick}
      data-active={activeFile?.path === path}
    >
      {Icons[fileExtension as keyof typeof Icons] || null}
      {name}
    </button>
  );
}
