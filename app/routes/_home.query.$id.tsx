import {
	json,
	LoaderFunctionArgs,
	MetaFunction,
	redirect,
} from "@remix-run/node";
import { useFetcher, useLoaderData, useParams } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { prisma } from "~/prisma.server";
import { useEventSource } from "remix-utils/sse/react";
import Markdown from "react-markdown";
import { Button, Code, Input, Skeleton, Spinner } from "@nextui-org/react";
import { Sparkles } from "lucide-react";
import { Footer } from "~/components/Footer";
import { getAuth } from "@clerk/remix/ssr.server";
import { useAtom } from "jotai";
import { signinModalOpenAtom } from "~/atoms";
import { ErrorType } from "./_home._index";
import OpenRankChart from "~/components/OpenRankChart";
import AttentionChart from "~/components/AttentionChart";
import ParticipantsChart from "~/components/ParticipantsChart";
import CommunityOpenRank from "~/components/CommunityOpenRank";
import axios from "axios";
import { isAddress } from "viem";
import { motion } from "framer-motion";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
	const title = data ? `${data.query} - Web3Insight` : "Web3Insight";
	const answer = data?.answer;

	return [
		{ title },
		{ property: "og:title", content: title },
		{
			name: "description",
			content: answer
				? `${answer.slice(0, 300)}...`
				: "A comprehensive metric system for evaluating Web3 open-source projects and developers.",
		},
	];
};

async function fetchOpenDiggerData(name: string, type: string) {
	const url = `${process.env.OPENDIGGER_URL}/${name}/${type}.json`;

	try {
		const response = await axios.get(url);
		const data = response.data;
		return data;
	} catch (error) {
		console.error(`Error fetching OpenDigger ${type} data:`, error);
		return null;
	}
}

async function fetchParticipantsData(repoName: string) {
	const baseUrl = `${process.env.OPENDIGGER_URL}/github`;
	try {
		const [participants, newContributors, inactiveContributors] =
			await Promise.all([
				fetch(`${baseUrl}/${repoName}/participants.json`).then((res) =>
					res.json(),
				),
				fetch(`${baseUrl}/${repoName}/new_contributors.json`).then((res) =>
					res.json(),
				),
				fetch(`${baseUrl}/${repoName}/inactive_contributors.json`).then((res) =>
					res.json(),
				),
			]);
		return { participants, newContributors, inactiveContributors };
	} catch (error) {
		console.error("Error fetching participants data:", error);
		return null;
	}
}

async function fetchCommunityOpenRankData(repoName: string) {
	const url = `${process.env.OPENDIGGER_URL}/github/${repoName}/community_openrank.json`;
	try {
		const response = await axios.get(url);
		const data = response.data;

		// Sort the months in descending order
		const sortedMonths = Object.keys(data.data).sort((a, b) =>
			b.localeCompare(a),
		);

		// Get the most recent 6 months
		const recentMonths = sortedMonths.slice(0, 6);

		// Create a new object with only the recent months' data
		const recentData = {};
		recentMonths.forEach((month) => {
			recentData[month] = data.data[month];
		});

		// Return the modified data object
		return {
			...data,
			data: recentData,
		};
	} catch (error) {
		console.error("Error fetching Community OpenRank data:", error);
		return null;
	}
}

export const loader = async (ctx: LoaderFunctionArgs) => {
	const auth = await getAuth(ctx);

	let history: {
		query: string;
		id: string;
	}[] = [];

	if (auth.userId) {
		history = await prisma.query.findMany({
			where: {
				owner: {
					clerkUserId: auth.userId,
				},
			},
			select: {
				id: true,
				query: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 10,
		});
	}

	const queryId = ctx.params.id as string;
	const query = await prisma.query.findUnique({
		where: {
			id: queryId,
		},
	});

	if (!query) {
		return redirect("/");
	}

	let openRankData = null;
	let attentionData = null;
	let participantsData = null;
	let communityOpenRankData = null;
	if (query.keyword) {
		const type =
			isAddress(query.keyword) || query.keyword.endsWith(".eth")
				? "evm"
				: query.keyword.includes("/")
					? "github_repo"
					: "github_user";

		if (type === "github_user" || type === "github_repo") {
			const openDiggerName = `github/${query.keyword}`;
			openRankData = await fetchOpenDiggerData(openDiggerName, "openrank");
			if (type === "github_repo") {
				attentionData = await fetchOpenDiggerData(openDiggerName, "attention");
				participantsData = await fetchParticipantsData(query.keyword);
				communityOpenRankData = await fetchCommunityOpenRankData(query.keyword);
			}
		}
	}

	return json({
		query: query?.query,
		answer: query?.answer,
		keyword: query.keyword,
		references: query?.references,
		history,
		openRankData,
		attentionData,
		participantsData,
		communityOpenRankData,
	});
};

function Placeholder() {
	return (
		<div>
			<div className="space-y-3">
				<Skeleton className="w-full h-3 rounded-full" />
				<Skeleton className="w-full h-3 rounded-full" />
				<Skeleton className="w-full h-3 rounded-full" />
			</div>
		</div>
	);
}

export default function QueryPage() {
	const loaderData = useLoaderData<typeof loader>();
	const params = useParams();

	const result = useEventSource(`/completion/${params.id}`);
	const fetcher = useFetcher<{ error: string; type: ErrorType }>();
	const errorMessage = fetcher.data?.error;
	const errorType = fetcher.data?.type;

	const asking = fetcher.state === "submitting";
	const [isChartLoading, setIsChartLoading] = useState(true);

	const parsedAnswer = useMemo(() => {
		return JSON.parse((result as string) || `{"content": ""}`).content;
	}, [result]);

	const [, setSigninModalOpen] = useAtom(signinModalOpenAtom);

	useEffect(() => {
		if (
			fetcher.state === "idle" &&
			errorMessage &&
			errorType === ErrorType.SigninNeeded
		) {
			setSigninModalOpen(true);
		}
	}, [fetcher.state, errorMessage, errorType, setSigninModalOpen]);

	useEffect(() => {
		if (
			loaderData.openRankData ||
			loaderData.attentionData ||
			loaderData.participantsData ||
			loaderData.communityOpenRankData
		) {
			const timer = setTimeout(() => setIsChartLoading(false), 1000);
			return () => clearTimeout(timer);
		}
	}, [
		loaderData.openRankData,
		loaderData.attentionData,
		loaderData.participantsData,
		loaderData.communityOpenRankData,
	]);

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
			<div className="max-w-[1200px] mx-auto px-6 md:px-0 pt-24 pb-12">
				<motion.h2
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="font-bold text-4xl mb-4 text-gray-800"
				>
					{loaderData.query}
				</motion.h2>
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="mb-6"
				>
					<Code size="sm" className="text-sm px-3 py-1" radius="full">
						{loaderData.keyword}
					</Code>
				</motion.div>

				<div className="flex flex-wrap -mx-3">
					{loaderData.openRankData && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="w-full md:w-1/2 px-3 mb-6"
						>
							<div className="bg-white rounded-xl shadow-lg p-6">
								{isChartLoading ? (
									<div className="flex justify-center items-center h-[400px]">
										<Spinner size="lg" color="primary" />
									</div>
								) : (
									<OpenRankChart
										data={loaderData.openRankData}
										repoName={loaderData.keyword}
									/>
								)}
							</div>
						</motion.div>
					)}

					{loaderData.attentionData && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.6 }}
							className="w-full md:w-1/2 px-3 mb-6"
						>
							<div className="bg-white rounded-xl shadow-lg p-6">
								{isChartLoading ? (
									<div className="flex justify-center items-center h-[400px]">
										<Spinner size="lg" color="primary" />
									</div>
								) : (
									<AttentionChart
										data={loaderData.attentionData}
										repoName={loaderData.keyword}
									/>
								)}
							</div>
						</motion.div>
					)}

					{loaderData.participantsData && (
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.5, delay: 0.8 }}
							className="w-full px-3 mb-6"
						>
							<div className="bg-white rounded-xl shadow-lg p-6">
								{isChartLoading ? (
									<div className="flex justify-center items-center h-[400px]">
										<Spinner size="lg" color="primary" />
									</div>
								) : (
									<ParticipantsChart
										data={loaderData.participantsData}
										repoName={loaderData.keyword}
									/>
								)}
							</div>
						</motion.div>
					)}

					{loaderData.communityOpenRankData &&
						loaderData.keyword &&
						loaderData.keyword.includes("/") && (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 1 }}
								className="w-full px-3 mb-6"
							>
								<div className="bg-white rounded-xl shadow-lg p-6">
									{isChartLoading ? (
										<div className="flex justify-center items-center h-[800px]">
											<Spinner size="lg" color="primary" />
										</div>
									) : (
										<CommunityOpenRank
											repoName={loaderData.keyword}
											graphData={loaderData.communityOpenRankData}
										/>
									)}
								</div>
							</motion.div>
						)}
				</div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 1 }}
					className="mt-10 bg-white rounded-xl shadow-lg p-6"
				>
					{!result && <Placeholder />}
					<div className="text-gray-800 leading-relaxed">
						<Markdown>{parsedAnswer}</Markdown>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 1.2 }}
					className="mt-12"
				>
					<fetcher.Form method="POST" action="/?index">
						<div className="flex gap-2 items-center">
							<Input
								placeholder="Ask a follow-up question..."
								variant="bordered"
								required
								name="query"
								type="text"
								className="flex-grow"
							/>
							<Button
								isLoading={asking}
								startContent={asking ? null : <Sparkles />}
								type="submit"
								color="primary"
							>
								Ask
							</Button>
						</div>
					</fetcher.Form>
				</motion.div>
			</div>

			<Footer />
		</div>
	);
}
