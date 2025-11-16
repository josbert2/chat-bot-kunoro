# 📋 Gestión de Estados en el Inbox

## ✅ Funcionalidades implementadas

### 1. **Cambio automático de estado al abrir conversaciones**
Cuando un agente hace click en una conversación que está **"Sin asignar"**, automáticamente cambia a **"Abierta"**.

```typescript
// Se ejecuta automáticamente al seleccionar una conversación
if (conversation.status === 'unassigned') {
  updateConversationStatus(conversationId, 'open');
}
```

### 2. **Botón para marcar como resuelta**
En el header de cada conversación hay un botón **"Resolver"** que:
- Aparece cuando la conversación está "Sin asignar" o "Abierta"
- Al hacer click, marca la conversación como "Resuelta"
- La conversación desaparece del filtro actual y aparece en "Resueltos"

### 3. **Botón para reabrir conversaciones**
En conversaciones resueltas hay un botón **"Reabrir"** que:
- Cambia el estado de vuelta a "Abierta"
- La conversación vuelve a aparecer en el filtro "Abiertos"

### 4. **Badges de estado visual**

#### En la lista de conversaciones:
- 🟡 **Sin asignar** (amarillo/amber)
- 🟢 **Abierta** (verde)
- ⚪ **Resuelta** (gris)

#### En el header de la conversación:
- ⏳ **Sin asignar**
- ✅ **Abierta**
- 🎯 **Resuelta**

## 🎯 Flujo de trabajo

### Caso 1: Nueva conversación desde el widget
```
1. Usuario envía mensaje desde widget
2. Conversación se crea con estado "unassigned"
3. Aparece en "Inbox → Sin asignar"
4. Agente hace click en la conversación
5. Automáticamente cambia a "open"
6. La conversación desaparece de "Sin asignar" y aparece en "Abiertos"
```

### Caso 2: Resolver una conversación
```
1. Agente está en una conversación
2. Click en botón "Resolver"
3. Estado cambia a "resolved"
4. La conversación se mueve a "Resueltos"
5. Ya no aparece en "Sin asignar" ni "Abiertos"
```

### Caso 3: Reabrir una conversación resuelta
```
1. Agente va a "Inbox → Resueltos"
2. Selecciona una conversación
3. Click en botón "Reabrir"
4. Estado cambia a "open"
5. La conversación vuelve a "Abiertos"
```

## 🔄 Estados disponibles

| Estado | ID | Descripción | Filtro |
|--------|----|----|--------|
| Sin asignar | `unassigned` | Nuevas conversaciones del widget | Sin asignar |
| Abierta | `open` | Conversaciones en proceso | Abiertos |
| Resuelta | `resolved` | Conversaciones cerradas | Resueltos |

## 🎨 Colores de los badges

```typescript
// Lista de conversaciones
unassigned: 'bg-amber-100 text-amber-700'  // Amarillo
open: 'bg-green-100 text-green-700'         // Verde
resolved: 'bg-slate-100 text-slate-600'     // Gris

// Header de conversación
unassigned: 'bg-amber-100 text-amber-700'  // Amarillo
open: 'bg-green-100 text-green-700'         // Verde
resolved: 'bg-slate-100 text-slate-700'     // Gris
```

## 📡 API Endpoints

### Actualizar estado de conversación
```bash
PATCH /v1/conversations/:conversationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "open" | "resolved" | "unassigned"
}
```

### Ejemplo con cURL:
```bash
# Marcar como resuelta
curl -X PATCH http://localhost:3001/v1/conversations/conv_xxx \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "resolved"}'

# Reabrir conversación
curl -X PATCH http://localhost:3001/v1/conversations/conv_xxx \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "open"}'
```

## 🧪 Cómo probar

### 1. Crear conversación desde el widget
```bash
# Abre el widget de prueba
http://localhost:3000/widget-test?appId=YOUR_APP_ID

# Envía un mensaje
# Ve al inbox → Sin asignar
# La conversación debería aparecer allí
```

### 2. Cambio automático a "Abierta"
```bash
# En el inbox, click en una conversación "Sin asignar"
# El badge debería cambiar automáticamente a "Abierta"
# La conversación desaparece de "Sin asignar"
# Aparece en "Abiertos"
```

### 3. Marcar como resuelta
```bash
# Con una conversación abierta
# Click en el botón "Resolver" (verde, con ✓)
# El badge cambia a "Resuelta"
# La conversación se mueve a "Resueltos"
```

### 4. Reabrir conversación
```bash
# Ve a "Inbox → Resueltos"
# Selecciona una conversación
# Click en el botón "Reabrir" (azul, con ↻)
# La conversación vuelve a "Abiertos"
```

## 🔍 Logs a verificar

### Frontend (consola del navegador):
```
🔄 [Inbox] Actualizando estado de conversación: { conversationId: 'conv_xxx', status: 'open' }
✅ [Inbox] Estado actualizado
```

### Backend (terminal de api-express):
```
🟢 [CONVERSATIONS] PATCH /conversations/:conversationId
🟢 [CONVERSATIONS SERVICE] Actualizando conversación: conv_xxx
✅ [CONVERSATIONS SERVICE] Conversación actualizada
✅ [CONVERSATIONS] Conversación actualizada
```

## 💡 Notas adicionales

- **Persistencia**: Los estados se guardan en la base de datos
- **Tiempo real**: Los cambios se sincronizan con Socket.IO (opcional, por implementar)
- **Filtros**: Cada filtro muestra solo conversaciones con su estado correspondiente
- **Reload automático**: Después de cambiar el estado, se recargan las conversaciones para actualizar los filtros

## 🚀 Próximas mejoras (opcional)

1. **Asignación de agentes**: Permitir asignar conversaciones a agentes específicos
2. **Notificaciones**: Alertar cuando una conversación cambia de estado
3. **Historial**: Registrar todos los cambios de estado con timestamp
4. **Filtros combinados**: Permitir filtrar por múltiples estados a la vez
5. **Contador de conversaciones**: Mostrar cantidad en cada filtro (ej: "Sin asignar (5)")

