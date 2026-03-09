import { ThemeProvider } from '@/context';
import { Header } from '@/components/layout';
import { TodoApp } from '@/components/todo';

function App() {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen flex flex-col">
        {/* ── Animated background ── */}
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 dark:from-[#0B1120] dark:via-[#0d1a2d] dark:to-[#111827]" />

          {/* Animated orbs */}
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-400/20 to-accent-400/20 dark:from-primary-500/10 dark:to-accent-500/10 blur-3xl animate-float" />
          <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-accent-400/15 to-primary-300/15 dark:from-accent-500/5 dark:to-primary-500/5 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-primary-300/10 to-accent-300/10 dark:from-primary-600/5 dark:to-accent-600/5 blur-3xl animate-pulse-slow" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
            }}
          />
        </div>

        {/* ── Main Content ── */}
        <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Header />

          <main className="mt-8">
            <TodoApp />
          </main>

          {/* Footer */}
          <footer className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs text-gray-400 dark:text-gray-500">
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-mono">Enter</kbd>
              <span>to add</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span>Double-click to edit</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px] font-mono">Esc</kbd>
              <span>to cancel</span>
            </div>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
