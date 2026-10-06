// Usage: node utils/createAdmin.js "Admin Name" admin@example.com "StrongPass123"
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

const [, , name, email, password] = process.argv;

if (!name || !email || !password) {
  console.log('Usage: node utils/createAdmin.js "Admin Name" admin@example.com "StrongPass123"');
  process.exit(1);
}

const run = async () => {
  await connectDB();
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    existing.role = "admin";
    existing.password = password;
    await existing.save();
    console.log(`Existing user promoted to admin: ${email}`);
  } else {
    await User.create({ name, email, password, role: "admin" });
    console.log(`Admin created: ${email}`);
  }
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
