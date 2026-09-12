import type { Metadata } from "next";
import { Dashboard } from "@/components/admin/Dashboard";
import { createSupabaseServerClient } from "@/lib/supabase";
import {
  fetchAllContent,
  fetchLeads,
  fetchPricingConfig,
} from "@/lib/supabase/data";
import type { Lead, PricingConfig, SiteContent } from "@/types/database";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const client = await createSupabaseServerClient();

  let envReady = false;
  let leads: Lead[] = [];
  let pricing: PricingConfig | null = null;
  let content: SiteContent[] = [];

  if (client) {
    envReady = true;
    [leads, pricing, content] = await Promise.all([
      fetchLeads(client, "all"),
      fetchPricingConfig(client),
      fetchAllContent(client),
    ]);
  }

  return (
    <Dashboard
      envReady={envReady}
      initialLeads={leads}
      initialPricing={pricing}
      initialContent={content}
    />
  );
}