import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Edit, Github, Link, Loader, GitBranch, GitCommit, AlertCircle } from 'lucide-react';
import { Project, ProjectStatus } from '../types/project';
import { useAuth } from '../contexts/AuthContext';
import * as githubService from '../services/githubService';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectId: string, updates: Partial<Omit<Project, 'id' | 'user_id'>>) => void;
  project: Project | null;
}

const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'];
const statuses: ProjectStatus[] = ['planned', 'active', 'paused'];

const GitHubInfoPanel: React.FC<{ repoUrl: string; providerToken: string }> = ({ repoUrl, providerToken }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const repoDetails = await githubService.getRepoDetails(providerToken, repoUrl);
        setDetails(repoDetails);
      } catch (err) {
        setError('Failed to fetch repository details. The repository might be private or the token invalid.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [repoUrl, providerToken]);

  if (loading) {
    return <div className="flex items-center gap-2 text-sm text-text-muted"><Loader className="w-4 h-4 animate-spin" />Loading GitHub details...</div>;
  }

  if (error) {
    return <div className="text-sm text-warning flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>;
  }

  if (!details) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-text-primary">GitHub Details</h4>
        <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">View on GitHub <Github className="w-3 h-3" /></a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-surface p-3 rounded-lg">
          <p className="text-text-muted text-xs mb-1">Default Branch</p>
          <p className="font-mono text-text-secondary flex items-center gap-2"><GitBranch className="w-4 h-4" />{details.default_branch}</p>
        </div>
        <div className="bg-surface p-3 rounded-lg">
          <p className="text-text-muted text-xs mb-1">Open Issues</p>
          <p className="font-semibold text-text-secondary">{details.open_issues_count}</p>
        </div>
        <div className="bg-surface p-3 rounded-lg">
          <p className="text-text-muted text-xs mb-1">Last Push</p>
          <p className="text-text-secondary">{new Date(details.pushed_at).toLocaleDateString()}</p>
        </div>
      </div>
       <div>
        <h5 className="text-xs font-semibold text-text-muted mb-2">Recent Commits</h5>
        <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
          {details.commits.map((commit: any) => (
            <div key={commit.sha} className="flex items-start gap-2 text-xs">
              <GitCommit className="w-3.5 h-3.5 mt-0.5 text-text-muted flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-text-secondary truncate" title={commit.commit.message}>{commit.commit.message.split('\n')[0]}</p>
                <p className="text-text-muted">{commit.commit.author.name} - <span className="font-mono">{commit.sha.slice(0, 7)}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const EditProjectModal: React.FC<EditProjectModalProps> = ({ isOpen, onClose, onSave, project }) => {
  const { providerToken } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [status, setStatus] = useState<ProjectStatus>('planned');
  const [progress, setProgress] = useState(0);
  const [githubRepoUrl, setGithubRepoUrl] = useState<string | null>(null);

  // GitHub linking state
  const [isLinking, setIsLinking] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);
  const [repoSearch, setRepoSearch] = useState('');
  const [loadingRepos, setLoadingRepos] = useState(false);

  useEffect(() => {
    if (project && isOpen) {
      setTitle(project.title);
      setDescription(project.description || '');
      setTags(project.tags.join(', '));
      setColor(project.color);
      setStatus(project.status);
      setProgress(project.progress);
      setGithubRepoUrl(project.github_repo_url || null);
      // Reset linking state
      setIsLinking(false);
      setRepos([]);
      setRepoSearch('');
    }
  }, [project, isOpen]);

  const handleFetchRepos = async () => {
    if (!providerToken) {
      toast.error("GitHub account not linked or token is missing.");
      return;
    }
    setLoadingRepos(true);
    try {
      const userRepos = await githubService.getUserRepos(providerToken);
      setRepos(userRepos);
    } catch (error) {
      toast.error("Failed to fetch repositories.");
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleLinkRepo = (repoUrl: string) => {
    setGithubRepoUrl(repoUrl);
    setIsLinking(false);
  };

  const handleSave = () => {
    if (project && title.trim()) {
      const updates: Partial<Omit<Project, 'id' | 'user_id'>> = {};
      if (title !== project.title) updates.title = title;
      if (description !== project.description) updates.description = description;
      const newTags = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (JSON.stringify(newTags) !== JSON.stringify(project.tags)) updates.tags = newTags;
      if (color !== project.color) updates.color = color;
      if (status !== project.status) updates.status = status;
      if (progress !== project.progress) updates.progress = progress;
      if (githubRepoUrl !== project.github_repo_url) updates.github_repo_url = githubRepoUrl || undefined;

      if (Object.keys(updates).length > 0) {
        onSave(project.id, updates);
      } else {
        onClose(); // No changes, just close
      }
    }
  };
  
  const filteredRepos = repos.filter(repo => repo.name.toLowerCase().includes(repoSearch.toLowerCase()));

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
              className="glass-effect rounded-2xl p-6 w-full max-w-2xl border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/20 border-2 border-primary/40">
                    <Edit className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Edit Project</h2>
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

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" className="w-full px-4 py-3 bg-surface-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" autoFocus />
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" className="w-full h-24 px-4 py-3 bg-surface-light rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
                <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma-separated)" className="w-full px-4 py-3 bg-surface-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {colors.map(c => (
                        <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'ring-2 ring-offset-2 ring-offset-surface ring-white' : ''}`} style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Status</label>
                    <div className="flex gap-2 flex-wrap">
                      {statuses.map(s => (
                        <button key={s} onClick={() => setStatus(s)} className={`px-3 py-1 rounded-lg text-sm capitalize transition-colors ${status === s ? 'bg-primary text-white' : 'bg-surface-light hover:bg-surface'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">Progress: {progress}%</label>
                  <input type="range" min="0" max="100" value={progress} onChange={e => setProgress(Number(e.target.value))} className="w-full h-2 bg-surface-light rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>
                
                <div className="border-t border-surface-light my-4" />

                {/* GitHub Section */}
                <div className="space-y-4">
                  {isLinking ? (
                    <div>
                      <h4 className="font-semibold text-text-primary mb-2">Select Repository</h4>
                      <input type="text" placeholder="Search your repositories..." value={repoSearch} onChange={e => setRepoSearch(e.target.value)} className="w-full px-4 py-2 bg-surface rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-2" />
                      {loadingRepos ? <Loader className="animate-spin" /> : (
                        <div className="max-h-48 overflow-y-auto space-y-1 pr-2">
                          {filteredRepos.map(repo => (
                            <button key={repo.id} onClick={() => handleLinkRepo(repo.html_url)} className="w-full text-left p-2 rounded-lg hover:bg-surface text-sm">
                              <p className="font-medium">{repo.full_name}</p>
                              <p className="text-xs text-text-muted truncate">{repo.description}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : githubRepoUrl ? (
                    providerToken ? (
                      <GitHubInfoPanel repoUrl={githubRepoUrl} providerToken={providerToken} />
                    ) : (
                      <div className="text-sm text-warning">Please re-login with GitHub to see repository details.</div>
                    )
                  ) : (
                    <button onClick={() => { setIsLinking(true); handleFetchRepos(); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-surface-light hover:bg-surface rounded-xl font-medium transition-colors">
                      <Link className="w-4 h-4" /> Link GitHub Repository
                    </button>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onClose} className="flex-1 py-3 bg-surface-light hover:bg-surface rounded-xl font-medium transition-colors">Cancel</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={!title.trim()} className="flex-1 py-3 bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-xl font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
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

export default EditProjectModal;
