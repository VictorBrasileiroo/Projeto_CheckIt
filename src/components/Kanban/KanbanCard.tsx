
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface KanbanTodo {
  id: string;
  title: string;
  description?: string;
  status: string;
}

interface KanbanCardProps {
  todo: KanbanTodo;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ todo }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-md p-3 shadow cursor-pointer ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <h3 className="font-medium text-gray-800">{todo.title}</h3>
      {todo.description && <p className="text-sm text-gray-600">{todo.description}</p>}
    </div>
  );
};

export default KanbanCard;
