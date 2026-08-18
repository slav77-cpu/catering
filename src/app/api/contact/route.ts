import { sendInquiryEmail } from "@/lib/email";

type ContactBody = {
  name: string;
  email: string;
  message: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Невалидно тяло на заявката." }, { status: 400 });
  }

  const { name, email, message } = body ?? {};

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
    return Response.json({ error: "Моля, попълнете всички задължителни полета." }, { status: 400 });
  }

  const subject = `Ново съобщение от контактната форма — ${name}`;
  const text = [`Име: ${name}`, `Имейл: ${email}`, `Съобщение: ${message}`].join("\n");

  try {
    await sendInquiryEmail({ subject, text });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Възникна грешка при изпращането на съобщението." }, { status: 500 });
  }
}
