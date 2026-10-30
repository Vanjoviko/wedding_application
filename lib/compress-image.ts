const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
const MAX_SIDE = 1600;

export async function compressImage(file: File) {
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error("Ukuran foto maksimal 10 MB.");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Peramban tidak mendukung pengolahan gambar.");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Gagal mengompres foto."));
      },
      "image/webp",
      0.82,
    );
  });

  return { blob, width, height };
}
