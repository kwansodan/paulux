import { cn } from "@/lib/utils";
import { Card } from "./card";

export function StatTile({
  label,
  value,
  hint,
  loading,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  loading?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("gap-2 py-5", className)}>
      <div className="px-6">
        <p className="text-muted-foreground text-xs font-medium tracking-luxe uppercase">
          {label}
        </p>
        <p className="font-serif mt-2 text-4xl leading-none font-medium">
          {loading ? "…" : value}
        </p>
        {hint && <p className="mt-2 text-xs text-accent">{hint}</p>}
      </div>
    </Card>
  );
}
