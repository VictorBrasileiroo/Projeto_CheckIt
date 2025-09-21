import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DndContext, useDroppable,DragOverlay,pointerWithin,MouseSensor,TouchSensor,useSensor,useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { todoService } from '../../services/TodoService';
import type { Todo } from '../../services/TodoService';

const TodoItem = ({ 
    todo, 
    editandoTarefa, 
    tituloEdicao, 
    descricaoEdicao, 
    setTituloEdicao, 
    setDescricaoEdicao, 
    salvarEdicao, 
    cancelarEdicao, 
    comecarEdicaoToDo, 
    mudaStatus, 
    apagarTarefa, 
    statusCards, 
    activeId 
}: { 
    todo: Todo;
    editandoTarefa: string | null;
    tituloEdicao: string;
    descricaoEdicao: string;
    setTituloEdicao: (value: string) => void;
    setDescricaoEdicao: (value: string) => void;
    salvarEdicao: (id: string) => void;
    cancelarEdicao: () => void;
    comecarEdicaoToDo: (todo: Todo) => void;
    mudaStatus: (id: string, status: 'todo' | 'doing' | 'done') => void;
    apagarTarefa: (id: string) => void;
    statusCards: (status: string) => React.ReactElement;
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

    const isEditing = editandoTarefa === todo.id;
    const isActive = activeId === todo.id;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-gray-800/80 backdrop-blur-sm border rounded-lg p-3 sm:p-4 transition-all duration-200 ${
                isDragging || isActive 
                    ? 'opacity-60 shadow-2xl scale-105 border-lime-400 bg-gray-700/50 ring-2 ring-lime-400/20' 
                    : 'hover:shadow-lg border-gray-700 hover:border-gray-600 hover:bg-gray-800'
            }`}
        >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-3 sm:gap-0">
                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={tituloEdicao}
                                onChange={(e) => setTituloEdicao(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-100 placeholder-gray-400"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const textarea = e.currentTarget.parentElement?.querySelector('textarea');
                                        if (textarea) {
                                            textarea.focus();
                                        } else {
                                            salvarEdicao(todo.id);
                                        }
                                    }
                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                        cancelarEdicao();
                                    }
                                }}
                                placeholder="Título da tarefa..."
                            />
                            <textarea
                                value={descricaoEdicao}
                                onChange={(e) => setDescricaoEdicao(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-100 placeholder-gray-400 resize-none"
                                placeholder="Descrição (opcional)..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.ctrlKey) {
                                        e.preventDefault();
                                        salvarEdicao(todo.id);
                                    }
                                    if (e.key === 'Escape') {
                                        e.preventDefault();
                                        cancelarEdicao();
                                    }
                                    if (e.key === 'Enter' && !e.ctrlKey) {
                                        e.stopPropagation();
                                    }
                                }}
                            />
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => salvarEdicao(todo.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm hover:shadow-md"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Salvar
                                </button>
                                <button
                                    onClick={cancelarEdicao}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm hover:shadow-md"
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
                            <div className="flex items-start gap-2 sm:gap-3 mb-1">
                                <div
                                    {...attributes}
                                    {...listeners}
                                    className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-lime-400 p-1 sm:p-2 -m-1 sm:-m-2 rounded-md hover:bg-gray-700 transition-all duration-200 group touch-manipulation"
                                    style={{ touchAction: 'none' }}
                                    title="Arrastar tarefa"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M7 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0 pb-3">
                                    <h4 className="font-semibold text-gray-100 leading-tight text-sm sm:text-base break-words">{todo.title}</h4>
                                    {todo.description && (
                                        <p className="text-gray-300 text-xs sm:text-sm mt-1 leading-relaxed break-words">{todo.description}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-gray-400 ml-5 sm:ml-8">
                                <span className="whitespace-nowrap">📅 {todo.createdAt?.toLocaleDateString('pt-BR')}</span>
                                {todo.updatedAt && todo.updatedAt.getTime() !== todo.createdAt?.getTime() && (
                                    <span className="whitespace-nowrap">✏️ Editado: {todo.updatedAt.toLocaleDateString('pt-BR')}</span>
                                )}
                                <div className="flex-shrink-0">
                                    {statusCards(todo.status)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                {!isEditing && (
                    <div className="flex sm:flex-col gap-2 sm:gap-3 sm:ml-4 w-full sm:w-auto">
                        <select
                            value={todo.status}
                            onChange={(e) => mudaStatus(todo.id, e.target.value as 'todo' | 'doing' | 'done')}
                            className="text-xs sm:text-sm bg-gray-900 border border-gray-600 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:outline-none focus:ring-2 focus:ring-lime-500 text-gray-100 shadow-sm hover:shadow-md transition-shadow flex-1 sm:flex-none sm:min-w-[140px]"
                        >
                            <option value="todo">📋 A Fazer</option>
                            <option value="doing">⏳ Em Progresso</option>
                            <option value="done">✅ Concluído</option>
                        </select>
                        
                        <div className="flex gap-1 sm:gap-2">
                            <button
                                onClick={() => comecarEdicaoToDo(todo)}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-lime-500/20 text-lime-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-lime-500/30 hover:text-lime-300 transition-all shadow-sm hover:shadow-md border border-lime-500/30 touch-manipulation"
                                title="Editar tarefa"
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span className="hidden sm:inline">Editar</span>
                            </button>
                            
                            <button
                                onClick={() => apagarTarefa(todo.id)}
                                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/20 text-red-400 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-500/30 hover:text-red-300 transition-all shadow-sm hover:shadow-md border border-red-500/30 touch-manipulation"
                                title="Excluir tarefa"
                            >
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="hidden sm:inline">Excluir</span>
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
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState<'all' | 'todo' | 'doing' | 'done'>('all');
    const [tituloNovo, setTituloNovo] = useState('');
    const [descricaoNova, setDescricaoNova] = useState('');
    const [adicionandoTarefa, setAdicionandoTarefa] = useState(false);
    const [editandoTarefa, setEditandoTarefa] = useState<string | null>(null);
    const [tituloEdicao, setTituloEdicao] = useState('');
    const [descricaoEdicao, setDescricaoEdicao] = useState('');
    const [activeId, setActiveId] = useState<string | null>(null);

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 8, 
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 150, 
            tolerance: 8, 
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        if (!user) return;

        setCarregando(true);
        const unsubscribe = todoService.subscribe(user.uid, (todosList) => {
            setTodos(todosList);
            setCarregando(false);
        });

        return unsubscribe;
    }, [user]);

    const tarefasFiltradas = todos.filter(todo => {
        if (filtro === 'all') return true;
        return todo.status === filtro;
    });

    const numeros = {
        total: todos.length,
        todo: todos.filter(t => t.status === 'todo').length,
        doing: todos.filter(t => t.status === 'doing').length,
        done: todos.filter(t => t.status === 'done').length
    };

    const adicionarTarefa = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !tituloNovo.trim()) return;

        try {
            setAdicionandoTarefa(true);
            await todoService.add(tituloNovo.trim(), descricaoNova.trim(), user.uid);
            setTituloNovo('');
            setDescricaoNova('');
        } catch (error) {
            console.error('Erro ao adicionar tarefa:', error);
        } finally {
            setAdicionandoTarefa(false);
        }
    };

    const mudaStatus = async (todoId: string, newStatus: 'todo' | 'doing' | 'done') => {
        try {
            await todoService.updateStatus(todoId, newStatus);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
        }
    };

    const apagarTarefa = async (todoId: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
            try {
                await todoService.delete(todoId);
            } catch (error) {
                console.error('Erro ao excluir tarefa:', error);
            }
        }
    };

    const comecarEdicaoToDo = (todo: Todo) => {
        setEditandoTarefa(todo.id);
        setTituloEdicao(todo.title);
        setDescricaoEdicao(todo.description || '');

        setTimeout(() => {
            const titleInput = document.querySelector(`input[value="${todo.title}"]`) as HTMLInputElement;
            if (titleInput) {
                titleInput.focus();
                titleInput.select();
            }
        }, 50);
    };

    const salvarEdicao = async (todoId: string) => {
        if (!tituloEdicao.trim()) return;
        
        try {
            await todoService.updateContent(todoId, { 
                title: tituloEdicao.trim(),
                description: descricaoEdicao.trim()
            });
            setEditandoTarefa(null);
            setTituloEdicao('');
            setDescricaoEdicao('');
        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
        }
    };

    const cancelarEdicao = () => {
        setEditandoTarefa(null);
        setTituloEdicao('');
        setDescricaoEdicao('');
    };

    const sairToDo = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const finalizouArrasto = (event: DragEndEvent) => {
        const { active, over } = event;
        
        setActiveId(null);
        
        if (!over || active.id === over.id) return;
        
        const validStatuses = ['todo', 'doing', 'done'];
        if (validStatuses.includes(over.id as string)) {
            mudaStatus(active.id as string, over.id as 'todo' | 'doing' | 'done');
        }
    };

    const iniciouArrasto = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const statusCards = (status: string) => {
        const badges = {
            todo: 'bg-blue-900/50 text-blue-300 border-blue-600/50',
            doing: 'bg-yellow-900/50 text-yellow-300 border-yellow-600/50',
            done: 'bg-green-900/50 text-green-300 border-green-600/50'
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
                normal: 'border-blue-600/40 bg-gradient-to-br from-gray-800/60 to-blue-900/30 text-blue-300',
                hover: 'border-blue-400 bg-gradient-to-br from-gray-700/80 to-blue-800/50 shadow-2xl scale-[1.02] ring-4 ring-blue-500/20'
            },
            yellow: {
                normal: 'border-lime-600/40 bg-gradient-to-br from-gray-800/60 to-lime-900/30 text-lime-300',
                hover: 'border-lime-400 bg-gradient-to-br from-gray-700/80 to-lime-800/50 shadow-2xl scale-[1.02] ring-4 ring-lime-500/20'
            },
            green: {
                normal: 'border-emerald-600/40 bg-gradient-to-br from-gray-800/60 to-emerald-900/30 text-emerald-300',
                hover: 'border-emerald-400 bg-gradient-to-br from-gray-700/80 to-emerald-800/50 shadow-2xl scale-[1.02] ring-4 ring-emerald-500/20'
            }
        };

        const colors = colorClasses[color as keyof typeof colorClasses];

        return (
            <div
                ref={setNodeRef}
                className={`p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl border-2 sm:border-3 border-dashed transition-all duration-300 min-h-[100px] sm:min-h-[120px] flex flex-col justify-center items-center relative overflow-hidden ${
                    isOver ? colors.hover : colors.normal
                } hover:shadow-xl hover:scale-[1.01] cursor-pointer group touch-manipulation`}
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,currentColor_1px,transparent_1px)] bg-[length:15px_15px] sm:bg-[length:20px_20px]"></div>
                </div>
                
                <div className="relative z-10 text-center px-2">
                    <div className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 transition-all duration-300 ${
                        isOver ? 'animate-pulse scale-110' : 'group-hover:scale-105'
                    }`}>
                        {label}
                    </div>
                    
                    <div className={`text-xs sm:text-sm opacity-80 transition-all duration-300 ${
                        isOver ? 'font-semibold sm:text-base' : ''
                    }`}>
                        {isOver ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-current rounded-full animate-ping"></div>
                                <span className="hidden sm:inline">Solte a tarefa aqui!</span>
                                <span className="sm:hidden">Solte aqui!</span>
                                <div className="w-2 h-2 bg-current rounded-full animate-ping"></div>
                            </div>
                        ) : (
                            <>
                                <span className="hidden sm:inline">Arraste tarefas para esta zona</span>
                                <span className="sm:hidden">Arraste aqui</span>
                            </>
                        )}
                    </div>
                </div>

                {isOver && (
                    <div className="absolute inset-0 rounded-3xl">
                        <div className="absolute inset-0 rounded-3xl border-2 border-current animate-ping opacity-60"></div>
                        <div className="absolute inset-2 rounded-3xl border border-current animate-pulse opacity-40"></div>
                    </div>
                )}

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

    if (carregando) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-lime-600 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl animate-pulse">
                        <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400 mx-auto mb-4"></div>
                    <p className="text-gray-300 font-medium">Carregando suas tarefas...</p>
                    <p className="text-gray-500 text-sm">Modo automático ativo</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <header className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button className='cursor-pointer flex gap-3 items-center'
                                    onClick={sairToDo}>
                            <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                                    
                                        CheckIt
                                </h1>
                            </div>
                            </button>
                        </div>
                        <div className="flex items-center space-x-6">
                            <div className="text-right">
                                <p className="text-sm text-gray-300">Olá, <span className="font-semibold text-lime-400">{user?.displayName || user?.email?.split('@')[0]}👋🏻</span></p>
                                <p className="text-xs text-gray-500">Seja bem-vindo(a)!</p>
                            </div>
                            <button
                                onClick={sairToDo}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-100 rounded-xl text-sm font-medium hover:from-gray-600 hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl"
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

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/60 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-400">Total de Tarefas</p>
                                <p className="text-3xl font-bold text-gray-100">{numeros.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-400">A Fazer</p>
                                <p className="text-3xl font-bold text-blue-300">{numeros.todo}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-lime-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-lime-400">Em Progresso</p>
                                <p className="text-3xl font-bold text-lime-300">{numeros.doing}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-lime-600/20 to-lime-700/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-emerald-600/30 shadow-lg hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-400">Concluídas</p>
                                <p className="text-3xl font-bold text-emerald-300">{numeros.done}</p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl border border-gray-700/60 shadow-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-800/60 to-gray-700/60 border-b border-gray-700/60 p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-100">Adicionar Nova Tarefa</h2>
                            <div className="flex-1"></div>
                        </div>
                        
                        <form onSubmit={adicionarTarefa} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    value={tituloNovo}
                                    onChange={(e) => setTituloNovo(e.target.value)}
                                    className="md:col-span-3 px-5 py-4 bg-gray-900/80 backdrop-blur-sm border border-gray-600 rounded-2xl focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-100 placeholder-gray-400 shadow-sm transition-all duration-200"
                                    placeholder="Ex: Revisar relatório de vendas..."
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={adicionandoTarefa || !tituloNovo.trim()}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-lime-500 to-lime-600 text-gray-900 rounded-2xl font-semibold hover:from-lime-400 hover:to-lime-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    {adicionandoTarefa ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    )}
                                    {adicionandoTarefa ? 'Adicionando...' : 'Criar Tarefa'}
                                </button>
                            </div>
                            <textarea
                                value={descricaoNova}
                                onChange={(e) => setDescricaoNova(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-900/80 backdrop-blur-sm border border-gray-600 rounded-2xl focus:ring-2 focus:ring-lime-500 focus:border-lime-500 text-gray-100 placeholder-gray-400 shadow-sm transition-all duration-200 resize-none"
                                rows={3}
                                placeholder="Descrição detalhada da tarefa (opcional)..."
                            />
                        </form>
                    </div>

                    <div className="p-8 border-b border-gray-700/60">
                        <h3 className="text-lg font-semibold text-gray-100 mb-4">Filtrar Tarefas</h3>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { key: 'all', label: 'Todas', count: numeros.total, color: 'gray' },
                                { key: 'todo', label: 'A Fazer', count: numeros.todo, color: 'blue' },
                                { key: 'doing', label: 'Em Progresso', count: numeros.doing, color: 'lime' },
                                { key: 'done', label: 'Concluídas', count: numeros.done, color: 'emerald' }
                            ].map(({ key, label, count, color }) => (
                                <button
                                    key={key}
                                    onClick={() => setFiltro(key as any)}
                                    className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-lg ${
                                        filtro === key
                                            ? color === 'gray' 
                                                ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-100 shadow-lg'
                                                : color === 'blue'
                                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                                                : color === 'lime'
                                                ? 'bg-gradient-to-r from-lime-500 to-lime-600 text-gray-900 shadow-lg'
                                                : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                                            : color === 'gray'
                                            ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50'
                                            : color === 'blue'
                                            ? 'bg-blue-900/20 text-blue-400 hover:bg-blue-800/30 border border-blue-600/30'
                                            : color === 'lime'
                                            ? 'bg-lime-900/20 text-lime-400 hover:bg-lime-800/30 border border-lime-600/30'
                                            : 'bg-emerald-900/20 text-emerald-400 hover:bg-emerald-800/30 border border-emerald-600/30'
                                    }`}
                                >
                                    {label} ({count})
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-8">
                        <DndContext 
                            collisionDetection={pointerWithin}
                            onDragStart={iniciouArrasto}
                            onDragEnd={finalizouArrasto}
                            sensors={sensors}
                        >
                            <SortableContext items={tarefasFiltradas.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
                                <div className="space-y-4">
                                    {tarefasFiltradas.length === 0 ? (
                                        <div className="text-center py-16">
                                            <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                                {filtro === 'all' ? (
                                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                ) : filtro === 'todo' ? (
                                                    <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                ) : filtro === 'doing' ? (
                                                    <svg className="w-10 h-10 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                                {filtro === 'all' ? 'Nenhuma tarefa encontrada' : 
                                                 filtro === 'todo' ? 'Nenhuma tarefa pendente' : 
                                                 filtro === 'doing' ? 'Nenhuma tarefa em progresso' : 
                                                 'Nenhuma tarefa concluída ainda'}
                                            </h3>
                                            <p className="text-gray-500">
                                                {filtro === 'all' ? 'Comece criando sua primeira tarefa!' : 
                                                 `Você não tem tarefas ${filtro === 'todo' ? 'pendentes' : filtro === 'doing' ? 'em progresso' : 'concluídas'} no momento.`}
                                            </p>
                                        </div>
                                    ) : (
                                        tarefasFiltradas.map(todo => (
                                            <TodoItem 
                                                key={todo.id} 
                                                todo={todo}
                                                editandoTarefa={editandoTarefa}
                                                tituloEdicao={tituloEdicao}
                                                descricaoEdicao={descricaoEdicao}
                                                setTituloEdicao={setTituloEdicao}
                                                setDescricaoEdicao={setDescricaoEdicao}
                                                salvarEdicao={salvarEdicao}
                                                cancelarEdicao={cancelarEdicao}
                                                comecarEdicaoToDo={comecarEdicaoToDo}
                                                mudaStatus={mudaStatus}
                                                apagarTarefa={apagarTarefa}
                                                statusCards={statusCards}
                                                activeId={activeId}
                                            />
                                        ))
                                    )}
                                </div>
                            </SortableContext>

                            <div className="mt-8 p-10 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-3xl border border-gray-700/60 backdrop-blur-sm">
                                <div className="text-center mb-6 sm:mb-8 lg:mb-10">
                                    <div className="inline-flex items-center gap-3 mb-4">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-100">Zonas de Drag-and-Drop</h3>
                                    </div>
                                    <p className="text-gray-400 text-base sm:text-lg px-4">Arraste as tarefas para as zonas abaixo para alterar o status</p>
                                    <div className="mt-4 inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-lime-500/20 text-lime-400 rounded-full text-xs sm:text-sm font-medium border border-lime-500/30">
                                        <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                                        <span className="hidden sm:inline">Drag-and-Drop</span>
                                        <span className="sm:hidden">Arraste</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                                    <DropZone id="todo" label="📋 A Fazer" color="blue" />
                                    <DropZone id="doing" label="⏳ Em Progresso" color="yellow" />
                                    <div className="sm:col-span-2 lg:col-span-1">
                                        <DropZone id="done" label="✅ Concluído" color="green" />
                                    </div>
                                </div>
                                
                                <div className="mt-6 sm:mt-8 text-center">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                            </svg>
                                            <span>Toque e segure</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                            <span>Arraste para a zona</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                        className="bg-gray-800/95 backdrop-blur-sm border-2 border-lime-400 rounded-2xl p-4 shadow-2xl max-w-sm"
                                        style={{
                                            transform: 'rotate(2deg)',
                                            cursor: 'grabbing',
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                                <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-semibold text-gray-100 text-sm leading-tight">
                                                    {tarefasFiltradas.find(t => t.id === activeId)?.title}
                                                </h4>
                                                {tarefasFiltradas.find(t => t.id === activeId)?.description && (
                                                    <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                                                        {tarefasFiltradas.find(t => t.id === activeId)?.description}
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                                                    <p className="text-xs text-lime-400 font-medium">Arrastando...</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="absolute inset-0 rounded-2xl bg-lime-400/10 blur-md -z-10"></div>
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
