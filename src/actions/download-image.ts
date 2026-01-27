"use server";

type ImageFormat = "webp" | "jpeg" | "png";

interface ConvertedImage {
  dataUrl: string;
  mimeType: string;
  extension: string;
}

export async function convertImageFormat(
  imageUrl: string,
  format: ImageFormat
): Promise<{ success: true; image: ConvertedImage } | { error: string }> {
  try {
    // Fetch the original image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return { error: "Error al obtener la imagen" };
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Use sharp for conversion
    const sharp = (await import("sharp")).default;

    let processedBuffer: Buffer;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case "jpeg":
        processedBuffer = await sharp(imageBuffer)
          .jpeg({ quality: 90 })
          .toBuffer();
        mimeType = "image/jpeg";
        extension = "jpg";
        break;
      case "png":
        processedBuffer = await sharp(imageBuffer)
          .png({ compressionLevel: 6 })
          .toBuffer();
        mimeType = "image/png";
        extension = "png";
        break;
      case "webp":
      default:
        processedBuffer = await sharp(imageBuffer)
          .webp({ quality: 90 })
          .toBuffer();
        mimeType = "image/webp";
        extension = "webp";
        break;
    }

    const base64 = processedBuffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return {
      success: true,
      image: {
        dataUrl,
        mimeType,
        extension,
      },
    };
  } catch (error) {
    console.error("Image conversion error:", error);
    return { error: "Error al convertir la imagen" };
  }
}
