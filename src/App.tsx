import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewView from './components/OverviewView';
import KanbanView from './components/KanbanView';
import TimelineView from './components/TimelineView';
import SettingsView from './components/SettingsView';
import MemorySnapshotModal from './components/MemorySnapshotModal';
import NewProjectModal from './components/NewProjectModal';
import EditProjectModal from './components/EditProjectModal';
import NewTaskModal from './components/NewTaskModal';
import EditTaskModal from './components/EditTaskModal';
import Auth from './components/Auth';
import { useMindTrailStorage } from './hooks/useMindTrailStorage';
import { useAuth } from './contexts/AuthContext';
import { Project, Task, ProjectStatus, MemorySnapshot } from './types/project';
import { Loader } from 'lucide-react';
import { Toaster } from 'sonner';

export type ViewType = 'overview' | 'kanban' | 'timeline' | 'settings';
export type SortByType = 'lastWorkedOn' | 'progress' | 'title';
export type SortOrderType = 'asc' | 'desc';

function App() {
  const { session, signOut } = useAuth();
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [isSnapshotModalOpen, setSnapshotModalOpen] = useState(false);
  const [isNewProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setEditProjectModalOpen] = useState(false);
  const [isNewTaskModalOpen, setNewTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and Sort State
  const [filterStatuses, setFilterStatuses] = useState<ProjectStatus[]>([]);
  const [sortBy, setSortBy] = useState<SortByType>('lastWorkedOn');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('desc');

  const { projects, tasks, loading, saveMemorySnapshot, addProject, updateProject, deleteProject, addTask, updateTask, deleteTask } = useMindTrailStorage();

  const handleMemorySnapshotClick = (project: Project) => {
    setSelectedProject(project);
    setSnapshotModalOpen(true);
  };
  
  const handleSaveSnapshot = async (projectId: string, thoughts: string, githubMetadata?: MemorySnapshot['github_metadata']) => {
    await saveMemorySnapshot(projectId, thoughts, githubMetadata);
    setSnapshotModalOpen(false);
    setSelectedProject(null);
  };

  const handleSaveProject = async (projectData: Omit<Project, 'id' | 'lastWorkedOn' | 'user_id' | 'progress' | 'status'>) => {
    await addProject(projectData);
    setNewProjectModalOpen(false);
  };

  const handleEditProjectClick = (project: Project) => {
    setSelectedProject(project);
    setEditProjectModalOpen(true);
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<Omit<Project, 'id' | 'user_id'>>) => {
    await updateProject(projectId, updates);
    setEditProjectModalOpen(false);
    setSelectedProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteProject(projectId);
    }
  };

  const handleSaveTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'status'>) => {
    await addTask(taskData);
    setNewTaskModalOpen(false);
  };

  const handleEditTaskClick = (task: Task) => {
    setSelectedTask(task);
    setEditTaskModalOpen(true);
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Omit<Task, 'id' | 'user_id'>>) => {
    await updateTask(taskId, updates);
    setEditTaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let processedProjects = [...projects];

    // 1. Filter by search term
    if (searchTerm) {
      processedProjects = processedProjects.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 2. Filter by status
    if (filterStatuses.length > 0) {
      processedProjects = processedProjects.filter(p => filterStatuses.includes(p.status));
    }

    // 3. Sort
    processedProjects.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'lastWorkedOn') {
        comparison = new Date(b.lastWorkedOn).getTime() - new Date(a.lastWorkedOn).getTime();
      } else if (sortBy === 'progress') {
        comparison = b.progress - a.progress;
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return processedProjects;
  }, [projects, searchTerm, filterStatuses, sortBy, sortOrder]);

  const filteredTasks = useMemo(() => {
    const projectIds = new Set(filteredAndSortedProjects.map(p => p.id));
    return tasks.filter(t => projectIds.has(t.projectId));
  }, [tasks, filteredAndSortedProjects]);

  if (!session) {
    return <Auth />;
  }

  const renderView = () => {
    if (loading && activeView !== 'settings') {
      return (
        <div className="flex justify-center items-center h-96">
          <Loader className="w-8 h-8 animate-spin text-primary" />
        </div>
      );
    }
    
    switch (activeView) {
      case 'overview':
        return <OverviewView projects={filteredAndSortedProjects} tasks={tasks} onMemorySnapshot={handleMemorySnapshotClick} onEdit={handleEditProjectClick} onDelete={handleDeleteProject} />;
      case 'kanban':
        return <KanbanView projects={filteredAndSortedProjects} tasks={filteredTasks} onNewTask={() => setNewTaskModalOpen(true)} onEditTask={handleEditTaskClick} onDeleteTask={handleDeleteTask} onUpdateTask={updateTask} />;
      case 'timeline':
        return <TimelineView projects={filteredAndSortedProjects} onProjectClick={handleEditProjectClick} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView projects={filteredAndSortedProjects} tasks={tasks} onMemorySnapshot={handleMemorySnapshotClick} onEdit={handleEditProjectClick} onDelete={handleDeleteProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex">
      <Toaster position="bottom-right" theme="dark" richColors />
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView} 
        onNewProjectClick={() => setNewProjectModalOpen(true)}
        onLogout={signOut}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          activeView={activeView} 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterStatuses={filterStatuses}
          onFilterStatusesChange={setFilterStatuses}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </main>
      </div>

      <MemorySnapshotModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setSnapshotModalOpen(false)}
        onSave={handleSaveSnapshot}
        project={selectedProject}
      />
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setNewProjectModalOpen(false)}
        onSave={handleSaveProject}
      />
      <EditProjectModal
        isOpen={isEditProjectModalOpen}
        onClose={() => setEditProjectModalOpen(false)}
        onSave={handleUpdateProject}
        project={selectedProject}
      />
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setNewTaskModalOpen(false)}
        onSave={handleSaveTask}
        projects={projects}
      />
      <EditTaskModal
        isOpen={isEditTaskModalOpen}
        onClose={() => setEditTaskModalOpen(false)}
        onSave={handleUpdateTask}
        task={selectedTask}
      />
    </div>
  );
}

export default App;
