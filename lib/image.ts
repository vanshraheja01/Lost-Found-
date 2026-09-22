const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2MB, stored inline as a data URL

interface ParsedDataUrl {
  mimeType: string;
  base64: string;
  byteLength: number;
}

/**
 * Parses and validates a `data:<mime>;base64,<data>` string.
 * Throws with a user-facing message if the image is missing, malformed,
 * an unsupported type, or too large.
 */
export function parseImageDataUrl(dataUrl: string): ParsedDataUrl {
  const match = /^data:(image\/[a-zA-Z+]+);base64,(.+)$/.exec(dataUrl);

  if (!match) {
    throw new Error("Image must be a valid base64 image data URL.");
  }

  const [, mimeType, base64] = match;

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported image type: ${mimeType}.`);
  }

  // Base64 encodes 3 bytes as 4 characters, minus padding.
  const byteLength = Math.floor((base64.length * 3) / 4);

  if (byteLength > MAX_IMAGE_BYTES) {
    throw new Error("Image is too large (max 2MB).");
  }

  return { mimeType, base64, byteLength };
}

export { MAX_IMAGE_BYTES };
