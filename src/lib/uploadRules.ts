export const MAX_UPLOAD_MB = 20;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

/** What Cloudinary accepts; signed into every upload (JPEG is reported as "jpg"). */
export const ALLOWED_CLOUDINARY_FORMATS = ["jpg", "jpeg", "png", "heic", "heif", "webp"];

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "heic", "heif", "webp"];

/** For <input type="file">. Extensions too, because some phones report HEIC with no MIME type. */
export const UPLOAD_ACCEPT = [...ALLOWED_MIME_TYPES, ...ALLOWED_EXTENSIONS.map((ext) => `.${ext}`)].join(",");

/** The message to show the client, or null when the file may be uploaded. */
export function validateUploadFile(file: { name: string; type: string; size: number }): string | null {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_MIME_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(extension)) {
    return `„${file.name}“ не е поддържан формат. Приемаме JPEG, PNG, HEIC и WebP.`;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return `„${file.name}“ е твърде голям файл (${sizeMb} MB). Максимумът е ${MAX_UPLOAD_MB} MB.`;
  }
  return null;
}
