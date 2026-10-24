/**
 * seedProducts.js — Populate the database with sample electronics.
 * Usage: node scripts/seedProducts.js
 *
 * Safe to run multiple times — products are matched by SKU and skipped if they
 * already exist, so running this script again will not create duplicates or
 * overwrite existing inventory quantities.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Samsung Galaxy S24',
    sku: 'SMRT-SAMS-S24',
    brand: 'Samsung',
    category: 'Smartphones',
    description: '6.2-inch Dynamic AMOLED display, Snapdragon 8 Gen 3, 256 GB storage, 50 MP camera.',
    sellingPrice: 79999,
    costPrice: 65000,
    stockQuantity: 25,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
  },
  {
    name: 'Apple MacBook Air M2',
    sku: 'LAPT-APPL-MBA-M2',
    brand: 'Apple',
    category: 'Laptops',
    description: '13.6-inch Liquid Retina display, Apple M2 chip, 8 GB RAM, 256 GB SSD.',
    sellingPrice: 114900,
    costPrice: 95000,
    stockQuantity: 12,
    lowStockThreshold: 3,
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400',
  },
  {
    name: 'Keychron K2 Mechanical Keyboard',
    sku: 'KEYB-KEYC-K2',
    brand: 'Keychron',
    category: 'Keyboards',
    description: 'Tenkeyless layout, hot-swappable, RGB backlight, compatible with Mac and Windows.',
    sellingPrice: 6999,
    costPrice: 4500,
    stockQuantity: 30,
    lowStockThreshold: 8,
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400',
  },
  {
    name: 'Logitech MX Master 3S',
    sku: 'MICE-LOGI-MXM3',
    brand: 'Logitech',
    category: 'Mice',
    description: 'Ergonomic wireless mouse with MagSpeed scrolling, 8K DPI, USB-C charging.',
    sellingPrice: 9495,
    costPrice: 7000,
    stockQuantity: 20,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
  },
  {
    name: 'LG 27" 4K UHD Monitor',
    sku: 'MONT-LG-27UK850',
    brand: 'LG',
    category: 'Monitors',
    description: '27-inch IPS 4K monitor, HDR10, USB-C 60W PD, Thunderbolt 3 compatible.',
    sellingPrice: 32999,
    costPrice: 26000,
    stockQuantity: 8,
    lowStockThreshold: 3,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    sku: 'HEAD-SONY-XM5',
    brand: 'Sony',
    category: 'Headphones and Earphones',
    description: 'Industry-leading ANC, 30-hour battery, Speak-to-Chat, multipoint Bluetooth.',
    sellingPrice: 26990,
    costPrice: 20000,
    stockQuantity: 4,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  },
  {
    name: 'Anker 65W USB-C GaN Charger',
    sku: 'CHGR-ANKR-65W',
    brand: 'Anker',
    category: 'Chargers and Cables',
    description: 'Compact 65 W GaN charger with a single USB-C port and foldable plug.',
    sellingPrice: 2799,
    costPrice: 1800,
    stockQuantity: 50,
    lowStockThreshold: 10,
    imageUrl: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
  },
  {
    name: 'Samsung T7 1TB External SSD',
    sku: 'SSD-SAMS-T7-1TB',
    brand: 'Samsung',
    category: 'Computer Accessories',
    description: 'Portable NVMe SSD, up to 1050 MB/s read speed, USB 3.2 Gen 2, shock-resistant.',
    sellingPrice: 8499,
    costPrice: 6200,
    stockQuantity: 0,
    lowStockThreshold: 5,
    imageUrl: 'https://images.unsplash.com/photo-1583394293214-0b815e6f0f03?w=400',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  let created = 0;
  let skipped = 0;

  for (const data of sampleProducts) {
    const existing = await Product.findOne({ sku: data.sku });
    if (existing) {
      console.log(`Skipped (already exists): ${data.name} [${data.sku}]`);
      skipped++;
    } else {
      await Product.create(data);
      console.log(`Created: ${data.name} [${data.sku}]`);
      created++;
    }
  }

  console.log(`\nSeed complete — ${created} created, ${skipped} skipped.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

