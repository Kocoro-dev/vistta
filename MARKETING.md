# MARKETING.md

Documentación técnica del sistema de marketing, atribución y analytics de Vistta.

## Tabla de Contenidos

1. [Cookie Consent Management (CMP)](#cookie-consent-management-cmp)
2. [Sistema de Atribución UTM](#sistema-de-atribución-utm)
3. [Tracking de Sesiones](#tracking-de-sesiones)
4. [Integración GTM / GA4](#integración-gtm--ga4)
5. [Tracking de Compras](#tracking-de-compras)
6. [Notificaciones Discord](#notificaciones-discord)
7. [Flujos de Datos](#flujos-de-datos)

---

## Cookie Consent Management (CMP)

### Implementación

**Archivo:** `src/components/cookie-consent.tsx`

Banner de consentimiento GDPR con Google Consent Mode v2 integrado.

### Consent Mode v2

El script de inicialización se carga ANTES de GTM en `layout.tsx`:

```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'analytics_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
```

### Estados de Consentimiento

| Estado | Descripción | Afecta |
|--------|-------------|--------|
| `ad_storage` | Cookies de publicidad | Google Ads, remarketing |
| `analytics_storage` | Cookies de analytics | GA4, eventos |
| `ad_user_data` | Datos de usuario para ads | Conversiones Google Ads |
| `ad_personalization` | Personalización de anuncios | Remarketing personalizado |

### Opciones de Usuario

1. **Aceptar todas** - Actualiza todos los estados a `granted`
2. **Rechazar** - Mantiene todos en `denied`
3. **Preferencias** - Permite granularidad (analytics sí, ads no)

### Persistencia

- LocalStorage key: `vistta_cookie_consent`
- Valores: `accepted`, `rejected`, `custom`
- Si `custom`: `vistta_consent_preferences` guarda objeto con cada estado

---

## Sistema de Atribución UTM

### Cookie de Atribución

**Cookie:** `app_attribution`
- **Duración:** 30 días
- **SameSite:** Lax
- **Requiere consentimiento:** No (esencial para operaciones)

### Parámetros Capturados

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `utm_source` | Fuente de tráfico | google, facebook, newsletter |
| `utm_medium` | Medio de marketing | cpc, email, social |
| `utm_campaign` | Nombre de campaña | black_friday_2024 |
| `utm_term` | Palabra clave (PPC) | home staging ia |
| `utm_content` | Variante del anuncio | banner_v2 |

### Estructura del Objeto Attribution

```typescript
interface Attribution {
  visitor_id: string;      // UUID persistente
  session_number: number;  // Contador de sesiones
  first_visit: string;     // ISO timestamp primera visita
  last_visit: string;      // ISO timestamp última visita
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  referrer?: string;       // document.referrer
  landing_page?: string;   // Primera página visitada
  country?: string;        // Geolocalización
  city?: string;
  device_type?: string;    // desktop, mobile, tablet
  browser?: string;        // Chrome, Safari, Firefox, etc.
}
```

### Archivos Relevantes

| Archivo | Propósito |
|---------|-----------|
| `src/types/attribution.ts` | Tipos TypeScript |
| `src/lib/attribution.ts` | Lógica de cookies, UTM, device detection |
| `src/hooks/use-attribution.ts` | Hook React para consumir atribución |
| `src/components/attribution-tracker.tsx` | Componente que inicializa el tracking |

### Lógica de Captura

1. **Primera visita:** Se genera `visitor_id`, se capturan UTMs si existen
2. **Visitas posteriores:** Se incrementa `session_number`, se actualizan UTMs solo si hay nuevos
3. **UTMs vacíos:** No sobrescriben valores existentes (first-touch attribution)

### URL de Prueba

```
https://www.visttahome.com/?utm_source=test&utm_medium=email&utm_campaign=prueba_sistema
```

---

## Tracking de Sesiones

### Base de Datos

**Tabla:** `sessions`

```sql
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY,
  visitor_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_number INTEGER DEFAULT 1,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  landing_page TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Views Analíticas

**`attribution_summary`** - Resumen por fuente
```sql
SELECT utm_source, utm_medium, utm_campaign,
       COUNT(DISTINCT visitor_id) as unique_visitors,
       COUNT(*) as total_sessions
FROM sessions
GROUP BY utm_source, utm_medium, utm_campaign;
```

**`geo_distribution`** - Distribución geográfica
```sql
SELECT country, city, COUNT(*) as sessions
FROM sessions
GROUP BY country, city;
```

**`device_distribution`** - Distribución por dispositivo
```sql
SELECT device_type, browser, COUNT(*) as sessions
FROM sessions
GROUP BY device_type, browser;
```

### Server Actions

**Archivo:** `src/actions/sessions.ts`

| Función | Propósito |
|---------|-----------|
| `saveSession(sessionData)` | Guarda sesión en DB |
| `linkVisitorToUser(visitorId, userId)` | Vincula sesiones anónimas post-login |
| `recordRegistration(userId, email, attribution)` | Notifica registro |
| `recordSale(userId, email, planType, amount, attribution)` | Notifica venta |

### Vinculación Post-Login

Cuando un usuario se registra/logea, se actualizan todas sus sesiones previas:

```typescript
await supabase
  .from("sessions")
  .update({ user_id: userId })
  .eq("visitor_id", visitorId);
```

---

## Integración GTM / GA4

### GTM Attribution Bridge

**Archivo:** `src/components/gtm-attribution-bridge.tsx`

Expone datos de atribución al dataLayer para consumo en GTM.

### Eventos DataLayer

**`attribution_ready`** - Se dispara cuando la atribución está lista
```javascript
{
  event: 'attribution_ready',
  attribution: {
    visitor_id: 'xxx-xxx-xxx',
    session_number: 1,
    utm_source: 'google',
    utm_medium: 'cpc',
    utm_campaign: 'brand',
    device_type: 'desktop',
    country: 'ES'
  }
}
```

**`attribution_updated`** - Se dispara si cambia la atribución en la sesión

### Configuración en GTM

1. **Variable - Visitor ID**
   - Tipo: Data Layer Variable
   - Nombre: `attribution.visitor_id`

2. **Variable - UTM Source**
   - Tipo: Data Layer Variable
   - Nombre: `attribution.utm_source`

3. **Trigger - Attribution Ready**
   - Tipo: Custom Event
   - Event name: `attribution_ready`

4. **Tag - GA4 Event**
   - Trigger: Attribution Ready
   - Event: `session_start_attributed`
   - Parameters: visitor_id, utm_source, utm_medium, etc.

---

## Tracking de Compras

### Flujo de Compra

```
Usuario → PricingCard → createCheckoutSession → LemonSqueezy → Webhook → /payment/success
```

### Custom Data en LemonSqueezy

Al crear el checkout, se pasan datos de atribución:

```typescript
// src/actions/payments.ts
const checkout = await createCheckout(storeId, variantId, {
  checkoutData: {
    custom: {
      user_id: user.id,
      plan_type: planType,
      credits: credits.toString(),
      visitor_id: visitorId, // Para vincular atribución
    },
  },
});
```

### Webhook Processing

**Archivo:** `src/app/api/webhooks/lemonsqueezy/route.ts`

El webhook:
1. Extrae `visitor_id` de `custom_data`
2. Busca sesión en DB para obtener atribución
3. Actualiza perfil del usuario (créditos/suscripción)
4. Envía notificación Discord con fuente de atribución

### Página de Éxito

**Archivo:** `src/app/(protected)/payment/success/payment-success-content.tsx`

Dispara evento GA4 Ecommerce:

```javascript
window.dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: payment.stripe_session_id,
    value: payment.amount / 100,
    currency: 'EUR',
    items: [{
      item_id: payment.plan_type,
      item_name: 'Pack Ocasional', // o 'Plan Agencia'
      price: payment.amount / 100,
      quantity: 1,
      item_category: 'one_time' // o 'subscription'
    }]
  },
  attribution: {
    visitor_id: '...',
    utm_source: '...',
    utm_medium: '...',
    utm_campaign: '...'
  },
  user_data: {
    email: 'user@example.com'
  }
});
```

### Configuración GA4 en GTM

1. **Trigger - Purchase**
   - Tipo: Custom Event
   - Event name: `purchase`

2. **Tag - GA4 Ecommerce Purchase**
   - Tipo: GA4 Event
   - Event: `purchase`
   - E-commerce: Read from dataLayer

---

## Notificaciones Discord

### Configuración

**Variable de entorno:** `DISCORD_WEBHOOK_URL`

### Archivo Compartido

**Archivo:** `src/lib/discord.ts`

```typescript
export async function sendDiscordNotification(payload: NotifyPayload) {
  // Envía embed formateado a Discord webhook
}
```

### Tipos de Eventos

| Evento | Color | Descripción |
|--------|-------|-------------|
| `new_visit` | Naranja (#f97316) | Primera visita de un visitor_id |
| `new_registration` | Azul (#3b82f6) | Usuario se registra |
| `new_sale` | Verde (#22c55e) | Compra completada |

### Formato del Mensaje

```
🟢 Nueva Venta

Usuario: user@example.com
Plan: Pack Ocasional
Importe: 19,00€

📊 Atribución
• Fuente: google / cpc
• Campaña: brand_2024
• País: España
• Dispositivo: desktop / Chrome
• Sesiones previas: 3
```

---

## Flujos de Datos

### Flujo: Primera Visita

```
1. Usuario llega a landing (con/sin UTMs)
2. attribution-tracker.tsx se monta
3. initAttribution() en lib/attribution.ts:
   - Genera visitor_id (UUID)
   - Extrae UTMs de URL
   - Detecta device/browser
   - Fetch /api/geo para país/ciudad
   - Guarda cookie app_attribution
4. Si trackSessions=true:
   - saveSession() guarda en DB
5. Si notifyOnFirstVisit=true && session_number=1:
   - sendNotification() a Discord
6. gtm-attribution-bridge.tsx:
   - Push 'attribution_ready' a dataLayer
```

### Flujo: Login/Registro

```
1. Usuario completa login/registro
2. En callback:
   - linkVisitorToUser() actualiza sessions con user_id
   - recordRegistration() notifica a Discord (si es nuevo)
```

### Flujo: Compra

```
1. Usuario en /pricing o /cuenta/pagos
2. Click "Comprar ahora"
3. useAttribution() obtiene visitor_id
4. createCheckoutSession(planType, visitor_id)
5. Redirect a LemonSqueezy checkout
6. Usuario paga
7. Webhook recibe order_created/subscription_created
8. handleOrderCreated():
   - Crea registro en payments
   - Actualiza créditos en profiles
   - Busca atribución por visitor_id en sessions
   - sendDiscordNotification() con atribución
9. Redirect a /payment/success
10. PaymentSuccessContent:
    - Push 'purchase' event a dataLayer (GA4)
    - Push 'vistta_purchase' event (custom)
```

---

## Configuración en Producción

### Variables de Entorno Requeridas

```env
# Discord
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# LemonSqueezy
LEMONSQUEEZY_API_KEY=...
LEMONSQUEEZY_STORE_ID=...
LEMONSQUEEZY_WEBHOOK_SECRET=...
LEMONSQUEEZY_OCASIONAL_VARIANT_ID=...
LEMONSQUEEZY_AGENCIA_VARIANT_ID=...

# Supabase (para sessions)
SUPABASE_SERVICE_ROLE_KEY=...
```

### Migraciones Requeridas

Ejecutar en Supabase SQL Editor:
```
supabase/sessions-migration.sql
```

### Verificación

1. **Atribución funciona:**
   - Visitar con UTMs → Abrir DevTools → Application → Cookies → `app_attribution`

2. **Discord recibe notificaciones:**
   - Primera visita → Mensaje naranja en Discord
   - Registro → Mensaje azul
   - Compra → Mensaje verde

3. **GTM recibe datos:**
   - Console: `dataLayer` → Buscar `attribution_ready`
   - GTM Preview → Ver variables de atribución

4. **GA4 recibe compras:**
   - Completar compra de prueba → GA4 Realtime → Ecommerce
