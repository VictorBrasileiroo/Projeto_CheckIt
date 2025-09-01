import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  DndContext, 
  useDroppable,
  DragOverlay,
  pointerWithin
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { todoService } from '../../services/TodoService';
import type { Todo } from '../../services/TodoService';

// Componente TodoItem separado para evitar re-criação
const TodoItem = ({ 
  todo, 
  editingTodo, 
  editTitle, 
  editDescription, 
  setEditTitle, 
  setEditDescription, 
  handleSaveEdit, 
  handleCancelEdit, 
  handleStartEdit, 
  handleUpdateStatus, 
  handleDeleteTodo, 
  getStatusBadge, 
  activeId 
}: { 
  todo: Todo;
  editingTodo: string | null;
  editTitle: string;
  editDescription: string;
  setEditTitle: (value: string) => void;
  setEditDescription: (value: string) => void;
  handleSaveEdit: (id: string) => void;
  handleCancelEdit: () => void;
  handleStartEdit: (todo: Todo) => void;
  handleUpdateStatus: (id: string, status: 'todo' | 'doing' | 'done') => void;
  handleDeleteTodo: (id: string) => void;
  getStatusBadge: (status: string) => React.ReactElement;
  activeId: string | null;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: todo.id,
    transition: {
      duration: 200,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition,
    zIndex: isDragging ? 1000 : 1,
  };

  const isEditing = editingTodo === todo.id;
  const isActive = activeId === todo.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-lg p-4 transition-all duration-200 ${
        isDragging || isActive 
          ? 'opacity-60 shadow-2xl scale-105 border-indigo-400 bg-indigo-50' 
          : 'hover:shadow-lg border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const textarea = e.currentTarget.parentElement?.querySelector('textarea');
                    if (textarea) {
                      textarea.focus();
                    } else {
                      handleSaveEdit(todo.id);
                    }
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancelEdit();
                  }
                }}
                placeholder="Título da tarefa..."
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Descrição (opcional)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    e.preventDefault();
                    handleSaveEdit(todo.id);
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    handleCancelEdit();
                  }
                  if (e.key === 'Enter' && !e.ctrlKey) {
                    e.stopPropagation();
                  }
                }}
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleSaveEdit(todo.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvar
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors shadow-sm hover:shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-3 mb-1">
                <div
                  {...attributes}
                  {...listeners}
                  className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 p-2 -m-2 rounded-md hover:bg-gray-50 transition-all duration-200 group"
                  style={{ touchAction: 'none' }}
                  title="Arrastar tarefa"
                >
                  <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 leading-tight">{todo.title}</h4>
                  {todo.description && (
                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">{todo.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 ml-8">
                <span>📅 {todo.createdAt?.toLocaleDateString('pt-BR')}</span>
                {todo.updatedAt && todo.updatedAt.getTime() !== todo.createdAt?.getTime() && (
                  <span>✏️ Editado: {todo.updatedAt.toLocaleDateString('pt-BR')}</span>
                )}
                {getStatusBadge(todo.status)}
              </div>
            </>
          )}
        </div>
        {!isEditing && (
          <div className="ml-4 flex flex-col gap-3">
            <select
              value={todo.status}
              onChange={(e) => handleUpdateStatus(todo.id, e.target.value as 'todo' | 'doing' | 'done')}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm hover:shadow-md transition-shadow min-w-[140px]"
            >
              <option value="todo">📋 A Fazer</option>
              <option value="doing">⏳ Em Progresso</option>
              <option value="done">✅ Concluído</option>
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleStartEdit(todo)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 hover:text-blue-800 transition-all shadow-sm hover:shadow-md border border-blue-200"
                title="Editar tarefa"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 hover:text-red-800 transition-all shadow-sm hover:shadow-md border border-red-200"
                title="Excluir tarefa"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Excluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'todo' | 'doing' | 'done'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);

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
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  const stats = {
    total: todos.length,
    todo: todos.filter(t => t.status === 'todo').length,
    doing: todos.filter(t => t.status === 'doing').length,
    done: todos.filter(t => t.status === 'done').length
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle.trim()) return;

    try {
      setIsAddingTodo(true);
      await todoService.add(newTitle.trim(), newDescription.trim(), user.uid);
      setNewTitle('');
      setNewDescription('');
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    } finally {
      setIsAddingTodo(false);
    }
  };

  const handleUpdateStatus = async (todoId: string, newStatus: 'todo' | 'doing' | 'done') => {
    try {
      await todoService.updateStatus(todoId, newStatus);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await todoService.delete(todoId);
      } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
      }
    }
  };

  const handleStartEdit = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    
    // Focus no campo título após a renderização
    setTimeout(() => {
      const titleInput = document.querySelector(`input[value="${todo.title}"]`) as HTMLInputElement;
      if (titleInput) {
        titleInput.focus();
        titleInput.select();
      }
    }, 50);
  };

  const handleSaveEdit = async (todoId: string) => {
    if (!editTitle.trim()) return;
    
    try {
      await todoService.updateContent(todoId, { 
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      setEditingTodo(null);
      setEditTitle('');
      setEditDescription('');
    } catch (error) {
      console.error('Erro ao editar tarefa:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over || active.id === over.id) return;
    
    // Se o over.id é um status válido, mover para esse status
    const validStatuses = ['todo', 'doing', 'done'];
    if (validStatuses.includes(over.id as string)) {
      handleUpdateStatus(active.id as string, over.id as 'todo' | 'doing' | 'done');
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      todo: 'bg-blue-100 text-blue-800 border-blue-200',
      doing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      done: 'bg-green-100 text-green-800 border-green-200'
    };
    const labels = {
      todo: '📋 A Fazer',
      doing: '⏳ Em Progresso', 
      done: '✅ Concluído'
    };
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const DropZone = ({ id, label, color }: { id: string; label: string; color: string }) => {
    const { setNodeRef, isOver } = useDroppable({ 
      id,
      data: { accepts: ['todo'] }
    });
    
    const colorClasses = {
      blue: {
        normal: 'border-blue-300 bg-blue-50 text-blue-700',
        hover: 'border-blue-500 bg-blue-100 shadow-lg scale-105'
      },
      yellow: {
        normal: 'border-yellow-300 bg-yellow-50 text-yellow-700',
        hover: 'border-yellow-500 bg-yellow-100 shadow-lg scale-105'
      },
      green: {
        normal: 'border-green-300 bg-green-50 text-green-700',
        hover: 'border-green-500 bg-green-100 shadow-lg scale-105'
      }
    };

    const colors = colorClasses[color as keyof typeof colorClasses];

    return (
      <div
        ref={setNodeRef}
        className={`p-6 rounded-xl border-2 border-dashed transition-all duration-200 min-h-[80px] flex flex-col justify-center ${
          isOver ? colors.hover : colors.normal
        }`}
      >
        <div className={`text-center font-semibold text-lg ${isOver ? 'animate-bounce' : ''}`}>
          {label}
        </div>
        <div className="text-xs text-center mt-2 opacity-80">
          {isOver ? '🎯 Solte aqui!' : '👆 Arraste tarefas para cá'}
        </div>
        {isOver && (
          <div className="mt-2 mx-auto w-8 h-1 bg-current rounded-full animate-pulse"></div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">📝 Todo App</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Olá, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-2 rounded-md text-sm hover:bg-red-700 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Minhas Tarefas</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-slate-600">{stats.total}</div>
              <div className="text-sm text-slate-800">Total</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.todo}</div>
              <div className="text-sm text-blue-800">A Fazer</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.doing}</div>
              <div className="text-sm text-yellow-800">Em Progresso</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.done}</div>
              <div className="text-sm text-green-800">Concluídas</div>
            </div>
          </div>

          {/* Add Todo Form */}
          <form onSubmit={handleAddTodo} className="mb-6 bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-lg font-medium text-gray-900 mb-3">✨ Adicionar Nova Tarefa</h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Título da tarefa..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isAddingTodo}
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Descrição (opcional)..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isAddingTodo}
              />
              <button
                type="submit"
                disabled={isAddingTodo || !newTitle.trim()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingTodo ? 'Adicionando...' : '➕ Adicionar Tarefa'}
              </button>
            </div>
          </form>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔍 Todas ({stats.total})
            </button>
            <button
              onClick={() => setFilter('todo')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'todo' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              📋 A Fazer ({stats.todo})
            </button>
            <button
              onClick={() => setFilter('doing')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'doing' 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              ⏳ Em Progresso ({stats.doing})
            </button>
            <button
              onClick={() => setFilter('done')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                filter === 'done' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              ✅ Concluídas ({stats.done})
            </button>
          </div>

          {/* Todo List */}
          <DndContext 
            collisionDetection={pointerWithin}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={filteredTodos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    {filter === 'all' ? (
                      <div>
                        <div className="text-4xl mb-2">📝</div>
                        <p className="text-lg">Nenhuma tarefa encontrada.</p>
                        <p className="text-sm">Comece criando sua primeira tarefa!</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-2">
                          {filter === 'todo' ? '📋' : filter === 'doing' ? '⏳' : '🎉'}
                        </div>
                        <p className="text-lg">
                          {filter === 'todo' ? 'Nenhuma tarefa pendente' : 
                           filter === 'doing' ? 'Nenhuma tarefa em progresso' : 
                           'Nenhuma tarefa concluída ainda'}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  filteredTodos.map(todo => (
                    <TodoItem 
                      key={todo.id} 
                      todo={todo}
                      editingTodo={editingTodo}
                      editTitle={editTitle}
                      editDescription={editDescription}
                      setEditTitle={setEditTitle}
                      setEditDescription={setEditDescription}
                      handleSaveEdit={handleSaveEdit}
                      handleCancelEdit={handleCancelEdit}
                      handleStartEdit={handleStartEdit}
                      handleUpdateStatus={handleUpdateStatus}
                      handleDeleteTodo={handleDeleteTodo}
                      getStatusBadge={getStatusBadge}
                      activeId={activeId}
                    />
                  ))
                )}
              </div>
            </SortableContext>

            {/* Drag Zones - Areas para soltar os todos */}
            <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                🎯 Zonas de Drop - Arraste as tarefas aqui para mudar o status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DropZone id="todo" label="📋 A Fazer" color="blue" />
                <DropZone id="doing" label="⏳ Em Progresso" color="yellow" />
                <DropZone id="done" label="✅ Concluído" color="green" />
              </div>
            </div>

            <DragOverlay>
              {activeId ? (
                <div className="bg-white border-2 border-indigo-500 rounded-lg p-3 shadow-2xl opacity-95 transform rotate-2 max-w-xs">
                  <div className="flex items-start gap-2">
                    <div className="text-indigo-600 text-sm">📌</div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">
                        {filteredTodos.find(t => t.id === activeId)?.title}
                      </h4>
                      {filteredTodos.find(t => t.id === activeId)?.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {filteredTodos.find(t => t.id === activeId)?.description}
                        </p>
                      )}
                      <p className="text-xs text-indigo-600 mt-1 font-medium">Arrastando...</p>
                    </div>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
