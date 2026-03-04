import * as vscode from "vscode";

import type { DocCommentInfo } from "./types";

const DOC_COMMENT_START = /^\s*\/\*\*/;

export function findEnclosingDocComment(
  document: vscode.TextDocument,
  position: vscode.Position,
  maxScanLines: number,
): DocCommentInfo | undefined {
  const startLine = findDocCommentStartLine(document, position.line, maxScanLines);
  if (startLine === undefined) {
    return undefined;
  }

  const endLine = findDocCommentEndLine(document, startLine);
  if (endLine === undefined || position.line < startLine || position.line > endLine) {
    return undefined;
  }

  const range = new vscode.Range(startLine, 0, endLine, document.lineAt(endLine).text.length);
  const markdown = extractDocCommentMarkdown(document, startLine, endLine).trim();
  if (!markdown) {
    return undefined;
  }

  return {
    range,
    markdown,
    mermaidBlocks: extractMermaidBlocks(markdown)
  };
}

function findDocCommentStartLine(
  document: vscode.TextDocument,
  fromLine: number,
  maxScanLines: number,
): number | undefined {
  const minLine = Math.max(0, fromLine - maxScanLines);

  for (let line = fromLine; line >= minLine; line -= 1) {
    const text = document.lineAt(line).text;
    if (line < fromLine && text.includes("*/")) {
      return undefined;
    }
    if (DOC_COMMENT_START.test(text)) {
      return line;
    }
  }

  return undefined;
}

function findDocCommentEndLine(document: vscode.TextDocument, startLine: number): number | undefined {
  for (let line = startLine; line < document.lineCount; line += 1) {
    if (document.lineAt(line).text.includes("*/")) {
      return line;
    }
  }
  return undefined;
}

function extractDocCommentMarkdown(
  document: vscode.TextDocument,
  startLine: number,
  endLine: number,
): string {
  const lines: string[] = [];

  for (let line = startLine; line <= endLine; line += 1) {
    const text = document.lineAt(line).text;
    if (startLine === endLine) {
      const singleLine = text.replace(/^\s*\/\*\*/, "").replace(/\*\/\s*$/, "");
      lines.push(stripJSDocLinePrefix(singleLine));
      continue;
    }

    if (line === startLine) {
      lines.push(stripJSDocLinePrefix(text.replace(/^\s*\/\*\*/, "")));
      continue;
    }

    if (line === endLine) {
      lines.push(stripJSDocLinePrefix(text.replace(/\*\/\s*$/, "")));
      continue;
    }

    lines.push(stripJSDocLinePrefix(text));
  }

  return lines.join("\n");
}

function stripJSDocLinePrefix(value: string): string {
  return value.replace(/^\s*\* ?/, "");
}

function extractMermaidBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  const regex = /```mermaid\s*\n([\s\S]*?)```/gi;

  for (const match of markdown.matchAll(regex)) {
    const source = match[1]?.trim();
    if (source) {
      blocks.push(source);
    }
  }

  return blocks;
}
