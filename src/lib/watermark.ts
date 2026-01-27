import sharp from "sharp";

const WATERMARK_TEXT = "Generado con IA en Vistta · visttahome.com";
const LOGO_OPACITY = 0.3; // 30% opacity

/**
 * Aplica watermark a una imagen generada
 * - Logo Vistta semitransparente centrado (30% opacidad)
 * - Texto en la base: "Generado con IA en Vistta · visttahome.com"
 */
export async function applyWatermark(imageBuffer: Buffer): Promise<Buffer> {
  // Obtener dimensiones de la imagen original
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width || 1024;
  const height = metadata.height || 1024;

  // Tamaño del logo (20% del ancho de la imagen)
  const logoWidth = Math.round(width * 0.2);
  const logoHeight = Math.round(logoWidth * 0.3); // Proporción aproximada del logo

  // Crear SVG del logo semitransparente
  const logoSvg = `
    <svg width="${logoWidth}" height="${logoHeight}" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="50%"
        font-family="Bricolage Grotesque, Arial, sans-serif"
        font-size="${Math.round(logoHeight * 0.7)}"
        font-weight="bold"
        fill="white"
        fill-opacity="${LOGO_OPACITY}"
        text-anchor="middle"
        dominant-baseline="middle"
      >VISTTA</text>
    </svg>
  `;

  // Tamaño del texto inferior
  const fontSize = Math.max(14, Math.round(width * 0.018));
  const textHeight = fontSize + 20;
  const textY = height - 10;

  // Crear SVG del texto inferior con fondo semitransparente
  const textSvg = `
    <svg width="${width}" height="${textHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="textBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:black;stop-opacity:0"/>
          <stop offset="100%" style="stop-color:black;stop-opacity:0.5"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#textBg)"/>
      <text
        x="50%"
        y="${textHeight - 8}"
        font-family="Manrope, Arial, sans-serif"
        font-size="${fontSize}"
        fill="white"
        fill-opacity="0.8"
        text-anchor="middle"
      >${WATERMARK_TEXT}</text>
    </svg>
  `;

  // Aplicar watermarks
  const result = await sharp(imageBuffer)
    .composite([
      // Logo centrado
      {
        input: Buffer.from(logoSvg),
        gravity: "center",
      },
      // Texto en la base
      {
        input: Buffer.from(textSvg),
        gravity: "south",
      },
    ])
    .webp({ quality: 90 })
    .toBuffer();

  return result;
}

/**
 * Aplica watermark a una imagen desde URL
 */
export async function applyWatermarkFromUrl(imageUrl: string): Promise<Buffer> {
  // Descargar imagen
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  return applyWatermark(imageBuffer);
}

/**
 * Convierte buffer a data URL
 */
export function bufferToDataUrl(buffer: Buffer, mimeType: string = "image/webp"): string {
  const base64 = buffer.toString("base64");
  return `data:${mimeType};base64,${base64}`;
}
