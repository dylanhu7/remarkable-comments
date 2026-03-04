import mermaid from "mermaid";

type InitialState = {
  source: string;
  theme: "default" | "dark";
};

declare global {
  interface Window {
    __REMARKABLE_COMMENTS__?: InitialState;
  }
}

const diagramElement = document.getElementById("diagram");
const errorElement = document.getElementById("error");

void renderInitial();

async function renderInitial(): Promise<void> {
  if (!diagramElement || !errorElement) {
    return;
  }

  const input = window.__REMARKABLE_COMMENTS__;
  if (!input?.source?.trim()) {
    showError("No Mermaid source provided.");
    return;
  }

  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: input.theme,
      securityLevel: "loose"
    });

    const id = `remarkable-comments-${Date.now()}`;
    const output = await mermaid.render(id, input.source);
    diagramElement.innerHTML = output.svg;
    if (output.bindFunctions) {
      output.bindFunctions(diagramElement);
    }
    errorElement.style.display = "none";
  } catch (error) {
    showError(error instanceof Error ? error.message : String(error));
  }
}

function showError(message: string): void {
  if (!errorElement || !diagramElement) {
    return;
  }
  diagramElement.innerHTML = "";
  errorElement.textContent = `Mermaid render failed:\n${message}`;
  errorElement.style.display = "block";
}
