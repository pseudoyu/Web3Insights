interface ProjectData {
	name: string;
	description: string;
	type: "ecosystem" | "community";
	logo: string;
	website: string;
	core_contributors: string[];
	core_repos: string[];
}

export const projectsData: Record<string, ProjectData> = {
	starknet: {
		name: "Starknet",
		description:
			"Starknet is a permissionless Validity-Rollup, also known as a zero-knowledge rollup (ZK rollup) for Ethereum. As a Layer 2 (L2) blockchain, Starknet enables any dApp to achieve massive computation scale without compromising on Ethereum's composability and security. Starknet aims to achieve secure, low-cost transactions and high performance by using the STARK cryptographic proof system. Starknet contracts and the Starknet OS are written in Cairo, a custom-built and specialized programming language.",
		type: "ecosystem",
		logo: "https://www.starknet.io/wp-content/themes/Starknet/assets/img/starknet-logo.svg",
		website: "https://www.starknet.io/",
		core_contributors: [
			"vikiival",
			"LouGel",
			"julienbrs",
			"dependabot[bot]",
			"Jarsen136",
			"damip",
			"lomasson",
			"hassnian",
			"maciejka",
			"onuruci",
			"sistemd",
			"BNAndras",
			"TAdev0",
			"avimak",
			"derrix060",
			"glihm",
			"orizi",
			"preschian",
			"0xLucqs",
			"AnkushinDaniil",
			"Arcticae",
			"LandauRaz",
			"Tomer-StarkWare",
			"actions-user",
			"augustbleeds",
			"github-actions[bot]",
			"hakymulla",
			"ilyalesokhin-starkware",
			"obatirou",
			"sameoldlab",
			"shramee",
		],
		core_repos: [
			"starkware-libs/cairo",
			"starkware-libs/cairo-lang",
			"starkware-libs/papyrus",
		],
	},
	openbuild: {
		name: "OpenBuild",
		description:
			"An open-source community bridges Web2 to Web3 that connects builders and businesses, empowering builders to succeed!",
		type: "community",
		logo: "https://openbuild.xyz/_next/static/media/logo-black.41be43e7.svg",
		website: "https://openbuild.xyz/",
		core_contributors: ["xilibi2003", "xiangnuans", "dethan3"],
		core_repos: [
			"openbuildxyz/Web3-Frontend-Bootcamp",
			"openbuildxyz/OpenContent",
		],
	},
};
