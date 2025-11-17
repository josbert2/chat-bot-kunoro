# API de Autenticación - Documentación

## Base URL

```
http://localhost:3001/v1
```

## Endpoints

### 1. Registro de Usuario

Crea una nueva cuenta de usuario con workspace.

**Endpoint:** `POST /auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Validaciones:**
- `name`: Requerido, string
- `email`: Requerido, email válido, único
- `password`: Requerido, mínimo 8 caracteres

**Response Success (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "workspace": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Pérez",
    "plan": "free"
  }
}
```

**Response Error (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "La contraseña debe tener al menos 8 caracteres"
}
```

```json
{
  "statusCode": 400,
  "message": "El email ya está registrado"
}
```

**Response Error (500 Internal Server Error):**
```json
{
  "statusCode": 500,
  "message": "Error al crear la cuenta. Por favor intenta de nuevo."
}
```

---

### 2. Login de Usuario

Inicia sesión con email y contraseña.

**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Validaciones:**
- `email`: Requerido, email válido
- `password`: Requerido

**Response Success (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "workspace": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Pérez",
    "plan": "free"
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas"
}
```

```json
{
  "statusCode": 401,
  "message": "Workspace no encontrado para este usuario"
}
```

---

### 3. Obtener Usuario Actual

Obtiene la información del usuario autenticado.

**Endpoint:** `GET /auth/me`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:** Ninguno

**Response Success (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Pérez",
    "email": "juan@example.com"
  },
  "workspace": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Juan Pérez",
    "plan": "free"
  }
}
```

**Response Error (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Usuario no encontrado"
}
```

---

## Ejemplos con cURL

### Registro

```bash
curl -X POST http://localhost:3001/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Obtener Usuario Actual

```bash
curl -X GET http://localhost:3001/v1/auth/me \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## Notas Importantes

### JWT Token

El token JWT devuelto en el login/registro debe ser usado en el header `Authorization` con el formato:
```
Authorization: Bearer <token>
```

El token tiene una duración de **7 días** por defecto (configurable con `JWT_EXPIRES_IN`).

### Payload del JWT

El token contiene:
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "accountId": "660e8400-e29b-41d4-a716-446655440000",
  "email": "juan@example.com",
  "iat": 1700000000,
  "exp": 1700604800
}
```

### CORS

El backend está configurado para aceptar requests desde cualquier origen con las siguientes opciones:
- **origin**: `true` (cualquier origen)
- **credentials**: `true`
- **methods**: GET, POST, PUT, PATCH, DELETE, OPTIONS
- **allowedHeaders**: Content-Type, Authorization, x-site-key

### Variables de Entorno Necesarias

```bash
# Backend (apps/api/.env)
JWT_SECRET=tu-secreto-super-seguro-aqui
JWT_EXPIRES_IN=7d
API_PORT=3001
DATABASE_URL=postgresql://...
```

---

## Colección de Postman

### Configuración Inicial

1. **Crear una nueva colección** llamada "Kunoro Chat Bot API"

2. **Agregar variable de colección:**
   - Variable: `baseUrl`
   - Valor: `http://localhost:3001/v1`

3. **Agregar variable de colección para el token:**
   - Variable: `authToken`
   - Valor: (se llenará automáticamente después del login)

### Request 1: Register

- **Nombre:** Register User
- **Método:** POST
- **URL:** `{{baseUrl}}/auth/register`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body (raw JSON):**
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```
- **Tests (opcional - para guardar el token):**
```javascript
if (pm.response.code === 201) {
    const responseJson = pm.response.json();
    pm.collectionVariables.set("authToken", responseJson.token);
    console.log("Token guardado:", responseJson.token);
}
```

### Request 2: Login

- **Nombre:** Login User
- **Método:** POST
- **URL:** `{{baseUrl}}/auth/login`
- **Headers:**
  - `Content-Type`: `application/json`
- **Body (raw JSON):**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
- **Tests (opcional - para guardar el token):**
```javascript
if (pm.response.code === 200) {
    const responseJson = pm.response.json();
    pm.collectionVariables.set("authToken", responseJson.token);
    console.log("Token guardado:", responseJson.token);
}
```

### Request 3: Get Me

- **Nombre:** Get Current User
- **Método:** GET
- **URL:** `{{baseUrl}}/auth/me`
- **Headers:**
  - `Content-Type`: `application/json`
  - `Authorization`: `Bearer {{authToken}}`

---

## Testing Flow

1. **Test de Registro:**
   - Ejecuta el request "Register User"
   - Verifica que devuelve status 201
   - Verifica que el token está presente
   - Cambia el email en cada test

2. **Test de Login:**
   - Ejecuta el request "Login User"
   - Verifica que devuelve status 200
   - Verifica que el token está presente

3. **Test de Get Me:**
   - Ejecuta el request "Get Current User"
   - Verifica que devuelve la información del usuario
   - Verifica que el workspace está presente

---

## Errores Comunes

### Error: "La contraseña debe tener al menos 8 caracteres"
**Causa:** Password tiene menos de 8 caracteres  
**Solución:** Usa una contraseña de al menos 8 caracteres

### Error: "El email ya está registrado"
**Causa:** Ya existe un usuario con ese email  
**Solución:** Usa un email diferente o elimina el usuario existente

### Error: "Credenciales inválidas"
**Causa:** Email o password incorrectos  
**Solución:** Verifica que el email y password sean correctos

### Error: connect ECONNREFUSED
**Causa:** El backend no está corriendo  
**Solución:** Inicia el backend con `npm run dev` en `apps/api`

### Error: JWT_SECRET no configurado
**Causa:** Falta la variable de entorno JWT_SECRET  
**Solución:** Configura JWT_SECRET en el archivo .env del backend

---

## Seguridad

### Buenas Prácticas

1. **Nunca compartas tu JWT_SECRET** - Debe ser único y secreto
2. **Usa HTTPS en producción** - Nunca envíes tokens por HTTP sin cifrar
3. **Valida siempre el token** - El backend valida automáticamente con el Bearer Auth Guard
4. **Rota tokens periódicamente** - Implementa refresh tokens para mayor seguridad
5. **Passwords hasheados** - Se usa bcrypt con 10 rounds de salt

### Almacenamiento del Token

**En el Frontend:**
- ✅ localStorage (usado actualmente) - Conveniente pero vulnerable a XSS
- ✅ httpOnly cookies (más seguro) - Protege contra XSS
- ❌ sessionStorage - Se pierde al cerrar la pestaña

**Recomendación:** Migrar a httpOnly cookies en producción para mayor seguridad.

