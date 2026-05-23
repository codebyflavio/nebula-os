import { create } from "zustand";
import { FSNode } from "@/types";

const now = Date.now();

const initialNodes: FSNode[] = [
  { id: "root", name: "/", type: "directory", parentId: null, children: ["home", "bin", "etc"], createdAt: now, updatedAt: now },
  { id: "home", name: "home", type: "directory", parentId: "root", children: ["user"], createdAt: now, updatedAt: now },
  { id: "user", name: "nebula", type: "directory", parentId: "home", children: ["desktop", "documents", "downloads", "music"], createdAt: now, updatedAt: now },
  { id: "desktop", name: "Desktop", type: "directory", parentId: "user", children: [], createdAt: now, updatedAt: now },
  { id: "documents", name: "Documents", type: "directory", parentId: "user", children: ["readme", "notes"], createdAt: now, updatedAt: now },
  { id: "downloads", name: "Downloads", type: "directory", parentId: "user", children: [], createdAt: now, updatedAt: now },
  { id: "music", name: "Music", type: "directory", parentId: "user", children: [], createdAt: now, updatedAt: now },
  { id: "bin", name: "bin", type: "directory", parentId: "root", children: [], createdAt: now, updatedAt: now },
  { id: "etc", name: "etc", type: "directory", parentId: "root", children: ["config"], createdAt: now, updatedAt: now },
  { id: "config", name: "nebula.conf", type: "file", parentId: "etc", content: "# NebulaOS Configuration\nversion=1.0.0\ntheme=nebula\nlang=en\n", createdAt: now, updatedAt: now },
  { id: "readme", name: "README.md", type: "file", parentId: "documents", content: "# Welcome to NebulaOS\n\nA futuristic web-based operating system.\n\n## Features\n- Multi-window management\n- Draggable & resizable windows\n- Built-in apps: Terminal, Notes, Browser, Files, Settings, Music, Calendar\n- Spotlight search\n- Dynamic themes\n- Glassmorphism UI\n\nEnjoy the experience!\n", createdAt: now, updatedAt: now },
  { id: "notes", name: "notes.txt", type: "file", parentId: "documents", content: "My first note in NebulaOS!\n\nThis is a fully functional in-browser OS.\n", createdAt: now, updatedAt: now },
];

interface FSStore {
  nodes: Record<string, FSNode>;

  getNode: (id: string) => FSNode | undefined;
  getChildren: (id: string) => FSNode[];
  getPath: (id: string) => string;
  createNode: (node: Omit<FSNode, "id" | "createdAt" | "updatedAt">) => string;
  deleteNode: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  renameNode: (id: string, name: string) => void;
}

function buildMap(nodes: FSNode[]): Record<string, FSNode> {
  return Object.fromEntries(nodes.map((n) => [n.id, { ...n }]));
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export const useFSStore = create<FSStore>((set, get) => ({
  nodes: buildMap(initialNodes),

  getNode: (id) => get().nodes[id],

  getChildren: (id) => {
    const node = get().nodes[id];
    if (!node || !node.children) return [];
    return node.children.map((cid) => get().nodes[cid]).filter(Boolean) as FSNode[];
  },

  getPath: (id) => {
    const nodes = get().nodes;
    const parts: string[] = [];
    let current = nodes[id];
    while (current && current.parentId !== null) {
      parts.unshift(current.name);
      current = nodes[current.parentId];
    }
    return "/" + parts.join("/");
  },

  createNode: (node) => {
    const id = genId();
    const now = Date.now();
    const newNode: FSNode = { ...node, id, createdAt: now, updatedAt: now };
    set((s) => {
      const nodes = { ...s.nodes, [id]: newNode };
      if (node.parentId && nodes[node.parentId]) {
        const parent = { ...nodes[node.parentId] };
        parent.children = [...(parent.children ?? []), id];
        nodes[node.parentId] = parent;
      }
      return { nodes };
    });
    return id;
  },

  deleteNode: (id) => {
    set((s) => {
      const nodes = { ...s.nodes };
      const node = nodes[id];
      if (!node) return s;
      // remove from parent
      if (node.parentId && nodes[node.parentId]) {
        const parent = { ...nodes[node.parentId] };
        parent.children = (parent.children ?? []).filter((c) => c !== id);
        nodes[node.parentId] = parent;
      }
      // recursively delete children
      function del(nid: string) {
        const n = nodes[nid];
        if (!n) return;
        (n.children ?? []).forEach(del);
        delete nodes[nid];
      }
      del(id);
      return { nodes };
    });
  },

  updateContent: (id, content) =>
    set((s) => ({
      nodes: {
        ...s.nodes,
        [id]: { ...s.nodes[id], content, updatedAt: Date.now() },
      },
    })),

  renameNode: (id, name) =>
    set((s) => ({
      nodes: {
        ...s.nodes,
        [id]: { ...s.nodes[id], name, updatedAt: Date.now() },
      },
    })),
}));
