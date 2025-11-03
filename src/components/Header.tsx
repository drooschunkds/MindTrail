import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { ViewType, SortByType, SortOrderType } from '../App';
import { ProjectStatus } from '../types/project';
import FilterDropdown from './FilterDropdown';

interface HeaderProps {
  activeView: ViewType;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStatuses: ProjectStatus[];
  onFilterStatusesChange: (statuses: ProjectStatus[]) => void;
  sortBy: SortByType;
  onSortByChange: (sortBy: SortByType) => void;
  sortOrder: SortOrderType;
  onSortOrderChange: (sortOrder: SortOrderType) => void;
}

const viewTitles: Record<ViewType, string> = {
  overview: 'Overview',
  kanban: 'Kanban Board',
  timeline: 'Project Timeline',
  settings: 'Settings'
};

const Header: React.FC<HeaderProps> = (props) => {
  const { activeView, searchTerm, onSearchChange } = props;
  const [isFilterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showControls = activeView !== 'settings';

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-surface/80 backdrop-blur-lg border-b border-surface-light px-4 sm:px-6 lg:px-8 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-primary capitalize">
          {viewTitles[activeView]}
        </h1>
        
        {showControls && (
          <div className="flex-1 max-w-xl flex items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
            </div>
            
            <div className="relative" ref={filterRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterOpen(!isFilterOpen)}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-surface-light hover:bg-surface rounded-xl text-sm font-medium transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-text-muted" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {isFilterOpen && <FilterDropdown {...props} onClose={() => setFilterOpen(false)} />}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;
