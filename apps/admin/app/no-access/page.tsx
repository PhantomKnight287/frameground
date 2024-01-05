import { Lock } from "lucide-react";
function NoAccess() {
  return (
    <div>
      <div className="flex flex-col gap-4">
        <div className="flex min-h-[calc(100dvh-112px)] w-full flex-col items-center justify-center space-y-2">
          <Lock className="h-8 w-8" />
          <span className="max-w-[40ch] text-center text-black/50 dark:text-white/50">
            You do not have permissions to access the page.
          </span>
        </div>
      </div>
    </div>
  );
}

export default NoAccess;
