import React, { useEffect, useState } from 'react';
import { todoService} from '../../services/TodoService';
import type { Todo } from '../../services/TodoService';
import { useAuth } from '../../contexts/AuthContext';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = todoService.subscribe(user.uid, (todosList) => {
      setTodos(todosList);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-blue-800">Total de tarefas</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-yellow-800">Pendentes</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-green-800">Concluídas</div>
        </div>
      </div>

      <TodoForm />

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'all' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todas ({stats.total})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'pending' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pendentes ({stats.pending})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1 rounded-md text-sm ${
            filter === 'completed' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Concluídas ({stats.completed})
        </button>
      </div>

      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filter === 'all' ? (
              <>
                📝 Nenhuma tarefa encontrada.<br />
                Comece criando sua primeira tarefa!
              </>
            ) : filter === 'pending' ? (
              '🎉 Todas as tarefas foram concluídas!'
            ) : (
              '📋 Nenhuma tarefa concluída ainda.'
            )}
          </div>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
    </div>
  );
};

export default TodoList;
