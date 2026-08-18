import { sendInquiryEmail } from "@/lib/email";

type CateringInquiryBody = {
  name: string;
  phone: string;
  email: string;
  eventDate: string;
  guestCount: string;
  eventType: string;
  packageTier?: string;
  message?: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: CateringInquiryBody;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Невалидно тяло на заявката." }, { status: 400 });
  }

  const { name, phone, email, eventDate, guestCount, eventType, packageTier, message } = body ?? {};

  if (
    !isNonEmptyString(name) ||
    !isNonEmptyString(phone) ||
    !isNonEmptyString(email) ||
    !isNonEmptyString(eventDate) ||
    !isNonEmptyString(guestCount) ||
    !isNonEmptyString(eventType)
  ) {
    return Response.json({ error: "Моля, попълнете всички задължителни полета." }, { status: 400 });
  }

  const subject = `Ново запитване за кетъринг — ${name}`;
  const text = [
    `Име: ${name}`,
    `Телефон: ${phone}`,
    `Имейл: ${email}`,
    `Дата на събитието: ${eventDate}`,
    `Брой гости: ${guestCount}`,
    `Тип събитие: ${eventType}`,
    `Избран пакет: ${isNonEmptyString(packageTier) ? packageTier : "—"}`,
    `Съобщение: ${isNonEmptyString(message) ? message : "—"}`,
  ].join("\n");

  try {
    await sendInquiryEmail({ subject, text });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Възникна грешка при изпращането на запитването." }, { status: 500 });
  }
}
