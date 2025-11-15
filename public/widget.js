(function() {
  'use strict';

  // Configuración del widget
  const CONFIG = {
    API_URL: 'https://kunoro.com',
    VERSION: '1.0.0'
  };

  // Obtener el appId del script tag
  const currentScript = document.currentScript || 
    document.querySelector('script[data-app-id]');
  
  if (!currentScript) {
    console.error('[Kunoro Widget] No se encontró el script con data-app-id');
    return;
  }

  const APP_ID = currentScript.getAttribute('data-app-id');
  const API_URL = currentScript.getAttribute('data-api-url') || CONFIG.API_URL;

  if (!APP_ID) {
    console.error('[Kunoro Widget] Falta el atributo data-app-id en el script');
    return;
  }

  console.log(`[Kunoro Widget] Inicializando v${CONFIG.VERSION} para app: ${APP_ID}`);

  // Estilos del widget - Replicando el diseño original
  const styles = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes bounce {
      0%, 60%, 100% {
        transform: translateY(0);
      }
      30% {
        transform: translateY(-10px);
      }
    }

    #kunoro-chat-widget {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    #kunoro-chat-button {
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

    #kunoro-chat-button:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
      opacity: 0.9;
    }

    #kunoro-chat-button svg {
      width: 24px;
      height: 24px;
      stroke: white;
      fill: none;
      stroke-width: 2;
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
      transition: all 0.2s ease;
      border: 1px solid #e5e7eb;
      z-index: 999998;
    }

    #kunoro-chat-window.open {
      display: flex;
    }

    #kunoro-chat-window.minimized {
      height: 64px;
    }

    #kunoro-chat-window.open:not(.minimized) {
      height: 600px;
    }

    #kunoro-chat-header {
      background-color: #667eea;
      color: white;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;
    }

    #kunoro-chat-header-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    #kunoro-chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #667eea;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    #kunoro-chat-avatar svg {
      width: 20px;
      height: 20px;
      stroke: white;
      fill: none;
      stroke-width: 2;
    }

    #kunoro-chat-title {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      line-height: 1.2;
    }

    #kunoro-chat-status {
      font-size: 12px;
      display: flex;
      align-items: center;
      font-weight: 400;
      opacity: 0.8;
      margin-top: 2px;
    }

    .kunoro-status-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      margin-right: 6px;
    }

    #kunoro-chat-controls {
      display: flex;
      gap: 4px;
    }

    .kunoro-control-btn {
      padding: 8px;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      cursor: pointer;
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .kunoro-control-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .kunoro-control-btn svg {
      width: 16px;
      height: 16px;
      stroke: white;
      fill: none;
      stroke-width: 2;
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
      font-weight: 400;
      white-space: pre-wrap;
    }

    .kunoro-message.user .kunoro-message-content {
      background-color: #667eea;
      color: white;
    }

    .kunoro-message.bot .kunoro-message-content {
      background-color: #f3f4f6;
      color: #111827;
    }

    .kunoro-message-time {
      font-size: 11px;
      margin-top: 4px;
      font-weight: 500;
      opacity: 0.7;
    }

    .kunoro-message.user .kunoro-message-time {
      color: rgba(255, 255, 255, 0.8);
    }

    .kunoro-message.bot .kunoro-message-time {
      color: #6b7280;
    }

    .kunoro-typing {
      display: flex;
      justify-content: flex-start;
      animation: fadeIn 0.3s ease;
    }

    .kunoro-typing-content {
      background-color: #f3f4f6;
      color: #1f2937;
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

    .kunoro-typing-dot:nth-child(2) {
      animation-delay: 0.1s;
    }

    .kunoro-typing-dot:nth-child(3) {
      animation-delay: 0.2s;
    }

    #kunoro-chat-input-container {
      padding: 16px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }

    #kunoro-chat-input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }

    #kunoro-chat-input {
      flex: 1;
      padding: 12px 16px;
      font-size: 14.5px;
      font-weight: 400;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      resize: none;
      font-family: inherit;
    }

    #kunoro-chat-input::placeholder {
      color: #9ca3af;
      font-weight: 400;
    }

    #kunoro-chat-input:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }

    #kunoro-chat-send {
      width: auto;
      padding: 10px;
      border-radius: 8px;
      background-color: #667eea;
      border: none;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
      flex-shrink: 0;
    }

    #kunoro-chat-send:hover:not(:disabled) {
      opacity: 0.9;
    }

    #kunoro-chat-send:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    #kunoro-chat-send svg {
      width: 16px;
      height: 16px;
      stroke: white;
      fill: none;
      stroke-width: 2;
    }

    #kunoro-chat-footer {
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
      margin-top: 10px;
      font-weight: 400;
    }

    @media (max-width: 768px) {
      #kunoro-chat-window {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px) !important;
        right: 20px;
      }
      
      #kunoro-chat-window.minimized {
        height: 64px !important;
      }
    }
  `;

  // Inyectar estilos
  const styleTag = document.createElement('style');
  styleTag.textContent = styles;
  document.head.appendChild(styleTag);

  // SVG Icons
  const icons = {
    messageCircle: '<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    x: '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    minimize: '<svg viewBox="0 0 24 24"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>',
    send: '<svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>'
  };

  // HTML del widget
  const widgetHTML = `
    <div id="kunoro-chat-widget">
      <button id="kunoro-chat-button" aria-label="Abrir chat">
        ${icons.messageCircle}
      </button>
      
      <div id="kunoro-chat-window">
        <div id="kunoro-chat-header">
          <div id="kunoro-chat-header-info">
            <div id="kunoro-chat-avatar">
              ${icons.messageCircle}
            </div>
            <div>
              <h3 id="kunoro-chat-title">Bookforce</h3>
              <p id="kunoro-chat-status">
                <span class="kunoro-status-dot"></span>
                En línea
              </p>
            </div>
          </div>
          <div id="kunoro-chat-controls">
            <button class="kunoro-control-btn" id="kunoro-minimize-btn" aria-label="Minimizar">
              ${icons.minimize}
            </button>
            <button class="kunoro-control-btn" id="kunoro-close-btn" aria-label="Cerrar">
              ${icons.x}
            </button>
          </div>
        </div>
        
        <div id="kunoro-chat-messages"></div>
        
        <div id="kunoro-chat-input-container">
          <div id="kunoro-chat-input-wrapper">
            <input 
              type="text" 
              id="kunoro-chat-input" 
              placeholder="Escribe un mensaje..."
              aria-label="Mensaje de chat"
            />
            <button id="kunoro-chat-send" aria-label="Enviar mensaje">
              ${icons.send}
            </button>
          </div>
          <p id="kunoro-chat-footer">⚡ Powered by Bookforce</p>
        </div>
      </div>
    </div>
  `;

  // Crear e insertar el widget
  const widgetContainer = document.createElement('div');
  widgetContainer.innerHTML = widgetHTML;
  document.body.appendChild(widgetContainer);

  // Variables del estado
  let sessionId = null;
  let isOpen = false;
  let isMinimized = false;
  let isLoading = false;
  let messages = [];

  // Elementos del DOM
  const chatButton = document.getElementById('kunoro-chat-button');
  const chatWindow = document.getElementById('kunoro-chat-window');
  const chatMessages = document.getElementById('kunoro-chat-messages');
  const chatInput = document.getElementById('kunoro-chat-input');
  const chatSend = document.getElementById('kunoro-chat-send');
  const minimizeBtn = document.getElementById('kunoro-minimize-btn');
  const closeBtn = document.getElementById('kunoro-close-btn');

  // Funciones auxiliares
  function formatTime(date) {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function addMessage(content, isUser = false) {
    const message = {
      id: Date.now().toString(),
      role: isUser ? 'user' : 'assistant',
      content: content,
      timestamp: new Date()
    };

    messages.push(message);
    renderMessages();
  }

  function renderMessages() {
    chatMessages.innerHTML = '';
    
    messages.forEach(msg => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `kunoro-message ${msg.role}`;
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'kunoro-message-content';
      contentDiv.textContent = msg.content;
      
      const timeDiv = document.createElement('div');
      timeDiv.className = 'kunoro-message-time';
      timeDiv.textContent = formatTime(msg.timestamp);
      
      contentDiv.appendChild(timeDiv);
      messageDiv.appendChild(contentDiv);
      chatMessages.appendChild(messageDiv);
    });
    
    // Scroll al final
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'kunoro-typing';
    typingDiv.id = 'kunoro-typing';
    
    const content = document.createElement('div');
    content.className = 'kunoro-typing-content';
    content.innerHTML = '<div class="kunoro-typing-dot"></div><div class="kunoro-typing-dot"></div><div class="kunoro-typing-dot"></div>';
    
    typingDiv.appendChild(content);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTypingIndicator() {
    const typing = document.getElementById('kunoro-typing');
    if (typing) typing.remove();
  }

  async function sendMessage(message) {
    if (!message.trim() || isLoading) return;

    // Agregar mensaje del usuario
    addMessage(message, true);
    chatInput.value = '';
    
    isLoading = true;
    chatSend.disabled = true;
    showTypingIndicator();

    try {
      const response = await fetch(`${API_URL}/api/public/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appId: APP_ID,
          message: message,
          sessionId: sessionId,
          metadata: {
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        hideTypingIndicator();
        addMessage(data.data.message, false);
        
        // Guardar el sessionId
        if (data.data.sessionId) {
          sessionId = data.data.sessionId;
        }
      } else {
        hideTypingIndicator();
        addMessage('Lo siento, hubo un error. Por favor intenta de nuevo.', false);
      }
    } catch (error) {
      console.error('[Kunoro Widget] Error al enviar mensaje:', error);
      hideTypingIndicator();
      addMessage('No se pudo conectar con el servidor. Por favor verifica tu conexión.', false);
    } finally {
      isLoading = false;
      chatSend.disabled = false;
      chatInput.focus();
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    
    if (isOpen) {
      chatWindow.classList.add('open');
      chatWindow.classList.remove('minimized');
      chatButton.style.display = 'none';
      isMinimized = false;
      chatInput.focus();
      
      // Mensaje de bienvenida
      if (messages.length === 0) {
        addMessage('¡Hola! 👋\n\nEstás hablando con Bookforce. ¿En qué puedo ayudarte?', false);
      }
    } else {
      chatWindow.classList.remove('open');
      chatButton.style.display = 'flex';
    }
  }

  function toggleMinimize() {
    isMinimized = !isMinimized;
    if (isMinimized) {
      chatWindow.classList.add('minimized');
    } else {
      chatWindow.classList.remove('minimized');
      chatInput.focus();
    }
  }

  // Event listeners
  chatButton.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  minimizeBtn.addEventListener('click', toggleMinimize);
  
  chatSend.addEventListener('click', () => {
    sendMessage(chatInput.value);
  });
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput.value);
    }
  });

  // API pública del widget
  window.KunoroWidget = {
    open: () => {
      if (!isOpen) toggleChat();
    },
    close: () => {
      if (isOpen) toggleChat();
    },
    toggle: toggleChat,
    sendMessage: (message) => {
      if (!isOpen) toggleChat();
      setTimeout(() => sendMessage(message), 300);
    }
  };

  console.log('[Kunoro Widget] ✅ Widget cargado correctamente');
})();
