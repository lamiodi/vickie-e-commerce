-- Migration: Add comprehensive media management for products
-- Created: 2024-11-23
-- Purpose: Support product images and videos with proper ordering and metadata

-- Create media types enum
CREATE TYPE media_type AS ENUM ('image', 'video');

-- Create product media table to replace scattered image/video columns
CREATE TABLE IF NOT EXISTS product_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  media_type media_type NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for videos only
  thumbnail_path VARCHAR(500), -- for videos or large images
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_product_media_product_id ON product_media(product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_variant_id ON product_media(variant_id);
CREATE INDEX IF NOT EXISTS idx_product_media_type ON product_media(media_type);
CREATE INDEX IF NOT EXISTS idx_product_media_order ON product_media(product_id, display_order);
CREATE INDEX IF NOT EXISTS idx_product_media_primary ON product_media(product_id, is_primary) WHERE is_primary = true;

-- Create unique constraint for primary media per product
CREATE UNIQUE INDEX IF NOT EXISTS uniq_product_primary_media ON product_media(product_id, is_primary) WHERE is_primary = true;

-- Add file size constraints
ALTER TABLE product_media 
ADD CONSTRAINT valid_file_size CHECK (
  (media_type = 'image' AND file_size <= 10485760) OR -- 10MB for images
  (media_type = 'video' AND file_size <= 104857600)    -- 100MB for videos
);

-- Add dimension constraints for images
ALTER TABLE product_media 
ADD CONSTRAINT valid_image_dimensions CHECK (
  media_type != 'image' OR 
  (width > 0 AND width <= 7680 AND height > 0 AND height <= 4320)
);

-- Add video duration constraint
ALTER TABLE product_media 
ADD CONSTRAINT valid_video_duration CHECK (
  media_type != 'video' OR 
  (duration IS NULL OR (duration > 0 AND duration <= 600)) -- Max 10 minutes
);

-- Add display order constraint
ALTER TABLE product_media 
ADD CONSTRAINT valid_display_order CHECK (display_order > 0 AND display_order <= 99);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_media_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_product_media_updated
BEFORE UPDATE ON product_media
FOR EACH ROW
EXECUTE FUNCTION update_product_media_timestamp();

-- Create audit table for media changes
CREATE TABLE IF NOT EXISTS product_media_audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_id UUID REFERENCES product_media(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL, -- 'uploaded', 'updated', 'deleted', 'reordered'
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create function to audit media changes
CREATE OR REPLACE FUNCTION audit_product_media_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO product_media_audit (media_id, product_id, action, old_values, changed_at)
    VALUES (OLD.id, OLD.product_id, 'deleted', row_to_json(OLD), NOW());
    RETURN OLD;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO product_media_audit (media_id, product_id, action, new_values, changed_at)
    VALUES (NEW.id, NEW.product_id, 'uploaded', row_to_json(NEW), NOW());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO product_media_audit (media_id, product_id, action, old_values, new_values, changed_at)
    VALUES (NEW.id, NEW.product_id, 'updated', row_to_json(OLD), row_to_json(NEW), NOW());
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for media audit
CREATE TRIGGER trigger_product_media_audit_insert
AFTER INSERT ON product_media
FOR EACH ROW
EXECUTE FUNCTION audit_product_media_changes();

CREATE TRIGGER trigger_product_media_audit_update
AFTER UPDATE ON product_media
FOR EACH ROW
EXECUTE FUNCTION audit_product_media_changes();

CREATE TRIGGER trigger_product_media_audit_delete
AFTER DELETE ON product_media
FOR EACH ROW
EXECUTE FUNCTION audit_product_media_changes();

-- Create view for products with their media
CREATE OR REPLACE VIEW products_with_media AS
SELECT 
  p.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', pm.id,
        'media_type', pm.media_type,
        'file_path', pm.file_path,
        'thumbnail_path', pm.thumbnail_path,
        'alt_text', pm.alt_text,
        'caption', pm.caption,
        'display_order', pm.display_order,
        'is_primary', pm.is_primary,
        'width', pm.width,
        'height', pm.height,
        'duration', pm.duration
      ) ORDER BY pm.display_order
    ) FILTER (WHERE pm.id IS NOT NULL), '[]'
  ) as media
FROM products p
LEFT JOIN product_media pm ON p.id = pm.product_id AND pm.is_active = true
GROUP BY p.id;

-- Create function to reorder media
CREATE OR REPLACE FUNCTION reorder_product_media(
  product_uuid UUID,
  media_order UUID[]
)
RETURNS VOID AS $$
DECLARE
  media_uuid UUID;
  new_order INTEGER := 1;
BEGIN
  -- Validate that all media IDs belong to the product
  IF EXISTS (
    SELECT 1 FROM product_media 
    WHERE product_id = product_uuid 
    AND id NOT IN (SELECT unnest(media_order))
    AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Invalid media order: some active media IDs are missing';
  END IF;

  -- Update display order for each media item
  FOREACH media_uuid IN ARRAY media_order
  LOOP
    UPDATE product_media 
    SET display_order = new_order,
        updated_at = NOW()
    WHERE id = media_uuid AND product_id = product_uuid;
    
    new_order := new_order + 1;
  END LOOP;

  -- Log the reordering action
  INSERT INTO product_media_audit (media_id, product_id, action, new_values, changed_at)
  VALUES (NULL, product_uuid, 'reordered', jsonb_build_object('new_order', media_order), NOW());
END;
$$ LANGUAGE plpgsql;

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON product_media TO authenticated;
GRANT SELECT ON product_media_audit TO authenticated;
GRANT SELECT ON products_with_media TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE product_media IS 'Stores product images and videos with metadata and ordering';
COMMENT ON COLUMN product_media.file_path IS 'Relative path to the stored file';
COMMENT ON COLUMN product_media.thumbnail_path IS 'Path to thumbnail (for videos or large images)';
COMMENT ON COLUMN product_media.alt_text IS 'Accessibility alt text for images';
COMMENT ON COLUMN product_media.caption IS 'Optional caption for media';
COMMENT ON COLUMN product_media.display_order IS 'Order in which media should be displayed (1 = first)';
COMMENT ON COLUMN product_media.is_primary IS 'Whether this is the primary/main media for the product';