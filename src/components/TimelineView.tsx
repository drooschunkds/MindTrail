import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Project } from '../types/project';
import { formatTimeAgo } from '../utils/formatters';

interface TimelineViewProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const TimelineView: React.FC<TimelineViewProps> = ({ projects, onProjectClick }) => {
  // Projects are already sorted by App.tsx
  const sortedProjects = projects;

  const groupByDate = (projects: Project[]) => {
    const groups: { [key: string]: Project[] } = {};
    
    projects.forEach((project) => {
      const date = new Date(project.lastWorkedOn).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(project);
    });
    
    return groups;
  };

  const groupedProjects = groupByDate(sortedProjects);
  const dates = Object.keys(groupedProjects);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {dates.length === 0 ? (
         <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 glass-effect rounded-2xl border border-dashed"
          >
            <Clock className="w-12 h-12 mx-auto text-text-muted" />
            <h3 className="text-lg font-medium mt-4">Timeline is empty.</h3>
            <p className="text-text-muted mt-2">No projects match your current filters.</p>
          </motion.div>
      ) : dates.map((date, groupIndex) => (
        <motion.div
          key={date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="relative"
        >
          <div className="absolute left-3 top-1 w-0.5 h-full bg-surface-light -z-10" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center ring-4 ring-surface">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <h3 className="text-md font-semibold text-text-secondary">{date}</h3>
          </div>
          
          <div className="ml-10 space-y-4">
            {groupedProjects[date].map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                whileHover={{ x: 4 }}
                onClick={() => onProjectClick(project)}
                className="glass-effect rounded-xl p-4 border hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${project.color}20`, border: `1px solid ${project.color}40` }}
                  >
                    <Clock className="w-5 h-5" style={{ color: project.color }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text-primary mb-1">{project.title}</h4>
                    <p className="text-sm text-text-muted mb-2 truncate">{project.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-text-muted">
                      <span>{formatTimeAgo(new Date(project.lastWorkedOn))}</span>
                      <span className="flex items-center gap-1">
                        Progress: <span className="font-semibold">{project.progress}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TimelineView;
