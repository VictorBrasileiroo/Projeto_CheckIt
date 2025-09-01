import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  DndContext, 
  useDroppable,
  DragOverlay,
  pointerWithin,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
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

  // Configurar sensores para melhor controle do drag
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 3,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

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
        normal: 'border-blue-300/60 bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-700',
        hover: 'border-blue-500 bg-gradient-to-br from-blue-100 to-blue-200 shadow-2xl scale-[1.02] ring-4 ring-blue-200/50'
      },
      yellow: {
        normal: 'border-amber-300/60 bg-gradient-to-br from-amber-50 to-amber-100/50 text-amber-700',
        hover: 'border-amber-500 bg-gradient-to-br from-amber-100 to-amber-200 shadow-2xl scale-[1.02] ring-4 ring-amber-200/50'
      },
      green: {
        normal: 'border-emerald-300/60 bg-gradient-to-br from-emerald-50 to-emerald-100/50 text-emerald-700',
        hover: 'border-emerald-500 bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-2xl scale-[1.02] ring-4 ring-emerald-200/50'
      }
    };

    const colors = colorClasses[color as keyof typeof colorClasses];

    return (
      <div
        ref={setNodeRef}
        className={`p-8 rounded-3xl border-3 border-dashed transition-all duration-300 min-h-[120px] flex flex-col justify-center items-center relative overflow-hidden ${
          isOver ? colors.hover : colors.normal
        } hover:shadow-xl hover:scale-[1.01] cursor-pointer group`}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,currentColor_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <div className={`text-2xl font-bold mb-2 transition-all duration-300 ${
            isOver ? 'animate-pulse scale-110' : 'group-hover:scale-105'
          }`}>
            {label}
          </div>
          
          <div className={`text-sm opacity-80 transition-all duration-300 ${
            isOver ? 'font-semibold text-base' : ''
          }`}>
            {isOver ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-current rounded-full animate-ping"></div>
                <span>Solte a tarefa aqui!</span>
                <div className="w-2 h-2 bg-current rounded-full animate-ping"></div>
              </div>
            ) : (
              'Arraste tarefas para esta zona'
            )}
          </div>
        </div>

        {/* Animated Border Effect */}
        {isOver && (
          <div className="absolute inset-0 rounded-3xl">
            <div className="absolute inset-0 rounded-3xl border-2 border-current animate-ping opacity-60"></div>
            <div className="absolute inset-2 rounded-3xl border border-current animate-pulse opacity-40"></div>
          </div>
        )}

        {/* Drop Target Indicator */}
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
          isOver ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Carregando suas tarefas...</p>
          <p className="text-slate-400 text-sm">Modo automático ativo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header com identidade Sootz */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  TodoList Sootz
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm text-slate-600">Olá, <span className="font-semibold">{user?.email},</span></p>
                <p className="text-xs text-slate-400">Seja bem-vindo!</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl text-sm font-medium hover:from-slate-700 hover:to-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Dashboard - Estilo Sootz */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total de Tarefas</p>
                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">A Fazer</p>
                <p className="text-3xl font-bold text-blue-700">{stats.todo}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Em Progresso</p>
                <p className="text-3xl font-bold text-amber-700">{stats.doing}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Concluídas</p>
                <p className="text-3xl font-bold text-emerald-700">{stats.done}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl overflow-hidden">
          {/* Add Todo Form - Redesenhado */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Adicionar Nova Tarefa</h2>
              <div className="flex-1"></div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                Automação Ativa
              </span>
            </div>
            
            <form onSubmit={handleAddTodo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="md:col-span-3 px-5 py-4 bg-white/80 backdrop-blur-sm border border-slate-300/60 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 shadow-sm transition-all duration-200"
                  placeholder="Ex: Revisar relatório de vendas..."
                  required
                />
                <button
                  type="submit"
                  disabled={isAddingTodo || !newTitle.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isAddingTodo ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  {isAddingTodo ? 'Adicionando...' : 'Criar Tarefa'}
                </button>
              </div>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-5 py-4 bg-white/80 backdrop-blur-sm border border-slate-300/60 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 shadow-sm transition-all duration-200 resize-none"
                rows={3}
                placeholder="Descrição detalhada da tarefa (opcional)..."
              />
            </form>
          </div>

          {/* Filter Buttons - Redesenhado */}
          <div className="p-8 border-b border-slate-200/60">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Filtrar Tarefas</h3>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'Todas', count: stats.total, color: 'slate' },
                { key: 'todo', label: 'A Fazer', count: stats.todo, color: 'blue' },
                { key: 'doing', label: 'Em Progresso', count: stats.doing, color: 'amber' },
                { key: 'done', label: 'Concluídas', count: stats.done, color: 'emerald' }
              ].map(({ key, label, count, color }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-lg ${
                    filter === key
                      ? color === 'slate' 
                        ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg'
                        : color === 'blue'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                        : color === 'amber'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                      : color === 'slate'
                      ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                      : color === 'blue'
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
                      : color === 'amber'
                      ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
          </div>

          {/* Todo List */}
          <div className="p-8">
            <DndContext 
              collisionDetection={pointerWithin}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <SortableContext items={filteredTodos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {filteredTodos.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        {filter === 'all' ? (
                          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        ) : filter === 'todo' ? (
                          <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        ) : filter === 'doing' ? (
                          <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">
                        {filter === 'all' ? 'Nenhuma tarefa encontrada' : 
                         filter === 'todo' ? 'Nenhuma tarefa pendente' : 
                         filter === 'doing' ? 'Nenhuma tarefa em progresso' : 
                         'Nenhuma tarefa concluída ainda'}
                      </h3>
                      <p className="text-slate-500">
                        {filter === 'all' ? 'Comece criando sua primeira tarefa!' : 
                         `Você não tem tarefas ${filter === 'todo' ? 'pendentes' : filter === 'doing' ? 'em progresso' : 'concluídas'} no momento.`}
                      </p>
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

              {/* Drag Zones - Redesenhado */}
              <div className="mt-16 p-10 bg-gradient-to-br from-slate-50/80 to-blue-50/80 rounded-3xl border border-slate-200/60 backdrop-blur-sm">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Zonas de Drop Inteligentes</h3>
                  </div>
                  <p className="text-slate-600 text-lg">Arraste as tarefas para as zonas abaixo para alterar o status automaticamente</p>
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    Modo Automático Ativo
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <DropZone id="todo" label="📋 A Fazer" color="blue" />
                  <DropZone id="doing" label="⏳ Em Progresso" color="yellow" />
                  <DropZone id="done" label="✅ Concluído" color="green" />
                </div>
                
                {/* Instructions */}
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                      </svg>
                      <span>Clique e segure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      <span>Arraste para a zona</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Solte para atualizar</span>
                    </div>
                  </div>
                </div>
              </div>

              <DragOverlay
                dropAnimation={{
                  duration: 200,
                  easing: 'ease-out',
                }}
                style={{
                  transformOrigin: '0 0',
                }}
              >
                {activeId ? (
                  <div 
                    className="bg-white/95 backdrop-blur-sm border-2 border-blue-400 rounded-2xl p-4 shadow-2xl max-w-sm"
                    style={{
                      transform: 'rotate(2deg)',
                      cursor: 'grabbing',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-slate-900 text-sm leading-tight">
                          {filteredTodos.find(t => t.id === activeId)?.title}
                        </h4>
                        {filteredTodos.find(t => t.id === activeId)?.description && (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                            {filteredTodos.find(t => t.id === activeId)?.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <p className="text-xs text-blue-600 font-medium">Arrastando...</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-2xl bg-blue-400/10 blur-md -z-10"></div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
