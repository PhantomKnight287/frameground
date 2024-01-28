"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ChallengeFilesStructure } from "@repo/challenges/src";
import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import MonacoEditor from "@repo/monaco";
import { languages } from "@/constants/languages";
import { cn } from "@repo/utils";
import { useParams } from "next/navigation";
import { createSolution } from "./actions";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Markdown } from "@/components/markdown";

let timeout: NodeJS.Timeout;
function CreateSolutionPage({ files }: { files: ChallengeFilesStructure[] }) {
  const [editableFiles, setEditableFiles] = useState(files);
  const [activeFile, setActiveFile] = useState<string>(
    `${editableFiles[0].name}-0`
  );
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const [description, setDescription] = useState("");
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const debouncedHandleInput = (val: string) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      setEditableFiles((prev) => {
        const newFiles = [...prev];
        const file = newFiles.find(
          (file, index) => `${file.name}-${index}` === activeFile
        );
        if (file) {
          file.content = val;
        }
        return newFiles;
      });
    }, 300);
  };

  return (
    <div className="flex flex-col gap-3">
      <Link
        href={`/tracks/${params.track}/challenge/${params.challenge}?tab=solutions`}
        className={buttonVariants({
          variant: "secondary",
          className: "w-fit flex flex-row items-center gap-1",
        })}
      >
        <ArrowLeft
          className="mr-1"
          size={16}
          strokeWidth={3}
          color="currentColor"
        />
        Back
      </Link>
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          const res = await createSolution(
            params.challenge as string,
            titleRef.current!.value,
            description,
            editableFiles
          );
          setLoading(false);
          if (res.message) {
            toast.error(res.message);
          } else {
            toast.success("Solution created successfully");
            titleRef.current!.value = "";
            setDescription("");
            setEditableFiles(files);
          }
        }}
      >
        <div className="flex flex-row items-center justify-between">
          <Label htmlFor="title" className="text-lg">
            Title
          </Label>
          <Button type="submit" disabled={loading}>
            Create Solution
          </Button>
        </div>
        <TextareaAutosize
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground ring-0 disabled:cursor-not-allowed disabled:opacity-50"
          name="title"
          placeholder="Write title of your solution here"
          ref={titleRef}
          required
          autoFocus
        />
        <Label htmlFor="description" className="text-lg">
          Description
        </Label>

        <Tabs defaultValue="text" className="flex flex-col">
          <TabsList className="w-full">
            <TabsTrigger className="flex-grow" value="text">
              Text
            </TabsTrigger>
            <TabsTrigger className="flex-grow" value="preview">
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <div className="w-full">
              <TextareaAutosize
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                name="description"
                placeholder="Write description of your solution here(supports Markdown)"
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <Markdown
              // eslint-disable-next-line react/no-children-prop
              children={description}
            />
          </TabsContent>
        </Tabs>

        <div className="flex flex-col ">
          <div className="flex flex-row gap-1 flex-nowrap overflow-x-scroll no-scrollbar">
            {editableFiles.map((file, index) => {
              return (
                <Button
                  className={cn("text-lg rounded-b-none")}
                  type="button"
                  key={`${file.name}-${index}`}
                  onClick={() => {
                    setActiveFile(`${file.name}-${index}`);
                  }}
                  variant={
                    activeFile === `${file.name}-${index}`
                      ? "default"
                      : "secondary"
                  }
                >
                  {file.name}
                </Button>
              );
            })}
          </div>
          <MonacoEditor
            activeFile={activeFile}
            theme="vs-dark"
            height={"80vh"}
            language={
              // @ts-expect-error
              languages[
                editableFiles
                  .find((file, index) => `${file.name}-${index}` === activeFile)
                  ?.name.split(".")[1] as any
              ]
            }
            value={
              (editableFiles.find(
                (file, index) => `${file.name}-${index}` === activeFile
              )?.content as any) || ""
            }
            onChange={(value) => {
              debouncedHandleInput(value || "");
            }}
          />
        </div>
      </form>
    </div>
  );
}

export default CreateSolutionPage;
