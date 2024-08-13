import {
	Links,
	Meta,
	MetaFunction,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import css from "./tailwind.css?url";
import { NextUIProvider } from "@nextui-org/react";
import { rootAuthLoader } from "@clerk/remix/ssr.server";
import { LoaderFunction } from "@remix-run/node";
import { ClerkApp } from "@clerk/remix";

export const links = () => [{ rel: "stylesheet", href: css }];

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

function App() {
	return (
		<NextUIProvider>
			<Outlet />
		</NextUIProvider>
	);
}

export default ClerkApp(App);
