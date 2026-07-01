"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface Props {
  language: string;
  value: string;
}

export default function CodeBlock({
  language,
  value,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(value);

    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="my-4 overflow-hidden rounded-xl border">

      <div className="flex items-center justify-between border-b bg-muted px-4 py-2">

        <span className="text-xs font-medium uppercase">
          {language}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={copyCode}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </>
          )}
        </Button>

      </div>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "14px",
        }}
      >
        {value}
      </SyntaxHighlighter>

    </div>
  );
}