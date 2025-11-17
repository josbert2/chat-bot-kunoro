"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ScrollArea } from "@/components/ui/scroll-area";

type ConversationPreview = {
  id: string;
  status: 'open' | 'pending' | 'closed';
  lastMessageAt?: string | null;
  createdAt?: string | null;
  assignedUserId?: string | null;
  visitor: {
    id?: string | null;
    name?: string | null;
    email?: string | null;
  } | null;
  lastMessage: {
    content: string;
    senderType: 'visitor' | 'agent' | 'bot';
    createdAt?: string | null;
  } | null;
};

type ConversationMessage = {
  id: string;
  senderType: 'visitor' | 'agent' | 'bot';
  content: string;
  createdAt?: string | null;
  senderId?: string | null;
};

type InboxViewProps = {
  workspaceId: string | null;
  initialConversations: ConversationPreview[];
  initialSelectedConversationId?: string;
  initialMessages: ConversationMessage[];
};

const formatTime = (value?: string | null) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

const formatRelativeDate = (value?: string | null) => {
  if (!value) return '';
  try {
    return new Date(value).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

export function InboxView({
  workspaceId,
  initialConversations,
  initialSelectedConversationId,
  initialMessages,
}: InboxViewProps) {
  const [conversations, setConversations] = useState<ConversationPreview[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    initialSelectedConversationId ?? initialConversations[0]?.id ?? null,
  );
  const selectedConversationIdRef = useRef<string | null>(selectedConversationId);
  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationPreview | null>(() => {
    if (!initialSelectedConversationId) {
      return initialConversations[0] ?? null;
    }
    return initialConversations.find((conversation) => conversation.id === initialSelectedConversationId) ?? null;
  });
  const [messages, setMessages] = useState<ConversationMessage[]>(initialMessages);
  const [replyInput, setReplyInput] = useState('');
  const [isVisitorTyping, setIsVisitorTyping] = useState(false);
  const [visitorStatus, setVisitorStatus] = useState<'online' | 'offline'>('offline');
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const emptyState = conversations.length === 0;
  const socketRef = useRef<Socket | null>(null);
  const visitorTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const agentTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentConversationRoomRef = useRef<string | null>(null);

  const refreshConversations = useCallback(async () => {
    try {
      const response = await fetch('/api/inbox/conversations');
      if (!response.ok) {
        throw new Error('No se pudo actualizar la lista de conversaciones');
      }
      const data = await response.json();
      setConversations(data.conversations ?? []);
      if (!selectedConversationIdRef.current && data.conversations?.length) {
        setSelectedConversationId(data.conversations[0].id);
        setSelectedConversation(data.conversations[0]);
        selectedConversationIdRef.current = data.conversations[0].id;
      } else if (selectedConversationIdRef.current) {
        const updated = data.conversations?.find(
          (conversation: ConversationPreview) => conversation.id === selectedConversationIdRef.current,
        );
        setSelectedConversation(updated ?? null);
      }
    } catch (error) {
      console.error('[inbox:refresh]', error);
    }
  }, []);

  const handleSelectConversation = useCallback(async (conversationId: string) => {
    setErrorMessage(null);
    setSelectedConversationId(conversationId);
    selectedConversationIdRef.current = conversationId;
    setIsLoadingConversation(true);
    try {
      const response = await fetch(`/api/inbox/messages/${conversationId}`);
      if (!response.ok) {
        throw new Error('No se pudo cargar la conversación seleccionada');
      }
      const data = await response.json();
      setMessages(data.messages ?? []);
      setSelectedConversation(
        data.conversation ?? conversations.find((conversation) => conversation.id === conversationId) ?? null,
      );
      if (socketRef.current) {
        const targetRoom = `conversation:${conversationId}`;
        if (currentConversationRoomRef.current && currentConversationRoomRef.current !== targetRoom) {
          const [_, previousConversationId] = currentConversationRoomRef.current.split(':');
          if (previousConversationId) {
            socketRef.current.emit('presence', {
              conversationId: previousConversationId,
              sender: 'agent',
              status: 'offline',
            });
          }
          socketRef.current.emit('leave', currentConversationRoomRef.current);
        }
        socketRef.current.emit('join', targetRoom);
        socketRef.current.emit('presence', { conversationId, sender: 'agent', status: 'online' });
        currentConversationRoomRef.current = targetRoom;
      }
    } catch (error) {
      console.error('[inbox:select]', error);
      setErrorMessage('No pudimos cargar la conversación seleccionada.');
    } finally {
      setIsLoadingConversation(false);
    }
  }, []);

  const handleSendResponse = async () => {
    if (!replyInput.trim() || !selectedConversationId) return;
    setIsSending(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/inbox/messages/${selectedConversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: replyInput,
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'No se pudo enviar la respuesta');
      }
      const data = await response.json();
      setMessages(data.messages ?? []);
      setReplyInput('');
      await refreshConversations();
    } catch (error) {
      console.error('[inbox:send]', error);
      setErrorMessage((error as Error).message);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (!workspaceId) return;
    const socket: Socket = io({
      path: '/api/socket/io',
      withCredentials: true,
    });
    socketRef.current = socket;
    socket.emit('join', `account:${workspaceId}`);
    if (selectedConversationIdRef.current) {
      const initialRoom = `conversation:${selectedConversationIdRef.current}`;
      socket.emit('join', initialRoom);
      socket.emit('presence', {
        conversationId: selectedConversationIdRef.current,
        sender: 'agent',
        status: 'online',
      });
      currentConversationRoomRef.current = initialRoom;
    }

    const handleEvent = (event: any) => {
      console.log('[inbox:event] Received event:', event);
      
      if (event?.type === 'conversation:updated') {
        refreshConversations();
        if (event.conversationId && event.conversationId === selectedConversationIdRef.current) {
          handleSelectConversation(event.conversationId);
        }
      }
      
      if (event?.type === 'typing' && event.sender === 'visitor') {
        console.log('[inbox:event] Visitor typing event:', {
          conversationId: event.conversationId,
          currentConversation: selectedConversationIdRef.current,
          matches: event.conversationId === selectedConversationIdRef.current,
        });
        
        if (event.conversationId === selectedConversationIdRef.current) {
          if (event.status === 'stop') {
            setIsVisitorTyping(false);
            if (visitorTypingTimeoutRef.current) {
              clearTimeout(visitorTypingTimeoutRef.current);
            }
          } else {
            setIsVisitorTyping(true);
            if (visitorTypingTimeoutRef.current) {
              clearTimeout(visitorTypingTimeoutRef.current);
            }
            visitorTypingTimeoutRef.current = setTimeout(() => setIsVisitorTyping(false), 2000);
          }
        }
      }
      
      if (event?.type === 'presence' && event.sender === 'visitor' && event.conversationId === selectedConversationIdRef.current) {
        console.log('[inbox:event] Visitor presence:', event.status);
        setVisitorStatus(event.status === 'online' ? 'online' : 'offline');
      }
    };

    socket.on('event', handleEvent);

    return () => {
      if (currentConversationRoomRef.current) {
        const [_, previousConversationId] = currentConversationRoomRef.current.split(':');
        if (previousConversationId) {
          socket.emit('presence', {
            conversationId: previousConversationId,
            sender: 'agent',
            status: 'offline',
          });
        }
      }
      socket.off('event', handleEvent);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [workspaceId, refreshConversations, handleSelectConversation]);

  const handleAgentTyping = () => {
    if (!socketRef.current || !selectedConversationId) {
      console.log('[inbox:typing] Cannot emit typing:', {
        hasSocket: !!socketRef.current,
        hasConversationId: !!selectedConversationId,
      });
      return;
    }
    
    console.log('[inbox:typing] Emitting typing event for conversation:', selectedConversationId);
    socketRef.current.emit('typing', { 
      conversationId: selectedConversationId, 
      sender: 'agent',
      status: 'typing'
    });
    
    if (agentTypingTimeoutRef.current) {
      clearTimeout(agentTypingTimeoutRef.current);
    }
    
    agentTypingTimeoutRef.current = setTimeout(() => {
      console.log('[inbox:typing] Emitting stop typing');
      socketRef.current?.emit('typing', { 
        conversationId: selectedConversationId, 
        sender: 'agent', 
        status: 'stop' 
      });
    }, 1500);
  };

  const conversationTitle = useMemo(() => {
    if (!selectedConversation) return 'Selecciona una conversación';
    return selectedConversation.visitor?.name || selectedConversation.visitor?.email || 'Visitante sin nombre';
  }, [selectedConversation]);

  return (
    <div className="flex-1 grid grid-cols-[280px_minmax(0,1.6fr)_minmax(0,0.9fr)] gap-4">
      {/* Lista de conversaciones */}
      <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <header className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">Conversaciones</span>
          <button
            type="button"
            onClick={refreshConversations}
            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Actualizar
          </button>
        </header>
        <div className="px-3 py-2 border-b border-slate-800">
          <input
            className="w-full rounded-md bg-slate-950/60 border border-slate-800 px-2 py-1 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="Buscar por usuario o email (próximamente)"
            disabled
          />
        </div>
        <ScrollArea className="flex-1 text-xs">
          {emptyState ? (
            <div className="px-4 py-6 text-center text-slate-500 text-[12px]">
              Aún no hay conversaciones. Envía un mensaje desde el widget para comenzar.
            </div>
          ) : (
            <div>
              {conversations.map((conversation) => {
                const isActive = conversation.id === selectedConversationId;
                const snippet = conversation.lastMessage?.content ?? 'Sin mensajes aún';
                return (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`w-full text-left px-3 py-2 border-t border-slate-900/60 hover:bg-slate-800/70 ${
                      isActive ? 'bg-slate-800' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-slate-100">
                        {conversation.visitor?.name || conversation.visitor?.email || 'Visitante'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatTime(conversation.lastMessageAt ?? conversation.createdAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{snippet}</p>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </section>

      {/* Panel de mensajes */}
      <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <header className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-100">{conversationTitle}</span>
              {selectedConversation && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                    selectedConversation.status === 'closed'
                      ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                      : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  {selectedConversation.status}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  visitorStatus === 'online' ? 'bg-emerald-400' : 'bg-slate-500'
                }`}
              />
              {visitorStatus === 'online' ? 'Visitante conectado' : 'Visitante desconectado'}
            </div>
            {selectedConversation?.visitor?.email && (
              <p className="text-[11px] text-slate-400">{selectedConversation.visitor.email}</p>
            )}
          </div>
        </header>

        <ScrollArea className="flex-1 px-4 py-3 text-xs">
          <div className="space-y-3">
            {isLoadingConversation && (
              <div className="text-center text-slate-500 text-[11px]">Cargando conversación...</div>
            )}
            {!selectedConversation && !isLoadingConversation && (
              <div className="text-center text-slate-500 text-[11px]">Selecciona una conversación para ver los mensajes.</div>
            )}
            {selectedConversation &&
              !isLoadingConversation &&
              messages.map((message) => {
                const isVisitor = message.senderType === 'visitor';
                return (
                  <div key={message.id} className={`flex gap-2 ${isVisitor ? '' : 'justify-end'}`}>
                    {isVisitor && <div className="h-6 w-6 rounded-full bg-slate-700" />}
                    <div className={`max-w-[70%] ${isVisitor ? '' : 'text-right'}`}>
                      <p className="text-[11px] text-slate-400 mb-0.5">
                        {isVisitor ? 'Visitante' : message.senderType === 'bot' ? 'Bot' : 'Agente'} • {formatTime(message.createdAt)}
                      </p>
                      <div
                        className={`inline-block rounded-lg px-3 py-2 text-xs ${
                          isVisitor ? 'bg-slate-800 text-slate-50' : 'bg-blue-600 text-slate-50'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                    {!isVisitor && <div className="h-6 w-6 rounded-full bg-blue-500" />}
                  </div>
                );
              })}
            {isVisitorTyping && (
              <div className="text-[11px] text-slate-400 italic">El visitante está escribiendo…</div>
            )}
          </div>
        </ScrollArea>

        <footer className="border-t border-slate-800 px-3 py-2 flex flex-col gap-2 bg-slate-950/70">
          {errorMessage && (
            <p className="text-[11px] text-red-400 bg-red-900/30 border border-red-900/40 rounded-md px-2 py-1">{errorMessage}</p>
          )}
          <div className="flex items-end gap-2">
            <textarea
              rows={2}
              className="flex-1 resize-none rounded-md bg-slate-900 border border-slate-800 px-2 py-1.5 text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
              placeholder={selectedConversation ? 'Escribe una respuesta...' : 'Selecciona una conversación'}
              value={replyInput}
              onChange={(event) => {
                setReplyInput(event.target.value);
                handleAgentTyping();
              }}
              disabled={!selectedConversation || isSending}
            />
            <button
              onClick={handleSendResponse}
              disabled={!selectedConversation || !replyInput.trim() || isSending}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-medium text-slate-50 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </footer>
      </section>

      {/* Panel de detalles */}
      <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden text-xs">
        <header className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-100">Detalles</span>
          {selectedConversation?.status && (
            <span className="text-[10px] text-slate-500">{selectedConversation.status.toUpperCase()}</span>
          )}
        </header>
        {selectedConversation ? (
          <div className="p-3 space-y-3">
            <div>
              <p className="text-[11px] text-slate-400 mb-0.5">Usuario</p>
              <p className="text-xs font-medium text-slate-100">
                {selectedConversation.visitor?.name || 'Visitante sin nombre'}
              </p>
              <p className="text-[11px] text-slate-400">
                {selectedConversation.visitor?.email || 'Sin email registrado'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 mb-0.5">Conversación</p>
              <ul className="space-y-0.5 text-[11px] text-slate-300">
                <li>Último mensaje: {formatRelativeDate(selectedConversation.lastMessageAt)}</li>
                <li>Creada: {formatRelativeDate(selectedConversation.createdAt)}</li>
                <li>Asignada a: {selectedConversation.assignedUserId ?? 'Sin asignar'}</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-[11px] text-slate-500">Selecciona una conversación para ver los detalles.</div>
        )}
      </section>
    </div>
  );
}


