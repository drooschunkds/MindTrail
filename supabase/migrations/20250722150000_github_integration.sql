/*
  # [Feature] GitHub Integration
  This migration adds the necessary columns to support GitHub repository integration.

  ## Query Description: 
  - Adds `github_repo_url` to the `projects` table to store the URL of a linked repository.
  - Adds `github_metadata` to the `memory_snapshots` table to store contextual GitHub info (repo, branch, commit) when a snapshot is taken.
  - Updates Row Level Security policies on the `projects` table to allow users to manage the new `github_repo_url` column for their own projects.
  This operation is non-destructive and adds new capabilities.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Table 'projects': Adds column 'github_repo_url' (TEXT).
  - Table 'memory_snapshots': Adds column 'github_metadata' (JSONB).

  ## Security Implications:
  - RLS Status: Enabled
  - Policy Changes: Yes (Updates existing policies on 'projects' table)
  - Auth Requirements: User must be authenticated.
*/

-- Add github_repo_url to projects table
ALTER TABLE public.projects
ADD COLUMN github_repo_url TEXT;

-- Add github_metadata to memory_snapshots table
ALTER TABLE public.memory_snapshots
ADD COLUMN github_metadata JSONB;

-- Recreate policies for 'projects' to include the new column
DROP POLICY IF EXISTS "Users can create their own projects." ON public.projects;
CREATE POLICY "Users can create their own projects."
ON public.projects FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own projects." ON public.projects;
CREATE POLICY "Users can view their own projects."
ON public.projects FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own projects." ON public.projects;
CREATE POLICY "Users can update their own projects."
ON public.projects FOR UPDATE
TO authenticated USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own projects." ON public.projects;
CREATE POLICY "Users can delete their own projects."
ON public.projects FOR DELETE
TO authenticated USING (auth.uid() = user_id);
