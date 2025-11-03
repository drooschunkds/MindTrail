import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, Folder } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { Project, Task } from '../types/project';
import { getProjectStats } from '../utils/formatters';

interface OverviewViewProps {
  projects: Project[];
  tasks: Task[];
  onMemorySnapshot: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
}

const OverviewView: React.FC<OverviewViewProps> = ({ projects, tasks, onMemorySnapshot, onEdit, onDelete }) => {
  const { activeProjects, avgProgress } = getProjectStats(projects);
  const completedTasks = tasks.filter(t => t.status === 'done').length;

  const stats = [
    { label: 'Active Projects', value: activeProjects, icon: TrendingUp, color: 'from-success to-emerald-600' },
    { label: 'Avg. Progress', value: `${avgProgress}%`, icon: Clock, color: 'from-primary to-purple-600' },
    { label: 'Tasks Completed', value: completedTasks, icon: CheckCircle, color: 'from-accent to-blue-600' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="glass-effect rounded-2xl p-6 border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div>
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 glass-effect rounded-2xl border border-dashed"
          >
            <Folder className="w-12 h-12 mx-auto text-text-muted" />
            <h3 className="text-lg font-medium mt-4">No projects found.</h3>
            <p className="text-text-muted mt-2">Try adjusting your search or click "New Project" to get started.</p>
          </motion.div>
        ) : (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
            <AnimatePresence>
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onMemorySnapshot={onMemorySnapshot}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OverviewView;
