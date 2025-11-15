# 🗄️ Configuración de Base de Datos

Este proyecto usa **MySQL** con **Drizzle ORM** para persistir las sesiones de chat y mensajes.

## 📋 Requisitos

- Docker y Docker Compose instalados
- Node.js 18+ instalado

## 🚀 Inicio Rápido

### 1. Iniciar la base de datos MySQL con Docker

```bash
# Iniciar el contenedor de MySQL
npm run docker:up

# Ver los logs de MySQL (opcional)
npm run docker:logs
```

Esto iniciará un contenedor MySQL en el puerto `3306` con las siguientes credenciales:
- **Host**: localhost
- **Puerto**: 3306
- **Usuario**: bookforce
- **Password**: bookforce123
- **Base de datos**: bookforce_chatbot

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Asegúrate de que las variables de base de datos estén configuradas:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=bookforce
DB_PASSWORD=bookforce123
DB_NAME=bookforce_chatbot
```

### 3. Generar y aplicar migraciones

```bash
# Generar archivos de migración
npm run db:generate

# Aplicar migraciones a la base de datos
npm run db:push
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

¡Listo! El chatbot ahora guardará todas las conversaciones en la base de datos.

## 🛠️ Comandos Útiles

### Docker

```bash
# Iniciar MySQL
npm run docker:up

# Detener MySQL
npm run docker:down

# Ver logs de MySQL
npm run docker:logs
```

### Base de Datos

```bash
# Generar migraciones desde el schema
npm run db:generate

# Aplicar cambios a la base de datos
npm run db:push

# Abrir Drizzle Studio (GUI para ver la BD)
npm run db:studio
```

## 📊 Estructura de la Base de Datos

### Tabla: `sessions`

Almacena las sesiones de los usuarios identificadas por IP.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID autoincremental |
| ip_address | VARCHAR(45) | Dirección IP del usuario (IPv4/IPv6) |
| session_id | VARCHAR(255) | UUID único de la sesión |
| user_agent | TEXT | User agent del navegador |
| created_at | TIMESTAMP | Fecha de creación |
| last_activity | TIMESTAMP | Última actividad |

### Tabla: `messages`

Almacena todos los mensajes del chat.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | ID autoincremental |
| session_id | VARCHAR(255) | ID de la sesión (FK) |
| role | VARCHAR(20) | 'user' o 'assistant' |
| content | TEXT | Contenido del mensaje |
| intent | VARCHAR(50) | Categoría detectada (opcional) |
| created_at | TIMESTAMP | Fecha de creación |

### Tabla: `api_tokens`

Almacena tokens Bearer para autenticación API.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR(191) | ID único del token |
| name | VARCHAR(255) | Nombre descriptivo |
| token | VARCHAR(255) | Token Bearer único |
| account_id | VARCHAR(191) | ID de la cuenta (FK) |
| user_id | VARCHAR(191) | ID del usuario creador (FK) |
| last_used_at | TIMESTAMP | Última vez usado |
| expires_at | TIMESTAMP | Fecha de expiración (NULL = sin expiración) |
| is_active | BOOLEAN | Si el token está activo |
| scopes | TEXT | Permisos JSON (ej: ["chat:read", "chat:write"]) |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Fecha de última actualización |

**Índices:**
- `token_idx` en `token` (búsqueda rápida)
- `account_idx` en `account_id` (listar tokens por cuenta)

## 🔍 Características

### Persistencia de Sesiones
- Las sesiones se identifican por **IP del usuario**
- Una sesión permanece activa por **24 horas** desde la última actividad
- Después de 24 horas, se crea una nueva sesión automáticamente

### Historial de Conversaciones
- Todos los mensajes se guardan en la base de datos
- Se puede recuperar el historial completo de una sesión
- Útil para análisis y mejora del chatbot

### Clasificación de Intenciones
- Cada mensaje del usuario se clasifica en categorías:
  - valores
  - horarios
  - funciones
  - transaccionales
  - preguntas frecuentes
  - conversación

### Autenticación API con Tokens Bearer
- Tokens únicos y seguros para integrar con aplicaciones externas
- Control granular con **scopes** (permisos)
- Tokens pueden tener fecha de expiración
- Se rastrea el último uso de cada token
- Los tokens se pueden revocar en cualquier momento
- Ver [API_BEARER_TOKENS.md](./API_BEARER_TOKENS.md) para más detalles

## 🔒 Seguridad

- Las contraseñas de la base de datos están en variables de entorno
- Nunca commitear el archivo `.env` al repositorio
- En producción, usar credenciales seguras y diferentes

## 🐛 Troubleshooting

### Error: "Can't connect to MySQL server"

Asegúrate de que el contenedor Docker esté corriendo:

```bash
docker ps
```

Si no está corriendo, inícialo:

```bash
npm run docker:up
```

### Error: "Table doesn't exist"

Necesitas aplicar las migraciones:

```bash
npm run db:push
```

### Ver datos en la base de datos

Usa Drizzle Studio para ver los datos visualmente:

```bash
npm run db:studio
```

O conéctate directamente con MySQL:

```bash
docker exec -it bookforce-chatbot-db mysql -u bookforce -pbookforce123 bookforce_chatbot
```

## 📈 Producción

Para producción, considera usar:
- **PlanetScale** (MySQL serverless)
- **AWS RDS** (MySQL managed)
- **Railway** (MySQL con Docker)
- **DigitalOcean Managed Databases**

Actualiza las variables de entorno en tu plataforma de deployment (Vercel, etc.) con las credenciales de producción.
