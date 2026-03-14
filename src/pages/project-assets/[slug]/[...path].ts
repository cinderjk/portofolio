import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

export const prerender = false;

const CONTENT_TYPES: Record<string, string> = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".webp": "image/webp",
	".avif": "image/avif",
	".gif": "image/gif",
	".ico": "image/x-icon",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".ttf": "font/ttf",
};

function isPathInsideRoot(path: string, root: string) {
	return path === root || path.startsWith(root + sep);
}

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug;
	if (!slug) {
		return new Response("Slug project tidak ditemukan", { status: 400 });
	}

	const requested = (params.path ?? "index.html").toString().replace(/^\/+/, "");
	if (requested.includes("..")) {
		return new Response("Path tidak valid", { status: 400 });
	}

	const root = resolve(process.cwd(), "src", "projects", slug);
	const filePath = resolve(root, requested.length > 0 ? requested : "index.html");

	if (!isPathInsideRoot(filePath, root)) {
		return new Response("Akses ditolak", { status: 403 });
	}

	try {
		const data = await readFile(filePath);
		const extension = extname(filePath).toLowerCase();
		const contentType = CONTENT_TYPES[extension] ?? "application/octet-stream";

		return new Response(data, {
			status: 200,
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=3600",
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch {
		return new Response("File tidak ditemukan", { status: 404 });
	}
};