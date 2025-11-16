# 🧪 Cómo Probar la API Bearer - Guía Completa

Guía paso a paso para probar el sistema de tokens Bearer de forma rápida y sencilla.

## 🚀 Método Rápido (5 minutos)

### Paso 1: Iniciar Servidores

Abre **dos terminales** en el directorio del proyecto:

#### Terminal 1: API Principal

```bash
cd /home/jos/josbert.dev/chat-bot-kunoro
npm run dev
```

Deberías ver algo como:
```
✓ Ready on http://localhost:3000
```

#### Terminal 2: Servidor de Pruebas

```bash
cd /home/jos/josbert.dev/chat-bot-kunoro
npm run test-api
```

Deberías ver:
```
╔══════════════════════════════════════════════════════════╗
║       🚀 Servidor de Prueba API Bearer - Kunoro         ║
╚══════════════════════════════════════════════════════════╝

✅ Servidor corriendo en: http://localhost:8888
```

### Paso 2: Aplicar Migración (Si no lo has hecho)

En una tercera terminal:

```bash
cd /home/jos/josbert.dev/chat-bot-kunoro
npm run db:generate
npm run db:push
```

### Paso 3: Generar un Token

#### Opción A: Desde la Terminal (después de iniciar sesión)

```bash
# Primero inicia sesión (guarda la cookie)
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email": "tu@email.com", "password": "tupassword"}' \
  -c cookies.txt

# Luego genera el token
curl -X POST http://localhost:3000/api/tokens/generate \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Token de Prueba",
    "scopes": ["*"],
    "expiresInDays": 30
  }' | jq .
```

Copia el token de la respuesta (empieza con `kunoro_`).

#### Opción B: Desde el Dashboard

1. Ve a `http://localhost:3000/dashboard`
2. Inicia sesión si aún no lo has hecho
3. Ve a Configuración → API Tokens (cuando implementes la UI)

### Paso 4: Abrir la Interfaz de Prueba

Abre tu navegador en:

```
http://localhost:8888
```

### Paso 5: Probar en la Interfaz

1. **Pega tu token** en el campo "Token Bearer"
2. Click en **"💾 Guardar Token"**
3. Click en **"🔌 Probar Conexión"**
4. Si aparece "✅ Conexión exitosa", ¡estás listo!

### Paso 6: Probar los Endpoints

#### Test 1: Account Info
- Click en **"🚀 GET /api/v1/account"**
- Deberías ver info de tu cuenta

#### Test 2: Lista de Sitios
- Click en **"🚀 GET /api/v1/sites"**
- Verás todos los sitios de tu cuenta

#### Test 3: Chat Interactivo
- Escribe un mensaje en el campo de texto
- Presiona **Enter** o click en **"📤 Enviar Mensaje"**
- El chatbot responderá en tiempo real

---

## 📊 Ejemplo de Sesión Completa

```bash
# Terminal 1
$ cd /home/jos/josbert.dev/chat-bot-kunoro
$ npm run dev
✓ Ready on http://localhost:3000

# Terminal 2
$ cd /home/jos/josbert.dev/chat-bot-kunoro
$ npm run test-api
✅ Servidor corriendo en: http://localhost:8888

# Terminal 3 - Generar token
$ curl -X POST http://localhost:3000/api/tokens/generate \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name": "Mi Token", "scopes": ["*"]}'

{
  "success": true,
  "data": {
    "token": "kunoro_a1b2c3d4e5f6g7h8i9j0..."
  }
}

# Copiar el token y usarlo en http://localhost:8888
```

---

## 🎯 Qué Deberías Ver

### En la Interfaz Web:

1. **Sección de Token** (arriba):
   - Campo para ingresar el token
   - Estado: "Connected" (verde) si es válido
   - Botones de acción

2. **Cards de Prueba**:
   - Account: Muestra info de tu cuenta
   - Sites: Lista tus sitios
   - Respuestas en formato JSON

3. **Chat Interactivo**:
   - Mensajes del usuario (azul, derecha)
   - Mensajes del asistente (gris, izquierda)
   - Contador de tokens usados

4. **Log de Respuestas**:
   - Timestamp de cada petición
   - Método y endpoint
   - Status code (200 = éxito)

---

## 🔍 Verificar que Todo Funciona

### Checklist de Pruebas:

- [ ] Terminal 1: API corriendo en puerto 3000
- [ ] Terminal 2: Servidor de pruebas en puerto 8888
- [ ] Base de datos MySQL corriendo (Docker)
- [ ] Migración de `api_tokens` aplicada
- [ ] Token Bearer generado y copiado
- [ ] Interfaz web abierta en navegador
- [ ] Token guardado (estado "Connected")
- [ ] Endpoint `/account` responde con 200
- [ ] Endpoint `/sites` responde con 200
- [ ] Chat envía y recibe mensajes
- [ ] Logs muestran las peticiones

---

## 🐛 Troubleshooting Rápido

### Servidor de pruebas no inicia

```bash
# Si el puerto 8888 está ocupado, usa otro:
PORT=9000 npm run test-api
```

### Token inválido

```bash
# Verifica que empiece con "kunoro_"
echo "kunoro_a1b2c3d4..." | grep "^kunoro_"

# Lista tokens en la BD
npm run db:studio
# Ve a la tabla api_tokens
```

### API no responde

```bash
# Verifica que esté corriendo
curl http://localhost:3000/api/health

# Verifica logs
# Mira la Terminal 1 donde corre npm run dev
```

### Problemas de CORS

Si usas el archivo HTML directamente (sin el servidor Node):
- Usa el servidor incluido: `npm run test-api`
- O configura CORS en Next.js

---

## 💡 Tips Profesionales

### Atajos de Teclado
- **Enter**: Enviar mensaje en el chat
- **Shift+Enter**: Nueva línea en el mensaje
- **F12**: Abrir DevTools del navegador

### Variables de Entorno
```bash
# Puerto personalizado
PORT=9000 npm run test-api

# Múltiples instancias
PORT=8888 npm run test-api &
PORT=9999 npm run test-api &
```

### Debugging
```bash
# Ver logs en tiempo real
# Terminal 1: Logs de Next.js
# Terminal 2: Logs del servidor de pruebas

# Abrir DevTools del navegador (F12)
# Tab "Network" para ver requests
# Tab "Console" para ver errores JS
```

### Productividad
- El token se guarda en localStorage (no lo pierdas)
- Puedes abrir múltiples tabs del navegador
- Los logs persisten mientras el servidor esté corriendo
- Usa el historial del chat para contexto

---

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `test-api.html` | Interfaz web de prueba |
| `test-server.js` | Servidor HTTP Node.js |
| `TEST_SERVER_README.md` | Docs del servidor |
| `API_BEARER_TOKENS.md` | Docs completa de la API |
| `EJEMPLOS_API.md` | Ejemplos de integración |

---

## 🎓 Siguiente Nivel

Una vez que todo funciona:

1. **Integra en tu app**: Usa los ejemplos de `EJEMPLOS_API.md`
2. **Crea más endpoints**: Agrega funcionalidad a `/api/v1/*`
3. **Implementa UI en dashboard**: Para gestionar tokens visualmente
4. **Agrega rate limiting**: Limita requests por token
5. **Implementa webhooks**: Para eventos en tiempo real

---

## 🆘 Ayuda

Si tienes problemas:

1. **Revisa los logs**: Ambas terminales muestran info útil
2. **Consola del navegador**: F12 → Console
3. **Drizzle Studio**: `npm run db:studio` para ver la BD
4. **Documentación**: Lee `API_BEARER_TOKENS.md`
5. **Test con cURL**: Prueba endpoints directamente

---

## ✅ Checklist Final

Antes de integrar en producción:

- [ ] Migraciones aplicadas correctamente
- [ ] Tokens se generan sin errores
- [ ] Todos los endpoints responden 200
- [ ] Chat funciona correctamente
- [ ] Scopes funcionan (prueba con permisos limitados)
- [ ] Tokens expiran correctamente
- [ ] Revocar tokens funciona
- [ ] LastUsedAt se actualiza
- [ ] Logs de API funcionan
- [ ] Documentación revisada

---

## 🎉 ¡Listo!

Si completaste todos los pasos, ¡felicitaciones! Tienes un sistema completo de API con tokens Bearer funcionando.

**Próximo paso**: Integra la API en tu aplicación usando los ejemplos de `EJEMPLOS_API.md`.

---

**¿Dudas?** Revisa la documentación completa o abre un issue.

Fecha: Noviembre 2024  
Versión: 1.0.0

