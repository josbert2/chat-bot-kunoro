import { WidgetApiClient } from '../api/client';
import { WidgetConfig, DEFAULT_COLORS, getTextColor } from '../utils/theme';

interface WidgetUIOptions {
  siteKey: string;
  visitorId: string;
  apiClient: WidgetApiClient;
  config: WidgetConfig;
}

export function initWidgetUI(options: WidgetUIOptions) {
  const { siteKey, visitorId, apiClient, config } = options;

  const colors = config.colors || DEFAULT_COLORS;
  const textColorBackground = getTextColor(colors.background);
  const textColorAction = getTextColor(colors.action);

  console.log('🎨 [Widget UI] Colores que se van a aplicar:', {
    colors,
    textColorBackground,
    textColorAction
  });

  // Inyectar estilos
  injectStyles(colors, textColorBackground, textColorAction);

  // Crear HTML del widget
  createWidgetHTML(colors, textColorBackground, textColorAction);

  // Configurar event listeners
  setupEventListeners(apiClient, visitorId, config);

  console.log('[Widget UI] Inicializado con configuración:', config);
}

function injectStyles(colors: { background: string; action: string }, textColorBackground: string, textColorAction: string) {
  if (document.getElementById('kunoro-widget-styles')) return;

  const styles = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }

    #kunoro-chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    #kunoro-chat-button {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: ${colors.action};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    #kunoro-chat-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
      opacity: 0.9;
    }

    #kunoro-chat-button svg {
      stroke: ${textColorAction};
    }

    #kunoro-chat-window {
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

    #kunoro-chat-window.open {
      display: flex;
      height: 600px;
      animation: fadeIn 0.3s ease;
    }

    #kunoro-chat-header {
      background-color: ${colors.background};
      color: ${textColorBackground};
      padding: 16px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    #kunoro-chat-header svg {
      stroke: ${textColorBackground};
    }

    #kunoro-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: white;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    #kunoro-chat-messages::-webkit-scrollbar {
      width: 6px;
    }

    #kunoro-chat-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    #kunoro-chat-messages::-webkit-scrollbar-thumb {
      background: #d1d5db;
      border-radius: 3px;
    }

    .kunoro-message {
      display: flex;
      animation: fadeIn 0.3s ease;
    }

    .kunoro-message.user {
      justify-content: flex-end;
    }

    .kunoro-message-content {
      max-width: 80%;
      border-radius: 18px;
      padding: 12px 16px;
      font-size: 14.5px;
      line-height: 1.45;
      white-space: pre-wrap;
    }

    .kunoro-message.user .kunoro-message-content {
      background-color: ${colors.action};
      color: ${textColorAction};
    }

    .kunoro-message.assistant .kunoro-message-content {
      background-color: #f3f4f6;
      color: #111827;
    }

    .kunoro-typing {
      display: flex;
      justify-content: flex-start;
      animation: fadeIn 0.3s ease;
    }

    .kunoro-typing-content {
      background-color: #f3f4f6;
      border-radius: 16px;
      padding: 12px 16px;
      display: flex;
      gap: 6px;
    }

    .kunoro-typing-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #9ca3af;
      animation: bounce 1.4s infinite;
    }

    .kunoro-typing-dot:nth-child(2) { animation-delay: 0.1s; }
    .kunoro-typing-dot:nth-child(3) { animation-delay: 0.2s; }

    #kunoro-chat-input {
      flex: 1;
      padding: 12px 16px;
      font-size: 14.5px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }

    #kunoro-chat-input:focus {
      border-color: ${colors.action};
      box-shadow: 0 0 0 2px ${colors.action}20;
    }

    #kunoro-chat-send {
      padding: 12px;
      background-color: ${colors.action};
      color: ${textColorAction};
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }

    #kunoro-chat-send:hover:not(:disabled) {
      opacity: 0.9;
    }

    #kunoro-chat-send:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    #kunoro-chat-send svg {
      stroke: ${textColorAction};
    }

    @media (max-width: 768px) {
      #kunoro-chat-window {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px) !important;
      }
    }
  `;

  const styleTag = document.createElement('style');
  styleTag.id = 'kunoro-widget-styles';
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);
}

function createWidgetHTML(colors: { background: string; action: string }, textColorBackground: string, textColorAction: string) {
  if (document.getElementById('kunoro-chat-widget')) return;

  const widgetHTML = `
    <div id="kunoro-chat-widget">
      <button id="kunoro-chat-button" aria-label="Abrir chat">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      
      <div id="kunoro-chat-window">
        <div id="kunoro-chat-header">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 600;">Kunoro</h3>
              <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.8;">En línea</p>
            </div>
            <button id="kunoro-chat-close" style="background: none; border: none; cursor: pointer; padding: 4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div id="kunoro-chat-messages"></div>
        
        <div style="padding: 16px; border-top: 1px solid #e5e7eb; background: white;">
          <div style="display: flex; gap: 8px;">
            <input 
              type="text" 
              id="kunoro-chat-input" 
              placeholder="Escribe un mensaje..."
            />
            <button id="kunoro-chat-send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p style="text-align: center; font-size: 11px; color: #9ca3af; margin-top: 10px;">⚡ Powered by Kunoro</p>
        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = widgetHTML;
  document.body.appendChild(container);
}

function setupEventListeners(apiClient: WidgetApiClient, visitorId: string, config: WidgetConfig) {
  const chatButton = document.getElementById('kunoro-chat-button');
  const chatWindow = document.getElementById('kunoro-chat-window');
  const chatClose = document.getElementById('kunoro-chat-close');
  const chatInput = document.getElementById('kunoro-chat-input') as HTMLInputElement;
  const chatSend = document.getElementById('kunoro-chat-send');
  const chatMessages = document.getElementById('kunoro-chat-messages');

  let isOpen = false;
  let conversationId: string | null = null;
  let isLoading = false;
  const messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }> = [];

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      chatWindow?.classList.add('open');
      chatButton!.style.display = 'none';
      chatInput?.focus();
      
      // Mensaje de bienvenida
      if (messages.length === 0) {
        const welcomeMsg = config.welcomeMessage || '¡Hola! 👋\n\n¿En qué puedo ayudarte hoy?';
        addMessage(welcomeMsg, 'assistant');
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
      messageDiv.className = `kunoro-message ${msg.role}`;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'kunoro-message-content';
      contentDiv.textContent = msg.content;
      
      messageDiv.appendChild(contentDiv);
      chatMessages.appendChild(messageDiv);
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    if (document.getElementById('kunoro-typing')) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'kunoro-typing';
    typingDiv.id = 'kunoro-typing';
    
    const content = document.createElement('div');
    content.className = 'kunoro-typing-content';
    content.innerHTML = '<div class="kunoro-typing-dot"></div><div class="kunoro-typing-dot"></div><div class="kunoro-typing-dot"></div>';
    
    typingDiv.appendChild(content);
    chatMessages?.appendChild(typingDiv);
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  function hideTypingIndicator() {
    const typing = document.getElementById('kunoro-typing');
    if (typing) typing.remove();
  }

  async function sendMessage() {
    const message = chatInput?.value.trim();
    if (!message || isLoading) return;

    addMessage(message, 'user');
    chatInput!.value = '';
    
    isLoading = true;
    if (chatSend) chatSend.setAttribute('disabled', 'true');
    showTypingIndicator();

    try {
      const response = await apiClient.sendMessage(conversationId || '', message);
      hideTypingIndicator();
      
      if (response.conversationId) {
        conversationId = response.conversationId;
      }
      
      addMessage(response.message || 'Mensaje recibido', 'assistant');
    } catch (error) {
      console.error('[Kunoro Widget] Error sending message:', error);
      hideTypingIndicator();
      addMessage('Lo siento, hubo un error. Por favor intenta de nuevo.', 'assistant');
    } finally {
      isLoading = false;
      if (chatSend) chatSend.removeAttribute('disabled');
      chatInput?.focus();
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
  (window as any).KunoroWidget = {
    open: () => { if (!isOpen) toggleChat(); },
    close: () => { if (isOpen) toggleChat(); },
    toggle: toggleChat,
    sendMessage: (msg: string) => {
      if (!isOpen) toggleChat();
      setTimeout(() => {
        if (chatInput) chatInput.value = msg;
        sendMessage();
      }, 300);
    },
  };
}

