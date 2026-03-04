import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");
const production = process.argv.includes("--production");

const common = {
  bundle: true,
  minify: production,
  sourcemap: !production,
  logLevel: "info"
};

const extensionConfig = {
  ...common,
  entryPoints: ["src/extension.ts"],
  outfile: "dist/extension.js",
  platform: "node",
  format: "cjs",
  target: "node20",
  external: ["vscode"]
};

const webviewConfig = {
  ...common,
  entryPoints: ["src/webview/mermaid-preview.ts"],
  outfile: "dist/webview/mermaid-preview.js",
  platform: "browser",
  format: "esm",
  target: "es2022"
};

if (watch) {
  const extensionContext = await esbuild.context(extensionConfig);
  const webviewContext = await esbuild.context(webviewConfig);

  await Promise.all([extensionContext.watch(), webviewContext.watch()]);
  console.log("watching...");

  const dispose = async () => {
    await Promise.all([extensionContext.dispose(), webviewContext.dispose()]);
    process.exit(0);
  };

  process.on("SIGINT", () => {
    void dispose();
  });
  process.on("SIGTERM", () => {
    void dispose();
  });
} else {
  await Promise.all([esbuild.build(extensionConfig), esbuild.build(webviewConfig)]);
}
