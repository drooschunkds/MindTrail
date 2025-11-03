import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Brain, Loader } from 'lucide-react';
import { Project, MemorySnapshot } from '../types/project';
import { useAuth } from '../contexts/AuthContext';
import { getLatestCommitInfo } from '../services/githubService';

interface MemorySnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectId: string, thoughts: string, githubMetadata?: MemorySnapshot['github_metadata']) => void;
  project: Project | null;
}

const MemorySnapshotModal: React.FC<MemorySnapshotModalProps> = ({ isOpen, onClose, onSave, project }) => {
  const { providerToken } = useAuth();
  const [thoughts, setThoughts] = useState('');
  const [githubMetadata, setGithubMetadata] = useState<MemorySnapshot['github_metadata'] | null>(null);
  const [isLoadingGithub, setIsLoadingGithub] = useState(false);

  const fetchGithubData = useCallback(async () => {
    if (!project?.github_repo_url || !providerToken) return;

    setIsLoadingGithub(true);
    setGithubMetadata(null);
    try {
      const metadata = await getLatestCommitInfo(providerToken, project.github_repo_url);
      setGithubMetadata(metadata);
    } catch (error) {
      console.error("Failed to fetch GitHub data for snapshot:", error);
    } finally {
      setIsLoadingGithub(false);
    }
  }, [project, providerToken]);

  useEffect(() => {
    if (isOpen) {
      fetchGithubData();
    } else {
      setThoughts('');
      setGithubMetadata(null);
    }
  }, [isOpen, fetchGithubData]);

  const handleSave = () => {
    if (project && thoughts.trim()) {
      onSave(project.id, thoughts, githubMetadata || undefined);
    }
  };

  if (!project) return null;

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
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${project.color}20`, border: `2px solid ${project.color}40` }}
                  >
                    <Brain className="w-5 h-5" style={{ color: project.color }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Memory Snapshot</h2>
                    <p className="text-sm text-text-muted">{project.title}</p>
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
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    What are you thinking about right now?
                  </label>
                  <textarea
                    value={thoughts}
                    onChange={(e) => setThoughts(e.target.value)}
                    placeholder="Capture your current thoughts, ideas, or where you left off..."
                    className="w-full h-40 px-4 py-3 bg-surface-light border border-surface-light focus:border-primary rounded-xl resize-none text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
                    autoFocus
                  />
                </div>

                {project.github_repo_url && (
                  <div className="bg-surface-light/50 rounded-xl p-4 border border-surface-light text-xs">
                    {isLoadingGithub && <div className="flex items-center gap-2 text-text-muted"><Loader className="w-3 h-3 animate-spin" /> Fetching GitHub context...</div>}
                    {githubMetadata && (
                       <div>
                         <p className="font-medium text-text-secondary mb-1">GitHub Context:</p>
                         <p className="text-text-muted truncate">Repo: <span className="font-mono text-text-secondary">{githubMetadata.repo}</span></p>
                         <p className="text-text-muted">Branch: <span className="font-mono text-text-secondary">{githubMetadata.branch}</span></p>
                         <p className="text-text-muted truncate">Commit: <span className="font-mono text-text-secondary">{githubMetadata.commit.slice(0, 7)}</span></p>
                       </div>
                    )}
                    {!isLoadingGithub && !githubMetadata && <div>Could not fetch GitHub context.</div>}
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 py-3 bg-surface-light hover:bg-surface rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={!thoughts.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-xl font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Snapshot
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

export default MemorySnapshotModal;
