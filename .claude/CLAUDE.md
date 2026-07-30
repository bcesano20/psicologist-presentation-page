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

## Component conventions

Established from the existing landing-page sections (`Hero.astro`, `AboutMe.astro`, `Psicoterapists.astro`, `Contact.astro`). Follow this structure for new `src/components/*.astro` files rather than inventing a new pattern.

### File & page structure

- One `<section>`-scoped `.astro` file per page section, PascalCase filename, in `src/components/`. `src/pages/index.astro` composes them by import + `<Layout><ComponentA /><ComponentB />...</Layout>` — no shared layout logic lives inside a section component.
- `Layout.astro` is just the document shell (`<html>/<head>/<body>` + `<slot />`) and imports the single global stylesheet `src/styles/global.css`. Never import Tailwind or add a `<style>` block inside a section component — style entirely with utility classes in markup.
- Images: import from `src/assets/` as an ESM import and render via `<Image src={...} alt="..." />` from `astro:assets`, not a raw `<img>`.

### Section anatomy

- Root element is `<section id="...">` — the `id` must match whatever in-page anchor links to it (e.g. a CTA with `href="#contact"` requires `id="contact"` on that section). Use `id`, not a custom `is="..."` attribute — that does not create a link target.
- Full-bleed intro/hero-style sections use `min-h-screen` + `flex items-center justify-center`; shorter content sections (like a contact block) use vertical padding (`py-24`) instead.
- Purely decorative background elements (blurred color blobs, etc.) go inside a dedicated `<div class="pointer-events-none absolute inset-0 overflow-hidden">` wrapper so they can never intercept clicks, regardless of DOM order.

### Colors

- Always use a numbered shade with `primary`/`secondary`/`accent` (`bg-primary-600`, `text-secondary-200`, `border-accent-400`, etc.) — `tailwind.config.mjs` defines shades `50`–`950` only, no `DEFAULT`, so bare `bg-primary`/`border-secondary` compile to no CSS and silently fall back to browser defaults (a "black border" bug turned out to be exactly this — `border-primary` resolving to nothing).
- Reserve `primary`/`secondary`/`accent` for on-brand UI. For a link/icon representing a real third-party service (LinkedIn, WhatsApp, etc.), use that service's actual brand color from Tailwind's default palette (`bg-blue-600`, `bg-green-500`) instead of the site palette — see the `links` array in `Contact.astro`.
- A border matching its own element's fill (`border-primary-600` on `bg-primary-600`) is a deliberate "soft card" look — the edge reads from the shadow, not a visible outline.

### Layout breakpoints

- `tailwind.config.mjs` defines a custom `mobile` (`max: 899px`) / `nav` (`min: 900px`) breakpoint pair specifically so a component can split into a mobile-stacked / desktop-side-by-side layout at one project-wide breakpoint. Prefer `flex-col nav:flex-row` (mobile-first stacked, row at 900px+) for that split in new components rather than reaching for Tailwind's default `md`/`lg`.
- Standard Tailwind breakpoints (`sm:`, `lg:`, etc.) are still fine for finer adjustments (font size, spacing) within a layout.
- Prefer the built-in type scale (`text-5xl sm:text-6xl lg:text-7xl`) over arbitrary pixel values (`text-[60px]`) for headings, so sizing stays consistent and responsive by default.

### Interactivity (no client JS)

- Hover/scale effects: `transition-transform` (or `transition-all`) + `hover:scale-105`/`hover:scale-110` + optionally `hover:-translate-y-0.5` for a lift. Never `hover:scale-100` — that's the identity transform and is a visual no-op.
- To reveal/animate a child element only when its parent is hovered, with no JS, mark the parent `group` and the child `group-hover:*` (see the dot-in-dot reveal in `Psicoterapists.astro`).
- Use `<a href="...">` for all navigation — in-page anchors (`#contact`) and cross-page links (`/blogs`) alike — never nest an `<a>` inside a `<button>` or vice versa. Reserve `<button>` for real in-page actions (form submit, future client-side handlers).

### Icons

- One-off icon: inline `<svg>` directly in the template, sized `w-4 h-4`/`w-5 h-5`/`w-8 h-8` depending on context. Outline style: `fill="none" stroke="currentColor" stroke-width="2"`. Solid/brand style: `fill="currentColor"`.
- Icon tied to a data-driven repeated item: store the SVG markup as a template-literal string on the data object and render with `<Fragment set:html={item.icon} />` inside the `.map()` (see `links` in `Contact.astro`).

### Repeated content

- For 2+ near-identical UI blocks (cards, link tiles, etc.), define an array of plain objects in the component's frontmatter and `.map()` over it in the template — don't hand-copy the same markup block multiple times. `Contact.astro`'s `links` array is the reference pattern to follow.

### Content placeholders

- New sections may ship with literal `Lorem ipsum...` body copy and obvious placeholder values (a fake phone number/email) as a stand-in for real content — that's expected at this stage, not something to silently invent real-sounding copy for.

### Before considering a component done

- `npm run format` (or at least `format:check`) and `npm run lint` must both pass — Prettier (with `prettier-plugin-astro` + `prettier-plugin-tailwindcss`) handles class ordering/formatting automatically, don't hand-format.
- `npm run build` should succeed; clean up `dist/`, `.vercel/`, `.astro/` afterwards — they're gitignored build artifacts, not source.

## Commands

```bash
npm install          # install dependencies
npm run dev           # local dev server
npm run build         # production build
npm run preview        # preview the production build locally
```
