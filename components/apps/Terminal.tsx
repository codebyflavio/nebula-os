"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { AppProps } from "@/types";
import { runCommand } from "@/lib/commands";
import { openApp } from "@/lib/openApp";

interface Line {
  id: number;
  type: "input" | "output" | "success" | "error" | "info" | "accent";
  text: string;
}

let lineId = 0;

const BOOT_LINES = [
  { type: "accent", text: "  ███╗   ██╗███████╗██████╗ ██╗   ██╗██╗      █████╗ " },
  { type: "accent", text: "  ████╗  ██║██╔════╝██╔══██╗██║   ██║██║     ██╔══██╗" },
  { type: "accent", text: "  ██╔██╗ ██║█████╗  ██████╔╝██║   ██║██║     ███████║" },
  { type: "accent", text: "  ██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║██║     ██╔══██║" },
  { type: "accent", text: "  ██║ ╚████║███████╗██████╔╝╚██████╔╝███████╗██║  ██║" },
  { type: "accent", text: "  ╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝" },
  { type: "info",   text: "  NebulaOS Terminal v1.0.0 — Type 'help' for available commands" },
  { type: "info",   text: "" },
] as { type: Line["type"]; text: string }[];

export default function Terminal({ windowId }: AppProps) {
  const [lines, setLines] = useState<Line[]>(() =>
    BOOT_LINES.map((l) => ({ id: lineId++, ...l }))
  );
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState("/home/nebula");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const addLine = useCallback((text: string, type: Line["type"] = "output") => {
    setLines((prev) => [...prev, { id: lineId++, type, text }]);
  }, []);

  const handleSubmit = useCallback(async () => {
    const raw = input.trim();
    addLine(`$ ${raw}`, "input");
    setInput("");
    setHistIdx(-1);
    if (raw) setHistory((h) => [raw, ...h].slice(0, 100));

    const result = await runCommand(raw, {
      cwd,
      setCwd,
      openApp: (id) => openApp(id),
    });

    if (result.clear) {
      setLines(BOOT_LINES.map((l) => ({ id: lineId++, ...l })));
      return;
    }
    if (result.output) {
      result.output.split("\n").forEach((line) => addLine(line, result.type ?? "output"));
    }
  }, [input, cwd, addLine]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { handleSubmit(); return; }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = histIdx + 1;
      if (idx < history.length) { setHistIdx(idx); setInput(history[idx]); }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = histIdx - 1;
      if (idx < 0) { setHistIdx(-1); setInput(""); }
      else { setHistIdx(idx); setInput(history[idx]); }
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines(BOOT_LINES.map((l) => ({ id: lineId++, ...l })));
    }
  }

  return (
    <div
      className="terminal-output selectable flex flex-col h-full"
      style={{ background: "rgba(2,4,14,0.95)", fontSize: 13 }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Output */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {lines.map((l) => (
          <div
            key={l.id}
            className={`leading-relaxed whitespace-pre-wrap ${
              l.type === "input"   ? "term-prompt" :
              l.type === "success" ? "term-success" :
              l.type === "error"   ? "term-error" :
              l.type === "info"    ? "term-info" :
              l.type === "accent"  ? "term-accent" :
              "text-slate-300"
            }`}
          >
            {l.text || "\u00A0"}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-2 border-t"
        style={{ borderColor: "var(--glass-border)", background: "rgba(0,0,0,0.4)" }}
      >
        <span className="term-prompt font-semibold">❯</span>
        <span className="term-path text-xs">{cwd}</span>
        <span className="term-prompt">$</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-slate-200 selectable"
          style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}
          spellCheck={false}
          autoComplete="off"
        />
        <span
          className="animate-blink ml-0.5"
          style={{
            display: "inline-block",
            width: 2,
            height: 14,
            background: "var(--accent-cyan)",
            borderRadius: 1,
          }}
        />
      </div>
    </div>
  );
}
