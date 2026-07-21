import { Container } from "@/components/ui/container";

function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Container className="max-w-3xl py-16">
      <h1 className="font-serif mb-2 text-4xl">{title}</h1>
      <p className="text-muted-foreground mb-10 text-sm">
        Last updated {new Date().getFullYear()}
      </p>
      <div className="flex flex-col gap-6 text-sm leading-relaxed [&_h2]:mt-4 [&_h2]:text-lg [&_p]:text-muted-foreground">
        {children}
      </div>
    </Container>
  );
}

export function TermsPage() {
  return (
    <LegalShell title="Terms of Service">
      <section>
        <h2>1. Agreement</h2>
        <p>
          By using Paulux you agree to these terms. Paulux provides booking,
          payment, and business-management software to spas and wellness
          businesses ("workspaces"). Each workspace is responsible for the
          services it offers to its own customers.
        </p>
      </section>
      <section>
        <h2>2. Accounts &amp; subscriptions</h2>
        <p>
          Workspaces may start on a free trial and subscribe to a paid plan.
          Fees are billed in advance and are non-refundable except where required
          by law. We may suspend a workspace for non-payment after a grace period.
        </p>
      </section>
      <section>
        <h2>3. Payments</h2>
        <p>
          Customer payments are processed by each workspace's own payment
          provider. Paulux does not hold customer funds. Workspaces are
          responsible for refunds and disputes relating to their services.
        </p>
      </section>
      <section>
        <h2>4. Acceptable use</h2>
        <p>
          Do not misuse the service, attempt to access other workspaces' data, or
          use Paulux for unlawful purposes.
        </p>
      </section>
      <section>
        <h2>5. Liability</h2>
        <p>
          The service is provided "as is". To the extent permitted by law, Paulux
          is not liable for indirect or consequential losses.
        </p>
      </section>
    </LegalShell>
  );
}

export function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <section>
        <h2>Data we process</h2>
        <p>
          To operate bookings we process names, emails, phone numbers, and
          booking/payment records. Payment card details are handled by the
          payment provider and are never stored on our servers.
        </p>
      </section>
      <section>
        <h2>Tenancy &amp; isolation</h2>
        <p>
          Each workspace's data is isolated. Workspace staff can only access their
          own workspace's records.
        </p>
      </section>
      <section>
        <h2>Cookies</h2>
        <p>
          We use a strictly-necessary session cookie to keep you signed in and a
          CSRF cookie to protect requests. We do not use advertising cookies.
        </p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal
          data by contacting the workspace you booked with, or Paulux support.
        </p>
      </section>
      <section>
        <h2>Retention</h2>
        <p>
          We retain booking and payment records for as long as needed to provide
          the service and meet legal/accounting obligations.
        </p>
      </section>
    </LegalShell>
  );
}
