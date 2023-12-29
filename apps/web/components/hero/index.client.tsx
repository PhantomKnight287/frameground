"use client";

import { cn } from "@/lib/utils";
import { TerminalIcon } from "lucide-react";
import {
  useState,
  useEffect,
  ReactElement,
  Fragment,
  HTMLAttributes,
} from "react";
export function CreateAppAnimation(): JSX.Element {
  const testCommand = "pnpm test";
  const tickTime = 100;
  const timeCommandEnter = testCommand.length;
  const timeCommandRun = timeCommandEnter + 3;
  const timeCommandEnd = timeCommandRun + 3;
  const timeWindowOpen = timeCommandEnd + 1;
  const timeEnd = timeWindowOpen + 1;

  const [tick, setTick] = useState(timeEnd);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev >= timeEnd ? prev : prev + 1));
    }, tickTime);

    return () => {
      clearInterval(timer);
    };
  }, [timeEnd]);

  const lines: ReactElement[] = [];

  lines.push(
    <span key="command_type">
      {testCommand.substring(0, tick)}
      {tick < timeCommandEnter && (
        <div className="inline-block h-3 w-1 animate-pulse bg-white" />
      )}
    </span>
  );

  if (tick >= timeCommandEnter) {
    lines.push(<span key="space"> </span>);
  }

  if (tick > timeCommandRun)
    lines.push(
      <Fragment key="command_response">
        <span className="font-bold">{"> webhero@1.0.0 test"} </span>
        <span>{"> jest"}</span>
        <br />
        {tick > timeCommandRun + 1 && (
          <>
            <div className="flex flex-row">
              <span className="font-bold bg-green-500 px-2 text-black">
                PASS
              </span>
              <span className="ml-2">./index.test.js</span>
            </div>
            <span className="ml-4 font-semibold text-white">useUser hook</span>
            <div className="flex flex-col w-full">
              <div className="flex flex-row">
                <span className="text-green-500 ml-6">✓</span>
                <span className="ml-2 text-gray-400">
                  Throws error when not wrapped in UserProvider (5ms)
                </span>
              </div>
              <div className="flex flex-row">
                <span className="text-green-500 ml-6">✓</span>
                <span className="ml-2 text-gray-400">
                  Returns user object when wrapped in UserProvider (5ms)
                </span>
              </div>
              <div className="flex flex-row">
                <span className="text-green-500 ml-6">✓</span>
                <span className="ml-2 text-gray-400">
                  Returns setter to update User (5ms)
                </span>
              </div>
            </div>
          </>
        )}
        {tick > timeCommandRun + 2 && (
          <>
            <br />
            <div className="flex flex-row">
              <span className="text-white font-semibold">Test Suites:</span>
              <span className="text-green-500 ml-2">1 passed</span>,
              <span className="ml-2">1 total</span>
            </div>
            <div className="flex flex-row">
              <span className="text-white font-semibold">Tests:</span>
              <span className="text-green-500 ml-12">3 passed</span>,
              <span className="ml-2">3 total</span>
            </div>
            <div className="flex flex-row">
              <span className="text-white font-semibold">Snapshots:</span>
              <span className="ml-5">0 total</span>
            </div>
            <div className="flex flex-row">
              <span className="text-white font-semibold">Time:</span>
              <span className="ml-[3.25rem]">1s, estimated 2s</span>
            </div>
            <span className="text-gray-400">Ran all test suites.</span>
          </>
        )}
      </Fragment>
    );

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        if (tick >= timeEnd) {
          setTick(0);
        }
      }}
    >
      {tick > timeWindowOpen && (
        <LaunchAppWindow className="absolute bottom-5 right-4 z-10 animate-in fade-in slide-in-from-top-10" />
      )}
      <pre className="overflow-hidden rounded-xl border text-xs">
        <div className="flex flex-row items-center gap-2 border-b px-4 py-2">
          <TerminalIcon className="h-4 w-4" />{" "}
          <span className="font-bold">Terminal</span>
          <div className="grow" />
          <div className="h-2 w-2 rounded-full bg-green-400" />
        </div>
        <div className="min-h-[300px] bg-gradient-to-b from-secondary [mask-image:linear-gradient(to_bottom,white,transparent)]">
          <code className="grid p-4">{lines}</code>
        </div>
      </pre>
    </div>
  );
}

function LaunchAppWindow(props: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden rounded-md border bg-background shadow-xl",
        props.className
      )}
    >
      <div className="relative flex h-6 flex-row items-center border-b bg-muted px-4 text-xs text-muted-foreground">
        <p className="absolute inset-x-0 text-center">WebHero</p>
      </div>
      <div className="p-4 text-sm">All tests passed!</div>
    </div>
  );
}
