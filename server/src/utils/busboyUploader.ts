import busboy from 'busboy';
import { Request } from 'express';
import { createWriteStream } from 'fs';
import { extname, join } from 'path';
import { v4 } from 'uuid';
import { UploadResult } from '../interfaces/upload-result.interface';

export function getFileCategory(mimetype: string): 'image' | 'video' {
  if (mimetype.startsWith('image/')) return 'image';
  if (mimetype.startsWith('video/')) return 'video';
  throw new Error('Unsupported file type');
}

export const busboyUploader = (req: Request): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });
    let uploaded: UploadResult | null = null;

    bb.on('file', (fieldname, file, info) => {
      const { filename, mimeType } = info;
      const fileName = `${fieldname}-${v4()}${extname(filename)}`;
      const category = getFileCategory(mimeType);
      const filePath = join(process.cwd(), 'uploads', `${category}s`, fileName);
      const writeStream = createWriteStream(filePath);

      file.pipe(writeStream);

      writeStream.on('error', (error) => reject(error));
      writeStream.on(
        'finish',
        () => (uploaded = { fileName, filePath, category }),
      );
    });

    bb.on('error', (error) => reject(error));
    bb.on('finish', () => {
      if (!uploaded) return reject(new Error('No file was uploaded'));
      return resolve(uploaded);
    });

    req.pipe(bb);
  });
};
