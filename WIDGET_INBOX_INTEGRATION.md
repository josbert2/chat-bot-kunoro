# 🎯 Integración Widget → Inbox

## ✅ Cambios realizados

### 1. **Widget ahora envía `visitorId`**
- El cliente API del widget (`apps/widget/src/api/client.ts`) ahora incluye el `visitorId` en cada mensaje
- También envía `pageUrl` y `userAgent` para contexto adicional

### 2. **Backend crea conversaciones con estado `unassigned`**
- Las conversaciones creadas desde el widget ahora tienen estado `'unassigned'` (antes era `'active'`)
- Esto hace que aparezcan automáticamente en el filtro "Sin asignar" del inbox

### 3. **Socket.IO en tiempo real**
- Cuando se crea una conversación desde el widget, se emite el evento `new_conversation`
- Cuando se envía un mensaje desde el widget, se emite el evento `new_message`
- El inbox escucha estos eventos y actualiza la UI automáticamente

## 🚀 Cómo probar

### Paso 1: Asegúrate de que todo esté corriendo

```bash
cd /home/jos/josbert.dev/chat-bot-kunoro

# Terminal 1: API Express
cd apps/api-express && npm run dev

# Terminal 2: Widget (dev server)
cd apps/widget && npm run dev

# Terminal 3: Dashboard
cd apps/dashboard && npm run dev
```

### Paso 2: Abre el dashboard y ve a Settings

1. Ve a `http://localhost:3000/login`
2. Inicia sesión con tus credenciales
3. Ve a `Settings → Apariencia`
4. Copia el código de instalación que incluye tu `appId` (algo como `site_xxxxx`)

### Paso 3: Abre el widget de prueba con tu `appId` real

**Opción A: Desde Settings**
- Click en "Vista en nueva pestaña" (abre automáticamente con tus colores y `appId`)

**Opción B: Manualmente**
```
http://localhost:3000/widget-test?appId=TU_APP_ID&background=%230F172A&action=%232563EB
```

Reemplaza `TU_APP_ID` con el `appId` que ves en el código de instalación.

### Paso 4: Prueba la conversación

1. **En la pestaña del widget test:**
   - Click en el botón flotante del widget (esquina inferior derecha)
   - Escribe un mensaje como "Hola, necesito ayuda"
   - Envía el mensaje

2. **En la pestaña del dashboard:**
   - Ve a `Inbox → Sin asignar`
   - Deberías ver aparecer la conversación **en tiempo real** sin necesidad de recargar
   - Click en la conversación para ver los mensajes
   - Puedes responder desde el dashboard

### Paso 5: Verifica que los mensajes se guardan

1. Envía varios mensajes desde el widget
2. Ve al inbox y selecciona la conversación
3. Todos los mensajes deberían estar guardados y visibles
4. Si envías un mensaje desde el dashboard, debería aparecer en la conversación

## 🔍 Logs a verificar

### En el navegador (widget test):
```
🎨 [Widget Test] Colores recibidos de URL: { appId: 'site_xxx', background: '#...', action: '#...' }
[Kunoro Widget] Inicializando v1.0.0 para app: site_xxx
[Kunoro Widget] Init data received: { visitorId: 'visitor_xxx', ... }
[Kunoro Widget] Sending message to API...
```

### En el backend (terminal de api-express):
```
🟢 [WIDGET SERVICE] Inicializando widget para site: site_xxx
✅ [WIDGET SERVICE] Widget inicializado
🟢 [WIDGET SERVICE] Enviando mensaje al widget
🟢 [WIDGET SERVICE] Nueva conversación creada: conv_xxx
📡 [WIDGET SERVICE] Evento new_conversation emitido
📡 [WIDGET SERVICE] Evento new_message emitido para conversación: conv_xxx
```

### En el navegador (inbox):
```
🔌 [SOCKET] Conectado al servidor
📥 [SOCKET] Nueva conversación recibida: { id: 'conv_xxx', endUserName: 'Visitante xxx', ... }
💬 [SOCKET] Nuevo mensaje recibido: { conversationId: 'conv_xxx', message: { content: '...' } }
```

## ❌ Problemas comunes

### "Sitio no encontrado" (404)
- **Causa**: El `appId` no es válido o no existe en la base de datos
- **Solución**: Usa el `appId` real de tu proyecto desde Settings

### Las conversaciones no aparecen en el inbox
- **Causa**: El estado de la conversación no es `'unassigned'`
- **Solución**: Verifica que el widget service esté usando `status: 'unassigned'` al crear conversaciones

### Los mensajes no se actualizan en tiempo real
- **Causa**: Socket.IO no está conectado
- **Solución**: 
  1. Verifica que el backend esté corriendo en el puerto 3001
  2. Abre la consola del navegador y busca `🔌 [SOCKET] Conectado al servidor`
  3. Si no aparece, recarga la página del inbox

### El widget no carga
- **Causa**: El servidor de desarrollo del widget no está corriendo
- **Solución**: 
  1. Ve a `/apps/widget` y ejecuta `npm run dev`
  2. El servidor debería iniciar en `http://localhost:3003`
  3. Si aún no funciona, usa el modo "Build" en la página de prueba

## 📝 Notas adicionales

- **Modo Dev vs Build**: El modo "Dev" usa el servidor de Vite (hot reload), el modo "Build" usa el archivo compilado
- **visitorId**: Se guarda en localStorage del navegador, persiste entre recargas
- **conversationId**: Se reutiliza si existe una conversación activa para el mismo visitante
- **Metadata**: Cada conversación guarda `pageUrl`, `userAgent`, y `name` del visitante

## 🎉 ¡Listo!

Ahora puedes usar el widget en `/widget-test` y ver las conversaciones aparecer automáticamente en tu inbox en `/dashboard/inbox` 🚀

