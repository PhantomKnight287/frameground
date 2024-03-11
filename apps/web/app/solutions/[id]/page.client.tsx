"use client";

import { Button } from "@/components/ui/button";
import { languages } from "@/constants/languages";
import { File } from "@repo/db/types";
import {Editor as MonacoEditor} from "@repo/monaco/exports";
import { useState } from "react";

function SolutionFiles({ files }: { files: File[] }) {
    const [activeFile, setActiveFile] = useState(`${files[0].name}-0`);
    return (
        <div className="flex flex-col items-start mt-8">
            <div className="flex flex-row no-scrollbar gap-2 flex-nowrap">
                {files.map((file, index) => (
                    <Button
                        key={file.id}
                        onClick={() => setActiveFile(`${file.name}-${index}`)}
                        className="rounded-b-none"
                    >
                        {file.name}
                    </Button>
                ))}
            </div>
            <MonacoEditor
                key={activeFile}
                options={{ readOnly: true }}
                value={
                    files.find((file, index) => `${file.name}-${index}` === activeFile)
                        ?.content!
                }
                height={"80vh"}
                theme="vs-dark"
                language={
                    // @ts-expect-error
                    languages[
                        files
                            .find((file, index) => `${file.name}-${index}` === activeFile)
                            ?.name.split(".")[1] as any
                        ]
                }
            />
        </div>
    );
}

export default SolutionFiles;