// Seed products from a hardcoded list of image URLs
// Usage: node scripts/seed-products-from-urls.js

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'config', 'config.env') });
const connectDB = require('../config/db');
const Product = require('../models/Product');
const mongoose = require('mongoose');

const urls = [
  // Existing batch
  "https://res.cloudinary.com/dwq5qifuk/image/upload/v1764503652/head-to-toe-baby-cleansing-milky-soft-wash-2_cnxabt.webp",
  "https://res.cloudinary.com/dwq5qifuk/image/upload/v1764503650/baby-wipes-2_w4blqy.webp",
  "https://res.cloudinary.com/dwq5qifuk/image/upload/v1764503647/mother-sparsh-baby-lotion-200ml-with-packaging_tefrhm.webp",
  "https://res.cloudinary.com/dwq5qifuk/image/upload/v1764503643/2-soothing-relief-for-irritation-discomfort-redness-because-of-mosquito-bites_a7xo3n.webp",
  "https://res.cloudinary.com/dwq5qifuk/image/upload/v1764503633/mother-sparsh-tummy-roll-on-ayurvedic-baby-colic-digestion2_fhc0z4.webp",
  // New batch
  "https://res.cloudinary.com/dwq5qifuk/image/upload/v1764504923/Plant-Powered-baby-cleanser-for-Clean-baby-bottle-Clean-baby-toys-pacifiers-500ml-2_cnaqxs.webp",
  "https://res.cloudinary.com/dwq5qifuk/image/upload/v1764504921/baby_wipes_40_pcs_2_ded40d81-6720-45fc-82aa-6f4b1e4d85c8_djmgux.webp",
  "https://res.cloudinary.com/dwq5qifuk/image/upload/v1764504918/2tear-free-baby-shampoo-natural-ingredients400ml_av4thc.webp"
];

function filenameFromUrl(u) {
  try { return new URL(u).pathname.split('/').pop(); } catch { return String(u).split('/').pop(); }
}

function baseName(file) {
  return file.replace(/\.(png|jpg|jpeg|webp|svg)$/i, '');
}

function titleFromBase(base) {
  return base
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').substring(0,80);
}

function brandFromTitle(title) {
  if (/mother\s*sparsh/i.test(title)) return 'Mother Sparsh';
  if (/baby/i.test(title)) return 'Baby Care';
  return 'Generic';
}

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    let created = 0, updated = 0, skipped = 0, repairedDuplicates = 0;
    for (const url of urls) {
      try {
        const file = filenameFromUrl(url);
        const base = baseName(file);
        const title = titleFromBase(base);
        const slug = slugify(base);
        const sku = `SKU-${slug}-${Math.floor(Math.random()*10000)}`;
        const price = Math.floor(199 + Math.random()*400); // 199 - 599
        const mrp = price + Math.floor(50 + Math.random()*200);
        const stock = Math.floor(10 + Math.random()*40);
        const shortDescription = `${title} — auto-created from provided image URL.`;
        const brand = brandFromTitle(title);

        // Attempt to locate existing by slug or title (covers prior inconsistent slug generation)
        const existing = await Product.findOne({ $or: [ { slug }, { title } ] });
        if (existing) {
          existing.thumbnail = url;
          existing.images = [url];
          if (!existing.brand) existing.brand = brand;
          await existing.save();
          updated++;
          console.log(`Updated product images: ${existing.title} (${existing.slug})`);
          continue;
        }

        await Product.create({
          title,
          slug,
          shortDescription,
          description: `${title} generated via seed script. Brand: ${brand}.`,
          price,
          mrp,
          brand,
          images: [url],
          thumbnail: url,
          stock,
          sku,
          status: 'active'
        });
        created++;
        console.log(`Created product: ${title} (${slug})`);
      } catch (itemErr) {
        // Handle duplicate slug race or prior existing product not matched above
        if (itemErr && itemErr.code === 11000 && itemErr.keyPattern && itemErr.keyPattern.slug) {
          const dupSlug = itemErr.keyValue && itemErr.keyValue.slug ? itemErr.keyValue.slug : null;
          if (dupSlug) {
            const dupExisting = await Product.findOne({ slug: dupSlug });
            if (dupExisting) {
              dupExisting.thumbnail = url;
              dupExisting.images = [url];
              await dupExisting.save();
              repairedDuplicates++;
              console.log(`Repaired duplicate: Updated existing product images (${dupSlug})`);
              continue;
            }
          }
          skipped++;
          console.warn(`Duplicate slug encountered and could not repair: ${dupSlug}`);
        } else {
          skipped++;
          console.warn(`Skipped URL due to error: ${url}\n`, itemErr.message || itemErr);
        }
      }
    }
    console.log(`Done. Created: ${created}, Updated: ${updated}, Repaired duplicates: ${repairedDuplicates}, Skipped: ${skipped}`);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Seed from URLs error:', err);
    process.exitCode = 1;
  }
})();
