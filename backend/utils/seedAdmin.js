import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('✅ Admin user already exists.');
      return;
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.log('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables. Skipping auto-creation.');
      return;
    }

    await User.create({
      name: 'Admin',
      email,
      passwordHash: password,
      role: 'admin',
    });

    console.log(`🚀 Default Admin Created: ${email}`);
    console.log(`🔑 Password: (as set in .env)`);
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
  }
};

export default seedAdmin;
