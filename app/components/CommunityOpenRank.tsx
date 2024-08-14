import { FC, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectItem } from "@nextui-org/react";

interface CommunityOpenRankProps {
	repoName: string;
	graphData: GraphData;
}

interface GraphData {
	meta: {
		nodes: [string, string][];
		retentionFactor: number;
		repoName: string;
	};
	data: {
		[key: string]: {
			nodes: [number, number, number][];
			links: [number, number, number][];
		};
	};
}

const typeMap = new Map([
	["r", "repo"],
	["i", "issue"],
	["p", "pull"],
	["u", "user"],
]);

const CommunityOpenRank: FC<CommunityOpenRankProps> = ({
	repoName,
	graphData,
}) => {
	const [selectedNode, setSelectedNode] = useState<string | null>(null);
	const [selectedMonth, setSelectedMonth] = useState<string>("");
	const [availableMonths, setAvailableMonths] = useState<string[]>([]);

	useEffect(() => {
		if (graphData?.data) {
			const months = Object.keys(graphData.data).sort((a, b) =>
				b.localeCompare(a),
			);
			const recentMonths = months.slice(0, 6);
			setAvailableMonths(recentMonths);
			setSelectedMonth(recentMonths[0]);
		}
	}, [graphData]);

	const getChartOption = (graphData: GraphData, month: string) => {
		if (!graphData?.data[month]) return {};

		const data = graphData.data[month];
		const nodes = data.nodes.map((node) => {
			const id = graphData.meta.nodes[node[0]][0];
			const type = typeMap.get(id[0]);
			let name = graphData.meta.nodes[node[0]][1];
			if (type === "pull") name = `#${id.slice(1)}`;
			else if (type === "issue")
				name = `#${Number.parseInt(id.slice(1)).toString(36).toUpperCase()}`;
			return {
				id,
				initialValue: node[1],
				value: node[2],
				name,
				symbolSize: Math.log(node[2] + 1) * 10,
				category: type,
			};
		});

		const links = data.links.map((link) => ({
			source: graphData.meta.nodes[link[0]][0],
			target: graphData.meta.nodes[link[1]][0],
			value: link[2],
		}));

		nodes.forEach((node) => {
			if (node.category === "issue" || node.category === "pull") {
				links.push({
					source: graphData.meta.nodes[0][0],
					target: node.id,
					value: 0.05,
				});
			}
		});

		const categories = Array.from(typeMap.values());

		return {
			title: {
				text: `Community OpenRank Network - ${month}`,
				top: "bottom",
				left: "center",
			},
			legend: [{ data: categories }],
			tooltip: { trigger: "item" },
			series: [
				{
					name: "Collaborative graph",
					type: "graph",
					layout: "force",
					data: nodes,
					links: links,
					categories: categories.map((c) => ({ name: c })),
					roam: true,
					label: {
						position: "right",
						show: true,
					},
					force: {
						layoutAnimation: false,
						repulsion: 300,
					},
				},
			],
		};
	};

	const renderLeaderboard = (graphData: GraphData, month: string) => {
		if (!graphData?.data[month]) return null;

		const data = graphData.data[month];
		const users = data.nodes
			.map((node) => ({
				id: graphData.meta.nodes[node[0]][0],
				value: node[2],
				login: graphData.meta.nodes[node[0]][1],
			}))
			.filter((n) => n.id[0] === "u")
			.sort((a, b) => b.value - a.value);

		return (
			<div className="bordered p-4 h-[500px] overflow-y-auto">
				<div className="scrollit h-[440px]">
					<table className="w-full border-collapse text-sm">
						<tbody>
							{users.map((user, index) => (
								<tr
									key={user.id}
									className={`transition-colors duration-200 ease-in-out ${
										index % 2 === 0 ? "bg-[#D6EEEE]" : ""
									} hover:bg-blue-100 cursor-pointer`}
									onClick={() => setSelectedNode(user.id)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											setSelectedNode(user.id);
										}
									}}
									tabIndex={0}
									role="button"
								>
									<td className="border p-1">
										<a
											href={`https://github.com/${user.login}`}
											target="_blank"
											rel="noopener noreferrer"
											className="hover:text-blue-600 hover:underline"
										>
											{user.login}
										</a>
									</td>
									<td className="border p-1">{user.value.toFixed(3)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		);
	};

	const renderDetails = (
		graphData: GraphData,
		month: string,
		selectedNode: string | null,
	) => {
		if (!graphData?.data[month] || !selectedNode) return null;

		const data = graphData.data[month];
		const index = graphData.meta.nodes.findIndex((i) => i[0] === selectedNode);
		const selfNode = data.nodes.find((i) => i[0] === index);
		const other = data.links
			.filter((l) => l[1] === index)
			.map((l) => {
				const sourceIndex = l[0];
				const sourceNode = graphData.meta.nodes[sourceIndex];
				const sourceValue = data.nodes.find((i) => i[0] === sourceIndex);
				const type = typeMap.get(sourceNode[0][0]);
				let name = sourceNode[1];
				if (type === "pull")
					name = `#${sourceNode[0].slice(1)} ${sourceNode[1]}`;
				else if (type === "issue")
					name = `#${Number.parseInt(sourceNode[0].slice(1))
						.toString(36)
						.toUpperCase()} ${sourceNode[1]}`;
				return [
					name,
					((1 - graphData.meta.retentionFactor) * l[2]).toFixed(3),
					sourceValue ? sourceValue[2].toFixed(3) : "N/A",
					sourceValue
						? (
								(1 - graphData.meta.retentionFactor) *
								l[2] *
								sourceValue[2]
							).toFixed(3)
						: "N/A",
				];
			})
			.sort((a, b) => Number.parseFloat(b[3]) - Number.parseFloat(a[3]));

		const repoNode = data.nodes.find((i) => i[0] === 0);
		other.push([
			graphData.meta.repoName,
			(1 / (data.nodes.length - 1)).toFixed(3),
			repoNode ? repoNode[2].toFixed(3) : "N/A",
			repoNode
				? ((1 / (data.nodes.length - 1)) * repoNode[2]).toFixed(3)
				: "N/A",
		]);

		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 20 }}
				className="bordered p-4 h-[340px] overflow-y-auto"
			>
				<div className="scrollit h-[280px]">
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr>
								<th className="border p-1">From</th>
								<th className="border p-1">Ratio</th>
								<th className="border p-1">Value</th>
								<th className="border p-1">OpenRank</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="border p-1">Self</td>
								<td className="border p-1">
									{graphData.meta.retentionFactor.toFixed(3)}
								</td>
								<td className="border p-1">
									{selfNode ? selfNode[1].toFixed(3) : "N/A"}
								</td>
								<td className="border p-1">
									{selfNode
										? (graphData.meta.retentionFactor * selfNode[1]).toFixed(3)
										: "N/A"}
								</td>
							</tr>
							{other.map((row, index) => (
								<tr
									key={`${row[0]}-${index}`}
									className={index % 2 === 0 ? "bg-[#D6EEEE]" : ""}
								>
									<td className="border p-1">{row[0]}</td>
									<td className="border p-1">{row[1]}</td>
									<td className="border p-1">{row[2]}</td>
									<td className="border p-1">{row[3]}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</motion.div>
		);
	};

	return (
		<div className="flex flex-col">
			<h1 className="text-2xl font-bold text-center mb-6">
				Community OpenRank for {repoName}
			</h1>
			<div className="mb-4">
				<Select
					label="Select Month"
					placeholder="Select a month"
					selectedKeys={[selectedMonth]}
					onChange={(e) => setSelectedMonth(e.target.value)}
					className="max-w-xs mx-auto"
					size="sm"
					variant="bordered"
					color="primary"
				>
					{availableMonths.map((month) => (
						<SelectItem key={month} value={month}>
							{month}
						</SelectItem>
					))}
				</Select>
			</div>
			<div className="flex mb-4">
				<div className="w-1/2 pr-2">
					{renderLeaderboard(graphData, selectedMonth)}
				</div>
				<div className="w-1/2 pl-2 h-[500px] bordered">
					<ReactECharts
						option={getChartOption(graphData, selectedMonth)}
						style={{ height: "100%" }}
						onEvents={{
							click: (params: { data?: { id?: string } }) => {
								if (params.data?.id) {
									setSelectedNode(params.data.id);
								}
							},
						}}
					/>
				</div>
			</div>
			<hr className="border-t border-gray-300 my-4" />
			<AnimatePresence>
				{selectedNode && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
					>
						{renderDetails(graphData, selectedMonth, selectedNode)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default CommunityOpenRank;
