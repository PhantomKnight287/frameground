import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@repo/utils";

export function SubmitButton({ label,className }: { label?: string,className?:string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn("mt-4",className)}
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Submitting..." : label || "Submit"}
    </Button>
  );
}
