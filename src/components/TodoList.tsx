import React, { useState, useCallback, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Todo, Theme, FilterType } from '../types';
import { TodoCard } from './TodoCard';
import { isDueSoon } from '../utils/dateHelpers';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  searchTerm: string;
  theme: Theme;
  isDark: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onReorder: (orderedIds: string[]) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  searchTerm,
  theme,
  isDark,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
}) => {
  const filteredAndSearched = useMemo(() => {
    let filtered = todos;

    if (filter === 'active') {
      filtered = todos.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      filtered = todos.filter((t) => t.completed);
    } else if (filter === 'due-soon') {
      filtered = todos.filter((t) => isDueSoon(t.due_date) && !t.completed);
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [todos, filter, searchTerm]);

  const handleDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination || (destination.index === source.index && destination.droppableId === source.droppableId)) {
      return;
    }

    const newOrder = Array.from(filteredAndSearched);
    const [moved] = newOrder.splice(source.index, 1);
    newOrder.splice(destination.index, 0, moved);

    const orderedIds = newOrder.map((t) => t.id);
    onReorder(orderedIds);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="todos">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="rounded-lg shadow-md overflow-hidden transition-all duration-500"
            style={{
              backgroundColor: theme.colors.bgSecondary,
            }}
          >
            <div>
              {filteredAndSearched.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TodoCard
                        todo={todo}
                        theme={theme}
                        isDark={isDark}
                        onToggle={() => onToggle(todo.id, todo.completed)}
                        onDelete={() => onDelete(todo.id)}
                        onEdit={() => onEdit(todo)}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
            {provided.placeholder}

            {filteredAndSearched.length > 0 && (
              <div
                className="px-4 py-3 flex items-center justify-between text-xs"
                style={{
                  borderTop: `1px solid ${theme.colors.border}`,
                  color: theme.colors.textMuted,
                  fontFamily: theme.fonts.family,
                }}
              >
                <span>
                  {filteredAndSearched.filter((t) => !t.completed).length} items left
                </span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
