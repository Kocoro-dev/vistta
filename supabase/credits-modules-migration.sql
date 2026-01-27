-- =====================================================
-- MIGRACIÓN: Sistema de Créditos, Módulos y Watermark
-- Fecha: 2025-01-26
-- Descripción: Añade sistema de créditos para usuarios,
--              módulos (enhance/vision) y soporte watermark
-- =====================================================

-- 1. Añadir columnas a profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS has_purchased BOOLEAN DEFAULT FALSE;

-- 2. Añadir columnas a generations
ALTER TABLE public.generations
ADD COLUMN IF NOT EXISTS module TEXT DEFAULT 'vision',
ADD COLUMN IF NOT EXISTS has_watermark BOOLEAN DEFAULT FALSE;

-- 3. Actualizar trigger de nuevo usuario para incluir créditos
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, credits, onboarding_completed, has_purchased)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url',
    3,     -- FREE_CREDITS: 3 créditos iniciales
    FALSE, -- onboarding_completed: mostrar modal de bienvenida
    FALSE  -- has_purchased: usuario gratuito por defecto
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Actualizar usuarios existentes con valores por defecto
-- (Ejecutar solo una vez)
UPDATE public.profiles
SET
  credits = COALESCE(credits, 3),
  onboarding_completed = COALESCE(onboarding_completed, TRUE), -- usuarios existentes ya han visto el sistema
  has_purchased = COALESCE(has_purchased, FALSE)
WHERE credits IS NULL OR onboarding_completed IS NULL OR has_purchased IS NULL;

-- 5. Actualizar generaciones existentes con valores por defecto
UPDATE public.generations
SET
  module = COALESCE(module, 'vision'),
  has_watermark = COALESCE(has_watermark, FALSE)
WHERE module IS NULL OR has_watermark IS NULL;

-- =====================================================
-- NOTAS:
-- - FREE_CREDITS = 3 (configurado en constants.ts)
-- - Usuarios con has_purchased = false SIEMPRE tienen watermark
-- - module puede ser 'enhance' o 'vision'
-- - 'enhance': mejora sutil de fotos existentes
-- - 'vision': amuebla espacios vacíos
-- =====================================================
