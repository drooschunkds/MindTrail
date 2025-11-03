import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Circle, PlayCircle, CheckCircle, Plus } from 'lucide-react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Project, Task } from '../types/project';
import TaskCard from './TaskCard';

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface KanbanViewProps {
  projects: Project[];
  tasks: Task[];
  onNewTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

const columns: { id: TaskStatus; title: string; icon: React.ElementType; color: string }[] = [
  { id: 'todo', title: 'To Do', icon: Circle, color: 'text-accent' },
  { id: 'in-progress', title: 'In Progress', icon: PlayCircle, color: 'text-warning' },
  { id: 'done', title: 'Done', icon: CheckCircle, color: 'text-success' },
];

const KanbanColumn: React.FC<{
  column: typeof columns[0];
  tasks: Task[];
  projects: Project[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onNewTask: () => void;
}> = ({ column, tasks, projects, onEditTask, onDeleteTask, onNewTask }) => {
  const { setNodeRef } = useDroppable({ id: column.id });
  const Icon = column.icon;

  return (
    <div ref={setNodeRef} className="bg-surface rounded-2xl p-4 border border-surface-light h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 px-2">
        <Icon className={`w-5 h-5 ${column.color}`} />
        <h3 className="font-semibold text-text-primary">{column.title}</h3>
        <span className="ml-auto text-xs text-text-muted bg-surface-light px-2 py-1 rounded-lg">
          {tasks.length}
        </span>
      </div>
      
      <SortableContext id={column.id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[100px] flex-1">
          {tasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            return (
              <TaskCard
                key={task.id}
                task={task}
                project={project}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            );
          })}
        </div>
      </SortableContext>
      
      {column.id === 'todo' && (
        <motion.button
          onClick={onNewTask}
          whileHover={{ scale: 1.05 }}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-light hover:bg-primary/20 rounded-xl text-sm font-medium text-text-muted hover:text-text-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </motion.button>
      )}
    </div>
  );
};

const KanbanView: React.FC<KanbanViewProps> = ({ projects, tasks, onNewTask, onEditTask, onDeleteTask, onUpdateTask }) => {
  const tasksByColumn = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = { todo: [], 'in-progress': [], done: [] };
    tasks.forEach((task) => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const task = tasks.find((t) => t.id === activeId);
    if (!task) return;

    // The target column is either the ID of the droppable container itself (if empty),
    // or the container of the sortable item we're hovering over.
    const targetColumnId = columns.some(c => c.id === overId)
      ? overId
      : over.data.current?.sortable?.containerId;

    if (targetColumnId && task.status !== targetColumnId) {
      onUpdateTask(task.id, { status: targetColumnId as TaskStatus });
    }
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map((column, colIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.1 }}
          >
            <KanbanColumn
              column={column}
              tasks={tasksByColumn[column.id]}
              projects={projects}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onNewTask={onNewTask}
            />
          </motion.div>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanView;
