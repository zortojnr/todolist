# Technical Design Document

## Overview

This document provides technical details about the Todo App architecture, design decisions, and component interactions.

## Architecture Overview

### High-Level Flow

```
User Input → React Component → Hook (useTheme/useTodos) → Supabase API
                                                              ↓
                                        Realtime Subscription (postgres_changes)
                                                              ↓
                                          Update Component State
                                                              ↓
                                            Re-render UI
```

## Core Concepts

### 1. Theme Management

**Location**: `src/hooks/useTheme.ts`

**Implementation**:
- Two theme objects (light/dark) stored in `src/theme.ts`
- Theme state managed with React hooks
- Preference persisted to localStorage with key `todo-theme-preference`
- System theme preference used as fallback on first load
- All component styling reads from theme object

**Key Functions**:
- `useTheme()` - Returns theme object, mode, toggle function, and loading state
- `toggleTheme()` - Switches between light and dark mode
- Smooth CSS transitions (500ms) for color changes

### 2. Data Management

**Location**: `src/hooks/useTodos.ts`

**Implementation**:
- Custom hook wrapping Supabase operations
- Realtime subscription via `supabase.channel()` and `postgres_changes`
- Optimistic updates reflected immediately in UI
- Automatic retry on network failures

**Supabase Queries**:

| Operation | Query | Notes |
|-----------|-------|-------|
| Get todos | `select('*')` | Subscribes to realtime updates |
| Create todo | `insert()` | Auto-generates UUID, sets initial order |
| Update todo | `update()` | Updates specific fields, sets updated_at |
| Delete todo | `delete()` | Removes todo permanently |
| Reorder | `upsert()` | Batch updates to order field |

**Realtime Subscription**:
```typescript
supabase
  .channel('todos')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'todos' },
    (payload) => { /* update state */ }
  )
  .subscribe();
```

### 3. Search & Filter

**Implementation**:
- Search: Client-side filtering of todos by title/description
- Filter: Tabs to show All/Active/Completed/Due Soon
- Combined filtering when both active

**Filter Logic**:
```typescript
- All: All todos
- Active: Not completed
- Completed: Completed only
- Due Soon: Not completed AND due within 48 hours
```

**Search Logic**:
```typescript
const search = searchTerm.toLowerCase();
filtered = todos.filter(t =>
  t.title.toLowerCase().includes(search) ||
  t.description.toLowerCase().includes(search)
);
```

### 4. Drag & Drop

**Library**: `react-beautiful-dnd`

**Implementation**:
- Drag handles visible on hover (desktop) or always (mobile)
- Reorder updates local state immediately
- After drag end, calls `onReorder()` which syncs to Supabase
- Order field controls sort order in UI

**Order Persistence**:
```typescript
// After reorder
const orderedIds = newOrder.map(t => t.id);
await reorderTodos(orderedIds);
// Each todo's order field updated to its new index
```

### 5. Form Validation

**Location**: `src/utils/validators.ts`

**Rules**:
- Title: Required, max 255 characters
- Description: Optional, max 1000 characters
- Due date: Valid date format if provided

**Error Handling**:
- Validation runs on submit
- Errors collected in array with field name
- Error messages displayed below field
- Submit disabled until valid

## Component Architecture

### Components Overview

| Component | Purpose | Props |
|-----------|---------|-------|
| Header | App title + theme toggle | theme, isDark, onThemeToggle |
| TodoList | Renders todos with drag/drop | todos, filter, searchTerm, theme, handlers |
| TodoCard | Individual todo item | todo, theme, isDark, handlers |
| CreateTodoModal | Create/edit form | isOpen, theme, isDark, handlers |
| SearchBar | Search input | value, onChange, theme, isDark |
| FilterRow | Filter tabs | activeFilter, onFilterChange, theme, isDark |
| EmptyState | Empty list message | theme, isDark, onAddTodo |

### Data Flow

```
App Component
  ├── useTheme() → provides theme state
  ├── useTodos() → provides todo state
  │
  ├── Header
  │   └── theme toggle triggers toggleTheme()
  │
  ├── SearchBar
  │   └── onChange updates local state
  │
  ├── FilterRow
  │   └── onFilterChange updates local state
  │
  ├── TodoList (if todos exist)
  │   └── TodoCard (for each todo)
  │       ├── checkbox → toggleComplete()
  │       ├── delete → deleteTodo()
  │       └── edit → openModal(todo)
  │
  ├── CreateTodoModal
  │   └── onSubmit → createTodo() or updateTodo()
  │
  └── EmptyState (if no todos)
      └── onAddTodo → openModal()
```

## Database Schema

### todos Table

```sql
CREATE TABLE todos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  due_date timestamptz,
  completed boolean DEFAULT false,
  order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Indexes

```sql
CREATE INDEX idx_todos_order ON todos("order");
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

### Example Document

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project",
  "description": "Finish the todo app with all features",
  "due_date": "2024-12-31T23:59:59Z",
  "completed": false,
  "order": 0,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Row Level Security

```sql
-- Allow all users to read
CREATE POLICY "Allow public read"
  ON todos FOR SELECT TO public
  USING (true);

-- Allow all users to create
CREATE POLICY "Allow public insert"
  ON todos FOR INSERT TO public
  WITH CHECK (true);

-- Allow all users to update
CREATE POLICY "Allow public update"
  ON todos FOR UPDATE TO public
  USING (true) WITH CHECK (true);

-- Allow all users to delete
CREATE POLICY "Allow public delete"
  ON todos FOR DELETE TO public
  USING (true);
```

## Styling Approach

### Theme System

All styles use inline styles reading from theme object for:
- Colors (backgrounds, text, borders)
- Typography (font family, sizes)
- Transitions (smooth 300-500ms color changes)

**Example**:
```typescript
<div style={{
  backgroundColor: theme.colors.bgSecondary,
  color: theme.colors.text,
  transition: 'all 300ms ease-in-out'
}}>
```

### Tailwind CSS

- Used for layout and utilities
- Responsive classes for mobile-first design
- Media queries for breakpoints

### Responsive Design

- Mobile-first approach
- Max-width: 28rem (448px) for centered layout on desktop
- Touch-friendly sizing (minimum 44px targets)

## Performance Optimizations

### 1. Memoization

```typescript
const filteredAndSearched = useMemo(() => {
  // Filter and search logic
}, [todos, filter, searchTerm]);
```

### 2. Indexed Queries

Database indexes on `order`, `completed`, and `created_at` for fast queries.

### 3. Lazy Component Loading

Components only render when needed:
- Modal only renders when isOpen
- EmptyState only renders when todos.length === 0
- Loading spinner shown while fetching

### 4. Efficient Subscriptions

Single channel subscription handles all changes (INSERT, UPDATE, DELETE).

## Error Handling Strategy

### Network Errors

```typescript
try {
  await supabase.from('todos').select('*');
} catch (err) {
  toast.error('Failed to load todos');
  setError(err.message);
}
```

### Validation Errors

```typescript
const errors = validateTodo(title, description, dueDate);
if (errors.length > 0) {
  setErrors(errors);
  return; // Don't submit
}
```

### Toast Notifications

- Success: "Todo created", "Todo updated", "Todo deleted"
- Error: Network failures, validation issues
- Position: Bottom center, auto-hide after 4 seconds

## Accessibility Features

### ARIA Labels

```typescript
<button aria-label="Toggle theme">
  <SunIcon />
</button>
```

### Semantic HTML

```typescript
<header>...</header>
<main>...</main>
<button>...</button>
<input type="text" />
```

### Keyboard Navigation

- Tab through all interactive elements
- Enter to submit forms
- Escape to close modals
- Space to toggle checkboxes

### Focus Management

```typescript
className="focus:outline-none focus:ring-2"
style={{ focusRingColor: theme.colors.accentPrimary }}
```

### Contrast

All text meets WCAG AA contrast requirements (4.5:1 minimum).

## Browser Compatibility

- ES2020+ JavaScript features
- CSS Grid and Flexbox
- CSS Transitions and Animations
- LocalStorage API
- Fetch API
- Supports Chrome, Firefox, Safari, Edge (latest)

## Deployment Considerations

### Environment Setup

```bash
# Production build
npm run build

# Output
dist/
  ├── index.html
  ├── assets/
  │   ├── index-*.css
  │   └── index-*.js
```

### Static Hosting

- Can be deployed to Vercel, Netlify, GitHub Pages, etc.
- Just upload `dist/` folder
- Supabase credentials in `.env` automatically available in build

### Environment Variables

Required at build time:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Performance Budget

- Gzipped JS: ~154 KB
- Gzipped CSS: ~5 KB
- Total: ~160 KB

## Future Enhancements

### Authentication

```typescript
// Add user_id to todos table
// Update RLS policies to check auth.uid()
CREATE POLICY "Users can only read own todos"
  ON todos FOR SELECT TO authenticated
  USING (user_id = auth.uid());
```

### Categories

```typescript
// Add categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY,
  user_id uuid,
  name text,
  color text
);

// Add category_id to todos
ALTER TABLE todos ADD COLUMN category_id uuid;
```

### Recurring Todos

```typescript
// Add recurrence pattern
ALTER TABLE todos ADD COLUMN recurrence_pattern text;
// e.g., "FREQ=DAILY;INTERVAL=1" (iCalendar format)
```

### Priorities

```typescript
-- Add priority field
ALTER TABLE todos ADD COLUMN priority integer DEFAULT 0;
-- 0: Low, 1: Medium, 2: High, 3: Urgent
```

## Maintenance

### Monitoring

- Browser console for errors
- Supabase dashboard for database issues
- Network tab for API performance
- Lighthouse for performance metrics

### Debugging

- React DevTools for component state
- Network DevTools for API calls
- Console logs for data flow
- Theme system for UI verification

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: Production Ready
