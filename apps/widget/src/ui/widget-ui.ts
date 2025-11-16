import { WidgetApiClient } from '../api/client';
import { WidgetConfig } from '@saas-chat/core-types';

interface WidgetUIOptions {
  siteKey: string;
  visitorId: string;
  apiClient: WidgetApiClient;
  config: Partial<WidgetConfig>;
}

export function initWidgetUI(options: WidgetUIOptions) {
  const { siteKey, visitorId, apiClient, config } = options;

  // Inyectar estilos
  injectStyles();

  // Crear HTML del widget
  createWidgetHTML();

  // Configurar event listeners
  setupEventListeners(apiClient, visitorId);

  console.log('[Widget UI] Inicializado con configuración:', config);
}

function injectStyles() {
  if (document.getElementById('saas-chat-widget-styles')) return;

  const styles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }

    #saas-chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    #saas-chat-button {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #667eea;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    #saas-chat-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
    }

    #saas-chat-window {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 380px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      z-index: 999998;
    }

    #saas-chat-window.open {
      display: flex;
      height: 600px;
      animation: fadeIn 0.3s ease;
    }

    #saas-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: white;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .saas-message {
      display: flex;
      animation: fadeIn 0.3s ease;
    }

    .saas-message.user {
      justify-content: flex-end;
    }

    .saas-message-content {
      max-width: 80%;
      border-radius: 18px;
      padding: 12px 16px;
      font-size: 14.5px;
      line-height: 1.45;
      white-space: pre-wrap;
    }

    .saas-message.user .saas-message-content {
      background-color: #667eea;
      color: white;
    }

    .saas-message.bot .saas-message-content {
      background-color: #f3f4f6;
      color: #111827;
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.id = 'saas-chat-widget-styles';
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
}

function createWidgetHTML() {
  if (document.getElementById('saas-chat-widget')) return;

  const widgetHTML = `
    <div id="saas-chat-widget">
      <button id="saas-chat-button" aria-label="Abrir chat">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      
      <div id="saas-chat-window">
        <div id="saas-chat-header" style="padding: 16px; border-bottom: 1px solid #e5e7eb; background: #0F172A; color: white;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 600;">SaaS Chat</h3>
              <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.8;">En línea</p>
            </div>
            <button id="saas-chat-close" style="background: none; border: none; color: white; cursor: pointer; padding: 4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div id="saas-chat-messages"></div>
        
        <div id="saas-chat-input-container" style="padding: 16px; border-top: 1px solid #e5e7eb;">
          <div style="display: flex; gap: 8px;">
            <input 
              type="text" 
              id="saas-chat-input" 
              placeholder="Escribe un mensaje..."
              style="flex: 1; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; outline: none;"
            />
            <button id="saas-chat-send" style="padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = widgetHTML;
  document.body.appendChild(container);
}

function setupEventListeners(apiClient: WidgetApiClient, visitorId: string) {
  const chatButton = document.getElementById('saas-chat-button');
  const chatWindow = document.getElementById('saas-chat-window');
  const chatClose = document.getElementById('saas-chat-close');
  const chatInput = document.getElementById('saas-chat-input') as HTMLInputElement;
  const chatSend = document.getElementById('saas-chat-send');
  const chatMessages = document.getElementById('saas-chat-messages');

  let isOpen = false;
  let conversationId: string | null = null;
  const messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }> = [];

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      chatWindow?.classList.add('open');
      chatButton!.style.display = 'none';
      chatInput?.focus();
      
      // Mensaje de bienvenida
      if (messages.length === 0) {
        addMessage('¡Hola! 👋\n\n¿En qué puedo ayudarte?', 'assistant');
      }
    } else {
      chatWindow?.classList.remove('open');
      chatButton!.style.display = 'flex';
    }
  }

  function addMessage(content: string, role: 'user' | 'assistant') {
    messages.push({ role, content, timestamp: new Date() });
    renderMessages();
  }

  function renderMessages() {
    if (!chatMessages) return;
    
    chatMessages.innerHTML = '';
    messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `saas-message ${msg.role}`;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'saas-message-content';
      contentDiv.textContent = msg.content;
      
      messageDiv.appendChild(contentDiv);
      chatMessages.appendChild(messageDiv);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function sendMessage() {
    const message = chatInput?.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatInput!.value = '';

    try {
      const response = await apiClient.sendMessage(conversationId || '', message);
      if (response.conversationId) {
        conversationId = response.conversationId;
      }
      addMessage(response.message || 'Mensaje enviado', 'assistant');
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Lo siento, hubo un error. Por favor intenta de nuevo.', 'assistant');
    }
  }

  chatButton?.addEventListener('click', toggleChat);
  chatClose?.addEventListener('click', toggleChat);
  chatSend?.addEventListener('click', sendMessage);
  chatInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // API pública del widget
  (window as any).SaasChatWidget = {
    open: () => { if (!isOpen) toggleChat(); },
    close: () => { if (isOpen) toggleChat(); },
    toggle: toggleChat,
  };
}

