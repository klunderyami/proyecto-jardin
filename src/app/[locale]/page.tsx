import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { BUSINESS } from "@/lib/constants";
import { buildSmsLink } from "@/lib/constants";

type Params = Promise<{ locale: string }>;

export default async function HomePage({ params }: { params: Params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const c = await getTranslations("Common");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-8">
      {/* Hero */}
      <section className="flex flex-col gap-5">
        <span className="inline-flex w-fit items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-800">
          {t("badge")}
        </span>
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-brand-900">
            {c("brandName")}
          </h1>
          <p className="text-lg text-neutral-600">{t("heroTitle")}</p>
          <p className="text-sm leading-relaxed text-neutral-500">
            {t("heroSubtitle")}
          </p>
        </div>

        <Link
          href="/cotizar"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-brand-600/20 transition active:scale-[0.98]"
        >
          {t("heroCta")}
        </Link>

        <div className="flex flex-col gap-2 text-sm text-neutral-600">
          <a
            href={`tel:+1${BUSINESS.phone}`}
            className="inline-flex items-center gap-2 font-medium"
          >
            <Phone className="h-4 w-4 text-brand-600" aria-hidden />
            {c("call")}: {c("phoneDisplay")}
          </a>
          <a
            href={buildSmsLink()}
            className="inline-flex items-center gap-2 font-medium"
          >
            <MessageCircle className="h-4 w-4 text-brand-600" aria-hidden />
            SMS / WhatsApp
          </a>
          <a
            href={`mailto:${BUSINESS.email}`}
            className="inline-flex items-center gap-2 font-medium"
          >
            <Mail className="h-4 w-4 text-brand-600" aria-hidden />
            {BUSINESS.email}
          </a>
        </div>
      </section>

      {/* Servicios */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-neutral-900">
          {t("servicesTitle")}
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {([
            "mowing",
            "trimming",
            "hauling",
          ] as const).map((key) => (
            <li
              key={key}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700"
            >
              {t(`services.${key}`)}
            </li>
          ))}
        </ul>
      </section>

      {/* CTA final */}
      <section className="mt-10 rounded-2xl bg-brand-700 p-6 text-white">
        <h2 className="text-xl font-semibold">{t("ctaSectionTitle")}</h2>
        <p className="mt-2 text-sm text-brand-100">{t("ctaSectionDesc")}</p>
        <Link
          href="/cotizar"
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-900 transition active:scale-[0.98]"
        >
          {t("heroCta")}
        </Link>
      </section>

      <footer className="mt-10 border-t border-neutral-200 pt-5 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} {c("brandName")} · {c("rightsReserved")}
      </footer>
    </main>
  );
}