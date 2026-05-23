import { useFSStore } from "@/stores/fsStore";
import { notify } from "@/stores/notificationStore";
import { useWindowStore } from "@/stores/windowStore";
import { getApp } from "./apps";

export interface CommandResult {
  output: string;
  type?: "success" | "error" | "info" | "accent";
  clear?: boolean;
}

export interface CommandContext {
  cwd: string;
  setCwd: (path: string) => void;
  openApp?: (appId: string) => void;
}

type CommandHandler = (args: string[], ctx: CommandContext) => CommandResult | Promise<CommandResult>;

// ── Helper: resolve path ───────────────────────────────────────
function resolvePath(base: string, input: string): string {
  if (input.startsWith("/")) return normalizePath(input);
  const parts = base === "/" ? [""] : base.split("/");
  const segs = input.split("/");
  for (const seg of segs) {
    if (seg === "." || seg === "") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return normalizePath(parts.join("/") || "/");
}

function normalizePath(p: string): string {
  return p.replace(/\/+/g, "/") || "/";
}

function nodeAtPath(path: string) {
  const { nodes } = useFSStore.getState();
  if (path === "/") return nodes["root"];
  const parts = path.split("/").filter(Boolean);
  let current = nodes["root"];
  for (const part of parts) {
    if (!current || !current.children) return undefined;
    const child = current.children.map((id) => nodes[id]).find((n) => n?.name === part);
    if (!child) return undefined;
    current = child;
  }
  return current;
}

// ── Commands ────────────────────────────────────────────────────
const commands: Record<string, CommandHandler> = {
  help: () => ({
    output: `NebulaOS Terminal — available commands:

  help          show this help
  clear         clear the terminal
  ls [path]     list directory contents
  cd [path]     change directory
  pwd           print working directory
  cat <file>    print file contents
  mkdir <name>  create directory
  touch <name>  create empty file
  rm <name>     remove file or empty directory
  echo <text>   print text
  whoami        show current user
  uname         show system info
  date          show current date/time
  open <app>    open an application
  notify <msg>  send a notification
  theme <id>    switch theme (nebula|aurora|crimson|solar)`,
    type: "info",
  }),

  clear: () => ({ output: "", clear: true }),

  ls: (args, ctx) => {
    const path = args[0] ? resolvePath(ctx.cwd, args[0]) : ctx.cwd;
    const node = nodeAtPath(path);
    if (!node) return { output: `ls: ${path}: No such file or directory`, type: "error" };
    if (node.type === "file") return { output: node.name };
    const children = useFSStore.getState().getChildren(node.id);
    if (children.length === 0) return { output: "(empty directory)", type: "info" };
    const out = children
      .map((c) => (c.type === "directory" ? `\x1b[34m${c.name}/\x1b[0m` : c.name))
      .join("  ");
    return { output: out };
  },

  cd: (args, ctx) => {
    const target = args[0] ?? "/home/nebula";
    const path = resolvePath(ctx.cwd, target);
    const node = nodeAtPath(path);
    if (!node) return { output: `cd: ${path}: No such file or directory`, type: "error" };
    if (node.type !== "directory") return { output: `cd: ${path}: Not a directory`, type: "error" };
    ctx.setCwd(path);
    return { output: "" };
  },

  pwd: (_, ctx) => ({ output: ctx.cwd }),

  cat: (args, ctx) => {
    if (!args[0]) return { output: "cat: missing file argument", type: "error" };
    const path = resolvePath(ctx.cwd, args[0]);
    const node = nodeAtPath(path);
    if (!node) return { output: `cat: ${path}: No such file or directory`, type: "error" };
    if (node.type !== "file") return { output: `cat: ${path}: Is a directory`, type: "error" };
    return { output: node.content ?? "(empty file)", type: "info" };
  },

  mkdir: (args, ctx) => {
    if (!args[0]) return { output: "mkdir: missing operand", type: "error" };
    const parentNode = nodeAtPath(ctx.cwd);
    if (!parentNode) return { output: "mkdir: invalid working directory", type: "error" };
    useFSStore.getState().createNode({
      name: args[0],
      type: "directory",
      parentId: parentNode.id,
      children: [],
    });
    return { output: `mkdir: created directory '${args[0]}'`, type: "success" };
  },

  touch: (args, ctx) => {
    if (!args[0]) return { output: "touch: missing file argument", type: "error" };
    const parentNode = nodeAtPath(ctx.cwd);
    if (!parentNode) return { output: "touch: invalid working directory", type: "error" };
    useFSStore.getState().createNode({
      name: args[0],
      type: "file",
      parentId: parentNode.id,
      content: "",
    });
    return { output: "", type: "success" };
  },

  rm: (args, ctx) => {
    if (!args[0]) return { output: "rm: missing operand", type: "error" };
    const path = resolvePath(ctx.cwd, args[0]);
    const node = nodeAtPath(path);
    if (!node) return { output: `rm: ${path}: No such file or directory`, type: "error" };
    useFSStore.getState().deleteNode(node.id);
    return { output: `removed '${args[0]}'`, type: "success" };
  },

  echo: (args) => ({ output: args.join(" ") }),

  whoami: () => ({ output: "nebula", type: "accent" }),

  uname: () => ({
    output: "NebulaOS 1.0.0 — WebKit/Chromium — x86_64 — © 2025",
    type: "info",
  }),

  date: () => ({ output: new Date().toLocaleString(), type: "info" }),

  open: (args, ctx) => {
    const appId = args[0];
    if (!appId) return { output: "open: missing app id. Try 'help'.", type: "error" };
    const app = getApp(appId);
    if (!app) return { output: `open: unknown app '${appId}'`, type: "error" };
    ctx.openApp?.(appId);
    return { output: `Opening ${app.name}...`, type: "success" };
  },

  notify: (args) => {
    const msg = args.join(" ");
    if (!msg) return { output: "notify: missing message", type: "error" };
    notify("Terminal", msg, "info", "terminal");
    return { output: `Notification sent: "${msg}"`, type: "success" };
  },

  theme: (args) => {
    const id = args[0];
    const valid = ["nebula", "aurora", "crimson", "solar"];
    if (!id || !valid.includes(id))
      return { output: `theme: usage: theme <${valid.join("|")}>`, type: "error" };
    // dynamic import to avoid circular dep
    import("@/stores/themeStore").then(({ useThemeStore }) => {
      useThemeStore.getState().setTheme(id);
    });
    return { output: `Theme switched to '${id}'`, type: "success" };
  },
};

export async function runCommand(raw: string, ctx: CommandContext): Promise<CommandResult> {
  const trimmed = raw.trim();
  if (!trimmed) return { output: "" };
  const [cmd, ...args] = trimmed.split(/\s+/);
  const handler = commands[cmd.toLowerCase()];
  if (!handler) {
    return {
      output: `${cmd}: command not found. Type 'help' for available commands.`,
      type: "error",
    };
  }
  return handler(args, ctx);
}
