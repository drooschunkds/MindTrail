import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Edit, Trash2, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task, Project } from '../types/project';

interface TaskCardProps {
  task: Task;
  project?: Project;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, project, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  };

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
    <div ref={setNodeRef} style={style} {...attributes}>
      <motion.div
        whileHover={{ scale: 1.02, backgroundColor: '#1f1f2e' }}
        className="bg-surface-light border border-surface-light hover:border-primary/30 rounded-xl p-3 transition-all relative flex items-center gap-2"
      >
        <div {...listeners} className="cursor-grab p-1 text-text-muted hover:text-text-primary">
          <GripVertical className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <p className="text-sm text-text-primary font-medium mb-1 pr-6">{task.title}</p>
          {project && (
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className="text-xs text-text-muted">{project.title}</span>
            </div>
          )}
        </div>
        
        <div className="absolute top-2 right-2" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            className="w-7 h-7 rounded-lg bg-surface/50 hover:bg-surface flex items-center justify-center transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-text-muted" />
          </motion.button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute top-8 right-0 w-36 glass-effect rounded-xl border p-2 z-20 shadow-lg"
              >
                <button onClick={() => { onEdit(task); setMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-surface-light text-sm transition-colors">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => { onDelete(task.id); setMenuOpen(false); }} className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg hover:bg-surface-light text-sm text-warning transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskCard;
