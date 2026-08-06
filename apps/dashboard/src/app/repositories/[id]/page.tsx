import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RepositoryDetailClient from "./RepositoryDetailClient";
import { api } from "@/lib/api/client";
import { getUser } from "~/auth/repository";
import type { RepoRankRecord } from "@/lib/api/types";
import DefaultLayoutWrapper from "../../DefaultLayoutWrapper";

interface RepositoryPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    name?: string;
  }>;
}

export async function generateMetadata({
  params,
}: RepositoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const repoId = resolvedParams.id;
  const repoNumericId = Number.parseInt(repoId, 10);

  if (!/^\d+$/.test(repoId) || Number.isNaN(repoNumericId)) {
    return {
      title: "Repository Details",
      description: "Web3 repository analytics and metrics",
      robots: { index: false, follow: false },
    };
  }

  try {
    const rankListRes = await api.repos.getRankList();

    if (!rankListRes.success) {
      return {
        title: "Repository Details",
        description: "Web3 repository analytics and metrics",
        robots: { index: false, follow: false },
      };
    }

    const repo = rankListRes.data?.list.find(
      (item) => item.repo_id === repoNumericId,
    );

    if (!repo) {
      return {
        title: "Repository Details",
        description: "Web3 repository analytics and metrics",
        robots: { index: false, follow: false },
      };
    }

    const title = `${repo.repo_name} Repository Analytics`;
    const description = `Explore developer activity, contributors, growth, and community engagement for the ${repo.repo_name} Web3 repository.`;
    const url = `/repositories/${encodeURIComponent(repoId)}`;

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: { title, description, url, type: "website" },
      robots: { index: true, follow: true },
    };
  } catch (_error) {
    return {
      title: "Repository Details",
      description: "Web3 repository analytics and metrics",
      robots: { index: false, follow: false },
    };
  }
}

export default async function RepositoryDetailPage({
  params,
  searchParams,
}: RepositoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const repoId = resolvedParams.id;
  const repoNumericId = Number.parseInt(repoId, 10);
  const repoNameFromQuery = resolvedSearchParams.name;

  if (!repoId) {
    notFound();
  }

  if (Number.isNaN(repoNumericId)) {
    notFound();
  }

  const user = await getUser();

  async function fetchActiveDeveloperData(repoId: number) {
    try {
      const response = await api.repos.getActiveDeveloperList(repoId);
      if (response.success && response.data?.list) {
        return response.data.list;
      }
      return [];
    } catch (error) {
      console.error("Error fetching active developer data:", error);
      return [];
    }
  }

  let repoName: string;
  let repoRankData: RepoRankRecord | null;

  try {
    // If repo name is provided in query params, use it directly
    if (repoNameFromQuery) {
      repoName = repoNameFromQuery;
      // Create a minimal rank data object for consistency
      repoRankData = {
        repo_id: repoNumericId,
        repo_name: repoName,
        star_count: 0,
        forks_count: 0,
        open_issues_count: 0,
        contributor_count: 0,
      };
    } else {
      // Otherwise, try to fetch from rank list
      const rankListRes = await api.repos.getRankList();

      if (!rankListRes.success || !rankListRes.data) {
        throw new Error("Failed to fetch repository data");
      }

      repoRankData =
        rankListRes.data.list.find((repo) => repo.repo_id === repoNumericId) ||
        null;

      if (!repoRankData) {
        notFound();
      }

      repoName = repoRankData.repo_name;
    }

    try {
      const [repoDetailsRes, activeDevelopers] = await Promise.all([
        api.github.getRepoByName(repoName),
        fetchActiveDeveloperData(repoNumericId),
      ]);

      // Use GitHub API data as primary source for repository metrics
      let repositoryData: {
        id: number;
        name: string;
        starCount: number;
        forksCount: number;
        openIssuesCount: number;
        contributorCount: number;
        details: Record<string, unknown> | null;
      } = {
        id: repoRankData!.repo_id,
        name: repoName,
        starCount: repoRankData!.star_count,
        forksCount: repoRankData!.forks_count,
        openIssuesCount: repoRankData!.open_issues_count,
        contributorCount: 0, // Not displayed in UI
        details: null,
      };

      // If GitHub API call succeeded, use its data for metrics and details
      if (repoDetailsRes.success && repoDetailsRes.data) {
        const githubRepo = repoDetailsRes.data;
        repositoryData = {
          id: githubRepo.id,
          name: githubRepo.full_name,
          starCount: githubRepo.stargazers_count,
          forksCount: githubRepo.forks_count,
          openIssuesCount: githubRepo.open_issues_count,
          contributorCount: 0, // Not displayed in UI
          details: githubRepo as unknown as Record<string, unknown>, // Pass the entire GitHub repo object as details
        };
      }

      const pageData = {
        repository: repositoryData,
        activeDevelopers,
      };

      return (
        <DefaultLayoutWrapper user={user}>
          <RepositoryDetailClient {...pageData} />
        </DefaultLayoutWrapper>
      );
    } catch (error) {
      console.error(`[Route] Error fetching repository details:`, error);

      // Return basic data even if detailed fetches fail
      const pageData = {
        repository: {
          id: repoRankData!.repo_id,
          name: repoName,
          starCount: repoRankData!.star_count,
          forksCount: repoRankData!.forks_count,
          openIssuesCount: repoRankData!.open_issues_count,
          contributorCount: 0, // Not displayed in UI
          details: null,
        },
        activeDevelopers: await fetchActiveDeveloperData(repoNumericId),
      };

      return (
        <DefaultLayoutWrapper user={user}>
          <RepositoryDetailClient {...pageData} />
        </DefaultLayoutWrapper>
      );
    }
  } catch (error) {
    console.error("Error in repository detail route:", error);
    notFound();
  }
}
