# 🔐 Autenticación Bearer con Tokens API

Esta guía explica cómo usar tokens Bearer para autenticar requests a la API de Kunoro desde aplicaciones externas.

## 📖 Tabla de Contenidos

- [¿Qué son los tokens Bearer?](#qué-son-los-tokens-bearer)
- [Gestión de tokens](#gestión-de-tokens)
  - [Generar un token](#1-generar-un-token)
  - [Listar tokens](#2-listar-tokens)
  - [Revocar un token](#3-revocar-un-token)
- [Usando la API con tokens Bearer](#usando-la-api-con-tokens-bearer)
- [Endpoints disponibles](#endpoints-disponibles)
- [Ejemplos en diferentes lenguajes](#ejemplos-en-diferentes-lenguajes)
- [Scopes y permisos](#scopes-y-permisos)
- [Buenas prácticas de seguridad](#buenas-prácticas-de-seguridad)

---

## ¿Qué son los tokens Bearer?

Los tokens Bearer son credenciales que permiten autenticar requests HTTP a la API sin necesidad de cookies de sesión. Son ideales para:

- 🔌 Integraciones con aplicaciones externas
- 🤖 Automatizaciones y scripts
- 📱 Aplicaciones móviles
- 🔗 Webhooks y servicios backend-to-backend

---

## Gestión de Tokens

### 1. Generar un Token

Para generar un token, debes estar autenticado en el dashboard (con Better Auth).

#### Request

```bash
POST /api/tokens/generate
Content-Type: application/json
Cookie: better-auth.session_token=xxx

{
  "name": "Mi aplicación móvil",
  "scopes": ["chat:read", "chat:write"],
  "expiresInDays": 90
}
```

#### Parámetros

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | ✅ Sí | Nombre descriptivo del token |
| `scopes` | string[] | ❌ No | Array de permisos. Default: `["*"]` (todos) |
| `expiresInDays` | number | ❌ No | Días hasta expiración. `null` = sin expiración |

#### Response

```json
{
  "success": true,
  "message": "Token creado exitosamente",
  "data": {
    "id": "tok_a1b2c3d4e5f6",
    "name": "Mi aplicación móvil",
    "token": "kunoro_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "scopes": ["chat:read", "chat:write"],
    "expiresAt": "2025-02-15T10:30:00.000Z",
    "createdAt": "2024-11-15T10:30:00.000Z"
  },
  "warning": "⚠️ Guarda este token en un lugar seguro. No podrás verlo de nuevo por razones de seguridad."
}
```

⚠️ **IMPORTANTE**: El token completo solo se muestra una vez. Guárdalo de forma segura.

---

### 2. Listar Tokens

```bash
GET /api/tokens/list
Cookie: better-auth.session_token=xxx
```

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "tok_a1b2c3d4e5f6",
      "name": "Mi aplicación móvil",
      "tokenPreview": "kunoro_12345...abcdef",
      "lastUsedAt": "2024-11-14T15:20:00.000Z",
      "expiresAt": "2025-02-15T10:30:00.000Z",
      "isActive": true,
      "isExpired": false,
      "scopes": ["chat:read", "chat:write"],
      "createdAt": "2024-11-15T10:30:00.000Z"
    }
  ],
  "total": 1
}
```

---

### 3. Revocar un Token

```bash
DELETE /api/tokens/revoke
Content-Type: application/json
Cookie: better-auth.session_token=xxx

{
  "tokenId": "tok_a1b2c3d4e5f6"
}
```

#### Response

```json
{
  "success": true,
  "message": "Token revocado exitosamente",
  "data": {
    "id": "tok_a1b2c3d4e5f6",
    "name": "Mi aplicación móvil"
  }
}
```

---

## Usando la API con Tokens Bearer

Una vez que tengas un token, inclúyelo en el header `Authorization` de tus requests:

```
Authorization: Bearer kunoro_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

---

## Endpoints Disponibles

### 1. Obtener Información de Cuenta

```bash
GET /api/v1/account
Authorization: Bearer kunoro_xxx
```

**Response:**
```json
{
  "success": true,
  "data": {
    "account": {
      "id": "acc_123",
      "name": "Mi Empresa",
      "plan": "pro"
    },
    "user": {
      "id": "user_456",
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com"
    },
    "token": {
      "name": "Mi aplicación móvil",
      "scopes": ["*"]
    }
  }
}
```

---

### 2. Enviar Mensaje al Chatbot

```bash
POST /api/v1/chat/send
Authorization: Bearer kunoro_xxx
Content-Type: application/json

{
  "message": "¿Cómo puedo ayudarte?",
  "sessionId": "opcional-uuid-de-sesion"
}
```

**Requiere scope:** `chat:write` o `*`

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "¡Hola! Estoy aquí para ayudarte...",
    "sessionId": "uuid-de-sesion",
    "usage": {
      "promptTokens": 45,
      "completionTokens": 120,
      "totalTokens": 165
    }
  }
}
```

---

### 3. Listar Sitios

```bash
GET /api/v1/sites
Authorization: Bearer kunoro_xxx
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "site_789",
      "name": "Mi Sitio Web",
      "appId": "app_abc123",
      "domain": "https://miempresa.com",
      "widgetConfig": {
        "primaryColor": "#0066ff",
        "welcomeMessage": "¡Hola! ¿En qué podemos ayudarte?"
      },
      "createdAt": "2024-11-01T10:00:00.000Z",
      "widgetSnippet": "<script src=\"https://cdn.kunoro.com/widget.js\" data-app-id=\"app_abc123\"></script>"
    }
  ],
  "total": 1
}
```

---

## Ejemplos en Diferentes Lenguajes

### JavaScript / Node.js

```javascript
const API_TOKEN = 'kunoro_1234567890abcdef...';
const API_URL = 'https://tu-app.com';

// Ejemplo: Enviar mensaje al chatbot
async function sendMessage(message) {
  const response = await fetch(`${API_URL}/api/v1/chat/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Error en la API');
  }
  
  return data;
}

// Uso
sendMessage('Hola, necesito ayuda')
  .then(result => console.log(result.data.message))
  .catch(error => console.error(error));
```

---

### Python

```python
import requests

API_TOKEN = 'kunoro_1234567890abcdef...'
API_URL = 'https://tu-app.com'

def send_message(message):
    response = requests.post(
        f'{API_URL}/api/v1/chat/send',
        headers={
            'Authorization': f'Bearer {API_TOKEN}',
            'Content-Type': 'application/json',
        },
        json={'message': message}
    )
    
    response.raise_for_status()
    return response.json()

# Uso
result = send_message('Hola, necesito ayuda')
print(result['data']['message'])
```

---

### PHP

```php
<?php

$apiToken = 'kunoro_1234567890abcdef...';
$apiUrl = 'https://tu-app.com';

function sendMessage($message) {
    global $apiToken, $apiUrl;
    
    $ch = curl_init("$apiUrl/api/v1/chat/send");
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $apiToken",
        "Content-Type: application/json",
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'message' => $message
    ]));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        throw new Exception("Error en la API: $response");
    }
    
    return json_decode($response, true);
}

// Uso
$result = sendMessage('Hola, necesito ayuda');
echo $result['data']['message'];
```

---

### cURL

```bash
# Obtener información de cuenta
curl -X GET https://tu-app.com/api/v1/account \
  -H "Authorization: Bearer kunoro_1234567890abcdef..."

# Enviar mensaje al chatbot
curl -X POST https://tu-app.com/api/v1/chat/send \
  -H "Authorization: Bearer kunoro_1234567890abcdef..." \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola, necesito ayuda"}'

# Listar sitios
curl -X GET https://tu-app.com/api/v1/sites \
  -H "Authorization: Bearer kunoro_1234567890abcdef..."
```

---

## Scopes y Permisos

Los tokens pueden tener diferentes niveles de acceso mediante scopes:

| Scope | Descripción |
|-------|-------------|
| `*` | Acceso completo a todas las operaciones |
| `chat:read` | Leer historial de conversaciones |
| `chat:write` | Enviar mensajes y crear conversaciones |
| `sites:read` | Leer información de sitios |
| `sites:write` | Crear y modificar sitios |
| `account:read` | Leer información de la cuenta |

### Ejemplo con múltiples scopes

```json
{
  "name": "Mi app móvil",
  "scopes": ["chat:read", "chat:write", "account:read"],
  "expiresInDays": 90
}
```

---

## Buenas Prácticas de Seguridad

### ✅ Recomendaciones

1. **Nunca expongas tokens en código cliente**: Los tokens deben usarse solo en backend
2. **Usa diferentes tokens por aplicación**: Facilita la revocación selectiva
3. **Establece fechas de expiración**: Limita el impacto de tokens comprometidos
4. **Revisa tokens regularmente**: Elimina tokens que ya no uses
5. **Usa scopes mínimos**: Otorga solo los permisos necesarios
6. **Variables de entorno**: Guarda tokens en variables de entorno, no en código
7. **Monitorea uso**: Revisa `lastUsedAt` para detectar actividad sospechosa
8. **HTTPS obligatorio**: Siempre usa conexiones seguras

### ❌ Errores comunes

- ❌ Hardcodear tokens en código fuente
- ❌ Commitear tokens en repositorios Git
- ❌ Usar el mismo token para múltiples aplicaciones
- ❌ Tokens sin fecha de expiración en producción
- ❌ Compartir tokens por email o chat
- ❌ No revocar tokens de empleados que salen de la empresa

---

## Manejo de Errores

### Códigos de estado HTTP

| Código | Significado |
|--------|-------------|
| `200` | ✅ Operación exitosa |
| `201` | ✅ Recurso creado |
| `400` | ❌ Request inválido (datos faltantes o incorrectos) |
| `401` | ❌ No autenticado (token faltante o inválido) |
| `403` | ❌ Sin permisos (scope insuficiente) |
| `404` | ❌ Recurso no encontrado |
| `500` | ❌ Error interno del servidor |
| `503` | ❌ Servicio no disponible |

### Ejemplo de error

```json
{
  "error": "No autorizado",
  "message": "Token inválido o inactivo"
}
```

---

## Migraciones de Base de Datos

Para aplicar los cambios necesarios en la base de datos:

```bash
# Generar migración
npm run db:generate

# Aplicar migración
npm run db:push

# O usar Drizzle Studio
npm run db:studio
```

---

## Soporte

¿Tienes preguntas o problemas con la API?

- 📧 Email: soporte@kunoro.com
- 📚 Documentación: https://docs.kunoro.com
- 💬 Discord: https://discord.gg/kunoro

---

**Última actualización:** Noviembre 2024

