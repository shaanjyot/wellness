// Script to generate correct password hash for admin user
// Run this with: node generate-admin-hash.js

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL Command:');
  console.log(`INSERT INTO admins (username, password) VALUES ('admin', '${hash}');`);
}

generateHash().catch(console.error);
