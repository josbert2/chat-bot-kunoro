# 🎨 UI del Dashboard - Gestión de Tokens API

Interfaz completa y profesional integrada en el dashboard para gestionar tokens Bearer.

## 🚀 Acceso Rápido

1. Inicia sesión en el dashboard: `http://localhost:3000/dashboard`
2. Click en el ícono **⚙️ Configuración** en la barra lateral izquierda
3. En el menú lateral, click en **🔐 Tokens API**
4. ¡Ya puedes generar y gestionar tus tokens!

---

## 📋 Características Principales

### 1. Página Principal de Tokens

**Ruta:** `/dashboard/settings/api-tokens`

**Elementos:**

#### 📊 Estadísticas en Tiempo Real
- **Total de tokens**: Cuenta todos los tokens creados
- **Tokens activos**: Solo los que están funcionando
- **Tokens expirados**: Los que pasaron su fecha de expiración

#### 💡 Card Informativa
- Explicación clara de qué son los tokens Bearer
- Mejores prácticas de seguridad
- Links a documentación y herramienta de pruebas
- Guía de uso rápido

#### 📝 Lista Completa de Tokens
Cada token muestra:
- ✅ **Nombre descriptivo**
- 🔐 **Preview del token** (primeros y últimos caracteres)
- 🏷️ **Scopes/Permisos** con badges visuales
- 📅 **Fecha de creación**
- 🕐 **Última vez usado**
- ⏰ **Fecha de expiración** (si aplica)
- 🆔 **ID del token**
- 🗑️ **Botón para revocar**

#### 🎨 Estados Visuales
- **✓ ACTIVO**: Badge verde - token funcionando
- **❌ REVOCADO**: Badge rojo - token desactivado
- **⏰ EXPIRADO**: Badge amarillo - token vencido

---

### 2. Modal de Generación de Tokens

**Trigger:** Botón "➕ Generar Token"

#### Formulario Completo

**Nombre del Token** (Requerido)
- Campo de texto para identificar el token
- Ejemplo: "Mi aplicación móvil", "Backend de producción", etc.

**Permisos (Scopes)**
- Checkboxes visuales para cada scope
- Opciones disponibles:
  - 🔓 **Acceso completo** (`*`) - Todos los permisos
  - 📖 **Chat: Lectura** (`chat:read`) - Leer conversaciones
  - ✍️ **Chat: Escritura** (`chat:write`) - Enviar mensajes
  - 🌐 **Sitios: Lectura** (`sites:read`) - Listar sitios
  - 🏗️ **Sitios: Escritura** (`sites:write`) - Crear/editar sitios
  - 👤 **Cuenta: Lectura** (`account:read`) - Info de cuenta

**Expiración** (Opcional)
- Campo numérico para días hasta expiración
- Ejemplos: 30, 90, 365
- Vacío = sin expiración

#### Vista de Token Generado

Cuando se genera exitosamente:

**⚠️ Advertencia de Seguridad**
- Banner destacado explicando que solo se muestra una vez
- Color verde esmeralda para captar atención

**Campo del Token**
- Token completo visible
- Campo de solo lectura
- Botón "📋 Copiar" con feedback visual

**Próximos Pasos**
- Lista de acciones recomendadas
- Guía de uso del token
- Link a interfaz de pruebas

**Botón de Cierre**
- "Entendido, cerrar"
- Al cerrar, refresca la lista de tokens

---

### 3. Navegación en el Sidebar

**Actualización del SettingsSubSidebar:**

#### Sección "Canales"
- 💬 Chat en vivo → `/dashboard/settings`

#### Sección "Desarrollo" (Nueva)
- 🔐 Tokens API → `/dashboard/settings/api-tokens`

**Indicadores Visuales:**
- Página activa: fondo azul/verde + borde
- Hover: fondo gris claro
- Íconos consistentes con el diseño del dashboard

---

## 🎨 Diseño y UX

### Paleta de Colores

**Activo/Positivo:**
- Emerald/Verde: `bg-emerald-50`, `text-emerald-700`, `border-emerald-200`

**Información:**
- Azul: `bg-blue-50`, `text-blue-700`, `border-blue-200`

**Advertencia:**
- Amarillo/Amber: `bg-amber-50`, `text-amber-700`, `border-amber-200`

**Error/Revocado:**
- Rojo: `bg-red-50`, `text-red-700`, `border-red-200`

**Neutral:**
- Slate: `bg-slate-50`, `text-slate-700`, `border-slate-200`

### Tipografía

- **Títulos principales**: `text-xl font-bold`
- **Subtítulos**: `text-base font-semibold`
- **Texto normal**: `text-sm`
- **Texto pequeño**: `text-xs`
- **Labels**: `text-[11px] font-medium uppercase tracking-wide`
- **Código**: `font-mono text-xs`

### Espaciado

- Cards: `p-4` o `p-6`
- Gaps entre elementos: `gap-3` o `gap-4`
- Márgenes: `mb-2`, `mt-3`, etc.
- Bordes redondeados: `rounded-xl` o `rounded-lg`

---

## 🔧 Componentes Creados

### 1. `GenerateTokenButton.tsx`
**Tipo:** Client Component  
**Responsabilidad:** Botón que abre el modal

```typescript
- Estado local para controlar apertura del modal
- Estilo consistente con el dashboard
- Props: ninguna
```

### 2. `GenerateTokenModal.tsx`
**Tipo:** Client Component  
**Responsabilidad:** Modal completo para generar tokens

```typescript
Props:
- isOpen: boolean
- onClose: () => void

Estados:
- loading: mostrar spinner durante la generación
- error: mostrar mensajes de error
- generatedToken: almacenar token generado
- copied: feedback del botón copiar
- name, expiresInDays, selectedScopes: formulario

Funciones:
- handleSubmit: POST a /api/tokens/generate
- handleCopy: copiar al clipboard
- toggleScope: gestionar selección de scopes
- handleClose: cerrar y refrescar
```

### 3. `TokensList.tsx`
**Tipo:** Client Component  
**Responsabilidad:** Lista interactiva de tokens

```typescript
Props:
- initialTokens: ApiToken[]

Estados:
- tokens: lista local de tokens
- revokingId: ID del token siendo revocado

Funciones:
- handleRevoke: DELETE a /api/tokens/revoke
- formatDate: formatear fechas amigables
- getTokenPreview: truncar token
- isExpired: verificar si expiró

Renderiza:
- Card por cada token
- Información completa del token
- Botón de revocar (solo si está activo)
```

### 4. `page.tsx` (API Tokens)
**Tipo:** Server Component  
**Responsabilidad:** Página principal con datos del servidor

```typescript
- Obtiene sesión actual
- Valida que tenga cuenta asociada
- Consulta todos los tokens de la cuenta
- Pasa datos a componentes client
- Renderiza layout de la página
```

---

## 🔒 Seguridad Implementada

### Validaciones

1. **Sesión requerida**: Solo usuarios autenticados pueden acceder
2. **Cuenta asociada**: El usuario debe tener una cuenta
3. **Pertenencia**: Solo se muestran tokens de la cuenta del usuario
4. **Confirmación de revocación**: Diálogo antes de revocar
5. **Token mostrado una vez**: Seguridad por diseño

### Buenas Prácticas

- ✅ Token nunca se almacena en el cliente (solo preview)
- ✅ Scopes claramente identificados
- ✅ Advertencias visibles sobre seguridad
- ✅ Links a documentación de mejores prácticas
- ✅ Feedback visual en todas las acciones

---

## 📱 Responsive Design

El diseño es completamente responsive:

### Desktop (>1024px)
- Estadísticas en grid de 3 columnas
- Modal centrado con max-w-2xl
- Sidebar visible

### Tablet (768px - 1024px)
- Estadísticas en grid adaptativo
- Modal responsivo

### Mobile (<768px)
- Estadísticas apiladas
- Modal en fullscreen
- Sidebar colapsable

---

## 🎯 Flujo de Usuario

### Generar un Token

1. Usuario hace click en "➕ Generar Token"
2. Se abre el modal con el formulario
3. Usuario completa:
   - Nombre del token
   - Selecciona permisos
   - (Opcional) Define expiración
4. Click en "Generar Token"
5. Loading state mientras se crea
6. Modal muestra el token generado
7. Usuario lo copia con el botón
8. Usuario cierra el modal
9. La lista se actualiza automáticamente

### Revocar un Token

1. Usuario hace click en "🗑️ Revocar"
2. Aparece confirmación con el nombre del token
3. Usuario confirma
4. Loading state en el botón
5. Token se desactiva
6. UI se actualiza mostrando estado "REVOCADO"
7. El token ya no puede autenticar requests

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Generar token sin nombre (debe fallar)
- [ ] Generar token con solo nombre (debe funcionar)
- [ ] Generar token con scopes personalizados
- [ ] Generar token con expiración
- [ ] Copiar token al clipboard
- [ ] Ver lista de tokens
- [ ] Revocar token activo
- [ ] Intentar revocar token ya revocado (botón deshabilitado)
- [ ] Ver token expirado (badge amarillo)
- [ ] Ver última vez usado actualizado
- [ ] Responsive en mobile
- [ ] Navegación entre páginas de settings

---

## 📝 Mejoras Futuras

### Funcionalidades Sugeridas

1. **Filtros**
   - Por estado (activos, expirados, revocados)
   - Por scopes
   - Por fecha de creación

2. **Búsqueda**
   - Por nombre
   - Por ID
   - Por fecha

3. **Edición**
   - Cambiar nombre del token
   - Actualizar scopes
   - Extender expiración

4. **Analítica**
   - Gráfico de uso por token
   - Endpoints más usados
   - Errores por token

5. **Notificaciones**
   - Email cuando un token está por expirar
   - Alerta de tokens no usados en X días
   - Notificación de tokens comprometidos

6. **Exportación**
   - Descargar lista de tokens
   - Exportar logs de uso
   - Generar reporte de seguridad

---

## 🎉 Resultado Final

Una interfaz profesional, intuitiva y segura para gestionar tokens API directamente desde el dashboard. Los usuarios pueden:

✅ Generar tokens en segundos  
✅ Ver toda la información relevante  
✅ Controlar permisos granularmente  
✅ Revocar tokens con facilidad  
✅ Mantener la seguridad de su API  

**¡Todo sin salir del dashboard!** 🚀

---

## 🆘 Soporte

Si encuentras problemas con la UI:

1. Verifica que estés autenticado
2. Confirma que completaste el onboarding
3. Revisa la consola del navegador (F12)
4. Verifica los logs del servidor
5. Consulta `INSTRUCCIONES_FINALES.md` para más ayuda

---

**Fecha:** Noviembre 2024  
**Versión:** 1.0.0

