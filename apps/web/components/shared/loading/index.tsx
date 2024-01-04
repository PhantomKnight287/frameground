import { Loader2 } from "lucide-react";

export default function LoadingIndicator() {
  return (
    <div className="flex w-screen h-screen">
      <div className="container flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6" />;
      </div>
    </div>
  );
}
