-- Enable UUID extension (useful for other UUID functions, though we'll use native gen_random_uuid())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
-- Note: Supabase has its own 'auth.users' table if you use Supabase Auth. 
-- Since you are using a custom backend, we store users in 'public.users'.
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer', -- 'customer', 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2), -- For sale/strikethrough price
  badge VARCHAR(50), -- 'NEW', 'SALE', 'BESTSELLER'
  rating DECIMAL(3, 2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  attributes JSONB DEFAULT '{}',
  video_url TEXT,
  video_position VARCHAR(20),
  video_duration INTEGER,
  video_format VARCHAR(20),
  video_width INTEGER,
  video_height INTEGER,
  video_thumbnail_url TEXT,
  video_file_size INTEGER,
  video_is_external BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Product Variants table (for sizes, colors, stock)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(50),
  color VARCHAR(50),
  stock INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  payment_intent_id VARCHAR(255),
  shipping_address JSONB,
  tracking_code VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  qty INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

-- Optional: Row Level Security (RLS)
-- Since you are connecting via a Node.js backend using the connection string, 
-- you will likely bypass RLS by connecting as 'postgres' or 'service_role'.
-- However, enabling RLS is a good security practice on Supabase.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies (Optional examples - allows everything for now since logic is in backend)
-- In a real Supabase-native app, you would restrict these based on auth.uid()
CREATE POLICY "Allow all access for backend" ON users FOR ALL USING (true);
CREATE POLICY "Allow all access for backend" ON products FOR ALL USING (true);
CREATE POLICY "Allow all access for backend" ON product_variants FOR ALL USING (true);
CREATE POLICY "Allow all access for backend" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all access for backend" ON order_items FOR ALL USING (true);
