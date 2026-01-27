/**
 * Discord Webhook Utilities
 *
 * Shared functions for sending Discord notifications.
 * Can be used from both API routes and server actions.
 */

import type { NotifyPayload, NotifyEventType } from "@/types/attribution";

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

// Event configuration
const EVENT_CONFIG: Record<
  NotifyEventType,
  { emoji: string; title: string; color: number }
> = {
  new_visit: {
    emoji: "👋",
    title: "Nueva Visita",
    color: 0xf97316, // Orange
  },
  new_registration: {
    emoji: "🎉",
    title: "Nuevo Registro",
    color: 0x3b82f6, // Blue
  },
  new_lead: {
    emoji: "🚀",
    title: "Nuevo Lead",
    color: 0x8b5cf6, // Purple
  },
  new_sale: {
    emoji: "💰",
    title: "Nueva Venta",
    color: 0x22c55e, // Green
  },
  generation_created: {
    emoji: "✨",
    title: "Generación Creada",
    color: 0x06b6d4, // Cyan
  },
};

function obfuscateEmail(email: string): string {
  if (!email || !email.includes("@")) return email || "N/A";

  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}***@${domain}`;

  const visible = Math.min(3, Math.floor(local.length / 2));
  return `${local.substring(0, visible)}***@${domain}`;
}

function formatDeviceInfo(attribution: NotifyPayload["attribution"]): string {
  const parts: string[] = [];

  if (attribution.device_type) {
    const deviceEmoji =
      attribution.device_type === "mobile"
        ? "📱"
        : attribution.device_type === "tablet"
        ? "📱"
        : "🖥️";
    parts.push(`${deviceEmoji} ${capitalize(attribution.device_type)}`);
  }

  if (attribution.browser) {
    parts.push(`${attribution.browser} ${attribution.browser_version || ""}`);
  }

  if (attribution.os) {
    parts.push(`${attribution.os} ${attribution.os_version || ""}`);
  }

  return parts.join(" · ") || "N/A";
}

function formatLocation(attribution: NotifyPayload["attribution"]): string {
  const parts: string[] = [];

  if (attribution.city) parts.push(attribution.city);
  if (attribution.region) parts.push(attribution.region);
  if (attribution.country) parts.push(attribution.country);

  if (parts.length === 0) return "Desconocida";

  // Add flag emoji based on country code
  const flag = attribution.country_code
    ? countryCodeToFlag(attribution.country_code)
    : "";

  return `${flag} ${parts.join(", ")}`.trim();
}

function countryCodeToFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatTimestamp(): string {
  return new Date().toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Check if Discord webhook is configured
 */
export function isDiscordConfigured(): boolean {
  return !!DISCORD_WEBHOOK_URL;
}

/**
 * Send a notification to Discord webhook
 */
export async function sendDiscordNotification(
  payload: NotifyPayload
): Promise<{ success: boolean; error?: string }> {
  if (!DISCORD_WEBHOOK_URL) {
    console.warn("DISCORD_WEBHOOK_URL not configured, skipping notification");
    return { success: false, error: "Webhook not configured" };
  }

  try {
    const { event_type, user_email, attribution, metadata } = payload;

    // Get event config
    const eventConfig = EVENT_CONFIG[event_type] || EVENT_CONFIG.new_visit;

    // Build Discord embed
    const embed = {
      title: `${eventConfig.emoji} ${eventConfig.title}`,
      color: eventConfig.color,
      fields: [
        // User info
        ...(user_email
          ? [
              {
                name: "📧 Email",
                value: `\`${obfuscateEmail(user_email)}\``,
                inline: true,
              },
            ]
          : []),

        // Session info
        {
          name: "🔢 Sesión",
          value: `#${attribution.session_number || 1}`,
          inline: true,
        },

        // Attribution
        {
          name: "📊 Fuente",
          value: `\`${attribution.utm_source || "direct"}\``,
          inline: true,
        },
        ...(attribution.utm_medium
          ? [
              {
                name: "📡 Medio",
                value: `\`${attribution.utm_medium}\``,
                inline: true,
              },
            ]
          : []),
        ...(attribution.utm_campaign
          ? [
              {
                name: "🎯 Campaña",
                value: `\`${attribution.utm_campaign}\``,
                inline: true,
              },
            ]
          : []),

        // Location
        {
          name: "📍 Ubicación",
          value: formatLocation(attribution),
          inline: true,
        },

        // Timezone
        ...(attribution.timezone
          ? [
              {
                name: "🕐 Zona Horaria",
                value: attribution.timezone,
                inline: true,
              },
            ]
          : []),

        // Language
        ...(attribution.language
          ? [
              {
                name: "🌐 Idioma",
                value: attribution.language,
                inline: true,
              },
            ]
          : []),

        // Device info
        {
          name: "💻 Dispositivo",
          value: formatDeviceInfo(attribution),
          inline: false,
        },

        // Screen resolution
        ...(attribution.screen_resolution
          ? [
              {
                name: "📐 Resolución",
                value: attribution.screen_resolution,
                inline: true,
              },
            ]
          : []),

        // Landing page
        ...(attribution.landing_page
          ? [
              {
                name: "🔗 Landing",
                value: `\`${attribution.landing_page}\``,
                inline: true,
              },
            ]
          : []),

        // Referrer
        ...(attribution.referrer
          ? [
              {
                name: "↩️ Referrer",
                value:
                  attribution.referrer.length > 50
                    ? `${attribution.referrer.substring(0, 47)}...`
                    : attribution.referrer,
                inline: false,
              },
            ]
          : []),

        // Metadata (if any)
        ...(metadata && Object.keys(metadata).length > 0
          ? [
              {
                name: "📎 Detalles",
                value: Object.entries(metadata)
                  .map(([k, v]) => `**${k}:** ${v}`)
                  .join("\n"),
                inline: false,
              },
            ]
          : []),
      ],
      footer: {
        text: `Vistta · ${formatTimestamp()}`,
      },
      timestamp: new Date().toISOString(),
    };

    // Send to Discord
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Discord webhook error:", response.status, errorText);
      return { success: false, error: `Discord error: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error("Discord notification error:", error);
    return { success: false, error: String(error) };
  }
}
