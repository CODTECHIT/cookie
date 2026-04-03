import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.log('⚠️  ADMIN_EMAIL or ADMIN_PASSWORD not set in environment variables. Skipping seed.');
      return;
    }

    let admin = await User.findOne({ role: 'admin' });

    if (admin) {
      // Admin exists, skip seeding to avoid Cold Start delays
      return;
    }

    await User.create({
      name: 'Admin',
      email,
      passwordHash: password,
      role: 'admin',
    });

    console.log(`🚀 Default Admin Created: ${email}`);
  } catch (err) {
    console.error('❌ Error seeding admin user:', err.message);
  }
};

export default seedAdmin;
