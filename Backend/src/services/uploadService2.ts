import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { logger } from '../utils/logger';

export interface UploadFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface UploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  quality?: number;
}

export class UploadService {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadsDir();
  }

  private ensureUploadsDir(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  async uploadAvatar(file: UploadFile, userId: string): Promise<string> {
    try {
      const fileName = `avatar_${userId}_${Date.now()}.${file.originalname.split('.').pop()}`;
      const filePath = path.join(this.uploadsDir, fileName);
      
      await fs.promises.writeFile(filePath, file.buffer);
      
      logger.info(`Avatar uploaded for user ${userId}: ${fileName}`);
      return `/uploads/${fileName}`;
    } catch (error) {
      logger.error('Error uploading avatar:', error);
      throw new Error('Failed to upload avatar');
    }
  }

  async uploadDocument(file: UploadFile, userId: string): Promise<string> {
    try {
      const fileName = `doc_${userId}_${Date.now()}.${file.originalname.split('.').pop()}`;
      const filePath = path.join(this.uploadsDir, fileName);
      
      await fs.promises.writeFile(filePath, file.buffer);
      
      logger.info(`Document uploaded for user ${userId}: ${fileName}`);
      return `/uploads/${fileName}`;
    } catch (error) {
      logger.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  }
}

export const uploadService = new UploadService();
export default uploadService;
