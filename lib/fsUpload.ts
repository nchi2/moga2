import fs from "fs/promises";

export async function uploadImage(file: File) {
    const photoData = await file.arrayBuffer();
    await fs.appendFile(`./public/${file.name}`, Buffer.from(photoData));
    return `/${file.name}`;
} 