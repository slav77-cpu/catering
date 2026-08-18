import nodemailer from "nodemailer";

// Reads SMTP settings from env (see .env.example). Until the client
// answers open question #4 in the brief ("Заявките ... на имейл, през
// админ панел, или и двете?"), email is the default delivery channel —
// this helper is intentionally forgiving: if SMTP isn't configured yet
// (e.g. in local dev), it logs the submission instead of throwing, so
// the form still confirms to the user rather than failing outright.

type SendInquiryEmailInput = {
  subject: string;
  text: string;
};

export async function sendInquiryEmail({ subject, text }: SendInquiryEmailInput): Promise<{ delivered: boolean }> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, INQUIRY_TO_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !INQUIRY_TO_EMAIL) {
    console.warn(
      "[email] SMTP env vars not configured — logging submission instead of sending.\n" +
        `Subject: ${subject}\n${text}`
    );
    return { delivered: false };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: SMTP_USER,
    to: INQUIRY_TO_EMAIL,
    subject,
    text,
  });

  return { delivered: true };
}
