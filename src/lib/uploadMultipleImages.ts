import { uploadImage } from "./upload";

export async function uploadMultipleImages(files: File[]) {
  const uploaded = [];

  for (const file of files) {
    const result = await uploadImage(file);
    uploaded.push(result);
  }

  return uploaded;
}
