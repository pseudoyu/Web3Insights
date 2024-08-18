import {
	Button,
	Image,
	Input,
	Select,
	SelectItem,
	Link,
	Card,
	CardBody,
	CardHeader,
	Divider,
} from "@nextui-org/react";
import { json, type MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Search, ExternalLink, Award, Sparkles } from "lucide-react";
// @ts-expect-error 'Sparkles' is defined but never used.
import { prisma } from "~/prisma.server";
import Logo from "../images/logo.png";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "~/components/Footer";

export const meta: MetaFunction = () => [
	{ title: "Claim Reward - Web3Insights" },
	{ property: "og:title", content: "Claim Reward - Web3Insights" },
	{
		name: "description",
		content: "Claim your reward for contributing to Web3 projects.",
	},
];

export const loader = async () => {
	const projects = await prisma.project.findMany({
		select: { id: true, name: true },
	});
	return json({ projects });
};

export const action = async ({ request }: { request: Request }) => {
	const formData = await request.formData();
	const projectId = formData.get("projectId") as string;
	const githubHandle = formData.get("githubHandle") as string;

	if (!projectId || !githubHandle) {
		return json({ error: "Missing required fields" }, { status: 400 });
	}

	const project = await prisma.project.findUnique({ where: { id: projectId } });

	if (!project) {
		return json({ error: "Project not found" }, { status: 404 });
	}

	const rewardAmount = 10000; // Fixed reward amount for now

	return json({ project, githubHandle, rewardAmount });
};

export default function ClaimReward() {
	const { projects } = useLoaderData<typeof loader>();
	const fetcher = useFetcher<typeof action>();
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	// @ts-expect-error 'selectedProject' is assigned a value but never used.

	return (
		<div className="min-h-dvh flex flex-col">
			<div className="flex-grow flex items-center justify-center px-4 py-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-[640px] mx-auto"
				>
					<div className="space-y-2 text-center flex flex-col items-center">
						<motion.div
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 200 }}
							className="mb-8"
						>
							<Image src={Logo} width={128} alt="Web3Insights Logo" />
						</motion.div>
						<h1 className="text-2xl md:text-3xl font-bold">
							Claim Your Reward
						</h1>
					</div>

					<fetcher.Form method="POST" className="mt-8 space-y-4">
						<Select
							label="Select Project"
							placeholder="Choose a project"
							onChange={(e) => setSelectedProject(e.target.value)}
							name="projectId"
						>
							{projects.map((project) => (
								<SelectItem key={project.id} value={project.id}>
									{project.name}
								</SelectItem>
							))}
						</Select>

						<Input
							endContent={
								<Button
									isLoading={fetcher.state === "submitting"}
									startContent={
										fetcher.state === "submitting" ? null : (
											<Search size={16} strokeWidth={1.5} />
										)
									}
									size="sm"
									type="submit"
									color="primary"
									className="min-w-[40px]"
								>
									{fetcher.state === "submitting"
										? "Checking..."
										: "Check Eligibility"}
								</Button>
							}
							label="GitHub Handle"
							placeholder="Enter your GitHub handle"
							name="githubHandle"
							type="text"
							className="max-w-full"
						/>
					</fetcher.Form>

					<AnimatePresence>
						{fetcher.data && !("error" in fetcher.data) && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.5 }}
								className="mt-8"
							>
								<Card className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
									<CardHeader className="flex gap-3">
										<Award size={24} className="text-blue-500" />
										<div className="flex flex-col">
											<p className="text-md font-semibold">Reward Details</p>
											<p className="text-small text-gray-600">
												For {fetcher.data.project.name}
											</p>
										</div>
									</CardHeader>
									<Divider />
									<CardBody>
										<div className="space-y-2">
											<p>
												<span className="font-semibold">GitHub Handle:</span>{" "}
												{fetcher.data.githubHandle}
											</p>
											<p>
												<span className="font-semibold">Reward Amount:</span>{" "}
												{fetcher.data.rewardAmount} tokens
											</p>
										</div>
										<div className="flex gap-2 mt-4">
											<Button
												as={Link}
												href={`https://github.com/${fetcher.data.githubHandle}`}
												target="_blank"
												rel="noopener noreferrer"
												color="primary"
												variant="flat"
												endContent={<ExternalLink size={16} />}
											>
												View GitHub Profile
											</Button>
											<Button color="success" endContent={<Award size={16} />}>
												Claim Now
											</Button>
										</div>
									</CardBody>
								</Card>
							</motion.div>
						)}
					</AnimatePresence>

					{fetcher.data && "error" in fetcher.data && (
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							className="mt-4 text-red-500"
						>
							{fetcher.data.error}
						</motion.p>
					)}
				</motion.div>
			</div>
			<Footer />
		</div>
	);
}
