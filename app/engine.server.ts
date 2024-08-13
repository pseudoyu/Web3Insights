import axios from "axios";
import { Redis } from "ioredis";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { isAddress } from "viem";

export const redis = new Redis(process.env.REDIS_URL as string);

export const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	baseURL: process.env.OPENAI_BASE_URL,
});

export const PROMPT = (context: string) => `You're a multilingual Web3-savvy AI assistant with a talent for balanced analyses and subtle wit. Your mission: deliver concise, accurate, and engaging insights on GitHub users, repos, or Ethereum addresses. Use the provided context to fuel your analysis. Keep it under 1024 tokens and stay on topic!

Crucial: Respond in exactly the same language as the user's query. Adapt your tone, expressions, and humor to fit the language and cultural context.

Determine if the query is about an EVM address or GitHub, then use this markdown structure:

For EVM Addresses:

## 🔗 On-Chain Activity

🔢
* Total tx count (with a factual observation on frequency)
* Noteworthy interactions (highlight any unusual patterns)

💼
* Significant holdings (analyze diversity and risk)
* DeFi engagements (evaluate strategy, note potential risks)

🤖
* Frequently used contracts (assess variety and purpose)
* Any standout or innovative uses? (analyze impact and originality)

For GitHub Users/Repos:

## 💻 Open Source Contributions

⭐
* Star projects (evaluate impact and relevance)
* Web3 focused work (assess contributions to blockchain ecosystem)

📊
* Commit frequency (analyze consistency and productivity)
* Issue and PR activity (evaluate collaboration and problem-solving)

🛠️
* Primary languages (assess proficiency and versatility)
* Web3 specialties (evaluate depth of blockchain knowledge)

Provide a balanced analysis, highlighting both strengths and areas for improvement. Use subtle humor where appropriate, but prioritize accuracy and professionalism. Offer insights that demonstrate a deep understanding of Web3 and software development practices.

Here's your context to analyze:
${context}

Now, let's provide a thorough and balanced analysis of the query!`;

export async function getInfo(query: string) {
	if (isAddress(query) || query.endsWith(".eth")) {
		return getEVMInfo(query);
	} else if (query.includes("/")) {
		return getGitHubRepoInfo(query);
	} else {
		return getGitHubUserInfo(query);
	}
}

async function getEVMInfo(address: string) {
	const apiUrl = `${process.env.RSS3_DSL_URL}/decentralized/${address}?limit=50&action_limit=10`;
	try {
		const response = await axios.get(apiUrl);
		return response.data;
	} catch (error) {
		console.error("Error fetching EVM info:", error);
		return null;
	}
}

async function getGitHubRepoInfo(repo: string) {
	const key = `github:repo:${repo}`;
	const cached = await redis.get(key);

	if (cached) {
		const parsedCache = JSON.parse(cached);
		if (Object.keys(parsedCache).length !== 0) {
			return parsedCache;
		}
	}

	const apiUrl = `${process.env.OSSINSIGHT_URL}/repo/${repo}`;

	try {
		const response = await axios.get(apiUrl);
		const result = response.data.data;

		await redis.set(key, JSON.stringify(result), "EX", 60 * 60 * 24 * 2);
		return result;
	} catch (error) {
		console.error("Error fetching GitHub repo info:", error);
		return null;
	}
}

async function getGitHubUserInfo(user: string) {
	const key = `github:user:${user}`;
	const cached = await redis.get(key);

	if (cached) {
		const parsedCache = JSON.parse(cached);
		if (Object.keys(parsedCache).length !== 0) {
			return parsedCache;
		}
	}

	const apiUrl = `${process.env.OSSINSIGHT_URL}/users/${user}`;

	try {
		const response = await axios.get(apiUrl);
		const result = response.data.data;

		await redis.set(key, JSON.stringify(result), "EX", 60 * 60 * 24 * 2);
		return result;
	} catch (error) {
		console.error("Error fetching GitHub user info:", error);
		return null;
	}
}

export async function analyzeInfo(
	info: any,
	type: "evm" | "github_user" | "github_repo",
) {
	const model = openai("gpt-4o");
	let prompt;

	switch (type) {
		case "evm":
			prompt = `Analyze the following EVM address information and provide a concise summary:
				${JSON.stringify(info)}`;
			break;
		case "github_user":
			prompt = `Analyze the following GitHub user information and provide a concise summary:
				${JSON.stringify(info)}`;
			break;
		case "github_repo":
			prompt = `Analyze the following GitHub repository information and provide a concise summary:
				${JSON.stringify(info)}`;
			break;
	}

	const result = await generateText({
		model,
		messages: [
			{
				role: "system",
				content:
					"You are an AI assistant that analyzes EVM address, GitHub user, and repository information.",
			},
			{
				role: "user",
				content: prompt,
			},
		],
		maxTokens: 4096,
		topP: 0.5,
	});

	return result.text;
}

export async function getSearchKeyword(question: string) {
	const model = openai("gpt-4o");
	const result = await generateText({
		model,
		messages: [
			{
				role: "system",
				content: `You are a search expert specializing in extracting GitHub-related information and Web3 addresses from questions. Follow these rules:

				1. GitHub Usernames:
					- If the question is about a user's open source activities, contributions, or performance, extract just the username.
					- Examples: "pseudoyu's open source performance" or "open source activities of pseudoyu" should return "pseudoyu".

				2. GitHub Repositories:
					- If the question is about a specific repository, return it in the format {user/repo}.
					- Example: "analyze the performance and influence of pseudoyu/yu-tools" should return "pseudoyu/yu-tools".

				3. EVM Addresses or ENS Domains:
					- If an EVM address or ENS domain is mentioned, return that.

				4. Combination:
					- If the question contains multiple elements, prioritize in this order: Repository > Username > EVM Address/ENS Domain.

				5. Unclear Cases:
					- If the type is unclear, make your best guess based on the context.

				Always return only the extracted information without any additional text or explanation.`,
			},
			{
				role: "user",
				content: question,
			},
		],
		maxTokens: 4096,
		topP: 0.5,
	});

	return result.text.trim();
}
