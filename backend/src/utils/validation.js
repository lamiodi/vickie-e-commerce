/**
 * Validation utilities for product video URLs and metadata
 * Ensures security and proper format validation
 */

/**
 * Validates video URL format and security
 * @param {string} url - Video URL to validate
 * @returns {Object} - { isValid: boolean, error?: string, type?: string }
 */
export function validateVideoURL(url) {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'Video URL must be a non-empty string' };
  }

  // Maximum URL length for security
  if (url.length > 2048) {
    return { isValid: false, error: 'Video URL exceeds maximum length of 2048 characters' };
  }

  try {
    const parsedUrl = new URL(url);
    
    // Only allow HTTPS for security
    if (parsedUrl.protocol !== 'https:') {
      return { isValid: false, error: 'Video URL must use HTTPS protocol' };
    }

    // Whitelist of trusted video hosting domains
    const trustedDomains = [
      'youtube.com',
      'www.youtube.com',
      'youtu.be',
      'vimeo.com',
      'www.vimeo.com',
      'dailymotion.com',
      'www.dailymotion.com'
    ];

    // Check if it's a trusted video platform
    const isTrustedPlatform = trustedDomains.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );

    // Direct video file extensions
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const hasVideoExtension = videoExtensions.some(ext => 
      parsedUrl.pathname.toLowerCase().endsWith(ext)
    );

    if (isTrustedPlatform) {
      // Validate embedded video URLs
      if (parsedUrl.hostname.includes('youtube')) {
        return validateYouTubeURL(parsedUrl);
      } else if (parsedUrl.hostname.includes('vimeo')) {
        return validateVimeoURL(parsedUrl);
      } else {
        return { isValid: true, type: 'embedded' };
      }
    } else if (hasVideoExtension) {
      // Validate direct video file URLs
      return validateDirectVideoURL(parsedUrl);
    } else {
      return { isValid: false, error: 'Video URL must be from a trusted platform or have a valid video file extension' };
    }

  } catch (error) {
    return { isValid: false, error: 'Invalid video URL format' };
  }
}

/**
 * Validates YouTube video URLs
 * @param {URL} url - Parsed YouTube URL
 * @returns {Object} - Validation result
 */
function validateYouTubeURL(url) {
  const validPaths = ['/watch', '/embed/'];
  const hasValidPath = validPaths.some(path => url.pathname.startsWith(path));
  
  if (!hasValidPath) {
    return { isValid: false, error: 'Invalid YouTube video URL format' };
  }

  // Extract video ID for validation
  let videoId = null;
  if (url.pathname.startsWith('/embed/')) {
    videoId = url.pathname.split('/')[2];
  } else if (url.searchParams.has('v')) {
    videoId = url.searchParams.get('v');
  }

  if (!videoId || videoId.length < 8 || videoId.length > 20) {
    return { isValid: false, error: 'Invalid YouTube video ID format' };
  }

  return { isValid: true, type: 'youtube' };
}

/**
 * Validates Vimeo video URLs
 * @param {URL} url - Parsed Vimeo URL
 * @returns {Object} - Validation result
 */
function validateVimeoURL(url) {
  const vimeoIdMatch = url.pathname.match(/^\/([0-9]+)$/);
  
  if (!vimeoIdMatch) {
    return { isValid: false, error: 'Invalid Vimeo video URL format' };
  }

  const videoId = vimeoIdMatch[1];
  if (videoId.length < 6 || videoId.length > 12) {
    return { isValid: false, error: 'Invalid Vimeo video ID format' };
  }

  return { isValid: true, type: 'vimeo' };
}

/**
 * Validates direct video file URLs
 * @param {URL} url - Parsed video file URL
 * @returns {Object} - Validation result
 */
function validateDirectVideoURL(url) {
  // Additional security checks for direct video files
  const suspiciousPatterns = [
    /\.{2,}/,  // Prevent directory traversal
    /[<>'"]/,  // Prevent XSS attempts
    /\s/,      // No whitespace allowed
    /[;&|`]/   // Prevent command injection
  ];

  const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
    pattern.test(url.href)
  );

  if (hasSuspiciousPattern) {
    return { isValid: false, error: 'Video URL contains suspicious characters' };
  }

  return { isValid: true, type: 'direct' };
}

/**
 * Validates video metadata
 * @param {Object} metadata - Video metadata object
 * @returns {Object} - Validation result
 */
export function validateVideoMetadata(metadata) {
  const errors = [];

  // Validate duration
  if (metadata.duration !== undefined && metadata.duration !== null) {
    if (typeof metadata.duration !== 'number' || metadata.duration <= 0) {
      errors.push('Video duration must be a positive number');
    } else if (metadata.duration > 36000) { // Max 10 hours
      errors.push('Video duration cannot exceed 10 hours');
    }
  }

  // Validate dimensions
  if (metadata.width !== undefined && metadata.width !== null) {
    if (typeof metadata.width !== 'number' || metadata.width <= 0 || metadata.width > 7680) {
      errors.push('Video width must be a positive number not exceeding 7680 pixels');
    }
  }

  if (metadata.height !== undefined && metadata.height !== null) {
    if (typeof metadata.height !== 'number' || metadata.height <= 0 || metadata.height > 4320) {
      errors.push('Video height must be a positive number not exceeding 4320 pixels');
    }
  }

  // Validate format
  if (metadata.format !== undefined && metadata.format !== null) {
    const validFormats = ['mp4', 'webm', 'ogg', 'mov'];
    if (!validFormats.includes(metadata.format.toLowerCase())) {
      errors.push('Video format must be one of: mp4, webm, ogg, mov');
    }
  }

  // Validate position
  if (metadata.position !== undefined && metadata.position !== null) {
    if (typeof metadata.position !== 'number' || metadata.position < 1 || metadata.position > 10) {
      errors.push('Video position must be a number between 1 and 10');
    }
  }

  // Validate file size
  if (metadata.fileSize !== undefined && metadata.fileSize !== null) {
    if (typeof metadata.fileSize !== 'number' || metadata.fileSize <= 0 || metadata.fileSize > 1073741824) { // 1GB
      errors.push('Video file size must be a positive number not exceeding 1GB');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Sanitizes video metadata for database storage
 * @param {Object} metadata - Raw video metadata
 * @returns {Object} - Sanitized metadata
 */
export function sanitizeVideoMetadata(metadata) {
  const sanitized = {};

  if (metadata.duration !== undefined && metadata.duration !== null) {
    sanitized.video_duration = Math.floor(metadata.duration);
  }

  if (metadata.width !== undefined && metadata.width !== null) {
    sanitized.video_width = Math.floor(metadata.width);
  }

  if (metadata.height !== undefined && metadata.height !== null) {
    sanitized.video_height = Math.floor(metadata.height);
  }

  if (metadata.format !== undefined && metadata.format !== null) {
    sanitized.video_format = metadata.format.toLowerCase();
  }

  if (metadata.position !== undefined && metadata.position !== null) {
    sanitized.video_position = Math.floor(metadata.position);
  }

  if (metadata.fileSize !== undefined && metadata.fileSize !== null) {
    sanitized.video_file_size = Math.floor(metadata.fileSize);
  }

  if (metadata.thumbnailUrl !== undefined && metadata.thumbnailUrl !== null) {
    sanitized.video_thumbnail_url = metadata.thumbnailUrl;
  }

  if (metadata.isExternal !== undefined && metadata.isExternal !== null) {
    sanitized.video_is_external = Boolean(metadata.isExternal);
  }

  return sanitized;
}