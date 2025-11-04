import React, { useState, useRef } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { Todo, Theme } from '../types';
import { Checkbox } from '../components/ui/checkbox';
import { formatDueDate, isOverdue, isDueSoon } from '../utils/dateHelpers';

interface TodoCardProps {
  todo: Todo;
  theme: Theme;
  isDark: boolean;
  onToggle: (completed: boolean) => void;
  onDelete: () => void;
  onEdit: () => void;
  isDragging?: boolean;
}

export const TodoCard: React.FC<TodoCardProps> = ({
  todo,
  theme,
  isDark,
  onToggle,
  onDelete,
  onEdit,
  isDragging = false,
}) => {
  const [showDeleteAction, setShowDeleteAction] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = startX - e.touches[0].clientX;
    if (diff > 50) {
      setShowDeleteAction(true);
    } else if (diff < -50) {
      setShowDeleteAction(false);
    }
  };

  const handleMouseLeave = () => {
    setShowDeleteAction(false);
  };

  const overdue = isOverdue(todo.due_date);
  const dueSoon = isDueSoon(todo.due_date);

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 group ${isDragging ? 'opacity-50' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="flex items-center justify-between p-4 gap-3 cursor-pointer transition-all duration-300 hover:opacity-80"
        onClick={onEdit}
        style={{
          backgroundColor: todo.completed ? 'rgba(0, 0, 0, 0.05)' : theme.colors.bgSecondary,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(todo.completed);
            }}
            className="flex-shrink-0 w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center"
            style={{
              borderColor: todo.completed ? theme.colors.accentPrimary : theme.colors.border,
              backgroundColor: todo.completed
                ? `linear-gradient(135deg, ${theme.colors.accentGradientStart}, ${theme.colors.accentGradientEnd})`
                : 'transparent',
            }}
            aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
          >
            {todo.completed && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p
              className={`text-xs truncate transition-all duration-300 ${
                todo.completed ? 'line-through opacity-50' : ''
              }`}
              style={{
                fontFamily: theme.fonts.family,
                color: todo.completed ? theme.colors.textMuted : theme.colors.text,
                fontSize: theme.fonts.sizeSmall,
              }}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p
                className="text-xs truncate opacity-70 mt-1"
                style={{
                  fontFamily: theme.fonts.family,
                  color: theme.colors.textMuted,
                  fontSize: theme.fonts.sizeSmall,
                }}
              >
                {todo.description}
              </p>
            )}
            {todo.due_date && (
              <div className="flex items-center gap-2 mt-2">
                <span
                  className="text-xs px-2 py-1 rounded transition-colors duration-300"
                  style={{
                    backgroundColor: overdue
                      ? 'rgba(244, 67, 54, 0.1)'
                      : dueSoon
                        ? 'rgba(255, 152, 0, 0.1)'
                        : 'rgba(57, 124, 252, 0.1)',
                    color: overdue
                      ? theme.colors.error
                      : dueSoon
                        ? '#ff9800'
                        : theme.colors.accentPrimary,
                  }}
                >
                  {overdue ? '⚠️ Overdue' : formatDueDate(todo.due_date)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <GripVertical className="w-4 h-4" style={{ color: theme.colors.textMuted }} />
          </div>

          {showDeleteAction ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex-shrink-0 p-2 rounded-lg transition-all duration-300 hover:opacity-70"
              style={{
                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                color: theme.colors.error,
              }}
              aria-label={`Delete "${todo.title}"`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="flex-shrink-0 p-2 rounded-lg transition-all duration-300 hover:opacity-70 opacity-0 group-hover:opacity-100"
              style={{
                color: theme.colors.textMuted,
              }}
              aria-label={`Delete "${todo.title}"`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
