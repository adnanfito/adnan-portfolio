import type { Config } from '@sveltejs/adapter-vercel';
import { env } from '$env/dynamic/private';
import { getProjects } from '$lib/server/notion';
import type { PageServerLoad } from './$types';

// Vercel ISR: serve cached HTML and re-fetch Notion at most every minute. Edits in Notion
// also trigger an instant rebuild via /api/notion-webhook, which sends the bypass token.
export const config: Config = {
	isr: {
		expiration: 60,
		bypassToken: env.REVALIDATE_TOKEN || undefined
	}
};

export const load: PageServerLoad = async ({ fetch }) => {
	return { projects: await getProjects(fetch) };
};
