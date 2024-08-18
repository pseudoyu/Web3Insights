import { ActionFunction, json } from "@remix-run/node";
import { prisma } from "~/prisma.server";
import { sendRewardClaimEmail } from "~/resend.server";

export const action: ActionFunction = async ({ request, params }) => {
	if (request.method !== "POST") {
		return json({ error: "Method not allowed" }, { status: 405 });
	}

	const userHandle = params.userHandle;
	if (!userHandle) {
		return json({ error: "User handle is required" }, { status: 400 });
	}

	try {
		// Fetch user details from the database
		const developer = await prisma.developer.findUnique({
			where: { githubHandle: userHandle },
			select: {
				id: true,
				githubHandle: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!developer) {
			return json({ error: "Developer not found" }, { status: 404 });
		}

		// Fetch project details from the form data
		const formData = await request.formData();
		const projectName = formData.get("projectName");
		if (!projectName) {
			return json({ error: "Project name is required" }, { status: 400 });
		}

		// Send reward claim email
		const emailResult = await sendRewardClaimEmail(
			developer.email,
			developer.githubHandle,
			projectName.toString(),
		);

		if (!emailResult.success) {
			return json(
				{ error: "Failed to send reward claim email" },
				{ status: 500 },
			);
		}

		return json({
			success: true,
			message: "Reward claim email sent successfully",
		});
	} catch (error) {
		console.error("Error processing reward claim:", error);
		return json({ error: "An unexpected error occurred" }, { status: 500 });
	}
};
