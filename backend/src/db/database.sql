CREATE DATABASE flipkart_db;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    parent_id INTEGER REFERENCES categories(id)
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


-- SAMPLE DATA
-- Insert default user
INSERT INTO users (id, name, email) VALUES 
('11111111-1111-1111-1111-111111111111', 'Guest User', 'guest@flipkart.com');

-- Insert categories
INSERT INTO categories (name, parent_id) VALUES 
('Electronics', NULL),
('Mobiles', 1),
('Laptops', 1),
('Fashion', NULL),
('Men Clothing', 4),
('Women Clothing', 4),
('Home & Furniture', NULL),
('Appliances', NULL);

-- Insert sample products
INSERT INTO products (id, name, description, price, stock, category_id, brand, rating) VALUES 
('p1-1111-1111-1111-111111111111', 'Apple iPhone 15 Pro', 'The latest iPhone with A17 Pro chip', 129900, 50, 2, 'Apple', 4.8),
('p2-2222-2222-2222-222222222222', 'Samsung Galaxy S24 Ultra', 'AI-powered smartphone with 200MP camera', 129999, 30, 2, 'Samsung', 4.7),
('p3-3333-3333-3333-333333333333', 'MacBook Pro 14" M3', 'Apple M3 chip, 16GB RAM, 512GB SSD', 169900, 25, 3, 'Apple', 4.9),
('p4-4444-4444-4444-444444444444', 'Nike Air Max Pulse', 'Premium comfort with visible air cushioning', 7999, 100, 5, 'Nike', 4.5),
('p5-5555-5555-5555-555555555555', 'Sony WH-1000XM5', 'Industry-leading noise cancellation headphones', 29990, 40, 1, 'Sony', 4.8),
('p6-6666-6666-6666-666666666666', 'Dyson V15 Detect', 'Powerful cordless vacuum with laser detection', 49900, 15, 7, 'Dyson', 4.6),
('p7-7777-7777-7777-777777777777', 'Louis Vuitton Neverfull', 'Iconic tote bag in monogram canvas', 145000, 5, 6, 'Louis Vuitton', 4.9),
('p8-8888-8888-8888-888888888888', 'Canon EOS R5', '45MP full-frame mirrorless camera', 385000, 10, 1, 'Canon', 4.9),
('p9-9999-9999-9999-999999999999', 'OnePlus 12', 'Flagship killer with Snapdragon 8 Gen 3', 64999, 45, 2, 'OnePlus', 4.6),
('p10-1010-1010-1010-101010101010', 'Google Pixel 8 Pro', 'Best camera phone with AI features', 106999, 20, 2, 'Google', 4.7);

-- Insert product images
INSERT INTO product_images (product_id, image_url) VALUES 
('p1-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'),
('p1-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400'),
('p2-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400'),
('p3-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'),
('p4-4444-4444-4444-444444444444', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'),
('p5-5555-5555-5555-555555555555', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400'),
('p6-6666-6666-6666-666666666666', 'https://images.unsplash.com/photo-1622218129755-7da4a4f3b0c8?w=400'),
('p7-7777-7777-7777-777777777777', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'),
('p8-8888-8888-8888-888888888888', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400'),
('p9-9999-9999-9999-999999999999', 'https://images.unsplash.com/photo-1610792515507-c6e3fc8c7b9a?w=400'),
('p10-1010-1010-1010-101010101010', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400');

-- Insert product specifications
INSERT INTO product_specs (product_id, spec_key, spec_value) VALUES 
('p1-1111-1111-1111-111111111111', 'RAM', '8GB'),
('p1-1111-1111-1111-111111111111', 'Storage', '256GB'),
('p1-1111-1111-1111-111111111111', 'Battery', '3274mAh'),
('p2-2222-2222-2222-222222222222', 'RAM', '12GB'),
('p2-2222-2222-2222-222222222222', 'Storage', '512GB'),
('p2-2222-2222-2222-222222222222', 'Battery', '5000mAh'),
('p3-3333-3333-3333-333333333333', 'RAM', '16GB'),
('p3-3333-3333-3333-333333333333', 'Storage', '1TB'),
('p5-5555-5555-5555-555555555555', 'Battery Life', '30 hours'),
('p8-8888-8888-8888-888888888888', 'Megapixels', '45MP'),
('p9-9999-9999-9999-999999999999', 'RAM', '12GB'),
('p9-9999-9999-9999-999999999999', 'Storage', '256GB'),
('p10-1010-1010-1010-101010101010', 'RAM', '12GB'),
('p10-1010-1010-1010-101010101010', 'Storage', '128GB');

-- Insert cart for default user
INSERT INTO cart (id, user_id) VALUES 
('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111');