import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide",
  {
    variants: {
      tone: {
        neutral: "bg-secondary text-secondary-foreground",
        positive: "bg-sage text-sage-foreground",
        pending: "text-white [background:var(--orchid)]",
        info: "bg-accent/12 text-accent",
        danger: "bg-destructive/12 text-destructive",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

/** Map a domain status string to a brand tone. */
export function statusTone(
  status: string,
): NonNullable<VariantProps<typeof badgeVariants>["tone"]> {
  switch (status) {
    case "PAID":
    case "CONFIRMED":
    case "COMPLETED":
    case "ACTIVE":
      return "positive";
    case "PENDING":
    case "PARTIAL":
    case "PARTIALLY_REDEEMED":
    case "PENDING_PAYMENT":
      return "pending";
    case "CANCELLED":
    case "REFUNDED":
    case "EXPIRED":
    case "REDEEMED":
      return "muted";
    case "FAILED":
      return "danger";
    default:
      return "neutral";
  }
}

export function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

/** Convenience: a status pill that picks its tone from the status value. */
export function StatusBadge({ value }: { value: string }) {
  return <Badge tone={statusTone(value)}>{value.replace(/_/g, " ")}</Badge>;
}
