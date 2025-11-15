# 🚀 Instalación del Widget - Bookforce Chat

## Instalación (1 línea)

Pega este código **antes de cerrar `</body>`** en tu sitio web:

```html
<script 
  src="https://tudominio.com/widget.js" 
  data-app-id="tu-app-id-aqui"
  async
></script>
```

## 🧪 Ejemplo Completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Mi Sitio</title>
</head>
<body>
  <h1>Hola Mundo</h1>
  <p>Mi contenido aquí...</p>

  <!-- Widget Bookforce -->
  <script 
    src="https://tudominio.com/widget.js" 
    data-app-id="abc123xyz"
    async
  ></script>
</body>
</html>
```

## 📋 Obtener tu APP ID

### Opción 1: Desde el Dashboard
1. Ve a `https://tudominio.com/dashboard`
2. Click en **⚙️ Configuración**
3. Copia tu **APP ID**

### Opción 2: Desde la Base de Datos
```sql
SELECT app_id, name FROM sites WHERE account_id = 'tu-account-id';
```

## 🌍 URLs según el entorno

### Local (Desarrollo)
```html
<script 
  src="http://localhost:3000/widget.js" 
  data-app-id="test-demo"
  async
></script>
```

### Producción
```html
<script 
  src="https://tudominio.com/widget.js" 
  data-app-id="abc123xyz"
  async
></script>
```

### Con CDN personalizado (Opcional)
```html
<script 
  src="https://cdn.tudominio.com/widget.js" 
  data-app-id="abc123xyz"
  data-api-url="https://api.tudominio.com"
  async
></script>
```

## ⚡ Características

- ✅ **1 línea de código** - Sin complicaciones
- ✅ **Carga asíncrona** - No bloquea tu página
- ✅ **Diseño moderno** - UI tipo Intercom/Tidio
- ✅ **IA integrada** - Respuestas automáticas con GPT
- ✅ **Responsive** - Funciona en móvil y desktop
- ✅ **Persistente** - Mantiene conversaciones
- ✅ **Sin dependencias** - JavaScript puro

## 🎮 API JavaScript (Opcional)

Controla el widget programáticamente:

```javascript
// Abrir el chat
window.KunoroWidget.open();

// Cerrar el chat
window.KunoroWidget.close();

// Enviar mensaje automático
window.KunoroWidget.sendMessage('Hola, necesito ayuda');
```

### Ejemplo: Abrir automáticamente después de 5 segundos

```html
<script>
  setTimeout(function() {
    window.KunoroWidget.open();
  }, 5000);
</script>
```

### Ejemplo: Botón personalizado

```html
<button onclick="window.KunoroWidget.open()">
  💬 Contactar Soporte
</button>
```

## 🧪 Probar Localmente

1. **Abre el ejemplo:**
```bash
open /tmp/ejemplo-sitio-externo.html
# o en Linux/WSL:
xdg-open /tmp/ejemplo-sitio-externo.html
```

2. **Verifica que funcione:**
   - ✅ Ves el botón flotante (esquina inferior derecha)
   - ✅ Click en el botón abre el chat
   - ✅ Puedes enviar mensajes
   - ✅ La IA responde correctamente

## 📦 Archivos del Widget

```
chat-bot-kunoro/
├── public/
│   ├── widget.js          ← El widget embebible (se sirve automáticamente)
│   └── demo.html          ← Demo interactiva
├── app/api/public/chat/   ← Endpoint del chat (sin auth)
└── INSTALL.md             ← Esta guía
```

## 🔧 Configuración Avanzada

### Personalizar URL del API

Si tu API está en un dominio diferente:

```html
<script 
  src="https://cdn.tudominio.com/widget.js" 
  data-app-id="abc123"
  data-api-url="https://api.otrdominio.com"
  async
></script>
```

### Headers CORS

El widget ya incluye headers CORS habilitados. Funciona desde cualquier dominio.

## 🐛 Troubleshooting

### El widget no aparece

**Verifica:**
1. ¿El script está antes de `</body>`?
2. ¿El `data-app-id` es correcto?
3. ¿El servidor está corriendo?

**En la consola del navegador:**
```javascript
console.log(window.KunoroWidget);
// Debería mostrar: {open: ƒ, close: ƒ, toggle: ƒ, sendMessage: ƒ}
```

### Error CORS

El widget ya incluye headers CORS. Si persiste:
1. Verifica que `/api/public/chat` esté accesible
2. Revisa `lib/cors.ts` en el proyecto

### El chat no responde

1. Verifica tu `OPENAI_API_KEY` en `.env`
2. Revisa la consola del servidor Next.js
3. Verifica que la base de datos esté corriendo

## 🚀 Despliegue a Producción

### 1. Despliega tu proyecto Next.js
```bash
npm run build
npm start
```

### 2. Configura tu dominio
- Apunta `tudominio.com` a tu servidor
- El widget estará en `https://tudominio.com/widget.js`

### 3. Actualiza el código en tus sitios
```html
<script 
  src="https://tudominio.com/widget.js" 
  data-app-id="production-app-id"
  async
></script>
```

## 📊 Monitorear Conversaciones

Las conversaciones se guardan en la base de datos:

```sql
-- Ver conversaciones recientes
SELECT * FROM conversations 
ORDER BY created_at DESC 
LIMIT 10;

-- Ver mensajes de una conversación
SELECT role, content, created_at 
FROM messages 
WHERE conversation_id = 'abc-123'
ORDER BY created_at ASC;
```

## 💡 Casos de Uso

- **E-commerce:** Soporte en tiempo real para compradores
- **SaaS:** Onboarding de nuevos usuarios
- **Blog/Noticias:** Responder preguntas de lectores
- **Landing Pages:** Capturar leads
- **Portafolio:** Chat profesional para clientes

## 📞 Soporte

¿Problemas? Revisa:
1. [Documentación completa](./docs/README.md)
2. [Guía del widget CDN](./docs/guides/WIDGET_CDN.md)
3. [README principal](./README.md)

---

**¡Listo para usar!** 🎉

Como Tidio/Intercom, pero con IA y código abierto.

