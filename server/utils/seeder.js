// Seeds the database with categories, sample products, and the first admin account.
// Run with: npm run seed
// Destroy all seeded data with: npm run seed:destroy

const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

dotenv.config();
connectDB();

const slugify = (str) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const categoryNames = ['Men', 'Women', 'T-Shirts', 'Shirts', 'Hoodies', 'Jeans', 'Dresses', 'Jackets', 'Accessories'];

const productData = [
  {
    name: 'Premium Oversized T-Shirt',
    description: 'A relaxed, boxy silhouette cut from heavyweight 100% combed cotton. Garment-dyed for a soft, lived-in feel.',
    subcategory: 'T-Shirts',
    brand: 'VELORA',
    price: 45,
    discountPrice: null,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'],
    colors: ['Black', 'White', 'Beige'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    sku: 'VEL-TS-001',
    stock: 45,
    gender: 'unisex',
    isFeatured: true,
    isNewArrival: true,
  },
  {
    name: 'Classic Cotton Shirt',
    description: 'A tailored, crisp button-down in premium long-staple cotton poplin. An everyday essential with a sharp collar.',
    subcategory: 'Shirts',
    brand: 'VELORA',
    price: 85,
    discountPrice: 68,
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
    colors: ['White', 'Light Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    sku: 'VEL-SH-002',
    stock: 30,
    gender: 'men',
    isFeatured: true,
    isOnSale: true,
  },
  {
    name: 'Relaxed Fit Hoodie',
    description: 'Heavyweight brushed-back fleece with a dropped shoulder and kangaroo pocket. Built for everyday comfort.',
    subcategory: 'Hoodies',
    brand: 'VELORA',
    price: 95,
    discountPrice: null,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
    colors: ['Charcoal', 'Off-White', 'Black'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sku: 'VEL-HD-003',
    stock: 8,
    gender: 'unisex',
    isNewArrival: true,
  },
  {
    name: 'Slim Fit Jeans',
    description: 'Stretch selvedge denim tapered through the leg for a clean, modern line. Finished with subtle whiskering.',
    subcategory: 'Jeans',
    brand: 'VELORA',
    price: 110,
    discountPrice: null,
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'],
    colors: ['Indigo', 'Black'],
    sizes: ['28', '30', '32', '34', '36'],
    sku: 'VEL-JN-004',
    stock: 22,
    gender: 'men',
  },
  {
    name: 'Premium Denim Jacket',
    description: 'Rigid Japanese denim with a boxy trucker silhouette and antique brass hardware. Ages beautifully over time.',
    subcategory: 'Jackets',
    brand: 'VELORA',
    price: 160,
    discountPrice: 128,
    images: ['https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800'],
    colors: ['Indigo'],
    sizes: ['S', 'M', 'L', 'XL'],
    sku: 'VEL-JK-005',
    stock: 0,
    gender: 'men',
    isOnSale: true,
  },
  {
    name: "Women's Oversized Blazer",
    description: 'Structured shoulders, a fluid drape, and a single-button close. Wear it open over everything.',
    subcategory: 'Jackets',
    brand: 'VELORA',
    price: 175,
    discountPrice: null,
    images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800'],
    colors: ['Black', 'Camel'],
    sizes: ['XS', 'S', 'M', 'L'],
    sku: 'VEL-BZ-006',
    stock: 15,
    gender: 'women',
    isFeatured: true,
  },
  {
    name: 'Casual Summer Dress',
    description: 'Lightweight viscose crepe cut into a flowing midi silhouette with adjustable straps.',
    subcategory: 'Dresses',
    brand: 'VELORA',
    price: 78,
    discountPrice: null,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'],
    colors: ['Sage', 'Terracotta', 'Black'],
    sizes: ['XS', 'S', 'M', 'L'],
    sku: 'VEL-DR-007',
    stock: 27,
    gender: 'women',
    isNewArrival: true,
  },
  {
    name: 'Knit Sweater',
    description: 'A ribbed crew-neck knit in a fine merino blend. Understated, warm, and endlessly wearable.',
    subcategory: 'Hoodies',
    brand: 'VELORA',
    price: 98,
    discountPrice: null,
    images: ['https://images.unsplash.com/photo-1614975059251-992f11792b9f?w=800'],
    colors: ['Cream', 'Grey', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL'],
    sku: 'VEL-SW-008',
    stock: 6,
    gender: 'unisex',
    isFeatured: true,
  },
];

const importData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();

    const createdCategories = await Category.insertMany(
      categoryNames.map((name) => ({ name, slug: slugify(name) }))
    );

    const catMap = {};
    createdCategories.forEach((c) => (catMap[c.name] = c._id));

    const products = productData.map((p) => ({
      ...p,
      category: catMap[p.subcategory] || catMap['Men'],
    }));

    await Product.insertMany(products);

    // Create the first admin account if it doesn't already exist
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@velora.com').toLowerCase();
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin User',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@12345',
        role: 'admin',
      });
      console.log(`Admin account created: ${adminEmail}`);
    } else {
      console.log('Admin account already exists, skipping creation.');
    }

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Data destroyed successfully! (User accounts were preserved)');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
