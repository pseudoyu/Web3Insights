import { SignedIn, SignedOut, SignInButton } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	Image,
} from "@nextui-org/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { prisma } from "~/prisma.server";
import Logo from "../images/logo.png";
import { Outlet, useLoaderData } from "@remix-run/react";
import { NavToolbar } from "~/components/NavToolbar";
import { useAtom } from "jotai";
import { signinModalOpenAtom } from "~/atoms";

export const loader = async (ctx: LoaderFunctionArgs) => {
	const auth = await getAuth(ctx);

	let history: {
		query: string;
		id: string;
	}[] = [];

	if (auth.userId) {
		history = await prisma.query.findMany({
			where: {
				owner: {
					clerkUserId: auth.userId,
				},
			},
			select: {
				id: true,
				query: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 10,
		});
	}

	const pinned = await prisma.query.findMany({
		where: {
			pin: true,
		},
		select: {
			id: true,
			query: true,
		},
	});

	return json({
		pinned,
		history,
	});
};

export default function () {
	const loaderData = useLoaderData<typeof loader>();
	const [signinModalOpen, setSigninModalOpen] = useAtom(signinModalOpenAtom);

	return (
		<>
			<Modal
				isOpen={signinModalOpen}
				onClose={() => {
					setSigninModalOpen(false);
				}}
				size="2xl"
			>
				<ModalContent>
					{() => {
						return (
							<>
								<ModalHeader>Create an Account</ModalHeader>
								<ModalBody>
									<div>
										<Image src={Logo} width={96} />
										<h2 className="mb-3 mt-3 font-medium">
											Create a free account to save your search history.
										</h2>
									</div>
								</ModalBody>
								<ModalFooter>
									<SignInButton>
										<Button color="primary">Start for free</Button>
									</SignInButton>
								</ModalFooter>
							</>
						);
					}}
				</ModalContent>
			</Modal>

			<div>
				<nav className="py-3 top-0 fixed left-0 right-0 bg-white border-b">
					<div className="max-w-[640px] mx-auto flex justify-between px-5 md:px-0">
						<SignedIn>
							<div className="w-full">
								<NavToolbar history={loaderData.history} />
							</div>
						</SignedIn>
						<SignedOut>
							<div />
							<NavToolbar history={loaderData.history} />
						</SignedOut>
					</div>
				</nav>

				<Outlet />
			</div>
		</>
	);
}
