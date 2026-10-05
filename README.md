# adnan-portfolio

Personal portfolio — SvelteKit + [Threlte](https://threlte.xyz) (Three.js), Matrix / terminal theme. Projects are loaded from a Notion database.

## Setup

```bash
npm install
cp .env.example .env   # fill NOTION_TOKEN and NOTION_DATABASE_ID
npm run dev
```

## Notion database

The integration must be connected to the database (••• → Connections). Columns:

| column         | type         | notes                                                                       |
| -------------- | ------------ | --------------------------------------------------------------------------- |
| `title`        | Title        | project name                                                                |
| `description`  | Text         |                                                                             |
| `technologies` | Multi-select |                                                                             |
| `image`        | URL          | direct image link (`https://i.imgur.com/xxx.png`) or local `/images/x.webp` |
| `links`        | URL          | `https://` is added if missing                                              |
| `published`    | Checkbox     | only checked rows are shown                                                 |
| `order`        | Number       | optional — sorts ascending, otherwise by creation time                      |

On Vercel the page is cached with ISR and re-fetched from Notion at most every minute.

## Instant refresh from Notion

Edits in Notion can rebuild the page right away through a webhook:

1. In Vercel, add `REVALIDATE_TOKEN` (any random string, 32+ chars) and redeploy — it is read at build time.
2. In the Notion integration settings → **Webhooks** → create a subscription to
   `https://<your-domain>/api/notion-webhook` with the `page.*` events.
3. Notion posts a `verification_token`; find it in the Vercel function logs
   (`[notion-webhook] verification_token = ...`) and paste it into Notion's **Verify** dialog.
4. Add that token to Vercel as `NOTION_WEBHOOK_SECRET` and redeploy.

Notion batches some events, so updates show up within a minute or two.

## Scripts

- `npm run dev` — dev server
- `npm run check` — svelte-check / TypeScript
- `npm run build` — production build (Vercel adapter; on Windows this needs Developer Mode for symlinks)
- `npm run format` — prettier
