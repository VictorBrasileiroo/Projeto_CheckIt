import React from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import type { KanbanTodo } from './KanbanCard';

const statuses = ['todo', 'doing', 'done'];

interface KanbanBoardProps {
  todos: KanbanTodo[];
  onMove: (todoId: string, newStatus: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ todos, onMove }) => {

  const handleDragStart = () => {};

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const todoId = active.id as string;
    const newStatus = over.id as string;

    const todo = todos.find(t => t.id === todoId);
    if (todo && todo.status !== newStatus) {
      onMove(todoId, newStatus);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4">
        {statuses.map((status) => {
          const filteredTodos = todos.filter(todo => todo.status === status);
          return (
            <KanbanColumn key={status} status={status} todos={filteredTodos} />
          );
        })}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
