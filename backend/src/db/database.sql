
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER REFERENCES categories(id),
    brand VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL
);

CREATE TABLE product_specs (
    id SERIAL PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    spec_key VARCHAR(50),
    spec_value TEXT
);

CREATE TABLE cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id UUID REFERENCES cart(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    UNIQUE(cart_id, product_id)
);

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address_line TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    address_id UUID REFERENCES addresses(id),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_name ON products(name);

INSERT INTO users (id, name, email) VALUES 
('11111111-1111-1111-1111-111111111111', 'Guest User', 'guest@flipkart.com')
ON CONFLICT (id) DO NOTHING;

-- Insert categories (flat structure - no parent_id)
INSERT INTO categories (name) VALUES 
('Electronics'),
('Fashion'),
('Home & Furniture'),
('Appliances')
ON CONFLICT (name) DO NOTHING;

-- Insert products
INSERT INTO products (id, name, description, price, stock, category_id, brand, rating) VALUES 
-- Electronics (category_id = 1)
('123e4567-e89b-12d3-a456-426614174001', 'Apple iPhone 15 Pro', 'The latest iPhone with A17 Pro chip, titanium design, and advanced camera system', 129900, 50, 1, 'Apple', 4.8),
('123e4567-e89b-12d3-a456-426614174002', 'Samsung Galaxy S24 Ultra', 'AI-powered smartphone with 200MP camera and S Pen', 129999, 30, 1, 'Samsung', 4.7),
('123e4567-e89b-12d3-a456-426614174003', 'MacBook Pro 14" M3', 'Apple M3 chip, 16GB RAM, 512GB SSD', 169900, 25, 1, 'Apple', 4.9),
('123e4567-e89b-12d3-a456-426614174005', 'Sony WH-1000XM5', 'Industry-leading noise cancellation headphones with 30-hour battery life', 29990, 40, 1, 'Sony', 4.8),
('123e4567-e89b-12d3-a456-426614174008', 'Canon EOS R5', '45MP full-frame mirrorless camera with 8K video', 385000, 10, 1, 'Canon', 4.9),
('123e4567-e89b-12d3-a456-426614174009', 'OnePlus 12', 'Flagship killer with Snapdragon 8 Gen 3 and Hasselblad camera', 64999, 45, 1, 'OnePlus', 4.6),
('123e4567-e89b-12d3-a456-426614174010', 'Google Pixel 8 Pro', 'Best camera phone with AI features and Tensor G3 chip', 106999, 20, 1, 'Google', 4.7),

-- Fashion (category_id = 2)
('123e4567-e89b-12d3-a456-426614174004', 'Nike Air Max Pulse', 'Premium comfort with visible air cushioning and modern design', 7999, 100, 2, 'Nike', 4.5),
('123e4567-e89b-12d3-a456-426614174007', 'Louis Vuitton Neverfull', 'Iconic tote bag in monogram canvas with leather trim', 145000, 5, 2, 'Louis Vuitton', 4.9),
('123e4567-e89b-12d3-a456-426614174024', 'Adidas Ultraboost', 'Perfect running shoes with responsive Boost technology', 15999, 75, 2, 'Adidas', 4.7),
('123e4567-e89b-12d3-a456-426614174025', 'Levi 501 Jeans', 'Original fit jeans with button fly and classic style', 4999, 200, 2, 'Levi', 4.6),
('123e4567-e89b-12d3-a456-426614174026', 'Zara Denim Jacket', 'Classic blue denim jacket with button closure', 3999, 120, 2, 'Zara', 4.3),

-- Home & Furniture (category_id = 3)
('123e4567-e89b-12d3-a456-426614174028', 'Wakefit Ortho Mattress', 'Memory foam mattress with orthopedic support', 24999, 30, 3, 'Wakefit', 4.5),
('123e4567-e89b-12d3-a456-426614174029', 'Home Centre Sofa', '3-seater fabric sofa with wooden frame', 45999, 10, 3, 'Home Centre', 4.4),

-- Appliances (category_id = 4)
('123e4567-e89b-12d3-a456-426614174006', 'Dyson V15 Detect', 'Powerful cordless vacuum with laser detection and LCD screen', 49900, 15, 4, 'Dyson', 4.6),
('123e4567-e89b-12d3-a456-426614174030', 'Samsung Refrigerator', 'Double door refrigerator with digital inverter technology', 34999, 25, 4, 'Samsung', 4.6),
('123e4567-e89b-12d3-a456-426614174031', 'LG Washing Machine', '6.5kg fully automatic washing machine with smart features', 27999, 20, 4, 'LG', 4.7)
ON CONFLICT (id) DO NOTHING;

-- Insert product images
INSERT INTO product_images (product_id, image_url) VALUES 
-- iPhone 15 Pro
('123e4567-e89b-12d3-a456-426614174001', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'),
('123e4567-e89b-12d3-a456-426614174001', 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400'),
('123e4567-e89b-12d3-a456-426614174001', 'https://images.unsplash.com/photo-1635165917486-1aefb1b696a9?w=400'),

-- Samsung S24 Ultra
('123e4567-e89b-12d3-a456-426614174002', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'),
('123e4567-e89b-12d3-a456-426614174002', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'),

-- MacBook Pro
('123e4567-e89b-12d3-a456-426614174003', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'),
('123e4567-e89b-12d3-a456-426614174003', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400'),

-- Nike Air Max
('123e4567-e89b-12d3-a456-426614174004', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),

-- Sony Headphones
('123e4567-e89b-12d3-a456-426614174005', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400'),

-- Dyson Vacuum
('123e4567-e89b-12d3-a456-426614174006', 'https://images.unsplash.com/photo-1527515673510-8aa78ce21f9b?w=400'),
('123e4567-e89b-12d3-a456-426614174006', 'https://images.unsplash.com/photo-1622218129755-7da4a4f3b0c8?w=400'),

-- Louis Vuitton
('123e4567-e89b-12d3-a456-426614174007', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'),

-- Canon Camera
('123e4567-e89b-12d3-a456-426614174008', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400'),

-- OnePlus 12
('123e4567-e89b-12d3-a456-426614174009', 'https://images.unsplash.com/photo-1628582091924-296b8ec1fffe?w=500'),
('123e4567-e89b-12d3-a456-426614174009', 'https://images.unsplash.com/photo-1610792515507-c6e3fc8c7b9a?w=400'),

-- Google Pixel
('123e4567-e89b-12d3-a456-426614174010', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400'),

-- Adidas Ultraboost
('123e4567-e89b-12d3-a456-426614174024', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),

-- Levi Jeans
('123e4567-e89b-12d3-a456-426614174025', 'https://plus.unsplash.com/premium_photo-1674828600712-7d0caab39109?w=500'),
('123e4567-e89b-12d3-a456-426614174025', 'https://images.unsplash.com/photo-1582552938357-14b1d3d1f5b1?w=400'),

-- Zara Jacket
('123e4567-e89b-12d3-a456-426614174026', 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400'),

-- Wakefit Mattress
('123e4567-e89b-12d3-a456-426614174028', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400'),

-- Home Centre Sofa
('123e4567-e89b-12d3-a456-426614174029', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'),

-- Samsung Refrigerator
('123e4567-e89b-12d3-a456-426614174030', 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400'),

-- LG Washing Machine
('123e4567-e89b-12d3-a456-426614174031', 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400')
ON CONFLICT DO NOTHING;

-- Insert product specifications
INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES 
-- iPhone 15 Pro
('123e4567-e89b-12d3-a456-426614174001', 'RAM', '8GB'),
('123e4567-e89b-12d3-a456-426614174001', 'Storage', '256GB'),
('123e4567-e89b-12d3-a456-426614174001', 'Battery', '3274mAh'),
('123e4567-e89b-12d3-a456-426614174001', 'Camera', '48MP + 12MP + 12MP'),

-- Samsung S24 Ultra
('123e4567-e89b-12d3-a456-426614174002', 'RAM', '12GB'),
('123e4567-e89b-12d3-a456-426614174002', 'Storage', '512GB'),
('123e4567-e89b-12d3-a456-426614174002', 'Battery', '5000mAh'),
('123e4567-e89b-12d3-a456-426614174002', 'S Pen', 'Included'),

-- MacBook Pro
('123e4567-e89b-12d3-a456-426614174003', 'RAM', '16GB'),
('123e4567-e89b-12d3-a456-426614174003', 'Storage', '1TB'),
('123e4567-e89b-12d3-a456-426614174003', 'Processor', 'Apple M3 Pro'),
('123e4567-e89b-12d3-a456-426614174003', 'Display', '14-inch Liquid Retina XDR'),

-- Sony Headphones
('123e4567-e89b-12d3-a456-426614174005', 'Battery Life', '30 hours'),
('123e4567-e89b-12d3-a456-426614174005', 'Noise Cancellation', 'Industry-leading'),
('123e4567-e89b-12d3-a456-426614174005', 'Charging', 'USB-C'),

-- Canon Camera
('123e4567-e89b-12d3-a456-426614174008', 'Megapixels', '45MP'),
('123e4567-e89b-12d3-a456-426614174008', 'Video', '8K at 30fps'),
('123e4567-e89b-12d3-a456-426614174008', 'Sensor', 'Full-frame CMOS'),

-- OnePlus 12
('123e4567-e89b-12d3-a456-426614174009', 'RAM', '12GB'),
('123e4567-e89b-12d3-a456-426614174009', 'Storage', '256GB'),
('123e4567-e89b-12d3-a456-426614174009', 'Processor', 'Snapdragon 8 Gen 3'),
('123e4567-e89b-12d3-a456-426614174009', 'Camera', 'Hasselblad triple camera'),

-- Google Pixel 8 Pro
('123e4567-e89b-12d3-a456-426614174010', 'RAM', '12GB'),
('123e4567-e89b-12d3-a456-426614174010', 'Storage', '128GB'),
('123e4567-e89b-12d3-a456-426614174010', 'Processor', 'Google Tensor G3'),
('123e4567-e89b-12d3-a456-426614174010', 'Camera', '50MP + 48MP + 48MP'),

-- Nike Air Max
('123e4567-e89b-12d3-a456-426614174004', 'Material', 'Mesh and synthetic'),
('123e4567-e89b-12d3-a456-426614174004', 'Closure', 'Lace-up'),
('123e4567-e89b-12d3-a456-426614174004', 'Sole', 'Air Max cushioning'),

-- Levi Jeans
('123e4567-e89b-12d3-a456-426614174025', 'Material', '100% Cotton'),
('123e4567-e89b-12d3-a456-426614174025', 'Fit', 'Regular fit'),
('123e4567-e89b-12d3-a456-426614174025', 'Closure', 'Button fly'),

-- Dyson Vacuum
('123e4567-e89b-12d3-a456-426614174006', 'Power', '545 Air Watts'),
('123e4567-e89b-12d3-a456-426614174006', 'Run Time', '60 minutes'),
('123e4567-e89b-12d3-a456-426614174006', 'Technology', 'Laser Detect'),

-- Samsung Refrigerator
('123e4567-e89b-12d3-a456-426614174030', 'Capacity', '253L'),
('123e4567-e89b-12d3-a456-426614174030', 'Energy Rating', '5 Star'),
('123e4567-e89b-12d3-a456-426614174030', 'Type', 'Double Door'),

-- LG Washing Machine
('123e4567-e89b-12d3-a456-426614174031', 'Capacity', '6.5kg'),
('123e4567-e89b-12d3-a456-426614174031', 'Type', 'Fully Automatic'),
('123e4567-e89b-12d3-a456-426614174031', 'Motor', 'Smart Inverter')
ON CONFLICT DO NOTHING;

-- Insert cart for default user
INSERT INTO cart (id, user_id) VALUES 
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;
