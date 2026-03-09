# Todo App

A modern, production-quality todo list application built with **React 18**, **TypeScript**, **Vite**, and **Tailwind CSS**.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6-purple?logo=vite)

---

## Features

### Core
- **Create** todos with text input (Enter key or Add button)
- **Read** — view all todos in a clean, animated list
- **Update** — toggle completion (checkbox) + inline edit (double-click)
- **Delete** — remove individual todos with slide-out animation
- **Persist** all data in `localStorage` — survives page refreshes

### Bonus
- **Filter** todos by All / Active / Completed
- **Clear completed** — bulk-remove finished tasks
- **Dark mode** — system-aware toggle with smooth transition
- **Keyboard navigation** — Enter to add, Escape to cancel, Enter/Escape in edit mode
- **Animations** — slide-in on add, slide-out on delete, fade transitions
- **Responsive** — works on mobile, tablet, and desktop
- **Accessibility** — ARIA labels, semantic HTML, focus management

---

## Architecture

```
src/
├── types/           # Domain types & action types (TypeScript interfaces)
├── constants/       # App-wide constants (storage keys, filter options)
├── utils/           # Pure utility functions & reducer logic
├── hooks/           # Custom React hooks (useLocalStorage, useTodos)
├── context/         # Theme context (Provider + consumer hook)
├── components/
│   ├── ui/          # Reusable, generic UI primitives (Button, Input, Checkbox, Badge)
│   ├── todo/        # Feature-specific components (TodoApp, TodoList, TodoItem, etc.)
│   └── layout/      # Layout components (Header, ThemeToggle)
├── App.tsx          # Root component
├── main.tsx         # Entry point
└── index.css        # Tailwind directives + custom utilities
```

### Design Principles
- **SOLID** — Single Responsibility (each component/hook does one thing), Open/Closed (generic `useLocalStorage`), Interface Segregation (props are minimal), Dependency Inversion (hooks depend on types, not UI)
- **Container/Presentational** — `TodoApp` orchestrates state, children are pure presentational
- **Reducer Pattern** — Pure `todoReducer` function handles all state transitions
- **Memoization** — `React.memo` on `TodoItem`, `useMemo` for derived state, `useCallback` for stable handlers

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+

### Installation

```bash
git clone https://github.com/sri11223/todo.git
cd todo/todo-app
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Data Structure

```typescript
interface Todo {
  id: string;          // crypto.randomUUID()
  text: string;        // task description
  completed: boolean;  // toggle state
  createdAt: number;   // Date.now() timestamp
}
```

---

## Approach

1. **Types first** — defined domain models and action types before writing any components
2. **Pure utilities** — built `todoReducer`, filtering, and counting functions as pure, testable functions
3. **Custom hooks** — `useLocalStorage` (generic persistence) and `useTodos` (all business logic in one hook)
4. **Component tree** — reusable UI primitives (`Button`, `Input`, `Checkbox`, `Badge`) composed into feature components
5. **Styling** — Tailwind CSS with custom color palette, animations, dark mode, and responsive design

---

## What I'd Improve With More Time

- **Unit tests** — Jest/Vitest + React Testing Library for hooks, utils, and components
- **E2E tests** — Playwright for full user flow testing
- **Drag & drop** — reorder todos via drag handles
- **Due dates & priorities** — extend the todo model
- **Undo/redo** — action history stack
- **PWA** — service worker for offline-first experience
- **Backend sync** — REST API or real-time sync with WebSocket

---

## License

MIT
