0. Visión del producto (SaaS)

Qué estás creando:
Un SaaS B2B de atención al cliente multicanal con:

Widget de chat web embebible

Inbox unificado (web, WhatsApp, IG, FB, email…)

Chatbots (reglas + flow builder)

IA sobre FAQs / base de conocimiento

Multicuenta/multi-equipo

Facturación por suscripción (planes + límites)

Piensa en algo tipo:

“Central de atención y ventas multicanal para negocios que no tienen equipo técnico, pero quieren ver todo en un solo lugar.”

1. Propuesta de valor del SaaS
Cliente objetivo

E-commerce pequeños y medianos

Negocios con alto volumen de consultas (parques, eventos, academias, etc.)

Agencias que manejan varios clientes (multi-cuenta)

“Jobs to be done”

Ver todas las conversaciones en un solo lugar.

Responder más rápido con bots / IA.

No depender de un dev para instalar nada (solo copiar/pegar script).

Medir atención (tiempos de respuesta, resolución, etc.).

Diferenciadores posibles vs Tidio

Mejor soporte para Latam / español (tonos, localización).

Flujos de WhatsApp más amigables (tipo embudo de ventas).

Mini-CRM: estado del lead (nuevo, en seguimiento, cerrado, perdido).

Integraciones pensadas para tu ecosistema (Bookforce, Entrekids, etc. a futuro).

2. Módulos de producto (visión SaaS)

Voy a ordenar tus módulos pensando en pantallas / features que ve tu cliente (el negocio).

2.1. Cuenta y Workspaces (SaaS core)

Registro / login (email + password, luego SSO opcional).

Workspace / Organización:

Un usuario puede tener varios workspaces (ej: Agencia).

Planes y límites a nivel de workspace:

Conversaciones/mes

N° de agentes

Canales habilitados (solo web / más WhatsApp / IG / etc.)

Gestión de equipo:

Invitar miembros (por email).

Roles: Owner, Admin, Agent, Viewer.

2.2. Sitios / Proyectos

Dentro del workspace:

“Sitios” o “Proyectos”:

Cada uno representa una web/app que instala el widget.

Cada proyecto tiene su SITE_KEY / PROJECT_KEY.

Config individual por proyecto:

Apariencia del widget.

Horarios de atención.

Reglas de enrutamiento (bot vs agente).

Idioma.

2.3. Widget de chat web

Lo que va en la web del cliente:

<script src="https://cdn.tu-saas.com/widget.js" data-key="SITE_KEY" async></script>

Temas y estilos:

Claro / oscuro.

Colores personalizados.

Posición: bottom-left / bottom-right.

Funciones:

Livechat con agentes (si están online).

Formulario offline (cuando no).

Captura de nombre y email.

Persistencia de sesión (visitor_id en cookie/localStorage).

Aislamiento:

Ideal: Shadow DOM o iframe para evitar conflictos de CSS.

2.4. Inbox unificado

Panel web para el negocio:

Lista de conversaciones:

Filtros por:

Estado: abiertas, pendientes, cerradas.

Canal: Web, WhatsApp, IG, FB, email.

Agente asignado.

Vista de conversación:

Timeline de mensajes.

Notas internas.

Etiquetas (tags).

Datos del cliente (nombre, email, país, tags, últimos pedidos si integras).

Acciones:

Asignar agente.

Cambiar estado.

Responder con plantillas rápidas.

Hacer “mention” a otro agente (para colaboración interna).

2.5. Chatbots y automatizaciones
A. Chatbot básico (reglas + flujo)

Flow Builder (en fases):

V1: JSON + UI simple (sin drag & drop complejo).

Bloques:

Enviar texto.

Preguntar (input texto / botones).

Condiciones (si respuesta contiene X, ir a nodo Y).

Llamar a webhook (por ejemplo, consultar stock).

Handover a agente humano.

Triggers:

On first visit.

On page view (URL contiene X).

After X seconds.

Fuera de horario -> flujo especial.

B. Automatizaciones

Enviar mensaje si:

Usuario intenta cerrar la página sin escribir.

El usuario no responde después de X min.

Se detecta una palabra clave (“precio”, “horario”, “devolución”).

Integraciones:

Webhooks.

Google Sheets / CRM (futuro).

2.6. IA / FAQ Bot

Base de conocimiento por workspace:

FAQs, artículos, PDFs.

Motor RAG:

El mensaje del usuario se busca en esa base.

La IA genera una respuesta en el tono definido por el cliente.

Modos de funcionamiento:

Solo sugerencias al agente (el agente edita y envía).

Respuesta directa al cliente (modo bot).

Config:

Activar / desactivar IA por proyecto.

Umbral de confianza para handover a humano.

2.7. Multicanal

En una fase posterior, pero lo dejamos diseñado:

Canales:

Web (widget).

WhatsApp Cloud API.

Instagram DM (Meta Graph).

Facebook Messenger.

Email (IMAP/SMTP).

Telegram Bot.

Cada canal:

se conecta mediante un connector.

todos mapean a:

EndUser

Conversation

Message

Inbox no diferencia: solo marca el canal con un iconito/etiqueta.

2.8. Reporting y Analytics

Por workspace / proyecto:

Nº de conversaciones/día.

Tiempo medio de primera respuesta.

Conversaciones resueltas por bot vs humano.

Top palabras clave.

Exportar a CSV o integración con un BI (más adelante).

3. Arquitectura Técnica (SaaS multi-tenant)
3.1. Frontend

Dashboard / Admin

Next.js 14 (App Router)

TailwindCSS

Auth con NextAuth (JWT + sessions)

Widget

Bundle JS ligero:

Podría ser Svelte, Preact o Vanilla + Vite.

Se sirve desde un CDN: cdn.tu-saas.com/widget.js.

Comunicación:

REST para init.

WebSockets para tiempo real.

3.2. Backend

Node.js + NestJS

Módulos:

auth (usuarios, sesiones)

billing (planes, suscripciones)

workspaces (organizaciones)

projects (sitios)

conversations, messages

chatbots, automations

channels (whatsapp, etc.)

Protocolos:

REST/JSON para panel.

WebSockets para chats.

Webhooks para eventos externos.

3.3. Base de Datos

PostgreSQL (multi-tenant por workspace_id en todas las tablas clave).

Tablas principales (simplificado):

users

workspaces

workspace_members

subscriptions

projects

channels (tipo, credenciales externas)

end_users (clientes finales)

conversations

messages

bots / flows

automation_rules

events (para analítica)

3.4. Real-Time

WebSockets:

Puede ser Socket.IO o ws nativo.

Redis Pub/Sub para escalar en múltiples instancias:

Cada nuevo mensaje -> publish a canal.

Las instancias suscritas lo envían a los sockets conectados.

3.5. Colas / Jobs

BullMQ (Redis)

Procesar:

Mensajes de WhatsApp (entrada/salida).

Envío de emails.

Ejecución de automatizaciones programadas.

Jobs de IA (respuestas, training).

3.6. Infraestructura

Railway / Render / Fly.io para arrancar rápido.

Docker para contenerizar todo.

Nginx / Caddy como reverse proxy.

CDN (Cloudflare / Bunny) para widget.js y assets.

4. Multi-tenant, roles y seguridad
4.1. Multi-tenant

Cada request autenticado lleva workspace_id en el token.

Todos los recursos están scopeados por workspace_id.

Los proyectos no se mezclan entre workspaces.

4.2. Roles y permisos

Owner:

Maneja billing, elimina workspace, gestiona miembros.

Admin:

Configura proyectos, bots, canales.

Agent:

Solo ve inbox + contactos.

Viewer (opcional):

Solo lee, no responde.

4.3. Seguridad

JWT con expiración corta + refresh tokens.

Hash de passwords (bcrypt o argon2).

Rate limiting (Redis).

CORS bien configurado (dashboard y widget).

Logs de auditoría:

quién cambió qué, cuándo.

5. Planes, límites y billing
Plan Free

1 workspace

1 proyecto

1 agente

X conversaciones/mes (ej: 50–100)

Solo canal Web

Chatbot simple (sin IA)

Plan Pro (SaaS estándar)

Hasta 5 agentes

Varios proyectos

WhatsApp + IG + FB

Chatbot avanzado con Flow Builder

IA en modo sugerencia

Límites de conversaciones más altos

Plan Enterprise

Agentes ilimitados

SLA, soporte dedicado

IA completa

Integraciones custom (API, CRM, etc.)

Implementación técnica de billing

Integración con Stripe (ideal)

Webhooks para:

checkout.session.completed

invoice.payment_succeeded

customer.subscription.updated

subscriptions en BD:

workspace_id

plan

status

current_period_start, current_period_end

Middleware de “límites”:

Antes de crear nueva conversación, validar:

si excedió las conversaciones del mes.

En UI mostrar banners de “estás llegando al límite”.

6. Flujos clave del SaaS
6.1. Onboarding de nuevo cliente

Usuario llega a tu landing.

Crea cuenta (email + password).

Crea su primer workspace.

Wizard:

Crea su primer proyecto (nombre + dominio).

Genera script del widget.

Muestra snippet para copiar/pegar.

Empieza plan Free por defecto.

Una vez instalado el widget → ¡primer chat!

6.2. Instalación del widget

Pantalla con:

Código <script> listo.

Botón para enviar instrucciones al dev (email).

Paso a paso:

“Pega esto antes de cerrar el </body> de tu sitio”.

Botón “Probar widget”:

Abre una preview o check de conexión.

6.3. Creación de un chatbot

En el panel, menú “Bots”.

Botón “Crear Bot”:

Eliges plantilla:

Bot de bienvenida.

Captura de lead.

Soporte FAQs.

Editor de flujo:

Nodos y conexiones.

Asignación:

En qué proyectos y en qué condiciones se activa.

6.4. Conexión de canal (ej: WhatsApp)

El cliente va a “Canales → WhatsApp”.

Wizard:

Conectar número vía WhatsApp Cloud API.

Guardas token y configs cifradas.

A partir de ahí todos los mensajes entran a conversations.

7. Roadmap por fases (en modo SaaS realista)
Fase 1 – SaaS MVP (solo Webchat)

Meta: lanzar algo usable cobrable en plan Free/Pro básico.

Incluye:

Registro, login, workspaces.

Un plan gratuito con límites.

Proyectos y widget de chat web.

Inbox básico en tiempo real.

Estados de conversación + asignación.

Panel simple de ajustes de widget.

Fase 2 – Bots y automatizaciones

Flow Builder simple (sin drag & drop ultra fancy al principio).

Triggers (on visit, after X sec, fuera de horario).

Nodos de:

mensaje,

pregunta,

condición,

handover.

Reglas de palabras clave.

Fase 3 – Billing y planes

Integración Stripe.

Pantalla de upgrade/downgrade.

Enforzar límites por conversación/mes.

(Puedes poner esto antes de los bots si quieres cobrar rápido. Depende de tu estrategia.)

Fase 4 – Multicanal inicial

WhatsApp Cloud API (muy demandado).

Mapping a conversations.

Etiquetas visuales por canal.

Fase 5 – IA & Knowledge Base

KB por workspace.

FAQ bot con IA:

modo sugerencia -> luego modo automático.

Métricas de desempeño del bot.

8. Diferenciadores simples para destacar como SaaS

“SaaS pensado para Latam” → plantillas listas para español.

Flujos ya hechos para casos típicos:
“¿Horarios?”, “¿Devoluciones?”, “¿Precios?”.

UX muy simple para dueños no técnicos.

Onboarding guiado en 5 minutos (sin programar).