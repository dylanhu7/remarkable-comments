import * as vscode from "vscode";

import type { MermaidPreviewPayload } from "./types";

export function openMermaidPreviewPanel(
  context: vscode.ExtensionContext,
  payload: MermaidPreviewPayload,
): void {
  const panel = vscode.window.createWebviewPanel(
    "remarkableComments.mermaid",
    payload.title ? `Mermaid Preview: ${payload.title}` : "Mermaid Preview",
    vscode.ViewColumn.Beside,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    },
  );

  panel.webview.html = getHtml(panel.webview, context.extensionUri, payload);
}

function getHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  payload: MermaidPreviewPayload,
): string {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "dist", "webview", "mermaid-preview.js"),
  );

  const nonce = createNonce();
  const initial = JSON.stringify({
    source: payload.source,
    theme: vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ? "dark" : "default"
  });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mermaid Preview</title>
    <style>
      :root {
        color-scheme: light dark;
      }
      body {
        margin: 0;
        padding: 16px;
        font-family: var(--vscode-font-family);
        background: var(--vscode-editor-background);
        color: var(--vscode-editor-foreground);
      }
      #diagram {
        overflow: auto;
      }
      #error {
        display: none;
        white-space: pre-wrap;
        color: var(--vscode-errorForeground);
      }
    </style>
  </head>
  <body>
    <div id="diagram" aria-label="Mermaid diagram"></div>
    <pre id="error" aria-label="Mermaid render error"></pre>
    <script nonce="${nonce}">
      window.__REMARKABLE_COMMENTS__ = ${initial};
    </script>
    <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
  </body>
</html>`;
}

function createNonce(): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < 32; i += 1) {
    nonce += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return nonce;
}
