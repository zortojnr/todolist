# Todo App - React + Supabase + Vite

A modern, pixel-perfect todo application built with React, TypeScript, Supabase, and Vite. Features real-time synchronization, light/dark theme switching, drag-to-reorder, and full CRUD operations.

## Features

- ✅ **Real-time Sync** - Todos update instantly across all clients using Supabase's realtime subscriptions
- 🎨 **Theme Support** - Light and dark themes with smooth animated transitions
- 💾 **Persistent Theme** - Theme preference saved to browser storage and restored on app start
- 🔍 **Search & Filter** - Filter todos by status (All, Active, Completed, Due Soon)
- 🎯 **Full CRUD** - Create, read, update, delete todos with validation
- 🔄 **Drag & Drop** - Reorder todos with drag handles and touch support
- 👆 **Swipe to Delete** - Swipe left on mobile to reveal delete action
- 📱 **Responsive Design** - Mobile-first, works perfectly on all screen sizes
- ♿ **Accessibility** - ARIA labels, semantic HTML, screen reader support
- �� **Due Dates** - Set and track due dates with smart date formatting
- ✨ **Toast Notifications** - User feedback for all actions

## Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Supabase project with database access

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Variables

Your `.env` file is pre-configured with Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Supabase Setup

### Database Schema

The app uses a single `todos` table:

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

### Row Level Security (RLS)

RLS is enabled to allow public operations (suitable for shared todos). For user-specific todos in production, update policies to check `auth.uid()`.

## Architecture

### File Structure

```
src/
├── components/
│   ├── Header.tsx              # App header with theme toggle
│   ├── TodoCard.tsx            # Individual todo item
│   ├── TodoList.tsx            # List with drag & drop
│   ├── CreateTodoModal.tsx     # Create/edit form
│   ├── SearchBar.tsx           # Search input
│   ├── FilterRow.tsx           # Filter buttons
│   ├── EmptyState.tsx          # Empty list state
│   └── ui/                     # Shadcn UI components
├── hooks/
│   ├── useTheme.ts             # Theme management
│   └── useTodos.ts             # Supabase operations
├── services/
│   └── supabase.ts             # Supabase client
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/
│   ├── dateHelpers.ts          # Date utilities
│   └── validators.ts           # Input validation
├── theme.ts                    # Light/dark themes
├── App.tsx                     # Main app
└── index.tsx                   # Entry point
```

### Key Components

- **Header** - Title + theme toggle with smooth transitions
- **TodoList** - Todos with drag-and-drop reordering
- **TodoCard** - Title, description, due date, checkbox, delete
- **CreateTodoModal** - Create/edit form with validation
- **SearchBar** - Real-time search
- **FilterRow** - Filter by All/Active/Completed/Due Soon
- **EmptyState** - Friendly empty message

### Hooks

- **useTheme()** - Theme state and localStorage persistence
- **useTodos()** - Supabase CRUD + realtime subscription

## Features in Detail

### Real-time Updates

Subscribes to Supabase `postgres_changes` on the `todos` table. Any changes are instantly reflected in the UI.

### Theme System

Two themes (light/dark) defined in `src/theme.ts`. Theme preference stored in localStorage, loaded on app start. All transitions are smooth with CSS animations.

### Search & Filter

- Live search by title/description (client-side)
- Filters: All, Active, Completed, Due Soon
- Combines search and filters for powerful queries

### Drag & Drop

Uses `react-beautiful-dnd` for reordering. Updated order syncs to Supabase.

### Validation

- Title required (max 255 chars)
- Description optional (max 1000 chars)
- Valid date format required
- Inline error messages in form

### Accessibility

- ARIA labels on all interactive elements
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Proper focus management
- High contrast colors

## Development

### Run Locally

```bash
npm run dev
```

Starts dev server at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Outputs to `dist/` directory

### Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component foundation
- **Supabase JS SDK** - Backend
- **react-beautiful-dnd** - Drag & drop
- **react-hot-toast** - Notifications
- **date-fns** - Date utilities
- **Lucide React** - Icons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Error Handling

- Network errors show user-friendly toast messages
- Form validation prevents invalid submissions
- Graceful fallbacks for missing data
- Retry capability

## Troubleshooting

### Todos not loading
- Check Supabase URL and key in `.env`
- Verify `todos` table exists in database
- Check browser console for network errors
- Ensure RLS policies allow public read

### Theme not persisting
- Check localStorage is enabled
- Clear cache and reload
- Check console for localStorage permission errors

### Drag & drop not working
- Ensure touch events aren't prevented
- Check CSS overflow/z-index
- Verify `react-beautiful-dnd` is installed

## Performance

- Lazy component loading
- Optimized Supabase queries with indexes
- Memoized filtered lists
- CSS transitions for animations
- Efficient React re-renders

## Next Steps

- Add user authentication
- Support todo categories/projects
- Add priority levels
- Enable todo sharing
- Add export/import

## License

MIT

---

**Built with React, TypeScript, and Supabase**
