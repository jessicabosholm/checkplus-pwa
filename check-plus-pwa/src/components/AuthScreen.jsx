import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Criar conta demo automaticamente
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('checkplus_users') || '[]');
    const demoExists = users.find(u => u.email === 'demo@checkplus.com');
    
    if (!demoExists) {
      const demoUser = {
        id: 'demo',
        name: 'Usuário Demo',
        email: 'demo@checkplus.com',
        password: 'demo123',
        createdAt: new Date().toISOString()
      };
      users.push(demoUser);
      localStorage.setItem('checkplus_users', JSON.stringify(users));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('=== DEBUG LOGIN ===');
    console.log('Form data:', formData);
    console.log('Is login:', isLogin);

    try {
      if (isLogin) {
        // Login
        const users = JSON.parse(localStorage.getItem('checkplus_users') || '[]');
        console.log('Users in storage:', users);
        
        const user = users.find(u => u.email === formData.email && u.password === formData.password);
        console.log('Found user:', user);
        
        if (user) {
          console.log('Login successful, calling onLogin...');
          localStorage.setItem('checkplus_current_user', JSON.stringify(user));
          onLogin(user);
          console.log('onLogin called');
        } else {
          console.log('Login failed - user not found');
          setError('Email ou senha incorretos');
        }
      } else {
        // Registro
        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres');
          return;
        }

        const users = JSON.parse(localStorage.getItem('checkplus_users') || '[]');
        
        // Verificar se email já existe
        if (users.find(u => u.email === formData.email)) {
          setError('Este email já está cadastrado');
          return;
        }

        // Criar novo usuário
        const newUser = {
          id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          password: formData.password,
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('checkplus_users', JSON.stringify(users));
        localStorage.setItem('checkplus_current_user', JSON.stringify(newUser));
        
        onLogin(newUser);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="min-h-screen lofi-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white lofi-text mb-2">Check+</h1>
          <p className="text-white/80">Seu assistente de produtividade</p>
        </div>

        {/* Auth Card */}
        <div className="lofi-card rounded-2xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white lofi-text mb-2">
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </h2>
            <p className="text-white/70">
              {isLogin ? 'Acesse sua conta' : 'Cadastre-se gratuitamente'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Seu nome completo"
                    required={!isLogin}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder={isLogin ? 'Sua senha' : 'Mínimo 6 caracteres'}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 lofi-button"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>

          {/* Demo Account */}
          <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/60 text-xs text-center mb-2">Conta de demonstração:</p>
            <p className="text-white/80 text-sm text-center">
              <strong>Email:</strong> demo@checkplus.com<br />
              <strong>Senha:</strong> demo123
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <p className="text-white/60 text-sm mb-4">Com sua conta você terá:</p>
          <div className="grid grid-cols-2 gap-4 text-white/70 text-sm">
            <div>✨ Sincronização automática</div>
            <div>📱 Acesso em qualquer dispositivo</div>
            <div>🔒 Dados seguros na nuvem</div>
            <div>🆓 Totalmente gratuito</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

