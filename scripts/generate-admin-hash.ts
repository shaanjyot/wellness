import bcrypt from 'bcryptjs';

/**
 * Generate password hash for admin user
 * Usage: npx ts-node scripts/generate-admin-hash.ts [password]
 * Default password: admin123
 */

async function generateHash() {
  const password = process.argv[2] || 'admin123';

  try {
    const hash = await bcrypt.hash(password, 10);
    console.log('\n=== Password Hash Generator ===\n');
    console.log(`Password: ${password}`);
    console.log(`Hash: ${hash}`);
    console.log('\n=== SQL Command for Supabase ===\n');
    console.log(`UPDATE admins SET password = '${hash}' WHERE username = 'admin';`);
    console.log('\n=== INSERT Command (if user doesn\'t exist) ===\n');
    console.log(`INSERT INTO admins (username, password) VALUES ('admin', '${hash}');`);
    console.log('\n');
  } catch (error) {
    console.error('Error generating hash:', error);
    process.exit(1);
  }
}

generateHash();
