# 🚀 Ejemplos Prácticos de Uso de la API

Esta guía contiene ejemplos completos y funcionales para diferentes casos de uso.

## 📋 Índice

1. [Chatbot en una web externa](#1-chatbot-en-una-web-externa)
2. [Integración con aplicación móvil](#2-integración-con-aplicación-móvil)
3. [Webhook processor](#3-webhook-processor)
4. [Script de automatización](#4-script-de-automatización)
5. [Cliente SDK completo](#5-cliente-sdk-completo)

---

## 1. Chatbot en una Web Externa

### Frontend (React/Next.js)

```typescript
// components/KunoroChat.tsx
'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function KunoroChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Llamar a tu backend (NO exponer el token en frontend)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.data.message
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="message assistant">Escribiendo...</div>}
      </div>
      
      <div className="input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}
```

### Backend (API Route de Next.js)

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

const KUNORO_API_TOKEN = process.env.KUNORO_API_TOKEN!;
const KUNORO_API_URL = process.env.KUNORO_API_URL || 'https://tu-app.com';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Llamar a la API de Kunoro con el token Bearer
    const response = await fetch(`${KUNORO_API_URL}/api/v1/chat/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KUNORO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al procesar mensaje' },
      { status: 500 }
    );
  }
}
```

### Variables de entorno

```bash
# .env.local
KUNORO_API_TOKEN=kunoro_1234567890abcdef...
KUNORO_API_URL=https://tu-app.com
```

---

## 2. Integración con Aplicación Móvil

### React Native

```typescript
// services/KunoroAPI.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://tu-app.com';
const API_TOKEN = 'kunoro_1234567890abcdef...'; // En producción, obtener de forma segura

class KunoroAPI {
  private sessionId: string | null = null;

  async initialize() {
    // Recuperar sessionId guardada o crear una nueva
    this.sessionId = await AsyncStorage.getItem('kunoro_session_id');
    if (!this.sessionId) {
      this.sessionId = this.generateUUID();
      await AsyncStorage.setItem('kunoro_session_id', this.sessionId);
    }
  }

  async sendMessage(message: string) {
    try {
      const response = await fetch(`${API_URL}/api/v1/chat/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId: this.sessionId,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      throw error;
    }
  }

  async getAccountInfo() {
    try {
      const response = await fetch(`${API_URL}/api/v1/account`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo info de cuenta:', error);
      throw error;
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export default new KunoroAPI();
```

### Uso en componente

```typescript
// screens/ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import KunoroAPI from '../services/KunoroAPI';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    KunoroAPI.initialize();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await KunoroAPI.sendMessage(input);
      
      if (response.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.data.message
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {messages.map((msg, i) => (
          <View key={i} style={{ padding: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>
              {msg.role === 'user' ? 'Tú' : 'Asistente'}
            </Text>
            <Text>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>
      
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1, borderWidth: 1, padding: 10 }}
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </View>
  );
}
```

---

## 3. Webhook Processor

### Express.js Server

```javascript
// server.js
const express = require('express');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());

const KUNORO_API_TOKEN = process.env.KUNORO_API_TOKEN;
const KUNORO_API_URL = process.env.KUNORO_API_URL;

// Webhook que recibe eventos y envía mensaje al chatbot de Kunoro
app.post('/webhook/new-order', async (req, res) => {
  try {
    const { orderId, customerName, amount } = req.body;

    // Construir mensaje
    const message = `Nueva orden #${orderId} de ${customerName} por $${amount}. ¿Debo enviar confirmación?`;

    // Enviar a Kunoro
    const response = await fetch(`${KUNORO_API_URL}/api/v1/chat/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KUNORO_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId: `order-${orderId}`,
      }),
    });

    const data = await response.json();

    res.json({ success: true, response: data.data.message });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Webhook server escuchando en puerto 3001');
});
```

---

## 4. Script de Automatización

### Python Script

```python
#!/usr/bin/env python3
"""
Script para procesar mensajes en batch desde un archivo CSV
"""

import csv
import requests
import time
from typing import List, Dict

API_TOKEN = 'kunoro_1234567890abcdef...'
API_URL = 'https://tu-app.com'

class KunoroClient:
    def __init__(self, token: str, base_url: str):
        self.token = token
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        })
    
    def send_message(self, message: str, session_id: str = None) -> Dict:
        """Envía un mensaje al chatbot"""
        response = self.session.post(
            f'{self.base_url}/api/v1/chat/send',
            json={
                'message': message,
                'sessionId': session_id
            }
        )
        response.raise_for_status()
        return response.json()
    
    def get_account_info(self) -> Dict:
        """Obtiene información de la cuenta"""
        response = self.session.get(f'{self.base_url}/api/v1/account')
        response.raise_for_status()
        return response.json()

def process_messages_from_csv(filename: str):
    """Procesa mensajes desde un archivo CSV"""
    client = KunoroClient(API_TOKEN, API_URL)
    
    # Verificar conexión
    print("Verificando conexión...")
    account_info = client.get_account_info()
    print(f"✓ Conectado a cuenta: {account_info['data']['account']['name']}")
    
    # Procesar mensajes
    with open(filename, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for i, row in enumerate(reader, 1):
            message = row['message']
            session_id = row.get('session_id', f'batch-{i}')
            
            print(f"\n[{i}] Procesando: {message[:50]}...")
            
            try:
                result = client.send_message(message, session_id)
                response = result['data']['message']
                print(f"✓ Respuesta: {response[:100]}...")
                
                # Rate limiting
                time.sleep(1)
                
            except Exception as e:
                print(f"✗ Error: {e}")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Uso: python process_messages.py mensajes.csv")
        sys.exit(1)
    
    process_messages_from_csv(sys.argv[1])
```

### Archivo CSV de ejemplo (mensajes.csv)

```csv
message,session_id
"¿Cuáles son los horarios de atención?",session-001
"Necesito ayuda con una devolución",session-002
"¿Tienen envío internacional?",session-003
```

---

## 5. Cliente SDK Completo

### TypeScript SDK

```typescript
// kunoro-sdk.ts

export interface KunoroConfig {
  apiToken: string;
  baseUrl?: string;
}

export interface ChatMessage {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  success: boolean;
  data: {
    message: string;
    sessionId: string | null;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
}

export interface AccountInfo {
  success: boolean;
  data: {
    account: {
      id: string;
      name: string;
      plan: string;
    };
    user: {
      id: string;
      name: string;
      email: string;
    };
    token: {
      name: string;
      scopes: string[];
    };
  };
}

export interface Site {
  id: string;
  name: string;
  appId: string;
  domain: string;
  widgetConfig: any;
  createdAt: string;
  widgetSnippet: string;
}

export class KunoroClient {
  private apiToken: string;
  private baseUrl: string;

  constructor(config: KunoroConfig) {
    this.apiToken = config.apiToken;
    this.baseUrl = config.baseUrl || 'https://tu-app.com';
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error en la API');
    }

    return response.json();
  }

  // Chat methods
  async sendMessage(message: string, sessionId?: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/v1/chat/send', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    });
  }

  // Account methods
  async getAccount(): Promise<AccountInfo> {
    return this.request<AccountInfo>('/api/v1/account');
  }

  // Sites methods
  async getSites(): Promise<{ success: boolean; data: Site[]; total: number }> {
    return this.request('/api/v1/sites');
  }

  // Utility methods
  async healthCheck(): Promise<boolean> {
    try {
      await this.getAccount();
      return true;
    } catch {
      return false;
    }
  }
}

// Export función helper para crear cliente
export function createKunoroClient(config: KunoroConfig): KunoroClient {
  return new KunoroClient(config);
}
```

### Uso del SDK

```typescript
// ejemplo-uso.ts
import { createKunoroClient } from './kunoro-sdk';

const client = createKunoroClient({
  apiToken: process.env.KUNORO_API_TOKEN!,
  baseUrl: 'https://tu-app.com',
});

async function main() {
  // Verificar conexión
  const isHealthy = await client.healthCheck();
  console.log('API disponible:', isHealthy);

  // Obtener info de cuenta
  const account = await client.getAccount();
  console.log('Cuenta:', account.data.account.name);

  // Enviar mensaje
  const response = await client.sendMessage('Hola, ¿cómo estás?');
  console.log('Respuesta:', response.data.message);

  // Listar sitios
  const sites = await client.getSites();
  console.log(`Total sitios: ${sites.total}`);
  sites.data.forEach(site => {
    console.log(`- ${site.name} (${site.domain})`);
  });
}

main().catch(console.error);
```

---

## 🔧 Testing

### Jest Test Suite

```typescript
// kunoro-sdk.test.ts
import { KunoroClient } from './kunoro-sdk';

describe('KunoroClient', () => {
  let client: KunoroClient;

  beforeAll(() => {
    client = new KunoroClient({
      apiToken: process.env.KUNORO_API_TOKEN!,
      baseUrl: process.env.KUNORO_API_URL,
    });
  });

  test('should get account info', async () => {
    const account = await client.getAccount();
    expect(account.success).toBe(true);
    expect(account.data.account).toHaveProperty('id');
    expect(account.data.account).toHaveProperty('name');
  });

  test('should send message and get response', async () => {
    const response = await client.sendMessage('Test message');
    expect(response.success).toBe(true);
    expect(response.data).toHaveProperty('message');
    expect(response.data.message).toBeTruthy();
  });

  test('should list sites', async () => {
    const sites = await client.getSites();
    expect(sites.success).toBe(true);
    expect(Array.isArray(sites.data)).toBe(true);
  });

  test('should pass health check', async () => {
    const isHealthy = await client.healthCheck();
    expect(isHealthy).toBe(true);
  });
});
```

---

## 📚 Recursos Adicionales

- [Documentación completa de Bearer Tokens](./API_BEARER_TOKENS.md)
- [Plan del producto](./plan.md)
- [Configuración de base de datos](./DATABASE.md)

---

**¿Necesitas más ejemplos?** Abre un issue en GitHub o contacta a soporte@kunoro.com

