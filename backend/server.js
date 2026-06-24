import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import customOrderRoutes from './routes/customOrderRoutes.js';

// Model imports (for auto-seeding)
import Product from './models/Product.js';
import Category from './models/Category.js';

// Load config
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to Database
connectDB().then(() => {
  seedDatabase();
});

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/custom-orders', customOrderRoutes);

// Error Handling
app.use(errorHandler);

// Database Seeder
async function seedDatabase() {
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('Seeding categories data...');
      await Category.insertMany([
        { name: "Crochet Flowers", img: "/assets/cat-flowers.jpg" },
        { name: "Plush Friends", img: "/assets/cat-plush.jpg" },
        { name: "Accessories", img: "/assets/cat-accessories.jpg" },
        { name: "Bags & Pouches", img: "/assets/cat-bags.jpg" },
        { name: "Home Decor", img: "/assets/cat-decor.jpg" },
        { name: "Gift Ideas", img: "/assets/cat-gifts.jpg" }
      ]);
      console.log('Categories seeded successfully!');
    }

    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('Seeding products data...');
      await Product.insertMany([
        {
          name: "Tulip Bouquet",
          price: 42,
          rating: 128,
          img: "/assets/prod-tulip.jpg",
          category: "Crochet Flowers"
        },
        {
          name: "Berry Bear",
          price: 32,
          rating: 96,
          img: "/assets/prod-bear.jpg",
          category: "Plush Friends"
        },
        {
          name: "Sunflower Pot",
          price: 28,
          rating: 74,
          img: "/assets/prod-sunflower.jpg",
          category: "Crochet Flowers"
        },
        {
          name: "Daisy Basket",
          price: 36,
          rating: 65,
          img: "/assets/prod-daisy.jpg",
          category: "Home Decor"
        },
        {
          name: "Strawberry Keychain",
          price: 16,
          rating: 47,
          img: "/assets/cat-accessories.jpg",
          category: "Accessories"
        }
      ]);
      console.log('Products seeded successfully!');
    }
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}

app.listen(PORT, () => {
  console.log(`Industry-level e-commerce server running on port ${PORT}`);
});
