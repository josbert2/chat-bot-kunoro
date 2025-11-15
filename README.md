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
chat-bot-bookforce/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # API endpoint para el chat
│   ├── globals.css               # Estilos globales
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página de inicio
├── components/
│   └── ChatWidget.tsx            # Componente del widget de chat
├── public/                       # Archivos estáticos
├── .env.example                  # Ejemplo de variables de entorno
├── next.config.mjs              # Configuración de Next.js
├── tailwind.config.ts           # Configuración de Tailwind
├── tsconfig.json                # Configuración de TypeScript
└── package.json                 # Dependencias del proyecto
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

## 🌐 Despliegue

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Agrega la variable de entorno `OPENAI_API_KEY`
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
