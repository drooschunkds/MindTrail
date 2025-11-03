import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, FolderPlus } from 'lucide-react';
import { Project } from '../types/project';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Omit<Project, 'id' | 'lastWorkedOn' | 'user_id' | 'progress' | 'status'>) => void;
}

const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState(colors[0]);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setTags('');
      setColor(colors[0]);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title,
        description,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        color,
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="glass-effect rounded-2xl p-6 w-full max-w-lg border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/20 border-2 border-primary/40">
                    <FolderPlus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Create New Project</h2>
                    <p className="text-sm text-text-muted">Start a new creative journey</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-surface-light hover:bg-surface flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="space-y-4">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" className="w-full px-4 py-3 bg-surface-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full h-24 px-4 py-3 bg-surface-light rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma-separated)" className="w-full px-4 py-3 bg-surface-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Color</label>
                  <div className="flex gap-2">
                    {colors.map(c => (
                      <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-offset-surface ring-white' : ''}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="flex-1 py-3 bg-surface-light hover:bg-surface rounded-xl font-medium transition-colors">Cancel</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={!title.trim()} className="flex-1 py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-xl font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    Create Project
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewProjectModal;
