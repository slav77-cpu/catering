import type { Metadata } from "next";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { PageTitle } from "@/components/admin/ui";
import { getAdminGallery } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Снимки" };

export default async function AdminGalleryPage() {
  const photos = await getAdminGallery();

  return (
    <>
      <PageTitle title="Снимки от събития" />
      <GalleryManager initialPhotos={photos} />
    </>
  );
}
