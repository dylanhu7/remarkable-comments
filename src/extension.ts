import * as vscode from "vscode";

import { createDocCommentHoverProvider } from "./hoverProvider";
import { openMermaidPreviewPanel } from "./mermaidPreviewPanel";
import type { MermaidPreviewPayload } from "./types";

const COMMAND_ID = "remarkableComments.openMermaidPreview";
const SUPPORTED_LANGUAGES = [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact"
] as const;

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      SUPPORTED_LANGUAGES.map((language) => ({ language })),
      createDocCommentHoverProvider(),
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_ID, (payload: MermaidPreviewPayload | undefined) => {
      if (!payload?.source?.trim()) {
        void vscode.window.showWarningMessage(
          "No Mermaid source was found in the hovered doc comment.",
        );
        return;
      }
      openMermaidPreviewPanel(context, payload);
    }),
  );
}

export function deactivate(): void {}
