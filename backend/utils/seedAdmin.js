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
      // Update existing admin to match .env
      admin.email = email;
      admin.passwordHash = password; // Trigger hashing in pre('save')
      await admin.save();
      console.log('✅ Admin credentials updated successfully.');
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
