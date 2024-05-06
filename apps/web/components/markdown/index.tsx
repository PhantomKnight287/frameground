"use client";

import clsx from "clsx";
import { useTheme } from "next-themes";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import type { Transformer } from "unified";
import { SKIP, visit, type BuildVisitor } from "unist-util-visit";
import { vs } from "./themes/vs";
import { vscDarkPlus } from "./themes/vs-dark-plus";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import { Check, Copy } from "lucide-react";
import {
  vsDark,
  vscDarkPlus as vscDarkPlusPrisma,
} from "react-syntax-highlighter/dist/cjs/styles/prism";
import raw from "rehype-raw";
import { Callout } from "../callout";

const HTML_COMMENT_REGEX = new RegExp("<!--([\\s\\S]*?)-->", "g");

/**
 * Remove HTML comments from Markdown
 */
function removeHtmlComments(): Transformer {
  return (tree) => {
    // TODO: PRs are welcomed to fix the any type
    // eslint-disable-next-line
    const handler: BuildVisitor<any> = (node, index, parent) => {
      const isComment = node.value.match(HTML_COMMENT_REGEX);

      if (isComment) {
        // remove node
        parent.children.splice(index, 1);
        // Do not traverse `node`, continue at the node *now* at `index`. http://unifiedjs.com/learn/recipe/remove-node/
        return [SKIP, index];
      }
    };

    visit(tree, "html", handler);

    // TODO: is this needed
    visit(tree, "jsx", handler);
  };
}

export function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <ReactMarkdown
      skipHtml
      className={className}
      components={{
        a: ({ className, ...props }) => (
          <a
            className={clsx(className, "whitespace-nowrap text-blue-500")}
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        ul: ({ className, ...props }) => (
          <ul className={clsx(className, "mb-4 list-disc ps-10")} {...props} />
        ),
        ol: ({ className, ...props }) => (
          <ol
            className={clsx(className, "mb-4 list-decimal ps-10")}
            {...props}
          />
        ),
        h1: ({ className, ...props }) => (
          <h1
            className={clsx(className, "mb-2 pb-2 text-3xl font-bold")}
            {...props}
          />
        ),
        h2: ({ className, ...props }) => (
          <h2
            className={clsx(className, "mb-2 pb-2 text-2xl font-bold")}
            {...props}
          />
        ),
        h3: ({ className, ...props }) => (
          <h3
            className={clsx(className, "mb-2 pb-2 text-xl font-bold")}
            {...props}
          />
        ),
        p: ({ className, ...props }) => (
          <p
            className={clsx(className, "mb-4 overflow-hidden text-ellipsis")}
            {...props}
          />
        ),
        //@ts-expect-error
        code({ inline, className, children, style: _, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <div className="relative">
              <CopyButton text={String(children).replace(/\n$/, "")} />
              {/*
         //@ts-expect-error */}
              <SyntaxHighlighter
                PreTag="section" // parent tag
                className={clsx(className, "rounded-xl dark:rounded-md")}
                language={match[1]}
                style={vscDarkPlusPrisma}
                customStyle={{ fontSize: "inherit", padding: "30px" }}
                codeTagProps={{
                  style: {
                    fontSize: "inherit",
                    lineHeight: "inherit",
                  },
                  tabIndex: 0,
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="rounded-md border border-zinc-300 bg-neutral-200 px-1 py-[0.10rem] font-mono text-zinc-600 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              {children}
            </code>
          );
        },

        details: ({ ...props }) => <details {...props} />,
        summary: ({ ...props }) => <summary {...props} />,
        //@ts-expect-error
        callout: Callout,
        blockquote: ({ ...props }) => (
          <blockquote className="p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
            {/**
             //@ts-expect-error */}
            <p
              className="italic font-medium leading-relaxed text-gray-900 dark:text-white"
              {...props}
            />
          </blockquote>
        ),
      }}
      remarkPlugins={[removeHtmlComments, remarkGfm]}
      rehypePlugins={[raw]}
    >
      {children}
    </ReactMarkdown>
  );
}

function CopyButton({ text }: { text: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text).catch(console.error);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="absolute right-0">
      {isCopied ? (
        <div className="flex items-center justify-center p-3">
          <Check
            className="stroke-green-500 hover:stroke-green-400"
            size={20}
          />
        </div>
      ) : (
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={copyToClipboard}
                variant="ghost"
                className="p-2 hover:bg-transparent dark:hover:bg-transparent"
                aria-label="Copy code to clipboard"
              >
                <Copy
                  className="stroke-gray-500 hover:stroke-gray-400"
                  size={20}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
