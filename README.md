# GivethNotes

A private learning system built for developers who take growth seriously. GivethNotes allows you to document your journey to mastery through structured, modular, and intentional note-taking.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project Structure

This project is built with Next.js using the App Router. Below is a brief overview of the key pages and components:

### Pages
- **Landing Page (`app/page.js`)**: The main entry point of the application. It features a hero section, a growth-focused value proposition, and a "Path to Mastery" guide.
- **Sign In (`app/sign-in/[[...sign-in]]/page.js`)**: Sign in UI powered by Clerk, available at `/sign-in`. After sign-in users are redirected to `/dashboard`.
- **Sign Up (`app/sign-up/[[...sign-up]]/page.js`)**: Sign up UI powered by Clerk, available at `/sign-up`. After sign-up users are redirected to `/dashboard`.
- **Dashboard (`app/dashboard/page.js`)**: User dashboard and private area (intended for authenticated users).
- **Create Career Path (`app/career_paths/create/page.js`)**: A client-side form to create a new career path. It posts to `
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/career-paths`
  ` using `axios` and shows success/error feedback with `sonner` toasts. Requires authentication.
- **Edit Career Path (`app/career_paths/[id]/edit/page.js`)**: Edit page that first fetches the career path via `GET /api/career-paths/:id` to pre-fill the form, supports updating via `PUT /api/career-paths/:id`, and allows deleting via `DELETE /api/career-paths/:id` (deletion is confirmed via a styled modal and shows server messages using `sonner`).

### Components
- **Navbar (`app/components/Navbar.js`)**: A sticky navigation bar that includes the GivethNotes logo and a call-to-action button.
- **DailyQuote (`app/components/DailyQuote.js`)**: A client-side component that fetches and displays a daily inspirational quote from the internal API.
- **Footer (`app/components/Footer.js`)**: A consistent footer component displaying project credits.

### API Routes
- **Quote API (`app/api/quote/route.js`)**: A server-side route that proxies requests to `zenquotes.io` to provide fresh daily quotes while avoiding CORS issues.
- **Career Paths (external API)**: The frontend interacts with a career-paths API via the base URL configured in `NEXT_PUBLIC_API_BASE_URL`. Endpoints used by the UI:
  - `POST /api/career-paths` — create a career path (used by `app/career_paths/create/page.js`).
  - `GET /api/career-paths/:id` — fetch a single career path (used by `app/career_paths/[id]/edit/page.js`).
  - `PUT /api/career-paths/:id` — update a career path (used by `app/career_paths/[id]/edit/page.js`).
  - `DELETE /api/career-paths/:id` — delete a career path (used by `app/career_paths/[id]/edit/page.js`).

  Note: Requests include an `Authorization: Bearer <token>` header obtained with Clerk's `getToken()` in the frontend; the base URL is read from `NEXT_PUBLIC_API_BASE_URL`.

### Other
- **Icons (`app/icons/page.js`)**: A simple page demonstrating the usage of FontAwesome icons within the project.

## Recent Changes / Changelog

The following changes were implemented during recent UI and routing improvements. These notes explain what changed, where to find the code, and any runtime or developer actions required.

- **Career Path Detail Layout (new)**
  - File: `app/career_paths/[id]/page.js`
  - Replaced placeholder details with a full, styled layout: left image, right details column (title, description, start date), a horizontal divider, stats + action buttons, timeline header, and timeline cards.
  - Styling: Tailwind utility classes used with an amber/gray color scheme to match the rest of the app. Cards use a left accent border and hover shadow.

- **New Timeline Cards**
  - File: `app/career_paths/[id]/page.js`
  - Three timeline cards were added: "Learning CSS" (highlighted as Today), "JavaScript Fundamentals" (Jan 8, 2026), and "Database Design" (Jan 7, 2026).
  - The card for today's entry has a distinct amber gradient and left border; non-highlighted cards use a subtle gray background.
  - Each card shows date, title, description and action icons (open / delete) on the right.

- **Font Awesome icons**
  - Icons used: calendar, pencil (edit), external-link (open card), trash (delete), clock and plus on the dashboard.
  - Note: `faArrowUpRight` was replaced with `faExternalLink` because `faArrowUpRight` is not exported by `@fortawesome/free-solid-svg-icons` in this project.

- **Responsive improvements**
  - The header, stats area, and timeline header now use `flex-col` on small screens and `md:` breakpoints for desktop layouts.
  - The layout centers content on small devices and left-aligns on medium+ screens.
  - Title and ID in the header were adjusted to always remain on the same line: the title now truncates on small screens (`truncate` + `min-w-0`) to avoid wrapping while the ID badge remains visible.

- **Image optimization & `next/image`**
  - The inline `<img>` usage on the career path page was replaced with Next.js `Image` for optimized loading and lazy loading benefits.
  - Parent wrapper is positioned `relative` and uses `fill` on the `Image` element for a responsive cover behavior.
  - Because the image is loaded from `i.pinimg.com`, `next.config.mjs` was updated to allow that host under `images.remotePatterns`:

    ```js
    // next.config.mjs
    const nextConfig = {
      images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'i.pinimg.com',
          },
        ],
      },
    };

    export default nextConfig;
    ```

  - Developer action: restart the dev server after changing `next.config.mjs` to pick up the configuration.

- **ID obfuscation for routes (encode/decode)**
  - Files: `app/dashboard/page.js` and `app/career_paths/[id]/page.js`
  - Purpose: to avoid exposing raw numeric IDs in the URL, a simple URL-safe Base64 obfuscation was introduced:
    - `encodeId(id)` — added to `app/dashboard/page.js`. When navigating from the dashboard, `clickCard` now calls `encodeId(path.id)` and navigates to `/career_paths/${encoded}`.
    - `decodeId(val)` — added to `app/career_paths/[id]/page.js`. The detail page reads the raw route param and decodes it before use: `const { id: rawId } = useParams(); const id = decodeId(rawId);`.
  - These helpers use standard `btoa`/`atob` with URL-safe replacements (`+` -> `-`, `/` -> `_`) and padding handling.
  - Security note: This is *obfuscation*, not encryption — do not treat this as a secure mechanism for hiding sensitive IDs.

- **Dashboard navigation**
  - File: `app/dashboard/page.js`
  - `clickCard` was updated to encode the id before routing: `router.push(`/career_paths/${encodeId(id)}`)`.
  - The dashboard still fetches and displays career paths from the API and activity timestamps; images in the dashboard remain `<img>` for now (you can switch them to `next/image` later if desired and add the remote host config if needed).

- **Create / Edit / Delete Career Paths (new)**
  - Files:
    - `app/career_paths/create/page.js` — creation form; sends `POST` to `/api/career-paths` and shows `sonner` toasts on success/error.
    - `app/career_paths/[id]/edit/page.js` — edit form; fetches via `GET /api/career-paths/:id`, updates via `PUT /api/career-paths/:id`, and deletes via `DELETE /api/career-paths/:id`.
  - UX details: the edit page pre-fills fields from the fetched data, displays success and error messages via `sonner` toasts, and uses a styled confirmation modal for delete. On successful delete the server message is displayed via `toast.success` and the UI redirects to `/dashboard` after a short delay.
  - Auth & API: All write operations include `Authorization: Bearer <token>` obtained with `getToken()` from Clerk; the frontend reads the API base from `NEXT_PUBLIC_API_BASE_URL`.

## How to use the obfuscation helpers

- When building links to career path details from other parts of the app, use `encodeId(path.id)` so the route contains the obfuscated id.
- On the detail page, `useParams()` returns the obfuscated id; the page now decodes it automatically using `decodeId(rawId)` before using it in the UI or API calls.

## Notes & Next Steps

- If you want stronger security than obfuscation, consider using UUIDs on the server-side or signed tokens for URLs.
- Consistency: you may convert other image tags across the app to `next/image`. If you do, remember to add their hostnames to `next.config.mjs`.
- Testing: verify navigation from the dashboard to a career path detail works in dev after restarting the server (so `next.config.mjs` changes apply).

## Authentication (Clerk) ✅
This project uses [Clerk](https://clerk.com) for authentication.

- **Packages installed**: `@clerk/nextjs`, `@clerk/themes` (see `package.json`).
- **Provider**: The application is wrapped with `<ClerkProvider>` in `app/layout.js`.
- **Routes**:
  - `/sign-in` — Sign in page (`app/sign-in/[[...sign-in]]/page.js`) using `<SignIn />`.
  - `/sign-up` — Sign up page (`app/sign-up/[[...sign-up]]/page.js`) using `<SignUp />`.
  - Both pages redirect to `/dashboard` after success.

Setup
1. Create a Clerk application at https://dashboard.clerk.com and copy your keys.
2. Add the following environment variables to your local `.env` (do NOT commit secrets):

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

3. Restart the dev server (`npm run dev`) and visit `/sign-up` or `/sign-in` to test.

Notes
- Customize the Clerk UI via the `appearance` props used in the sign-in/sign-up pages (they use the `dark` theme and custom colors).
- Keep your `CLERK_SECRET_KEY` private and do not commit it to version control.
