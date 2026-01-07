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

### Components
- **Navbar (`app/components/Navbar.js`)**: A sticky navigation bar that includes the GivethNotes logo and a call-to-action button.
- **DailyQuote (`app/components/DailyQuote.js`)**: A client-side component that fetches and displays a daily inspirational quote from the internal API.
- **Footer (`app/components/Footer.js`)**: A consistent footer component displaying project credits.

### API Routes
- **Quote API (`app/api/quote/route.js`)**: A server-side route that proxies requests to `zenquotes.io` to provide fresh daily quotes while avoiding CORS issues.

### Other
- **Icons (`app/icons/page.js`)**: A simple page demonstrating the usage of FontAwesome icons within the project.

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
