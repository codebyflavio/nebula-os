"use client";
import { AnimatePresence } from "framer-motion";
import { useWindowStore } from "@/stores/windowStore";
import Window from "./Window";

export default function WindowContainer() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
      <AnimatePresence>
        {windows.map((win) => (
          <div key={win.id} className="pointer-events-auto absolute inset-0">
            <Window win={win} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
