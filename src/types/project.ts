export type ProjectStatus = 'active' | 'paused' | 'planned';

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  lastWorkedOn: string; // ISO string
  tags: string[];
  color: string;
  user_id: string;
  github_repo_url?: string | null;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  projectId: string;
  user_id: string;
}

export interface MemorySnapshot {
  id: string;
  projectId: string;
  thoughts: string;
  timestamp: string; // ISO string
  user_id: string;
  github_metadata?: {
    repo: string;
    branch: string;
    commit: string;
  } | null;
}

export interface AppData {
  projects: Project[];
  tasks: Task[];
  snapshots: MemorySnapshot[];
}
