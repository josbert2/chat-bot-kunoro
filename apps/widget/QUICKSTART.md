# 🚀 Quickstart - Kunoro Widget

## Desarrollo Local

### 1. Instalar dependencias

```bash
cd apps/widget
pnpm install
```

### 2. Iniciar servidor de desarrollo

```bash
pnpm dev
```

Esto iniciará el servidor en `http://localhost:3003`

### 3. Abrir el preview

Abre tu navegador en `http://localhost:3003` para ver el preview interactivo del widget.

## 🎨 Probar en el Dashboard

### Opción A: Usar el widget de desarrollo

1. Asegúrate de tener el widget corriendo (`pnpm dev` en `apps/widget`)
2. Asegúrate de tener el dashboard corriendo (`pnpm dev` en `apps/dashboard`)
3. Ve a `http://localhost:3000/widget-test?appId=demo&background=%230F172A&action=%232563EB`
4. Haz clic en el botón "Dev" en la parte superior derecha
5. El widget se recargará usando el código en vivo desde el puerto 3003

### Opción B: Usar el widget compilado

1. Compila el widget: `pnpm build` en `apps/widget`
2. Copia `apps/widget/dist/widget.js` a `apps/dashboard/public/widget.js`
3. Ve a `http://localhost:3000/widget-test?appId=demo&background=%230F172A&action=%232563EB`
4. Haz clic en el botón "Build" (está seleccionado por defecto)

## 📦 Build para Producción

### 1. Compilar el widget

```bash
pnpm build
```

Esto generará `dist/widget.js` optimizado y minificado.

### 2. Verificar el build

```bash
pnpm preview
```

Abre `http://localhost:4173` para probar el build.

### 3. Deploy a CDN

Sube el archivo `dist/widget.js` a tu CDN favorito:

```bash
# Ejemplo con Vercel CLI
vercel --prod

# Ejemplo con Netlify CLI  
netlify deploy --prod

# Ejemplo con AWS S3
aws s3 cp dist/widget.js s3://tu-bucket/widget.js --acl public-read
```

## 🔧 Cambiar Colores

### Durante el desarrollo (localhost:3003)

Usa los controles en la página de preview para cambiar colores en tiempo real.

### En el código de instalación

```html
<script 
  src="https://cdn.kunoro.com/widget.js"
  data-app-id="tu-app-id"
  data-color-background="#TU_COLOR_HEADER"
  data-color-action="#TU_COLOR_BOTONES"
></script>
```

### Desde el dashboard

1. Ve a `/dashboard/settings`
2. Sección "Apariencia del widget"
3. Cambia los colores
4. Haz clic en "Vista previa" para ver los cambios
5. Haz clic en "Guardar cambios"
6. Copia el nuevo código de instalación

## 🐛 Debugging

### Ver logs del widget

Abre la consola del navegador (F12) y busca logs que empiecen con:
- `[Kunoro Widget]`
- `[Widget UI]`

### Verificar que el widget se cargó

```javascript
// En la consola del navegador
window.KunoroWidget
// Debe retornar: {open: ƒ, close: ƒ, toggle: ƒ, sendMessage: ƒ}
```

### Problemas comunes

#### El widget no aparece
- Verifica que el script tenga `data-app-id`
- Revisa la consola para errores
- Verifica que el archivo `widget.js` se esté cargando (Network tab)

#### Los colores no se aplican
- Verifica que los colores sean hex válidos (ej: `#0F172A`)
- Los colores deben empezar con `#`
- Deben tener exactamente 6 caracteres hexadecimales

#### Error de CORS
- Si usas el widget en desarrollo, asegúrate de que el API esté corriendo
- Verifica que el `data-api-url` sea correcto

## 📋 Checklist para Deploy

- [ ] `pnpm build` sin errores
- [ ] Probar el widget en `pnpm preview`
- [ ] Verificar que los colores se ven bien
- [ ] Probar enviar mensajes
- [ ] Verificar en mobile (responsive)
- [ ] Subir `dist/widget.js` a CDN
- [ ] Actualizar URL en el código de instalación
- [ ] Probar en sitio de producción

## 🎯 Siguiente Paso

¿Necesitas conectar el widget con tu API? Ve a `apps/api-express` y revisa las rutas `/v1/widget/*`.

