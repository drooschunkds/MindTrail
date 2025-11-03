/*
          # [Initial Schema Setup]
          This script sets up the initial database schema for the MindTrail application, including tables for projects, tasks, and memory snapshots. It also configures Row Level Security (RLS) to ensure users can only access their own data.

          ## Query Description: This operation is structural and foundational for the application. It creates new tables and sets security policies. No existing data will be affected as these tables are new. It is safe to run on a new project.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - Tables Created: `projects`, `tasks`, `memory_snapshots`
          - Columns Added: Defines the structure for each table.
          - Constraints Added: Primary keys, foreign keys, and CHECK constraints.

          ## Security Implications:
          - RLS Status: Enabled on all new tables.
          - Policy Changes: Yes, new policies are created for SELECT, INSERT, UPDATE, DELETE.
          - Auth Requirements: Policies are based on `auth.uid()`.

          ## Performance Impact:
          - Indexes: Primary and foreign key indexes are created automatically.
          - Triggers: None.
          - Estimated Impact: Low.
          */

-- Create the projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    title text NOT NULL,
    description text,
    status text NOT NULL DEFAULT 'planned'::text,
    progress integer NOT NULL DEFAULT 0,
    last_worked_on timestamptz NOT NULL DEFAULT now(),
    tags text[],
    color text,
    CONSTRAINT projects_status_check CHECK ((status = ANY (ARRAY['active'::text, 'paused'::text, 'planned'::text])))
);
COMMENT ON TABLE public.projects IS 'Stores user projects.';

-- Create the tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    title text NOT NULL,
    status text NOT NULL DEFAULT 'todo'::text,
    CONSTRAINT tasks_status_check CHECK ((status = ANY (ARRAY['todo'::text, 'in-progress'::text, 'done'::text])))
);
COMMENT ON TABLE public.tasks IS 'Stores tasks associated with projects.';

-- Create the memory_snapshots table
CREATE TABLE IF NOT EXISTS public.memory_snapshots (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    "timestamp" timestamptz NOT NULL DEFAULT now(),
    thoughts text NOT NULL
);
COMMENT ON TABLE public.memory_snapshots IS 'Stores user thoughts and notes for a project at a point in time.';

-- Enable Row Level Security for all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_snapshots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the projects table
CREATE POLICY "Users can view their own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for the tasks table
CREATE POLICY "Users can view their own tasks" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tasks" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tasks" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tasks" ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for the memory_snapshots table
CREATE POLICY "Users can view their own snapshots" ON public.memory_snapshots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own snapshots" ON public.memory_snapshots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own snapshots" ON public.memory_snapshots FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own snapshots" ON public.memory_snapshots FOR DELETE USING (auth.uid() = user_id);
