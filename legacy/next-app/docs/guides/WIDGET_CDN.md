# 🎨 Widget CDN Embebible - Guía Completa

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Instalación Rápida](#instalación-rápida)
- [Cómo Obtener tu APP ID](#cómo-obtener-tu-app-id)
- [Características](#características)
- [API JavaScript](#api-javascript)
- [Configuración Avanzada](#configuración-avanzada)
- [Personalización](#personalización)
- [Casos de Uso](#casos-de-uso)
- [Troubleshooting](#troubleshooting)

## 🚀 Introducción

El widget de Kunoro es un chat embebible que puedes instalar en cualquier sitio web con una sola línea de código. Incluye:

- ✅ Chat flotante con diseño moderno
- ✅ IA conversacional integrada (OpenAI GPT-3.5)
- ✅ Persistencia de conversaciones
- ✅ 100% responsive
- ✅ Sin dependencias externas
- ✅ Menos de 30KB

## 🔧 Instalación Rápida

### Paso 1: Copia el código de instalación

```html
<!-- Pega esto antes de cerrar </body> -->
<script 
  src="https://tudominio.com/widget.js" 
  data-app-id="tu-app-id-aqui"
></script>
```

### Paso 2: Reemplaza los valores

- `https://tudominio.com` → Tu dominio donde está desplegado Kunoro
- `tu-app-id-aqui` → Tu APP ID único (ver siguiente sección)

### Paso 3: ¡Listo!

Recarga tu página y verás el widget de chat en la esquina inferior derecha.

## 📋 Cómo Obtener tu APP ID

### Desde el Dashboard

1. Ve a `https://tudominio.com/dashboard`
2. Inicia sesión con tu cuenta
3. Click en ⚙️ **Configuración**
4. En la sección **Instalación del Widget** encontrarás:
   - Tu **APP ID** único
   - El código completo de instalación listo para copiar

### Desde la Base de Datos

Si necesitas obtenerlo directamente:

```sql
SELECT app_id, name, domain 
FROM sites 
WHERE account_id = 'tu-account-id';
```

### Crear un Nuevo Sitio

Si aún no tienes un sitio creado:

1. Ve al Dashboard → Configuración
2. Click en **Nuevo Sitio**
3. Ingresa el nombre y dominio
4. Se generará automáticamente tu APP ID

## ✨ Características

### Diseño Moderno

- Botón flotante con gradiente personalizable
- Ventana de chat con animaciones suaves
- Indicador de escritura en tiempo real
- Avatares para usuario y bot
- Scroll automático a nuevos mensajes

### Funcionalidad

- **Chat en tiempo real**: Respuestas instantáneas con IA
- **Persistencia**: Las conversaciones se guardan automáticamente
- **SessionID**: Mantiene el contexto entre recargas
- **Metadata**: Captura URL, referrer y userAgent automáticamente
- **CORS habilitado**: Funciona desde cualquier dominio

### Responsive

- Desktop: Ventana de 380x600px
- Mobile: Full width con altura adaptable
- Touch-friendly: Optimizado para dispositivos táctiles

## 🎮 API JavaScript

El widget expone una API global que puedes usar para controlarlo programáticamente.

### Métodos Disponibles

```javascript
// Abrir el chat
window.KunoroWidget.open();

// Cerrar el chat
window.KunoroWidget.close();

// Toggle (abrir/cerrar)
window.KunoroWidget.toggle();

// Enviar mensaje programáticamente
window.KunoroWidget.sendMessage('Hola, necesito ayuda con mi pedido');
```

### Ejemplos de Uso

#### Abrir automáticamente después de 5 segundos

```html
<script>
  setTimeout(() => {
    window.KunoroWidget.open();
  }, 5000);
</script>
```

#### Abrir al hacer clic en un botón personalizado

```html
<button onclick="window.KunoroWidget.open()">
  💬 ¿Necesitas ayuda?
</button>
```

#### Enviar mensaje predefinido al hacer clic

```html
<button onclick="window.KunoroWidget.sendMessage('¿Cuáles son los precios?')">
  Ver Precios
</button>
```

#### Detectar cuando el widget está listo

```javascript
window.addEventListener('load', () => {
  if (window.KunoroWidget) {
    console.log('✅ Widget de Kunoro cargado correctamente');
  }
});
```

## ⚙️ Configuración Avanzada

### Especificar API URL Personalizada

Útil para desarrollo local o múltiples entornos:

```html
<script 
  src="https://cdn.kunoro.com/widget.js" 
  data-app-id="abc123"
  data-api-url="http://localhost:3000"
></script>
```

### Cargar Async para Mejor Performance

```html
<script 
  src="https://cdn.kunoro.com/widget.js" 
  data-app-id="abc123"
  async
></script>
```

### Defer para Cargar Después del DOM

```html
<script 
  src="https://cdn.kunoro.com/widget.js" 
  data-app-id="abc123"
  defer
></script>
```

## 🎨 Personalización

### Colores y Estilos

El widget usa CSS embebido, pero puedes sobrescribir los estilos:

```html
<style>
  /* Cambiar el color del botón */
  #kunoro-chat-button {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%) !important;
  }

  /* Cambiar el color del header */
  #kunoro-chat-header {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%) !important;
  }

  /* Cambiar el color de los mensajes del usuario */
  .kunoro-message.user .kunoro-message-content {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%) !important;
  }
</style>
```

### Posición del Widget

```html
<style>
  /* Cambiar a la esquina inferior izquierda */
  #kunoro-chat-widget {
    left: 20px !important;
    right: auto !important;
  }
  
  #kunoro-chat-window {
    left: 20px !important;
    right: auto !important;
  }
</style>
```

### Tamaño del Widget

```html
<style>
  /* Hacer el widget más grande */
  #kunoro-chat-window {
    width: 450px !important;
    height: 700px !important;
  }
</style>
```

## 🎯 Casos de Uso

### 1. Soporte al Cliente 24/7

```html
<!-- Atención automática con IA -->
<script 
  src="https://soporte.miempresa.com/widget.js" 
  data-app-id="support-bot-001"
></script>
```

### 2. Lead Generation

```javascript
// Captura información antes de permitir ciertas acciones
document.getElementById('download-btn').addEventListener('click', (e) => {
  e.preventDefault();
  window.KunoroWidget.sendMessage('Quiero descargar el ebook');
  window.KunoroWidget.open();
});
```

### 3. Onboarding Interactivo

```javascript
// Guiar al usuario en su primera visita
if (!localStorage.getItem('visited')) {
  setTimeout(() => {
    window.KunoroWidget.sendMessage('¡Bienvenido! ¿En qué puedo ayudarte?');
    window.KunoroWidget.open();
    localStorage.setItem('visited', 'true');
  }, 3000);
}
```

### 4. Asistente de Ventas

```html
<!-- En página de productos -->
<button class="product-help" data-product="Laptop Pro 2024">
  ¿Preguntas sobre este producto?
</button>

<script>
  document.querySelectorAll('.product-help').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product;
      window.KunoroWidget.sendMessage(`Tengo preguntas sobre ${product}`);
    });
  });
</script>
```

## 🧪 Testing Local

### Paso 1: Inicia el Servidor

```bash
cd chat-bot-kunoro
npm run dev
```

### Paso 2: Abre la Demo

Visita: `http://localhost:3000/demo.html`

### Paso 3: Prueba el Widget

1. Haz clic en el botón flotante
2. Envía un mensaje
3. Verifica que funcione la IA

### Paso 4: Integra en tu Sitio Local

```html
<!DOCTYPE html>
<html>
<head>
  <title>Mi Sitio de Prueba</title>
</head>
<body>
  <h1>Hola Mundo</h1>
  
  <!-- Widget local -->
  <script 
    src="http://localhost:3000/widget.js" 
    data-app-id="YOUR_APP_ID"
    data-api-url="http://localhost:3000"
  ></script>
</body>
</html>
```

## 🐛 Troubleshooting

### El widget no aparece

**Causa:** APP ID incorrecto o script no cargado

**Solución:**
```javascript
// Abre la consola del navegador y verifica
console.log(window.KunoroWidget);
// Debería mostrar un objeto con métodos: open, close, toggle, sendMessage
```

### Error "No se encontró el script con data-app-id"

**Causa:** Falta el atributo `data-app-id` en el script tag

**Solución:**
```html
<!-- ❌ Incorrecto -->
<script src="/widget.js"></script>

<!-- ✅ Correcto -->
<script src="/widget.js" data-app-id="tu-app-id"></script>
```

### Error "El appId proporcionado no es válido"

**Causa:** El APP ID no existe en la base de datos

**Solución:**
1. Verifica el APP ID en el dashboard
2. O consulta la tabla `sites` en la BD:
```sql
SELECT app_id, name FROM sites WHERE account_id = 'tu-account-id';
```

### El chat no responde

**Causa:** OpenAI API key no configurada o inválida

**Solución:**
```bash
# Verifica tu .env
cat .env | grep OPENAI_API_KEY

# Debe tener una key válida
OPENAI_API_KEY=sk-...
```

### Error CORS

**Causa:** El endpoint `/api/public/chat` necesita headers CORS

**Solución:**
Los headers CORS ya están configurados. Si persiste el error:
```javascript
// Verifica en la consola del navegador
fetch('http://tu-api.com/api/public/chat', {
  method: 'OPTIONS'
}).then(r => console.log(r.headers));
```

### El widget se ve mal en mobile

**Causa:** Viewport no configurado

**Solución:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

## 📊 Monitoreo

### Ver Conversaciones en la BD

```sql
SELECT 
  c.id,
  c.created_at,
  c.status,
  COUNT(m.id) as message_count,
  s.name as site_name
FROM conversations c
LEFT JOIN messages m ON m.conversation_id = c.id
LEFT JOIN sites s ON s.id = c.site_id
GROUP BY c.id
ORDER BY c.created_at DESC
LIMIT 20;
```

### Ver Mensajes de una Conversación

```sql
SELECT 
  role,
  content,
  created_at
FROM messages
WHERE conversation_id = 'conversation-uuid-here'
ORDER BY created_at ASC;
```

## 🚀 Próximos Pasos

1. **Personaliza el Prompt del Bot**: Edita `/app/api/public/chat/route.ts`
2. **Agrega Analytics**: Integra con Google Analytics o Mixpanel
3. **Configura Notificaciones**: Email cuando hay nuevas conversaciones
4. **Dashboards de Métricas**: Visualiza conversaciones en tiempo real
5. **Multi-idioma**: Detecta el idioma del visitante automáticamente

---

¿Necesitas ayuda? Revisa la [documentación completa](../README.md) o abre un issue.

