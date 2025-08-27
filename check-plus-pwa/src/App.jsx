import React, { useState } from 'react';
import './App.css';
import { Home, List, StickyNote, Calendar, User } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthScreen from './components/AuthScreen';
import ChecklistScreen from './components/ChecklistScreen';
import PostitsScreen from './components/PostitsScreen';
import CalendarScreen from './components/CalendarScreen';
import ProfileScreen from './components/ProfileScreen';

function AppContent() {
  const { user, loading, login } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  console.log('=== APP CONTENT RENDER ===');
  console.log('User:', user);
  console.log('Loading:', loading);
  console.log('Active tab:', activeTab);

  if (loading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen lofi-bg flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="lofi-text">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('No user, showing auth screen');
    return <AuthScreen onLogin={login} />;
  }

  console.log('User logged in, rendering main app');

  const renderContent = () => {
    try {
      console.log('Rendering content for tab:', activeTab);
      switch (activeTab) {
        case 'home':
          return <ChecklistScreen onNavigate={setActiveTab} />;
        case 'lists':
          return <ChecklistScreen onNavigate={setActiveTab} />;
        case 'postits':
          return <PostitsScreen />;
        case 'calendar':
          return <CalendarScreen />;
        case 'profile':
          return <ProfileScreen />;
        default:
          console.log('Unknown tab, rendering home');
          return <ChecklistScreen onNavigate={setActiveTab} />;
      }
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="min-h-screen lofi-bg flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-xl font-bold mb-4">Erro ao carregar</h2>
            <p className="mb-4">Ocorreu um erro inesperado</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white/20 px-4 py-2 rounded-lg"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen lofi-bg relative">
      {/* Content */}
      <div className="pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20 p-4">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {[
            { id: 'home', icon: Home, label: 'Início' },
            { id: 'lists', icon: List, label: 'Listas' },
            { id: 'postits', icon: StickyNote, label: 'Post-Its' },
            { id: 'calendar', icon: Calendar, label: 'Calendário' },
            { id: 'profile', icon: User, label: 'Perfil' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all active:scale-95 ${
                activeTab === id
                  ? 'text-white bg-white/20'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

