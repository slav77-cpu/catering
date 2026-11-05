import "server-only";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryDeliveryUrl } from "@/lib/imageUrls";
import { ALLOWED_CLOUDINARY_FORMATS } from "@/lib/uploadRules";

export type UploadFolder = "gallery" | "menu";

export type UploadSignature = {
  cloudName: string;
  apiKey: string;
  signature: string;
  /** Every signed parameter. The browser must send them unchanged or Cloudinary rejects the upload. */
  params: Record<string, string | number>;
};

/** Full delivery URL for an asset, or undefined when Cloudinary isn't configured. */
export function cloudinaryUrl(publicId: string): string | undefined {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  return cloudName ? cloudinaryDeliveryUrl(cloudName, publicId) : undefined;
}

function readConfig() {
  const {
    CLOUDINARY_CLOUD_NAME: cloudName,
    CLOUDINARY_API_KEY: apiKey,
    CLOUDINARY_API_SECRET: apiSecret,
    CLOUDINARY_UPLOAD_PRESET: uploadPreset,
  } = process.env;
  if (!cloudName || !apiKey || !apiSecret || !uploadPreset) return null;
  return { cloudName, apiKey, apiSecret, uploadPreset };
}

/**
 * Signs one browser-to-Cloudinary upload. The secret stays here. allowed_formats
 * is part of the signature, so the browser can't widen the list of accepted formats.
 */
export function createUploadSignature(folder: UploadFolder): UploadSignature | null {
  const config = readConfig();
  if (!config) return null;

  const params = {
    allowed_formats: ALLOWED_CLOUDINARY_FORMATS.join(","),
    folder: `maka/${folder}`,
    timestamp: Math.round(Date.now() / 1000),
    upload_preset: config.uploadPreset,
  };

  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    signature: cloudinary.utils.api_sign_request(params, config.apiSecret),
    params,
  };
}

/**
 * Removes an asset after its database row is gone. Best effort: a failure leaves
 * an orphaned file in Cloudinary, which must not fail the client's delete.
 */
export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  const config = readConfig();
  if (!config) return;

  try {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
    await cloudinary.uploader.destroy(publicId, { invalidate: true });
  } catch (error) {
    console.error(`[cloudinary] could not delete ${publicId}`, error);
  }
}
