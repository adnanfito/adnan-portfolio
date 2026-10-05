import { env } from '$env/dynamic/private';
import type { Project } from '$lib/types';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

type RichText = { plain_text: string };
type NotionPage = {
	id: string;
	properties: Record<string, NotionProperty | undefined>;
};
type NotionProperty =
	| { type: 'title'; title: RichText[] }
	| { type: 'rich_text'; rich_text: RichText[] }
	| { type: 'url'; url: string | null }
	| { type: 'multi_select'; multi_select: { name: string }[] }
	| { type: 'checkbox'; checkbox: boolean }
	| { type: 'number'; number: number | null }
	| { type: string };
type QueryResponse = { results: NotionPage[]; has_more: boolean; next_cursor: string | null };

const text = (prop: NotionProperty | undefined) => {
	if (prop?.type === 'title' && 'title' in prop)
		return prop.title.map((t) => t.plain_text).join('');
	if (prop?.type === 'rich_text' && 'rich_text' in prop)
		return prop.rich_text.map((t) => t.plain_text).join('');
	return '';
};

const url = (prop: NotionProperty | undefined) =>
	prop?.type === 'url' && 'url' in prop ? (prop.url?.trim() ?? '') : '';

const tags = (prop: NotionProperty | undefined) =>
	prop?.type === 'multi_select' && 'multi_select' in prop
		? prop.multi_select.map((t) => t.name)
		: [];

const order = (prop: NotionProperty | undefined) =>
	prop?.type === 'number' && 'number' in prop ? prop.number : null;

/** Adds a protocol to bare domains like `budigadai.com`. */
export const normalizeLink = (raw: string) => {
	if (!raw) return null;
	if (/^(https?:|mailto:)/i.test(raw)) return raw;
	return `https://${raw.replace(/^\/+/, '')}`;
};

/**
 * Only accepts URLs that point at an actual image file. Album/page links
 * (e.g. `imgur.com/a/...`) can't be used in an <img>, so they become null.
 */
export const normalizeImage = (raw: string) => {
	if (!raw) return null;
	if (raw.startsWith('/')) return raw;
	try {
		const u = new URL(raw);
		if (/\.(png|jpe?g|webp|gif|avif|svg)$/i.test(u.pathname)) return u.toString();
		// Notion-hosted / S3 file URLs carry the extension before the query string
		if (/amazonaws\.com|notion-static\.com|notion\.so/.test(u.hostname)) return u.toString();
	} catch {
		// not a URL
	}
	return null;
};

const toProject = (page: NotionPage): Project => {
	const p = page.properties;
	return {
		id: page.id,
		title: text(p.title) || 'untitled',
		description: text(p.description),
		technologies: tags(p.technologies),
		image: normalizeImage(url(p.image)),
		link: normalizeLink(url(p.links))
	};
};

export async function getProjects(fetcher: typeof fetch = fetch): Promise<Project[]> {
	const token = env.NOTION_TOKEN;
	const databaseId = env.NOTION_DATABASE_ID;
	if (!token || !databaseId) {
		console.warn('[notion] NOTION_TOKEN / NOTION_DATABASE_ID not set — returning no projects');
		return [];
	}

	const pages: NotionPage[] = [];
	let cursor: string | null = null;

	try {
		do {
			const res: Response = await fetcher(`${NOTION_API}/databases/${databaseId}/query`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
					'Notion-Version': NOTION_VERSION,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					filter: { property: 'published', checkbox: { equals: true } },
					sorts: [{ timestamp: 'created_time', direction: 'ascending' }],
					page_size: 100,
					...(cursor ? { start_cursor: cursor } : {})
				}),
				signal: AbortSignal.timeout(8000)
			});
			if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
			const data = (await res.json()) as QueryResponse;
			pages.push(...data.results);
			cursor = data.has_more ? data.next_cursor : null;
		} while (cursor);
	} catch (err) {
		console.error('[notion] failed to load projects', err);
		return [];
	}

	// Optional numeric `order` column wins over creation time when present
	return pages
		.map((page, i) => ({ project: toProject(page), rank: order(page.properties.order) ?? 1e6 + i }))
		.sort((a, b) => a.rank - b.rank)
		.map(({ project }) => project);
}
