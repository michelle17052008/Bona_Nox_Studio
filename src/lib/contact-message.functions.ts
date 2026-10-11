import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const contactMessageSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
  type: z.enum(["contact", "custom_order"]),
  website: z.string().max(200).optional(),
});

const messageIdSchema = z.object({ id: z.string().uuid() });

export const submitContactMessage = createServerFn({ method: "POST" })
  .validator((input: unknown) => contactMessageSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.website?.trim()) return { emailSent: true };

    const [{ supabaseAdmin }, { sendContactNotification }] = await Promise.all([
      import("@/integrations/supabase/client.server"),
      import("./contact-email.server"),
    ]);

    const { data: saved, error } = await supabaseAdmin
      .from("contact_messages")
      .insert({
        name: data.name,
        email: data.email,
        message: data.message,
        type: data.type,
        status: "new",
        email_status: "pending",
        handled: false,
      })
      .select("id")
      .single();

    if (error || !saved) {
      console.error("Failed to save contact message", error);
      throw new Error("The message could not be saved. Please try again.");
    }

    const message = { ...data, id: saved.id };

    try {
      await sendContactNotification(message);
      const { error: updateError } = await supabaseAdmin
        .from("contact_messages")
        .update({
          email_status: "sent",
          email_sent_at: new Date().toISOString(),
          email_error: null,
        })
        .eq("id", saved.id);

      if (updateError) console.error("Failed to record contact email delivery", updateError);
      return { emailSent: true };
    } catch (deliveryError) {
      console.error("Contact email delivery failed", deliveryError);
      const errorMessage = deliveryError instanceof Error
        ? deliveryError.message.slice(0, 500)
        : "Email delivery failed.";
      const { error: updateError } = await supabaseAdmin
        .from("contact_messages")
        .update({ email_status: "failed", email_error: errorMessage })
        .eq("id", saved.id);

      if (updateError) console.error("Failed to record contact email failure", updateError);
      return { emailSent: false };
    }
  });

export const retryContactMessageEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: unknown) => messageIdSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: message, error } = await context.supabase
      .from("contact_messages")
      .select("id, name, email, message, type, email_status")
      .eq("id", data.id)
      .maybeSingle();

    if (error || !message) throw new Error("Message not found or access denied.");
    if (message.email_status === "sent") return { emailSent: true };

    const { sendContactNotification } = await import("./contact-email.server");

    try {
      await sendContactNotification(message);
      const { error: updateError } = await context.supabase
        .from("contact_messages")
        .update({
          email_status: "sent",
          email_sent_at: new Date().toISOString(),
          email_error: null,
        })
        .eq("id", data.id);

      if (updateError) throw updateError;
      return { emailSent: true };
    } catch (deliveryError) {
      console.error("Contact email retry failed", deliveryError);
      const errorMessage = deliveryError instanceof Error
        ? deliveryError.message.slice(0, 500)
        : "Email delivery failed.";
      const { error: updateError } = await context.supabase
        .from("contact_messages")
        .update({ email_status: "failed", email_error: errorMessage })
        .eq("id", data.id);

      if (updateError) console.error("Failed to record contact email retry", updateError);
      return { emailSent: false };
    }
  });