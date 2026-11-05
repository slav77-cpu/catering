// Safe for both server and client: no secrets, no SDK.

const DELIVERY_ORIGIN = "https://res.cloudinary.com";
const UPLOAD_SEGMENT = "/image/upload/";

export function cloudinaryDeliveryUrl(cloudName: string, publicId: string): string {
  return `${DELIVERY_ORIGIN}/${cloudName}${UPLOAD_SEGMENT}${encodeURI(publicId)}`;
}

export function isCloudinaryUrl(src: string): boolean {
  return src.startsWith(`${DELIVERY_ORIGIN}/`);
}

/**
 * next/image loader that asks Cloudinary for the exact width. Cloudinary picks
 * format and quality per device (f_auto,q_auto), which Next's own optimizer
 * can't do: it would fetch once from the server and re-encode the result.
 */
export function cloudinaryLoader({ src, width }: { src: string; width: number }): string {
  return src.replace(UPLOAD_SEGMENT, `${UPLOAD_SEGMENT}f_auto,q_auto,c_limit,w_${width}/`);
}
