-- Migration: Add product video support
-- Created: 2024-11-22
-- Purpose: Extend product model to include video URLs and metadata

-- Add video fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS video_position INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS video_duration INTEGER,
ADD COLUMN IF NOT EXISTS video_format VARCHAR(10),
ADD COLUMN IF NOT EXISTS video_width INTEGER,
ADD COLUMN IF NOT EXISTS video_height INTEGER,
ADD COLUMN IF NOT EXISTS video_thumbnail_url TEXT,
ADD COLUMN IF NOT EXISTS video_file_size BIGINT,
ADD COLUMN IF NOT EXISTS video_is_external BOOLEAN DEFAULT true;

-- Create index for efficient video queries
CREATE INDEX IF NOT EXISTS idx_products_video_url ON products(video_url) WHERE video_url IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_video_position ON products(video_position);

-- Add validation constraint for video URL format
ALTER TABLE products 
ADD CONSTRAINT valid_video_url 
CHECK (
  video_url IS NULL OR 
  video_url ~ '^https?://.*\.(mp4|webm|ogg|mov)$' OR
  video_url ~ '^https?://(www\.)?(youtube|vimeo)\.com/.*$'
);

-- Add constraint for valid video position (must be positive integer)
ALTER TABLE products 
ADD CONSTRAINT valid_video_position 
CHECK (video_position > 0);

-- Add constraint for valid video duration (must be positive if provided)
ALTER TABLE products 
ADD CONSTRAINT valid_video_duration 
CHECK (video_duration IS NULL OR video_duration > 0);

-- Add constraint for valid video dimensions
ALTER TABLE products 
ADD CONSTRAINT valid_video_dimensions 
CHECK (
  (video_width IS NULL AND video_height IS NULL) OR
  (video_width > 0 AND video_height > 0)
);

-- Add constraint for valid video file size
ALTER TABLE products 
ADD CONSTRAINT valid_video_file_size 
CHECK (video_file_size IS NULL OR video_file_size > 0);

-- Create audit table for video changes
CREATE TABLE IF NOT EXISTS product_video_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  video_url TEXT,
  video_position INTEGER,
  action VARCHAR(20) NOT NULL, -- 'added', 'updated', 'removed'
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create function to audit video changes
CREATE OR REPLACE FUNCTION audit_product_video_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.video_url IS DISTINCT FROM NEW.video_url THEN
    INSERT INTO product_video_audit (product_id, video_url, video_position, action, changed_at)
    VALUES (
      NEW.id, 
      NEW.video_url, 
      NEW.video_position,
      CASE 
        WHEN OLD.video_url IS NULL AND NEW.video_url IS NOT NULL THEN 'added'
        WHEN OLD.video_url IS NOT NULL AND NEW.video_url IS NULL THEN 'removed'
        ELSE 'updated'
      END,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for video audit
CREATE TRIGGER trigger_product_video_audit
AFTER UPDATE OF video_url, video_position ON products
FOR EACH ROW
EXECUTE FUNCTION audit_product_video_changes();

-- Add comment documentation for new columns
COMMENT ON COLUMN products.video_url IS 'URL of the product video file';
COMMENT ON COLUMN products.video_position IS 'Display position of video (1=after thumbnails, 2=before thumbnails, etc.)';
COMMENT ON COLUMN products.video_duration IS 'Video duration in seconds';
COMMENT ON COLUMN products.video_format IS 'Video format (mp4, webm, ogg, mov)';
COMMENT ON COLUMN products.video_width IS 'Video width in pixels';
COMMENT ON COLUMN products.video_height IS 'Video height in pixels';
COMMENT ON COLUMN products.video_thumbnail_url IS 'Thumbnail image for the video';
COMMENT ON COLUMN products.video_file_size IS 'Video file size in bytes';
COMMENT ON COLUMN products.video_is_external IS 'Whether video is hosted externally (true) or locally (false)';

-- Create view for products with video information
CREATE OR REPLACE VIEW products_with_videos AS
SELECT 
  p.*,
  CASE 
    WHEN p.video_url IS NOT NULL THEN true
    ELSE false
  END as has_video,
  CASE 
    WHEN p.video_url ~ '^https?://(www\.)?(youtube|vimeo)\.com/.*$' THEN 'embedded'
    WHEN p.video_url ~ '^https?://.*\.(mp4|webm|ogg|mov)$' THEN 'direct'
    ELSE 'none'
  END as video_type
FROM products p;

-- Grant appropriate permissions (assuming standard setup)
-- These should be adjusted based on your specific role setup
GRANT SELECT ON products_with_videos TO authenticated;
GRANT SELECT ON product_video_audit TO authenticated;