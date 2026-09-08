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
      title="404 - Page Not Found"
      message="The page you are looking for does not exist or has been moved."
      to={paths.home}
      cta="Back to Paulux Home"
    />
  );
}

