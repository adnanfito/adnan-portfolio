import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const signatureMatches = (header: string, secret: string, body: string) => {
	const expected = Buffer.from(`sha256=${createHmac('sha256', secret).update(body).digest('hex')}`);
	const received = Buffer.from(header);
	return expected.length === received.length && timingSafeEqual(expected, received);
};

/**
 * Notion webhook → rebuild the ISR-cached home page right away.
 * Setup steps are in the README ("Instant refresh from Notion").
 */
export const POST: RequestHandler = async ({ request, url }) => {
	const raw = await request.text();
	let body: { verification_token?: string; type?: string };
	try {
		body = JSON.parse(raw);
	} catch {
		error(400, 'invalid JSON');
	}

	// One-time handshake: Notion sends the token we must paste back into its UI
	if (typeof body.verification_token === 'string') {
		console.log('[notion-webhook] verification_token =', body.verification_token);
		return json({ ok: true });
	}

	const secret = env.NOTION_WEBHOOK_SECRET;
	if (!secret || !env.REVALIDATE_TOKEN) error(503, 'webhook not configured');

	// Notion signs the JSON body; accept the raw bytes or the re-serialised form
	const signature = request.headers.get('x-notion-signature') ?? '';
	if (
		!signatureMatches(signature, secret, raw) &&
		!signatureMatches(signature, secret, JSON.stringify(body))
	) {
		error(401, 'invalid signature');
	}

	// Hitting the page with the bypass token makes Vercel regenerate it now
	const res = await globalThis.fetch(new URL('/', url.origin), {
		method: 'HEAD',
		headers: { 'x-prerender-revalidate': env.REVALIDATE_TOKEN }
	});

	return json({ revalidated: res.ok, event: body.type ?? null });
};
