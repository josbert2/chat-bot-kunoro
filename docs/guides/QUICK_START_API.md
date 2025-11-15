# ⚡ Quick Start - API Bearer Tokens

Guía rápida para empezar a usar la API de Kunoro en 5 minutos.

## 🎯 En 3 Pasos

### 1️⃣ Aplicar Migración de Base de Datos

```bash
cd chat-bot-kunoro

# Generar migración para la tabla de API tokens
npm run db:generate

# Aplicar migración
npm run db:push
```

### 2️⃣ Generar tu Primer Token

#### Opción A: Desde el Dashboard (Recomendado)

1. Inicia sesión en el dashboard
2. Ve a **Configuración → API Tokens**
3. Click en "Generar Nuevo Token"
4. Dale un nombre (ej: "Mi App Móvil")
5. Selecciona scopes o deja `["*"]` para acceso completo
6. Opcionalmente establece días de expiración
7. ¡Copia el token! (solo se muestra una vez)

#### Opción B: Usando cURL

```bash
# Primero inicia sesión para obtener la cookie de sesión
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email": "tu@email.com", "password": "tupassword"}' \
  -c cookies.txt

# Luego genera el token
curl -X POST http://localhost:3000/api/tokens/generate \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Mi primer token",
    "scopes": ["*"],
    "expiresInDays": 90
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "token": "kunoro_1234567890abcdef..."
  },
  "warning": "⚠️ Guarda este token en un lugar seguro..."
}
```

### 3️⃣ Haz tu Primera Llamada

```bash
# Guarda tu token en una variable
export KUNORO_TOKEN="kunoro_1234567890abcdef..."

# Obtén info de tu cuenta
curl -H "Authorization: Bearer $KUNORO_TOKEN" \
  http://localhost:3000/api/v1/account

# Envía un mensaje al chatbot
curl -X POST \
  -H "Authorization: Bearer $KUNORO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola, ¿cómo estás?"}' \
  http://localhost:3000/api/v1/chat/send
```

## 🎉 ¡Listo!

Tu API está funcionando. Ahora puedes:

- ✅ Integrar en tu app web/móvil
- ✅ Crear automatizaciones
- ✅ Conectar webhooks
- ✅ Desarrollar integraciones personalizadas

## 📚 Siguiente Paso

- **Documentación completa**: [API_BEARER_TOKENS.md](./API_BEARER_TOKENS.md)
- **Ejemplos de código**: [EJEMPLOS_API.md](./EJEMPLOS_API.md)
- **Esquema de base de datos**: [DATABASE.md](./DATABASE.md)

## 🔒 Seguridad

⚠️ **IMPORTANTE**: 

- Nunca expongas tokens en código frontend
- Usa variables de entorno
- No los subas a Git (`.env` debe estar en `.gitignore`)
- Revoca tokens comprometidos inmediatamente

## 🐛 Troubleshooting

### Error: "No autorizado"

✅ Verifica que el header sea: `Authorization: Bearer <token>`
✅ Confirma que el token esté activo (no revocado)
✅ Chequea que no haya expirado

### Error: "Token inválido"

✅ Asegúrate de copiar el token completo (comienza con `kunoro_`)
✅ No debe tener espacios ni saltos de línea
✅ Verifica que el token pertenezca a una cuenta activa

### Error: "Permiso denegado"

✅ Verifica que el token tenga el scope necesario
✅ Para chat necesitas: `chat:write` o `*`
✅ Regenera el token con los scopes correctos

---

**¿Problemas?** Abre un issue o revisa los logs del servidor.

