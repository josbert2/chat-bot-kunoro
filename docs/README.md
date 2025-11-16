# Documentación de la API - Kunoro Chat Bot

## 📚 Índice de Documentación

### 🔐 Autenticación

- **[API_AUTH.md](./API_AUTH.md)** - Documentación completa de la API de autenticación
  - Endpoints de registro, login y "get me"
  - Ejemplos con cURL
  - Configuración de Postman
  - Manejo de errores
  - Buenas prácticas de seguridad

### 📮 Colección de Postman

- **[Kunoro_Auth_API.postman_collection.json](./Kunoro_Auth_API.postman_collection.json)** - Colección importable de Postman
  - Endpoints preconfigurados
  - Tests automáticos para guardar tokens
  - Ejemplos de respuestas exitosas y errores
  - Variables de colección (baseUrl, authToken)

## 🚀 Inicio Rápido con Postman

### Opción 1: Importar la Colección (Recomendado)

1. Abre Postman
2. Click en **Import**
3. Arrastra el archivo `Kunoro_Auth_API.postman_collection.json`
4. La colección aparecerá con 3 requests preconfigurados

### Opción 2: Crear Manualmente

Sigue las instrucciones en [API_AUTH.md](./API_AUTH.md) en la sección "Colección de Postman"

## 📝 Testing Flow Recomendado

### 1. Test de Registro

```
POST {{baseUrl}}/auth/register

Body:
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**Resultado esperado:**
- Status: 201 Created
- Response incluye: token, user, workspace
- El token se guarda automáticamente en la variable `authToken`

### 2. Test de Login

```
POST {{baseUrl}}/auth/login

Body:
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Resultado esperado:**
- Status: 200 OK
- Response incluye: token, user, workspace
- El token se actualiza en la variable `authToken`

### 3. Test de Get Me

```
GET {{baseUrl}}/auth/me

Headers:
Authorization: Bearer {{authToken}}
```

**Resultado esperado:**
- Status: 200 OK
- Response incluye: user, workspace

## 🔧 Configuración

### Variables de Colección

La colección usa estas variables que puedes modificar:

| Variable | Valor por defecto | Descripción |
|----------|------------------|-------------|
| `baseUrl` | `http://localhost:3001/v1` | URL base de la API |
| `authToken` | (vacío) | Token JWT, se llena automáticamente |

### Cambiar la URL del Backend

Si tu backend está en otro puerto o servidor:

1. En Postman, ve a la colección
2. Click en los **3 puntos** → **Edit**
3. Ve a la pestaña **Variables**
4. Cambia `baseUrl` al valor deseado
5. Guarda

## 🐛 Troubleshooting

### Error: connect ECONNREFUSED

**Causa:** El backend no está corriendo

**Solución:**
```bash
cd apps/api
npm run dev
```

### Error: "La contraseña debe tener al menos 8 caracteres"

**Causa:** Password muy corto

**Solución:** Usa una contraseña de 8+ caracteres

### Error: "El email ya está registrado"

**Causa:** El email ya existe en la base de datos

**Solución:** Cambia el email en el body del request

### Error: 401 Unauthorized en /auth/me

**Causa:** Token inválido o no proporcionado

**Solución:** 
1. Ejecuta primero el request de Login o Register
2. Verifica que la variable `authToken` tenga un valor
3. Verifica que el header Authorization esté bien formateado: `Bearer {{authToken}}`

## 📖 Documentación Adicional

- [DEBUGGING.md](../DEBUGGING.md) - Guía completa de debugging con logs
- [QUICK_FIX.md](../QUICK_FIX.md) - Solución rápida para problemas de login/registro

## 🔗 Endpoints Relacionados

### Próximamente:

- Sites API - Gestión de sitios web
- Conversations API - Gestión de conversaciones
- Messages API - Gestión de mensajes
- Widget API - Configuración del widget

---

**Última actualización:** 16 Noviembre 2025

