# 🎨 Desarrollo del Widget - Guía Completa

Este documento explica cómo trabajar con el sistema de widget de Kunoro.

## 📁 Estructura del Proyecto

```
chat-bot-kunoro/
├── apps/
│   ├── widget/              # ⭐ Widget independiente (TypeScript + Vite)
│   │   ├── src/
│   │   ├── dist/            # Build compilado
│   │   ├── index.html       # Preview de desarrollo
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   ├── dashboard/           # Dashboard Next.js
│   │   ├── public/
│   │   │   └── widget.js    # Widget compilado (copiado desde apps/widget/dist)
│   │   └── app/
│   │       └── widget-test/ # Página de testing
│   │
│   └── api-express/         # API Express
│       └── src/routes/
│           └── widget.routes.ts
```

## 🚀 Workflow Completo

### 1️⃣ Desarrollo del Widget

```bash
# Terminal 1: Widget
cd apps/widget
pnpm install
pnpm dev
# Servidor en http://localhost:3003
```

Abre `http://localhost:3003` para el preview interactivo con controles de colores.

### 2️⃣ Desarrollo del Dashboard (con widget en vivo)

```bash
# Terminal 2: Dashboard
cd apps/dashboard
pnpm dev
# Servidor en http://localhost:3000
```

Ve a `http://localhost:3000/widget-test` y selecciona **"Dev"** para usar el widget en desarrollo.

### 3️⃣ API Express (backend)

```bash
# Terminal 3: API
cd apps/api-express
pnpm dev
# Servidor en http://localhost:3001
```

## 🎯 Casos de Uso

### Caso 1: Desarrollo de nueva funcionalidad en el widget

1. Edita archivos en `apps/widget/src/`
2. El widget se recarga automáticamente en `http://localhost:3003`
3. Prueba en el dashboard usando modo "Dev"

**Archivos principales:**
- `src/bootstrap.ts` - Inicialización y configuración
- `src/ui/widget-ui.ts` - UI y estilos del widget
- `src/utils/theme.ts` - Gestión de colores

### Caso 2: Probar widget con colores personalizados

**Opción A: Preview standalone**
1. Ve a `http://localhost:3003`
2. Cambia colores en los controles
3. Haz clic en "Recargar Widget"

**Opción B: Desde el dashboard**
1. Ve a `http://localhost:3000/dashboard/settings`
2. Cambia colores en "Apariencia del widget"
3. Haz clic en "Vista previa"

### Caso 3: Compilar para producción

```bash
cd apps/widget
pnpm build
# Genera dist/widget.js optimizado (~15KB)
```

Para copiar automáticamente al dashboard:

```bash
pnpm build:dashboard
```

Esto hace:
1. Compila el widget
2. Copia `dist/widget.js` → `../dashboard/public/widget.js`

## 🧪 Testing

### Test en modo Development

1. Widget: `pnpm dev` en puerto 3003
2. Dashboard: selecciona botón "Dev" en `/widget-test`
3. Ventaja: Hot reload, cambios en tiempo real

### Test en modo Build

1. `pnpm build:dashboard` en `apps/widget`
2. Dashboard: selecciona botón "Build" en `/widget-test`
3. Ventaja: Probar versión optimizada y minificada

### Test en sitio externo (simulación producción)

Crea un archivo HTML de prueba:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Widget</title>
</head>
<body>
  <h1>Mi Sitio de Prueba</h1>
  
  <!-- Widget -->
  <script 
    src="http://localhost:3000/widget.js"
    data-app-id="demo-app-id"
    data-api-url="http://localhost:3001"
    data-color-background="#1E293B"
    data-color-action="#3B82F6"
  ></script>
</body>
</html>
```

## 🎨 Personalización de Colores

### Flujo de prioridad de colores:

1. **Data attributes** (mayor prioridad)
   ```html
   data-color-background="#0F172A"
   data-color-action="#2563EB"
   ```

2. **API Response** (si no hay data attributes)
   ```json
   {
     "widgetConfig": {
       "colors": {
         "background": "#0F172A",
         "action": "#2563EB"
       }
     }
   }
   ```

3. **Default hardcoded** (si fallan las anteriores)
   ```typescript
   background: '#0F172A',
   action: '#2563EB'
   ```

### Agregar nuevos colores

1. Edita `apps/widget/src/utils/theme.ts`:

```typescript
export interface WidgetColors {
  background: string;
  action: string;
  // Agregar nuevo color
  accent: string;
}
```

2. Actualiza `DEFAULT_COLORS`
3. Usa en `widget-ui.ts` dentro de los estilos

## 🔌 Integración con API

### Endpoints que usa el widget:

```
POST /v1/widget/init
- Headers: x-site-key
- Body: { visitorId?, pageUrl, userAgent }
- Response: { visitorId, widgetConfig }

POST /v1/widget/messages  
- Headers: x-site-key
- Body: { conversationId?, content }
- Response: { conversationId, message }
```

### Agregar nuevo endpoint

1. Crea en `apps/api-express/src/routes/widget.routes.ts`
2. Llama desde `apps/widget/src/api/client.ts`

## 📦 Build y Deploy

### Build local

```bash
cd apps/widget
pnpm build
```

Output: `dist/widget.js` (~15KB minificado)

### Deploy a CDN

```bash
# Opción 1: Vercel
cd apps/widget
vercel --prod

# Opción 2: Netlify
netlify deploy --dir=dist --prod

# Opción 3: AWS S3
aws s3 cp dist/widget.js s3://kunoro-cdn/widget.js \
  --acl public-read \
  --cache-control "public, max-age=31536000"
```

### Actualizar código de instalación

Después del deploy, actualiza la URL en el dashboard:

```javascript
// apps/dashboard/app/dashboard/settings/page.tsx
const code = `<script src="https://cdn.kunoro.com/widget.js" ...></script>`;
```

## 🐛 Debugging

### Console logs

El widget usa prefijo `[Kunoro Widget]`:

```javascript
console.log('[Kunoro Widget] Inicializando v1.0.0 para app: demo');
console.log('[Kunoro Widget] Colores:', { background, action });
console.log('[Kunoro Widget] ✅ Widget cargado correctamente');
```

### Verificar carga

En la consola del navegador:

```javascript
// Verificar que el widget existe
window.KunoroWidget

// Debe retornar:
// {
//   open: ƒ,
//   close: ƒ,
//   toggle: ƒ,
//   sendMessage: ƒ
// }
```

### Inspeccionar elementos

```javascript
// Ver widget DOM
document.getElementById('kunoro-chat-widget')

// Ver estilos inyectados
document.getElementById('kunoro-widget-styles')
```

## 📋 Checklist de Cambios

Antes de hacer commit de cambios en el widget:

- [ ] `pnpm dev` funciona sin errores
- [ ] `pnpm build` compila exitosamente
- [ ] Probar en preview standalone (`http://localhost:3003`)
- [ ] Probar en dashboard modo "Dev"
- [ ] Probar en dashboard modo "Build"
- [ ] Verificar colores personalizados
- [ ] Verificar responsiveness (mobile)
- [ ] Verificar mensajes de chat
- [ ] Verificar typing indicator
- [ ] Verificar abrir/cerrar widget
- [ ] Actualizar `apps/dashboard/public/widget.js` si es necesario

## 🔄 Flujo Git

```bash
# Desarrollo del widget
cd apps/widget
git checkout -b feature/new-widget-feature

# Hacer cambios...

# Build final
pnpm build:dashboard

# Commit
git add .
git commit -m "feat(widget): agregar nueva funcionalidad"

# Push y PR
git push origin feature/new-widget-feature
```

## 📚 Recursos

- **Widget Source**: `apps/widget/src/`
- **Preview Page**: `http://localhost:3003`
- **Dashboard Test**: `http://localhost:3000/widget-test`
- **API Routes**: `apps/api-express/src/routes/widget.routes.ts`
- **README**: `apps/widget/README.md`
- **Quickstart**: `apps/widget/QUICKSTART.md`

## 🆘 Problemas Comunes

### El widget no se recarga en modo Dev
- Verifica que `pnpm dev` esté corriendo en `apps/widget`
- Puerto 3003 debe estar libre
- Revisa CORS en la consola

### Los colores no se aplican
- Verifica formato hex: `#0F172A` (6 dígitos)
- Verifica que empiecen con `#`
- Revisa logs en consola: `[Kunoro Widget] Colores:`

### Build muy grande
- Vite ya hace tree-shaking y minificación
- Tamaño esperado: ~15KB
- Si es mayor, revisa dependencies no necesarias

### Widget no se ve en producción
- Verifica que el script `src=` apunte a la URL correcta
- Verifica `data-app-id` esté presente
- Revisa Network tab para errores 404

---

**¿Dudas?** Revisa `apps/widget/QUICKSTART.md` o la consola del navegador (F12).

