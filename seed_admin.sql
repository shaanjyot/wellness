--
-- Create Default Admin User
--
-- Username: admin
-- Password: admin123
--

INSERT INTO admins (username, password)
VALUES ('admin', '$2b$10$GXVEIlFk/EVL6UzcSMGVtOT8zpFc8lIRNiIEK3ANj3Ak4aYL0byiC')
ON CONFLICT (username) DO NOTHING;
