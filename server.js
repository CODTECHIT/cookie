import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample Product Data
const products = [
  { 
    id: 1, 
    title: 'Premium Cashew Cookies', 
    price: 180, 
    originalPrice: 220, 
    discount: '15%', 
    rating: 5, 
    reviews: 42, 
    weight: 'Net Wt: 250g', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNOOte0gri4hSb20PlsiVumBV5D193JYtgl0YoIHhBtpROfLC7OKEfqs0c_0TfjG5a4pQ0J-kfcI0-PMugRX1i_Y5ZH4GpkHP4hKyCAfKTu_02ZzqempROu6shsT_9SPckBkCiRu5l8LwJOUItOFVXkLDz8ISmUk-Rvtv2aEnktoZS7R3JtYRYhJoOSolHUKqRkm4AQJuuxy0rLiB4pvUVEQ7h3hqW4zez4PB8XRZ-IWV_vFRHBWD8ZisBC0GE8wXhpMgbV48jCEI'
  },
  { 
    id: 2, 
    title: 'Ragi Millet Malt', 
    price: 320, 
    originalPrice: 350, 
    rating: 4.5, 
    reviews: 89, 
    weight: 'Net Wt: 500g', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkHlgrUlD6yLkKCBNKvUAXj4PwogG1x4hrozEj98jh5vHSluWowZGqjMUn5edLTqzXJjjb7SA_SMR-5siZQUgkE-21mjwqz22bppAGUPEQ8Qz7g-2SZpaFAiavWQUlxMi6M2WxOQ-fcKQurL-MEUrPWxMUDgvqsZL_CSAeaEbaPnplzh9lzgsRPRMq3b6WKqEWQ85J-axNm4BMONQC4wKzYAt0Css6eJBMVEdJ9LYxJqMONlJ22myfTCC7plg6WoSbV9ILYsZuz9g'
  }
];

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Daksha Food Artisan API is healthy' });
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
