import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ChecklistScreen = ({ onNavigate }) => {
  const { getUserData, setUserData } = useAuth();
  const [selectedList, setSelectedList] = useState(null);
  const [lists, setLists] = useState({});
  const [newItemText, setNewItemText] = useState('');

  // Carregar listas do usuário
  useEffect(() => {
    const userLists = getUserData('lists') || {
      shopping: {
        title: 'Lista de Compras',
        items: [
          { id: 1, text: 'Leite', completed: false },
          { id: 2, text: 'Pão', completed: true },
          { id: 3, text: 'Ovos', completed: false },
          { id: 4, text: 'Frutas', completed: false }
        ]
      },
      checklist: {
        title: 'Checklist de Saída',
        items: [
          { id: 1, text: 'Chaves', completed: true },
          { id: 2, text: 'Carteira', completed: false },
          { id: 3, text: 'Celular', completed: true },
          { id: 4, text: 'Óculos', completed: false }
        ]
      },
      routine: {
        title: 'Rotina Diária',
        items: [
          { id: 1, text: 'Exercícios', completed: false },
          { id: 2, text: 'Meditação', completed: true },
          { id: 3, text: 'Leitura', completed: false },
          { id: 4, text: 'Estudos', completed: false }
        ]
      },
      notes: {
        title: 'Notas',
        items: [
          { id: 1, text: 'Reunião às 14h', completed: false },
          { id: 2, text: 'Ligar para o médico', completed: true },
          { id: 3, text: 'Comprar presente', completed: false }
        ]
      }
    };
    setLists(userLists);
  }, [getUserData]);

  // Salvar listas quando mudarem
  useEffect(() => {
    if (Object.keys(lists).length > 0) {
      setUserData('lists', lists);
    }
  }, [lists, setUserData]);

  const checklistItems = [
    {
      id: 'shopping',
      title: 'Lista de Compras',
      icon: '/shopping-cart.jpg',
      color: 'bg-blue-500'
    },
    {
      id: 'checklist',
      title: 'Checklist de Saída',
      icon: '/checklist.jpg',
      color: 'bg-green-500'
    },
    {
      id: 'routine',
      title: 'Rotina Diária',
      icon: '/routine.jpg',
      color: 'bg-purple-500'
    },
    {
      id: 'notes',
      title: 'Notas',
      icon: '/notes-icon.jpg',
      color: 'bg-orange-500'
    }
  ];

  const toggleItem = (listId, itemId) => {
    setLists(prev => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        items: prev[listId].items.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        )
      }
    }));
  };

  const addItem = (listId) => {
    if (newItemText.trim()) {
      const newItem = {
        id: Date.now(),
        text: newItemText.trim(),
        completed: false
      };
      setLists(prev => ({
        ...prev,
        [listId]: {
          ...prev[listId],
          items: [...prev[listId].items, newItem]
        }
      }));
      setNewItemText('');
    }
  };

  const deleteItem = (listId, itemId) => {
    setLists(prev => ({
      ...prev,
      [listId]: {
        ...prev[listId],
        items: prev[listId].items.filter(item => item.id !== itemId)
      }
    }));
  };

  const getProgress = (listId) => {
    const list = lists[listId];
    if (!list || !list.items) {
      return '0 de 0 concluídos';
    }
    const completed = list.items.filter(item => item.completed).length;
    return `${completed} de ${list.items.length} concluídos`;
  };

  if (selectedList) {
    const currentList = lists[selectedList];
    if (!currentList) {
      return (
        <div className="min-h-screen lofi-bg p-4">
          <div className="max-w-md mx-auto">
            <div className="text-center text-white">
              <p>Carregando lista...</p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen lofi-bg p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedList(null)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-white">{currentList.title}</h1>
            <div className="w-10"></div>
          </div>

          {/* Progress */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <p className="text-white/80 text-center">{getProgress(selectedList)}</p>
          </div>

          {/* Add new item */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Adicionar novo item..."
                className="flex-1 bg-white/20 text-white placeholder-white/60 rounded-lg px-3 py-2 border-none outline-none"
                onKeyPress={(e) => e.key === 'Enter' && addItem(selectedList)}
              />
              <button
                onClick={() => addItem(selectedList)}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Items list */}
          <div className="space-y-3">
            {currentList.items.map(item => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <button
                    onClick={() => toggleItem(selectedList, item.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      item.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-white/40 hover:border-white/60'
                    }`}
                  >
                    {item.completed && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </button>
                  <span
                    className={`text-white transition-all ${
                      item.completed ? 'line-through opacity-60' : ''
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteItem(selectedList, item.id)}
                  className="text-red-400 hover:text-red-300 p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lofi-bg p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white lofi-text mb-2">Check+</h1>
          <p className="text-white/80">Organize suas tarefas</p>
        </div>

        {/* Carousel */}
          <div className="lofi-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/study-girl.jpg" 
                alt="Estudando" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/coding-night.jpg" 
                alt="Programando" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <p className="text-white text-center text-sm">
            Mantenha suas tarefas organizadas e produtivas
          </p>
        </div>

        {/* Checklist Items */}
        <div className="space-y-4">
          {checklistItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSelectedList(item.id)}
              className="w-full lofi-card lofi-button rounded-xl p-4 flex items-center space-x-4 hover:bg-white/20 transition-all active:scale-95"
            >
              <div className={`w-16 h-16 ${item.color} rounded-xl flex items-center justify-center overflow-hidden`}>
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-white/60 text-sm">{getProgress(item.id)}</p>
              </div>
              <div className="text-white/40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChecklistScreen;

