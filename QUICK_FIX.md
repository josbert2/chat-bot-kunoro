# 🚀 Solución Rápida - Login y Registro

## ✅ Problema Resuelto

He agregado los API routes faltantes y logs completos. Ahora solo necesitas seguir estos pasos:

## 📋 Pasos para Probar

### 1. Asegúrate de que el backend esté corriendo

```bash
cd /home/jos/josbert.dev/chat-bot-kunoro/apps/api
npm run dev
```

Deberías ver:
```
🚀 API running on http://localhost:3001
```

### 2. Reinicia el servidor Next.js (IMPORTANTE)

**Detén el servidor si está corriendo (Ctrl+C) y vuelve a iniciarlo:**

```bash
cd /home/jos/josbert.dev/chat-bot-kunoro/apps/dashboard
npm run dev
```

⚠️ **Esto es CRUCIAL** para que Next.js cargue los nuevos API routes que creé.

### 3. Prueba el Registro

1. Abre el navegador en `http://localhost:3000/register`
2. Abre la consola del navegador (F12 → Console)
3. Llena el formulario y envía
4. Observa los logs en **3 lugares**:
   - **Consola del navegador** (logs del frontend)
   - **Terminal de Next.js** (logs del API route)
   - **Terminal del backend** (logs del servicio)

## 📁 Archivos Creados/Modificados

### ✨ Nuevos Archivos (API Routes):
- `apps/dashboard/app/api/auth/sign-up/email/route.ts`
- `apps/dashboard/app/api/auth/sign-in/email/route.ts`

### 📝 Archivos con Logs Agregados:
- `apps/dashboard/app/register/page.tsx`
- `apps/dashboard/app/login/page.tsx`
- `apps/api/src/auth/auth.controller.ts`
- `apps/api/src/auth/auth.service.ts`

### 📖 Documentación:
- `DEBUGGING.md` - Guía completa de debugging
- `QUICK_FIX.md` - Este archivo con los pasos rápidos

## 🔍 Qué Esperar

### Si funciona correctamente:

Verás logs como estos:

**En la consola del navegador:**
```
🔵 [REGISTER] Iniciando registro con: {...}
🔵 [REGISTER] Response status: 200 OK
✅ [REGISTER] Registro exitoso
```

**En la terminal de Next.js:**
```
🔵 [API ROUTE] POST /api/auth/sign-up/email recibido
🔵 [API ROUTE] Enviando a: http://localhost:3001/v1/auth/register
✅ [API ROUTE] Respuesta exitosa del backend
```

**En la terminal del backend:**
```
🔵 [AUTH CONTROLLER] POST /auth/register recibido
🟢 [AUTH SERVICE] Iniciando registro
✅ [AUTH SERVICE] Usuario insertado correctamente
✅ [AUTH SERVICE] Registro completado exitosamente
```

### Si todavía hay errores:

Los logs te mostrarán exactamente dónde está fallando. Por ejemplo:

- **Si ves logs solo en el navegador pero no en Next.js** → El API route no se cargó, reinicia Next.js
- **Si ves logs en Next.js pero no en el backend** → El backend no está corriendo o no está en el puerto 3001
- **Si ves logs en el backend con errores** → Mira el mensaje específico del error (ej: problema de base de datos, contraseña muy corta, email duplicado, etc.)

## 🐛 Troubleshooting Rápido

### El backend no está corriendo:
```
❌ [API ROUTE] Error en proxy: fetch failed
```
**Solución:** Inicia el backend en el puerto 3001

### El API route no existe (404):
```
❌ [REGISTER] Response status: 404 Not Found
❌ [REGISTER] Error al parsear JSON: DOCTYPE...
```
**Solución:** Reinicia el servidor Next.js (Ctrl+C y `npm run dev`)

### Error de base de datos:
```
❌ [AUTH SERVICE] Error durante el registro: ...
```
**Solución:** Revisa el mensaje de error específico. Puede ser:
- Base de datos no conectada
- Schema incorrecto
- Constraint violations (email único, etc.)

### Email ya registrado:
```
❌ [AUTH SERVICE] Email ya registrado: ...
```
**Solución:** Usa otro email o elimina el usuario existente de la base de datos

### Contraseña muy corta:
```
❌ [AUTH SERVICE] Contraseña inválida: { length: X }
```
**Solución:** Usa una contraseña de al menos 8 caracteres

## 🎯 Próximo Paso

Una vez que sigas estos pasos, **compárteme los logs** que veas en las 3 terminales/consolas para que pueda ayudarte si todavía hay algún problema.

## 📚 Más Información

Para entender en detalle todos los logs y la arquitectura, lee el archivo `DEBUGGING.md`.

