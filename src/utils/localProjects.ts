import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export interface LocalProject {
	slug: string;
	title: string;
	updatedAt: string;
	lastModified: number;
	thumbnailUrl: string | null;
}

function toTitle(slug: string) {
	return slug
		.split("-")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function pickThumbnail(slug: string): string | null {
	const thumbnailPath = join(process.cwd(), "public", "projects", slug, "thumbnail.png");
	if (!existsSync(thumbnailPath)) return null;
	return `/projects/${slug}/thumbnail.png`;
}

export function getLocalProjects(): LocalProject[] {
	const projectsRoot = join(process.cwd(), "public", "projects");
	if (!existsSync(projectsRoot)) return [];

	return readdirSync(projectsRoot, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => {
			const slug = entry.name;
			const indexPath = join(projectsRoot, slug, "index.html");
			const modified = existsSync(indexPath) ? statSync(indexPath).mtime : new Date(0);

			return {
				slug,
				title: toTitle(slug),
				updatedAt: new Intl.DateTimeFormat("id-ID", {
					day: "2-digit",
					month: "short",
					year: "numeric",
				}).format(modified),
				lastModified: modified.getTime(),
				thumbnailUrl: pickThumbnail(slug),
			};
		})
		.sort((a, b) => b.lastModified - a.lastModified);
}