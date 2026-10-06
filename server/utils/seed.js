require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Category = require("../models/Category");
const Product = require("../models/Product");
const User = require("../models/User");

const IMG = (seed) => `https://picsum.photos/seed/${seed}/800/1000`;

const categoriesData = [
  { name: "T-Shirts", slug: "t-shirts", parent: "men" },
  { name: "Shirts", slug: "shirts", parent: "men" },
  { name: "Hoodies", slug: "hoodies", parent: "men" },
  { name: "Jeans", slug: "jeans", parent: "men" },
  { name: "Jackets", slug: "jackets", parent: "men" },
  { name: "Dresses", slug: "dresses", parent: "women" },
  { name: "Blazers", slug: "blazers", parent: "women" },
  { name: "Knitwear", slug: "knitwear", parent: "women" },
  { name: "Accessories", slug: "accessories", parent: "accessories" },
];

const run = async () => {
  await connectDB();

  await Product.deleteMany();
  await Category.deleteMany();

  const categories = await Category.insertMany(categoriesData);
  const byName = (n) => categories.find((c) => c.name === n)._id;

  const products = [
    {
      name: "Premium Oversized T-Shirt",
      description: "A relaxed, boxy-fit tee cut from heavyweight combed cotton for a premium drape.",
      category: byName("T-Shirts"),
      subcategory: "Casual",
      price: 45,
      discountPrice: null,
      images: [IMG("velora-tshirt-1"), IMG("velora-tshirt-2")],
      colors: ["Black", "Off-White", "Beige"],
      sizes: ["S", "M", "L", "XL"],
      sku: "VEL-TS-001",
      stock: 40,
      gender: "men",
      featured: true,
      isNewArrival: true,
    },
    {
      name: "Classic Cotton Shirt",
      description: "Tailored classic shirt in breathable cotton poplin, perfect for smart-casual looks.",
      category: byName("Shirts"),
      price: 65,
      discountPrice: 52,
      images: [IMG("velora-shirt-1"), IMG("velora-shirt-2")],
      colors: ["White", "Dark Gray"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      sku: "VEL-SH-001",
      stock: 25,
      gender: "men",
      onSale: true,
    },
    {
      name: "Relaxed Fit Hoodie",
      description: "Heavyweight fleece hoodie with a dropped shoulder for an easy, relaxed silhouette.",
      category: byName("Hoodies"),
      price: 85,
      images: [IMG("velora-hoodie-1"), IMG("velora-hoodie-2")],
      colors: ["Black", "Dark Gray"],
      sizes: ["M", "L", "XL"],
      sku: "VEL-HD-001",
      stock: 8,
      gender: "men",
      featured: true,
    },
    {
      name: "Slim Fit Jeans",
      description: "Stretch denim jeans with a modern slim fit and a deep indigo wash.",
      category: byName("Jeans"),
      price: 75,
      images: [IMG("velora-jeans-1"), IMG("velora-jeans-2")],
      colors: ["Indigo", "Black"],
      sizes: ["30", "32", "34", "36"],
      sku: "VEL-JN-001",
      stock: 0,
      gender: "men",
    },
    {
      name: "Premium Denim Jacket",
      description: "A structured denim jacket with reinforced stitching and antique-brass hardware.",
      category: byName("Jackets"),
      price: 120,
      discountPrice: 96,
      images: [IMG("velora-jacket-1"), IMG("velora-jacket-2")],
      colors: ["Indigo"],
      sizes: ["S", "M", "L", "XL"],
      sku: "VEL-JK-001",
      stock: 15,
      gender: "men",
      onSale: true,
      isNewArrival: true,
    },
    {
      name: "Women's Oversized Blazer",
      description: "A tailored yet oversized blazer in soft-touch twill, designed to be worn open or belted.",
      category: byName("Blazers"),
      price: 140,
      images: [IMG("velora-blazer-1"), IMG("velora-blazer-2")],
      colors: ["Beige", "Black"],
      sizes: ["XS", "S", "M", "L"],
      sku: "VEL-BL-001",
      stock: 12,
      gender: "women",
      featured: true,
    },
    {
      name: "Casual Summer Dress",
      description: "A lightweight midi dress in fluid viscose, cut for effortless warm-weather wear.",
      category: byName("Dresses"),
      price: 68,
      images: [IMG("velora-dress-1"), IMG("velora-dress-2")],
      colors: ["Off-White", "Terracotta"],
      sizes: ["XS", "S", "M", "L"],
      sku: "VEL-DR-001",
      stock: 30,
      gender: "women",
      isNewArrival: true,
    },
    {
      name: "Knit Sweater",
      description: "A fine-gauge merino-blend sweater with ribbed cuffs and a relaxed crew neck.",
      category: byName("Knitwear"),
      price: 95,
      discountPrice: 76,
      images: [IMG("velora-sweater-1"), IMG("velora-sweater-2")],
      colors: ["Beige", "Dark Gray", "Black"],
      sizes: ["S", "M", "L"],
      sku: "VEL-KN-001",
      stock: 5,
      gender: "women",
      onSale: true,
    },
    {
      name: "Leather Belt",
      description: "Full-grain leather belt with a brushed-metal buckle.",
      category: byName("Accessories"),
      price: 40,
      images: [IMG("velora-belt-1")],
      colors: ["Black", "Brown"],
      sizes: ["S", "M", "L"],
      sku: "VEL-AC-001",
      stock: 50,
      gender: "unisex",
    },
    {
      name: "Wool Scarf",
      description: "Soft merino wool scarf woven in a subtle herringbone pattern.",
      category: byName("Accessories"),
      price: 35,
      images: [IMG("velora-scarf-1")],
      colors: ["Beige", "Charcoal"],
      sizes: ["One Size"],
      sku: "VEL-AC-002",
      stock: 20,
      gender: "unisex",
      isNewArrival: true,
    },
  ];

  await Product.insertMany(products);

  // ensure a default admin exists
  const adminEmail = "admin@velora.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "VELORA Admin",
      email: adminEmail,
      password: "Admin@123",
      role: "admin",
    });
    console.log(`Seeded default admin -> email: ${adminEmail} password: Admin@123`);
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
