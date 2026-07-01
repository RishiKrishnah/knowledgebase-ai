"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import CodeBlock from "./CodeBlock";

interface Props {
  content: string;
}

export default function MarkdownRenderer({
  content,
}: Props) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code(props) {
            const { children, className } = props;

            const match = /language-(\w+)/.exec(
              className || ""
            );

            const value = String(children).replace(/\n$/, "");

            if (match) {
              return (
                <CodeBlock
                  language={match[1]}
                  value={value}
                />
              );
            }

            return (
              <code className="rounded bg-muted px-1 py-0.5">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>

    </article>
  );
}