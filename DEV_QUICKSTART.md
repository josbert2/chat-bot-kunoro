# 🚀 Desarrollo Rápido - Kunoro

## Inicio Super Rápido (1 comando)

```bash
./dev-start.sh
```

Esto inicia:
- ✅ API Express (puerto 3001)
- ✅ Widget en modo dev (puerto 3003)
- ✅ Dashboard (puerto 3000)

**Luego abre**: `http://localhost:3000`

## Detener Todo

```bash
./dev-stop.sh
```

## 🎨 Widget en Modo Desarrollo

### ✨ Auto-Detección

El dashboard **detecta automáticamente** si el widget está en modo desarrollo:

- ✅ **Si detecta puerto 3003**: Usa widget dev (hot reload)
- ⚠️ **Si no detecta**: Usa widget compilado (`/public/widget.js`)

### Cambios en el Widget

1. Edita archivos en `apps/widget/src/`
2. Los cambios se aplican **automáticamente** (hot reload)
3. Recarga la página del dashboard o `/widget-test`

**No necesitas compilar** mientras desarrollas! 🎉

## 📋 URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Dashboard | http://localhost:3000 | Aplicación principal |
| Settings | http://localhost:3000/dashboard/settings | Configuración de colores |
| Widget Test | http://localhost:3000/widget-test | Preview del widget |
| Widget Dev | http://localhost:3003 | Preview standalone del widget |
| API | http://localhost:3001 | API Express |

## 🎯 Workflow Típico

### 1. Cambiar Colores del Widget

```bash
# Ve al dashboard
http://localhost:3000/dashboard/settings

# Cambia los colores
Color de fondo: #1E293B
Color de acción: #3B82F6

# Haz clic en "Vista previa"
```

El widget se abrirá con tus nuevos colores **directamente desde el servidor dev** ✨

### 2. Editar el Widget

```bash
# Edita cualquier archivo en apps/widget/src/
code apps/widget/src/ui/widget-ui.ts

# Guarda el archivo
# El widget se recarga automáticamente
```

### 3. Probar el Widget

**Opción A: En el Dashboard**
```
http://localhost:3000/widget-test
```

**Opción B: Standalone**
```
http://localhost:3003
```

## 🔍 Verificar Estado

### Ver si el widget dev está corriendo

```bash
curl http://localhost:3003
# Si responde → Widget dev activo ✅
# Si falla → Widget dev no activo ⚠️
```

### Ver logs

```bash
# Logs del API
tail -f .dev-logs/api-express.log

# Logs del Widget
tail -f .dev-logs/widget.log

# Logs del Dashboard
tail -f .dev-logs/dashboard.log
```

## 🐛 Troubleshooting

### El widget no se ve

1. Abre la consola del navegador (F12)
2. Busca estos logs:
   ```
   ✅ Servidor de desarrollo detectado en puerto 3003
   📦 [Widget Test] Cargando desde servidor de desarrollo
   [Kunoro Widget] Inicializando v1.0.0 para app: demo
   ✅ [Widget Test] Widget cargado exitosamente
   ```

3. Si ves "⚠️ Servidor de desarrollo no disponible":
   ```bash
   cd apps/widget
   pnpm dev
   ```

### Los colores no cambian

1. Verifica que guardaste los cambios en `/dashboard/settings`
2. Recarga `/widget-test`
3. Los colores se pasan por URL: `?background=%23...&action=%23...`

### Puerto ocupado

```bash
# Liberar puerto 3003 (Widget)
lsof -ti:3003 | xargs kill -9

# Liberar puerto 3000 (Dashboard)
lsof -ti:3000 | xargs kill -9

# Liberar puerto 3001 (API)
lsof -ti:3001 | xargs kill -9
```

## 🎓 Estructura

```
chat-bot-kunoro/
├── apps/
│   ├── widget/          ← Edita aquí para cambiar el widget
│   │   ├── src/
│   │   │   ├── bootstrap.ts
│   │   │   ├── ui/widget-ui.ts
│   │   │   └── utils/theme.ts
│   │   └── index.html   ← Preview standalone
│   │
│   ├── dashboard/       ← Dashboard Next.js
│   │   └── app/
│   │       └── widget-test/  ← Testing page
│   │
│   └── api-express/     ← API backend
│
├── dev-start.sh         ← Inicia todo
└── dev-stop.sh          ← Detiene todo
```

## 🚢 Compilar para Producción

Cuando termines de desarrollar:

```bash
cd apps/widget
pnpm build:dashboard  # Compila + copia al dashboard
```

Esto genera `dist/widget.js` optimizado y lo copia a `apps/dashboard/public/`

## 💡 Tips

### Hot Reload

El widget tiene **hot reload automático** en modo dev. No necesitas recargar manualmente.

### Debug

Todos los logs del widget usan el prefijo `[Kunoro Widget]`:

```javascript
// En la consola del navegador
[Kunoro Widget] Inicializando v1.0.0 para app: demo
[Kunoro Widget] Colores: {background: '#0F172A', action: '#2563EB'}
[Kunoro Widget] ✅ Widget cargado correctamente
```

### Cambiar entre Dev y Build

En `/widget-test`, usa los botones **"Dev"** y **"Build"** para alternar.

---

**¿Problemas?** Mira los logs en `.dev-logs/` o revisa la consola del navegador.

