import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const proyek = defineCollection({
	loader: glob({ base: "./src/content/proyek", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.string(),
		updatedDate: z.string().optional(),
		heroImage: z.string().optional(),
		demoUrl: z.string().url().optional(),
		repoUrl: z.string().url().optional(),
		stack: z.array(z.string()).optional(),
	}),
});

export const collections = { blog, proyek };
