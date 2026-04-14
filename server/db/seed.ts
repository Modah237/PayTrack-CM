import { db } from './index';
import bcrypt from 'bcryptjs';

async function seedAdmin() {
  try {
    console.log('Seeding admin user...');
    const email = 'modahleraffa@gmail.com';
    const password = 'Password123!';
    const passwordHash = await bcrypt.hash(password, 10);
    const name = 'Admin Modah';

    // Check if user exists
    const { rows: existing } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.length > 0) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    await db.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)',
      [email, passwordHash, name, 'admin']
    );

    console.log('Successfully created admin user!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
}

seedAdmin();
