# 🚀 Setup de Producción - Proyecto Real

## 📋 Objetivo
Tener el sistema completo funcionando en un entorno real donde:
1. El **widget** esté instalado en un sitio web real
2. El **backend API** esté corriendo y accesible
3. El **dashboard** esté disponible para gestionar conversaciones
4. Todo esté conectado y funcionando end-to-end

## 🏗️ Arquitectura

```
┌─────────────────┐
│  Sitio Web Real │
│  (con widget)   │ ──┐
└─────────────────┘   │
                      │
                      ├──► ┌──────────────┐     ┌──────────────┐
                      │    │  Backend API │────►│   Database   │
                      │    │  (Express)   │     │   (MySQL)    │
                      │    └──────────────┘     └──────────────┘
                      │           ▲
┌─────────────────┐   │           │
│   Dashboard     │ ──┘           │
│  (Inbox/Admin)  │───────────────┘
└─────────────────┘
```

## 📝 Checklist de Setup

### ✅ Paso 1: Preparar la Base de Datos
```bash
# 1. Asegúrate de que MySQL esté corriendo
# 2. Verifica la conexión con las credenciales de tu .env
# 3. Asegúrate de que las tablas estén creadas (migrations)
```

### ✅ Paso 2: Compilar el Widget para Producción
```bash
cd /home/jos/josbert.dev/chat-bot-kunoro/apps/widget

# Compilar el widget
npm run build

# Copiar el widget compilado al dashboard (para servir desde ahí)
npm run build:dashboard

# Resultado: widget.js disponible en apps/dashboard/public/
```

### ✅ Paso 3: Iniciar el Backend API
```bash
cd /home/jos/josbert.dev/chat-bot-kunoro/apps/api-express

# Asegúrate de tener el .env configurado
# PORT=3001
# DATABASE_HOST=127.0.0.1
# DATABASE_PORT=3530
# DATABASE_USER=chatbot
# DATABASE_PASSWORD=chatbot_pw
# DATABASE_NAME=chatbot
# JWT_SECRET=tu-secreto-jwt
# OPENAI_API_KEY=tu-api-key (opcional)

# Iniciar en modo producción
npm run dev
# O para producción:
# npm run build && npm start
```

### ✅ Paso 4: Iniciar el Dashboard
```bash
cd /home/jos/josbert.dev/chat-bot-kunoro/apps/dashboard

# Compilar para producción
npm run build

# Iniciar servidor de producción
npm start

# O en desarrollo:
npm run dev
```

### ✅ Paso 5: Crear tu Cuenta y Proyecto

1. **Registrarte:**
   ```
   http://localhost:3000/register
   
   - Nombre: Tu nombre
   - Email: tu@email.com
   - Password: tu-password-seguro
   ```

2. **Iniciar sesión:**
   ```
   http://localhost:3000/login
   ```

3. **Completar onboarding:**
   - Selecciona tu industria
   - Tipo de negocio
   - Objetivo principal

4. **Configurar apariencia del widget:**
   ```
   http://localhost:3000/dashboard/settings?section=apariencia
   
   - Elige colores de tu marca
   - Personaliza el widget
   - Copia el código de instalación
   ```

### ✅ Paso 6: Instalar el Widget en tu Sitio Real

**Opción A: Sitio HTML estático**

Crea un archivo `index.html` o edita tu sitio existente:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Sitio Web - Con Chat en Vivo</title>
    <style>
        body {
            font-family: system-ui, -apple-system, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            line-height: 1.6;
        }
        .hero {
            text-align: center;
            padding: 4rem 0;
        }
        .cta {
            display: inline-block;
            background: #2563eb;
            color: white;
            padding: 1rem 2rem;
            text-decoration: none;
            border-radius: 0.5rem;
            margin-top: 1rem;
        }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Bienvenido a Mi Sitio Web</h1>
        <p>Prueba nuestro chat en vivo. Está en la esquina inferior derecha 👇</p>
        <a href="#" class="cta">Contáctanos</a>
    </div>

    <section>
        <h2>Sobre Nosotros</h2>
        <p>Este es un sitio de ejemplo con chat en vivo implementado.</p>
    </section>

    <!-- WIDGET DE CHAT - Copia este código desde tu dashboard -->
    <script 
      src="http://localhost:3000/widget.js"
      data-app-id="TU_APP_ID_AQUI"
      data-color-background="#0F172A"
      data-color-action="#2563EB"
    ></script>
</body>
</html>
```

**Opción B: Sitio con framework (React, Next.js, etc.)**

```jsx
// Componente que carga el widget
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'http://localhost:3000/widget.js';
  script.setAttribute('data-app-id', 'TU_APP_ID_AQUI');
  script.setAttribute('data-color-background', '#0F172A');
  script.setAttribute('data-color-action', '#2563EB');
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);
```

### ✅ Paso 7: Probar el Flujo Completo

**Test 1: Widget → Backend → Inbox**

1. **Abre tu sitio web** (donde instalaste el widget)
2. **Click en el botón del widget** (esquina inferior derecha)
3. **Escribe un mensaje**: "Hola, necesito ayuda"
4. **Envía el mensaje**

**Test 2: Ver en el Inbox**

1. **Abre el dashboard**: `http://localhost:3000/dashboard/inbox`
2. **Ve a "Sin asignar"**
3. **Deberías ver tu conversación** aparecer en tiempo real
4. **Click en la conversación**
5. **Responde desde el dashboard**

**Test 3: Categorías y Estados**

1. **Selecciona una categoría** para tu respuesta (Pregunta, Soporte, etc.)
2. **Envía tu respuesta**
3. **Marca la conversación como "Asignada"** (botón Asignar)
4. **O márcala como "Resuelta"** cuando termines

## 🌐 Acceso desde Internet (Opcional)

Para que tu sitio y el widget sean accesibles desde internet:

### Opción 1: Usando ngrok (rápido para pruebas)

```bash
# Instalar ngrok
# https://ngrok.com/

# Exponer el backend
ngrok http 3001
# Resultado: https://abc123.ngrok.io → localhost:3001

# Exponer el dashboard
ngrok http 3000
# Resultado: https://xyz789.ngrok.io → localhost:3000
```

Actualiza las URLs en tu código:
- Widget: Cambia `http://localhost:3000/widget.js` por tu URL de ngrok
- API: Actualiza la URL del API en el widget y dashboard

### Opción 2: Deployment real (producción)

**Backend (API Express):**
- Vercel, Railway, Render, DigitalOcean, AWS
- Asegúrate de configurar las variables de entorno

**Dashboard (Next.js):**
- Vercel (recomendado), Netlify, Cloudflare Pages

**Widget:**
- CDN como Cloudflare, AWS S3 + CloudFront
- O servir desde el mismo dominio del dashboard

**Base de Datos:**
- PlanetScale, Supabase, AWS RDS, DigitalOcean Managed MySQL

## 🔧 Variables de Entorno

### Backend (`apps/api-express/.env`)
```env
PORT=3001
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3530
DATABASE_USER=chatbot
DATABASE_PASSWORD=chatbot_pw
DATABASE_NAME=chatbot
JWT_SECRET=tu-secreto-super-seguro-cambiame
OPENAI_API_KEY=sk-... # Opcional
NODE_ENV=production
```

### Dashboard (`apps/dashboard/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
# O tu URL de producción: https://api.tudominio.com
```

## 📊 Monitoreo

### Logs del Backend
```bash
cd apps/api-express
npm run dev

# Deberías ver:
# ✅ [SERVER] API corriendo en http://localhost:3001
# ✅ [SERVER] Base de datos conectada
# 🔌 [SOCKET] Socket.IO listo
```

### Logs del Frontend
- Abre la consola del navegador (F12)
- Deberías ver logs del widget y del inbox

### Verificar Socket.IO
- En el dashboard, debería aparecer: `🔌 [SOCKET] Conectado al servidor`
- Los mensajes deberían llegar en tiempo real

## 🐛 Troubleshooting

### Widget no aparece
- ✅ Verifica que el script esté cargando: Network tab en DevTools
- ✅ Verifica el `data-app-id` sea correcto
- ✅ Revisa errores en la consola

### Conversaciones no llegan al inbox
- ✅ Verifica que el backend esté corriendo
- ✅ Verifica la conexión a la base de datos
- ✅ Revisa los logs del backend
- ✅ Verifica que Socket.IO esté conectado

### Errores de CORS
- ✅ Asegúrate de que el backend tenga CORS habilitado
- ✅ Verifica las URLs permitidas en la configuración de CORS

### Base de datos no conecta
- ✅ Verifica las credenciales en `.env`
- ✅ Asegúrate de que MySQL esté corriendo
- ✅ Verifica el puerto (default: 3530)

## 🎉 ¡Todo Listo!

Tu sistema debería estar funcionando completamente:

1. ✅ Widget funcionando en tu sitio
2. ✅ Mensajes llegando al backend
3. ✅ Conversaciones visibles en el inbox
4. ✅ Socket.IO funcionando en tiempo real
5. ✅ Categorías de mensajes
6. ✅ Gestión de estados (Sin asignar, Abierta, Resuelta)
7. ✅ Eliminar conversaciones con confirmación

## 📚 Próximos Pasos

- [ ] Personalizar más el widget (colores, mensaje de bienvenida)
- [ ] Añadir más agentes al equipo
- [ ] Configurar notificaciones por email
- [ ] Integrar con WhatsApp o Zapier
- [ ] Añadir respuestas automáticas con IA
- [ ] Implementar analytics y reportes

