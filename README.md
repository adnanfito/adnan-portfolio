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

On Vercel the page is cached with ISR and re-fetched from Notion at most every 5 minutes.

## Scripts

- `npm run dev` — dev server
- `npm run check` — svelte-check / TypeScript
- `npm run build` — production build (Vercel adapter; on Windows this needs Developer Mode for symlinks)
- `npm run format` — prettier
