// Seed products based on files in Frontend/public/assets
// Usage: node scripts/seed-products-from-assets.js
// Creates product entries if slug not already present.

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config', 'config.env') });
const connectDB = require('../config/db');
const Product = require('../models/Product');
const mongoose = require('mongoose');

function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const assetsDir = path.join(__dirname, '..', '..', 'Frontend', 'public', 'assets');
    const files = fs.readdirSync(assetsDir).filter(f => !f.startsWith('.') && !f.endsWith('.gitkeep'));
    let created = 0;
    for (const file of files) {
      const base = file.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');
      const slug = slugify(base);
      if (!slug) continue;
      const exists = await Product.findOne({ slug });
      if (exists) {
        continue;
      }
      const title = base
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      const price = Math.floor(100 + Math.random() * 900); // random price
      const stock = Math.floor(5 + Math.random() * 50);
      await Product.create({
        title,
        slug,
        price,
        stock,
        description: `${title} auto-generated from asset file ${file}.`,
        status: 'active'
      });
      created++;
      console.log(`Created product: ${title} (${slug})`);
    }
    console.log(`Seed complete. New products: ${created}`);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Seed error:', err);
    process.exitCode = 1;
  }
})();
