// Browser side of an upload: ask our server for a signature, then send the file
// straight to Cloudinary. The file never passes through the app server.

import type { UploadFolder, UploadSignature } from "@/lib/cloudinary";

export type UploadedImage = {
  publicId: string;
  width: number;
  height: number;
  cloudName: string;
};

const NO_CONNECTION = "Няма връзка с интернет. Проверете връзката и опитайте отново.";

async function fetchSignature(folder: UploadFolder): Promise<UploadSignature> {
  let response: Response;
  try {
    response = await fetch("/api/upload-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
  } catch {
    throw new Error(NO_CONNECTION);
  }
  if (response.status === 401) {
    throw new Error("Сесията ви е изтекла. Влезте отново и опитайте пак.");
  }
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? "Неуспешно качване. Опитайте отново.");
  }
  return response.json();
}

function describeCloudinaryError(message: string | undefined): string {
  if (message && /file size too large/i.test(message)) {
    return "Файлът е по-голям от позволеното от плана в Cloudinary. Изберете по-малък файл.";
  }
  if (message && /(megapixels|resolution).*(too|exceed)|too large.*(megapixels|resolution)/i.test(message)) {
    return "Снимката е с твърде висока резолюция за плана в Cloudinary. Изберете по-малка снимка.";
  }
  if (message && /format not allowed|invalid image file/i.test(message)) {
    return "Файлът не е валидна снимка в JPEG, PNG, HEIC или WebP.";
  }
  return message ? `Cloudinary отказа файла: ${message}` : "Неуспешно качване. Опитайте отново.";
}

export async function uploadImage(
  file: File,
  folder: UploadFolder,
  onProgress: (percent: number) => void,
): Promise<UploadedImage> {
  const { cloudName, apiKey, signature, params } = await fetchSignature(folder);

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("signature", signature);
  for (const [key, value] of Object.entries(params)) {
    form.append(key, String(value));
  }

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    request.responseType = "json";

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    request.onerror = () => reject(new Error(NO_CONNECTION));
    request.ontimeout = () => reject(new Error(NO_CONNECTION));
    request.onload = () => {
      const body = request.response;
      if (request.status >= 200 && request.status < 300 && body?.public_id) {
        resolve({ publicId: body.public_id, width: body.width, height: body.height, cloudName });
      } else {
        reject(new Error(describeCloudinaryError(body?.error?.message)));
      }
    };

    request.send(form);
  });
}
