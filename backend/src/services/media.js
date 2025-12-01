import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { logger } from '../utils/logger.js';

// File upload configuration
export const UPLOAD_DIR = 'uploads';
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

// Ensure upload directories exist
async function ensureUploadDirectories() {
  const dirs = [
    UPLOAD_DIR,
    path.join(UPLOAD_DIR, 'images'),
    path.join(UPLOAD_DIR, 'videos'),
    path.join(UPLOAD_DIR, 'thumbnails'),
  ];

  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      logger.info(`Created upload directory: ${dir}`);
    }
  }
}

// Storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureUploadDirectories();

    let uploadPath = UPLOAD_DIR;
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      uploadPath = path.join(UPLOAD_DIR, 'images');
    } else if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
      uploadPath = path.join(UPLOAD_DIR, 'videos');
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter function
function fileFilter(req, file, cb) {
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`),
      false
    );
  }

  // Additional security check for file extensions
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.webm'];

  if (!allowedExtensions.includes(ext)) {
    return cb(new Error(`Invalid file extension: ${ext}`), false);
  }

  cb(null, true);
}

// Multer upload configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: Math.max(MAX_IMAGE_SIZE, MAX_VIDEO_SIZE),
    files: 10, // Maximum 10 files per request
  },
});

// Image processing functions
export async function processImage(filePath, options = {}) {
  try {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 85,
      format = 'webp',
      generateThumbnail = true,
    } = options;

    const processedFileName = `${uuidv4()}_processed.${format}`;
    const processedFilePath = path.join(path.dirname(filePath), processedFileName);

    let pipeline = sharp(filePath);

    // Auto-orient based on EXIF data
    pipeline = pipeline.rotate();

    // Resize if needed
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });

    // Apply format and quality settings
    if (format === 'webp') {
      pipeline = pipeline.webp({ quality });
    } else if (format === 'jpeg') {
      pipeline = pipeline.jpeg({ quality });
    } else if (format === 'png') {
      pipeline = pipeline.png({ quality });
    }

    await pipeline.toFile(processedFilePath);

    let thumbnailPath = null;
    if (generateThumbnail) {
      const thumbnailFileName = `${uuidv4()}_thumb.${format}`;
      thumbnailPath = path.join(UPLOAD_DIR, 'thumbnails', thumbnailFileName);

      await sharp(processedFilePath).resize(300, 300, { fit: 'cover' }).toFile(thumbnailPath);
    }

    // Get image metadata
    const metadata = await sharp(processedFilePath).metadata();

    return {
      processedPath: processedFilePath,
      thumbnailPath: thumbnailPath,
      width: metadata.width,
      height: metadata.height,
      size: (await fs.stat(processedFilePath)).size,
      format: metadata.format,
    };
  } catch (error) {
    logger.error('Image processing failed:', error);
    throw new Error(`Image processing failed: ${error.message}`);
  }
}

// Video processing functions
export async function processVideo(filePath, options = {}) {
  try {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      generateThumbnail = true,
      // extractDuration = true,
    } = options;

    const processedFileName = `${uuidv4()}_processed.mp4`;
    const processedFilePath = path.join(path.dirname(filePath), processedFileName);

    // Get video metadata first
    const metadata = await getVideoMetadata(filePath);

    // Check duration limit (10 minutes)
    if (metadata.duration > 600) {
      throw new Error('Video duration exceeds maximum limit of 10 minutes');
    }

    // Process video if needed
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      await new Promise((resolve, reject) => {
        ffmpeg(filePath)
          .videoCodec('libx264')
          .size(`${maxWidth}x${maxHeight}`)
          .autopad()
          .outputOptions('-movflags', 'faststart')
          .on('end', resolve)
          .on('error', reject)
          .save(processedFilePath);
      });
    } else {
      // Just copy the file if no resizing needed
      await fs.copyFile(filePath, processedFilePath);
    }

    let thumbnailPath = null;
    if (generateThumbnail) {
      const thumbnailFileName = `${uuidv4()}_thumb.jpg`;
      thumbnailPath = path.join(UPLOAD_DIR, 'thumbnails', thumbnailFileName);

      await new Promise((resolve, reject) => {
        ffmpeg(processedFilePath)
          .screenshots({
            timestamps: ['10%'],
            filename: path.basename(thumbnailPath),
            folder: path.dirname(thumbnailPath),
            size: '640x360',
          })
          .on('end', resolve)
          .on('error', reject);
      });
    }

    const processedMetadata = await getVideoMetadata(processedFilePath);

    return {
      processedPath: processedFilePath,
      thumbnailPath: thumbnailPath,
      width: processedMetadata.width,
      height: processedMetadata.height,
      duration: processedMetadata.duration,
      size: (await fs.stat(processedFilePath)).size,
      format: 'mp4',
    };
  } catch (error) {
    logger.error('Video processing failed:', error);
    throw new Error(`Video processing failed: ${error.message}`);
  }
}

// Get video metadata
function getVideoMetadata(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find((stream) => stream.codec_type === 'video');

      resolve({
        width: videoStream?.width || 0,
        height: videoStream?.height || 0,
        duration: Math.floor(metadata.format.duration || 0),
        format: metadata.format.format_name,
      });
    });
  });
}

// Clean up uploaded files
export async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
    logger.info(`Cleaned up file: ${filePath}`);
  } catch (error) {
    logger.warn(`Failed to cleanup file: ${filePath}`, error);
  }
}

// Generate secure file name
export function generateSecureFileName(originalName, prefix = '') {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '').substring(0, 50);
  return `${prefix}${sanitizedBaseName}-${uuidv4()}${ext}`;
}

// Validate file size
export function validateFileSize(file, maxSize) {
  if (file.size > maxSize) {
    throw new Error(`File size ${file.size} exceeds maximum allowed size of ${maxSize}`);
  }
}

// Get file type from MIME type
export function getFileType(mimeType) {
  if (ALLOWED_IMAGE_TYPES.includes(mimeType)) {
    return 'image';
  } else if (ALLOWED_VIDEO_TYPES.includes(mimeType)) {
    return 'video';
  }
  return 'unknown';
}

// Get file extension from MIME type
export function getFileExtension(mimeType) {
  const mimeToExt = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'video/mp4': '.mp4',
    'video/webm': '.webm',
  };
  return mimeToExt[mimeType] || '.tmp';
}
