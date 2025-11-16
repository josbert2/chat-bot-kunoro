# 🎯 EMPIEZA AQUÍ - Proyecto Real

## 🚀 Para iniciar TODO en 1 comando:

\`\`\`bash
./start-production.sh
\`\`\`

## 📝 Pasos después de iniciar:

### 1️⃣ Crear tu cuenta (1 min)
```
→ http://localhost:3000/register
```

### 2️⃣ Obtener tu App ID (30 seg)
```  
→ http://localhost:3000/dashboard/settings?section=apariencia
→ Copiar el App ID del código de instalación
```

### 3️⃣ Instalar en demo-site.html (30 seg)
```bash
# Edita el archivo
nano demo-site.html

# Busca:
data-app-id="REEMPLAZA_CON_TU_APP_ID"

# Reemplaza con tu App ID:
data-app-id="site_abc123"

# Abre en navegador:
open demo-site.html
```

### 4️⃣ Probar! (30 seg)
```
1. Click en el botón del chat
2. Escribe un mensaje
3. Ve al inbox: http://localhost:3000/dashboard/inbox
4. Responde desde el dashboard
```

## ✅ Checklist Rápido:

- [ ] `./start-production.sh` ejecutado
- [ ] Dashboard abierto: http://localhost:3000
- [ ] Cuenta creada
- [ ] App ID copiado
- [ ] demo-site.html editado
- [ ] Mensaje de prueba enviado
- [ ] Conversación visible en inbox

## 🎉 ¡Listo para producción!

Tu sistema está funcionando completamente. Ahora puedes:

- Personalizar colores del widget
- Categorizar mensajes  
- Gestionar estados de conversaciones
- Eliminar conversaciones
- Ver todo en tiempo real con Socket.IO

## 📚 Más Información:

- [QUICK_START.md](./QUICK_START.md) - Guía detallada
- [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) - Setup completo

## 🛑 Para detener todo:

\`\`\`bash
./stop-production.sh
\`\`\`
