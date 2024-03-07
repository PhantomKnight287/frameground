"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MonacoSidebar from "@repo/monaco/sidebar";
import { FrameGroundChallengeExport } from "@repo/challenges/src";
import { cn } from "@repo/utils";
import { Challenge, Upvote } from "@repo/db/types";
import { useEditorFileState } from "@repo/monaco/state";
import ChallengeTabs from "./page.client";
import { User } from "next-auth/types";
import {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTerminal } from "@repo/terminal";
import {
  createWebContainerInstance,
  FileSystemTree,
  WebContainerInstance,
  WebContainerProcess,
} from "@repo/containers";
import { FitAddon } from "xterm-addon-fit";
import { ExternalLink, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { generateFilePath, isFileEditable } from "./functions";
import EnrollInTrack from "./_components/enroll";
import { attemptChallenge, solveChallenge } from "./action";
import { signIn, useSession } from "next-auth/react";
import { languages } from "@/constants/languages";
import SplitEditor, {CodeEditor} from "@repo/monaco/exports"

let timeout: NodeJS.Timeout;

const fitAddon = new FitAddon();

export default function Editor({
  challenge,
  params,
  queryParams,
  fileSystem,
  files,
  CommentsSection,
  SolutionsSection,
}: {
  challenge: Challenge & {
    authors: User[];
    upvotes: Upvote[];
    _count: { upvotes: number };
    track: {
      users: { id: string }[];
      name: string;
    };
  };
  queryParams?: Record<string, string>;
  params: Record<"track" | "challenge", string>;
  fileSystem?: FileSystemTree;
  files: FrameGroundChallengeExport["files"];
  CommentsSection: ReactNode;
  SolutionsSection: ReactNode;
}) {
  const session = useSession();
  const [_, startTransition] = useTransition();
  const { replace } = useRouter();
  const { activeFile, setActiveFile } = useEditorFileState();

  const terminalOptions = useMemo(() => {
    const baseConfig = {
      cursorBlink: false,
      convertEol: true,
      disableStdin: false,
    };
    if (
      Object.keys((challenge?.terminalConfig as unknown as Object) || {}).length
    ) {
      return {
        ...baseConfig,
        ...(challenge.terminalConfig as any),
      };
    }
    return baseConfig;
  }, []);

  const [Terminal, terminalRef] = useTerminal({
    options: terminalOptions,
    addons: [fitAddon],
  });
  const [iframeUrl, setIFrameUrl] = useState("/loading.html");
  const pathname = usePathname();
  const [saved, setSaved] = useState(false);
  const rendered = useRef(false);
  const [content, setContent] = useState("");
  const containerRef = useRef<WebContainerInstance | undefined>(undefined);
  const shellProcessRef = useRef<WebContainerProcess | undefined>(undefined);
  async function readFile(path: string) {
    const fileExtension = path.split(".").pop();
    //@ts-expect-error
    const language = languages[fileExtension || ""] || "javascript";
    setLanguage(language);
    const file = await containerRef?.current?.fs?.readFile(path, "utf-8");
    if (file) setContent(file);
    return file;
  }
  async function run() {
    if (rendered.current) return;
    rendered.current = true;
    fitAddon.fit();
    const _container = await createWebContainerInstance();
    containerRef.current = _container;
    _container.on("error", console.error);
    _container.on("server-ready", (_, url) => {
      setIFrameUrl(url);
    });
    if (fileSystem)
      _container.mount({
        ...fileSystem,
        "index.spec.tsx": { file: { contents: challenge.tests } },
        "run-tests.js": {
          file: {
            contents: `import { execSync } from "child_process";
const command = ${
              challenge.testRunner === "jest"
                ? '"pnpm jest --no-colors --bail 2> jestOutput.txt"'
                : '"pnpm vitest run --bail 1 --no-color > jestOutput.txt 2> jestOutput.txt"'
            } ;
(async () => {
  try {
    execSync(command, { stdio: "pipe", encoding: "utf-8" });
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
})();

`,
          },
        },
      });
    if (challenge.commands?.length) {
      for (const command of challenge.commands) {
        const binary = command.split(" ")[0];
        const commandArguments = command.split(" ").slice(1);
        const log = await _container.spawn(binary, commandArguments);
        log.output.pipeTo(
          new WritableStream({
            write(data) {
              terminalRef?.write(data);
            },
          })
        );
        const code = await log.exit;
      }
    }
    readFile(
      generateFilePath(files, queryParams?.activeFile || "0") ||
        "./package.json"
    ).then();
    const shellProcess = await _container.spawn("jsh", {
      //@ts-expect-error
      terminal: {
        cols: terminalRef?.cols,
        rows: terminalRef?.rows,
      },
    });
    shellProcessRef.current = shellProcess;

    shellProcess.output.pipeTo(
      new WritableStream({
        write(data) {
          terminalRef!.write(data);
        },
      })
    );
    const input = shellProcess.input.getWriter();
    window.addEventListener("resize", () => {
      fitAddon.fit();
      //@ts-expect-error
      shellProcess.resize({ cols: terminalRef?.cols, rows: terminalRef?.rows });
    });
    terminalRef?.onData((data) => {
      input.write(data);
    });
  }
  const [language, setLanguage] = useState("javascript");
  const [testsPassed, setTestsPassed] = useState(false);
  const [enrollModalOpened, setEnrollModalOpened] = useState(false);
  const [jestOutput, setJestOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (terminalRef && challenge.playgroundNeeded && session?.data?.user?.id)
      run();
    return () => {
      containerRef?.current?.teardown();
    };
  }, [terminalRef, challenge.playgroundNeeded, session?.data?.user?.id]);

  useEffect(() => {
    if (queryParams?.activeFile && queryParams?.activeFile !== "0") {
      setActiveFile({
        path: queryParams?.activeFile,
        name: queryParams?.activeFile,
        type: "file",
        editable: isFileEditable(files, queryParams?.activeFile),
      });
    } else {
      setActiveFile({ path: "0", name: "Challenge.md", type: "file" });
    }
  }, []);
  const [hiddenIframe, setHiddenIframe] = useState(false);
  function handleInput(value: string) {
    const path = generateFilePath(files, activeFile?.path || "0");
    if (path) containerRef?.current?.fs?.writeFile(path, value);
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
    <>
      <EnrollInTrack
        open={enrollModalOpened}
        setOpen={setEnrollModalOpened}
        trackName={challenge.track.name}
        onConfirm={async () => {
          setLoading(true);
          const res = await solveChallenge(challenge.id, true, jestOutput);
          setLoading(false);
          if (res?.error) {
            toast.error(res.error);
          } else if (res?.url) {
            replace(res.url);
          }
        }}
      />
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
            onClickFile={async (file) => {
              const search = new URLSearchParams(window.location.search);
              await readFile(generateFilePath(files, file) || "0");
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
              CommentsSection={CommentsSection}
              SolutionsSection={SolutionsSection}
            />
          ) : (
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel>
                <ResizablePanelGroup
                  direction="vertical"
                  onLayout={() => fitAddon.fit()}
                >
                  <ResizablePanel className="relative" defaultSize={60}>
                    <div className="bg-border px-4 py-2 w-full flex flex-row items-center rounded-t-md">
                      <span className={cn("text-sm text-muted-foreground ")}>
                        {saved ? "Saved Locally" : "Unsaved Changes"}
                      </span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="hover:bg-background max-h-fit ml-auto"
                            onClick={() => {
                              setHiddenIframe(!hiddenIframe);
                            }}
                          >
                            {!hiddenIframe ? (
                              <PanelLeftOpen className="text-gray-400" />
                            ) : (
                              <PanelLeftClose className="text-gray-400" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {hiddenIframe ? "Show Preview" : "Hide Preview"}
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <SplitEditor
                        height={"100vh"}
                        activeFile={"Challenge.md"}
                      value={content || ""}
                      onChange={(value) => {
                        debouncedHandleInput(value || "");
                      }}
                      theme={"vs-dark"}
                      language={language}
                      options={{
                        fontSize: 16,
                        readOnly:
                          activeFile?.editable === undefined
                            ? true
                            : !activeFile?.editable,
                        wordWrap: "on",
                      }}
                    />

                    {/*<CodeEditor*/}
                    {/*    path={*/}
                    {/*        generateFilePath(files, activeFile?.path || "0")*/}
                    {/*    }*/}
                    {/*      // activeFile={"Challenge.md"}*/}
                    {/*      value={content || ""}*/}
                    {/*      onChange={(value) => {*/}
                    {/*        debouncedHandleInput(value || "");*/}
                    {/*      }}*/}
                    {/*      language={language}*/}
                    {/*      options={{*/}
                    {/*        fontSize: 16,*/}
                    {/*        readOnly:*/}
                    {/*          activeFile?.editable === undefined*/}
                    {/*            ? true*/}
                    {/*            : !activeFile?.editable,*/}
                    {/*        wordWrap: "on",*/}
                    {/*      }}*/}
                    {/*/>*/}
                    {/*<MonacoEditor*/}
                    {/*  activeFile={"Challenge.md"}*/}
                    {/*  value={content || ""}*/}
                    {/*  onChange={(value) => {*/}
                    {/*    debouncedHandleInput(value || "");*/}
                    {/*  }}*/}
                    {/*  theme={"vs-dark"}*/}
                    {/*  language={language}*/}
                    {/*  options={{*/}
                    {/*    fontSize: 16,*/}
                    {/*    readOnly:*/}
                    {/*      activeFile?.editable === undefined*/}
                    {/*        ? true*/}
                    {/*        : !activeFile?.editable,*/}
                    {/*    wordWrap: "on",*/}
                    {/*  }}*/}
                    {/*/>*/}
                    <div className="absolute bottom-0 bg-border px-4 py-3 w-full flex flex-row items-center bg-[#1e1e1e] rounded-b-md">
                      <div className="flex-row ml-auto gap-4 items-center flex">
                        <button
                          className="bg-[#3a3a3d] py-1 px-4 rounded-md max-h-fit hover:bg-gray-700 text-white"
                          onClick={async () => {
                            if (!session?.data?.user?.id) {
                              return signIn("github");
                            }
                            terminalRef?.clear();
                            fitAddon.fit();
                            terminalRef?.write("pnpm test\n"); // this is just to show the user that the tests are running
                            const process = await containerRef.current?.spawn(
                              "node",
                              ["./run-tests.js"]
                            );
                            const jestOutputProcess =
                              await containerRef.current?.spawn("pnpm", [
                                "test",
                              ]);
                            jestOutputProcess?.output.pipeTo(
                              new WritableStream({
                                write(data) {
                                  terminalRef?.write(data);
                                },
                              })
                            );

                            const code = await process?.exit;
                            const jestLog =
                              await containerRef.current?.fs?.readFile(
                                "jestOutput.txt",
                                "utf-8"
                              );
                            console.log(jestLog);
                            setJestOutput(jestLog || "");
                            if (code !== 0) {
                              await attemptChallenge(
                                challenge.id,
                                jestLog || ""
                              );
                            }
                            // await containerRef.current?.fs.rm("jestOutput.txt");
                            if (code === 0) setTestsPassed(true);
                            else setTestsPassed(false);
                          }}
                          disabled={
                            !challenge.playgroundNeeded ||
                            !session?.data?.user?.id
                            //  || testsPassed
                          }
                        >
                          {testsPassed
                            ? "Tests Passed"
                            : !session?.data?.user?.id
                            ? "Login to Test"
                            : "Test"}
                        </button>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white max-h-fit px-4 py-1 rounded-md "
                          disabled={!session?.data?.user?.id || loading}
                          onClick={async () => {
                            if (!session?.data?.user?.id) {
                              return signIn("github");
                            }
                            if (!testsPassed)
                              return toast.error(
                                "Run the tests before submitting"
                              );
                            if (!challenge.track?.users?.length) {
                              setEnrollModalOpened(true);
                            } else {
                              setLoading(true);
                              const res = await solveChallenge(
                                challenge.id,
                                false,
                                jestOutput
                              );
                              setLoading(false);
                              if (res?.error) {
                                toast.error(res.error);
                              } else if (res.url) {
                                replace(res.url);
                              }
                            }
                          }}
                        >
                          {session?.data?.user?.id
                            ? "Submit"
                            : "Login to Submit"}
                        </button>
                      </div>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={40} minSize={25}>
                    <Terminal />
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
              {hiddenIframe ? null : (
                <Fragment>
                  <ResizableHandle withHandle />
                  <ResizablePanel className={hiddenIframe ? "hidden" : ""}>
                    <div className="bg-border w-full flex flex-row items-center border-muted border-[1px] rounded-t-md">
                      <p className="w-full text-muted-foreground text-sm p-2 bg-background line-clamp-1">
                        {iframeUrl}
                      </p>
                      <a
                        href={iframeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-background p-2 py-[6px] hover:bg-gray-600"
                      >
                        <ExternalLink />
                      </a>
                    </div>
                    <iframe
                      src={iframeUrl}
                      className="w-full h-full rounded-md rounded-t-none"
                    />
                  </ResizablePanel>
                </Fragment>
              )}
            </ResizablePanelGroup>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
