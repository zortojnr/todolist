import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types';
import { supabase } from '../services/supabase';
import toast from 'react-hot-toast';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSubscribe = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('todos')
          .select('*')
          .order('order', { ascending: true })
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setTodos(data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load todos';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSubscribe();

    const subscription = supabase
      .channel('todos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTodos((prev) => [payload.new as Todo, ...prev].sort((a, b) => a.order - b.order));
          } else if (payload.eventType === 'UPDATE') {
            setTodos((prev) =>
              prev
                .map((todo) => (todo.id === payload.new.id ? (payload.new as Todo) : todo))
                .sort((a, b) => a.order - b.order)
            );
          } else if (payload.eventType === 'DELETE') {
            setTodos((prev) => prev.filter((todo) => todo.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const createTodo = useCallback(
    async (title: string, description: string, dueDate: string | null) => {
      try {
        const order = todos.length > 0 ? Math.max(...todos.map((t) => t.order)) + 1 : 0;
        const { error } = await supabase.from('todos').insert([
          {
            title,
            description,
            due_date: dueDate,
            order,
            completed: false,
          },
        ]);

        if (error) throw error;
        toast.success('Todo created');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create todo';
        setError(message);
        toast.error(message);
      }
    },
    [todos]
  );

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      toast.success('Todo updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update todo';
      setError(message);
      toast.error(message);
    }
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    try {
      const { error } = await supabase.from('todos').delete().eq('id', id);

      if (error) throw error;
      toast.success('Todo deleted');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(message);
      toast.error(message);
    }
  }, []);

  const toggleComplete = useCallback(async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !completed, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle todo';
      setError(message);
      toast.error(message);
    }
  }, []);

  const reorderTodos = useCallback(async (orderedIds: string[]) => {
    try {
      const updates = orderedIds.map((id, index) => ({
        id,
        order: index,
      }));

      const { error } = await supabase.from('todos').upsert(
        updates.map((u) => ({
          id: u.id,
          order: u.order,
          updated_at: new Date().toISOString(),
        }))
      );

      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reorder todos';
      setError(message);
      toast.error(message);
    }
  }, []);

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    reorderTodos,
  };
};
