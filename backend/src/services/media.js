import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import path from 'path';

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// Configure Cloudinary
if (env.cloudinaryUrl) {
  // If CLOUDINARY_URL is provided, the SDK auto-configures, 
  // but we can also set it explicitly if needed.
  // We'll rely on env var or set it if we parsed it.
  // Actually, cloudinary.config() handles CLOUDINARY_URL automatically if present in process.env
}

// Storage configuration
const storage = new CloudinaryStorage({
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
  // If it's a file object from multer-storage-cloudinary
  const filePath = fileOrPath.path || fileOrPath;
  
  return {
    processedPath: filePath,
    thumbnailPath: filePath.replace('/upload/', '/upload/w_300,h_300,c_fill/'), // Cloudinary transformation
    width: 0, // We can't easily get this without the public_id or an API call
    height: 0,
    size: fileOrPath.size || 0,
    format: 'webp', // Cloudinary default or auto
  };
}

// Video processing function
export async function processVideo(fileOrPath, options = {}) {
  const filePath = fileOrPath.path || fileOrPath;

  return {
    processedPath: filePath,
    thumbnailPath: filePath.replace(/\.[^/.]+$/, ".jpg"), // Cloudinary generates jpg thumbnails for videos
    width: 0,
    height: 0,
    duration: 0,
    size: fileOrPath.size || 0,
    format: 'mp4',
  };
}

// Clean up uploaded files (no-op for Cloudinary)
export async function cleanupFile(filePath) {
  // No-op
}

// Generate secure file name
export function generateSecureFileName(originalName, prefix = '') {
  return originalName; // Cloudinary handles this
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
