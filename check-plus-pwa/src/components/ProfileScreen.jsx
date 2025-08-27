import React from 'react';
import { User, Mail, Calendar, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen lofi-bg p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white lofi-text mb-2">Perfil</h1>
          <p className="text-white/80">Suas informações e configurações</p>
        </div>

        {/* User Info Card */}
        <div className="lofi-card rounded-2xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white lofi-text">{user?.name}</h2>
            <p className="text-white/70">{user?.email}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-white/80">
              <Mail className="w-5 h-5 text-white/60" />
              <div>
                <p className="text-sm text-white/60">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-white/80">
              <Calendar className="w-5 h-5 text-white/60" />
              <div>
                <p className="text-sm text-white/60">Membro desde</p>
                <p className="font-medium">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="lofi-card rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white lofi-text mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Configurações
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white font-medium">Dados Seguros</p>
                  <p className="text-white/60 text-sm">Seus dados estão protegidos</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-white/60" />
                <div>
                  <p className="text-white font-medium">Sincronização</p>
                  <p className="text-white/60 text-sm">Dados sincronizados automaticamente</p>
                </div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="lofi-card rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-white lofi-text mb-4">Estatísticas</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-white/60 text-sm">Post-its</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-white/60 text-sm">Compromissos</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-white/60 text-sm">Tarefas</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-white/60 text-sm">Concluídas</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full lofi-card lofi-button rounded-xl p-4 flex items-center justify-center space-x-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sair da Conta</span>
        </button>

        {/* App Info */}
        <div className="mt-6 text-center text-white/50 text-sm">
          <p>Check+ PWA v1.0</p>
          <p>Feito com ❤️ para sua produtividade</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

