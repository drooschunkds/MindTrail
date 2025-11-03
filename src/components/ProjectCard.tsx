import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Pause, Calendar, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Project } from '../types/project';
import { formatTimeAgo, getStatusColor } from '../utils/formatters';

interface ProjectCardProps {
  project: Project;
  onMemorySnapshot: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onMemorySnapshot, onEdit, onDelete, index }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const statusIcons = {
    active: Play,
    paused: Pause,
    planned: Calendar,
  };
  
  const StatusIcon = statusIcons[project.status];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="glass-effect rounded-2xl p-6 border hover:border-primary/50 transition-all group relative"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${project.color}20`, border: `2px solid ${project.color}40` }}
          >
            <StatusIcon className="w-6 h-6" style={{ color: project.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-xs text-text-muted">{project.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(
              project.status
            )}`}
          >
            {project.status}
          </span>
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-lg bg-surface-light/50 hover:bg-surface-light flex items-center justify-center transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-text-muted" />
            </motion.button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  className="absolute top-10 right-0 w-36 glass-effect rounded-xl border p-2 z-10 shadow-lg"
                >
                  <button onClick={() => { onEdit(project); setMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-surface-light text-sm transition-colors">
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => { onDelete(project.id); setMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-surface-light text-sm text-warning transition-colors">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
            <span>Progress</span>
            <span className="font-semibold">{project.progress}%</span>
          </div>
          <div className="h-2 bg-surface-light rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              style={{ backgroundImage: `linear-gradient(to right, ${project.color}, ${project.color}dd)` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Clock className="w-3.5 h-3.5" />
          <span>Last worked {formatTimeAgo(new Date(project.lastWorkedOn))}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-surface-light rounded-lg text-xs text-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onMemorySnapshot(project)}
        className="w-full py-2.5 bg-surface-light hover:bg-primary/20 border border-surface-light hover:border-primary/50 rounded-xl text-sm font-medium transition-all"
      >
        Capture Memory Snapshot
      </motion.button>
    </motion.div>
  );
};

export default ProjectCard;
