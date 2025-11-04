# Component & Hook Map

## Quick Reference Guide

### Components

#### Header.tsx
**Purpose**: App title and theme toggle
**Props**:
- `theme: Theme`
- `isDark: boolean`
- `onThemeToggle: () => void`

**Features**:
- Sun/Moon icon toggle
- Smooth background transition
- Responsive sizing

#### TodoCard.tsx
**Purpose**: Individual todo item display
**Props**:
- `todo: Todo`
- `theme: Theme`
- `isDark: boolean`
- `onToggle: (completed: boolean) => void`
- `onDelete: () => void`
- `onEdit: () => void`
- `isDragging?: boolean`

**Features**:
- Checkbox for completion
- Title, description, due date display
- Delete button
- Swipe to delete on mobile
- Overdue indicator

#### TodoList.tsx
**Purpose**: Container for todos with drag & drop
**Props**:
- `todos: Todo[]`
- `filter: FilterType`
- `searchTerm: string`
- `theme: Theme`
- `isDark: boolean`
- `onToggle: (id, completed) => void`
- `onDelete: (id) => void`
- `onEdit: (todo) => void`
- `onReorder: (orderedIds) => void`

**Features**:
- Drag & drop reordering
- Filter and search integration
- Item count footer
- Smooth animations

#### CreateTodoModal.tsx
**Purpose**: Form for creating/editing todos
**Props**:
- `isOpen: boolean`
- `theme: Theme`
- `isDark: boolean`
- `onClose: () => void`
- `onSubmit: (title, description, dueDate) => Promise<void>`
- `initialTodo?: Todo`
- `isLoading?: boolean`

**Features**:
- Title input (required)
- Description textarea (optional)
- Date picker
- Form validation
- Error messages
- Loading state

#### SearchBar.tsx
**Purpose**: Search input with live filtering
**Props**:
- `value: string`
- `onChange: (value) => void`
- `theme: Theme`
- `isDark: boolean`

**Features**:
- Search icon
- Clear button
- Placeholder text
- Instant filtering

#### FilterRow.tsx
**Purpose**: Filter tabs component
**Props**:
- `activeFilter: FilterType`
- `onFilterChange: (filter) => void`
- `theme: Theme`
- `isDark: boolean`

**Features**:
- All, Active, Completed, Due Soon tabs
- Active state styling
- Smooth transitions

#### EmptyState.tsx
**Purpose**: Friendly message when no todos exist
**Props**:
- `theme: Theme`
- `isDark: boolean`
- `onAddTodo: () => void`

**Features**:
- Icon illustration
- Empty message
- CTA button

### Hooks

#### useTheme()
**Purpose**: Theme state management and persistence

**Returns**:
```typescript
{
  mode: 'light' | 'dark',
  theme: Theme,
  toggleTheme: () => void,
  isLoading: boolean
}
```

**Features**:
- LocalStorage persistence
- System preference fallback
- Smooth transitions

#### useTodos()
**Purpose**: Supabase CRUD operations and realtime subscription

**Returns**:
```typescript
{
  todos: Todo[],
  loading: boolean,
  error: string | null,
  createTodo: (title, description, dueDate) => Promise<void>,
  updateTodo: (id, updates) => Promise<void>,
  deleteTodo: (id) => Promise<void>,
  toggleComplete: (id, completed) => Promise<void>,
  reorderTodos: (orderedIds) => Promise<void>
}
```

**Features**:
- Realtime subscription
- INSERT/UPDATE/DELETE handling
- Toast notifications
- Error handling

### Utility Functions

#### dateHelpers.ts

**formatDueDate(date: string | null): string**
- Formats date for display
- Returns: "Today", "Tomorrow", or "MMM d"

**isDueSoon(date: string | null): boolean**
- Checks if due within 48 hours

**isOverdue(date: string | null): boolean**
- Checks if past due

**formatDateTime(date: string | null): string**
- Full format: "yyyy-MM-dd HH:mm"

#### validators.ts

**validateTodo(title, description, dueDate): ValidationError[]**
- Validates all fields
- Returns array of errors

**getFieldError(errors, field): string | undefined**
- Gets error for specific field

### Types

```typescript
interface Todo {
  id: string;
  title: string;
  description: string;
  due_date: string | null;
  completed: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

interface Theme {
  colors: {
    bg: string;
    bgSecondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    accentPrimary: string;
    accentGradientStart: string;
    accentGradientEnd: string;
    success: string;
    error: string;
  };
  fonts: {
    family: string;
    sizeBase: string;
    sizeSmall: string;
    sizeLarge: string;
  };
}

type FilterType = 'all' | 'active' | 'completed' | 'due-soon';
```

## Data Flow Diagram

```
User Input
    ↓
React Component (TodoCard, CreateTodoModal, etc.)
    ↓
Hook Function (useTodos, useTheme)
    ↓
Supabase API (insert, update, delete, select)
    ↓
PostgreSQL Database
    ↓
Supabase Realtime Channel
    ↓
postgres_changes Event
    ↓
Hook State Update
    ↓
Component Re-render
    ↓
User Sees Update
```

## Component Hierarchy

```
App
├── Header
│   └── (theme toggle button)
├── SearchBar
├── FilterRow
├── TodoList
│   └── TodoCard (×n)
│       ├── Checkbox
│       ├── Title/Description
│       ├── Due Date Badge
│       └── Delete Button
├── EmptyState (conditional)
└── CreateTodoModal (conditional)
    ├── Title Input
    ├── Description Textarea
    ├── Date Picker
    └── Form Buttons

+ Toaster (global)
```

## State Management Flow

```
App.tsx
  ├── useTheme()
  │   └── mode, theme, toggleTheme()
  │
  ├── useTodos()
  │   ├── todos (realtime synced)
  │   ├── loading, error
  │   ├── createTodo()
  │   ├── updateTodo()
  │   ├── deleteTodo()
  │   ├── toggleComplete()
  │   └── reorderTodos()
  │
  ├── Local State
  │   ├── searchTerm
  │   ├── filter
  │   ├── isModalOpen
  │   └── editingTodo
  │
  └── Passes to Components
      ├── Header (theme, isDark)
      ├── SearchBar (searchTerm)
      ├── FilterRow (filter)
      ├── TodoList (todos + handlers)
      ├── TodoCard (todo + handlers)
      └── CreateTodoModal (todo + handlers)
```

## Styling Architecture

### Theme-Based Styling

Every component reads colors and typography from the theme object:

```typescript
style={{
  backgroundColor: theme.colors.bgSecondary,
  color: theme.colors.text,
  fontFamily: theme.fonts.family,
  fontSize: theme.fonts.sizeBase,
  transition: 'all 300ms ease-in-out'
}}
```

### Tailwind Classes

Used for layout and responsive utilities:
- `flex`, `items-center`, `justify-between`
- `p-4`, `px-6`, `py-2` (spacing)
- `rounded-lg` (border radius)
- `shadow-md` (shadows)
- `max-w-md` (max width)

### Responsive Design

Mobile-first approach:
- Default: 375px+ (mobile)
- Tablet: 768px+
- Desktop: 1024px+

## Supabase Integration Points

### Services
**supabase.ts**
- Client initialization
- Environment variable validation

### Hooks
**useTodos.ts**
- `supabase.from('todos').select()`
- `supabase.from('todos').insert()`
- `supabase.from('todos').update()`
- `supabase.from('todos').delete()`
- `supabase.channel('todos').on('postgres_changes')`

## Error Handling Strategy

```
User Action
    ↓
Try Supabase Operation
    ↓
    ├─ Success → Update State → Toast Success
    └─ Error
       ├─ Validation Error → Show Form Error
       ├─ Network Error → Toast Error Message
       └─ Update Local Error State
```

## Performance Optimizations

### Memoization
```typescript
const filteredAndSearched = useMemo(() => {
  // Only recalculate when todos, filter, or searchTerm change
}, [todos, filter, searchTerm]);
```

### Lazy Loading
```typescript
{isModalOpen && <CreateTodoModal {...props} />}
{todos.length === 0 && <EmptyState {...props} />}
```

### Database Indexes
- `idx_todos_order`
- `idx_todos_completed`
- `idx_todos_created_at`

---

**Quick Links:**
- Architecture: See TECHNICAL_DESIGN.md
- Setup: See README.md
- Checklist: See SUBMISSION.md
