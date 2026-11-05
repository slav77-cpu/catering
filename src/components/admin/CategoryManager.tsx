"use client";

import { useState, type FormEvent } from "react";
import { createCategory, deleteCategory, moveCategory, updateCategory } from "@/app/admin/actions";
import { ErrorMessage, Field, StatusBadge, buttonClass, callAction, iconButtonClass, inputClass } from "@/components/admin/ui";
import type { ActionResult, AdminCategory } from "@/lib/admin/types";

export function CategoryManager({
  menuType,
  initialCategories,
}: {
  menuType: "RESTAURANT" | "CATERING";
  initialCategories: AdminCategory[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [error, setError] = useState("");

  /** Every category action returns the fresh list, so the screen always matches the database. */
  async function run(action: () => Promise<ActionResult<AdminCategory[]>>): Promise<boolean> {
    setError("");
    const result = await callAction(action);
    if (result.ok) {
      setCategories(result.data);
      return true;
    }
    setError(result.error);
    return false;
  }

  return (
    <div className="space-y-6">
      <ErrorMessage>{error}</ErrorMessage>
      <ul className="space-y-2">
        {categories.map((category) => {
          const siblings = categories.filter((other) => other.parentId === category.parentId);
          return (
            <li key={category.id} className={category.parentId ? "ml-5" : undefined}>
              <CategoryRow
                category={category}
                isFirst={siblings[0]?.id === category.id}
                isLast={siblings[siblings.length - 1]?.id === category.id}
                run={run}
                menuType={menuType}
              />
            </li>
          );
        })}
      </ul>
      <NewCategoryForm
        title="Нова категория"
        onCreate={(input) => run(() => createCategory(menuType, null, input))}
      />
    </div>
  );
}

function CategoryRow({
  category,
  isFirst,
  isLast,
  run,
  menuType,
}: {
  category: AdminCategory;
  isFirst: boolean;
  isLast: boolean;
  run: (action: () => Promise<ActionResult<AdminCategory[]>>) => Promise<boolean>;
  menuType: "RESTAURANT" | "CATERING";
}) {
  const [name, setName] = useState(category.name);
  const [note, setNote] = useState(category.note);
  const [addingChild, setAddingChild] = useState(false);

  function saveIfChanged() {
    // Trimmed because the server stores trimmed text.
    if ((name.trim() !== category.name || note.trim() !== category.note) && name.trim()) {
      void run(() => updateCategory(category.id, { name, note, isVisible: category.isVisible }));
    }
  }

  function handleDelete() {
    if (window.confirm(`Да изтрия ли категория „${category.name}“ завинаги?`)) {
      void run(() => deleteCategory(category.id));
    }
  }

  const contents =
    category.childCount > 0
      ? `${category.childCount} подкатегории`
      : `${category.itemCount} ${category.itemCount === 1 ? "артикул" : "артикула"}`;
  const isEmpty = category.itemCount === 0 && category.childCount === 0;

  return (
    <div className="space-y-3 rounded-2xl border border-line bg-white p-3 sm:p-4" data-testid="admin-category">
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-700">
        <StatusBadge visible={category.isVisible} label={category.isVisible ? "На сайта" : "Скрита"} />
        {contents}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Име" htmlFor={`category-name-${category.id}`}>
          <input
            id={`category-name-${category.id}`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={saveIfChanged}
            className={inputClass}
          />
        </Field>
        <Field label="Бележка (по избор)" htmlFor={`category-note-${category.id}`}>
          <input
            id={`category-note-${category.id}`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            onBlur={saveIfChanged}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            void run(() => updateCategory(category.id, { name, note, isVisible: !category.isVisible }))
          }
          className={buttonClass.secondary}
        >
          {category.isVisible ? "Скрий" : "Покажи"}
        </button>
        {!category.parentId && category.itemCount === 0 && (
          <button type="button" onClick={() => setAddingChild((value) => !value)} className={buttonClass.secondary}>
            + Подкатегория
          </button>
        )}
        {isEmpty && (
          <button type="button" onClick={handleDelete} className={buttonClass.danger}>
            Изтрий
          </button>
        )}
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => void run(() => moveCategory(category.id, "up"))}
            disabled={isFirst}
            aria-label={`Премести ${category.name} нагоре`}
            className={iconButtonClass}
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => void run(() => moveCategory(category.id, "down"))}
            disabled={isLast}
            aria-label={`Премести ${category.name} надолу`}
            className={iconButtonClass}
          >
            ↓
          </button>
        </div>
      </div>
      {addingChild && (
        <NewCategoryForm
          title={`Подкатегория на „${category.name}“`}
          onCreate={(input) => run(() => createCategory(menuType, category.id, input))}
        />
      )}
    </div>
  );
}

function NewCategoryForm({
  title,
  onCreate,
}: {
  title: string;
  onCreate: (input: { name: string; note: string }) => Promise<boolean>;
}) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (await onCreate({ name, note })) {
      setName("");
      setNote("");
    }
  }

  const formId = title.replace(/\W/g, "") || "new";

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-dashed border-line bg-white p-3 sm:p-4">
      <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Име" htmlFor={`new-name-${formId}-${title.length}`}>
          <input
            id={`new-name-${formId}-${title.length}`}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Бележка (по избор)" htmlFor={`new-note-${formId}-${title.length}`}>
          <input
            id={`new-note-${formId}-${title.length}`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <button type="submit" className={buttonClass.primary}>
        Добави
      </button>
    </form>
  );
}
