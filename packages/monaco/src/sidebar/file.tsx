import { useMemo } from "react";
import { useEditorFileState } from "../state";
import { cn } from "../utils";
import { Icons } from "../icons";
import { EditableDot } from "./icons";
import { indentStyle, rowClassName } from "./tree";

export default function File({
  name,
  path,
  depth = 0,
  onClickFile,
  className,
  editable,
}: {
  name: string;
  path: string;
  depth?: number;
  onClickFile?: (path: string) => void;
  className?: string;
  editable?: boolean;
}) {
  const { setActiveFile, activeFile } = useEditorFileState();
  const isActive = activeFile?.path === path;

  const handleClick = () => {
    onClickFile?.(path);
    setActiveFile({ name, path, type: "file", editable });
  };

  const fileExtension = useMemo(() => {
    const split = name.split(".");
    return `.${split[split.length - 1]}`.toLowerCase();
  }, [name]);

  return (
    <button
      type="button"
      role="treeitem"
      aria-selected={isActive}
      aria-level={depth + 1}
      data-active={isActive}
      title={name}
      onClick={handleClick}
      style={indentStyle(depth)}
      className={cn(rowClassName, className)}
    >
      <span className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
        {Icons[fileExtension as keyof typeof Icons] || null}
      </span>
      <span className="truncate">{name}</span>
      {editable ? <EditableDot /> : null}
    </button>
  );
}
