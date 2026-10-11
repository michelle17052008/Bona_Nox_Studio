const CONTACT_EMAIL = "bonanox.studio@outlook.com";

export interface ContactEmailMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  type: string;
}

export async function sendContactNotification(message: ContactEmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Resend email configuration is missing.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `contact-${message.id}-${crypto.randomUUID()}`,
    },
    body: JSON.stringify({
      from,
      to: [CONTACT_EMAIL],
      reply_to: message.email,
      subject: `New Bona Nox ${message.type === "custom_order" ? "project request" : "contact message"} from ${message.name.replace(/[\r\n]/g, " ")}`,
      text: [
        `Name: ${message.name}`,
        `Email: ${message.email}`,
        `Type: ${message.type}`,
        "",
        message.message,
      ].join("\n"),
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Resend rejected the message (HTTP ${response.status}).`);
  }
}