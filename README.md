# MindTrail

MindTrail is a calm, futuristic workspace designed to help developers and creatives organize, manage, and seamlessly resume their projects. It acts as an external brain, reducing context-switching friction by capturing project state, thoughts, and technical context.

![MindTrail Dashboard](https://i.ibb.co/67X3xfS/mindtrail-preview.png)

## ✨ Features

- **Full Project Management (CRUD)**: Create, edit, and delete projects with titles, descriptions, progress tracking, and color-coding.
- **Interactive Kanban Board**: Manage tasks with a drag-and-drop interface for "To Do," "In Progress," and "Done" statuses.
- **Multiple Views**:
  - **Overview**: A dashboard with key stats and a grid of all your projects.
  - **Kanban**: A board-centric view of all tasks.
  - **Timeline**: A chronological history of your project activity.
- **Memory Snapshots**: Capture your thoughts, ideas, and where you left off before pausing a project.
- **GitHub Integration**:
  - Sign in with your GitHub account.
  - Link projects to your GitHub repositories.
  - View repository details like recent commits and open issues directly within MindTrail.
  - Automatically capture Git context (repo, branch, commit) when creating a Memory Snapshot.
- **Powerful Filtering & Sorting**: Instantly search, filter (by status), and sort (by date, progress, or title) your projects.
- **Secure Authentication**: Supports both email/password and GitHub OAuth, built on Supabase.
- **Production Ready**:
  - **PWA Enabled**: Installable on desktop and mobile with offline caching.
  - **Error Monitoring**: Integrated with Sentry for real-time error tracking.
  - **Deployment Ready**: Includes configuration for easy deployment to services like Render.
- **Sleek, Responsive UI**: A beautiful, modern interface built with Tailwind CSS and Framer Motion that works on desktop and tablet.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Backend & Database**: Supabase (PostgreSQL, Auth)
- **API Communication**:
  - `@supabase/supabase-js` for database and auth operations.
  - `@octokit/rest` for interacting with the GitHub API.
- **UI Components**:
  - **Icons**: Lucide React
  - **Notifications**: Sonner
  - **Drag & Drop**: dnd-kit
- **Production**:
  - **Error Monitoring**: Sentry
  - **PWA**: vite-plugin-pwa

## ⚙️ Getting Started

Follow these steps to get a local instance of MindTrail running.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [yarn](https://yarnpkg.com/) package manager

### 2. Installation

Install the project dependencies:
```bash
yarn install
```

### 3. Environment Setup

You need to configure your Supabase, GitHub, and Sentry credentials.

1.  **Create a `.env` file** in the root of the project. You can copy the example file:
    ```bash
    cp .env.example .env
    ```

2.  **Set up Supabase**:
    - Go to [supabase.com](https://supabase.com), create a new project.
    - Navigate to **Project Settings** > **API**.
    - Copy the **Project URL** and **anon public key**.
    - Paste them into your `.env` file for `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

3.  **Set up GitHub OAuth**:
    - In your Supabase Dashboard, go to **Authentication** > **Providers** and enable **GitHub**.
    - You will be given a **Redirect URI / Callback URL**. Copy it.
    - Go to your GitHub account **Settings** > **Developer settings** > **OAuth Apps** > **New OAuth App**.
    - Fill in the details. For "Authorization callback URL", paste the URL you copied from Supabase.
    - Generate a new client secret.
    - Copy the **Client ID** and **Client Secret** from your GitHub OAuth App back into the Supabase GitHub provider configuration.
    - Save the provider settings in Supabase.

4. **Set up Sentry (Optional)**:
    - Go to [sentry.io](https://sentry.io), create a new project (select "React").
    - Find your **DSN** key and add it to your `.env` file for `VITE_SENTRY_DSN`.

### 4. Database Migration

The project contains SQL migration files in the `supabase/migrations` directory. You must run these scripts in your Supabase project's SQL Editor to create the necessary tables and policies.

- Run `..._initial_schema.sql` first.
- Then run `..._github_integration.sql`.

### 5. PWA Icons

For the Progressive Web App to work correctly, you must create and place the following icon files in the `/public` directory of the project:
- `public/pwa-192x192.png`
- `public/pwa-512x512.png`
- `public/maskable-icon.png`

### 6. Run the Development Server

Once everything is configured, start the Vite development server:

```bash
yarn dev
```

## ☁️ Deployment

This project is configured for easy deployment to a static hosting service like **Render**, Netlify, or Vercel.

### Using Render

1.  Push your code to a GitHub repository.
2.  On Render, create a new **Blueprint**.
3.  Connect the GitHub repository you just created. Render will automatically detect the `render.yaml` file.
4.  In the **Environment** section, add your environment variables:
    - `VITE_SUPABASE_URL`
    - `VITE_SUPABASE_ANON_KEY`
    - `VITE_SENTRY_DSN`
    - `SENTRY_ORG` (Your Sentry organization slug)
    - `SENTRY_PROJECT` (Your Sentry project name)
    - `SENTRY_AUTH_TOKEN` (Create this in Sentry under User Settings > Auth Tokens)
5.  Click **Create**. Render will build and deploy your site.
