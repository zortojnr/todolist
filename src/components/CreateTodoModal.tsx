import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Theme, Todo } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { validateTodo, getFieldError } from '../utils/validators';

interface CreateTodoModalProps {
  isOpen: boolean;
  theme: Theme;
  isDark: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, dueDate: string | null) => Promise<void>;
  initialTodo?: Todo;
  isLoading?: boolean;
}

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({
  isOpen,
  theme,
  isDark,
  onClose,
  onSubmit,
  initialTodo,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(initialTodo?.title || '');
  const [description, setDescription] = useState(initialTodo?.description || '');
  const [dueDate, setDueDate] = useState(initialTodo?.due_date?.split('T')[0] || '');
  const [errors, setErrors] = useState<{ field: string; message: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateTodo(title, description, dueDate || null);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setIsSubmitting(true);

    try {
      await onSubmit(title, description, dueDate ? new Date(dueDate).toISOString() : null);
      setTitle('');
      setDescription('');
      setDueDate('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#25273d] rounded-t-2xl sm:rounded-2xl w-full sm:w-full sm:max-w-md shadow-lg transform transition-all duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: theme.colors.bgSecondary }}
      >
        <div className="sticky top-0 flex items-center justify-between p-6 border-b" style={{ borderColor: theme.colors.border }}>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: theme.fonts.family, color: theme.colors.text }}
          >
            {initialTodo ? 'Edit Todo' : 'New Todo'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:opacity-70 transition-opacity"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" style={{ color: theme.colors.textMuted }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-2 transition-colors duration-300"
              style={{ fontFamily: theme.fonts.family, color: theme.colors.text }}
            >
              Title *
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title"
              className="w-full px-4 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-offset-0"
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderColor: getFieldError(errors, 'title') ? theme.colors.error : theme.colors.border,
                color: theme.colors.text,
              }}
              disabled={isSubmitting}
              maxLength={255}
            />
            {getFieldError(errors, 'title') && (
              <p className="text-sm mt-1" style={{ color: theme.colors.error }}>
                {getFieldError(errors, 'title')}
              </p>
            )}
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2 transition-colors duration-300"
              style={{ fontFamily: theme.fonts.family, color: theme.colors.text }}
            >
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="w-full px-4 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-offset-0 resize-none"
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderColor: getFieldError(errors, 'description') ? theme.colors.error : theme.colors.border,
                color: theme.colors.text,
              }}
              rows={4}
              disabled={isSubmitting}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1">
              <div />
              <p className="text-xs" style={{ color: theme.colors.textMuted }}>
                {description.length}/1000
              </p>
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2 transition-colors duration-300"
              style={{ fontFamily: theme.fonts.family, color: theme.colors.text }}
            >
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-offset-0"
              style={{
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                borderColor: getFieldError(errors, 'dueDate') ? theme.colors.error : theme.colors.border,
                color: theme.colors.text,
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
              style={{
                backgroundColor: theme.colors.accentPrimary,
                color: 'white',
              }}
            >
              {isSubmitting ? 'Saving...' : initialTodo ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
