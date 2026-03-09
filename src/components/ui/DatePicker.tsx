import { useState, useMemo, useCallback, useRef, useEffect } from 'react';

// ─── Props ───────────────────────────────────────────────────────────────────

interface DatePickerProps {
  value: string | null;      // 'YYYY-MM-DD' or null
  onChange: (date: string | null) => void;
  minDate?: string;          // earliest selectable date
  placeholder?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function parseDate(str: string): { year: number; month: number; day: number } {
  const [y, m, d] = str.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isToday(dateStr: string): boolean {
  const now = new Date();
  return dateStr === toDateStr(now.getFullYear(), now.getMonth(), now.getDate());
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const diff = d.getTime() - today.getTime();
  const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) return 'Today';
  if (daysDiff === 1) return 'Tomorrow';
  if (daysDiff === -1) return 'Yesterday';
  if (daysDiff > 1 && daysDiff <= 6) {
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
}

export function getRelativeDateLabel(dateStr: string | null): { label: string; color: string } {
  if (!dateStr) return { label: 'No date', color: 'text-gray-400 dark:text-gray-500' };

  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = d.getTime() - today.getTime();
  const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) return { label: formatDisplayDate(dateStr), color: 'text-red-500 dark:text-red-400' };
  if (daysDiff === 0) return { label: 'Today', color: 'text-primary-500 dark:text-primary-400' };
  if (daysDiff === 1) return { label: 'Tomorrow', color: 'text-amber-500 dark:text-amber-400' };
  if (daysDiff <= 6) return { label: formatDisplayDate(dateStr), color: 'text-emerald-500 dark:text-emerald-400' };
  return { label: formatDisplayDate(dateStr), color: 'text-gray-500 dark:text-gray-400' };
}

// ─── Component ───────────────────────────────────────────────────────────────

export function DatePicker({ value, onChange, placeholder = 'Set due date' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const now = new Date();
  const initial = value ? parseDate(value) : { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [isOpen]);

  const daysInMonth = useMemo(() => getDaysInMonth(viewYear, viewMonth), [viewYear, viewMonth]);
  const firstDay = useMemo(() => getFirstDayOfWeek(viewYear, viewMonth), [viewYear, viewMonth]);

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) { setViewYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) { setViewYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  const selectDate = useCallback((day: number) => {
    const dateStr = toDateStr(viewYear, viewMonth, day);
    onChange(dateStr);
    setIsOpen(false);
  }, [viewYear, viewMonth, onChange]);

  const clearDate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setIsOpen(false);
  }, [onChange]);

  const quickDates = useMemo(() => {
    const today = new Date();
    const tom = new Date(today); tom.setDate(tom.getDate() + 1);
    const nextWeek = new Date(today); nextWeek.setDate(nextWeek.getDate() + 7);
    return [
      { label: 'Today', date: toDateStr(today.getFullYear(), today.getMonth(), today.getDate()) },
      { label: 'Tomorrow', date: toDateStr(tom.getFullYear(), tom.getMonth(), tom.getDate()) },
      { label: 'Next week', date: toDateStr(nextWeek.getFullYear(), nextWeek.getMonth(), nextWeek.getDate()) },
    ];
  }, []);

  const dateInfo = value ? getRelativeDateLabel(value) : null;

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium
          transition-all duration-200
          ${value
            ? `${dateInfo?.color} bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800`
            : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
          }
        `}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {value ? dateInfo?.label : placeholder}
        {value && (
          <button
            onClick={clearDate}
            className="ml-0.5 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Clear date"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 left-0 sm:left-auto sm:right-0 animate-fade-in">
          <div className="w-72 glass-strong rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 border border-gray-200/60 dark:border-gray-700/50 p-3">
            {/* Quick Select */}
            <div className="flex gap-1.5 mb-3">
              {quickDates.map((qd) => (
                <button
                  key={qd.label}
                  onClick={() => { onChange(qd.date); setIsOpen(false); }}
                  className={`
                    flex-1 px-2 py-1.5 rounded-lg text-[11px] font-semibold
                    transition-all duration-150
                    ${value === qd.date
                      ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {qd.label}
                </button>
              ))}
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={prevMonth}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {/* Empty cells for offset */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dateStr = toDateStr(viewYear, viewMonth, day);
                const isSelected = value === dateStr;
                const isTodayDate = isToday(dateStr);
                const isPast = new Date(dateStr + 'T00:00:00') < new Date(new Date().toDateString());

                return (
                  <button
                    key={day}
                    onClick={() => selectDate(day)}
                    className={`
                      relative w-full aspect-square rounded-lg text-xs font-medium
                      flex items-center justify-center
                      transition-all duration-150
                      ${isSelected
                        ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-sm shadow-primary-500/25'
                        : isTodayDate
                          ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold'
                          : isPast
                            ? 'text-gray-300 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    {day}
                    {isTodayDate && !isSelected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Clear / Done */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
              <button
                onClick={clearDate}
                className="text-[11px] font-medium text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear date
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-primary-500 hover:text-primary-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
