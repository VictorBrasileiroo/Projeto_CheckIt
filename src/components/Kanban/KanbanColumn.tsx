import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import type { KanbanTodo } from './KanbanCard';

const statusLabels: Record<string, string> = {
  todo: 'A Fazer',
  doing: 'Em Progresso',
  done: 'Concluído'
};

interface KanbanColumnProps {
  status: string;
  todos: KanbanTodo[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, todos }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col bg-gray-100 rounded-md p-4 w-1/3">
      <h2 className="text-lg font-semibold mb-4">{statusLabels[status]}</h2>
      <div
        ref={setNodeRef}
        className={`space-y-4 min-h-[200px] p-2 rounded ${
          isOver ? 'bg-blue-100' : ''
        }`}
      >
        <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
          {todos.map(todo => (
            <KanbanCard key={todo.id} todo={todo} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
