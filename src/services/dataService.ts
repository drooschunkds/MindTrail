import { supabase } from '../lib/supabaseClient';
import { AppData, Project, MemorySnapshot, Task } from '../types/project';

const LOCAL_STORAGE_KEY = 'mindtrail_data';

export const saveLocalData = (data: AppData) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedData);
  } catch (error) {
    console.error("Error saving data to local storage:", error);
  }
};

export const loadLocalData = (): AppData | null => {
  try {
    const serializedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return serializedData ? JSON.parse(serializedData) : null;
  } catch (error) {
    console.error("Error loading data from local storage:", error);
    return null;
  }
};

export const fetchRemoteData = async (): Promise<AppData | null> => {
  if (!supabase) return null;
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const [projectsRes, tasksRes, snapshotsRes] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('tasks').select('*'),
      supabase.from('memory_snapshots').select('*')
    ]);

    if (projectsRes.error || tasksRes.error || snapshotsRes.error) {
      throw projectsRes.error || tasksRes.error || snapshotsRes.error;
    }

    return {
      projects: projectsRes.data || [],
      tasks: tasksRes.data || [],
      snapshots: snapshotsRes.data || [],
    };
  } catch (error) {
    console.error("Error fetching remote data:", error);
    return null;
  }
};

export const addProjectToRemote = async (project: Project) => {
  if (!supabase) return { data: null, error: new Error("Supabase not configured") };
  
  const { lastWorkedOn, ...rest } = project;
  const projectForDb = { ...rest, last_worked_on: lastWorkedOn, github_repo_url: project.github_repo_url };
  
  return supabase.from('projects').insert(projectForDb).select().single();
};

export const updateProjectToRemote = async (projectId: string, updates: Partial<Project>) => {
  if (!supabase) return { data: null, error: new Error("Supabase not configured") };

  const updatesForDb: { [key: string]: any } = { ...updates };
  if (updates.lastWorkedOn) {
    updatesForDb.last_worked_on = updates.lastWorkedOn;
    delete updatesForDb.lastWorkedOn;
  }
  if (updates.github_repo_url) {
    updatesForDb.github_repo_url = updates.github_repo_url;
  }

  return supabase.from('projects').update(updatesForDb).eq('id', projectId).select().single();
};

export const deleteProjectFromRemote = async (projectId: string) => {
  if (!supabase) return { data: null, error: new Error("Supabase not configured") };
  return supabase.from('projects').delete().eq('id', projectId);
};


export const addSnapshotToRemote = async (snapshot: MemorySnapshot) => {
  if (!supabase) return { data: null, error: new Error("Supabase not configured") };
  
  const { projectId, github_metadata, ...rest } = snapshot;
  const snapshotForDb = { ...rest, project_id: projectId, github_metadata };

  return supabase.from('memory_snapshots').insert(snapshotForDb).select().single();
};

export const addTaskToRemote = async (task: Task) => {
  if (!supabase) return { data: null, error: new Error("Supabase not configured") };
  
  const { projectId, ...rest } = task;
  const taskForDb = { ...rest, project_id: projectId };

  return supabase.from('tasks').insert(taskForDb).select().single();
};

export const updateTaskToRemote = async (taskId: string, updates: Partial<Task>) => {
  if (!supabase) return { data: null, error: new Error("Supabase not configured") };
  
  const updatesForDb: { [key: string]: any } = { ...updates };
  if (updates.projectId) {
    updatesForDb.project_id = updates.projectId;
    delete updatesForDb.projectId;
  }
  
  return supabase.from('tasks').update(updatesForDb).eq('id', taskId).select().single();
};

export const deleteTaskFromRemote = async (taskId: string) => {
  if (!supabase) return { data: null, error: new Error("Supabase not configured") };
  return supabase.from('tasks').delete().eq('id', taskId);
};
