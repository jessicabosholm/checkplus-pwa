import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CalendarScreen = () => {
  const { getUserData, setUserData } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState({});
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    location: ''
  });

  // Carregar eventos do usuário
  useEffect(() => {
    const userEvents = getUserData('events') || {
      '2025-08-27': [
        { id: 1, title: 'Reunião de trabalho', time: '14:00', location: 'Escritório' },
        { id: 2, title: 'Consulta médica', time: '16:30', location: 'Clínica' }
      ],
      '2025-08-28': [
        { id: 3, title: 'Aniversário da Maria', time: '19:00', location: 'Casa' }
      ]
    };
    setEvents(userEvents);
  }, [getUserData]);

  // Salvar eventos quando mudarem
  useEffect(() => {
    if (Object.keys(events).length > 0) {
      setUserData('events', events);
    }
  }, [events, setUserData]);

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior (para preencher o início)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate.getDate(),
        isCurrentMonth: false,
        fullDate: prevDate
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      days.push({
        date: day,
        isCurrentMonth: true,
        fullDate: fullDate
      });
    }

    // Dias do próximo mês (para preencher o final)
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: day,
        isCurrentMonth: false,
        fullDate: nextDate
      });
    }

    return days;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const openModal = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setNewEvent({ title: '', time: '', location: '' });
  };

  const addEvent = () => {
    if (newEvent.title.trim() && selectedDate) {
      const dateKey = formatDateKey(selectedDate);
      const event = {
        id: Date.now(),
        ...newEvent
      };
      
      setEvents(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), event]
      }));
      
      closeModal();
    }
  };

  const deleteEvent = (dateKey, eventId) => {
    setEvents(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(event => event.id !== eventId)
    }));
  };

  const getEventsForDate = (date) => {
    const dateKey = formatDateKey(date);
    return events[dateKey] || [];
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen lofi-bg p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white lofi-text mb-2">Calendário</h1>
          <p className="text-white/80">Organize seus compromissos</p>
        </div>

        {/* Calendar Header */}
        <div className="lofi-card rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-white lofi-text">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-white/60 text-sm font-medium py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = getEventsForDate(day.fullDate);
              const hasEvents = dayEvents.length > 0;
              const todayClass = isToday(day.fullDate) ? 'bg-white/30 border-white' : '';
              
              return (
                <button
                  key={index}
                  onClick={() => openModal(day.fullDate)}
                  className={`
                    relative aspect-square p-1 rounded-lg transition-all hover:bg-white/20 active:scale-95
                    ${day.isCurrentMonth ? 'text-white' : 'text-white/40'}
                    ${todayClass}
                    ${hasEvents ? 'bg-white/10' : ''}
                  `}
                >
                  <span className="text-sm font-medium">{day.date}</span>
                  {hasEvents && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Today's Events */}
        <div className="lofi-card rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-white lofi-text mb-3">Hoje</h3>
          {getEventsForDate(new Date()).length > 0 ? (
            <div className="space-y-3">
              {getEventsForDate(new Date()).map(event => (
                <div key={event.id} className="bg-white/10 rounded-lg p-3">
                  <h4 className="text-white font-medium">{event.title}</h4>
                  <div className="flex items-center gap-4 mt-1 text-white/60 text-sm">
                    {event.time && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-center py-4">Nenhum compromisso para hoje</p>
          )}
        </div>

        {/* Modal */}
        {showModal && selectedDate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  {selectedDate.toLocaleDateString('pt-BR', { 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Existing Events */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-3">Compromissos</h3>
                {getEventsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-2">
                    {getEventsForDate(selectedDate).map(event => (
                      <div key={event.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{event.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-gray-600 text-sm">
                            {event.time && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{event.time}</span>
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteEvent(formatDateKey(selectedDate), event.id)}
                          className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum compromisso</p>
                )}
              </div>

              {/* Add New Event */}
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold text-gray-700 mb-3">Novo Compromisso</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título do compromisso..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Local (opcional)..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  onClick={addEvent}
                  disabled={!newEvent.title.trim()}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Compromisso
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarScreen;

