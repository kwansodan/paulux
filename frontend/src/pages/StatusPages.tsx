import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { paths } from "@/router/paths";

function Centered({
  title,
  message,
  to,
  cta,
}: {
  title: string;
  message: string;
  to: string;
  cta: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground max-w-md">{message}</p>
      <Button asChild>
        <Link to={to}>{cta}</Link>
      </Button>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <Centered
      title="404"
      message="This page could not be found."
      to={paths.home}
      cta="Go home"
    />
  );
}

export function UnauthorizedPage() {
  return (
    <Centered
      title="Not authorized"
      message="You don't have permission to view this page."
      to={paths.dashboard}
      cta="Back to dashboard"
    />
  );
}

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground text-sm">
        This section is implemented in Phase 2.
      </p>
    </div>
  );
}
