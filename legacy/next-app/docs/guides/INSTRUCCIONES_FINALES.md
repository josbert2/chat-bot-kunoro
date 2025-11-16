# 🚀 Instrucciones Finales - Sistema de Tokens Bearer

## ✅ ¡Implementación Completa!

El sistema de tokens Bearer ha sido **completamente implementado**. Aquí están los pasos finales para ponerlo en funcionamiento.

---

## 📋 Pasos para Activar

### 1️⃣ Aplicar Migración de Base de Datos

```bash
cd /home/jos/josbert.dev/chat-bot-kunoro

# Generar migración
npm run db:generate

# Cuando te pregunte sobre la tabla 'account', selecciona:
# → "+ account - create table"

# Luego aplicar la migración
npm run db:push
```

### 2️⃣ Verificar que Todo Está en Orden

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Abrir Drizzle Studio para ver las tablas
npm run db:studio
```

### 3️⃣ Generar tu Primer Token

#### Opción A: Desde el Dashboard (Recomendado) ✨

1. Ve a `http://localhost:3000/dashboard`
2. Inicia sesión si aún no lo has hecho
3. Click en el ícono de ⚙️ **Configuración** en la barra lateral
4. En el menú lateral, click en **🔐 Tokens API**
5. Click en el botón **"➕ Generar Token"**
6. Completa el formulario:
   - **Nombre**: Un nombre descriptivo (ej: "Mi App Móvil")
   - **Permisos**: Selecciona los scopes necesarios o deja "*" para acceso completo
   - **Expira en**: Días hasta expiración (opcional)
7. Click en **"Generar Token"**
8. **¡Importante!** Copia el token que aparece (solo se muestra una vez)

#### Opción B: Usando cURL (después de autenticarte)

```bash
# Paso 1: Iniciar sesión (guarda cookies)
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email": "tu@email.com", "password": "tupassword"}' \
  -c cookies.txt

# Paso 2: Generar token
curl -X POST http://localhost:3000/api/tokens/generate \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Mi primer token",
    "scopes": ["*"],
    "expiresInDays": 90
  }' | jq .

# Guardar el token que te devuelve (solo se muestra una vez!)
```

---

### 4️⃣ Probar el Token

#### Opción A: Interfaz Web de Prueba (Recomendado) 🎨

**Usando el servidor de pruebas incluido:**

```bash
# Terminal 1: Servidor principal (API)
npm run dev

# Terminal 2: Servidor de pruebas (en otra terminal)
npm run test-api

# Abre tu navegador en:
# http://localhost:8888
```

**O abre el archivo directamente:**

```bash
open test-api.html
# O con navegador específico
firefox test-api.html
google-chrome test-api.html
```

**Características de la interfaz de prueba:**
- ✅ Interfaz visual atractiva y fácil de usar
- ✅ Guarda el token en localStorage
- ✅ Prueba todos los endpoints con un clic
- ✅ Chat interactivo en tiempo real
- ✅ Logs de todas las peticiones
- ✅ Indicadores de conexión

**Pasos en la interfaz:**
1. Pega tu token Bearer en el campo
2. Haz clic en "💾 Guardar Token"
3. Haz clic en "🔌 Probar Conexión"
4. Prueba los diferentes endpoints
5. Envía mensajes al chatbot

#### Opción B: Usando cURL

```bash
# Guardar token en variable
export KUNORO_TOKEN="kunoro_xxx..." # El que obtuviste en el paso 3

# Probar endpoint de cuenta
curl -H "Authorization: Bearer $KUNORO_TOKEN" \
  http://localhost:3000/api/v1/account | jq .

# Probar endpoint de chat
curl -X POST \
  -H "Authorization: Bearer $KUNORO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola, ¿cómo estás?"}' \
  http://localhost:3000/api/v1/chat/send | jq .

# Listar sitios
curl -H "Authorization: Bearer $KUNORO_TOKEN" \
  http://localhost:3000/api/v1/sites | jq .
```

---

## 📁 Archivos Creados/Modificados

### ✅ Base de Datos
- `db/schema.ts` - Agregada tabla `api_tokens`

### ✅ Autenticación
- `lib/bearer-auth.ts` - Middleware completo para Bearer tokens

### ✅ API de Gestión de Tokens
- `app/api/tokens/generate/route.ts` - Crear tokens
- `app/api/tokens/list/route.ts` - Listar tokens
- `app/api/tokens/revoke/route.ts` - Revocar tokens

### ✅ API Pública (v1)
- `app/api/v1/account/route.ts` - Info de cuenta
- `app/api/v1/chat/send/route.ts` - Enviar mensajes
- `app/api/v1/sites/route.ts` - Listar sitios

### ✅ Documentación
- `API_BEARER_TOKENS.md` - Guía completa (400+ líneas)
- `EJEMPLOS_API.md` - Ejemplos de código (500+ líneas)
- `QUICK_START_API.md` - Inicio rápido
- `IMPLEMENTACION_BEARER_TOKENS.md` - Resumen técnico
- `INSTRUCCIONES_FINALES.md` - Este archivo
- `README.md` - Actualizado
- `DATABASE.md` - Actualizado
- `test-api.html` - Interfaz de prueba interactiva 🎨
- `COMO_PROBAR.md` - Guía completa de pruebas
- `TEST_SERVER_README.md` - Documentación del servidor de pruebas

### ✅ UI del Dashboard
- `app/dashboard/settings/api-tokens/page.tsx` - Página de gestión de tokens
- `components/GenerateTokenButton.tsx` - Botón para generar tokens
- `components/GenerateTokenModal.tsx` - Modal con formulario completo
- `components/TokensList.tsx` - Lista interactiva de tokens
- `components/SettingsSubSidebar.tsx` - Navegación actualizada

---

## 🎯 Casos de Uso

### 1. Integrar con tu App Web/Móvil

```typescript
// En tu proyecto externo
const response = await fetch('http://localhost:3000/api/v1/chat/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer kunoro_xxx...',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message: 'Hola' })
});

const data = await response.json();
console.log(data.data.message);
```

### 2. Script de Automatización

```python
import requests

response = requests.post(
    'http://localhost:3000/api/v1/chat/send',
    headers={'Authorization': 'Bearer kunoro_xxx...'},
    json={'message': 'Pregunta automática'}
)

print(response.json()['data']['message'])
```

### 3. Webhook Processor

```javascript
// server.js - Express
app.post('/webhook', async (req, res) => {
  const result = await fetch('http://localhost:3000/api/v1/chat/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.KUNORO_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: req.body.question })
  });
  
  const data = await result.json();
  res.json(data);
});
```

---

## 📚 Documentación Disponible

1. **[API_BEARER_TOKENS.md](./API_BEARER_TOKENS.md)**
   - Guía completa de autenticación
   - Todos los endpoints documentados
   - Ejemplos en cURL, JS, Python, PHP
   - Scopes y permisos
   - Seguridad y buenas prácticas

2. **[EJEMPLOS_API.md](./EJEMPLOS_API.md)**
   - 5 ejemplos completos de integración
   - SDK TypeScript completo
   - Suite de tests
   - Casos de uso reales

3. **[QUICK_START_API.md](./QUICK_START_API.md)**
   - Inicio en 5 minutos
   - Troubleshooting
   - Quick reference

4. **[IMPLEMENTACION_BEARER_TOKENS.md](./IMPLEMENTACION_BEARER_TOKENS.md)**
   - Resumen técnico
   - Arquitectura
   - Próximos pasos sugeridos

---

## 🔧 Próximos Pasos Opcionales

### 1. Crear UI en el Dashboard

Crea una página en `/dashboard/settings/api-tokens` con:
- Tabla de tokens existentes
- Formulario para crear tokens
- Botón para revocar tokens
- Copiar token al clipboard

### 2. Agregar Rate Limiting

```typescript
// lib/rate-limiter.ts
import { Redis } from '@upstash/redis';

export async function checkRateLimit(
  tokenId: string,
  limit: number = 100
): Promise<boolean> {
  // Implementar limitación de requests
}
```

### 3. Logs de Auditoría

```typescript
// Agregar tabla api_logs al schema
export const apiLogs = mysqlTable("api_logs", {
  id: varchar("id", { length: 191 }).primaryKey(),
  tokenId: varchar("token_id", { length: 191 }),
  endpoint: varchar("endpoint", { length: 255 }),
  method: varchar("method", { length: 10 }),
  statusCode: int("status_code"),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### 4. Más Endpoints

- `GET /api/v1/conversations` - Listar conversaciones
- `GET /api/v1/conversations/:id/messages` - Mensajes de conversación
- `POST /api/v1/visitors/identify` - Identificar visitantes
- `POST /api/v1/events/track` - Tracking de eventos

### 5. Webhooks

Permitir que los usuarios registren webhooks para recibir eventos en tiempo real.

---

## 🎉 ¡Todo Listo!

Tu proyecto ahora tiene un **sistema completo de tokens Bearer** listo para usar en cualquier aplicación externa.

### Lo que tienes ahora:

✅ Autenticación API robusta  
✅ Gestión completa de tokens  
✅ Endpoints públicos funcionales  
✅ Documentación exhaustiva  
✅ Ejemplos en múltiples lenguajes  
✅ Sistema escalable y seguro  

---

## 💡 Tips

1. **Nunca** expongas tokens en código frontend
2. Usa **variables de entorno** para los tokens
3. **Revoca** tokens comprometidos inmediatamente
4. Establece **fechas de expiración** en producción
5. Usa **scopes** para limitar permisos

---

## 🆘 Soporte

¿Problemas o preguntas?

1. Revisa [API_BEARER_TOKENS.md](./API_BEARER_TOKENS.md)
2. Consulta [EJEMPLOS_API.md](./EJEMPLOS_API.md)
3. Verifica los logs: `docker logs bookforce-chatbot-db`
4. Prueba Drizzle Studio: `npm run db:studio`

---

## 📊 Resumen Rápido

```bash
# 1. Migración
npm run db:generate && npm run db:push

# 2. Iniciar servidores (en terminales separadas)
npm run dev        # Terminal 1: API principal
npm run test-api   # Terminal 2: Servidor de pruebas

# 3. Abrir navegador
# http://localhost:8080

# 4. Generar token (desde terminal o interfaz web después de login)
curl -X POST http://localhost:3000/api/tokens/generate \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name": "Mi App", "scopes": ["*"]}'

# 5. Usar token en la interfaz web o con cURL
curl -H "Authorization: Bearer kunoro_xxx..." \
  http://localhost:3000/api/v1/account
```

---

**¡Éxito con tu proyecto!** 🚀

Si necesitas ayuda adicional, toda la documentación está en el proyecto.

