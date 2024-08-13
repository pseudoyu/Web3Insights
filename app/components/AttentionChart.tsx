import React from "react";
import ReactECharts from "echarts-for-react";

interface AttentionChartProps {
	data: Record<string, number>;
	repoName: string;
}

const AttentionChart: React.FC<AttentionChartProps> = ({ data, repoName }) => {
	const keys = Object.keys(data).filter((k) => k.length === 7);
	const values = keys.map((k) => data[k]);

	const accValue = values.reduce((acc, curr) => {
		const last = acc.length > 0 ? acc[acc.length - 1] : 0;
		acc.push(last + curr);
		return acc;
	}, []);

	const option = {
		title: { text: `Attention for ${repoName}`, left: "center" },
		xAxis: {
			type: "category" as const,
			data: keys,
		},
		yAxis: [{ type: "value" as const }, { type: "value" as const }],
		series: [
			{
				type: "bar",
				data: values,
				name: "Attention",
			},
			{
				type: "line",
				yAxisIndex: 1,
				data: accValue,
				smooth: true,
				name: "Accumulated Attention",
			},
		],
		tooltip: {
			trigger: "axis",
		},
		legend: {
			data: ["Attention", "Accumulated Attention"],
			top: "bottom",
		},
	};

	return <ReactECharts option={option} style={{ height: "400px" }} />;
};

export default AttentionChart;
