import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <header className="container mx-auto px-6 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className=" w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-100">TodoList Sootz</h1>
          </div>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-4 sm:py-2 text-gray-300 hover:text-lime-400 border-2 rounded-xl transition-colors font-medium"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-gray-900 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              Começar Grátis
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-lime-300 via-lime-500 to-lime-900 bg-clip-text text-transparent leading-tight">
            Organize sua vida
            
            com 
            <br />simplicidade
          </h1>
          <p className="text-xl md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            O gerenciador de tarefas mais intuitivo e poderoso que você já usou. 
            Drag & drop, sincronização em tempo real e interface moderna.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-400 hover:to-lime-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Criar Conta Grátis
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-gray-600 hover:border-lime-400 text-gray-300 hover:text-lime-400 rounded-xl font-bold text-lg transition-all duration-200 hover:bg-gray-800"
            >
              Já tenho conta
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-lime-400/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-100">Drag & Drop</h3>
            <p className="text-gray-400 leading-relaxed">
              Arraste e solte suas tarefas entre diferentes status de forma intuitiva e natural.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-lime-400/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-100">Tempo Real</h3>
            <p className="text-gray-400 leading-relaxed">
              Sincronização instantânea entre todos os seus dispositivos. Suas tarefas sempre atualizadas.
            </p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-lime-400/30 transition-all duration-300 group">
            <div className="w-12 h-12 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-100">Seguro</h3>
            <p className="text-gray-400 leading-relaxed">
              Seus dados protegidos com autenticação segura. Apenas você tem acesso às suas tarefas.
            </p>
          </div>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-100">Como funciona</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mx-auto text-gray-900 font-bold text-xl">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Crie suas tarefas</h3>
              <p className="text-gray-400">Adicione tarefas com títulos e descrições detalhadas</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mx-auto text-gray-900 font-bold text-xl">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Organize por status</h3>
              <p className="text-gray-400">Use drag & drop para mover entre status</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mx-auto text-gray-900 font-bold text-xl">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-200">Acompanhe o progresso</h3>
              <p className="text-gray-400">Veja seu progresso e fique sempre organizado</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4 text-gray-100">Pronto para começar?</h2>
          <p className="text-xl text-gray-400 mb-8">Junte-se a milhares de pessoas que já organizam sua vida com o TodoList</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-400 hover:to-lime-500 text-white rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Começar Agora 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-800 py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-lime-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-400 font-medium"> TodoList Sootz - Feito para fins Educacionais e Técnicos</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
