"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOSStore } from "@/stores/osStore";

const STAGES = [
  { text: "Initializing kernel...",       pct: 15, delay: 300 },
  { text: "Loading system drivers...",    pct: 32, delay: 600 },
  { text: "Mounting file system...",      pct: 48, delay: 900 },
  { text: "Starting window manager...",   pct: 64, delay: 1200 },
  { text: "Loading applications...",      pct: 80, delay: 1500 },
  { text: "Applying theme...",            pct: 92, delay: 1750 },
  { text: "System ready.",                pct: 100, delay: 2000 },
];

export default function BootScreen() {
  const { bootComplete, setBootComplete } = useOSStore();
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    STAGES.forEach((s, i) => {
      setTimeout(() => setStage(i), s.delay);
    });
    setTimeout(() => {
      setTimeout(() => {
        setVisible(false);
        setTimeout(setBootComplete, 600);
      }, 400);
    }, 2400);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (bootComplete) return null;

  const current = STAGES[stage];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ background: "#020617", zIndex: 99999 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Ambient glow orbs */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.12) 0%, transparent 60%)," +
                "radial-gradient(ellipse at 30% 70%, rgba(168,85,247,0.08) 0%, transparent 50%)",
            }}
          />

          {/* Logo mark */}
          <motion.div
            className="flex flex-col items-center gap-6 mb-16"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Hexagon icon */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent 70%)",
                  filter: "blur(20px)",
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
                <motion.path
                  d="M36 4 L64 20 L64 52 L36 68 L8 52 L8 20 Z"
                  stroke="rgba(99,102,241,0.8)"
                  strokeWidth="1.5"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
                <motion.path
                  d="M36 16 L52 26 L52 46 L36 56 L20 46 L20 26 Z"
                  stroke="rgba(6,182,212,0.5)"
                  strokeWidth="1"
                  fill="rgba(99,102,241,0.08)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="36"
                  cy="36"
                  r="4"
                  fill="rgba(99,102,241,0.9)"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.2 }}
                />
              </svg>
            </div>

            {/* Wordmark */}
            <div className="flex flex-col items-center gap-1">
              <motion.span
                className="text-3xl font-bold tracking-[0.2em]"
                style={{ color: "#F1F5F9", fontFamily: "var(--font-sans)" }}
                initial={{ opacity: 0, letterSpacing: "0.4em" }}
                animate={{ opacity: 1, letterSpacing: "0.2em" }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                NEBULA
              </motion.span>
              <motion.span
                className="text-xs tracking-[0.5em]"
                style={{ color: "var(--accent-indigo)", fontFamily: "var(--font-mono)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                OPERATING SYSTEM
              </motion.span>
            </div>
          </motion.div>

          {/* Progress section */}
          <motion.div
            className="flex flex-col items-center gap-4 w-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {/* Bar */}
            <div
              className="w-full h-0.5 rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, var(--accent-indigo), var(--accent-cyan))",
                  boxShadow: "0 0 12px rgba(99,102,241,0.6)",
                }}
                animate={{ width: `${current.pct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Status text */}
            <AnimatePresence mode="wait">
              <motion.span
                key={stage}
                className="text-xs"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {current.text}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Version */}
          <motion.div
            className="absolute bottom-8 text-xs"
            style={{ color: "rgba(255,255,255,0.12)", fontFamily: "var(--font-mono)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            v1.0.0 · build 2025.05.22
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
