"use client";
import { useState } from "react";
import { AppProps } from "@/types";
import { useFSStore } from "@/stores/fsStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { Plus, Save, Trash2, FileText } from "lucide-react";

export default function Notes({ windowId }: AppProps) {
  const { nodes, getChildren, createNode, deleteNode, updateContent } = useFSStore();
  const push = useNotificationStore((s) => s.push);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  // Use documents folder
  const docsNode = Object.values(nodes).find((n) => n.name === "Documents" && n.type === "directory");
  const files = docsNode ? getChildren(docsNode.id).filter((n) => n.type === "file") : [];

  function newNote() {
    if (!docsNode) return;
    const id = createNode({ name: "Untitled.txt", type: "file", parentId: docsNode.id, content: "" });
    setSelectedId(id);
    setDraft("");
  }

  function select(id: string) {
    setSelectedId(id);
    setDraft(nodes[id]?.content ?? "");
  }

  function save() {
    if (!selectedId) return;
    updateContent(selectedId, draft);
    push({ title: "Notes", body: "File saved.", type: "success", appId: "notes" });
  }

  function remove(id: string) {
    deleteNode(id);
    if (selectedId === id) { setSelectedId(null); setDraft(""); }
  }

  return (
    <div className="flex h-full" style={{ background: "rgba(4,6,20,0.97)" }}>
      {/* Sidebar */}
      <div
        className="flex flex-col"
        style={{
          width: 180,
          borderRight: "1px solid var(--glass-border)",
          background: "rgba(8,10,28,0.6)",
          flexShrink: 0,
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-2 border-b"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            NOTES
          </span>
          <button
            onClick={newNote}
            className="p-1 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: "var(--accent-cyan)" }}
            title="New note"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {files.length === 0 ? (
            <div className="px-3 py-4 text-xs" style={{ color: "var(--text-muted)" }}>
              No notes yet
            </div>
          ) : (
            files.map((f) => (
              <button
                key={f.id}
                onClick={() => select(f.id)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors group"
                style={{
                  background: selectedId === f.id ? "rgba(99,102,241,0.15)" : "transparent",
                  borderLeft: selectedId === f.id ? "2px solid var(--accent-indigo)" : "2px solid transparent",
                }}
              >
                <FileText
                  size={12}
                  style={{ color: selectedId === f.id ? "var(--accent-indigo)" : "var(--text-muted)", flexShrink: 0 }}
                />
                <span
                  className="flex-1 truncate text-xs"
                  style={{ color: selectedId === f.id ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {f.name}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); remove(f.id); }}
                  className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Trash2 size={11} />
                </button>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex flex-col flex-1 min-w-0">
        {selectedId ? (
          <>
            <div
              className="flex items-center justify-between px-4 py-2 border-b"
              style={{ borderColor: "var(--glass-border)", background: "rgba(8,10,28,0.4)" }}
            >
              <span className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {nodes[selectedId]?.name}
              </span>
              <button
                onClick={save}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors hover:brightness-110"
                style={{ background: "var(--accent-indigo)", color: "#fff" }}
              >
                <Save size={11} />
                Save
              </button>
            </div>
            <textarea
              className="flex-1 w-full resize-none bg-transparent outline-none selectable p-4 text-sm leading-relaxed"
              style={{
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
              }}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Start writing…"
              spellCheck={false}
            />
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center h-full gap-3"
            style={{ color: "var(--text-muted)" }}
          >
            <FileText size={36} style={{ opacity: 0.2 }} />
            <span className="text-sm">Select a note or create one</span>
            <button
              onClick={newNote}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "rgba(99,102,241,0.2)", color: "var(--accent-indigo)" }}
            >
              <Plus size={12} /> New Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
