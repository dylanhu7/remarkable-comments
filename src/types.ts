import type * as vscode from "vscode";

export type DocCommentInfo = {
  range: vscode.Range;
  markdown: string;
  mermaidBlocks: string[];
};

export type MermaidPreviewPayload = {
  source: string;
  title?: string;
};
