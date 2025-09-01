import React, { useState } from 'react';
import { todoService } from '../../services/TodoService';
import { useAuth } from '../../contexts/AuthContext';

interface TodoFormProps {
  onSuccess?: () => void;
}

const TodoForm = ({ onSuccess }: TodoFormProps) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Digite o título da tarefa');
      return;
    }

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      await todoService.add(title.trim(), user.uid);
      setTitle('');
      onSuccess?.();
      
    } catch (error: any) {
      setError('Erro ao criar tarefa: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite uma nova tarefa..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </form>
  );
};

export default TodoForm;
