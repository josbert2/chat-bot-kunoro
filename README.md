# 🤖 Bookforce AI Chatbot

Un chatbot inteligente tipo Intercom construido con Next.js 14, TypeScript, Tailwind CSS y OpenAI GPT-4.

## ✨ Características

- 💬 **Chat en tiempo real** con IA conversacional
- 🎨 **Diseño moderno** tipo Intercom con animaciones suaves y fuente Nunito
- 📱 **Totalmente responsive** - funciona en móviles y desktop
- 🚀 **Respuestas instantáneas** con OpenAI GPT-4
- 💾 **Persistencia de sesiones** - Guarda conversaciones por IP en MySQL
- 🗄️ **Base de datos MySQL** con Docker Compose y Drizzle ORM
- 🎯 **Clasificador de intenciones** - Detecta automáticamente el tipo de consulta
- 🔍 **6 categorías de intención**: valores, horarios, funciones, transaccionales, FAQ, conversación
- 🌐 **Siempre en español** - Respuestas garantizadas en español
- ⚡ **Optimizado** con Next.js 14 y App Router
- 🔐 **API REST con tokens Bearer** - Integra con aplicaciones externas

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **IA**: OpenAI GPT-4
- **Iconos**: Lucide React

## 📦 Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

3. **Agregar tu API Key de OpenAI** en el archivo `.env`:
```env
OPENAI_API_KEY=tu_api_key_aqui
```

Para obtener una API Key:
- Visita [platform.openai.com](https://platform.openai.com)
- Crea una cuenta o inicia sesión
- Ve a API Keys y crea una nueva key

4. **Iniciar la base de datos MySQL** (opcional pero recomendado):
```bash
# Iniciar MySQL con Docker
npm run docker:up

# Generar y aplicar migraciones
npm run db:generate
npm run db:push
```

Ver [DATABASE.md](./DATABASE.md) para más detalles sobre la configuración de la base de datos.

5. **Configurar autenticación (opcional)**:

Para usar la API con tokens Bearer desde otras aplicaciones:

```bash
# Ver guía rápida
cat QUICK_START_API.md

# Documentación completa
cat API_BEARER_TOKENS.md
```

## 🚀 Uso

### Modo desarrollo:
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Modo producción:
```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
chat-bot-kunoro/
├── app/
│   ├── api/
│   │   ├── auth/                 # Autenticación con Better Auth
│   │   ├── chat/                 # Endpoint del chatbot
│   │   ├── tokens/               # Gestión de tokens Bearer
│   │   │   ├── generate/         # Generar tokens
│   │   │   ├── list/             # Listar tokens
│   │   │   └── revoke/           # Revocar tokens
│   │   └── v1/                   # API pública con Bearer auth
│   │       ├── account/          # Info de cuenta
│   │       ├── chat/             # Chat API
│   │       └── sites/            # Gestión de sitios
│   ├── dashboard/                # Dashboard del admin
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página de inicio
├── components/
│   └── ChatWidget.tsx            # Componente del widget de chat
├── db/
│   └── schema.ts                 # Schema de Drizzle ORM
├── lib/
│   ├── auth.ts                   # Configuración Better Auth
│   ├── bearer-auth.ts            # Middleware Bearer tokens
│   └── session.ts                # Gestión de sesiones
├── public/                       # Archivos estáticos
├── API_BEARER_TOKENS.md          # Documentación de tokens API
├── EJEMPLOS_API.md               # Ejemplos de código
├── QUICK_START_API.md            # Guía rápida
├── DATABASE.md                   # Configuración de BD
├── plan.md                       # Roadmap del producto
├── .env.example                  # Ejemplo de variables de entorno
└── package.json                  # Dependencias del proyecto
```

## 🎨 Personalización

### Modificar el comportamiento del chatbot

Edita el `SYSTEM_PROMPT` en `app/api/chat/route.ts` para cambiar:
- La personalidad del asistente
- El conocimiento específico del dominio
- El tono de las respuestas

### Cambiar el diseño

Modifica `components/ChatWidget.tsx` para:
- Cambiar colores (actualmente usa gradiente azul-púrpura)
- Ajustar el tamaño del widget
- Modificar animaciones
- Cambiar la posición del botón flotante

### Personalizar estilos

Edita `tailwind.config.ts` para:
- Cambiar la paleta de colores
- Agregar nuevas animaciones
- Modificar breakpoints responsive

## 🔧 Configuración Avanzada

### Cambiar el modelo de IA

En `app/api/chat/route.ts`, modifica:
```typescript
model: 'gpt-4-turbo-preview', // Cambia a 'gpt-3.5-turbo' para menor costo
```

### Ajustar la creatividad de las respuestas

Modifica el parámetro `temperature`:
```typescript
temperature: 0.7, // 0 = más determinista, 1 = más creativo
```

### Limitar la longitud de respuestas

Ajusta `max_tokens`:
```typescript
max_tokens: 500, // Número máximo de tokens en la respuesta
```

## 🔐 API REST con Tokens Bearer

Este proyecto incluye una API REST completa con autenticación Bearer para integrar con aplicaciones externas.

### Características de la API

- ✅ Autenticación con tokens Bearer seguros
- ✅ Control de permisos con scopes
- ✅ Tokens con expiración configurable
- ✅ Gestión de tokens desde el dashboard
- ✅ Endpoints para chat, cuentas y sitios

### Quick Start API

```bash
# 1. Generar migración para tokens
npm run db:generate && npm run db:push

# 2. Iniciar el servidor de pruebas
npm run test-api    # En otra terminal

# 3. Abrir interfaz web
# http://localhost:8888

# 4. Generar token desde el dashboard o con cURL
curl -X POST http://localhost:3000/api/tokens/generate \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name": "Mi App", "scopes": ["*"]}'

# 5. Usar el token en la interfaz o con cURL
curl -H "Authorization: Bearer kunoro_xxx..." \
  http://localhost:3000/api/v1/account
```

### Gestión de Tokens desde el Dashboard 🎨

Interfaz completa integrada en el dashboard para gestionar tokens:

**Características:**
- ✅ Generar tokens con formulario intuitivo
- ✅ Ver lista de todos tus tokens
- ✅ Revocar tokens con un click
- ✅ Ver última vez usado y fecha de expiración
- ✅ Control granular de permisos (scopes)
- ✅ Estadísticas de tokens activos/expirados

**Acceso:**
1. Ve a `/dashboard` e inicia sesión
2. Click en ⚙️ Configuración
3. Click en 🔐 Tokens API
4. Genera y gestiona tus tokens

### Interfaz de Prueba Interactiva 🧪

Servidor de pruebas con interfaz web para probar la API:

```bash
npm run test-api
# Abre http://localhost:8888
```

**Características:**
- ✅ Interfaz visual moderna y atractiva
- ✅ Guarda tokens en localStorage
- ✅ Prueba todos los endpoints con un clic
- ✅ Chat interactivo en tiempo real
- ✅ Logs de todas las peticiones

### Documentación Completa

- 📚 [Índice de Documentación](./docs/README.md) - Vista general de toda la documentación
- 📘 [API Bearer Tokens](./docs/api/API_BEARER_TOKENS.md) - Guía completa de autenticación
- 💻 [Ejemplos de Código](./docs/api/EJEMPLOS_API.md) - Ejemplos en JS, Python, PHP, etc.
- ⚡ [Quick Start](./docs/guides/QUICK_START_API.md) - Comienza en 5 minutos
- 🧪 [Cómo Probar](./docs/guides/COMO_PROBAR.md) - Guía completa de pruebas

## 🎨 Widget CDN Embebible

Instala el widget de chat en cualquier sitio web con una sola línea de código.

### 🚀 Instalación Rápida

```html
<!-- Pega esto antes de cerrar </body> -->
<script 
  src="https://tudominio.com/widget.js" 
  data-app-id="tu-app-id-aqui"
></script>
```

### 📋 Cómo Obtener tu APP ID

1. Ve a `/dashboard` e inicia sesión
2. Click en ⚙️ **Configuración**
3. Tu **APP ID** está visible en la sección de instalación
4. Copia el código de instalación completo

### ✨ Características del Widget

- 💬 **Chat flotante** en la esquina inferior derecha
- 🎨 **Diseño hermoso** con gradientes modernos
- 📱 **100% responsive** - funciona en móviles y desktop
- ⚡ **Carga ultra rápida** - menos de 30KB
- 🤖 **IA integrada** - respuestas automáticas con OpenAI
- 💾 **Conversaciones persistentes** - mantiene el historial
- 🌐 **Sin dependencias** - JavaScript vanilla puro

### 🎮 API JavaScript del Widget

Controla el widget programáticamente:

```javascript
// Abrir el chat
window.KunoroWidget.open();

// Cerrar el chat
window.KunoroWidget.close();

// Toggle (abrir/cerrar)
window.KunoroWidget.toggle();

// Enviar mensaje programáticamente
window.KunoroWidget.sendMessage('Hola, necesito ayuda');
```

### 🧪 Probar el Widget Localmente

```bash
# 1. Inicia el servidor
npm run dev

# 2. Abre la demo
open http://localhost:3000/demo.html

# 3. Reemplaza YOUR_APP_ID con tu ID real
```

### ⚙️ Configuración Avanzada

```html
<script 
  src="https://tudominio.com/widget.js" 
  data-app-id="tu-app-id-aqui"
  data-api-url="https://api.tudominio.com"
></script>

<script>
  // Abrir automáticamente después de 5 segundos
  setTimeout(() => {
    window.KunoroWidget.open();
  }, 5000);
  
  // Enviar evento de bienvenida personalizado
  window.addEventListener('load', () => {
    console.log('Widget cargado:', window.KunoroWidget);
  });
</script>
```

### 🎯 Casos de Uso

- **Soporte al cliente** - Responde preguntas frecuentes 24/7
- **Lead generation** - Captura información de visitantes
- **Onboarding** - Guía a nuevos usuarios
- **Ventas** - Asiste en el proceso de compra
- **FAQ dinámico** - Respuestas inteligentes basadas en IA

## 🌐 Despliegue

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Agrega las variables de entorno:
   - `OPENAI_API_KEY`
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL`
   - Variables de BD (MySQL)
4. Despliega

### Otros proveedores

El proyecto es compatible con cualquier plataforma que soporte Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Run

## 💡 Ejemplos de Uso

El chatbot puede responder preguntas como:
- "¿Cómo compro entradas en Bookforce?"
- "¿Qué métodos de pago aceptan?"
- "¿Cómo cancelo una reserva?"
- "¿Puedo crear mis propios eventos?"
- "¿Cómo funciona el sistema de códigos QR?"

## 🔒 Seguridad

- ✅ API Key almacenada en variables de entorno
- ✅ Validación de requests en el backend
- ✅ Manejo de errores robusto
- ✅ Rate limiting de OpenAI
- ✅ Sin exposición de datos sensibles al cliente

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Soporte

Si tienes preguntas o problemas, por favor abre un issue en el repositorio.

---

Hecho con ❤️ para Bookforce
