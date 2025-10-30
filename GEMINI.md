# GEMINI.md - Project Context for Bet2Fund

This document provides an overview of the Bet2Fund project, its technical stack, and operational guidelines for the Gemini AI agent.

## Project Overview

Bet2Fund is a sports trading platform designed to offer funded challenges and real-time sports data. The application is structured as a full-stack web application.

**Key Characteristics:**
- **Frontend:** Built with Next.js (React, TypeScript) using the App Router, Tailwind CSS for styling (with `shadcn/ui` components), and Framer Motion for animations. TanStack Query is used for state management.
- **Backend:** A simple Express.js server handles API routes, primarily acting as a proxy for external sports odds APIs and serving static/mocked data for public endpoints.
- **Core Functionality:** The platform focuses on presenting sports trading challenges and real-time odds. All user authentication, profile management, and direct database interactions (e.g., Supabase) have been removed. Public data such as plans, FAQs, and testimonials are now served as static or mocked responses from the backend.
- **Deployment:** Configured for deployment on Vercel, with a `vercel.json` file defining the build and routing for both the static frontend assets and the Node.js backend.

## Building and Running

To set up and run the project locally, follow these steps:

1.  **Install Dependencies:**
    \`\`\`bash
    npm install
    \`\`\`

2.  **Local Development (Frontend & Backend):**
    To run the application in development mode with hot-reloading for the frontend and a running backend server:
    \`\`\`bash
    npm run dev
    \`\`\`
    The application will typically be accessible at `http://localhost:3000` (Next.js default port).

3.  **Production Build:**
    To create a production-ready build of both the frontend and backend:
    \`\`\`bash
    npm run build
    \`\`\`
    This command compiles the Next.js frontend and the Express.js backend.

4.  **Run Production Server:**
    To start the production backend server (after running `npm run build`):
    \`\`\`bash
    npm run start
    \`\`\`

## Development Conventions

-   **Language:** TypeScript is used throughout the project for both frontend and backend.
-   **Styling:** Tailwind CSS is the primary styling framework, often used with `shadcn/ui` components.
-   **Component Structure:** React components are organized logically within the `components/` directory, often grouped by feature or type (e.g., `home/`, `layout/`, `ui/`).
-   **Routing:** Next.js App Router is used for frontend routing.
-   **API Interaction:** Frontend interacts with the backend via RESTful API calls.

## Environmental Variables

The only critical environment variable required for the application's functionality is:

-   `ODDS_API_KEY`: Required for fetching real-time sports odds from The Odds API. This should be configured in the local `.env` file for development and in the Vercel project settings for deployment.
