import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AuthGuard from './components/Auth/AuthSecurity';
import Dashboard from './components/Layout/Dashboard';
import LandingPage from './components/Layout/LandingPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/dashboard" 
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            } 
          />

          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-100 mb-4">404</h1>
                <p className="text-gray-400 mb-6">Página não encontrada</p>
                <Link 
                  to="/" 
                  className="bg-lime-500 text-gray-900 px-4 py-2 rounded-md hover:bg-lime-400 font-medium"
                >
                  Voltar ao início
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
