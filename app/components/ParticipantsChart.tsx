import React from "react";
import ReactECharts from "echarts-for-react";

interface ParticipantsChartProps {
	data: {
		participants: Record<string, number>;
		newContributors: Record<string, number>;
		inactiveContributors: Record<string, number>;
	};
	repoName: string;
}

const ParticipantsChart: React.FC<ParticipantsChartProps> = ({
	data,
	repoName,
}) => {
	const keys = Object.keys(data.participants).filter((k) => k.length === 7);

	const option = {
		title: {
			text: `Developer status for ${repoName}`,
			left: "center",
			top: "bottom",
		},
		xAxis: {
			type: "category",
			data: keys,
		},
		yAxis: { type: "value" },
		legend: {
			data: ["participants", "newContributors", "inactiveContributors"],
		},
		series: [
			{
				name: "participants",
				type: "line",
				smooth: true,
				data: Object.values(data.participants),
			},
			{
				name: "newContributors",
				type: "bar",
				data: keys.map((k) => data.newContributors[k] ?? 0),
			},
			{
				name: "inactiveContributors",
				type: "bar",
				data: keys.map((k) => -(data.inactiveContributors[k] ?? 0)),
			},
		],
		tooltip: {
			trigger: "axis",
		},
	};

	return <ReactECharts option={option} style={{ height: "400px" }} />;
};

export default ParticipantsChart;
