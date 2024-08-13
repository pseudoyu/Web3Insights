import { FC, useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

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

	useEffect(() => {
		if (graphData?.data) {
			const firstMonth = Object.keys(graphData.data)[0];
			setSelectedMonth(firstMonth);
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
				text: `Community OpenRank for ${repoName} in ${month}`,
				top: "bottom",
				left: "right",
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
			<div className="bordered p-4 h-[400px] overflow-y-auto">
				<h2 className="text-center text-xl mb-4">Leaderboard</h2>
				<div className="scrollit h-[340px]">
					<table className="w-full border-collapse text-sm">
						<tbody>
							{users.map((user, index) => (
								<tr
									key={user.id}
									className={index % 2 === 0 ? "bg-[#D6EEEE]" : ""}
								>
									<td className="border p-1">{user.login}</td>
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
			<div className="bordered p-4 h-[340px] overflow-y-auto">
				<h2 className="text-center text-xl mb-4">Details</h2>
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
			</div>
		);
	};

	if (!graphData?.data[selectedMonth]) {
		return (
			<div className="flex justify-center items-center h-[800px]">
				<p>No data available for the selected month.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col">
			<div className="w-full h-[500px] bordered mb-4">
				<ReactECharts
					option={getChartOption(graphData, selectedMonth)}
					style={{ height: "100%" }}
					onEvents={{
						dblclick: (params: { data?: { id?: string } }) => {
							if (params.data?.id) {
								setSelectedNode(params.data.id);
							}
						},
					}}
				/>
			</div>
			<hr className="border-t border-gray-300 my-4" />
			<div className="flex">
				<div className="w-1/2 pr-2">
					{renderLeaderboard(graphData, selectedMonth)}
				</div>
				<div className="w-1/2 pl-2">
					{renderDetails(graphData, selectedMonth, selectedNode)}
				</div>
			</div>
		</div>
	);
};

export default CommunityOpenRank;
