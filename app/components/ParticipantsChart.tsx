import React from "react";
import ReactECharts from "echarts-for-react";
import { useMediaQuery } from "react-responsive";

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
	const isMobile = useMediaQuery({ maxWidth: 767 });
	const keys = Object.keys(data.participants).filter((k) => k.length === 7);

	const option = {
		title: {
			text: `Developer status for ${repoName}`,
			left: "center",
			top: "bottom",
			textStyle: {
				fontSize: isMobile ? 14 : 18,
			},
		},
		grid: {
			top: isMobile ? 60 : 80,
			bottom: isMobile ? 60 : 80,
			left: isMobile ? 40 : 80,
			right: isMobile ? 20 : 40,
		},
		xAxis: {
			type: "category",
			data: keys,
			axisLabel: {
				rotate: isMobile ? 45 : 0,
				fontSize: isMobile ? 10 : 12,
			},
		},
		yAxis: {
			type: "value",
			axisLabel: {
				fontSize: isMobile ? 10 : 12,
			},
		},
		legend: {
			data: ["participants", "newContributors", "inactiveContributors"],
			textStyle: {
				fontSize: isMobile ? 10 : 12,
			},
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
		dataZoom: [
			{
				type: "inside",
				start: 0,
				end: isMobile ? 50 : 100,
			},
		],
	};

	return (
		<ReactECharts
			option={option}
			style={{ height: isMobile ? "300px" : "400px", width: "100%" }}
		/>
	);
};

export default ParticipantsChart;
