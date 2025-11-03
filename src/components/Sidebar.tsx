import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Plus, LayoutGrid, Columns, Calendar, LogOut, Settings } from 'lucide-react';
import { ViewType } from '../App';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  onNewProjectClick: () => void;
  onLogout: () => void;
}

const navItems = [
  { id: 'overview' as ViewType, label: 'Overview', icon: LayoutGrid },
  { id: 'kanban' as ViewType, label: 'Kanban', icon: Columns },
  { id: 'timeline' as ViewType, label: 'Timeline', icon: Calendar },
];

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, onNewProjectClick, onLogout }) => {
  const { user } = useAuth();
  
  const getUserInitial = () => {
    const fullName = user?.user_metadata?.full_name;
    if (fullName && typeof fullName === 'string' && fullName.length > 0) {
      return fullName.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || '?';
  };

  return (
    <motion.aside
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-64 bg-surface flex-shrink-0 flex flex-col p-4 border-r border-surface-light"
    >
      <div className="flex items-center gap-3 mb-8">
        <motion.div
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect"
        >
          <Brain className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
            MindTrail
          </h1>
        </div>
      </div>

      <motion.button
        onClick={onNewProjectClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-2 w-full mb-8 px-4 py-2.5 bg-primary hover:bg-primary-light rounded-xl text-sm font-medium transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>New Project</span>
      </motion.button>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <motion.a
              key={item.id}
              href="#"
              onClick={(e) => { e.preventDefault(); onViewChange(item.id); }}
              whileHover={{ x: 2 }}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-surface-light text-text-primary' : 'text-text-muted hover:text-text-secondary hover:bg-surface-light/50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeViewHighlight"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                />
              )}
            </motion.a>
          );
        })}
      </nav>

      <div className="mt-auto">
        <motion.a
            href="#"
            onClick={(e) => { e.preventDefault(); onViewChange('settings'); }}
            whileHover={{ x: 2 }}
            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-2 ${
              activeView === 'settings' ? 'bg-surface-light text-text-primary' : 'text-text-muted hover:text-text-secondary hover:bg-surface-light/50'
            }`}
          >
            <Settings className={`w-5 h-5 ${activeView === 'settings' ? 'text-primary' : ''}`} />
            <span>Settings</span>
            {activeView === 'settings' && (
              <motion.div
                layoutId="activeViewHighlight"
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
              />
            )}
          </motion.a>
        <div className="border-t border-surface-light -mx-4 my-2" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-light flex items-center justify-center text-primary font-bold">
            {getUserInitial()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user?.email}</p>
          </div>
          <motion.button
            onClick={onLogout}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-light text-text-muted hover:text-warning transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
