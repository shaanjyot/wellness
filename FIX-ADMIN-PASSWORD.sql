-- Fix Admin Password Hash
-- Run this in Supabase SQL Editor to fix the 401 authentication error

UPDATE admins
SET password = '$2b$10$XrkgVwwVJ9wXe8oVSmOgue7YNgaccxoQW8kpEr/yQhlUz7NM757kW'
WHERE username = 'admin';

-- Verify the update
SELECT id, username, password
FROM admins
WHERE username = 'admin';
