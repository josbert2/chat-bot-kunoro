# 🚀 Quick Requests - Copia y Pega

Ejemplos listos para usar en Postman o cualquier cliente HTTP.

## 🔐 1. REGISTER (Crear Cuenta)

**Método:** `POST`  
**URL:** `http://localhost:3001/v1/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Josbert Test",
  "email": "josbert.test@gmail.com",
  "password": "password123"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Josbert Test","email":"josbert.test@gmail.com","password":"password123"}'
```

---

## 🔑 2. LOGIN (Iniciar Sesión)

**Método:** `POST`  
**URL:** `http://localhost:3001/v1/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "josbert.test@gmail.com",
  "password": "password123"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3001/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"josbert.test@gmail.com","password":"password123"}'
```

---

## 👤 3. GET ME (Usuario Actual)

**Método:** `GET`  
**URL:** `http://localhost:3001/v1/auth/me`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer TU_TOKEN_AQUI
```

⚠️ **Nota:** Reemplaza `TU_TOKEN_AQUI` con el token que recibiste del login/register

**cURL:**
```bash
curl -X GET http://localhost:3001/v1/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 📝 Notas

### Cambiar el Email en Cada Test

Para probar múltiples registros, cambia el email:
```json
{
  "name": "Test User 1",
  "email": "test1@example.com",  // ← Cambia esto
  "password": "password123"
}
```

```json
{
  "name": "Test User 2",
  "email": "test2@example.com",  // ← Cambia esto
  "password": "password123"
}
```

### Guardar el Token Automáticamente en Postman

En la pestaña **Tests** del request de Login o Register, pega esto:

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    const responseJson = pm.response.json();
    pm.collectionVariables.set("authToken", responseJson.token);
    console.log("✅ Token guardado:", responseJson.token);
}
```

Luego en otros requests usa: `{{authToken}}`

---

## 🎯 Flow de Testing Completo

### Paso 1: Registrar Usuario
```bash
# En Postman o con cURL
POST http://localhost:3001/v1/auth/register
Body: {"name":"Test","email":"test@test.com","password":"12345678"}
```

**Copia el token de la respuesta**

### Paso 2: Usar el Token
```bash
# Pega el token en el header Authorization
GET http://localhost:3001/v1/auth/me
Header: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🧪 Casos de Prueba

### ✅ Caso 1: Registro Exitoso
```json
{
  "name": "Usuario Nuevo",
  "email": "nuevo@example.com",
  "password": "password123"
}
```
**Esperado:** Status 201, token + user + workspace en la respuesta

### ❌ Caso 2: Password Muy Corto
```json
{
  "name": "Usuario",
  "email": "test@example.com",
  "password": "123"
}
```
**Esperado:** Status 400, mensaje "La contraseña debe tener al menos 8 caracteres"

### ❌ Caso 3: Email Duplicado
```json
{
  "name": "Usuario",
  "email": "test@example.com",  // Ya existe
  "password": "password123"
}
```
**Esperado:** Status 400, mensaje "El email ya está registrado"

### ❌ Caso 4: Login con Password Incorrecta
```json
{
  "email": "test@example.com",
  "password": "wrongpassword"
}
```
**Esperado:** Status 401, mensaje "Credenciales inválidas"

### ❌ Caso 5: Get Me sin Token
```
GET /auth/me
(Sin header Authorization)
```
**Esperado:** Status 401

---

## 🔄 Variables de Postman

Si usas la colección importada, estas variables ya están configuradas:

| Variable | Uso | Ejemplo |
|----------|-----|---------|
| `{{baseUrl}}` | URL base | `http://localhost:3001/v1` |
| `{{authToken}}` | Token JWT | Se llena automáticamente |

### Ejemplo de uso:
```
POST {{baseUrl}}/auth/register
Authorization: Bearer {{authToken}}
```

---

## 📱 Ejemplo con JavaScript/Fetch

```javascript
// Registro
const response = await fetch('http://localhost:3001/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log('Token:', data.token);
console.log('User:', data.user);
```

```javascript
// Login
const response = await fetch('http://localhost:3001/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;
```

```javascript
// Get Me (con token)
const response = await fetch('http://localhost:3001/v1/auth/me', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log('Current user:', data.user);
console.log('Workspace:', data.workspace);
```

---

## 🎨 Ejemplo con Python/Requests

```python
import requests
import json

# Registro
response = requests.post(
    'http://localhost:3001/v1/auth/register',
    headers={'Content-Type': 'application/json'},
    json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'password123'
    }
)

data = response.json()
token = data['token']
print(f"Token: {token}")

# Get Me
response = requests.get(
    'http://localhost:3001/v1/auth/me',
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
)

user_data = response.json()
print(f"User: {user_data['user']}")
```

