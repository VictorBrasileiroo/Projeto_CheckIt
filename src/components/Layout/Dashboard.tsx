import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              📝 Todo App
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {user?.email}
              </span>
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

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            Bem-vindo ao seu painel de controle! Aqui você pode gerenciar suas tarefas.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Sistema de Autenticação Funcionando!
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Login e registro implementados</li>
              <li>• Rotas protegidas funcionando</li>
              <li>• Sessão persistente ativa</li>
              <li>• Logout seguro</li>
            </ul>
            <p className="text-sm text-blue-700 mt-3">
              <strong>Próximo passo:</strong> Implementar CRUD de tarefas!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
