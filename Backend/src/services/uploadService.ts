import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { logger } from '../utils/logger';

interface UploadFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

interface UploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
  quality?: number;
}

class UploadService {
  private uploadsDir: string;

  constructor() {
    this.uploadsDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadsDir();
  }

  private ensureUploadsDir(): void {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }

    // Create subdirectories
    const subdirs = ['avatars', 'documents', 'temp'];
    subdirs.forEach(subdir => {
      const dirPath = path.join(this.uploadsDir, subdir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  private generateFileName(originalName: string, userId: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${userId}_${timestamp}_${random}${ext}`;
  }

  public async uploadAvatar(file: UploadFile, userId: string): Promise<string> {
    try {
      const fileName = this.generateFileName(file.originalname, userId);
      const filePath = path.join(this.uploadsDir, 'avatars', fileName);

      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Return URL (in production, this would be a CDN URL)
      const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
      const avatarUrl = `${baseUrl}/uploads/avatars/${fileName}`;

      logger.info(`Avatar uploaded: ${avatarUrl}`);
      return avatarUrl;

    } catch (error) {
      logger.error('Avatar upload error:', error);
      throw new Error('Failed to upload avatar');
    }
  }

  public async uploadDocument(file: UploadFile, userId: string): Promise<string> {
    try {
      const fileName = this.generateFileName(file.originalname, userId);
      const filePath = path.join(this.uploadsDir, 'documents', fileName);

      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Return URL
      const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
      const documentUrl = `${baseUrl}/uploads/documents/${fileName}`;

      logger.info(`Document uploaded: ${documentUrl}`);
      return documentUrl;

    } catch (error) {
      logger.error('Document upload error:', error);
      throw new Error('Failed to upload document');
    }
  }

  public deleteFile(fileUrl: string): boolean {
    try {
      // Extract filename from URL
      const fileName = path.basename(fileUrl);
      const avatarPath = path.join(this.uploadsDir, 'avatars', fileName);
      const documentPath = path.join(this.uploadsDir, 'documents', fileName);

      // Try to delete from both directories
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
        logger.info(`File deleted: ${avatarPath}`);
        return true;
      }

      if (fs.existsSync(documentPath)) {
        fs.unlinkSync(documentPath);
        logger.info(`File deleted: ${documentPath}`);
        return true;
      }

      return false;

    } catch (error) {
      logger.error('File deletion error:', error);
      return false;
    }
  }

  public validateFile(file: UploadFile, options: UploadOptions = {}): boolean {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    } = options;

    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File size exceeds limit of ${maxSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not allowed`);
    }

    return true;
  }

  public getFileStats(): { totalFiles: number; totalSize: number } {
    try {
      let totalFiles = 0;
      let totalSize = 0;

      const countFiles = (dir: string) => {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          if (stats.isFile()) {
            totalFiles++;
            totalSize += stats.size;
          }
        });
      };

      countFiles(path.join(this.uploadsDir, 'avatars'));
      countFiles(path.join(this.uploadsDir, 'documents'));

      return { totalFiles, totalSize };

    } catch (error) {
      logger.error('Error getting file stats:', error);
      return { totalFiles: 0, totalSize: 0 };
    }
  }

  public cleanupTempFiles(): void {
    try {
      const tempDir = path.join(this.uploadsDir, 'temp');
      const files = fs.readdirSync(tempDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        const stats = fs.statSync(filePath);

        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          logger.info(`Cleaned up temp file: ${filePath}`);
        }
      });

    } catch (error) {
      logger.error('Error cleaning up temp files:', error);
    }
  }
}

// Export singleton instance
export const uploadService = new UploadService();

export default uploadService;
