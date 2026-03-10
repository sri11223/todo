# ✨ TaskFlow — Modern Todo Application

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)

A beautiful, feature-rich task management app with glassmorphism UI, dark mode, interactive timeline, priority levels, and local storage persistence.

**[Live Demo](https://todo-six-delta-55.vercel.app/)**

</div>

---

## Features

### Task Management
- **Full CRUD** — Create, read, update, and delete tasks
- **Inline Editing** — Double-click any task to edit in place
- **Priority Levels** — None, Low, Medium, High with color-coded indicators
- **Due Dates** — Custom calendar date picker (portal-rendered, no clipping issues)
- **Completion Tracking** — Toggle tasks complete/incomplete with animated checkboxes

### Views & Filtering
- **List View** — Classic todo list with filter tabs: All, Active, Completed
- **Timeline View** — Visual timeline grouping tasks by due date:
  - 🔴 **Overdue** — Past due tasks
  - 🔵 **Today** — Due today
  - 🟡 **Upcoming** — Within the next 7 days
  - 🟢 **Later** — More than 7 days away
  - ⚪ **No Date** — Tasks without a due date
- **Search** — Real-time full-text search across all tasks
- **Smart Stats** — Stat cards showing Total, In Progress, Completed, and Urgent counts

### UI / UX
- **Dark / Light Mode** — Toggle with smooth transitions, persisted to localStorage
- **Glassmorphism Design** — Frosted glass cards, gradient borders, and backdrop blur
- **Animated Background** — Floating gradient orbs with a subtle grid overlay
- **Progress Ring** — SVG circular progress indicator on the dashboard
- **Responsive** — Fully responsive from mobile to desktop
- **Sample Data** — One-click "Load Sample Data" button when the list is empty

### Keyboard Shortcuts
| Key | Action |
|---|---|
| `Enter` | Add new task |
| `Escape` | Clear input |
| `Double-click` | Edit existing task |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18.3 |
| Language | TypeScript 5.6 |
| Build Tool | Vite 6.0 |
| Styling | Tailwind CSS 3.4 |
| Persistence | localStorage |
| Deployment | Vercel |

---

## Architecture

```
Container / Presentational pattern
├── State managed via useReducer + custom useTodos hook
├── Theme managed via React Context (ThemeProvider)
├── Persistent storage via custom useLocalStorage hook
└── Pure utility functions in utils/todoUtils.ts
```

**Key patterns:**

- **Reducer pattern** — All todo mutations go through a `todoReducer` with typed actions (`ADD_TODO`, `TOGGLE_TODO`, `DELETE_TODO`, `EDIT_TODO`, `SET_DUE_DATE`, `SET_PRIORITY`, `CLEAR_COMPLETED`, `SET_TODOS`)
- **Container / Presentational** — `TodoApp` orchestrates state; child components receive data via props
- **Portal rendering** — DatePicker dropdown renders via `createPortal` at `document.body` to avoid overflow clipping
- **Memoized selectors** — `filteredTodos`, counts, and callbacks are memoized with `useMemo` / `useCallback`
- **Migration support** — Old todos missing the `priority` field are auto-upgraded on load

---

## Folder Structure

```
todo-app/
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
├── vite.config.ts              # Vite config
├── tailwind.config.js          # Tailwind theme extensions
├── postcss.config.js           # PostCSS plugins
├── public/                     # Static assets
└── src/
    ├── main.tsx                # React DOM entry
    ├── App.tsx                 # Root layout (background, header, footer)
    ├── index.css               # Global styles, glassmorphism, animations
    ├── vite-env.d.ts           # Vite type declarations
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx      # App title & branding
    │   │   └── ThemeToggle.tsx # Dark/light mode switch
    │   ├── todo/
    │   │   ├── TodoApp.tsx     # Container — stat cards, search, view toggle
    │   │   ├── TodoInput.tsx   # New task form (text, priority, date)
    │   │   ├── TodoList.tsx    # Filtered list of TodoItems
    │   │   ├── TodoItem.tsx    # Single task row (checkbox, edit, delete)
    │   │   ├── TodoFilters.tsx # All / Active / Completed tabs
    │   │   ├── TodoStats.tsx   # Footer progress bar & counts
    │   │   └── TodoTimeline.tsx# Timeline view grouped by due date
    │   └── ui/
    │       ├── Badge.tsx       # Colored label badges
    │       ├── Button.tsx      # Styled button component
    │       ├── Checkbox.tsx    # Animated checkbox
    │       ├── DatePicker.tsx  # Calendar popup (portal-based)
    │       └── Input.tsx       # Styled text input
    ├── constants/
    │   └── index.ts            # STORAGE_KEYS, MAX_TODO_LENGTH, etc.
    ├── context/
    │   ├── ThemeContext.ts      # Theme context definition
    │   └── ThemeProvider.tsx    # Provider with localStorage sync
    ├── hooks/
    │   ├── useLocalStorage.ts  # Generic localStorage hook
    │   └── useTodos.ts         # Todo state, reducer, actions, filters
    ├── types/
    │   └── todo.ts             # Todo, Priority, FilterType, ViewMode, TodoAction
    └── utils/
        └── todoUtils.ts        # Date helpers, default todos, pure functions
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9 (or yarn / pnpm)

### Installation

```bash
# Clone the repository
git clone https://github.com/sri11223/todo.git
cd todo/todo-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173` (or the next available port).

### Build for Production

```bash
npm run build
```

Output is written to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## Deployment

The app is deployed on **Vercel** with zero configuration. Push to `main` triggers automatic redeployment.

**Live:** [https://todo-six-delta-55.vercel.app/](https://todo-six-delta-55.vercel.app/)

---

## Approach

1. **Types first** — Defined domain models (`Todo`, `Priority`, `TodoAction` union) and action types before writing any components, ensuring type-safety throughout.
2. **Pure utilities** — Built `todoReducer`, filtering, counting, and date helpers as pure, testable functions in `utils/todoUtils.ts`.
3. **Custom hooks** — `useLocalStorage` (generic persistence with JSON serialization) and `useTodos` (all business logic in one hook with a reducer pattern).
4. **Component tree** — Reusable UI primitives (`Button`, `Input`, `Checkbox`, `Badge`, `DatePicker`) composed into feature components (`TodoItem`, `TodoList`, `TodoTimeline`).
5. **Styling** — Tailwind CSS with a custom color palette (primary/accent), glassmorphism utilities, animations, full dark mode, and responsive breakpoints.
6. **Persistence** — `localStorage` for both todo data and user preferences (theme, filter). Migration logic auto-upgrades old data when the schema evolves.

---

## Time Spent

~3 hours total:
- ~30 min — Project setup, types, constants, utility functions
- ~1 hr — Core components (TodoInput, TodoItem, TodoList, TodoFilters, TodoStats)
- ~30 min — Dark mode, glassmorphism styling, animations
- ~30 min — DatePicker, Timeline view, Priority system, Search
- ~30 min — Bug fixes, README, final polish, deployment

---

## What I'd Improve With More Time

- **Unit tests** — Vitest + React Testing Library for hooks, utils, and components
- **E2E tests** — Playwright for full user-flow testing
- **Drag & drop** — Reorder todos via drag handles
- **Undo / Redo** — Action history stack for reversible operations
- **PWA** — Service worker for offline-first experience
- **Backend sync** — REST API or real-time sync with WebSocket
- **Subtasks** — Nested task hierarchy with progress rollup
- **Categories / Tags** — Organize tasks with color-coded labels

---

## License

MIT
