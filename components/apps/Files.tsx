"use client";
import { useState } from "react";
import { AppProps } from "@/types";
import { useFSStore } from "@/stores/fsStore";
import { FSNode } from "@/types";
import {
  Folder, FolderOpen, FileText, ChevronRight,
  Home, Plus, Trash2, ArrowLeft,
} from "lucide-react";

export default function Files({ windowId }: AppProps) {
  const { nodes, getChildren, getPath, createNode, deleteNode } = useFSStore();
  const [cwdId, setCwdId] = useState("user");
  const [history, setHistory] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const cwd = nodes[cwdId];
  const children = getChildren(cwdId).sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  const path = getPath(cwdId);

  function navigate(id: string) {
    const node = nodes[id];
    if (!node) return;
    if (node.type === "directory") {
      setHistory((h) => [...h, cwdId]);
      setCwdId(id);
      setSelected(null);
    }
  }

  function back() {
    const prev = history[history.length - 1];
    if (prev) {
      setHistory((h) => h.slice(0, -1));
      setCwdId(prev);
      setSelected(null);
    }
  }

  function newFolder() {
    const name = prompt("Folder name:") ?? "";
    if (name.trim()) {
      createNode({ name: name.trim(), type: "directory", parentId: cwdId, children: [] });
    }
  }

  function newFile() {
    const name = prompt("File name:") ?? "";
    if (name.trim()) {
      createNode({ name: name.trim(), type: "file", parentId: cwdId, content: "" });
    }
  }

  function remove() {
    if (!selected) return;
    deleteNode(selected);
    setSelected(null);
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "rgba(4,6,20,0.97)" }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: "var(--glass-border)", background: "rgba(8,10,28,0.5)", flexShrink: 0 }}
      >
        <button
          onClick={back}
          disabled={history.length === 0}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/10 disabled:opacity-30"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft size={14} />
        </button>
        <button
          onClick={() => { setHistory([]); setCwdId("user"); setSelected(null); }}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "var(--text-muted)" }}
        >
          <Home size={14} />
        </button>

        {/* Path breadcrumb */}
        <div
          className="flex-1 flex items-center gap-1 px-3 py-1 rounded-lg text-xs overflow-x-auto"
          style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}
        >
          {path.split("/").filter(Boolean).map((seg, i, arr) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={10} style={{ color: "var(--text-muted)" }} />}
              <span className="whitespace-nowrap">{seg}</span>
            </span>
          ))}
        </div>

        <button
          onClick={newFolder}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "var(--accent-cyan)" }}
          title="New folder"
        >
          <Folder size={14} />
        </button>
        <button
          onClick={newFile}
          className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
          style={{ color: "var(--accent-indigo)" }}
          title="New file"
        >
          <Plus size={14} />
        </button>
        {selected && (
          <button
            onClick={remove}
            className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "#EF4444" }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* File grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {children.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-full gap-2"
            style={{ color: "var(--text-muted)" }}
          >
            <FolderOpen size={36} style={{ opacity: 0.2 }} />
            <span className="text-sm">Empty folder</span>
          </div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))" }}>
            {children.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelected(node.id === selected ? null : node.id)}
                onDoubleClick={() => navigate(node.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors text-center"
                style={{
                  background: selected === node.id ? "rgba(99,102,241,0.2)" : "transparent",
                  border: selected === node.id
                    ? "1px solid rgba(99,102,241,0.4)"
                    : "1px solid transparent",
                  cursor: "default",
                }}
              >
                {node.type === "directory" ? (
                  <Folder
                    size={32}
                    strokeWidth={1.5}
                    style={{ color: "#F59E0B" }}
                  />
                ) : (
                  <FileText
                    size={32}
                    strokeWidth={1.5}
                    style={{ color: "var(--accent-cyan)" }}
                  />
                )}
                <span
                  className="text-xs leading-tight break-words w-full text-center"
                  style={{
                    color: selected === node.id ? "var(--text-primary)" : "var(--text-secondary)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {node.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Status bar */}
      <div
        className="px-3 py-1.5 border-t text-xs"
        style={{ borderColor: "var(--glass-border)", color: "var(--text-muted)", flexShrink: 0 }}
      >
        {children.length} item{children.length !== 1 ? "s" : ""}
        {selected && nodes[selected] && ` · "${nodes[selected].name}" selected`}
      </div>
    </div>
  );
}
