"use client";
import { useState, useCallback } from "react";
import { AppProps } from "@/types";
import { Delete } from "lucide-react";

type BtnType = "number" | "op" | "action" | "equal" | "zero";

interface Btn {
  label: string;
  value: string;
  type: BtnType;
  wide?: boolean;
}

const BUTTONS: Btn[] = [
  { label: "AC",  value: "AC",  type: "action" },
  { label: "+/-", value: "±",   type: "action" },
  { label: "%",   value: "%",   type: "action" },
  { label: "÷",   value: "/",   type: "op" },

  { label: "7",   value: "7",   type: "number" },
  { label: "8",   value: "8",   type: "number" },
  { label: "9",   value: "9",   type: "number" },
  { label: "×",   value: "*",   type: "op" },

  { label: "4",   value: "4",   type: "number" },
  { label: "5",   value: "5",   type: "number" },
  { label: "6",   value: "6",   type: "number" },
  { label: "−",   value: "-",   type: "op" },

  { label: "1",   value: "1",   type: "number" },
  { label: "2",   value: "2",   type: "number" },
  { label: "3",   value: "3",   type: "number" },
  { label: "+",   value: "+",   type: "op" },

  { label: "0",   value: "0",   type: "zero", wide: true },
  { label: ".",   value: ".",   type: "number" },
  { label: "=",   value: "=",   type: "equal" },
];

const BTN_COLORS: Record<BtnType, { bg: string; color: string; activeBg: string }> = {
  number: {
    bg: "rgba(255,255,255,0.08)",
    color: "var(--text-primary)",
    activeBg: "rgba(255,255,255,0.16)",
  },
  zero: {
    bg: "rgba(255,255,255,0.08)",
    color: "var(--text-primary)",
    activeBg: "rgba(255,255,255,0.16)",
  },
  op: {
    bg: "rgba(99,102,241,0.18)",
    color: "var(--accent-indigo)",
    activeBg: "rgba(99,102,241,0.3)",
  },
  action: {
    bg: "rgba(255,255,255,0.13)",
    color: "var(--text-secondary)",
    activeBg: "rgba(255,255,255,0.22)",
  },
  equal: {
    bg: "var(--accent-indigo)",
    color: "#fff",
    activeBg: "#4f52d4",
  },
};

export default function Calculator({ windowId }: AppProps) {
  const [display, setDisplay]     = useState("0");
  const [prev, setPrev]           = useState<string | null>(null);
  const [operator, setOperator]   = useState<string | null>(null);
  const [waitNext, setWaitNext]   = useState(false);
  const [history, setHistory]     = useState<string[]>([]);
  const [activeBtn, setActiveBtn] = useState<string | null>(null);

  const fmt = (n: number) => {
    if (!isFinite(n)) return "Error";
    const s = parseFloat(n.toPrecision(10)).toString();
    return s.length > 12 ? n.toExponential(4) : s;
  };

  const press = useCallback((btn: Btn) => {
    setActiveBtn(btn.value);
    setTimeout(() => setActiveBtn(null), 100);

    if (btn.value === "AC") {
      setDisplay("0"); setPrev(null); setOperator(null); setWaitNext(false);
      return;
    }
    if (btn.value === "±") {
      setDisplay((d) => d.startsWith("-") ? d.slice(1) : "-" + d);
      return;
    }
    if (btn.value === "%") {
      setDisplay((d) => fmt(parseFloat(d) / 100));
      return;
    }
    if (btn.value === ".") {
      if (waitNext) { setDisplay("0."); setWaitNext(false); return; }
      if (!display.includes(".")) setDisplay((d) => d + ".");
      return;
    }
    if ("0123456789".includes(btn.value)) {
      if (waitNext) {
        setDisplay(btn.value);
        setWaitNext(false);
      } else {
        setDisplay((d) => d === "0" ? btn.value : d.length >= 12 ? d : d + btn.value);
      }
      return;
    }
    if (["+", "-", "*", "/"].includes(btn.value)) {
      if (prev !== null && operator && !waitNext) {
        const result = compute(parseFloat(prev), parseFloat(display), operator);
        setDisplay(fmt(result));
        setPrev(fmt(result));
      } else {
        setPrev(display);
      }
      setOperator(btn.value);
      setWaitNext(true);
      return;
    }
    if (btn.value === "=") {
      if (prev !== null && operator) {
        const a = parseFloat(prev);
        const b = parseFloat(display);
        const result = compute(a, b, operator);
        const expr = `${prev} ${opSymbol(operator)} ${display} = ${fmt(result)}`;
        setHistory((h) => [expr, ...h].slice(0, 8));
        setDisplay(fmt(result));
        setPrev(null);
        setOperator(null);
        setWaitNext(true);
      }
    }
  }, [display, prev, operator, waitNext]);

  return (
    <div className="flex h-full" style={{ background: "rgba(4,6,20,0.98)" }}>
      {/* Calc area */}
      <div className="flex flex-col flex-1">
        {/* Display */}
        <div
          className="flex flex-col items-end justify-end px-5 py-4 flex-shrink-0"
          style={{
            background: "rgba(0,0,0,0.3)",
            borderBottom: "1px solid var(--glass-border)",
            minHeight: 100,
          }}
        >
          {operator && prev !== null && (
            <span className="text-xs mb-1" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
              {prev} {opSymbol(operator)}
            </span>
          )}
          <span
            className="font-light tabular-nums"
            style={{
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)",
              fontSize: display.length > 8 ? 28 : display.length > 5 ? 36 : 48,
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {display}
          </span>
        </div>

        {/* Buttons grid */}
        <div
          className="grid gap-2 p-3 flex-1"
          style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        >
          {BUTTONS.map((btn) => {
            const colors = BTN_COLORS[btn.type];
            const isActive = activeBtn === btn.value;
            const isCurrentOp = operator === btn.value && waitNext;
            return (
              <button
                key={btn.label}
                onClick={() => press(btn)}
                className="flex items-center justify-center rounded-2xl text-xl font-medium transition-all select-none active:scale-95"
                style={{
                  gridColumn: btn.wide ? "span 2" : undefined,
                  background: isActive
                    ? colors.activeBg
                    : isCurrentOp
                    ? colors.activeBg
                    : colors.bg,
                  color: isCurrentOp ? "#fff" : colors.color,
                  fontSize: 20,
                  height: 56,
                  border: isCurrentOp ? `1px solid ${colors.color}` : "1px solid transparent",
                  boxShadow: isCurrentOp ? `0 0 12px ${colors.bg}` : "none",
                }}
              >
                {btn.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* History sidebar */}
      <div
        className="flex flex-col flex-shrink-0"
        style={{
          width: 150,
          borderLeft: "1px solid var(--glass-border)",
          background: "rgba(8,10,28,0.5)",
        }}
      >
        <div
          className="px-3 py-2 border-b flex items-center justify-between"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)", letterSpacing: "0.06em" }}>
            HISTORY
          </span>
          {history.length > 0 && (
            <button
              onClick={() => setHistory([])}
              className="p-0.5 rounded hover:bg-white/10"
              style={{ color: "var(--text-muted)" }}
            >
              <Delete size={11} />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {history.length === 0 ? (
            <p className="px-3 text-xs" style={{ color: "var(--text-muted)", opacity: 0.5 }}>
              No history
            </p>
          ) : (
            history.map((h, i) => (
              <div
                key={i}
                className="px-3 py-2 text-right border-b"
                style={{ borderColor: "rgba(255,255,255,0.04)", fontFamily: "var(--font-mono)", fontSize: 10 }}
              >
                {h.split(" = ").map((part, j) => (
                  <div key={j} style={{ color: j === 0 ? "var(--text-muted)" : "var(--text-primary)" }}>
                    {j === 1 && "= "}{part}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function compute(a: number, b: number, op: string): number {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? Infinity : a / b;
    default:  return b;
  }
}
function opSymbol(op: string): string {
  return { "+": "+", "-": "−", "*": "×", "/": "÷" }[op] ?? op;
}
