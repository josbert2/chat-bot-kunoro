# 🧪 Servidor de Pruebas API Bearer

Servidor HTTP simple en Node.js para probar la interfaz de tokens Bearer sin problemas de CORS.

## 🚀 Inicio Rápido

### Opción 1: Usando npm (Recomendado)

```bash
npm run test-api
```

### Opción 2: Directamente con Node

```bash
node test-server.js
```

### Opción 3: Hacer el script ejecutable

```bash
chmod +x test-server.js
./test-server.js
```

## 📋 Requisitos Previos

1. **Servidor principal corriendo** (tu API Next.js):
   ```bash
   npm run dev
   ```
   Debe estar en `http://localhost:3000`

2. **Token Bearer generado**: Necesitas un token válido para probar

## 🌐 Acceso

Una vez iniciado, el servidor estará disponible en:

```
http://localhost:8888
```

La interfaz de prueba se cargará automáticamente.

## 📦 Características

- ✅ **Sin dependencias externas** - Solo usa módulos nativos de Node.js
- ✅ **Sin problemas de CORS** - Servidor HTTP dedicado
- ✅ **Puerto personalizable** - Edita `PORT` en `test-server.js`
- ✅ **Página 404 personalizada** - Manejo elegante de errores
- ✅ **Logs de requests** - Ve todas las peticiones en tiempo real
- ✅ **Cierre graceful** - Ctrl+C para detener limpiamente

## 🎯 Flujo Completo de Prueba

### Terminal 1: Servidor Principal (API)
```bash
cd /home/jos/josbert.dev/chat-bot-kunoro
npm run dev
```

### Terminal 2: Servidor de Pruebas
```bash
cd /home/jos/josbert.dev/chat-bot-kunoro
npm run test-api
```

### Navegador
```
1. Abre http://localhost:8888
2. Ingresa tu token Bearer
3. Haz clic en "💾 Guardar Token"
4. Haz clic en "🔌 Probar Conexión"
5. Prueba los diferentes endpoints
6. Envía mensajes al chat
```

## 🔧 Configuración

### Cambiar el Puerto

Edita `test-server.js` y modifica:

```javascript
const PORT = process.env.PORT || 8888; // Por defecto 8888, personalizable con variable de entorno
```

### Cambiar el Host

```javascript
const HOST = 'localhost'; // O '0.0.0.0' para acceso externo
```

## 📊 Ejemplo de Salida

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║       🚀 Servidor de Prueba API Bearer - Kunoro         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝

✅ Servidor corriendo en: http://localhost:8080
📄 Archivo de prueba: http://localhost:8080/test-api.html

📝 Instrucciones:
   1. Asegúrate de que tu API esté corriendo en http://localhost:3000
   2. Abre http://localhost:8080 en tu navegador
   3. Ingresa tu token Bearer y prueba los endpoints

⏹️  Presiona Ctrl+C para detener el servidor

2024-11-15T10:30:00.000Z - GET /
2024-11-15T10:30:05.000Z - GET /test-api.html
```

## 🐛 Solución de Problemas

### Error: Puerto ya en uso

```
❌ Error: El puerto 8888 ya está en uso.
```

**Solución:**
1. Detén otros servidores en el puerto 8888
2. O usa una variable de entorno: `PORT=9000 npm run test-api`
3. O cambia el puerto en `test-server.js`

### Error: Cannot find module

```
❌ Error: Cannot find module './test-api.html'
```

**Solución:**
Asegúrate de estar en el directorio correcto:
```bash
cd /home/jos/josbert.dev/chat-bot-kunoro
npm run test-api
```

### La API no responde

**Verificaciones:**
1. ¿Está corriendo el servidor principal?
   ```bash
   curl http://localhost:3000/api/v1/account -H "Authorization: Bearer tu_token"
   ```

2. ¿El token es válido?
   - Verifica que comience con `kunoro_`
   - Comprueba que no esté revocado

3. ¿La URL es correcta?
   - Debe ser `http://localhost:3000` (sin slash al final)

## 🔒 Seguridad

- ⚠️ Este servidor es **solo para desarrollo y pruebas locales**
- ❌ **NO usar en producción**
- ❌ **NO exponer a Internet** sin medidas de seguridad adicionales
- ✅ Solo escucha en `localhost` por defecto

## 📁 Archivos Relacionados

- `test-api.html` - Interfaz de prueba visual
- `test-server.js` - Este servidor HTTP
- `API_BEARER_TOKENS.md` - Documentación completa de la API
- `INSTRUCCIONES_FINALES.md` - Guía de implementación

## 🆘 Ayuda

Si tienes problemas:

1. Verifica los logs del servidor (Terminal 1 y Terminal 2)
2. Abre la consola del navegador (F12)
3. Revisa `INSTRUCCIONES_FINALES.md` para más detalles
4. Consulta `API_BEARER_TOKENS.md` para documentación de la API

## 💡 Tips

- Usa **dos terminales** para ver los logs de ambos servidores
- El servidor recarga automáticamente el HTML (refresca el navegador)
- Los tokens se guardan en localStorage (persisten entre recargas)
- Puedes tener múltiples pestañas abiertas sin problemas

---

**¡Listo para probar!** 🎉

Ejecuta `npm run test-api` y abre tu navegador.

