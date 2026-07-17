const MAX_IMAGE_BYTES = 16 * 1024 * 1024;
const MAX_OUTPUT_WIDTH = 1600;
const WEBP_QUALITY = 0.82;

const SUPPORTED_INPUT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type ImageTransform = {
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  outputWidth: number;
  outputHeight: number;
};

export type PreparedImage = {
  file: File;
  width: number;
  height: number;
};

function parseAspect(aspect?: string): [number, number] | null {
  const match = aspect?.match(/^(\d+)\s*:\s*(\d+)$/);
  if (!match) return null;

  const width = Number(match[1]);
  const height = Number(match[2]);
  return width > 0 && height > 0 ? [width, height] : null;
}

/** Mirrors ImageProcessor::centerCrop and ::fitWidth pixel-for-pixel. */
export function calculateImageTransform(
  sourceWidth: number,
  sourceHeight: number,
  aspect?: string,
): ImageTransform {
  if (!Number.isFinite(sourceWidth) || !Number.isFinite(sourceHeight) || sourceWidth < 1 || sourceHeight < 1) {
    throw new Error("Görsel boyutları okunamadı.");
  }

  const parsedAspect = parseAspect(aspect);
  if (!parsedAspect) {
    const outputWidth = Math.min(sourceWidth, MAX_OUTPUT_WIDTH);
    const outputHeight = sourceWidth <= MAX_OUTPUT_WIDTH
      ? sourceHeight
      : Math.round(sourceHeight * (MAX_OUTPUT_WIDTH / sourceWidth));

    return {
      cropX: 0,
      cropY: 0,
      cropWidth: sourceWidth,
      cropHeight: sourceHeight,
      outputWidth,
      outputHeight,
    };
  }

  const [aspectWidth, aspectHeight] = parsedAspect;
  const targetRatio = aspectWidth / aspectHeight;
  const sourceRatio = sourceWidth / sourceHeight;

  let cropX = 0;
  let cropY = 0;
  let cropWidth: number;
  let cropHeight: number;

  if (sourceRatio > targetRatio) {
    cropHeight = sourceHeight;
    cropWidth = Math.round(sourceHeight * targetRatio);
    cropX = Math.round((sourceWidth - cropWidth) / 2);
  } else {
    cropWidth = sourceWidth;
    cropHeight = Math.round(sourceWidth / targetRatio);
    cropY = Math.round((sourceHeight - cropHeight) / 2);
  }

  const outputWidth = Math.min(cropWidth, MAX_OUTPUT_WIDTH);
  const outputHeight = Math.round(outputWidth / targetRatio);

  return { cropX, cropY, cropWidth, cropHeight, outputWidth, outputHeight };
}

type LoadedImage = {
  source: CanvasImageSource;
  width: number;
  height: number;
  dispose: () => void;
};

async function loadImage(file: File): Promise<LoadedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      };
    } catch {
      // Some browsers cannot decode every supported input through ImageBitmap.
    }
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Görsel tarayıcı tarafından açılamadı."));
      element.src = objectUrl;
    });

    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      dispose: () => URL.revokeObjectURL(objectUrl),
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error;
  }
}

function canvasToWebp(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob || blob.type !== "image/webp") {
        reject(new Error("Tarayıcınız WebP dönüşümünü desteklemiyor."));
        return;
      }
      resolve(blob);
    }, "image/webp", WEBP_QUALITY);
  });
}

export async function prepareImageForUpload(file: File, aspect?: string): Promise<PreparedImage> {
  if (!SUPPORTED_INPUT_TYPES.has(file.type.toLowerCase())) {
    throw new Error("Yalnızca PNG, JPG, WebP veya GIF yükleyebilirsiniz.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Görsel en fazla 16 MB olabilir.");
  }

  const loaded = await loadImage(file);
  try {
    const transform = calculateImageTransform(loaded.width, loaded.height, aspect);
    const canvas = document.createElement("canvas");
    canvas.width = transform.outputWidth;
    canvas.height = transform.outputHeight;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("Görsel işleme başlatılamadı.");

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      loaded.source,
      transform.cropX,
      transform.cropY,
      transform.cropWidth,
      transform.cropHeight,
      0,
      0,
      transform.outputWidth,
      transform.outputHeight,
    );

    const blob = await canvasToWebp(canvas);
    const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-z0-9_-]+/gi, "-") || "image";

    return {
      file: new File([blob], `${baseName}.webp`, { type: "image/webp", lastModified: Date.now() }),
      width: transform.outputWidth,
      height: transform.outputHeight,
    };
  } finally {
    loaded.dispose();
  }
}
