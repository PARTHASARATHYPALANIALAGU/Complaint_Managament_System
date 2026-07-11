-- Initialization script for PostgreSQL
-- Normally handled by SQLAlchemy create_all() or Alembic, but useful for manual seed

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define enums
CREATE TYPE user_role AS ENUM ('student', 'admin');
CREATE TYPE complaint_status AS ENUM ('Pending', 'In Progress', 'Resolved');

-- Seed Admin User (password is 'admin123', hashed with bcrypt cost 4)
-- We insert raw SQL here for demonstration; in production, use a secure seed script.
INSERT INTO users (id, name, email, password_hash, role) 
VALUES (
    uuid_generate_v4(), 
    'System Admin', 
    'admin@university.edu', 
    '$2b$04$2sUq72d0WbWkE.vBvLz0..kI8Dq8Z/j6U1yD8G2J7aC.4h2mX3X3y', 
    'admin'
) ON CONFLICT (email) DO NOTHING;
