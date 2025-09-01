import React, { useState } from 'react';
import { todoService } from '../../services/TodoService';
import type { Todo } from '../../services/TodoService';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = ({ todo }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    try {
      setLoading(true);
      await todoService.update(todo.id, { completed: !todo.completed });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!editTitle.trim()) return;
    
    try {
      setLoading(true);
      await todoService.update(todo.id, { title: editTitle.trim() });
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        setLoading(true);
        await todoService.delete(todo.id);
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditTitle(todo.title);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${loading ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggleComplete}
          disabled={loading}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />

        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleEdit}
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
            disabled={loading}
          />
        ) : (
          <span
            className={`flex-1 cursor-pointer ${
              todo.completed 
                ? 'text-gray-500 line-through' 
                : 'text-gray-900'
            }`}
            onClick={() => setIsEditing(true)}
          >
            {todo.title}
          </span>
        )}

        <div className="flex gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
            >
              Editar
            </button>
          )}
          
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Excluir
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Criado em: {todo.createdAt?.toLocaleDateString('pt-BR')} às {todo.createdAt?.toLocaleTimeString('pt-BR')}
      </div>
    </div>
  );
};

export default TodoItem;
