import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  const client = await createSupabaseServerClient();

  let user: { email?: string } | null = null;
  if (client) {
    const { data } = await client.auth.getUser();
    user = data.user;
  }

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold text-brand-800">
            Panel · Nieto Green Care
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-neutral-500 sm:inline">
              {user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  );
}