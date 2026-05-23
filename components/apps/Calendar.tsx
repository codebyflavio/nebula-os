"use client";
import { useState } from "react";
import { AppProps } from "@/types";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface Event {
  id: number;
  date: string; // YYYY-MM-DD
  title: string;
  color: string;
  time?: string;
}

const COLORS = ["#6366F1", "#06B6D4", "#A855F7", "#10B981", "#F59E0B", "#EF4444"];

const INITIAL_EVENTS: Event[] = [
  { id: 1, date: new Date().toISOString().slice(0, 10), title: "NebulaOS Launch", color: "#6366F1", time: "10:00" },
  { id: 2, date: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10), title: "Code Review", color: "#06B6D4", time: "14:30" },
  { id: 3, date: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10), title: "Design Sprint", color: "#A855F7", time: "09:00" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

let evtId = 100;

export default function Calendar({ windowId }: AppProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<string | null>(today.toISOString().slice(0, 10));
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function dateStr(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function addEvent() {
    if (!selected) return;
    const title = prompt("Event title:") ?? "";
    if (!title.trim()) return;
    const time = prompt("Time (HH:MM, optional):") ?? undefined;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    setEvents((e) => [...e, { id: evtId++, date: selected, title: title.trim(), color, time: time?.trim() || undefined }]);
  }

  const selectedEvents = selected ? events.filter((e) => e.date === selected) : [];

  return (
    <div className="flex h-full" style={{ background: "rgba(4,6,20,0.97)" }}>
      {/* Calendar grid */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "var(--glass-border)", flexShrink: 0 }}
        >
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            {MONTHS[month]} {year}
          </span>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            style={{ color: "var(--text-muted)" }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 px-2 py-1" style={{ flexShrink: 0 }}>
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-xs font-medium py-1"
              style={{ color: "var(--text-muted)" }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 grid grid-cols-7 gap-0.5 px-2 pb-2 content-start">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const ds = dateStr(day);
            const isToday = ds === today.toISOString().slice(0, 10);
            const isSelected = ds === selected;
            const dayEvents = events.filter((e) => e.date === ds);

            return (
              <button
                key={i}
                onClick={() => setSelected(ds)}
                className="flex flex-col items-center rounded-xl py-1.5 transition-colors hover:bg-white/5"
                style={{
                  background: isSelected
                    ? "rgba(99,102,241,0.2)"
                    : isToday
                    ? "rgba(255,255,255,0.05)"
                    : "transparent",
                  border: isSelected
                    ? "1px solid rgba(99,102,241,0.4)"
                    : isToday
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid transparent",
                }}
              >
                <span
                  className="text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full"
                  style={{
                    color: isToday
                      ? "var(--accent-indigo)"
                      : isSelected
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                    background: isToday ? "rgba(99,102,241,0.2)" : "transparent",
                    fontWeight: isToday ? 700 : undefined,
                  }}
                >
                  {day}
                </span>
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      className="w-1 h-1 rounded-full"
                      style={{ background: e.color }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side panel */}
      <div
        className="flex flex-col"
        style={{
          width: 180,
          borderLeft: "1px solid var(--glass-border)",
          background: "rgba(8,10,28,0.5)",
          flexShrink: 0,
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-3 border-b"
          style={{ borderColor: "var(--glass-border)" }}
        >
          <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            {selected ?? "Select a day"}
          </span>
          {selected && (
            <button
              onClick={addEvent}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: "var(--accent-cyan)" }}
              title="Add event"
            >
              <Plus size={13} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2">
          {selectedEvents.length === 0 ? (
            <div
              className="text-xs text-center py-6"
              style={{ color: "var(--text-muted)" }}
            >
              No events
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedEvents.map((e) => (
                <div
                  key={e.id}
                  className="px-3 py-2 rounded-xl"
                  style={{
                    background: `${e.color}18`,
                    borderLeft: `3px solid ${e.color}`,
                  }}
                >
                  {e.time && (
                    <span
                      className="text-xs block mb-0.5"
                      style={{ color: e.color, fontFamily: "var(--font-mono)" }}
                    >
                      {e.time}
                    </span>
                  )}
                  <span className="text-xs" style={{ color: "var(--text-primary)" }}>
                    {e.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
