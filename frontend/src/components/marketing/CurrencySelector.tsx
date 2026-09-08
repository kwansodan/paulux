import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";

interface CurrencySelectorProps {
  compact?: boolean;
  className?: string;
}

export default function CurrencySelector({ compact = false, className = "" }: CurrencySelectorProps) {
  const { currency, config, setCurrency, currencies } = useCurrency();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-secondary/60 px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary hover:border-border focus:outline-none focus:ring-1 focus:ring-accent"
        aria-label="Select currency"
        aria-expanded={open}
      >
        <span className="text-sm leading-none">{config.flag}</span>
        <span className="font-semibold tracking-wide">{config.code}</span>
        <span className="text-muted-foreground font-mono text-[11px]">({config.symbol})</span>
        <ChevronDown className={`size-3 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-1.5 w-56 origin-top-right rounded-xl border border-border/80 bg-popover p-1.5 shadow-xl ring-1 ring-black/5 focus:outline-none backdrop-blur-md">
          <div className="px-2.5 py-1.5 border-b border-border/50 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Globe className="size-3 text-accent" />
            <span>Select Currency</span>
          </div>
          <div className="max-h-64 overflow-y-auto py-1 space-y-0.5 scrollbar-thin">
            {currencies.map((curr) => {
              const isSelected = curr.code === currency;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => {
                    setCurrency(curr.code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    isSelected
                      ? "bg-accent/15 text-accent font-semibold"
                      : "text-foreground hover:bg-secondary/70"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{curr.flag}</span>
                    <div className="text-left">
                      <p className="leading-none">{curr.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{curr.code}</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold">{curr.symbol}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
