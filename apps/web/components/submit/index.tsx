import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

export function SubmitButton({ label }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      className="mt-4"
      type="submit"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Submitting..." : label || "Submit"}
    </Button>
  );
}
