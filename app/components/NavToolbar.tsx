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

export function NavToolbar(props: {
	history: {
		query: string;
		id: string;
	}[];
}) {
	const location = useLocation();

	return (
		<>
			<SignedIn>
				<div className="flex items-center justify-between gap-2 w-full">
					<div className="flex items-center gap-2">
						<UserButton />
					</div>

					{location.pathname !== "/" && (
						<Link to="/" className="flex items-center gap-2">
							<Image src={Logo} width={32} />
							<span className="text-sm font-bold">Web3Insight</span>
						</Link>
					)}

					<div>
						<Popover radius="sm" containerPadding={0}>
							<PopoverTrigger>
								<Button
									size="sm"
									variant="light"
									startContent={<History size={18} />}
								>
									History
								</Button>
							</PopoverTrigger>

							<PopoverContent className="p-0">
								<div className="min-w-[300px] flex flex-col">
									{props.history.map((query) => {
										return (
											<Link
												to={`/query/${query.id}`}
												key={query.id}
												className="p-3 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg border-b"
											>
												{query.query}
											</Link>
										);
									})}
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</SignedIn>
			<SignedOut>
				<div className="flex justify-between items-center gap-2 w-full">
					<Link to="/" className="flex items-center gap-2">
						<Image src={Logo} width={32} />
						<div className="font-medium">Web3Insight</div>
					</Link>
					<div className="flex items-center gap-2">
						<SignInButton>
							<Button size="sm" color="primary">
								Login
							</Button>
						</SignInButton>
					</div>
				</div>
			</SignedOut>
		</>
	);
}
