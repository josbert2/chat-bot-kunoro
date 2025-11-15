 [TODO] 1 OBJETIVO DEL PRODUCTO

    SaaS de chat + chatbot embebible en webs y apps, similar a Intercom:
    Widget de chat (burbuja flotante).
    Inbox para agentes (soporte/ventas).
    Chatbot (reglas + IA a futuro).
    Multi-tenant (varias empresas en la misma plataforma).
    Integración sencilla mediante snippet JS y API.
    Comunicación en tiempo real usando sockets.

 [TODO] 2 FEATURES PRINCIPALES (MVP 1)

    2.1 Widget de chat embebible

    Botón flotante (esquina inferior derecha).

    Ventana de chat con historial e input.

    Identificación opcional de usuario (email, nombre, ID externo).

    Estado básico: “online”, “offline”, mensaje de bienvenida.

    2.2 Inbox para agentes

    Lista de conversaciones abiertas, en espera y cerradas.

    Vista de conversación con mensajes y datos del usuario.

    Respuestas en tiempo real.

    Asignación de conversaciones a un agente.

    Notificaciones básicas (browser/email).

    2.3 Multi-tenant

    Cada cuenta/empresa con:

    Sus propios sitios (app_id por sitio).

    Sus visitantes y usuarios finales.

    Sus agentes y admins.

    Sus conversaciones, reglas de bot, artículos, etc.

    2.4 Autenticación y equipo

    Registro/login de empresas.

    Roles: owner, admin, agent.

    Invitación de miembros del equipo por email.

    Recuperación de contraseña.

    2.5 Panel de configuración del widget

    Colores (primario, fondo, texto).

    Logo/avatar de la empresa.

    Mensaje de saludo inicial.

    Horario de atención (para mostrar “En este momento estamos offline, déjanos tu mensaje”).

 [TODO] 3 FEATURES PRO (MVP 2)

3.1 Chatbot de reglas (rule-based)

Respuestas automáticas por palabras clave.

Árbol de decisiones (preguntas y botones de respuesta).

Reglas del tipo:

Si el mensaje contiene “devolución” → respuesta X + sugerir artículo Y.

Si el mensaje llega fuera de horario → respuesta automática + crear ticket.

Respuestas rápidas predefinidas para agentes.

3.2 Base de conocimiento

CRUD de artículos:

Título, contenido, tags, categoría.

Sugerencia de artículos en el widget según el texto del usuario.

Buscador de artículos dentro del widget.

3.3 Segmentación básica de usuarios

Atributos:

País, idioma (detectado o enviado por API).

Primera visita, última visita, nº de visitas.

Páginas visitadas.

Filtros en el dashboard:

Usuarios activos hoy.

Usuarios con más de X visitas.

Usuarios que no vuelven hace X días.

3.4 Triggers automáticos

Condiciones sencillas:

Tiempo en la página.

URL actual.

Nº de visitas.

Acciones:

Mostrar mensaje proactivo.

Abrir el widget automáticamente.

Lanzar bot de bienvenida.

3.5 Reportes básicos

Nº de conversaciones por día y por sitio.

Tiempo promedio de primera respuesta.

Conversaciones resueltas vs sin resolver.

Top páginas que generan más conversaciones.

 [TODO] 4 FEATURES NIVEL INTERCOM-LIKE (V3+)

4.1 Campañas y mensajes outbound

Mensajes in-app según segmento (ej. usuarios nuevos).

Campañas de onboarding (secuencia de mensajes).

Mensajes a usuarios inactivos cuando vuelven.

4.2 Integraciones

Webhooks para eventos:

conversation.created

message.created

conversation.closed

API REST:

Crear/actualizar usuarios.

Enviar eventos (track).

Leer conversaciones.

Integraciones via n8n / Zapier usando webhooks.

4.3 Chatbot con IA

IA que responde basándose en la base de conocimiento.

IA + fallback a agente humano.

Configuración de tono, idioma y límites de IA.

Métricas de uso de IA (respuestas, handoff a humanos, etc.).

 [TODO] 5 FEATURES ESPECÍFICOS DE SOCKETS (TIEMPO REAL)

5.1 Features técnicos de tiempo real (socket)

Conexión WebSocket:

Un canal por visitor_id.

Un canal por conversation_id.

Un canal por workspace/account para agentes (ver todo lo nuevo).

Eventos clave:

message:new → cuando se crea un mensaje (usuario, agente o bot).

conversation:updated → cambios de estado (abierta, cerrada, asignada).

visitor:online / visitor:offline → estado de presencia.

agent:typing / visitor:typing → indicadores de escritura.

message:read → confirmación de lectura.

Manejo de reconexiones:

Intentos automáticos de reconexión.

Re-suscripción a rooms (conversation_id) al reconectar.

Escalabilidad:

Uso de Redis Pub/Sub para distribuir eventos entre múltiples instancias.

Namespaces por account_id (aislar empresas).

Seguridad:

Autenticación del socket con token JWT.

Validar permisos de cada usuario a nivel de conversation_id.

Rate limiting para evitar flood de mensajes.

5.2 Features de negocio sobre sockets

Presence en tiempo real:

Agentes ven quién está online en ese momento.

Mostrar “agente conectado” al usuario.

Toma de conversación en tiempo real:

Varios agentes viendo la misma conversación.

Lock suave: si un agente escribe, los demás ven que la conversación está “tomada”.

Typing indicators:

Aumenta percepción de soporte humano activo.

Vistas en vivo:

Ver en tiempo real la URL actual del usuario.

Ver cambios de página en vivo (“navegación en vivo”).

Monitoreo de carga:

Dashboard en vivo de:

Nº de usuarios conectados ahora.

Nº de conversaciones activas.

Agentes disponibles vs ocupados.

Routing inteligente:

Asignar en tiempo real conversaciones al agente menos cargado.

Reasignar si un agente se desconecta.

Notificaciones instantáneas:

Push a agentes cuando entra una conversación de alto valor (definida por reglas).

“Prioridad alta” para ciertos segmentos (ej. clientes enterprise).

Multi-dispositivo:

Mismo agente conectado desde web y mobile, recibiendo el mismo stream de mensajes vía socket.

SLA en tiempo real:

Contador de tiempo de primera respuesta en cada conversación.

Alertas si se está por vencer el SLA configurado.

 [DOING] 6 ARQUITECTURA TÉCNICA PROPUESTA

6.1 Frontend dashboard (admin e inbox) [DOING - layout, inbox UI y ruta /dashboard creadas]

Next.js / React + TypeScript.

Tailwind CSS + librería de componentes (ej. shadcn/ui).

Autenticación con JWT y cookies httpOnly.

Conexión a sockets para:

Nuevos mensajes.

Actualización de estado de conversaciones.

6.2 Widget de chat

Componente JS independiente (micro-frontend).

Carga mediante snippet:

<script src="https://cdn.tuapp.com/widget.js" data-app-id="XXX"></script>

Funciones básicas del SDK:

init(app_id).

identify(userData).

track(eventName, properties).

open(), close().

Conecta al backend vía:

REST para historial inicial.

Socket para mensajes en tiempo real.

6.3 Backend API

Node.js con NestJS / Express / Fastify.

REST API (o GraphQL si lo prefieres).

WebSockets (Socket.io o ws) para tiempo real.

Endpoints principales:

Auth: /auth/signup, /auth/login, /auth/me.

Widget: /widget/init, /widget/messages, /widget/conversations.

Admin: /inbox/conversations, /inbox/messages, /articles, /bot-rules, /triggers.

6.4 Base de datos

PostgreSQL como base principal.

Esquema con:

accounts, users, sites, visitors, conversations, messages, articles, bot_rules, events, triggers, billing.

Redis:

Cache de sesiones.

Pub/Sub para eventos de socket.

6.5 Infraestructura

Todo dockerizado.

Backend: desplegado en PaaS (Railway, Render, Fly.io o similar).

Frontend dashboard: Vercel / Netlify.

CDN para servir el JS del widget con baja latencia global.

Logs centralizados y monitoreo básico (errores, tiempos de respuesta).

 [TODO] 7 PLAN POR FASES

Fase 0 – Diseño de producto (1 semana)

Definir tipo de cliente objetivo (e-commerce, SaaS, etc.).

Seleccionar 3 a 5 features clave del MVP.

Bocetar pantallas:

Inbox.

Configuración de widget.

Configuración de bot.

Definir pricing preliminar:

Plan con límite de conversaciones o agentes.

Fase 1 – MVP Chat Básico

Implementar modelo de datos base.

Implementar endpoints de auth y gestión de cuentas.

Crear widget mínimo que:

Inicie sesión de visitante.

Envíe y reciba mensajes vía sockets.

Crear inbox básico con:

Lista de conversaciones.

Vista de conversación.

Responder mensajes.

Probar multi-tenant (distintas cuentas sin mezclar datos).

Fase 2 – Bot de reglas + Base de conocimiento

CRUD de artículos en dashboard.

Motor de reglas sencillo:

Palabras clave → respuestas automáticas.

UI para crear reglas.

Mejorar widget para:

Mostrar mensajes del bot.

Sugerir artículos.

Fase 3 – Segmentación, triggers y métricas

Implementar identify() y track() en SDK.

Guardar eventos básicos (visitas, páginas).

Triggers basados en URL, tiempo en página y nº visitas.

Panel de métricas simples en dashboard.

Fase 4 – Integraciones y AI

API pública y webhooks.

Conectores simples con n8n/Zapier.

Chatbot IA leyendo base de conocimiento.

Configuración de IA y métricas de rendimiento.

 [DOING] 8 MODELO DE DATOS RESUMIDO (empezando accounts/sites multi-tenant)

accounts (id, name, plan, created_at) [DOING]
users (id, account_id, name, email, role, password_hash, created_at)
sites (id, account_id, name, app_id, domain, widget_config_json) [DOING]
visitors (id, account_id, site_id, external_id, email, name, last_seen_at, created_at)
conversations (id, account_id, site_id, visitor_id, status, assigned_user_id, created_at, updated_at)
messages (id, conversation_id, sender_type, sender_id, content, metadata_json, created_at)
articles (id, account_id, title, body, tags, created_at, updated_at)
bot_rules (id, account_id, trigger_type, condition_json, action_json, created_at)
events (id, account_id, visitor_id, name, properties_json, created_at)
triggers (id, account_id, name, condition_json, action_json, created_at)

 [TODO] 9 FEATURES DE NEGOCIO CLAVE (VISIÓN SaaS)

Planes por nº de agentes o nº de conversaciones.

Límite de features por plan:

Plan básico: chat + inbox + widget.

Plan pro: bot de reglas + base de conocimiento + triggers.

Plan enterprise: IA, integraciones avanzadas, SLA personalizados.

Branding personalizado:

Logo propio, colores, textos.

Múltiples sitios por cuenta (un cliente con varias marcas).

Métricas orientadas a negocio:

Conversaciones por canal (web, app).

Motivos de contacto (según etiquetas).

Tiempos de respuesta por agente.

Panel para éxito del cliente:

Ver qué empresas usan más el sistema.

Detectar riesgo de churn (pocas conversaciones, baja actividad).