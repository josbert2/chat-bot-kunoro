'use client';

import { useState, useRef, useEffect, useMemo, CSSProperties } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import {
  WidgetColors,
  getDefaultWidgetColors,
  isDarkHexColor,
} from '@/lib/widget-config';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type ChatWidgetProps = {
  appId?: string | null;
  initialColors?: WidgetColors;
};

export default function ChatWidget({ appId, initialColors }: ChatWidgetProps) {
  const initial = useMemo(
    () => initialColors ?? getDefaultWidgetColors(),
    [initialColors?.background, initialColors?.action],
  );

  const [colors, setColors] = useState<WidgetColors>(initial);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! 👋\n\nEstás hablando con Bookforce. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setColors(initial);
  }, [initial.background, initial.action]);

  useEffect(() => {
    if (!appId) return;
    let cancelled = false;

    async function fetchConfig() {
      try {
        const response = await fetch(`/api/widget/config/${appId}`);
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && data?.config?.colors) {
          setColors(data.config.colors as WidgetColors);
        }
      } catch {
        // swallow errors for demo widget
      }
    }

    fetchConfig();
    const interval = setInterval(fetchConfig, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [appId]);

  const isHeaderDark = isDarkHexColor(colors.background);
  const actionButtonStyle = useMemo<CSSProperties>(
    () => ({
      backgroundColor: colors.action,
      color: '#FFFFFF',
    }),
    [colors.action],
  );
  const headerStyle = useMemo<CSSProperties>(
    () => ({
      backgroundColor: colors.background,
    }),
    [colors.background],
  );
  const ringStyle = useMemo<CSSProperties>(
    () =>
      ({
        '--tw-ring-color': colors.action,
      }) as CSSProperties,
    [colors.action],
  );
  const headerTitleClass = isHeaderDark ? 'text-white' : 'text-slate-900';
  const headerSubtitleClass = isHeaderDark ? 'text-white/80' : 'text-gray-500';
  const headerButtonClass = isHeaderDark
    ? 'p-2 rounded-md transition-colors text-white/80 hover:bg-white/10'
    : 'p-2 rounded-md transition-colors text-gray-600 hover:bg-gray-100';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-5 right-5 w-14 h-14 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:scale-105 hover:opacity-90 z-50"
          aria-label="Abrir chat"
          style={actionButtonStyle}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-5 right-5 w-[380px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden transition-all duration-200 z-50 border border-gray-200 ${
            isMinimized ? 'h-16' : 'h-[600px]'
          }`}
        >
          {/* Header */}
          <div
            className="border-b border-gray-200 p-4 flex items-center justify-between"
            style={headerStyle}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={actionButtonStyle}
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`font-bold text-[15px] ${headerTitleClass}`}>Bookforce</h3>
                <p className={`text-[12px] flex items-center font-normal ${headerSubtitleClass}`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                  En línea
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleMinimize}
                className={headerButtonClass}
                aria-label="Minimizar"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChat}
                className={headerButtonClass}
                aria-label="Cerrar chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-white">
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div
                        className={`max-w-[80%] rounded-[18px] px-4 py-3 ${
                          isUser ? 'text-white' : 'bg-gray-100 text-gray-900'
                        }`}
                        style={isUser ? { backgroundColor: colors.action } : undefined}
                      >
                        <p className="text-[14.5px] leading-[1.45] font-normal whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p
                          className={`text-[11px] mt-1 font-medium opacity-70 ${
                            isUser ? 'text-white/80' : 'text-gray-600'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-3 text-[14.5px] font-normal border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none placeholder:text-gray-400 placeholder:font-normal"
                    disabled={isLoading}
                    style={ringStyle}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="text-white p-2.5 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 hover:opacity-90"
                    style={actionButtonStyle}
                    aria-label="Enviar mensaje"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-2.5 text-center font-normal">
                  ⚡ Powered by Bookforce
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
