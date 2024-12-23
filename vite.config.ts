import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { getLoadContext } from "./load-context";

export default defineConfig(({ mode }) => {
	return {
		build: {
			target: "esnext",
			sourcemap: mode === "development",
		},
		ssr: {
			target: "webworker",
			noExternal: ["isbot"],
		},
		optimizeDeps: {
			include: ["react", "react-dom", "react-router"],
		},
		plugins: [
			cloudflareDevProxy({ getLoadContext }),
			reactRouter(),
			tailwindcss(),
			tsconfigPaths(),
		],
	};
});
