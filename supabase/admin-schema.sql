-- =============================================
-- VISTTA Admin Content Management Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- Table for storing editable site content
CREATE TABLE IF NOT EXISTS site_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page VARCHAR(50) NOT NULL,           -- 'landing', 'dashboard', 'editor', 'login'
    section VARCHAR(100) NOT NULL,       -- 'hero', 'problem', 'steps', etc.
    content JSONB NOT NULL DEFAULT '{}', -- The actual content
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique constraint on page + section
CREATE UNIQUE INDEX IF NOT EXISTS site_content_page_section_idx ON site_content(page, section);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS policies - Only service role can modify (admin uses service role)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (for public pages)
CREATE POLICY "Allow public read access" ON site_content
    FOR SELECT USING (true);

-- Only service role can insert/update/delete (admin backend)
CREATE POLICY "Allow service role full access" ON site_content
    FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- Insert default content for all pages
-- =============================================

-- Landing Page - Hero Section
INSERT INTO site_content (page, section, content) VALUES (
    'landing',
    'hero',
    '{
        "label": "Virtual Home Staging",
        "title_line1": "Transforma espacios.",
        "title_line2": "Vende visiones.",
        "description": "Tecnología de inteligencia artificial para rediseñar propiedades en segundos. Ideal para Idealista, Airbnb y Fotocasa.",
        "cta_primary": "Probar gratis",
        "cta_secondary": "Ver demo",
        "slider_before_image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
        "slider_after_image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80"
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Landing Page - Trust Section
INSERT INTO site_content (page, section, content) VALUES (
    'landing',
    'trust',
    '{
        "label": "Publican en",
        "logos": ["idealista", "Airbnb", "fotocasa", "Booking"]
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Landing Page - Problem Section
INSERT INTO site_content (page, section, content) VALUES (
    'landing',
    'problem',
    '{
        "label": "El problema",
        "title": "Propiedades con potencial que pasan desapercibidas",
        "description": "Muebles antiguos, espacios vacíos o decoración desactualizada. Los compradores no pueden imaginar el potencial.",
        "cards": [
            {
                "number": "01",
                "title": "Staging físico prohibitivo",
                "description": "Más de 2.000€ y semanas de trabajo. Logística imposible en muchas zonas."
            },
            {
                "number": "02",
                "title": "Fotos que no venden",
                "description": "Sin staging, las propiedades reciben hasta un 40% menos de visitas."
            }
        ],
        "solution": {
            "label": "Solución",
            "title": "VISTTA digitaliza la reforma",
            "description": "Muestra el potencial sin mover un ladrillo. Resultados en segundos, no semanas."
        }
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Landing Page - Steps Section
INSERT INTO site_content (page, section, content) VALUES (
    'landing',
    'steps',
    '{
        "label": "Proceso",
        "title_line1": "Tres pasos.",
        "title_line2": "Menos de un minuto.",
        "steps": [
            {
                "number": "01",
                "title": "Sube tu foto",
                "description": "Arrastra cualquier imagen desde tu móvil o ordenador. No necesitas fotógrafo profesional."
            },
            {
                "number": "02",
                "title": "Elige el estilo",
                "description": "Nórdico, minimalista, moderno... La IA respeta la estructura del espacio."
            },
            {
                "number": "03",
                "title": "Descarga y publica",
                "description": "En segundos tienes un render fotorrealista listo para tu anuncio."
            }
        ]
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Landing Page - Styles Section
INSERT INTO site_content (page, section, content) VALUES (
    'landing',
    'styles',
    '{
        "label": "Estilos",
        "title": "Diseños que conectan con compradores",
        "description": "Cada estilo está optimizado para el mercado español. Tendencias actuales que generan más visitas y cierres.",
        "styles": [
            {
                "id": "nordic",
                "name": "Nórdico",
                "description": "Limpio y funcional. Ideal para el comprador europeo.",
                "image": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80"
            },
            {
                "id": "boho",
                "name": "Boho-Chic",
                "description": "Cálido y acogedor. Perfecto para Airbnb.",
                "image": "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80"
            },
            {
                "id": "minimal",
                "name": "Minimalista",
                "description": "Espacioso y moderno. Para pisos urbanos.",
                "image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80"
            }
        ]
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Landing Page - Testimonial Section
INSERT INTO site_content (page, section, content) VALUES (
    'landing',
    'testimonial',
    '{
        "label": "Testimonios",
        "quote": "Antes tardaba días en preparar un piso para las fotos. Ahora subo las fotos y en minutos tengo el anuncio con una decoración increíble.",
        "highlight": " Mis reservas subieron un 30%.",
        "author_name": "Carlos M.",
        "author_role": "Gestor de propiedades · Adeje",
        "author_image": ""
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Landing Page - Pricing Section
INSERT INTO site_content (page, section, content) VALUES (
    'landing',
    'pricing',
    '{
        "label": "Precios",
        "title": "Inversión que se paga sola",
        "plans": [
            {
                "name": "Ocasional",
                "price": "19€",
                "period": "",
                "description": "Pack de 10 imágenes · ~1.90€ por transformación",
                "features": ["Todos los estilos", "Sin marcas de agua", "Calidad 4K", "Soporte por email"],
                "cta": "Comprar pack",
                "highlighted": false
            },
            {
                "name": "Agencia",
                "price": "49€",
                "period": "/mes",
                "description": "Imágenes ilimitadas · Cancela cuando quieras",
                "features": ["Todo del plan Ocasional", "Sin límite de imágenes", "Soporte prioritario", "Facturación automática"],
                "cta": "Empezar ahora",
                "highlighted": true,
                "badge": "Popular"
            }
        ]
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Landing Page - FAQ Section
INSERT INTO site_content (page, section, content) VALUES (
    'landing',
    'faq',
    '{
        "label": "FAQ",
        "title": "Preguntas frecuentes",
        "items": [
            {
                "question": "¿Es legal usar estas fotos en Idealista/Airbnb?",
                "answer": "Sí, siempre que indiques que es una \"Recreación Virtual\" o \"Propuesta de Decoración\". VISTTA incluye una pequeña marca de agua opcional que dice \"Virtual Staging\" para que seas transparente con los compradores."
            },
            {
                "question": "¿La IA cambia la estructura de la casa?",
                "answer": "No. Nuestra tecnología respeta las paredes, ventanas, suelos y techos. Solo cambiamos el mobiliario y la decoración. El comprador reconocerá el espacio al visitarlo."
            },
            {
                "question": "¿Qué calidad tienen las imágenes?",
                "answer": "Las imágenes se generan en alta resolución (hasta 4K) con calidad fotorrealista. Son perfectas para publicar en portales inmobiliarios o redes sociales."
            },
            {
                "question": "¿Cuánto tiempo tarda en generarse?",
                "answer": "Normalmente entre 10 y 20 segundos. Sube tu foto, elige el estilo, y en menos de medio minuto tienes tu render listo para publicar."
            },
            {
                "question": "¿Cómo funciona la facturación?",
                "answer": "Utilizamos una pasarela de pago segura que emite facturas válidas para tu contabilidad. Puedes cancelar tu suscripción en cualquier momento."
            }
        ]
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Landing Page - CTA Section
INSERT INTO site_content (page, section, content) VALUES (
    'landing',
    'cta',
    '{
        "title_line1": "Transforma tu primera",
        "title_line2": "propiedad gratis",
        "description": "Sin tarjeta de crédito. Sin compromiso. Resultados en segundos.",
        "cta": "Comenzar ahora"
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Landing Page - Footer Section
INSERT INTO site_content (page, section, content) VALUES (
    'landing',
    'footer',
    '{
        "brand_description": "Virtual staging con inteligencia artificial para el mercado inmobiliario.",
        "columns": [
            {
                "title": "Producto",
                "links": [
                    {"label": "Comenzar", "href": "/login"},
                    {"label": "Precios", "href": "#"},
                    {"label": "FAQ", "href": "#"}
                ]
            },
            {
                "title": "Cobertura",
                "links": [
                    {"label": "Home Staging Tenerife", "href": "#"},
                    {"label": "Home Staging Gran Canaria", "href": "#"},
                    {"label": "Decoración Virtual", "href": "#"}
                ]
            },
            {
                "title": "Legal",
                "links": [
                    {"label": "Términos", "href": "#"},
                    {"label": "Privacidad", "href": "#"}
                ]
            }
        ],
        "copyright": "VISTTA · Hecho en Canarias"
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Dashboard Page Content
INSERT INTO site_content (page, section, content) VALUES (
    'dashboard',
    'main',
    '{
        "alpha_label": "Alpha",
        "alpha_description": "Versión de acceso anticipado. Limitado a {limit} imágenes gratuitas.",
        "gallery_label": "Galería",
        "gallery_title": "Mis Diseños",
        "empty_title": "Sin diseños todavía",
        "empty_description": "Sube una foto de una habitación y transforma su estilo con inteligencia artificial.",
        "empty_cta": "Crear primer diseño",
        "new_design_cta": "Nuevo Diseño"
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Editor Page Content
INSERT INTO site_content (page, section, content) VALUES (
    'editor',
    'main',
    '{
        "label": "Editor",
        "title": "Nuevo Diseño",
        "back_button": "Volver",
        "config_label": "Configuración",
        "style_label": "Estilo de diseño",
        "generate_button": "Transformar espacio",
        "generating_text": "Generando...",
        "generating_description": "Esto puede tardar entre 15 y 30 segundos",
        "download_button": "Descargar resultado",
        "new_image_button": "Nueva imagen",
        "tips_label": "Consejos",
        "tips": [
            "Usa fotos bien iluminadas para mejores resultados",
            "Las imágenes frontales funcionan mejor",
            "Evita fotos con personas u objetos en movimiento"
        ]
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Login Page Content
INSERT INTO site_content (page, section, content) VALUES (
    'login',
    'main',
    '{
        "title": "Transforma espacios con IA",
        "description": "Virtual staging profesional para agentes inmobiliarios y gestores de propiedades.",
        "form_label": "Acceso",
        "form_title": "Continuar con tu cuenta",
        "google_button": "Continuar con Google",
        "github_button": "Continuar con GitHub",
        "terms_text": "Al continuar, aceptas nuestros",
        "terms_link": "términos de servicio",
        "privacy_link": "política de privacidad"
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- Upload Zone Content
INSERT INTO site_content (page, section, content) VALUES (
    'components',
    'upload_zone',
    '{
        "drag_text": "Arrastra una imagen",
        "drop_text": "Suelta la imagen",
        "click_text": "o haz clic para seleccionar",
        "formats_text": "JPG, PNG o WebP · máx. 10MB"
    }'::jsonb
) ON CONFLICT (page, section) DO UPDATE SET content = EXCLUDED.content;

-- =============================================
-- Storage bucket for admin media uploads
-- =============================================

-- Create admin-media bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('admin-media', 'admin-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to admin-media bucket
CREATE POLICY "Public read admin-media"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'admin-media');

-- Allow authenticated users to upload to admin-media (for admin panel)
CREATE POLICY "Authenticated upload admin-media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'admin-media');

-- Allow authenticated users to delete from admin-media
CREATE POLICY "Authenticated delete admin-media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'admin-media');

SELECT 'Admin schema, default content, and storage bucket created successfully!' as status;
