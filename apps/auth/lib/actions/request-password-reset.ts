"use server";

import { z } from "zod";
import { Resend } from "resend";

const emalSchema = z.object({ email: z.string().email().max(255) });
const resend = new Resend("...");

export async function requestPasswordReset(data: { email: string }) {
    const parsed = emalSchema.safeParse(data);
    if (!parsed.success) return { error: "Invalid email" };

    await resend.emails.send({
        from: "Veblex <noreply@veblex.com>",
        to: [parsed.data.email],
        subject: "Reset your Veblex password",
        html: `
            <p>Hi User,</p>
            <p>We received a request to reset the password for your Veblex account. Click the button below to choose a new password:</p>
            <p><a href="https://auth.veblex.com/reset-password?token=019eb271-8597-7456-b05a-f0c404b33278" target="_blank">Reset Password</a></p>
            <p>This link will expire in 5 minutes.</p>
            <p>If you did not request a password reset, you can safely ignore this email—your password will remain unchanged.</p>
            
            <p>Best regards, <br/>The Veblex Team</p>
        `,
    });

    // DB lookup, token creation, send email...
    // Always return success to avoid user enumeration
    return { success: true };
}
