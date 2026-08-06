import { api } from "@/lib/api/client";
import { getUser } from "~/auth/repository";
import DefaultLayoutWrapper from "../DefaultLayoutWrapper";
import YearlyReport from "~/report/views/yearly-report";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "2025 Web3 Developer Ecosystem Report",
  description:
    "Read the 2025 Web3 developer ecosystem report covering contributor growth, ecosystem participation, activity trends, and leading repositories.",
  alternates: { canonical: "/report" },
  openGraph: {
    title: "2025 Web3 Developer Ecosystem Report",
    description:
      "Read the 2025 Web3 developer ecosystem report covering contributor growth, ecosystem participation, activity trends, and leading repositories.",
    url: "/report",
    type: "website",
  },
};

export default async function ReportPage() {
  const user = await getUser();

  let reportData = null;
  try {
    const result = await api.rankings.getYearlyReport();
    reportData = result.success && result.data ? result.data : null;
  } catch (error) {
    console.error("Failed to fetch yearly report:", error);
  }

  return (
    <DefaultLayoutWrapper user={user}>
      <div className="w-full max-w-content mx-auto px-6 py-8">
        <YearlyReport data={reportData} />
      </div>
    </DefaultLayoutWrapper>
  );
}
