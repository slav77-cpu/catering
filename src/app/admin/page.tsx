import Link from "next/link";
import { PageTitle } from "@/components/admin/ui";
import { getAdminCounts } from "@/lib/admin/data";

export default async function AdminHomePage() {
  const counts = await getAdminCounts();

  const cards = [
    {
      href: "/admin/gallery",
      title: "Качи снимки от събитие",
      detail: `${counts.photos} снимки в галерията${counts.hiddenPhotos ? `, ${counts.hiddenPhotos} скрити` : ""}`,
    },
    {
      href: "/admin/menu",
      title: "Промени менюто и цените",
      detail: `${counts.items} артикула${counts.hiddenItems ? `, ${counts.hiddenItems} скрити` : ""}`,
    },
    {
      href: "/admin/menu/new",
      title: "Добави нов артикул",
      detail: "Име, цена, снимка и алергени",
    },
  ];

  return (
    <>
      <PageTitle title="Какво ще променяме?" />
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-line bg-white p-5 transition-shadow hover:shadow-md"
          >
            <p className="font-display text-xl text-ink-900">{card.title}</p>
            <p className="mt-1 text-sm text-ink-700">{card.detail}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
