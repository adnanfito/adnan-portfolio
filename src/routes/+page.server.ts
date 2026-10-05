import type { Config } from '@sveltejs/adapter-vercel';
import { getProjects } from '$lib/server/notion';
import type { PageServerLoad } from './$types';

// Vercel ISR: serve cached HTML, re-fetch Notion at most every 5 minutes
export const config: Config = {
	isr: { expiration: 300 }
};

export const load: PageServerLoad = async ({ fetch }) => {
	return { projects: await getProjects(fetch) };
};
