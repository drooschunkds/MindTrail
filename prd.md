# MindTrail - Product Requirements Document (PRD)

## 1. Introduction & Vision

### Product Name
MindTrail

### Vision Statement
To provide a seamless and intuitive platform for creatives and developers to manage complex projects, reducing context-switching friction and preserving creative momentum.

### The Problem
The mental overhead of pausing and resuming multiple, disparate projects leads to lost productivity, creative blocks, and a frustrating developer/creator experience. Key context, such as the next logical step, a specific branch name, or a fleeting idea, is often lost between sessions.

### The Solution
MindTrail acts as an "external brain" for your projects. It's a beautiful, calm workspace that captures a project's state, your thoughts, and its technical context (like GitHub status), making it effortless to pick up exactly where you left off, no matter how long it's been.

---

## 2. Goals & Objectives

### Business Goals
- Achieve user adoption within the target market of solo developers and small teams.
- Establish a solid, feature-complete V1 to serve as a foundation for future premium/collaborative features.
- Create a polished portfolio piece demonstrating expertise in modern frontend development and UX.

### User Goals
- **Reduce time-to-productivity** when switching between projects.
- **Maintain a clear, high-level overview** of all ongoing work and its status.
- **Feel organized and in control** of their creative and technical endeavors.
- **Never lose a good idea** or a critical piece of context again.

---

## 3. Target Audience & User Personas

### Persona 1: The Freelance Full-Stack Developer (Alex)
- **Bio**: 30, juggles 3-4 client projects at a time, plus a personal side-project.
- **Needs**: To quickly switch contexts between a client's React frontend, another's Node.js backend, and their own Elixir project without losing an hour to "getting back into it."
- **Pain Points**: Forgetting which branch had the latest work, what the next API endpoint to build was, or why a specific piece of code was written a certain way.

### Persona 2: The Creative Technologist (Maria)
- **Bio**: 26, works on interactive web installations, generative art, and technical blog posts.
- **Needs**: A place to manage projects that are less about linear tasks and more about exploration and ideation.
- **Pain Points**: Losing a brilliant train of thought after an interruption, managing different phases of a project (e.g., ideation, prototyping, polishing), and keeping track of inspirational code snippets or articles.

---

## 4. Features & Requirements (Functional)

### F1: User Authentication
- **F1.1**: Users can sign up and log in using an email and password.
- **F1.2**: Users can sign up and log in using their GitHub account (OAuth).
- **F1.3**: User sessions are securely managed via Supabase Auth.

### F2: Project Management
- **F2.1**: Users can create, read, update, and delete (CRUD) projects.
- **F2.2**: Each project must have: a title, description, status (`planned`, `active`, `paused`), progress (0-100), tags, and an associated color.

### F3: Task Management
- **F3.1**: Users can CRUD tasks within a project.
- **F3.2**: Tasks are displayed on a Kanban board with columns: "To Do," "In Progress," and "Done."
- **F3.3**: Users can drag and drop tasks between columns to update their status.

### F4: Application Views
- **F4.1**: **Overview**: The default view, showing key statistics and a grid of all project cards.
- **F4.2**: **Kanban**: A view dedicated to the task board.
- **F4.3**: **Timeline**: A chronological, read-only view of project activity, grouped by "last worked on" date.
- **F4.4**: **Settings**: A view for managing user profile and account details.

### F5: Memory Snapshots
- **F5.1**: Users can open a "Memory Snapshot" modal from any project card.
- **F5.2**: The modal allows users to input free-form text to capture their current thoughts.
- **F5.3**: The snapshot is saved with a timestamp and associated with the specific project.

### F6: GitHub Integration
- **F6.1**: Users can link a MindTrail project to one of their GitHub repositories.
- **F6.2**: When a project is linked, the UI displays key repository info (e.g., recent commits, open issues, default branch).
- **F6.3**: When creating a Memory Snapshot for a linked project, the system automatically logs the repository name, current branch, and latest commit hash.

### F7: Search, Sort, & Filter
- **F7.1**: A header search bar allows users to filter projects by title, description, or tags in real-time.
- **F7.2**: A filter dropdown allows users to show/hide projects based on their status.
- **F7.3**: A sort control allows users to order projects by "Last Worked On," "Progress," or "Title" (ascending/descending).

---

## 5. Technical Requirements (Non-Functional)

- **Performance**: The application must feel fast and responsive, with initial loads under 2 seconds. UI interactions and animations should be smooth (60fps).
- **Security**: Data access must be restricted to the logged-in user via Supabase's Row Level Security (RLS). All communication with the backend must be over HTTPS.
- **Scalability**: The application architecture (Vite frontend + Supabase serverless backend) must be able to handle a growing number of users without significant re-engineering.
- **Usability & Design**: The UI must be intuitive, aesthetically pleasing ("calm productivity"), and fully responsive for modern desktop and tablet browsers.

---

## 6. Future Considerations (Out of Scope for V1)

- Real-time collaboration on projects.
- In-app notifications and reminders.
- A global search that includes tasks and memory snapshot content.
- Additional integrations (e.g., Jira, Figma, GitLab).
- A dedicated view for browsing and searching all memory snapshots.
