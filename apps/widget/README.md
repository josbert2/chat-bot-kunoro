# Kunoro Widget

Widget de chat en vivo para integrar en cualquier sitio web.

## 🚀 Desarrollo

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo (puerto 3003)
pnpm dev

# Build para producción
pnpm build

# Preview del build
pnpm preview
```

## 🎨 Preview en Vivo

Durante el desarrollo, abre `http://localhost:3003` para ver el preview interactivo del widget.

Puedes cambiar:
- **App ID**: El identificador de tu aplicación
- **Color de Fondo**: Color del header del widget
- **Color de Acción**: Color de botones y mensajes del usuario

## 📦 Instalación en tu Sitio

### Opción 1: Desde CDN (Producción)

```html
<script 
  src="https://tu-cdn.com/widget.js"
  data-app-id="tu-app-id"
  data-color-background="#0F172A"
  data-color-action="#2563EB"
></script>
```

### Opción 2: Desde el Dashboard

El dashboard genera automáticamente el código de instalación con tus colores personalizados en la sección de configuración.

## ⚙️ Configuración

### Data Attributes

| Atributo | Requerido | Descripción | Default |
|----------|-----------|-------------|---------|
| `data-app-id` | ✅ | ID único de tu aplicación | - |
| `data-api-url` | ❌ | URL del API | `http://localhost:3001` |
| `data-color-background` | ❌ | Color del header (hex) | `#0F172A` |
| `data-color-action` | ❌ | Color de acción (hex) | `#2563EB` |

### Ejemplo Completo

```html
<script 
  src="https://kunoro.com/widget.js"
  data-app-id="app_abc123xyz"
  data-api-url="https://api.kunoro.com"
  data-color-background="#1E293B"
  data-color-action="#3B82F6"
></script>
```

## 🎯 API Pública del Widget

Una vez cargado, el widget expone una API global:

```javascript
// Abrir el widget
window.KunoroWidget.open();

// Cerrar el widget
window.KunoroWidget.close();

// Toggle (abrir/cerrar)
window.KunoroWidget.toggle();

// Enviar mensaje programáticamente
window.KunoroWidget.sendMessage('Hola, necesito ayuda');
```

### Ejemplo de Uso

```html
<button onclick="window.KunoroWidget.open()">
  💬 Abrir Chat
</button>

<button onclick="window.KunoroWidget.sendMessage('Quiero información sobre precios')">
  💰 Consultar Precios
</button>
```

## 🏗️ Arquitectura

```
apps/widget/
├── src/
│   ├── main.ts              # Entry point
│   ├── bootstrap.ts         # Inicialización
│   ├── api/
│   │   └── client.ts        # Cliente API
│   ├── ui/
│   │   └── widget-ui.ts     # UI del widget
│   ├── utils/
│   │   ├── theme.ts         # Configuración de colores
│   │   └── storage.ts       # LocalStorage helpers
│   └── socket/
│       └── socket.ts        # WebSocket (futuro)
├── index.html               # Preview de desarrollo
├── vite.config.ts          # Configuración de Vite
└── package.json
```

## 📊 Flujo de Carga

1. El script se carga en el sitio del cliente
2. Se lee `data-app-id` y otros data attributes
3. Se llama al API `/v1/widget/init` para obtener configuración
4. Los colores de data attributes tienen prioridad sobre los del API
5. Se inyectan estilos CSS dinámicos con los colores
6. Se crea el HTML del widget
7. Se configuran event listeners
8. El widget queda listo para usar

## 🎨 Personalización de Colores

El widget detecta automáticamente si un color es oscuro o claro y ajusta el color del texto para mantener el contraste adecuado:

- **Colores oscuros**: Texto blanco (`#ffffff`)
- **Colores claros**: Texto oscuro (`#111827`)

## 🔌 Conexión con API

El widget se conecta con tu API Express en `/v1/widget/*`:

- `POST /v1/widget/init` - Inicializar widget y obtener configuración
- `POST /v1/widget/messages` - Enviar mensajes

## 📝 Notas

- El widget usa **IIFE** (Immediately Invoked Function Expression) para evitar conflictos
- No tiene dependencias externas en runtime
- El bundle compilado pesa aproximadamente **~15KB** (minificado)
- Compatible con todos los navegadores modernos (ES2015+)

## 🚢 Deploy a CDN

Después de hacer `pnpm build`, el archivo `dist/widget.js` está listo para subir a tu CDN favorito:

- Cloudflare Pages
- Vercel
- Netlify
- AWS S3 + CloudFront
- etc.

## 📄 Licencia

Propietario - Kunoro

