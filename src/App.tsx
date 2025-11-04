import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterRow } from './components/FilterRow';
import { TodoList } from './components/TodoList';
import { EmptyState } from './components/EmptyState';
import { CreateTodoModal } from './components/CreateTodoModal';
import { useTheme } from './hooks/useTheme';
import { useTodos } from './hooks/useTodos';
import { FilterType, Todo } from './types';
import { Button } from './components/ui/button';

export const App: React.FC = () => {
  const { mode, theme, toggleTheme, isLoading: themeLoading } = useTheme();
  const { todos, loading, createTodo, updateTodo, deleteTodo, toggleComplete, reorderTodos } = useTodos();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (themeLoading) {
    return (
      <div
        className="w-full min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.bg }}
      >
        <div
          className="text-center"
          style={{
            color: theme.colors.textMuted,
            fontFamily: theme.fonts.family,
          }}
        >
          <div className="w-8 h-8 border-4 border-transparent rounded-full animate-spin mb-4" style={{ borderTopColor: theme.colors.accentPrimary, margin: '0 auto' }} />
          Loading...
        </div>
      </div>
    );
  }

  const isDark = mode === 'dark';

  const handleCreateOrUpdateTodo = async (title: string, description: string, dueDate: string | null) => {
    setIsSubmitting(true);
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, {
          title,
          description,
          due_date: dueDate,
        });
        setEditingTodo(null);
      } else {
        await createTodo(title, description, dueDate);
      }
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = (todo?: Todo) => {
    if (todo) {
      setEditingTodo(todo);
    } else {
      setEditingTodo(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: theme.colors.bg,
        fontFamily: theme.fonts.family,
      }}
    >
      <Header theme={theme} isDark={isDark} onThemeToggle={toggleTheme} />

      <main className="pt-[140px] pb-8 px-6 max-w-md mx-auto space-y-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchBar value={searchTerm} onChange={setSearchTerm} theme={theme} isDark={isDark} />
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-90 flex-shrink-0"
            style={{
              backgroundColor: theme.colors.accentPrimary,
              color: 'white',
              fontFamily: theme.fonts.family,
            }}
            aria-label="Add new todo"
          >
            +
          </Button>
        </div>

        <FilterRow
          activeFilter={filter}
          onFilterChange={setFilter}
          theme={theme}
          isDark={isDark}
        />

        {loading ? (
          <div
            className="text-center py-12"
            style={{
              color: theme.colors.textMuted,
              fontFamily: theme.fonts.family,
            }}
          >
            <div className="w-8 h-8 border-4 border-transparent rounded-full animate-spin mb-4" style={{ borderTopColor: theme.colors.accentPrimary, margin: '0 auto' }} />
            Loading todos...
          </div>
        ) : todos.length === 0 ? (
          <EmptyState theme={theme} isDark={isDark} onAddTodo={() => handleOpenModal()} />
        ) : (
          <TodoList
            todos={todos}
            filter={filter}
            searchTerm={searchTerm}
            theme={theme}
            isDark={isDark}
            onToggle={toggleComplete}
            onDelete={deleteTodo}
            onEdit={handleOpenModal}
            onReorder={reorderTodos}
          />
        )}
      </main>

      <CreateTodoModal
        isOpen={isModalOpen}
        theme={theme}
        isDark={isDark}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdateTodo}
        initialTodo={editingTodo || undefined}
        isLoading={isSubmitting}
      />

      <Toaster position="bottom-center" />
    </div>
  );
};

export default App;
