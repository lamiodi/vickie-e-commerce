import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import path from 'path';
import fs from 'fs';

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// Configure Storage
let storage;

if (env.cloudinaryUrl) {
  // Cloudinary Storage
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      let folder = 'uploads';
      let resource_type = 'auto';

      if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
        folder = 'uploads/images';
        resource_type = 'image';
      } else if (ALLOWED_VIDEO_TYPES.includes(file.mimetype)) {
        folder = 'uploads/videos';
        resource_type = 'video';
      }

      return {
        folder: folder,
        resource_type: resource_type,
        public_id: path.parse(file.originalname).name + '-' + Date.now(),
      };
    },
  });
} else {
  // Local Disk Storage Fallback
  logger.warn('CLOUDINARY_URL not found. Using local disk storage.');
  
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
}

// File filter function
function fileFilter(req, file, cb) {
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(`Invalid file type: ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`),
      false
    );
  }
  cb(null, true);
}

// Multer upload configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: Math.max(MAX_IMAGE_SIZE, MAX_VIDEO_SIZE),
    files: 10,
  },
});

// Helper to get metadata from Cloudinary
async function getCloudinaryMetadata(publicId, resourceType = 'image') {
  try {
    const result = await cloudinary.api.resource(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    logger.error(`Failed to fetch Cloudinary metadata for ${publicId}:`, error);
    return null;
  }
}

// Image processing function (now just metadata extraction/validation)
export async function processImage(fileOrPath, options = {}) {
  const filePath = fileOrPath.path || fileOrPath;
  
  if (env.cloudinaryUrl) {
    return {
      processedPath: filePath,
      thumbnailPath: filePath.replace('/upload/', '/upload/w_300,h_300,c_fill/'), // Cloudinary transformation
      width: 0,
      height: 0,
      size: fileOrPath.size || 0,
      format: 'webp',
    };
  } else {
    // Local fallback
    const filename = path.basename(filePath);
    const relativePath = `/uploads/${filename}`;
    return {
      processedPath: relativePath,
      thumbnailPath: relativePath,
      width: 0,
      height: 0,
      size: fileOrPath.size || 0,
      format: path.extname(filePath).replace('.', ''),
    };
  }
}

// Video processing function
export async function processVideo(fileOrPath, options = {}) {
  const filePath = fileOrPath.path || fileOrPath;

  if (env.cloudinaryUrl) {
    return {
      processedPath: filePath,
      thumbnailPath: filePath.replace(/\.[^/.]+$/, ".jpg"), // Cloudinary generates jpg thumbnails for videos
      width: 0,
      height: 0,
      duration: 0,
      size: fileOrPath.size || 0,
      format: 'mp4',
    };
  } else {
    // Local fallback
    const filename = path.basename(filePath);
    const relativePath = `/uploads/${filename}`;
    return {
      processedPath: relativePath,
      thumbnailPath: relativePath, // No thumbnail generation for local yet
      width: 0,
      height: 0,
      duration: 0,
      size: fileOrPath.size || 0,
      format: path.extname(filePath).replace('.', ''),
    };
  }
}

// Clean up uploaded files
export async function cleanupFile(filePath) {
  if (env.cloudinaryUrl) return; // No-op for Cloudinary
  
  try {
    // If filePath is a relative URL, resolve it to absolute path
    let absolutePath = filePath;
    if (filePath.startsWith('/uploads/')) {
      absolutePath = path.join(process.cwd(), 'uploads', path.basename(filePath));
    }
    
    if (fs.existsSync(absolutePath)) {
      await fs.promises.unlink(absolutePath);
    }
  } catch (err) {
    logger.error(`Failed to cleanup file ${filePath}:`, err);
  }
}

// Generate secure file name
export function generateSecureFileName(originalName, prefix = '') {
  return originalName; // Cloudinary handles this
}

// Validate file size
export function validateFileSize(file, maxSize) {
  if (file.size > maxSize) {
    const error = new Error(`File size ${file.size} exceeds maximum allowed size of ${maxSize}`);
    error.statusCode = 400;
    throw error;
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
