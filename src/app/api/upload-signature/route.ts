import { getAdmin } from "@/lib/auth";
import { createUploadSignature, type UploadFolder } from "@/lib/cloudinary";

const FOLDERS: UploadFolder[] = ["gallery", "menu"];

export async function POST(request: Request) {
  if (!(await getAdmin())) {
    return Response.json({ error: "Необходим е вход." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const folder = body?.folder;
  if (!FOLDERS.includes(folder)) {
    return Response.json({ error: "Невалидна папка." }, { status: 400 });
  }

  const signature = createUploadSignature(folder);
  if (!signature) {
    return Response.json(
      { error: "Качването на снимки не е настроено. Свържете се с разработчика." },
      { status: 503 },
    );
  }

  return Response.json(signature, { headers: { "Cache-Control": "no-store" } });
}
