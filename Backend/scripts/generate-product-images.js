// Generate simple SVG product images locally based on product title/slug.
// Saves to Frontend/public/assets/<slug>.svg
// Usage: node scripts/generate-product-images.js

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', 'config', 'config.env') });
const connectDB = require('../config/db');
const Product = require('../models/Product');

function makeSVG(title) {
  const bg = '#21808d';
  const text = (title || 'Product').slice(0, 24);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="40" font-family="Arial" fill="#ffffff">${text}</text>
  <text x="50%" y="85%" dominant-baseline="middle" text-anchor="middle" font-size="16" font-family="Arial" fill="#e6f3f4">SingleSeller</text>
</svg>`;
}

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const products = await Product.find({}).select('slug title').lean();
    const assetsDir = path.join(__dirname, '..', '..', 'Frontend', 'public', 'assets');
    fs.mkdirSync(assetsDir, { recursive: true });
    let count = 0;
    for (const p of products) {
      if (!p.slug) continue;
      const svg = makeSVG(p.title || p.slug);
      const outPath = path.join(assetsDir, `${p.slug}.svg`);
      fs.writeFileSync(outPath, svg, 'utf8');
      count++;
    }
    console.log(`Generated ${count} product images at ${assetsDir}`);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error generating images:', err);
    process.exitCode = 1;
  }
})();
