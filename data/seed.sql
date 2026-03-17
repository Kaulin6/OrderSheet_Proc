-- ============================================
-- SHQ Procurement Order Form - Database Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Products table
CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  vendor text,
  url text,
  price decimal,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- 2. Kits table
CREATE TABLE IF NOT EXISTS kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Kit items (join table)
CREATE TABLE IF NOT EXISTS kit_items (
  id serial PRIMARY KEY,
  kit_id uuid NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  product_id int NOT NULL REFERENCES products(id),
  quantity int NOT NULL DEFAULT 1
);

-- 4. Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by text NOT NULL,
  business_unit text NOT NULL,
  project_name text NOT NULL,
  date_requested date NOT NULL,
  deadline date,
  notes text,
  total_price decimal,
  order_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products: read-only for anon
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Kits: read + write for anon (team can edit)
CREATE POLICY "Kits are viewable by everyone"
  ON kits FOR SELECT
  USING (true);

CREATE POLICY "Kits are insertable by everyone"
  ON kits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Kits are updatable by everyone"
  ON kits FOR UPDATE
  USING (true);

CREATE POLICY "Kits are deletable by everyone"
  ON kits FOR DELETE
  USING (true);

-- Kit items: read + write for anon
CREATE POLICY "Kit items are viewable by everyone"
  ON kit_items FOR SELECT
  USING (true);

CREATE POLICY "Kit items are insertable by everyone"
  ON kit_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Kit items are updatable by everyone"
  ON kit_items FOR UPDATE
  USING (true);

CREATE POLICY "Kit items are deletable by everyone"
  ON kit_items FOR DELETE
  USING (true);

-- Orders: insert-only for anon
CREATE POLICY "Orders are insertable by everyone"
  ON orders FOR INSERT
  WITH CHECK (true);

-- ============================================
-- Seed product data (from SmartSheet)
-- ============================================

INSERT INTO products (id, name, category, vendor, url, price, image_url) VALUES
  (1,  'Patrol Camera (RLC-823S1W)',     'Security',           'Reolink',          'https://reolink.com/us/product/rlc-823s1w/?redirect=1', 300.00, 'images/products/1.jpg'),
  (2,  'Bullet Camera (Reolink Duo 3)',  'Security',           'Reolink',          'https://reolink.com/product/reolink-duo-3-poe/', 161.00, 'images/products/2.jpg'),
  (3,  'Solar Wifi Camera (Atlas PT Ultra)', 'Security',       'Reolink',          'https://reolink.com/product/altas-pt-ultra/', 186.00, 'images/products/3.jpg'),
  (4,  'Juyace Wired (Wall Mount)',      'Security',           'Amazon',           'https://www.amazon.com/dp/B086WSNVLJ/', 167.00, 'images/products/4.jpg'),
  (5,  'Juyace Wired (Pole Mount)',      'Security',           'Amazon',           'https://www.amazon.com/dp/B0BBYR2SRC/', 142.00, 'images/products/5.jpg'),
  (6,  'Ofuray Solar (Pole Mount)',      'Security',           'Amazon',           'https://www.amazon.ca/Ofuray-238000LM-Commercial-Parking-Security/dp/B0DQ5GH9VT/', 195.00, 'images/products/6.jpg'),
  (7,  'Warm Light for Tucson 3000k',    'Security',           'Amazon',           'https://www.amazon.com/Selectable-Commercial-Floodlight-Security-Lighting/dp/B0FM6N287P/', 119.00, 'images/products/7.jpg'),
  (8,  '12 Channels (RLN12W)',           'MEP',                'Reolink',          'https://reolink.com/ca/product/rln12w/?attribute_pa_version=1-packwhite', 315.00, 'images/products/8.jpg'),
  (9,  '16 Channels (RLN12W)',           'MEP',                'Reolink',          'https://reolink.com/ca/product/rln16-410/', 422.00, 'images/products/9.jpg'),
  (10, 'Core Switch (TL-SG3428X)',       'MEP',                'Amazon',           'https://www.amazon.com/gp/product/B08TR9FLDX/', 548.00, 'images/products/10.jpg'),
  (11, 'Sub Switch (TL-SG2210MP)',       'MEP',                'Amazon',           'https://www.amazon.com/gp/product/B0D5Z3NMG9/', 258.00, 'images/products/11.jpg'),
  (12, 'Fiber Optics Cable',             'MEP',                'Amazon',           'https://www.amazon.com/Outdoor-Armored-Multimode-Industrial-Installed/dp/B0DSJ1VS3V/', 150.00, 'images/products/12.jpg'),
  (13, 'Fiber Transceiver',              'MEP',                'Amazon',           'https://www.amazon.com/gp/product/B01N1H1Z2F/', 58.00, 'images/products/13.jpg'),
  (14, 'NVR 12" Monitor',                'MEP',                'Amazon',           'https://www.amazon.com/dp/B01KJVERF8/', 80.00, 'images/products/14.jpg'),
  (15, 'Junction Box',                   'MEP',                'Amazon',           'https://www.amazon.ca/Joinfworld-Electrical-Waterproof-Weatherproof/dp/B0DMZH73ZF/', 93.00, 'images/products/15.jpg'),
  (16, 'Camera Pole Bracket',            'Security',           NULL,               NULL, NULL, 'images/products/16.jpg'),
  (17, 'Camera Wall Bracket',            'Security',           NULL,               NULL, NULL, 'images/products/17.jpg'),
  (18, 'Power Plugs for Lights',         'Security',           'Amazon',           'https://www.amazon.com/HUARLPLUG-Certified-Rewirable-Directions-Adjustable/dp/B0DM8WBX7Y/', 16.00, 'images/products/18.jpg'),
  (19, 'Mounting Tape for Signs',        'Signage',            'Amazon',           'https://www.amazon.com/gp/product/B09G63579Q/', 20.00, 'images/products/19.jpg'),
  (20, 'Smart Plug',                     'MEP',                'Amazon',           'https://www.amazon.com/Kasa-Smart-Required-Certified-EP10P4/dp/B091FXLMS8/', 26.00, 'images/products/20.jpg'),
  (21, 'OPS Signs',                      'Signage',            'SignQuick',        'https://www.signquick.com/', NULL, 'images/products/21.jpg'),
  (22, 'Gate Signs',                     'Signage',            'VistaPrint',       'https://www.vistaprint.com/', NULL, 'images/products/22.jpg'),
  (23, 'Construction Signs',             'Signage',            'SignQuick',        'https://www.signquick.com/', NULL, 'images/products/23.jpg'),
  (24, 'Padlock',                        'Security',           'NB Rato Hardware', 'https://www.alibaba.com/product-detail/Heavy-Duty-High-Security-Outdoor-Warehouse_1600954539056.html', 4.00, 'images/products/24.jpg'),
  (25, 'Starlink',                       'Security',           'Business Local',   'https://starlink.com/business', 65.00, 'images/products/25.jpg'),
  (26, 'Portable Toilet',                'Temporary Facility', 'Zters',            'https://www.zters.com/', NULL, 'images/products/26.jpg'),
  (27, 'Gravel Bag',                     'Construction',       'Rockland',         'https://rocklandsupplies.com/product/bulk-bag-road-crush/', 185.00, 'images/products/27.jpg');

-- Reset the sequence to continue after our seeded IDs
SELECT setval('products_id_seq', 27);

-- ============================================
-- Example kit (optional - can be removed)
-- ============================================

INSERT INTO kits (id, name, description, category) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Basic Camera Setup', '1 patrol camera + NVR + sub switch + junction box', 'Security');

INSERT INTO kit_items (kit_id, product_id, quantity) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, 1),  -- Patrol Camera
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 8, 1),  -- 12 Channel NVR
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 11, 1), -- Sub Switch
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 15, 1); -- Junction Box
