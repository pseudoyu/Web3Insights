import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/remix";
import {
	Image,
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@nextui-org/react";
import { Link, useLocation } from "@remix-run/react";
import { History } from "lucide-react";
import Logo from "../images/logo.png";
import { useMediaQuery } from "react-responsive";

export function NavToolbar(props: {
	history: {
		query: string;
		id: string;
	}[];
}) {
	const isDesktop = useMediaQuery({ minWidth: 1024 });
	const isMobile = useMediaQuery({ maxWidth: 767 });
	const location = useLocation();
	const isHomePage = location.pathname === "/";
	const isQueryPage = location.pathname.startsWith("/query/");
	const isClaimRewardPage = location.pathname === "/claim-reward";

	return (
		<>
			<SignedIn>
				<div className="flex items-center justify-between w-full px-4 py-2 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
					<div className="flex items-center gap-4">
						<UserButton />
						{!isHomePage && !isClaimRewardPage && (
							<Link
								to="/"
								className={`flex items-center gap-2 ${isQueryPage ? "absolute left-1/2 transform -translate-x-1/2" : ""}`}
							>
								<Image
									src={Logo}
									width={isDesktop ? 32 : 24}
									alt="Web3Insights Logo"
								/>
								{!isMobile && (
									<span className="text-sm font-bold text-gray-800">
										Web3Insights
									</span>
								)}
							</Link>
						)}
					</div>

					<div className="flex items-center">
						<Popover placement="bottom-end" radius="sm">
							<PopoverTrigger>
								<Button
									size="sm"
									variant="light"
									startContent={<History size={18} />}
								>
									{isDesktop ? "History" : ""}
								</Button>
							</PopoverTrigger>

							<PopoverContent className="p-0">
								<div className="min-w-[250px] max-h-[300px] overflow-y-auto flex flex-col">
									{props.history.map((query) => (
										<Link
											to={`/query/${query.id}`}
											key={query.id}
											className="p-3 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg border-b text-sm"
										>
											{query.query}
										</Link>
									))}
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</SignedIn>
			<SignedOut>
				<div className="flex justify-between items-center w-full px-4 py-2 sm:px-6 lg:px-8 max-w-[1200px] mx-auto">
					{isQueryPage ? (
						<>
							<div className="flex-1" />
							<Link
								to="/"
								className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2"
							>
								<Image
									src={Logo}
									width={isDesktop ? 32 : 24}
									alt="Web3Insights Logo"
								/>
								{!isMobile && (
									<span className="text-sm font-bold text-gray-800">
										Web3Insights
									</span>
								)}
							</Link>
							<div className="flex items-center gap-2 flex-1 justify-end">
								<SignInButton mode="modal">
									<Button
										size="sm"
										variant="light"
										startContent={<History size={18} />}
									>
										{isDesktop ? "History" : ""}
									</Button>
								</SignInButton>
								<SignInButton mode="modal">
									<Button size="sm" color="primary">
										Login
									</Button>
								</SignInButton>
							</div>
						</>
					) : !isHomePage && !isClaimRewardPage ? (
						<>
							<Link to="/" className="flex items-center gap-2">
								<Image
									src={Logo}
									width={isDesktop ? 32 : 24}
									alt="Web3Insights Logo"
								/>
								{!isMobile && (
									<span className="text-sm font-bold text-gray-800">
										Web3Insights
									</span>
								)}
							</Link>
							<div className="flex items-center gap-2">
								<SignInButton mode="modal">
									<Button
										size="sm"
										variant="light"
										startContent={<History size={18} />}
									>
										{isDesktop ? "History" : ""}
									</Button>
								</SignInButton>
								<SignInButton mode="modal">
									<Button size="sm" color="primary">
										Login
									</Button>
								</SignInButton>
							</div>
						</>
					) : (
						<div className="flex items-center gap-2 justify-end w-full">
							<SignInButton mode="modal">
								<Button
									size="sm"
									variant="light"
									startContent={<History size={18} />}
								>
									{isDesktop ? "History" : ""}
								</Button>
							</SignInButton>
							<SignInButton mode="modal">
								<Button size="sm" color="primary">
									Login
								</Button>
							</SignInButton>
						</div>
					)}
				</div>
			</SignedOut>
		</>
	);
}
