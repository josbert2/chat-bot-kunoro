# Better Auth - Configuración Completada ✅

Better Auth ha sido implementado en el dashboard siguiendo el modelo del proyecto legacy.

## 📦 Dependencias Instaladas

- ✅ `better-auth@0.6.2`
- ✅ `drizzle-orm@0.44.7`
- ✅ `mysql2@3.15.3`

## 📁 Archivos Creados

### 1. `/lib/auth.ts`
Configuración principal de Better Auth:
- Email y password habilitados
- Sesión de 7 días
- Adaptador Drizzle para MySQL

### 2. `/db/index.ts`
Conexión a la base de datos MySQL (compartida con api-express)

### 3. `/db/schema.ts`
Schema de Drizzle con tablas de Better Auth:
- `user` - Usuarios
- `session` - Sesiones
- `account` - Cuentas de autenticación
- `verification` - Verificaciones
- `accounts` - Cuentas de negocio

### 4. `/lib/ensure-account.ts`
Utilidad para asegurar que cada usuario tenga una cuenta de negocio

### 5. `/app/api/auth/[...all]/route.ts`
Ruta catch-all para las APIs de Better Auth

## 🔧 Configuración Necesaria

Crea un archivo `.env` en `apps/dashboard/`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Backend (Express)
NEXT_PUBLIC_API_URL=http://localhost:3001

# Database (compartida con api-express)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=kunoro_chat

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-change-me
BETTER_AUTH_URL=http://localhost:3000
```

## 🗄️ Base de Datos

Better Auth requiere estas tablas (ya están en el schema):

1. **user** - Información de usuarios
2. **session** - Sesiones activas
3. **account** - Cuentas de proveedores de auth
4. **verification** - Tokens de verificación

Las tablas se crearán automáticamente con Drizzle cuando se ejecute la migración.

## 🔐 Endpoints de Better Auth

Better Auth proporciona automáticamente estos endpoints:

### Registro
```bash
POST /api/auth/sign-up/email
Body: { name, email, password }
```

### Login
```bash
POST /api/auth/sign-in/email
Body: { email, password }
```

### Logout
```bash
POST /api/auth/sign-out
```

### Obtener Sesión
```bash
GET /api/auth/session
```

## 📝 Uso en el Dashboard

### Layout del Dashboard
El layout ya está actualizado para usar Better Auth:

```typescript
import { auth } from "@/lib/auth";

const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) {
  redirect("/login");
}
```

### Crear Cliente (Frontend)
Para usar Better Auth en el cliente, instala:

```bash
pnpm add better-auth/client
```

Luego crea un cliente:

```typescript
// lib/auth-client.ts
import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});
```

## 🔄 Migración desde Sistema Anterior

### Antes (Sistema con cookies manuales):
```typescript
const userData = readKunoroUserCookie(cookieStore);
if (!userData || !userData.token) {
  redirect("/login");
}
```

### Ahora (Better Auth):
```typescript
const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session) {
  redirect("/login");
}

const user = session.user;
// user.email, user.name, user.id
```

## ✨ Ventajas de Better Auth

1. ✅ **Seguridad** - Manejo seguro de sesiones y contraseñas
2. ✅ **Sesiones** - Gestión automática de sesiones con refresh tokens
3. ✅ **Extensible** - Fácil agregar OAuth, 2FA, etc.
4. ✅ **Type-safe** - Totalmente tipado con TypeScript
5. ✅ **Estandarizado** - Sigue las mejores prácticas de autenticación

## 🚀 Próximos Pasos

1. **Actualizar páginas de login/register** para usar el cliente de Better Auth
2. **Configurar variables de entorno** en producción
3. **Agregar verificación de email** (opcional)
4. **Implementar OAuth** si es necesario (Google, GitHub, etc.)
5. **Agregar 2FA** para mayor seguridad (opcional)

## 🧪 Testing

Para probar que funciona:

```bash
# 1. Asegúrate de que la DB está corriendo
# 2. Inicia el dashboard
cd apps/dashboard
pnpm dev

# 3. Ve a http://localhost:3000/register
# 4. Regístrate con email y contraseña
# 5. Better Auth creará automáticamente el usuario y la sesión
```

## 📚 Documentación

- [Better Auth Docs](https://www.better-auth.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)

## ⚠️ Notas Importantes

- La base de datos es **compartida** con `api-express`
- El schema incluye tanto las tablas de Better Auth como las de negocio
- Las sesiones se almacenan en la base de datos (no en cookies)
- Better Auth maneja automáticamente la expiración y refresh de sesiones

