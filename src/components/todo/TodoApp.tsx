import { useState, useMemo } from 'react';
import { useTodos } from '@/hooks';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import { TodoFilters } from './TodoFilters';
import { TodoStats } from './TodoStats';
import { TodoTimeline } from './TodoTimeline';
import type { ViewMode } from '@/types';

// ─── Container Component ─────────────────────────────────────────────────────

export function TodoApp() {
  const {
    todos,
    filteredTodos,
    filter,
    activeCount,
    completedCount,
    totalCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    setDueDate,
    setPriority,
    clearCompleted,
    setFilter,
  } = useTodos();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');

  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter by search query on top of filter
  const displayTodos = useMemo(() => {
    if (!searchQuery.trim()) return filteredTodos;
    const q = searchQuery.toLowerCase();
    return filteredTodos.filter((t) => t.text.toLowerCase().includes(q));
  }, [filteredTodos, searchQuery]);

  // Also filter timeline todos by search
  const timelineTodos = useMemo(() => {
    if (!searchQuery.trim()) return todos;
    const q = searchQuery.toLowerCase();
    return todos.filter((t) => t.text.toLowerCase().includes(q));
  }, [todos, searchQuery]);

  const highPriorityCount = useMemo(
    () => todos.filter((t) => t.priority === 'high' && !t.completed).length,
    [todos]
  );

  return (
    <div className="space-y-6">
      {/* ── Stats Overview Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Tasks"
          value={totalCount}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="blue"
        />
        <StatCard
          label="In Progress"
          value={activeCount}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="amber"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="emerald"
        />
        <StatCard
          label={highPriorityCount > 0 ? 'Urgent' : 'Progress'}
          value={highPriorityCount > 0 ? highPriorityCount : `${progress}%`}
          icon={
            highPriorityCount > 0 ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            ) : (
              <ProgressRing percentage={progress} size={20} strokeWidth={2.5} />
            )
          }
          color={highPriorityCount > 0 ? 'purple' : 'purple'}
        />
      </div>

      {/* ── Main Card ── */}
      <div className="glass-strong rounded-2xl sm:rounded-3xl shadow-xl shadow-black/5 dark:shadow-black/20 overflow-visible">
        {/* Input Section */}
        <div className="p-4 sm:p-6">
          <TodoInput onAdd={addTodo} />
        </div>

        {/* View Toggle + Search + Filters */}
        <div className="px-4 sm:px-6 pb-4 flex flex-col sm:flex-row gap-3">
          {/* View Mode Toggle */}
          <div className="flex gap-1 p-1 bg-gray-100/60 dark:bg-gray-800/40 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                ${viewMode === 'list'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
              aria-label="List view"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                ${viewMode === 'timeline'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }
              `}
              aria-label="Timeline view"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Timeline
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-shrink-0">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="
                w-40 sm:w-48 pl-8 pr-3 py-2 rounded-xl text-xs font-medium
                bg-gray-100/60 dark:bg-gray-800/40
                text-gray-700 dark:text-gray-200
                placeholder-gray-400 dark:placeholder-gray-500
                border border-transparent
                focus:border-primary-300 dark:focus:border-primary-500/30
                focus:bg-white dark:focus:bg-gray-800
                focus:outline-none focus:ring-1 focus:ring-primary-400/30
                transition-all duration-200
              "
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filters (only for list view) */}
          {viewMode === 'list' && (
            <div className="flex-1">
              <TodoFilters
                currentFilter={filter}
                onFilterChange={setFilter}
                activeCount={activeCount}
                completedCount={completedCount}
                totalCount={totalCount}
              />
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="px-4 sm:px-6 pb-4 max-h-[32rem] overflow-y-auto overflow-x-visible scrollbar-thin">
          {viewMode === 'list' ? (
            <TodoList
              todos={displayTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
              onSetDueDate={setDueDate}
              onSetPriority={setPriority}
            />
          ) : (
            <TodoTimeline
              todos={timelineTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          )}
        </div>

        {/* Footer / Stats bar */}
        <TodoStats
          activeCount={activeCount}
          completedCount={completedCount}
          totalCount={totalCount}
          onClearCompleted={clearCompleted}
        />
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'emerald' | 'purple';
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    icon: 'text-blue-500 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-500/20',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    icon: 'text-amber-500 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-500/20',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    icon: 'text-emerald-500 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-500/20',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    icon: 'text-purple-500 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-500/20',
  },
};

function StatCard({ label, value, icon, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`glass-strong rounded-xl sm:rounded-2xl p-3 sm:p-4 border ${c.border} group hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center ${c.icon}`}>
          {icon}
        </div>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-[11px] sm:text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function ProgressRing({ percentage, size, strokeWidth }: { percentage: number; size: number; strokeWidth: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        fill="none"
        className="stroke-purple-200 dark:stroke-purple-800/40"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="stroke-purple-500 dark:stroke-purple-400 transition-all duration-500 ease-out"
      />
    </svg>
  );
}
