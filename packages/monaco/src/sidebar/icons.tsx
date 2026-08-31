/** Chevron used as the folder's expand/collapse affordance. */
export function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={`size-3.5 shrink-0 transition-transform duration-150 ${
        open ? "rotate-90" : ""
      }`}
    >
      <path d="M6 3.5 10.5 8 6 12.5" />
    </svg>
  );
}

export function FolderIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="#2196F3"
      aria-hidden
      className="size-4 shrink-0"
    >
      {open ? (
        <path d="M13.66 12.46H2.34v-7h11.32v7zm.1-8.54H8L6.56 2.48H2.24c-.8 0-1.44.64-1.44 1.44v8.64c0 .8.64 1.44 1.44 1.44h11.52c.8 0 1.44-.64 1.44-1.44v-7.2c0-.8-.65-1.44-1.44-1.44z" />
      ) : (
        <path d="M6.56 2.48H2.24c-.8 0-1.44.64-1.44 1.44v8.64c0 .79.65 1.44 1.44 1.44h11.52c.79 0 1.44-.65 1.44-1.44v-7.2c0-.8-.65-1.44-1.44-1.44H8L6.56 2.48z" />
      )}
    </svg>
  );
}

/** Marks the files a challenge expects the user to edit. */
export function EditableDot() {
  return (
    <span
      title="You can edit this file"
      aria-label="Editable"
      className="ml-auto size-1.5 shrink-0 rounded-full bg-emerald-500"
    />
  );
}
