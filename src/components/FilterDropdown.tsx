import React from 'react';
import { motion } from 'framer-motion';
import { SortAsc, SortDesc } from 'lucide-react';
import { ProjectStatus } from '../types/project';
import { SortByType, SortOrderType } from '../App';

interface FilterDropdownProps {
  filterStatuses: ProjectStatus[];
  onFilterStatusesChange: (statuses: ProjectStatus[]) => void;
  sortBy: SortByType;
  onSortByChange: (sortBy: SortByType) => void;
  sortOrder: SortOrderType;
  onSortOrderChange: (sortOrder: SortOrderType) => void;
  onClose: () => void;
}

const statusOptions: { id: ProjectStatus; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'planned', label: 'Planned' },
];

const sortOptions: { id: SortByType; label: string }[] = [
  { id: 'lastWorkedOn', label: 'Last Worked On' },
  { id: 'progress', label: 'Progress' },
  { id: 'title', label: 'Title' },
];

const FilterDropdown: React.FC<FilterDropdownProps> = (props) => {
  const {
    filterStatuses,
    onFilterStatusesChange,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange,
  } = props;

  const handleStatusChange = (status: ProjectStatus) => {
    const newStatuses = filterStatuses.includes(status)
      ? filterStatuses.filter(s => s !== status)
      : [...filterStatuses, status];
    onFilterStatusesChange(newStatuses);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-14 right-0 w-72 glass-effect rounded-2xl border p-4 z-40 shadow-lg"
    >
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-text-secondary mb-2">Filter by Status</h4>
          <div className="space-y-2">
            {statusOptions.map(option => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterStatuses.includes(option.id)}
                  onChange={() => handleStatusChange(option.id)}
                  className="h-4 w-4 rounded bg-surface-light border-surface-light text-primary focus:ring-primary"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-surface-light" />

        <div>
          <h4 className="text-sm font-semibold text-text-secondary mb-2">Sort By</h4>
          <div className="flex flex-col gap-1">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => onSortByChange(option.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  sortBy === option.id ? 'bg-surface-light text-text-primary' : 'hover:bg-surface-light/50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-surface-light" />

        <div>
          <h4 className="text-sm font-semibold text-text-secondary mb-2">Order</h4>
          <div className="flex bg-surface-light p-1 rounded-lg">
            <button
              onClick={() => onSortOrderChange('asc')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm transition-colors ${
                sortOrder === 'asc' ? 'bg-surface text-text-primary' : 'text-text-muted'
              }`}
            >
              <SortAsc className="w-4 h-4" /> Ascending
            </button>
            <button
              onClick={() => onSortOrderChange('desc')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md text-sm transition-colors ${
                sortOrder === 'desc' ? 'bg-surface text-text-primary' : 'text-text-muted'
              }`}
            >
              <SortDesc className="w-4 h-4" /> Descending
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterDropdown;
