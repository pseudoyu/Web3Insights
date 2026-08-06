import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/get-query-client";
import {
  prefetchEcosystems,
  prefetchStatistics,
} from "@/lib/query/server-prefetch";
import { getUser } from "~/auth/repository";
import DefaultLayoutWrapper from "../DefaultLayoutWrapper";
import EcosystemsPageClient from "./EcosystemsPageClient";

export const metadata: Metadata = {
  title: "Web3 Ecosystem Developer Analytics",
  description:
    "Compare Web3 ecosystems by developer activity, repository growth, contributor participation, and other transparent open-source signals.",
  alternates: { canonical: "/ecosystems" },
  openGraph: {
    title: "Web3 Ecosystem Developer Analytics | Web3Insight",
    description:
      "Compare Web3 ecosystems by developer activity, repository growth, contributor participation, and other transparent open-source signals.",
    url: "/ecosystems",
    type: "website",
  },
};

export default async function EcosystemsPage() {
  const user = await getUser();

  // Prefetch data for TanStack Query
  const queryClient = getQueryClient();

  await Promise.all([
    prefetchEcosystems(queryClient),
    prefetchStatistics(queryClient),
  ]);

  return (
    <DefaultLayoutWrapper user={user}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EcosystemsPageClient />
      </HydrationBoundary>
    </DefaultLayoutWrapper>
  );
}
