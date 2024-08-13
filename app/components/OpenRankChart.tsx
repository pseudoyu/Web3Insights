import React from "react";
import ReactECharts from "echarts-for-react";

interface OpenRankChartProps {
	data: Record<string, number>;
	repoName: string;
}

const OpenRankChart: React.FC<OpenRankChartProps> = ({ data, repoName }) => {
	const keys = Object.keys(data).filter((k) => k.length === 7);
	const values = keys.map((k) => data[k]);

	const option = {
		title: {
			text: `OpenRank for ${repoName}`,
			left: "center",
		},
		xAxis: {
			type: "category" as const,
			data: keys,
		},
		yAxis: {
			type: "value" as const,
		},
		series: [
			{
				data: values,
				type: "bar",
				name: "OpenRank",
			},
		],
		tooltip: {
			trigger: "axis",
		},
	};

	return <ReactECharts option={option} style={{ height: "400px" }} />;
};

export default OpenRankChart;
