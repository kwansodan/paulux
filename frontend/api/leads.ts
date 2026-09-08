export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: { message: "Method not allowed" } });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const { name, businessName, email, phone, city, teamSize, message } = body;

    if (!email || !businessName || !name) {
      res.status(422).json({
        error: { message: "Name, business name, and email are required." },
      });
      return;
    }

    console.log("New Paulux Lead Received:", {
      name,
      businessName,
      email,
      phone,
      city,
      teamSize,
      message,
      timestamp: new Date().toISOString(),
    });

    const notifications: Promise<any>[] = [];

    // 1. Email notification via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const opsEmail = process.env.OPS_EMAIL || process.env.ADMIN_EMAIL;
    if (resendApiKey && opsEmail) {
      notifications.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.FROM_EMAIL || "Paulux Leads <onboarding@resend.dev>",
            to: [opsEmail],
            subject: `🚨 New Paulux Lead: ${businessName} (${name})`,
            html: `
              <h2>New Lead for Paulux Standalone Platform</h2>
              <table style="border-collapse: collapse; width: 100%; max-width: 600px; font-family: sans-serif;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee; width: 160px;"><strong>Contact Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${name}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Business Name:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${businessName}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone / WhatsApp:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone || "N/A"}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>City / Country:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${city || "N/A"}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Team Size:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${teamSize || "N/A"}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Specific Needs:</strong></td><td style="padding: 8px; border-bottom: 1px solid #eee;">${message || "N/A"}</td></tr>
              </table>
            `,
          }),
        }).catch((err) => console.error("Error dispatching Resend email:", err))
      );
    }

    // 2. SMS alert via Arkesel
    const arkeselApiKey = process.env.ARKESEL_API_KEY;
    const opsPhone = process.env.OPS_PHONE;
    if (arkeselApiKey && opsPhone) {
      notifications.push(
        fetch("https://sms.arkesel.com/api/v2/sms/send", {
          method: "POST",
          headers: {
            "api-key": arkeselApiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: process.env.ARKESEL_SENDER_ID || "Paulux",
            message: `New Paulux Lead: ${businessName} (${name}) - Contact: ${phone || email}. Notes: ${message || "N/A"}`,
            recipients: [opsPhone],
          }),
        }).catch((err) => console.error("Error dispatching Arkesel SMS:", err))
      );
    }

    await Promise.allSettled(notifications);

    res.status(201).json({
      success: true,
      message: "Quote inquiry received successfully. Our team will reach out shortly.",
    });
  } catch (err: any) {
    console.error("Failed to process lead:", err);
    res.status(500).json({
      error: { message: "Internal server error processing lead" },
    });
  }
}
