import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-brand-900">
            Nieto Green Care
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Panel de control · Inicia sesión para continuar
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}