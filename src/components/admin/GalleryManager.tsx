"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  addGalleryPhoto,
  deleteGalleryPhoto,
  moveGalleryPhoto,
  updateGalleryPhoto,
} from "@/app/admin/actions";
import { SiteImage } from "@/components/SiteImage";
import { ErrorMessage, Field, StatusBadge, buttonClass, callAction, iconButtonClass, inputClass } from "@/components/admin/ui";
import type { AdminPhoto, MoveDirection } from "@/lib/admin/types";
import { cloudinaryDeliveryUrl } from "@/lib/imageUrls";
import { uploadImage } from "@/lib/uploadClient";
import { MAX_UPLOAD_MB, UPLOAD_ACCEPT, validateUploadFile } from "@/lib/uploadRules";

// Enough to feel fast, few enough not to choke a phone on mobile data at an event.
const MAX_PARALLEL_UPLOADS = 3;

type UploadTask = {
  id: string;
  file: File;
  progress: number;
  status: "waiting" | "uploading" | "saving" | "failed";
  error?: string;
};

export function GalleryManager({ initialPhotos }: { initialPhotos: AdminPhoto[] }) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [tasks, setTasks] = useState<UploadTask[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const uploading = tasks.some((task) => task.status !== "failed");

  // Leaving mid-upload silently drops the rest of the queue, so warn first.
  useEffect(() => {
    if (!uploading) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [uploading]);

  function patchTask(id: string, patch: Partial<UploadTask>) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  }

  async function runTask(task: UploadTask) {
    patchTask(task.id, { status: "uploading", progress: 0, error: undefined });
    try {
      const uploaded = await uploadImage(task.file, "gallery", (progress) => patchTask(task.id, { progress }));
      patchTask(task.id, { status: "saving", progress: 100 });

      // Saved straight away (hidden), so a dropped connection while typing
      // descriptions can't lose a photo that already made it to Cloudinary.
      const result = await callAction(() =>
        addGalleryPhoto({
          publicId: uploaded.publicId,
          width: uploaded.width,
          height: uploaded.height,
          eventDate,
        }),
      );
      if (!result.ok) throw new Error(result.error);

      const photo = {
        ...result.data,
        src: result.data.src || cloudinaryDeliveryUrl(uploaded.cloudName, uploaded.publicId),
      };
      setPhotos((current) => [photo, ...current.filter((existing) => existing.id !== photo.id)]);
      setTasks((current) => current.filter((existing) => existing.id !== task.id));
    } catch (uploadError) {
      patchTask(task.id, {
        status: "failed",
        error: uploadError instanceof Error ? uploadError.message : "Неуспешно качване. Опитайте отново.",
      });
    }
  }

  async function runQueue(queue: UploadTask[]) {
    const remaining = [...queue];
    const worker = async () => {
      for (let task = remaining.shift(); task; task = remaining.shift()) {
        await runTask(task);
      }
    };
    await Promise.all(Array.from({ length: MAX_PARALLEL_UPLOADS }, worker));
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = ""; // so choosing the same file again still fires onChange
    if (files.length === 0) return;

    const problems: string[] = [];
    const queue: UploadTask[] = [];
    for (const file of files) {
      const problem = validateUploadFile(file);
      if (problem) problems.push(problem);
      else queue.push({ id: crypto.randomUUID(), file, progress: 0, status: "waiting" });
    }

    setRejected(problems);
    setTasks((current) => [...current, ...queue]);
    void runQueue(queue);
  }

  async function handleMove(photo: AdminPhoto, direction: MoveDirection) {
    setError("");
    const result = await callAction(() => moveGalleryPhoto(photo.id, direction));
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPhotos((current) => {
      const next = [...current];
      const from = next.findIndex((existing) => existing.id === photo.id);
      const to = from + (direction === "up" ? -1 : 1);
      if (from >= 0 && next[to]) [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  }

  async function handleDelete(photo: AdminPhoto) {
    const message = photo.isVisible
      ? "Да изтрия ли снимката завинаги? Ако искате само да я махнете от сайта, използвайте „Скрий“."
      : "Да изтрия ли снимката завинаги? Това не може да се отмени.";
    if (!window.confirm(message)) return;

    setError("");
    const result = await callAction(() => deleteGalleryPhoto(photo.id));
    if (result.ok) setPhotos((current) => current.filter((existing) => existing.id !== photo.id));
    else setError(result.error);
  }

  return (
    <div className="space-y-6">
      <section className="space-y-4 rounded-2xl border border-line bg-white p-4 sm:p-5">
        <Field label="Дата на събитието (по избор)" htmlFor="batch-event-date">
          <input
            id="batch-event-date"
            type="date"
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
            className={inputClass}
          />
        </Field>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept={UPLOAD_ACCEPT}
          onChange={handleFiles}
          className="sr-only"
          tabIndex={-1}
          aria-label="Избери снимки за качване"
          data-testid="gallery-file-input"
        />
        <button type="button" onClick={() => fileInput.current?.click()} className={`${buttonClass.primary} w-full`}>
          Избери снимки
        </button>
        <p className="text-xs text-ink-700">JPEG, PNG, HEIC или WebP, до {MAX_UPLOAD_MB} MB всяка.</p>

        {rejected.map((problem) => (
          <ErrorMessage key={problem}>{problem}</ErrorMessage>
        ))}

        {tasks.length > 0 && (
          <ul className="space-y-3" aria-label="Качване на снимки">
            {tasks.map((task) => (
              <UploadRow
                key={task.id}
                task={task}
                onRetry={() => void runTask(task)}
                onDismiss={() => setTasks((current) => current.filter((existing) => existing.id !== task.id))}
              />
            ))}
          </ul>
        )}
      </section>

      <ErrorMessage>{error}</ErrorMessage>

      {photos.length === 0 && tasks.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-700">
          Все още няма снимки. Качете първите от бутона по-горе.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {photos.map((photo, index) => (
            <li key={photo.id}>
              <PhotoCard
                photo={photo}
                isFirst={index === 0}
                isLast={index === photos.length - 1}
                onSaved={(saved) =>
                  setPhotos((current) =>
                    current.map((existing) =>
                      existing.id === saved.id ? { ...saved, src: saved.src || existing.src } : existing,
                    ),
                  )
                }
                onMove={(direction) => void handleMove(photo, direction)}
                onDelete={() => void handleDelete(photo)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UploadRow({
  task,
  onRetry,
  onDismiss,
}: {
  task: UploadTask;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  const statusText = {
    waiting: "Изчаква…",
    uploading: `${task.progress}%`,
    saving: "Запазване…",
    failed: "Неуспешно",
  }[task.status];

  return (
    <li data-testid="upload-row">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-ink-900">{task.file.name}</span>
        <span className="shrink-0 text-ink-700">{statusText}</span>
      </div>
      {task.status === "failed" ? (
        <div className="mt-2 space-y-2">
          <ErrorMessage>{task.error}</ErrorMessage>
          <div className="flex gap-2">
            <button type="button" onClick={onRetry} className={buttonClass.secondary}>
              Опитай пак
            </button>
            <button type="button" onClick={onDismiss} className={buttonClass.secondary}>
              Премахни
            </button>
          </div>
        </div>
      ) : (
        <div
          role="progressbar"
          aria-label={`Качване на ${task.file.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={task.progress}
          className="mt-1.5 h-2 overflow-hidden rounded-full bg-line/60"
        >
          <div className="h-full rounded-full bg-pink-600 transition-[width]" style={{ width: `${task.progress}%` }} />
        </div>
      )}
    </li>
  );
}

function PhotoCard({
  photo,
  isFirst,
  isLast,
  onSaved,
  onMove,
  onDelete,
}: {
  photo: AdminPhoto;
  isFirst: boolean;
  isLast: boolean;
  onSaved: (photo: AdminPhoto) => void;
  onMove: (direction: MoveDirection) => void;
  onDelete: () => void;
}) {
  const [alt, setAlt] = useState(photo.alt);
  const [caption, setCaption] = useState(photo.caption);
  const [eventDate, setEventDate] = useState(photo.eventDate);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");
  const altInput = useRef<HTMLTextAreaElement>(null);

  const missingAlt = alt.trim() === "";
  // Trimmed because the server stores trimmed text.
  const isDirty = alt.trim() !== photo.alt || caption.trim() !== photo.caption || eventDate !== photo.eventDate;

  // Text and visibility go together, so "show on site" right after typing can
  // never publish against an older description than the one on screen.
  async function save(isVisible: boolean) {
    setError("");
    setSaveState("saving");
    const result = await callAction(() => updateGalleryPhoto(photo.id, { alt, caption, eventDate, isVisible }));
    if (result.ok) {
      onSaved(result.data);
      setSaveState("saved");
    } else {
      setError(result.error);
      setSaveState("idle");
    }
  }

  function saveIfChanged() {
    if (isDirty && !(photo.isVisible && missingAlt)) void save(photo.isVisible);
  }

  function toggleVisibility() {
    if (!photo.isVisible && missingAlt) {
      setError("Напишете описание, преди да покажете снимката на сайта.");
      altInput.current?.focus();
      return;
    }
    void save(!photo.isVisible);
  }

  const altId = `alt-${photo.id}`;
  const captionId = `caption-${photo.id}`;
  const dateId = `date-${photo.id}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-white" data-testid="gallery-photo">
      <div className="relative aspect-[4/3] bg-line/40">
        {photo.src && (
          <SiteImage
            src={photo.src}
            alt={photo.alt || "Снимка без описание"}
            fill
            sizes="(min-width: 896px) 432px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        <div className="absolute left-2 top-2">
          {missingAlt && !photo.isVisible ? (
            <span className="inline-block rounded-full bg-pink-600 px-2.5 py-0.5 text-xs font-medium text-white">
              Липсва описание
            </span>
          ) : (
            <StatusBadge visible={photo.isVisible} label={photo.isVisible ? "На сайта" : "Скрита"} />
          )}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <Field
          label="Описание (задължително)"
          htmlFor={altId}
          hint="Какво се вижда на снимката — за незрящи посетители и за Google."
        >
          <textarea
            ref={altInput}
            id={altId}
            rows={2}
            value={alt}
            required
            aria-invalid={missingAlt}
            onChange={(event) => setAlt(event.target.value)}
            onBlur={saveIfChanged}
            className={inputClass}
          />
        </Field>
        <Field label="Надпис под снимката (по избор)" htmlFor={captionId}>
          <input
            id={captionId}
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            onBlur={saveIfChanged}
            className={inputClass}
          />
        </Field>
        <Field label="Дата на събитието" htmlFor={dateId}>
          <input
            id={dateId}
            type="date"
            value={eventDate}
            onChange={(event) => setEventDate(event.target.value)}
            onBlur={saveIfChanged}
            className={inputClass}
          />
        </Field>

        <ErrorMessage>{error}</ErrorMessage>
        <p aria-live="polite" className="min-h-4 text-xs text-ink-700">
          {saveState === "saving" && "Запазване…"}
          {saveState === "saved" && !isDirty && "Запазено"}
        </p>

        <button
          type="button"
          // Keeps focus in the text field. Otherwise the tap blurs it, the blur's save
          // clears any error above, the button shifts up under the finger, and the tap
          // misses it. The click itself saves the text, so nothing is lost.
          onMouseDown={(event) => event.preventDefault()}
          onClick={toggleVisibility}
          className={`${photo.isVisible ? buttonClass.secondary : buttonClass.primary} w-full`}
        >
          {photo.isVisible ? "Скрий от сайта" : "Покажи на сайта"}
        </button>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onMove("up")}
              disabled={isFirst}
              aria-label="Премести напред"
              className={iconButtonClass}
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMove("down")}
              disabled={isLast}
              aria-label="Премести назад"
              className={iconButtonClass}
            >
              ↓
            </button>
          </div>
          <button type="button" onClick={onDelete} className={buttonClass.danger}>
            Изтрий
          </button>
        </div>
      </div>
    </article>
  );
}
