import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/get-query-client";
import { prefetchDonateRepos } from "@/lib/query/server-prefetch";
import { getUser } from "~/auth/repository";
import DefaultLayoutWrapper from "../../DefaultLayoutWrapper";
import X402PageClient from "./X402PageClient";

export const metadata: Metadata = {
  title: "Support Open-Source Web3 Projects with x402",
  description:
    "Discover and support open-source Web3 repositories with x402 USDC donations, or register a project to receive community funding.",
  alternates: { canonical: "/plaza/x402" },
  openGraph: {
    title: "Support Open-Source Web3 Projects with x402 | Web3Insight",
    description:
      "Discover and support open-source Web3 repositories with x402 USDC donations, or register a project to receive community funding.",
    url: "/plaza/x402",
    type: "website",
  },
};

export default async function X402Page() {
  // Get current user from session
  const user = await getUser();

  // Prefetch data for TanStack Query
  const queryClient = getQueryClient();
  await prefetchDonateRepos(queryClient);

  return (
    <DefaultLayoutWrapper user={user}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <X402PageClient />
      </HydrationBoundary>
    </DefaultLayoutWrapper>
  );
}
