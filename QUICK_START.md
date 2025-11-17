# 🚀 Quick Start - Proyecto Real en 5 Minutos

## ⚡ Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```bash
cd /home/jos/josbert.dev/chat-bot-kunoro

# Iniciar todo el sistema
./start-production.sh

# Para detener todo
./stop-production.sh
```

### Opción 2: Manual (Paso a Paso)

#### 1. Backend API
```bash
cd apps/api-express
npm run dev
# Corre en http://localhost:3001
```

#### 2. Dashboard (Nueva terminal)
```bash
cd apps/dashboard  
npm run dev
# Corre en http://localhost:3000
```

#### 3. Compilar Widget (Nueva terminal)
```bash
cd apps/widget
npm run build:dashboard
# Widget compilado en: apps/dashboard/public/widget.js
```

## 📝 Configuración Inicial

### Paso 1: Crear tu cuenta
```
1. Abre: http://localhost:3000/register
2. Completa el formulario:
   - Nombre: Tu nombre
   - Email: tu@email.com  
   - Password: (mínimo 8 caracteres)
3. Click en "Crear cuenta"
```

### Paso 2: Configurar tu Widget
```
1. Inicia sesión: http://localhost:3000/login
2. Completa el onboarding (industria, tipo de negocio, etc.)
3. Ve a: http://localhost:3000/dashboard/settings?section=apariencia
4. Personaliza los colores
5. Copia tu App ID del código de instalación
```

### Paso 3: Instalar en tu Sitio

**Opción A: Usar el sitio demo incluido**

```bash
# 1. Edita demo-site.html
nano demo-site.html

# 2. Busca esta línea:
data-app-id="REEMPLAZA_CON_TU_APP_ID"

# 3. Reemplaza con tu App ID real, ejemplo:
data-app-id="site_abc123xyz"

# 4. Abre el archivo en tu navegador
open demo-site.html
# O arrastra el archivo a Chrome/Firefox
```

**Opción B: Tu propio sitio HTML**

```html
<!-- Agrega esto antes del </body> -->
<script 
  src="http://localhost:3000/widget.js"
  data-app-id="TU_APP_ID_AQUI"
  data-color-background="#0F172A"
  data-color-action="#2563EB"
></script>
```

## 🧪 Prueba el Sistema Completo

### Test 1: Widget → Inbox

1. **Abre tu sitio** (demo-site.html o tu sitio)
2. **Click en el botón del chat** (esquina inferior derecha)
3. **Escribe**: "Hola, necesito ayuda con mi pedido"
4. **Envía el mensaje**

### Test 2: Ver en el Inbox

1. **Abre el dashboard**: http://localhost:3000/dashboard/inbox
2. **Ve a "Sin asignar"**
3. **Deberías ver la conversación** aparecer
4. **Click en la conversación**
5. **Responde al mensaje**

### Test 3: Gestión de Conversaciones

1. **Selecciona una categoría** (Pregunta, Soporte, Venta, etc.)
2. **Envía tu respuesta**
3. **Prueba los botones**:
   - "Asignar" → Mueve a "Abiertos"
   - "Resolver" → Mueve a "Resueltos"  
   - 🗑️ → Elimina la conversación (con confirmación)

## ✅ Checklist de Verificación

- [ ] Backend corriendo en puerto 3001
- [ ] Dashboard corriendo en puerto 3000
- [ ] Base de datos MySQL conectada
- [ ] Cuenta creada y login funcionando
- [ ] App ID obtenido
- [ ] Widget instalado en demo-site.html
- [ ] Mensajes llegando del widget al inbox
- [ ] Socket.IO conectado (tiempo real)
- [ ] Categorías de mensajes funcionando
- [ ] Estados de conversación funcionando

## 🔍 URLs Importantes

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Dashboard** | http://localhost:3000 | Panel principal |
| **Login** | http://localhost:3000/login | Iniciar sesión |
| **Register** | http://localhost:3000/register | Crear cuenta |
| **Inbox** | http://localhost:3000/dashboard/inbox | Bandeja de entrada |
| **Settings** | http://localhost:3000/dashboard/settings | Configuración |
| **Widget Test** | http://localhost:3000/widget-test | Prueba del widget |
| **API Health** | http://localhost:3001/v1/health | Estado del API |
| **API Docs** | http://localhost:3001/v1/health/docs | Documentación API |

## 📊 Monitoreo

### Ver logs en tiempo real:

```bash
# Logs del Backend
tail -f logs/api.log

# Logs del Dashboard  
tail -f logs/dashboard.log

# Ambos a la vez
tail -f logs/*.log
```

### Verificar que todo esté corriendo:

```bash
# Backend (debería responder con status)
curl http://localhost:3001/v1/health

# Dashboard (debería responder)
curl http://localhost:3000

# Verificar procesos
ps aux | grep -E "node|npm"
```

## 🐛 Troubleshooting Rápido

### Widget no aparece
```bash
# 1. Verifica que compilaste el widget
cd apps/widget && npm run build:dashboard

# 2. Verifica que el archivo existe
ls -la apps/dashboard/public/widget.js

# 3. Verifica tu App ID
# Debe ser algo como: site_xxxxx
```

### Conversaciones no llegan
```bash
# 1. Verifica backend
curl http://localhost:3001/v1/health

# 2. Verifica MySQL
# Debe estar corriendo en puerto 3530

# 3. Revisa logs
tail -f logs/api.log
```

### Error de autenticación
```bash
# 1. Limpia localStorage
# Abre consola en el navegador (F12)
localStorage.clear()
location.reload()

# 2. Vuelve a iniciar sesión
```

## 🎉 ¡Listo!

Tu sistema está completamente funcional:

✅ Widget funcionando en tu sitio  
✅ Mensajes llegando al backend  
✅ Conversaciones visibles en el inbox  
✅ Tiempo real con Socket.IO  
✅ Categorías de mensajes  
✅ Gestión de estados  
✅ Eliminar conversaciones  

## 📚 Documentación Completa

- [`PRODUCTION_SETUP.md`](./PRODUCTION_SETUP.md) - Setup completo paso a paso
- [`WIDGET_INBOX_INTEGRATION.md`](./WIDGET_INBOX_INTEGRATION.md) - Integración widget-inbox
- [`INBOX_STATUS_MANAGEMENT.md`](./INBOX_STATUS_MANAGEMENT.md) - Gestión de estados

## 🆘 ¿Necesitas Ayuda?

1. Revisa los logs: `tail -f logs/*.log`
2. Verifica los puertos: `lsof -i :3000 -i :3001`
3. Revisa la consola del navegador (F12)
4. Verifica que MySQL esté corriendo

---

**¿Todo funcionando?** 🎉 ¡Empieza a personalizar tu chat!

