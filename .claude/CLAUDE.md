# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

This repository is greenfield: the architecture below is decided, but implementation may not exist yet or may be partial. When scaffolding, follow this document instead of defaulting to unrelated conventions (e.g. do not introduce Next.js, React Router, or a separate Express/Nest backend — those were deliberately ruled out, see "Decisions already made").

## What this project is

A presentation website for a psychologist, with a blog she can write and publish herself from a private admin area inside the same site. Visitors read published posts read-only at `/blogs`; there is no public sign-up or multi-author system.

## Decisions already made (do not revisit without being asked)

- **Astro, not Next.js/React Router.** The public pages (landing, blog listing, blog detail) should ship minimal/zero client JS and be SEO/performance-optimized. Astro's file-based routing handles multi-page navigation with plain `<a href>` — no `useNavigate`, no client router library. Use Astro's built-in View Transitions if smoother page transitions are wanted.
- **No standalone backend service.** Astro runs in `server` (or hybrid) output mode. Astro Server Endpoints (`src/pages/api/*.ts`) and Astro Actions (`src/actions/`) are the backend — do not scaffold a separate Node/Express/Nest project.
- **Supabase is the data layer.** Postgres for the `posts` table, Supabase Auth for the single admin user (email/password), Supabase Storage for post cover images. Do not introduce Prisma/a self-hosted DB/a custom auth+session implementation unless explicitly asked to replace Supabase.
- **Single admin user, no role system.** Auth checks are binary (authenticated vs not) via middleware, not a roles/permissions table. Don't add role-based access control speculatively.

## Architecture

- **Public routes** (`/`, `/blogs`, `/blogs/[slug]`): fetch only `published = true` rows from the `posts` table in Supabase, rendered server-side or at build time with revalidation. These should not require authentication and should stay light on client JS.
- **Admin routes** (`/admin/*`): gated by `src/middleware.ts`, which reads the Supabase session cookie and redirects unauthenticated requests to `/admin/login`. All writes to `posts` (create/update/publish/unpublish) go through Astro Actions or server endpoints that verify the session server-side before touching Supabase — never trust a client-side auth check alone.
- **Editor UI** under `/admin/posts/new` is the one place in the app that needs real client-side interactivity (Markdown editor state, e.g. a textarea with live preview). `posts.content` is stored as Markdown and rendered to HTML only at display time (public routes), not stored as HTML. Prefer scoping the editor as a single Astro island rather than converting the surrounding admin pages into a client-rendered app.
- **Images** (cover image and any inline images in a post) are uploaded to Supabase Storage from the editor; the resulting public URL is what gets saved in `cover_image_url` or inserted into the Markdown body — the images themselves are never stored in Postgres.
- **Environment variables:** `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are safe for client use; `SUPABASE_SERVICE_ROLE_KEY` (if used for privileged server-side operations) must only be referenced in server-side code (endpoints/actions/middleware), never in client-shipped code or `PUBLIC_`-prefixed vars.

## Commands

```bash
npm install          # install dependencies
npm run dev           # local dev server
npm run build         # production build
npm run preview        # preview the production build locally
```
