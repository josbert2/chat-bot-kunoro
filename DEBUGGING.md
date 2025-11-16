# Guía de Debugging - Login y Registro

## Logs Agregados

He agregado logs detallados en todo el flujo de autenticación para ayudarte a identificar dónde está fallando el registro/login.

### Frontend (Dashboard)

#### Archivos modificados:
- `apps/dashboard/app/register/page.tsx`
- `apps/dashboard/app/login/page.tsx`
- `apps/dashboard/app/api/auth/sign-up/email/route.ts` (nuevo API route)
- `apps/dashboard/app/api/auth/sign-in/email/route.ts` (nuevo API route)

#### Logs que verás en la consola del navegador:

**Para Registro:**
- 🔵 `[REGISTER] Iniciando registro con:` - Datos del usuario (password oculto)
- 🔵 `[REGISTER] Payload a enviar:` - Datos que se envían al servidor
- 🔵 `[REGISTER] Response status:` - Código de respuesta HTTP
- 🔵 `[REGISTER] Response headers:` - Headers de la respuesta
- ❌ `[REGISTER] Error response data:` - Datos del error si falla
- ✅ `[REGISTER] Registro exitoso:` - Datos de respuesta si funciona
- 🔵 `[REGISTER] Redirigiendo a /onboarding` - Antes de redireccionar

**Para Login:**
- 🔵 `[LOGIN] Iniciando login con:` - Datos del usuario (password oculto)
- 🔵 `[LOGIN] Payload a enviar:` - Datos que se envían al servidor
- 🔵 `[LOGIN] Response status:` - Código de respuesta HTTP
- 🔵 `[LOGIN] Response headers:` - Headers de la respuesta
- ❌ `[LOGIN] Error response data:` - Datos del error si falla
- ✅ `[LOGIN] Login exitoso:` - Datos de respuesta si funciona
- 🔵 `[LOGIN] Redirigiendo a /dashboard` - Antes de redireccionar

### API Routes (Next.js - se ven en la terminal del servidor Next.js)

**Estos son logs intermedios entre frontend y backend:**

- 🔵 `[API ROUTE] POST /api/auth/sign-up/email recibido` - Request recibido en el proxy
- 🔵 `[API ROUTE] Body recibido:` - Datos que llegaron del frontend
- 🔵 `[API ROUTE] Enviando a:` - URL del backend a la que se reenvía (http://localhost:3001/v1/auth/register)
- 🔵 `[API ROUTE] Backend response status:` - Código de respuesta del backend
- ✅ `[API ROUTE] Respuesta exitosa del backend` - Si todo salió bien
- ❌ `[API ROUTE] Error del backend:` - Si el backend devolvió un error
- ❌ `[API ROUTE] Error en proxy:` - Si hubo un error de conexión

### Backend (API)

#### Archivos modificados:
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/auth/auth.service.ts`

#### Logs que verás en la terminal del servidor:

**Para Registro:**
- 🔵 `[AUTH CONTROLLER] POST /auth/register recibido:` - Request recibido en el controlador
- 🟢 `[AUTH SERVICE] Iniciando registro:` - Inicio del proceso
- 🟢 `[AUTH SERVICE] Verificando si el email ya existe...`
- 🟢 `[AUTH SERVICE] Email disponible, creando usuario...`
- 🟢 `[AUTH SERVICE] IDs generados:` - UUIDs generados
- 🟢 `[AUTH SERVICE] Insertando usuario...`
- ✅ `[AUTH SERVICE] Usuario insertado correctamente`
- 🟢 `[AUTH SERVICE] Insertando workspace...`
- ✅ `[AUTH SERVICE] Workspace insertado correctamente`
- 🟢 `[AUTH SERVICE] Actualizando accountId del usuario...`
- ✅ `[AUTH SERVICE] AccountId actualizado correctamente`
- 🟢 `[AUTH SERVICE] Insertando account (credenciales)...`
- ✅ `[AUTH SERVICE] Account insertado correctamente`
- 🟢 `[AUTH SERVICE] Generando token JWT...`
- ✅ `[AUTH SERVICE] Token generado correctamente`
- ✅ `[AUTH SERVICE] Registro completado exitosamente para:` - Email del usuario
- ✅ `[AUTH CONTROLLER] Registro exitoso`

**Si hay errores:**
- ❌ `[AUTH SERVICE] Contraseña inválida:` - Contraseña no cumple requisitos
- ❌ `[AUTH SERVICE] Email ya registrado:` - Email duplicado
- ❌ `[AUTH SERVICE] Error durante el registro:` - Error en base de datos
- ❌ `[AUTH SERVICE] Detalles del error:` - Stack trace completo
- ❌ `[AUTH CONTROLLER] Error en registro:` - Error en el controlador

**Para Login:**
- 🔵 `[AUTH CONTROLLER] POST /auth/login recibido:`
- 🟢 `[AUTH SERVICE] Iniciando login:`
- 🟢 `[AUTH SERVICE] Buscando usuario por email...`
- 🟢 `[AUTH SERVICE] Usuario encontrado, buscando credenciales...`
- 🟢 `[AUTH SERVICE] Verificando contraseña...`
- ✅ `[AUTH SERVICE] Contraseña válida, verificando workspace...`
- 🟢 `[AUTH SERVICE] Generando token...`
- ✅ `[AUTH SERVICE] Login exitoso para:`
- ✅ `[AUTH CONTROLLER] Login exitoso`

## ✅ PROBLEMA RESUELTO

He identificado y solucionado el problema de configuración:

### El problema era:

- **Frontend llamaba a**: `/api/auth/sign-up/email` y `/api/auth/sign-in/email`
- **Backend tiene**: `/v1/auth/register` y `/v1/auth/login`
- Los endpoints no coincidían → 404 Not Found

### La solución implementada:

He creado **API Routes en Next.js** que actúan como proxy:
- `apps/dashboard/app/api/auth/sign-up/email/route.ts` → proxy a `/v1/auth/register`
- `apps/dashboard/app/api/auth/sign-in/email/route.ts` → proxy a `/v1/auth/login`

Estos archivos:
1. Reciben las peticiones del frontend
2. Las reenvían al backend NestJS (con el prefijo `/v1` correcto)
3. Devuelven la respuesta al frontend
4. Incluyen logs adicionales para debugging

## 🔧 Configuración Necesaria (Si aplica)

### Variable de Entorno (Opcional)

Si tu backend **NO** está en `http://localhost:3001`, crea un archivo `.env.local` en `apps/dashboard/`:

```bash
# apps/dashboard/.env.local
NEXT_PUBLIC_API_URL=http://localhost:TU_PUERTO
# o si está en otro servidor:
# NEXT_PUBLIC_API_URL=https://api.tudominio.com
```

Por defecto usa `http://localhost:3001`, que es lo más común.

## 🧪 Cómo Debuggear

1. **Asegúrate de que el backend esté corriendo** en el puerto 3001
   ```bash
   cd apps/api
   npm run dev
   # Deberías ver: 🚀 API running on http://localhost:3001
   ```

2. **Reinicia el servidor de Next.js** (importante para que cargue los nuevos API routes)
   ```bash
   cd apps/dashboard
   npm run dev
   ```

3. **Abre la consola del navegador** (F12) en la pestaña "Console"

4. **Intenta registrarte o loguearte**

5. **Observa los logs en:**
   - Consola del navegador (logs del frontend)
   - Terminal del Next.js (logs de los API routes)
   - Terminal del backend NestJS (logs del backend)

Los logs te mostrarán exactamente en qué paso está fallando:
- Si no ves logs en el backend → El frontend no está conectando con el backend
- Si ves logs en el backend pero con errores → Revisa el mensaje de error específico
- Si falla en "Insertando usuario" → Problema de base de datos o schema
- Si falla en "Verificando contraseña" → Problema con bcrypt o datos incorrectos

## 📝 Ejemplo de Logs Esperados

### Flujo Exitoso de Registro:

```
# 1. Frontend (Console del navegador):
🔵 [REGISTER] Iniciando registro con: { name: "Juan", email: "juan@example.com", password: "***" }
🔵 [REGISTER] Payload a enviar: { name: "Juan", email: "juan@example.com", password: "***" }
🔵 [REGISTER] Response status: 200 OK
✅ [REGISTER] Registro exitoso: { token: "...", user: {...}, workspace: {...} }
🔵 [REGISTER] Redirigiendo a /onboarding

# 2. API Route Next.js (Terminal de Next.js):
🔵 [API ROUTE] POST /api/auth/sign-up/email recibido
🔵 [API ROUTE] Body recibido: { name: "Juan", email: "juan@example.com", password: "***" }
🔵 [API ROUTE] Enviando a: http://localhost:3001/v1/auth/register
🔵 [API ROUTE] Backend response status: 201
✅ [API ROUTE] Respuesta exitosa del backend

# 3. Backend NestJS (Terminal del backend):
🔵 [AUTH CONTROLLER] POST /auth/register recibido: { name: "Juan", email: "juan@example.com", hasPassword: true }
🟢 [AUTH SERVICE] Iniciando registro: { name: "Juan", email: "juan@example.com", hasPassword: true, passwordLength: 10 }
🟢 [AUTH SERVICE] Verificando si el email ya existe...
🟢 [AUTH SERVICE] Email disponible, creando usuario...
🟢 [AUTH SERVICE] IDs generados: { userId: "...", workspaceId: "..." }
🟢 [AUTH SERVICE] Insertando usuario...
✅ [AUTH SERVICE] Usuario insertado correctamente
🟢 [AUTH SERVICE] Insertando workspace...
✅ [AUTH SERVICE] Workspace insertado correctamente
🟢 [AUTH SERVICE] Actualizando accountId del usuario...
✅ [AUTH SERVICE] AccountId actualizado correctamente
🟢 [AUTH SERVICE] Insertando account (credenciales)...
✅ [AUTH SERVICE] Account insertado correctamente
🟢 [AUTH SERVICE] Generando token JWT...
✅ [AUTH SERVICE] Token generado correctamente
✅ [AUTH SERVICE] Registro completado exitosamente para: juan@example.com
✅ [AUTH CONTROLLER] Registro exitoso
```

## 🐛 Problemas Comunes

1. **"No se pudo crear la cuenta. Verifica los datos."**
   - Revisa los logs del backend para ver el error específico
   - Puede ser un problema de base de datos, schema, o constraints

2. **Error de conexión**
   - Verifica que el backend esté corriendo en el puerto correcto
   - Revisa la variable `NEXT_PUBLIC_API_URL`

3. **404 Not Found**
   - Los endpoints no coinciden entre frontend y backend
   - Aplica una de las soluciones mencionadas arriba

4. **Error de CORS**
   - El backend necesita permitir requests desde el frontend
   - Verifica la configuración de CORS en NestJS

