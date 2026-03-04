import * as vscode from "vscode";

import { findEnclosingDocComment } from "./docCommentParser";

const COMMAND_ID = "remarkableComments.openMermaidPreview";

export function createDocCommentHoverProvider(): vscode.HoverProvider {
  return {
    provideHover(document, position) {
      const config = vscode.workspace.getConfiguration("remarkableComments");
      if (!config.get<boolean>("enableHover", true)) {
        return undefined;
      }

      const maxCommentLines = config.get<number>("maxCommentLines", 200);
      const info = findEnclosingDocComment(document, position, maxCommentLines);
      if (!info) {
        return undefined;
      }

      const markdown = new vscode.MarkdownString(info.markdown, true);
      if (
        config.get<boolean>("enableMermaidLink", true) &&
        info.mermaidBlocks.length > 0
      ) {
        const payload = {
          source: info.mermaidBlocks[0],
          title: document.fileName.split("/").at(-1)
        };
        const args = encodeURIComponent(JSON.stringify([payload]));
        const commandUri = vscode.Uri.parse(`command:${COMMAND_ID}?${args}`);

        markdown.appendMarkdown("\n\n---\n");
        markdown.appendMarkdown(`$(graph) Mermaid block found. [Open rendered preview](${commandUri})`);
        markdown.isTrusted = true;
      }

      return new vscode.Hover(markdown, info.range);
    }
  };
}
