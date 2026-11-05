"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { deleteMenuItem, saveMenuItem } from "@/app/admin/actions";
import { SiteImage } from "@/components/SiteImage";
import { ErrorMessage, Field, buttonClass, callAction, inputClass } from "@/components/admin/ui";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { MenuItemDetails } from "@/components/menu/MenuDetailsPanel";
import { allergenLegend } from "@/data/allergens";
import type { MenuItem } from "@/data/types";
import type { AdminMenuImage, AdminMenuItem, CategoryOption } from "@/lib/admin/types";
import { cloudinaryDeliveryUrl } from "@/lib/imageUrls";
import { uploadImage } from "@/lib/uploadClient";
import { MAX_UPLOAD_MB, UPLOAD_ACCEPT, validateUploadFile } from "@/lib/uploadRules";

// The official fixed lev-to-euro rate.
const BGN_PER_EUR = 1.95583;

/** Phones in Bulgaria offer a comma on the decimal keypad, so accept both. */
function parsePrice(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (normalized === "") return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function MenuItemForm({
  item,
  menuType,
  categories,
}: {
  item: AdminMenuItem | null;
  menuType: "RESTAURANT" | "CATERING";
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(item?.categoryId ?? categories[0]?.id ?? "");
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [portion, setPortion] = useState(item?.portion ?? "");
  const [note, setNote] = useState(item?.note ?? "");
  const [priceEur, setPriceEur] = useState(item ? String(item.priceEur) : "");
  const [priceBgn, setPriceBgn] = useState(item ? String(item.priceBgn) : "");
  const [bgnEditedByHand, setBgnEditedByHand] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(item?.isVegetarian ?? false);
  const [isVisible, setIsVisible] = useState(item?.isVisible ?? true);
  const [allergens, setAllergens] = useState<number[]>(item?.allergens ?? []);
  const [image, setImage] = useState<AdminMenuImage | null>(item?.image ?? null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const listHref = menuType === "CATERING" ? "/admin/menu?type=catering" : "/admin/menu";
  const category = categories.find((option) => option.id === categoryId);
  const parentGroups = [...new Set(categories.flatMap((option) => (option.group ? [option.group] : [])))];

  function handleEurChange(value: string) {
    setPriceEur(value);
    const eur = parsePrice(value);
    if (!bgnEditedByHand && eur !== null) setPriceBgn((eur * BGN_PER_EUR).toFixed(2));
  }

  function toggleAllergen(code: number) {
    setAllergens((current) =>
      current.includes(code) ? current.filter((existing) => existing !== code) : [...current, code].sort((a, b) => a - b),
    );
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const problem = validateUploadFile(file);
    setUploadError(problem ?? "");
    if (problem) return;

    setUploadProgress(0);
    try {
      const uploaded = await uploadImage(file, "menu", setUploadProgress);
      setImage((current) => ({
        publicId: uploaded.publicId,
        width: uploaded.width,
        height: uploaded.height,
        alt: current?.alt ?? "",
        src: cloudinaryDeliveryUrl(uploaded.cloudName, uploaded.publicId),
      }));
    } catch (uploadFailure) {
      setUploadError(uploadFailure instanceof Error ? uploadFailure.message : "Неуспешно качване. Опитайте отново.");
    }
    setUploadProgress(null);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    const eur = parsePrice(priceEur);
    const bgn = parsePrice(priceBgn);
    if (eur === null || bgn === null) {
      setError("Въведете валидна цена в евро и в лева.");
      return;
    }
    if (image && !image.alt.trim()) {
      setError("Напишете описание на снимката.");
      return;
    }

    setSubmitting(true);
    const result = await callAction(() =>
      saveMenuItem(item?.id ?? null, {
        categoryId,
        name,
        description,
        portion,
        note,
        isVegetarian,
        priceEur: eur,
        priceBgn: bgn,
        allergens,
        image: image && { publicId: image.publicId, width: image.width, height: image.height, alt: image.alt },
        isVisible,
      }),
    );
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    const separator = listHref.includes("?") ? "&" : "?";
    router.push(`${listHref}${separator}saved=${encodeURIComponent(name.trim())}`);
  }

  async function handleDelete() {
    if (!item) return;
    const confirmed = window.confirm(
      `Да изтрия ли „${item.name}“ завинаги? Това не може да се отмени. Ако искате само да го махнете от сайта, използвайте „Покажи в сайта“.`,
    );
    if (!confirmed) return;

    setSubmitting(true);
    const result = await callAction(() => deleteMenuItem(item.id));
    if (result.ok) {
      router.push(listHref);
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  }

  const previewItem: MenuItem = {
    id: "preview",
    name: name.trim() || "Име на артикула",
    description: description.trim() || undefined,
    portion: portion.trim() || undefined,
    note: note.trim() || undefined,
    vegetarian: isVegetarian,
    priceEur: parsePrice(priceEur) ?? 0,
    priceBgn: parsePrice(priceBgn) ?? 0,
    allergens,
    imageUrl: image?.src ?? category?.fallbackPhotoUrl,
    imageAlt: image?.alt || name.trim() || "Преглед на артикула",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-line bg-white p-4 sm:p-5">
        <Field label="Име" htmlFor="item-name">
          <input
            id="item-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Категория" htmlFor="item-category">
          <select
            id="item-category"
            required
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className={inputClass}
          >
            {categories
              .filter((option) => !option.group)
              .map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            {parentGroups.map((group) => (
              <optgroup key={group} label={group}>
                {categories
                  .filter((option) => option.group === group)
                  .map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Цена в евро (€)" htmlFor="item-price-eur">
            <input
              id="item-price-eur"
              required
              inputMode="decimal"
              value={priceEur}
              onChange={(event) => handleEurChange(event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Цена в лева" htmlFor="item-price-bgn">
            <input
              id="item-price-bgn"
              required
              inputMode="decimal"
              value={priceBgn}
              onChange={(event) => {
                setBgnEditedByHand(true);
                setPriceBgn(event.target.value);
              }}
              className={inputClass}
            />
          </Field>
        </div>
        <p className="-mt-2 text-xs text-ink-700">Левовата цена се смята сама по курс 1.95583, но можете да я промените.</p>

        <Field label="Описание (по избор)" htmlFor="item-description">
          <textarea
            id="item-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Порция (по избор)" htmlFor="item-portion" hint="Например 600г или 330мл.">
          <input
            id="item-portion"
            value={portion}
            onChange={(event) => setPortion(event.target.value)}
            className={inputClass}
          />
        </Field>

        <fieldset>
          <legend className="mb-1 text-sm font-medium text-ink-900">Снимка (по избор)</legend>
          {image ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-line/40">
              <SiteImage
                src={image.src}
                alt={image.alt || "Нова снимка"}
                fill
                sizes="(min-width: 1024px) 500px, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <p className="text-sm text-ink-700">Без своя снимка артикулът показва снимката на категорията.</p>
          )}
          <input
            ref={fileInput}
            type="file"
            accept={UPLOAD_ACCEPT}
            onChange={handleFile}
            className="sr-only"
            tabIndex={-1}
            aria-label="Избери снимка на артикула"
            data-testid="item-file-input"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              disabled={uploadProgress !== null}
              className={buttonClass.secondary}
            >
              {uploadProgress !== null ? `Качване… ${uploadProgress}%` : image ? "Смени снимката" : "Качи снимка"}
            </button>
            {image && (
              <button type="button" onClick={() => setImage(null)} className={buttonClass.secondary}>
                Премахни снимката
              </button>
            )}
          </div>
          {uploadProgress !== null && (
            <div
              role="progressbar"
              aria-label="Качване на снимката"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={uploadProgress}
              className="mt-2 h-2 overflow-hidden rounded-full bg-line/60"
            >
              <div className="h-full rounded-full bg-pink-600" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
          <p className="mt-1 text-xs text-ink-700">JPEG, PNG, HEIC или WebP, до {MAX_UPLOAD_MB} MB.</p>
          {uploadError && (
            <div className="mt-2">
              <ErrorMessage>{uploadError}</ErrorMessage>
            </div>
          )}
          {image && (
            <div className="mt-3">
              <Field
                label="Описание на снимката (задължително)"
                htmlFor="item-image-alt"
                hint="Какво се вижда на снимката — за незрящи посетители и за Google."
              >
                <input
                  id="item-image-alt"
                  required
                  value={image.alt}
                  onChange={(event) => setImage({ ...image, alt: event.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend className="mb-1 text-sm font-medium text-ink-900">Алергени</legend>
          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
            {allergenLegend.map((allergen) => (
              <label key={allergen.code} className="flex min-h-11 items-center gap-3 text-sm text-ink-900">
                <input
                  type="checkbox"
                  checked={allergens.includes(allergen.code)}
                  onChange={() => toggleAllergen(allergen.code)}
                  className="h-5 w-5 accent-pink-700"
                />
                {allergen.name}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Бележка (по избор)" htmlFor="item-note" hint="Например изискване за предварителна резервация.">
          <input id="item-note" value={note} onChange={(event) => setNote(event.target.value)} className={inputClass} />
        </Field>

        <label className="flex min-h-11 items-center gap-3 text-sm text-ink-900">
          <input
            type="checkbox"
            checked={isVegetarian}
            onChange={(event) => setIsVegetarian(event.target.checked)}
            className="h-5 w-5 accent-pink-700"
          />
          Вегетарианско/веганско
        </label>
        <label className="flex min-h-11 items-center gap-3 text-sm text-ink-900">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(event) => setIsVisible(event.target.checked)}
            className="h-5 w-5 accent-pink-700"
          />
          Покажи в сайта
        </label>

        <ErrorMessage>{error}</ErrorMessage>

        <div className="flex flex-wrap gap-2">
          <button type="submit" disabled={submitting || uploadProgress !== null} className={`${buttonClass.primary} flex-1`}>
            {submitting ? "Запазване…" : "Запази"}
          </button>
          <button type="button" onClick={() => router.push(listHref)} className={buttonClass.secondary}>
            Отказ
          </button>
          {item && (
            <button type="button" onClick={() => void handleDelete()} disabled={submitting} className={buttonClass.danger}>
              Изтрий
            </button>
          )}
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-20" aria-label="Преглед" data-testid="item-preview">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-ink-900">Преглед: в менюто</h2>
          <div className="max-w-[260px]">
            <MenuItemCard item={previewItem} onOpen={() => {}} />
          </div>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold text-ink-900">Преглед: при докосване</h2>
          <div className="overflow-hidden rounded-3xl border border-line bg-white">
            <MenuItemDetails item={previewItem} />
          </div>
        </div>
      </aside>
    </div>
  );
}
