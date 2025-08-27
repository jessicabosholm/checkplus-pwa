import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PostitsScreen = () => {
  const { getUserData, setUserData } = useAuth();
  const [postits, setPostits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPostit, setEditingPostit] = useState(null);
  const [modalData, setModalData] = useState({
    title: '',
    subtitle: '',
    color: 'bg-yellow-300'
  });

  // Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const userPostits = getUserData('postits') || [
      {
        id: 1,
        title: 'Reunião',
        subtitle: 'Equipe às 14h',
        color: 'bg-yellow-300'
      },
      {
        id: 2,
        title: 'Compras',
        subtitle: 'Supermercado',
        color: 'bg-pink-300'
      },
      {
        id: 3,
        title: 'Estudar',
        subtitle: 'React Native',
        color: 'bg-blue-300'
      },
      {
        id: 4,
        title: 'Exercício',
        subtitle: 'Academia 18h',
        color: 'bg-green-300'
      }
    ];
    setPostits(userPostits);
  }, [getUserData]);

  // Salvar dados quando postits mudarem
  useEffect(() => {
    if (postits.length > 0) {
      setUserData('postits', postits);
    }
  }, [postits, setUserData]);

  const colors = [
    'bg-yellow-300',
    'bg-pink-300',
    'bg-blue-300',
    'bg-green-300',
    'bg-purple-300',
    'bg-orange-300',
    'bg-red-300',
    'bg-indigo-300'
  ];

  const openModal = (postit = null) => {
    if (postit) {
      setEditingPostit(postit.id);
      setModalData({
        title: postit.title,
        subtitle: postit.subtitle,
        color: postit.color
      });
    } else {
      setEditingPostit(null);
      setModalData({
        title: '',
        subtitle: '',
        color: 'bg-yellow-300'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPostit(null);
    setModalData({
      title: '',
      subtitle: '',
      color: 'bg-yellow-300'
    });
  };

  const savePostit = () => {
    if (modalData.title.trim()) {
      if (editingPostit) {
        // Editar post-it existente
        setPostits(prev => prev.map(postit =>
          postit.id === editingPostit
            ? { ...postit, ...modalData }
            : postit
        ));
      } else {
        // Adicionar novo post-it
        const newPostit = {
          id: Date.now(),
          ...modalData
        };
        setPostits(prev => [...prev, newPostit]);
      }
      closeModal();
    }
  };

  const deletePostit = (id) => {
    setPostits(prev => prev.filter(postit => postit.id !== id));
    closeModal();
  };

  return (
    <div className="min-h-screen lofi-bg p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white lofi-text mb-2">Post-its</h1>
          <p className="text-white/80">Suas anotações rápidas</p>
        </div>

        {/* Add button */}
        <button
          onClick={() => openModal()}
          className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 flex items-center justify-center space-x-2 hover:bg-white/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5 text-white" />
          <span className="text-white font-medium">Adicionar Post-it</span>
        </button>

        {/* Post-its Grid */}
        <div className="grid grid-cols-2 gap-4">
          {postits.map(postit => (
            <button
              key={postit.id}
              onClick={() => openModal(postit)}
              className={`${postit.color} rounded-xl p-4 shadow-lg hover:shadow-xl transition-all active:scale-95 text-left min-h-[120px] flex flex-col justify-between`}
            >
              <div>
                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2">
                  {postit.title}
                </h3>
                <p className="text-gray-600 text-xs line-clamp-3">
                  {postit.subtitle}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  {editingPostit ? 'Editar Post-it' : 'Novo Post-it'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Preview */}
              <div className={`${modalData.color} rounded-xl p-4 mb-4 min-h-[100px] flex flex-col justify-between`}>
                <div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    {modalData.title || 'Título do post-it'}
                  </h3>
                  <p className="text-gray-600 text-xs">
                    {modalData.subtitle || 'Subtítulo ou descrição'}
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={modalData.title}
                    onChange={(e) => setModalData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título..."
                    maxLength={30}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{modalData.title.length}/30</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtítulo
                  </label>
                  <textarea
                    value={modalData.subtitle}
                    onChange={(e) => setModalData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Digite o subtítulo..."
                    maxLength={60}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{modalData.subtitle.length}/60</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setModalData(prev => ({ ...prev, color }))}
                        className={`${color} w-12 h-12 rounded-lg border-2 transition-all ${
                          modalData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                {editingPostit && (
                  <button
                    onClick={() => deletePostit(editingPostit)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Excluir
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={savePostit}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostitsScreen;

