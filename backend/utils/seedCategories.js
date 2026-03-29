import Category from '../models/Category.js';

const defaultCategories = [
  { name: 'Cookies', slug: 'cookies', description: 'Handcrafted artisan cookies made with premium ingredients', sortOrder: 1 },
  { name: 'Millets', slug: 'millets', description: 'Nutrient-rich millet powders and millet-based products', sortOrder: 2 },
  { name: 'Gift Boxes', slug: 'gift-boxes', description: 'Curated gift boxes for every occasion', sortOrder: 3 },
  { name: 'Snacks', slug: 'snacks', description: 'Healthy traditional snacks and savories', sortOrder: 4 },
  { name: 'Combos', slug: 'combos', description: 'Value combo packs of our best sellers', sortOrder: 5 },
];

const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count > 0) {
      console.log('✅ Categories already exist.');
      return;
    }

    await Category.insertMany(defaultCategories);
    console.log(`🍪 Seeded ${defaultCategories.length} default categories.`);
  } catch (err) {
    console.error('❌ Error seeding categories:', err.message);
  }
};

export default seedCategories;
