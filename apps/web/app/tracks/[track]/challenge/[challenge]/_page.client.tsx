"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MonacoEditor from "@repo/monaco";
import MonacoSidebar from "@repo/monaco/sidebar";
import {
  ChallengeFilesStructure,
  FrameGroundChallengeExport,
} from "@repo/challenges/src";
import { cn } from "@repo/utils";
import { Challenge, Upvote } from "@repo/db/types";
import { useEditorFileState } from "@repo/monaco/state";
import { getActiveFileContent, getNestedPath } from "@repo/monaco/utils";
import ChallengeTabs from "./page.client";
import { User } from "next-auth/types";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTerminal } from "@repo/terminal";
import {
  createWebContainerInstance,
  FileSystemTree,
  WebContainerInstance,
} from "@repo/containers";
import { FitAddon } from "xterm-addon-fit";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

let timeout: NodeJS.Timeout;

const fitAddon = new FitAddon();

export default function Editor({
  challenge,
  params,
  queryParams,
  fileSystem,
}: {
  challenge: Challenge & {
    authors: User[];
    upvotes: Upvote[];
    _count: { upvotes: number };
  };
  queryParams?: Record<string, string>;
  params: Record<"track" | "challenge", string>;
  fileSystem?: FileSystemTree;
}) {
  const [_, startTransition] = useTransition();
  const { replace } = useRouter();
  const { activeFile, setActiveFile } = useEditorFileState();

  const [files, setFiles] = useState([
    {
      name: "Challenge.md",
      content: ``,
      type: "file",
      editable: false,
    },
    ...(challenge.initialFiles as unknown as FrameGroundChallengeExport["files"]),
    {
      name: "test",
      content: [
        {
          name: "test.md",
          content: "test",
          type: "file",
        },
        {
          name: "index.spec.ts",
          content: challenge.tests,
          type: "file",
          editable: false,
        },
      ],
      type: "folder",
    },
  ]);
  const [Terminal, terminalRef] = useTerminal({
    options: {
      cursorBlink: false,
      convertEol: true,
      disableStdin: false,
      ...(challenge.terminalConfig as any),
    },
    addons: [fitAddon],
  });
  const [iframeUrl, setIFrameUrl] = useState("/loading.html");
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const rendered = useRef(false);
  const containerRef = useRef<WebContainerInstance | undefined>(undefined);
  async function run() {
    console.log(rendered.current);
    if (rendered.current) return;
    rendered.current = true;
    const _container = await createWebContainerInstance();
    containerRef.current = _container;
    _container.on("error", console.error);
    if (fileSystem) _container.mount(fileSystem);
    fitAddon.fit();
    const shellProcess = await _container.spawn("jsh", {
      //@ts-expect-error
      terminal: {
        cols: terminalRef?.cols,
        rows: terminalRef?.rows,
      },
    });

    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminalRef!.write(data);
        },
      })
    );
    const input = shellProcess.input.getWriter();
    terminalRef?.onData((data) => {
      console.log(data);
      input.write(data);
    });
  }
  useEffect(() => {
    if (terminalRef) run();
    return () => {
      containerRef?.current?.teardown();
    };
  }, [terminalRef]);

  useEffect(() => {
    if (queryParams?.activeFile && queryParams?.activeFile !== "0") {
      setActiveFile({
        path: queryParams?.activeFile,
        name: queryParams?.activeFile,
        type: "file",
      });
    } else {
      setActiveFile({ path: "0", name: "Challenge.md", type: "file" });
    }
  }, []);
  function handleInput(value: string) {
    localStorage.setItem(`${challenge.id}_${activeFile?.path}`, value);
    console.log(getNestedPath(files, activeFile?.path as string));
  }
  const debouncedHandleInput = (val: string) => {
    if (saved === true) setSaved(false);
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      handleInput(val);
      setSaved(true);
    }, 1000);
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        minSize={10}
        defaultSize={10}
        className={cn(
          "flex flex-col h-full border-r border-l border-background bg-border rounded-md overflow-scroll custom-scrollable-element max-h-screen"
        )}
      >
        <div className="uppercase font-bold flex flex-row items-center justify-between text-sm p-2 border-b-[12px] border-background line-clamp-1">
          <span className="line-clamp-1 overflow-hidden">
            {challenge.label}
          </span>

          <div className="flex flex-row gap-2">
            <Button
              variant={"ghost"}
              className="p-1 hover:bg-background"
              onClick={() => {
                // containerRef?.current?.fs?.
              }}
            >
              <RotateCcw size={15} />
            </Button>
          </div>
        </div>
        <MonacoSidebar
          data={files as any}
          fileClassName="p-2 py-1 text-sm w-full text-left hover:bg-gray-600"
          folderClassName="p-2 py-1 flex flex-row items-center w-full text-left hover:bg-gray-700"
          folderOpenIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#2196F3"
              viewBox="0 0 16 16"
              width="1em"
              height="1em"
              className="flex-shrink-0 h-[18px] w-[18px] mr-2"
            >
              <path d="M13.66 12.46H2.34v-7h11.32v7zm.1-8.54H8L6.56 2.48H2.24c-.8 0-1.44.64-1.44 1.44v8.64c0 .8.64 1.44 1.44 1.44h11.52c.8 0 1.44-.64 1.44-1.44v-7.2c0-.8-.65-1.44-1.44-1.44z"></path>
            </svg>
          }
          fileContainerClassName="data-[active=true]:bg-gray-600 hover:bg-gray-700 hover:text-white data-[active=false]:bg-border pl-4"
          folderCloseIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#2196F3"
              viewBox="0 0 16 16"
              width="1em"
              height="1em"
              className="flex-shrink-0 h-[18px] w-[18px] mr-2"
            >
              <path d="M6.56 2.48H2.24c-.8 0-1.44.64-1.44 1.44v8.64c0 .79.65 1.44 1.44 1.44h11.52c.79 0 1.44-.65 1.44-1.44v-7.2c0-.8-.65-1.44-1.44-1.44H8L6.56 2.48z"></path>
            </svg>
          }
          onClickFile={(file) => {
            const search = new URLSearchParams(window.location.search);
            if (!search.get("activeFile") && file === "0") return;
            else if (file === "0") {
              search.delete("activeFile");
            } else {
              search.set("activeFile", file);
            }
            startTransition(() => {
              replace(`${pathname}?${search.toString()}`, { scroll: false });
            });
          }}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        {activeFile?.path === "0" ? (
          <ChallengeTabs
            //@ts-expect-error
            challenge={challenge}
            params={params}
            queryParams={queryParams}
          />
        ) : (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel>
              <ResizablePanelGroup direction="vertical">
                <ResizablePanel className="relative">
                  <MonacoEditor
                    activeFile={"Challenge.md"}
                    value={
                      activeFile?.path
                        ? getActiveFileContent(files as any, activeFile?.path)
                        : ""
                    }
                    onChange={(value) => {
                      debouncedHandleInput(value || "");
                    }}
                    theme={"vs-dark"}
                    language="javascript"
                    options={{
                      fontSize: 16,
                      readOnly:
                        activeFile?.editable === undefined
                          ? false
                          : !activeFile?.editable,
                      wordWrap: "on",
                    }}
                  />
                  <div className="absolute bottom-0 bg-border px-4 py-2 w-full flex flex-row">
                    <span className={cn("text-sm text-muted-foreground ")}>
                      {saved === true ? "Saved Locally" : "Unsaved Changes"}
                    </span>
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel className="h-full">
                  <Terminal />
                </ResizablePanel>
              </ResizablePanelGroup>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="relative">
              <iframe src={iframeUrl} className="w-full h-full" />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
