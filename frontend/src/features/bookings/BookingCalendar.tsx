import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ymd(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Month calendar. Marks days that have (non-cancelled) bookings with a count,
 * and calls onSelect when a day is clicked. Fetches per-day counts for the
 * visible month from /api/bookings/calendar.
 */
export function BookingCalendar({
  selectedDate,
  onSelect,
}: {
  selectedDate: string;
  onSelect: (date: string) => void;
}) {
  const [view, setView] = useState(() => {
    const d = new Date(selectedDate + "T00:00:00");
    return { year: d.getFullYear(), month: d.getMonth() }; // month 0-11
  });

  const monthKey = `${view.year}-${String(view.month + 1).padStart(2, "0")}`;

  const counts = useQuery({
    queryKey: ["bookings-calendar", monthKey],
    queryFn: async () =>
      (await api.get<{ data: { date: string; count: number }[] }>(
        `/api/bookings/calendar?month=${monthKey}`,
      )).data.data,
  });

  const countByDate = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of counts.data ?? []) m.set(r.date, r.count);
    return m;
  }, [counts.data]);

  const cells = useMemo(() => {
    const first = new Date(view.year, view.month, 1);
    const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
    const lead = first.getDay(); // 0=Sun
    const out: (Date | null)[] = [];
    for (let i = 0; i < lead; i++) out.push(null);
    for (let day = 1; day <= daysInMonth; day++) out.push(new Date(view.year, view.month, day));
    return out;
  }, [view]);

  const today = ymd(new Date());

  function shift(delta: number) {
    setView((v) => {
      const m = v.month + delta;
      return { year: v.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 };
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg">
          {MONTHS[view.month]} {view.year}
        </h2>
        <div className="flex gap-1">
          <button type="button" aria-label="Previous month"
                  className="hover:bg-secondary flex size-8 items-center justify-center rounded-lg"
                  onClick={() => shift(-1)}>
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" aria-label="Next month"
                  className="hover:bg-secondary flex size-8 items-center justify-center rounded-lg"
                  onClick={() => shift(1)}>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="text-muted-foreground py-1 text-xs">{w}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const key = ymd(d);
          const count = countByDate.get(key) ?? 0;
          const isSelected = key === selectedDate;
          const isToday = key === today;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(key)}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : count > 0
                    ? "bg-accent/10 hover:bg-accent/20"
                    : "hover:bg-secondary",
                isToday && !isSelected && "ring-1 ring-accent/50",
              )}
            >
              <span>{d.getDate()}</span>
              {count > 0 && (
                <span className={cn(
                  "mt-0.5 rounded-full px-1.5 text-[10px] leading-4",
                  isSelected ? "bg-primary-foreground/20" : "bg-accent text-white",
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
