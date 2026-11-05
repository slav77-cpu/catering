"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="min-h-11 rounded-full px-3 text-sm font-medium text-ink-700 hover:text-pink-700"
    >
      Изход
    </button>
  );
}
