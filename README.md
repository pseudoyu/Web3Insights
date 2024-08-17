# Web3Insights

> A comprehensive metrics platform focused on Web3 ecosystems, communities, repositories, and developers

## Project Overview

While Web3 ecosystems share similarities with traditional open-source communities, standard metric systems often fall short in providing a holistic understanding, trend tracking, and project evaluation specific to Web3 initiatives. Web3Insights aims to bridge this gap by offering tailored analytics and insights for the unique landscape of Web3 projects.

For instance, communities like OpenBuild face challenges in efficiently evaluating active contributors and participants in projects such as their Bootcamp. Manual statistical management is time-consuming, and even with tools like OSS Insight, obtaining detailed performance metrics for individual developers remains difficult. Additionally, there's a lack of standardization in reward distribution within these ecosystems.

## Core Features

1. **Ecosystem Analytics**: Search and analyze active projects and contributors within specific Web3 ecosystems or communities, presenting comprehensive metric data.

2. **Project-Specific Insights**: Enable direct search of metrics data by project name, coupled with AI-powered analysis reports generated using GPT-4.

3. **Developer Profiling**: Search and compile open-source contribution data and on-chain ecosystem participation metrics using GitHub handles or Web3 wallet addresses.

4. **Customized Metric System**: Combine proprietary metric frameworks with a Web3 ecosystem database to offer tailored analysis dimensions for different ecosystems.

5. **Identity Correlation**: Continuously build a reliable database correlating GitHub users, email addresses, and wallet addresses within the Web3 space.

6. **Reward Distribution Platform**:
   - Direct reward distribution to contributors who are platform users
   - Smart contract-generated Bounties/Grants for non-platform users, allowing them to claim rewards
   - User database matching and email notifications with authentication via GitHub handles

## Technology Stack

- Frontend: Remix.js with TypeScript
- Backend: Node.js
- Database: PostgreSQL for relational data, Redis for caching
- User Authentication: Clerk for secure user management
- Blockchain Integration: viem for Ethereum-based interactions
- AI Integration: OpenAI API for GPT-4o powered analytics
- API: OpenDigger, OSS Insight, RSS3 DSL API for flexible data querying

## Roadmap

1. 2024.08 - ETHShenzhen Hackathon
   1. MVP launch with user system, basic search and analytics features
   2. Integration of AI-powered analysis reports
   3. Use Starknet and OpenBuild as initial test ecosystem/community
2. Q3 2024
   1. Implementation of reward distribution system
   2. Launch of advanced ecosystem-specific metrics and analysis tools
   3. More features coming soon

## Project Team

- [pseudoyu](https://github.com/pseudoyu)

## Project Links

| Item | Link |
| --- | --- |
| Live Demo | [web3insights.app](https://web3insights.app) |

## Contact Information

- Email: [pseudoyu@connect.hku.hk](mailto:pseudoyu@connect.hku.hk)
