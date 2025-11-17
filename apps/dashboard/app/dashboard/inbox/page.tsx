"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

type Conversation = {
  id: string;
  endUserId: string;
  endUserName: string;
  lastMessage: string;
  lastMessageAt: Date;
  unread: boolean;
  status: 'open' | 'resolved' | 'unassigned';
};

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  intent?: string; // Categoría del mensaje
};

// Categorías disponibles para mensajes
const MESSAGE_CATEGORIES = [
  { id: 'question', label: 'Pregunta', emoji: '❓', color: 'bg-blue-100 text-blue-700' },
  { id: 'issue', label: 'Problema', emoji: '⚠️', color: 'bg-red-100 text-red-700' },
  { id: 'feedback', label: 'Feedback', emoji: '💬', color: 'bg-purple-100 text-purple-700' },
  { id: 'sale', label: 'Venta', emoji: '💰', color: 'bg-green-100 text-green-700' },
  { id: 'support', label: 'Soporte', emoji: '🛠️', color: 'bg-orange-100 text-orange-700' },
  { id: 'other', label: 'Otro', emoji: '📋', color: 'bg-slate-100 text-slate-700' },
] as const;

export default function InboxPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeFilter = searchParams?.get('filter') || 'unassigned';
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("other"); // Categoría seleccionada
  const [showCategoryMenu, setShowCategoryMenu] = useState(false); // Mostrar menú de categorías
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal de confirmación
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null); // ID de conversación a eliminar

  // Conectar Socket.IO
  useEffect(() => {
    const socketInstance = io('http://localhost:3001');
    
    socketInstance.on('connect', () => {
      console.log('🔌 [SOCKET] Conectado al servidor');
    });

    socketInstance.on('new_conversation', (conversation: Conversation) => {
      console.log('📥 [SOCKET] Nueva conversación recibida:', conversation);
      setConversations(prev => [conversation, ...prev]);
    });

    socketInstance.on('new_message', (data: any) => {
      console.log('💬 [SOCKET] Nuevo mensaje recibido:', data);
      if (data.conversationId === selectedConversation) {
        setMessages(prev => [...prev, data.message]);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('🔌 [SOCKET] Desconectado del servidor');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [selectedConversation]);

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3001/v1/conversations", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📥 [Inbox] Datos recibidos:', data);
        
        // Asegurarse de que data es un array
        if (Array.isArray(data)) {
          setConversations(data);
        } else if (data.conversations && Array.isArray(data.conversations)) {
          setConversations(data.conversations);
        } else {
          console.warn('⚠️ [Inbox] Respuesta no es un array:', data);
          setConversations([]);
        }
      } else {
        console.error('❌ [Inbox] Error en respuesta:', response.status);
        setConversations([]);
      }
    } catch (error) {
      console.error("Error cargando conversaciones:", error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages(conversationId: string) {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch(`http://localhost:3001/v1/conversations/${conversationId}/messages`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('💬 [Inbox] Mensajes recibidos:', data);
        
        // Asegurarse de que data es un array
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else {
          console.warn('⚠️ [Inbox] Mensajes no es un array:', data);
          setMessages([]);
        }
      } else {
        console.error('❌ [Inbox] Error cargando mensajes:', response.status);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error cargando mensajes:", error);
      setMessages([]);
    }
  }

  function handleSelectConversation(conversationId: string) {
    setSelectedConversation(conversationId);
    loadMessages(conversationId);
  }

  async function updateConversationStatus(conversationId: string, status: 'open' | 'resolved' | 'unassigned') {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      console.log('🔄 [Inbox] Actualizando estado de conversación:', { conversationId, status });

      const response = await fetch(`http://localhost:3001/v1/conversations/${conversationId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        console.log('✅ [Inbox] Estado actualizado');
        
        // Actualizar el estado local de la conversación SIN recargar
        setConversations(prev => prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, status } 
            : conv
        ));
      } else {
        console.error('❌ [Inbox] Error actualizando estado:', await response.text());
      }
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  }

  function handleDeleteClick(conversationId: string) {
    setConversationToDelete(conversationId);
    setShowDeleteModal(true);
  }

  async function handleDeleteConfirm() {
    if (!conversationToDelete) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      console.log('🗑️ [Inbox] Eliminando conversación:', conversationToDelete);

      const response = await fetch(`http://localhost:3001/v1/conversations/${conversationToDelete}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('✅ [Inbox] Conversación eliminada');
        
        // Eliminar de la lista local
        setConversations(prev => prev.filter(conv => conv.id !== conversationToDelete));
        
        // Si era la conversación seleccionada, limpiar la selección
        if (selectedConversation === conversationToDelete) {
          setSelectedConversation(null);
          setMessages([]);
        }
        
        // Cerrar modal
        setShowDeleteModal(false);
        setConversationToDelete(null);
      } else {
        console.error('❌ [Inbox] Error eliminando conversación:', await response.text());
        alert('Error al eliminar la conversación');
      }
    } catch (error) {
      console.error("Error eliminando conversación:", error);
      alert('Error al eliminar la conversación');
    }
  }

  function handleDeleteCancel() {
    setShowDeleteModal(false);
    setConversationToDelete(null);
  }

  async function handleSendMessage() {
    if (!messageInput.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      console.log('📤 [Inbox] Enviando mensaje:', { 
        conversationId: selectedConversation, 
        content: messageInput,
        intent: selectedCategory 
      });

      const response = await fetch(`http://localhost:3001/v1/conversations/${selectedConversation}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageInput,
          role: "assistant", // El backend espera "role" con valor "user" o "assistant"
          intent: selectedCategory, // Enviar la categoría seleccionada
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [Inbox] Mensaje enviado:', data);
        setMessageInput("");
        setSelectedCategory("other"); // Reset a categoría por defecto
        loadMessages(selectedConversation);
      } else {
        const error = await response.text();
        console.error('❌ [Inbox] Error enviando mensaje:', response.status, error);
      }
    } catch (error) {
      console.error("❌ [Inbox] Error enviando mensaje:", error);
    }
  }

  async function handleSimulateConversation() {
    setIsSimulating(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const response = await fetch("http://localhost:3001/v1/simulator/conversation", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conversación simulada creada:', data);
      } else {
        console.error('❌ Error simulando conversación:', await response.text());
      }
    } catch (error) {
      console.error("Error simulando conversación:", error);
    } finally {
      setIsSimulating(false);
    }
  }

  const selectedConv = Array.isArray(conversations) 
    ? conversations.find(c => c.id === selectedConversation)
    : null;

  // Filtrar conversaciones según el filtro activo
  const filteredConversations = Array.isArray(conversations) 
    ? conversations.filter(conv => {
        if (activeFilter === 'unassigned') return conv.status === 'unassigned';
        if (activeFilter === 'open') return conv.status === 'open';
        if (activeFilter === 'resolved') return conv.status === 'resolved';
        return true;
      })
    : [];

  const filterLabels: Record<string, string> = {
    unassigned: 'Sin asignar',
    open: 'Abiertos',
    resolved: 'Resueltos'
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-slate-500">Cargando conversaciones...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
        <header className="pb-4 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              {filterLabels[activeFilter] || 'Bandeja de entrada'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {activeFilter === 'unassigned' && 'Conversaciones pendientes de asignar a un agente'}
              {activeFilter === 'open' && 'Conversaciones activas asignadas a ti'}
              {activeFilter === 'resolved' && 'Conversaciones cerradas y archivadas'}
            </p>
          </div>
          
          {/* Botón de simulación */}
          <button
            onClick={handleSimulateConversation}
            disabled={isSimulating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
          >
            {isSimulating ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Simulando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Simular conversación
              </>
            )}
          </button>
        </header>

        <div className="flex-1 grid grid-cols-[320px_1fr] gap-4 min-h-0">
        {/* Lista de conversaciones */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden">
          {/* Header de lista */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-900">Conversaciones</h2>
              <span className="text-xs text-slate-500">{filteredConversations.length}</span>
            </div>
            
            {/* Búsqueda */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Lista */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-900">No hay conversaciones</p>
                <p className="text-xs text-slate-500 mt-1">
                  {activeFilter === 'unassigned' && 'No hay conversaciones sin asignar'}
                  {activeFilter === 'open' && 'No hay conversaciones abiertas'}
                  {activeFilter === 'resolved' && 'No hay conversaciones resueltas'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                      selectedConversation === conv.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {conv.endUserName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-slate-900 truncate">{conv.endUserName}</p>
                            {conv.unread && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-red-500 text-white flex-shrink-0">
                                Nuevo
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium flex-shrink-0 ${
                              conv.status === 'unassigned' ? 'bg-amber-100 text-amber-700' :
                              conv.status === 'open' ? 'bg-green-100 text-green-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {conv.status === 'unassigned' && 'Sin asignar'}
                              {conv.status === 'open' && 'Abierta'}
                              {conv.status === 'resolved' && 'Resuelta'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 flex-shrink-0">
                        {new Date(conv.lastMessageAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{conv.lastMessage}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel de conversación */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Header de conversación */}
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                      {selectedConv?.endUserName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{selectedConv?.endUserName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-slate-500">En línea hace 5 min</p>
                        {selectedConv && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            selectedConv.status === 'unassigned' ? 'bg-amber-100 text-amber-700' :
                            selectedConv.status === 'open' ? 'bg-green-100 text-green-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {selectedConv.status === 'unassigned' && '⏳ Sin asignar'}
                            {selectedConv.status === 'open' && '✅ Abierta'}
                            {selectedConv.status === 'resolved' && '🎯 Resuelta'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Botón para asignar/abrir (solo si está sin asignar) */}
                    {selectedConv && selectedConv.status === 'unassigned' && (
                      <button
                        onClick={() => updateConversationStatus(selectedConv.id, 'open')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title="Asignar y abrir conversación"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Asignar</span>
                      </button>
                    )}
                    
                    {/* Botón para marcar como resuelta */}
                    {selectedConv && selectedConv.status !== 'resolved' && (
                      <button
                        onClick={() => updateConversationStatus(selectedConv.id, 'resolved')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        title="Marcar como resuelta"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Resolver</span>
                      </button>
                    )}
                    
                    {/* Botón para reabrir */}
                    {selectedConv && selectedConv.status === 'resolved' && (
                      <button
                        onClick={() => updateConversationStatus(selectedConv.id, 'open')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        title="Reabrir conversación"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Reabrir</span>
                      </button>
                    )}
                    
                    {/* Botón para eliminar conversación */}
                    {selectedConv && (
                      <button
                        onClick={() => handleDeleteClick(selectedConv.id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                        title="Eliminar conversación"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.map((msg) => {
                  const category = MESSAGE_CATEGORIES.find(c => c.id === msg.intent);
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.sender === 'agent'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-slate-900 border border-slate-200'
                        }`}
                      >
                        {/* Badge de categoría */}
                        {category && (
                          <div className="mb-1.5">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              msg.sender === 'agent' 
                                ? 'bg-blue-500 text-white' 
                                : category.color
                            }`}>
                              <span>{category.emoji}</span>
                              <span>{category.label}</span>
                            </span>
                          </div>
                        )}
                        
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[10px] mt-1 ${msg.sender === 'agent' ? 'text-blue-100' : 'text-slate-500'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input de mensaje */}
              <div className="p-4 border-t border-slate-200 bg-white space-y-3">
                {/* Selector de categoría */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Categoría:</span>
                  <div className="relative">
                    <button
                      onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    >
                      {MESSAGE_CATEGORIES.find(c => c.id === selectedCategory)?.emoji}
                      <span>{MESSAGE_CATEGORIES.find(c => c.id === selectedCategory)?.label}</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Menú desplegable */}
                    {showCategoryMenu && (
                      <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                        <div className="p-2 space-y-1">
                          {MESSAGE_CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => {
                                setSelectedCategory(cat.id);
                                setShowCategoryMenu(false);
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                                selectedCategory === cat.id
                                  ? cat.color
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span>{cat.emoji}</span>
                              <span>{cat.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Input y botón de envío */}
                <div className="flex items-end gap-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Escribe un mensaje..."
                      rows={3}
                      className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-900">Selecciona una conversación</p>
              <p className="text-xs text-slate-500 mt-1">
                Elige una conversación de la lista para ver los mensajes
              </p>
            </div>
          )}
          </div>
        </div>

        {/* Modal de confirmación para eliminar */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    ¿Eliminar conversación?
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Esta acción no se puede deshacer. Se eliminarán todos los mensajes de esta conversación permanentemente.
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Eliminar conversación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

