import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { AppData, Project, Task, MemorySnapshot } from '../types/project';
import * as dataService from '../services/dataService';
import { useAuth } from '../contexts/AuthContext';

const mapToProject = (row: any): Project => ({
  id: row.id,
  title: row.title,
  description: row.description,
  status: row.status,
  progress: row.progress,
  lastWorkedOn: row.last_worked_on,
  tags: row.tags || [],
  color: row.color,
  user_id: row.user_id,
  github_repo_url: row.github_repo_url,
});

const mapToTask = (row: any): Task => ({
  id: row.id,
  title: row.title,
  status: row.status,
  projectId: row.project_id,
  user_id: row.user_id,
});

const mapToSnapshot = (row: any): MemorySnapshot => ({
  id: row.id,
  projectId: row.project_id,
  thoughts: row.thoughts,
  timestamp: row.timestamp,
  user_id: row.user_id,
  github_metadata: row.github_metadata,
});

export const useMindTrailStorage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AppData>({ projects: [], tasks: [], snapshots: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setData({ projects: [], tasks: [], snapshots: [] });
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const remoteData = await dataService.fetchRemoteData();
      if (remoteData) {
        const mappedData = {
          projects: remoteData.projects.map(mapToProject),
          tasks: remoteData.tasks.map(mapToTask),
          snapshots: remoteData.snapshots.map(mapToSnapshot),
        };
        setData(mappedData);
        dataService.saveLocalData(mappedData);
      } else {
        const localData = dataService.loadLocalData();
        if (localData) setData(localData);
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  const addProject = useCallback(async (projectData: Omit<Project, 'id' | 'lastWorkedOn' | 'user_id' | 'progress' | 'status'>) => {
    if (!user) return;

    const promise = async () => {
      const tempId = self.crypto.randomUUID();
      const newProject: Project = {
        ...projectData,
        id: tempId,
        lastWorkedOn: new Date().toISOString(),
        user_id: user.id,
        progress: 0,
        status: 'planned',
      };

      setData(prev => ({ ...prev, projects: [newProject, ...prev.projects] }));

      const { data: savedProject, error } = await dataService.addProjectToRemote(newProject);
      
      if (savedProject && !error) {
        setData(prev => ({
          ...prev,
          projects: prev.projects.map(p => p.id === tempId ? mapToProject(savedProject) : p),
        }));
      } else {
        setData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== tempId) }));
        throw error || new Error("Failed to save project.");
      }
    };
    
    toast.promise(promise(), {
      loading: 'Creating project...',
      success: 'Project created successfully!',
      error: 'Error creating project.',
    });

  }, [user]);

  const updateProject = useCallback(async (projectId: string, updates: Partial<Omit<Project, 'id' | 'user_id'>>) => {
    if (!user) return;

    const promise = async () => {
      const originalProjects = data.projects;
      const updatedProject = { ...originalProjects.find(p => p.id === projectId)!, ...updates };
      
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === projectId ? updatedProject : p)
      }));

      const { data: savedProject, error } = await dataService.updateProjectToRemote(projectId, updates);

      if (error) {
        setData(prev => ({ ...prev, projects: originalProjects }));
        throw error;
      }
      
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === projectId ? mapToProject(savedProject) : p)
      }));
    };

    toast.promise(promise(), {
      loading: 'Updating project...',
      success: 'Project updated successfully!',
      error: 'Error updating project.',
    });
  }, [user, data.projects]);

  const deleteProject = useCallback(async (projectId: string) => {
    if (!user) return;

    const promise = async () => {
      const originalProjects = data.projects;
      setData(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== projectId)
      }));

      const { error } = await dataService.deleteProjectFromRemote(projectId);

      if (error) {
        setData(prev => ({ ...prev, projects: originalProjects }));
        throw error;
      }
    };

    toast.promise(promise(), {
      loading: 'Deleting project...',
      success: 'Project deleted successfully!',
      error: 'Error deleting project.',
    });
  }, [user, data.projects]);

  const saveMemorySnapshot = useCallback(async (projectId: string, thoughts: string, githubMetadata?: MemorySnapshot['github_metadata']) => {
    if (!user) return;

    const promise = async () => {
      const tempId = self.crypto.randomUUID();
      const newSnapshot: MemorySnapshot = {
        id: tempId,
        projectId,
        thoughts,
        timestamp: new Date().toISOString(),
        user_id: user.id,
        github_metadata: githubMetadata,
      };

      setData(prev => ({ ...prev, snapshots: [...prev.snapshots, newSnapshot] }));

      const { data: savedSnapshot, error } = await dataService.addSnapshotToRemote(newSnapshot);

      if (savedSnapshot && !error) {
        setData(prev => ({
          ...prev,
          snapshots: prev.snapshots.map(s => s.id === tempId ? mapToSnapshot(savedSnapshot) : s),
        }));
      } else {
        setData(prev => ({ ...prev, snapshots: prev.snapshots.filter(s => s.id !== tempId) }));
        throw error || new Error("Failed to save snapshot.");
      }
    };

    toast.promise(promise(), {
      loading: 'Saving snapshot...',
      success: 'Memory snapshot saved!',
      error: 'Error saving snapshot.',
    });
  }, [user]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'user_id' | 'status'>) => {
    if (!user) return;

    const promise = async () => {
      const tempId = self.crypto.randomUUID();
      const newTask: Task = {
        ...taskData,
        id: tempId,
        user_id: user.id,
        status: 'todo',
      };

      setData(prev => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
      const { data: savedTask, error } = await dataService.addTaskToRemote(newTask);

      if (savedTask && !error) {
        setData(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t.id === tempId ? mapToTask(savedTask) : t),
        }));
      } else {
        setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== tempId) }));
        throw error || new Error("Failed to save task.");
      }
    };

    toast.promise(promise(), {
      loading: 'Adding task...',
      success: 'Task added!',
      error: 'Error adding task.',
    });
  }, [user]);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Omit<Task, 'id' | 'user_id'>>) => {
    if (!user) return;

    const originalTasks = data.tasks;
    const updatedTask = { ...originalTasks.find(t => t.id === taskId)!, ...updates };
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? updatedTask : t)
    }));

    const { data: savedTask, error } = await dataService.updateTaskToRemote(taskId, updates);

    if (error) {
      setData(prev => ({ ...prev, tasks: originalTasks }));
      toast.error('Error updating task.');
    } else if (savedTask) {
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? mapToTask(savedTask) : t)
      }));
      // Don't show toast for every drag-drop, only for explicit edits.
      if (!updates.status) {
        toast.success('Task updated!');
      }
    }
  }, [user, data.tasks]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!user) return;

    const promise = async () => {
      const originalTasks = data.tasks;
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== taskId)
      }));

      const { error } = await dataService.deleteTaskFromRemote(taskId);

      if (error) {
        setData(prev => ({ ...prev, tasks: originalTasks }));
        throw error;
      }
    };

    toast.promise(promise(), {
      loading: 'Deleting task...',
      success: 'Task deleted!',
      error: 'Error deleting task.',
    });
  }, [user, data.tasks]);

  return { ...data, loading, addProject, updateProject, deleteProject, saveMemorySnapshot, addTask, updateTask, deleteTask };
};
