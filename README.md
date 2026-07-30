# Psychologist Website

A professional presentation website with a blog section. It lets the psychologist write, edit, and publish articles from a private admin panel inside the same site, while visitors access published articles in read-only mode.

## Stack

- **Frontend/SSR:** [Astro](https://astro.build) in server mode (`output: 'server'` or hybrid)
- **Auth + Database + Storage:** [Supabase](https://supabase.com) (Postgres, email/password Auth, Storage for post images)
- **Deploy:** Vercel or Netlify (Astro SSR adapter)

There is no separate backend service: endpoints and Astro Actions inside the Astro project itself act as the backend, using Supabase as the data and auth layer.

## Page structure

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing / professional presentation | about me / psicoterapist and contact sections
| `/blogs` | Public | List of published articles |
| `/blogs/[slug]` | Public | Article detail |
| `/admin/login` | Public | Login form |
| `/admin/posts` | Protected | List and manage posts (draft/published) |
| `/admin/posts/new` | Protected | Editor to create/edit an article |

`/admin/*` routes are protected by middleware (`src/middleware.ts`) that validates the Supabase Auth session and redirects to `/admin/login` if there is no active session.

## Data model (Supabase)

`posts` table:

- `id`
- `title`
- `slug`
- `content` (Markdown or HTML)
- `cover_image_url`
- `published` (boolean)
- `created_at` 
- `updated_at`

A single admin user (the psychologist) managed by Supabase Auth. There is no multi-role system in this version.

## Setup

```bash
npm install
cp .env.example .env
# fill in SUPABASE_URL and SUPABASE_ANON_KEY (and SUPABASE_SERVICE_ROLE_KEY if applicable)
npm run dev
```

## Environment variables

```
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
