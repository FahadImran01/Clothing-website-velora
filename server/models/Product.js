const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    description: { type: String, required: [true, 'Product description is required'] },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subcategory: { type: String, default: '' },
    brand: { type: String, default: 'VELORA' },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPrice: { type: Number, default: null, min: 0 },
    images: [{ type: String, required: true }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    sku: { type: String, required: true, unique: true, uppercase: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    gender: { type: String, enum: ['men', 'women', 'unisex'], required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.virtual('stockStatus').get(function () {
  if (this.stock === 0) return 'OUT OF STOCK';
  if (this.stock <= 10) return 'LOW STOCK';
  return 'IN STOCK';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ name: 'text', description: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
