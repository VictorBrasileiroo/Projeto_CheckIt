import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <div className="text-center py-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  Todo App
                </h1>
                <p className="text-gray-600 mb-6">
                  Sistema de autenticação configurado!
                </p>
                <div className="space-x-4">
                  <Link 
                    to="/login" 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Cadastrar
                  </Link>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
