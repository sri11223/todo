import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Logo icon */}
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 dark:shadow-primary-500/10">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 opacity-20 blur-lg -z-10" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Task<span className="gradient-text">Flow</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-500 tracking-wide">
            Organize your day, achieve your goals
          </p>
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}
