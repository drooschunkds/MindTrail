import { Project } from "../types/project";

export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w ago`;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-success/20 text-success border-success/30';
    case 'paused':
      return 'bg-warning/20 text-warning border-warning/30';
    case 'planned':
      return 'bg-accent/20 text-accent border-accent/30';
    default:
      return 'bg-muted/20 text-muted border-muted/30';
  }
};

export const getProjectStats = (projects: Project[]) => {
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
    : 0;
  
  return { activeProjects, avgProgress };
};
