"use client";

import Image, { type ImageProps } from "next/image";
import { cloudinaryLoader, isCloudinaryUrl } from "@/lib/imageUrls";

/**
 * next/image, with Cloudinary photos delivered by Cloudinary itself. It has to
 * be a client component because the loader is a function, and functions can't
 * cross from server to client components.
 */
export function SiteImage({ src, alt, ...props }: Omit<ImageProps, "src" | "loader"> & { src: string }) {
  return <Image src={src} alt={alt} loader={isCloudinaryUrl(src) ? cloudinaryLoader : undefined} {...props} />;
}
