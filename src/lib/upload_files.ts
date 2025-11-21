"use server";

import fs from "fs";
import path from "path";

/**
 * Upload a single file to the `public/uploads` folder
 * Returns the relative URL to use in <img src="">
 */
export async function uploadFileToPublic(file: File) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure folder exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create unique filename
    const timestamp = Date.now();
    const fileExt = path.extname(file.name);
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file
    fs.writeFileSync(filePath, buffer);

    // Return relative URL for frontend
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("Failed to upload file");
  }
}
