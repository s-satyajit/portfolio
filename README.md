# Satyajit Samal Portfolio (Next.js + TypeScript)

Premium, recruiter-focused personal brand platform with:

- AI-focused portfolio storytelling
- MDX publishing system (blog, research, case studies)
- SEO + entity-oriented architecture
- Lightweight Gemini-powered blog and portfolio assistants
- No database (local content/data driven)

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion (subtle only)
- MDX (`next-mdx-remote`)
- Zod validation
- Nodemailer
- Gemini API (server-side only)
- JSON-LD schemas, sitemap, robots

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Copy `.env.example` to `.env.local` and set:

- `SITE_URL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL` (optional)
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

## Routes

- `/`
- `/about`
- `/projects`
- `/projects/[slug]`
- `/insights`
- `/experience`
- `/research`
- `/research/[slug]`
- `/blog`
- `/blog/[slug]`
- `/case-studies`
- `/case-studies/[slug]`
- `/services`
- `/resume`
- `/contact`
- `/recruiters`
- `/api/ai`
- `/api/blog-ai`
- `/api/contact`
- `/api/github-contributions`

## Content Architecture

### Data (`data/`)

- `profile.ts`
- `projects.ts`
- `skills.ts`
- `experience.ts`
- `services.ts`
- `social-links.ts`
- `seo.ts`
- `currently-building.ts`
- `ai-grounding.ts`
- `proof-stats.ts`
- `github-fallback.ts`
- `author.ts`

### Long Form (`content/`)

- `content/blog/*.mdx`
- `content/research/*.mdx`
- `content/case-studies/*.mdx`

## Add Content

### Projects (`data/projects.ts`)

Each project supports:

- `slug`
- `title`
- `summary`
- `description`
- `problem`
- `solution`
- `features`
- `techStack`
- `architecture`
- `images`
- `links`
- `featured`
- `hasCaseStudy`
- `category`
- `status`
- `outcomes`
- `lessonsLearned`

### Blog (`content/blog/*.mdx`)

Blog frontmatter supports:

- `slug`
- `title`
- `subtitle` (optional)
- `excerpt`
- `date`
- `category` (optional)
- `tags`
- `readTime` (optional)
- `cover` (optional)
- `coverAlt` (optional)
- `featured` (optional)
- `projectMentions` (optional: project slugs)
- `draft` (optional)
- `seoTitle` (optional)
- `seoDescription` (optional)

### Research (`content/research/*.mdx`)

- `slug`
- `title`
- `status` (`published | accepted | under-review | preprint | in-preparation`)
- `summary`
- `abstract`
- `contribution`
- `venue`
- `date`
- `tags`
- `links` (optional: `pdf`, `doi`, `external`)

### Case Studies (`content/case-studies/*.mdx`)

- `slug`
- `title`
- `context`
- `problem`
- `analysis`
- `conclusion`
- `keyInsights`
- `learnings`
- `date`
- `tags`

## AI Features

### Portfolio AI

- `app/api/ai/route.ts`
- `lib/ai.ts`
- `data/ai-grounding.ts`

### Blog AI (article-specific)

- `app/api/blog-ai/route.ts`
- `lib/blog-ai.ts`
- `components/blog/article-ai-panel.tsx`

Modes:

- Summary
- Takeaways
- Simplified explanation
- FAQ generation
- Ask question about current article

All AI routes are server-side and rate-limited.

## SEO + Entity Setup

Implemented with:

- Global metadata in `app/layout.tsx`
- Per-page metadata helpers in `lib/seo.ts`
- JSON-LD generators in `lib/schema.ts`
- `app/sitemap.ts`
- `app/robots.ts`
- OG route `app/og/route.tsx`

Schemas included:

- `Person`
- `WebSite`
- `ProfilePage`
- `Article` / `BlogPosting`
- `BreadcrumbList`

## Quality Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy (Vercel)

1. Push to GitHub.
2. Import in Vercel.
3. Add env vars from `.env.example`.
4. Ensure `SITE_URL` is your production domain.
5. Deploy.

## Notes

- This project is database-free and content-driven.
- Prefer server components by default for performance.
- Keep AI features useful and constrained; avoid chat clutter.
